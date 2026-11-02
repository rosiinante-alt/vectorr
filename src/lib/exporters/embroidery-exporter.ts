import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

interface Stitch { dx: number; dy: number; command: 'stitch' | 'jump' | 'end' }

export class EmbroideryExporter extends BaseExporter {
  constructor(public format: 'dst' | 'pes' | 'jef' = 'dst') { super(); }
  async export(svgContent: string, options?: ExportOptions): Promise<Buffer> {
    if (this.format !== 'dst') throw new Error(`${this.format.toUpperCase()} embroidery export is not supported yet`);
    const { width, height, minX, minY } = getDimensions(svgContent, options);
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
    return this.encodeDst(stitches, width, height);
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
}
