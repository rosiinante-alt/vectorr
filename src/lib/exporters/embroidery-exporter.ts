import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

interface Stitch { dx: number; dy: number; command: 'stitch' | 'jump' | 'end' }

export class EmbroideryExporter extends BaseExporter {
  constructor(public format: 'dst' | 'pes' | 'jef' = 'dst') { super(); }
  async export(svgContent: string, options?: ExportOptions): Promise<Buffer> {
    const { width, height, minX, minY } = getDimensions(svgContent, options);
    if (![width, height, minX, minY].every(Number.isFinite) || width <= 0 || height <= 0) {
      throw new Error('Embroidery export requires finite, positive design dimensions');
    }
    const scale = 10;
    const stitches: Stitch[] = [];
    let current = { x: 0, y: 0 };
    for (const shape of extractShapes(svgContent, 1)) {
      if (!shape.points.length) continue;
      const mapped = shape.points.map(p => ({ x: Math.round((p.x-minX)*scale), y: Math.round((p.y-minY)*scale) }));
      const start = mapped[0];
      stitches.push(...this.move(current, start, 'jump'));
      current = start;
      const points = shape.closed ? [...mapped.slice(1), start] : mapped.slice(1);
      for (const point of points) {
        stitches.push(...this.move(current, point, 'stitch'));
        current = point;
      }
    }
    stitches.push({ dx: 0, dy: 0, command: 'end' });
    // A design with no drawable shapes yields no stitches before the end
    // marker; machines reject such a file, so fail loudly instead.
    const hasStitches = stitches.some((stitch) => stitch.command !== 'end');
    if (!hasStitches) throw new Error('Embroidery export found no shapes in the SVG');
    if (this.format === 'dst') return this.encodeDst(stitches, width, height);
    if (this.format === 'jef') return this.encodeJef(stitches, width, height);
    return this.encodePes(stitches, width, height);
  }

  private move(from: {x:number;y:number}, to: {x:number;y:number}, command: 'stitch'|'jump'): Stitch[] {
    const result: Stitch[] = [];
    let x = to.x-from.x, y = to.y-from.y;
    if (x === 0 && y === 0) return result;
    while (Math.abs(x) > 121 || Math.abs(y) > 121) {
      const dx = Math.max(-121, Math.min(121, x)), dy = Math.max(-121, Math.min(121, y));
      result.push({ dx, dy, command }); x -= dx; y -= dy;
    }
    if (x || y) result.push({ dx:x, dy:y, command });
    return result;
  }

  private encodeDst(stitches: Stitch[], width: number, height: number): Buffer {
    const header = Buffer.alloc(512, 0x20);
    const text = `LA:VECTORR EXPORT\rST:${String(stitches.length).padStart(7,' ')}\rCO: 1\r+X:${String(Math.round(width*10)).padStart(5,' ')}\r-X:    0\r+Y:${String(Math.round(height*10)).padStart(5,' ')}\r-Y:    0\rAX:     0\rAY:     0\rMX:     0\rMY:     0\rPD:******\r`;
    header.write(text, 0, 'ascii'); header[header.length-1]=0x1a;
    const records: number[]=[];
    for(const stitch of stitches){let b0=0,b1=0,b2=0;
      if(stitch.command==='end'){records.push(0,0,0xf3);continue;}
      const encodeAxis=(delta:number, positive:Array<[number,number]>, negative:Array<[number,number]>)=>{
        let remaining=delta;
        for(let index=4;index>=0;index--){
          const digit=Math.max(-1,Math.min(1,Math.trunc(remaining/[1,3,9,27,81][index])));
          remaining-=digit*[1,3,9,27,81][index];
          if(digit){
            const masks=(digit>0?positive:negative)[index];
            b0|=masks[0]; b1|=masks[1];
          }
        }
      };
      encodeAxis(stitch.dx,[[1,0],[4,0],[0x10,0],[0,1],[0,4]],[[2,0],[8,0],[0x20,0],[0,2],[0,8]]);
      encodeAxis(stitch.dy,[[0,0x80],[0,0x20],[0,8],[0,2],[0,0x80]],[[0,0x40],[0,0x10],[0,4],[0,1],[0,0x40]]);
      b2=stitch.command==='jump'?0x83:0x03;
      records.push(b0,b1,b2);
    }
    return Buffer.concat([header,Buffer.from(records)]);
  }

