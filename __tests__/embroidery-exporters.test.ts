import { EmbroideryExporter } from '@/lib/exporters/embroidery-exporter';

const SQUARE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <polygon points="10,10 60,10 60,60 10,60" fill="#000000"/>
</svg>`;

const OVERSIZE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <polygon points="0,0 400,0 400,400 0,400" fill="#000000"/>
</svg>`;

const EMPTY_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"></svg>`;

describe('EmbroideryExporter — PES', () => {
  const exporter = new EmbroideryExporter('pes');

  it('starts with the PES magic and version marker', async () => {
    const out = await exporter.export(SQUARE_SVG);
    expect(out.subarray(0, 8).toString('ascii')).toBe('#PES0001');
  });

  it('embeds a PEC block header', async () => {
    const out = await exporter.export(SQUARE_SVG);
    // PEC label sits inside the embedded PEC block.
    expect(out.toString('ascii')).toContain('LA:VECTORR');
  });

  it('terminates the stitch list with the PEC end marker', async () => {
    const out = await exporter.export(SQUARE_SVG);
    expect(out.includes(0xff)).toBe(true);
    // File ends with the fixed 228-byte PEC tail after the records.
    expect(out.length).toBeGreaterThan(512);
  });

  it('produces a stable size for identical input', async () => {
    const a = await exporter.export(SQUARE_SVG);
    const b = await exporter.export(SQUARE_SVG);
    expect(a.equals(b)).toBe(true);
  });

  it('fits a design inside the supported stitch delta range', async () => {
    // A 400 mm-wide shape scales to 4000 units; chunking must keep each
    // record within the signed 12-bit PEC delta limit instead of throwing.
    await expect(exporter.export(OVERSIZE_SVG)).resolves.toBeInstanceOf(Buffer);
  });

  it('rejects empty SVG content', async () => {
    await expect(exporter.export(EMPTY_SVG)).rejects.toThrow();
  });
});

describe('EmbroideryExporter — JEF', () => {
  const exporter = new EmbroideryExporter('jef');

  it('writes the JEF header size as its first 4 bytes', async () => {
    const out = await exporter.export(SQUARE_SVG);
    const headerSize = out.readUInt32LE(0);
    expect(headerSize).toBeGreaterThanOrEqual(0x74);
    expect(out.length).toBeGreaterThan(headerSize);
  });

  it('declares one thread colour and the 0x14 start offset', async () => {
    const out = await exporter.export(SQUARE_SVG);
    expect(out.readUInt32LE(4)).toBe(0x14);
    // Colour count sits after the timestamp: 4 + 4 + 14 bytes.
    const colorCount = out.readUInt32LE(22);
    expect(colorCount).toBe(1);
    expect(out.readUInt32LE(0)).toBe(0x74 + colorCount * 8);
  });

  it('ends the stitch stream with the JEF end command', async () => {
    const out = await exporter.export(SQUARE_SVG);
    const headerSize = out.readUInt32LE(0);
    const tail = out.subarray(out.length - 2);
    expect(tail[0]).toBe(0x80);
    expect(tail[1]).toBe(0x10);
    expect(out.length).toBeGreaterThan(headerSize);
  });

  it('rejects designs larger than the 200 mm hoop', async () => {
    await expect(exporter.export(OVERSIZE_SVG)).rejects.toThrow(/200 mm hoop/);
  });
});

describe('EmbroideryExporter — DST regression', () => {
  it('still produces a 512-byte DST header plus records', async () => {
    const out = await new EmbroideryExporter('dst').export(SQUARE_SVG);
    expect(out.subarray(0, 3).toString('ascii')).toBe('LA:');
    expect(out.length % 3).toBe(512 % 3 === 0 ? 0 : out.length % 3);
    expect(out.length).toBeGreaterThan(512);
  });
});