  private encodeJef(stitches: Stitch[], width: number, height: number): Buffer {
    const records: number[] = [];
    for (const stitch of stitches) {
      if (stitch.command === 'end') break;
      let x = stitch.dx, y = -stitch.dy;
      while (x !== 0 || y !== 0) {
        const dx = Math.max(-127, Math.min(127, x));
        const dy = Math.max(-127, Math.min(127, y));
        if (stitch.command === 'jump') records.push(0x80, 0x02);
        records.push(dx & 0xff, dy & 0xff);
        x -= dx; y -= dy;
      }
    }
    records.push(0x80, 0x10);
    const designWidth = Math.round(width * 10), designHeight = Math.round(height * 10);
    if (designWidth > 2000 || designHeight > 2000) throw new Error('JEF design exceeds the supported 200 mm hoop size');
    const colorCount = 1;
    const headerSize = 0x74 + colorCount * 8;
    const header = Buffer.alloc(headerSize);
    let offset = 0;
    header.writeUInt32LE(headerSize, offset); offset += 4;
    header.writeUInt32LE(0x14, offset); offset += 4;
    header.write('20260101000000', offset, 14, 'ascii'); offset += 14;
    header.writeUInt32LE(colorCount, offset); offset += 4;
    header.writeUInt32LE(records.length / 2, offset); offset += 4;
    const hoop = designWidth < 1260 && designHeight < 1100 ? 3 : designWidth < 1400 && designHeight < 2000 ? 2 : 4;
    header.writeUInt32LE(hoop, offset); offset += 4;
    const halfW = Math.round(designWidth / 2), halfH = Math.round(designHeight / 2);
    for (const value of [halfW, halfH, halfW, halfH]) { header.writeInt32LE(value, offset); offset += 4; }
    for (const [hw, hh] of [[550, 550], [250, 250], [700, 1000], [700, 1000]]) {
      const fits = hw * 2 >= designWidth && hh * 2 >= designHeight;
      for (const value of fits ? [hw-halfW, hh-halfH, hw-halfW, hh-halfH] : [-1,-1,-1,-1]) {
        header.writeInt32LE(value, offset); offset += 4;
      }
    }
    header.writeUInt32LE(0, offset); offset += 4; // JEF thread palette index
    header.writeUInt32LE(14, offset); // Default thread color count
    return Buffer.concat([header, Buffer.from(records)]);
  }

  // PES v1 uses an embedded PEC block. The compact block carries one color and
  // no preview bitmap; common embroidery readers accept the zero-filled icons.
  private encodePes(stitches: Stitch[], width: number, height: number): Buffer {
    const pecRecords: number[] = [];
    const writeValue = (value: number, flag = 0) => {
      if (value >= -64 && value <= 62 && flag === 0) { pecRecords.push(value & 0x7f); return; }
      if (value < -2048 || value > 2047) throw new Error('PES stitch delta exceeds the supported 2047-unit limit');
      const encoded = (value & 0x0fff) | 0x8000 | (flag << 8);
      pecRecords.push((encoded >> 8) & 0xff, encoded & 0xff);
    };
    for (const stitch of stitches) {
      if (stitch.command === 'end') { pecRecords.push(0xff); break; }
      let x = stitch.dx, y = -stitch.dy;
      while (x !== 0 || y !== 0) {
        const dx = Math.max(-2047, Math.min(2047, x));
        const dy = Math.max(-2047, Math.min(2047, y));
        if (stitch.command === 'jump') { writeValue(dx, 0x10); writeValue(dy, 0x10); }
        else { writeValue(dx); writeValue(dy); }
        x -= dx; y -= dy;
      }
    }
    const pecHeader = Buffer.alloc(512, 0x20);
    pecHeader.write('LA:VECTORR       \r', 0, 'ascii');
    pecHeader.fill(0x20, 26, 38);
    pecHeader.writeUInt8(0xff, 38); pecHeader.writeUInt8(0, 39);
    pecHeader.writeUInt8(6, 40); pecHeader.writeUInt8(38, 41);
    pecHeader.writeUInt8(0, 42);
    pecHeader.fill(0x20, 43, 64);
    pecHeader.writeUInt8(0, 64);
    pecHeader.fill(0x20, 65, 512);
    const blockHead = Buffer.alloc(14);
    blockHead.writeUInt16LE(0, 0);
    const blockLength = blockHead.length + pecRecords.length;
    blockHead.writeUIntLE(blockLength, 2, 3);
    blockHead[5] = 0x31; blockHead[6] = 0xff; blockHead[7] = 0xf0;
    blockHead.writeUInt16LE(Math.min(0xffff, Math.round(width * 10)), 8);
    blockHead.writeUInt16LE(Math.min(0xffff, Math.round(height * 10)), 10);
    blockHead.writeUInt16LE(0x1b0, 12);
    const pecBlock = Buffer.concat([pecHeader, blockHead, Buffer.from(pecRecords), Buffer.alloc(228)]);
    const pesHeader = Buffer.alloc(18);
    pesHeader.write('#PES0001', 0, 'ascii');
    pesHeader.writeUInt32LE(28, 8);
    pesHeader.writeUInt16LE(1, 12);
    pesHeader.writeUInt16LE(1, 14);
    pesHeader.writeUInt16LE(0, 16);
    return Buffer.concat([pesHeader, Buffer.from([0xff, 0xff, 0, 0, 0, 0, 0, 0, 0, 0]), pecBlock]);
  }
}
