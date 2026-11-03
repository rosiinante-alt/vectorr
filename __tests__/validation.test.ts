import {
  isExportFormat,
  isValidEmail,
  isValidUuid,
  isSvgFilename,
  MAX_FILE_BYTES,
  sanitizeFilename,
  sniffSvg,
  validateExportFormat,
  validateUpload,
} from '@/lib/validation';

const UUID = '3f1c2a9e-8b7d-4c6f-9a1e-2d4b6c8e0f13';

describe('isValidEmail', () => {
  it.each(['a@b.co', 'first.last+tag@sub.domain.io'])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'plain', 'a@b', '@b.co', 'a b@c.co', 'a@b.c d'])('rejects %s', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });

  it('rejects overlong addresses', () => {
    expect(isValidEmail(`${'a'.repeat(250)}@b.co`)).toBe(false);
  });
});

describe('isValidUuid', () => {
  it('accepts a v4 uuid', () => {
    expect(isValidUuid(UUID)).toBe(true);
  });

  it('rejects malformed ids', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('')).toBe(false);
    expect(isValidUuid(null)).toBe(false);
  });
});

describe('isSvgFilename', () => {
  it('accepts .svg in any case', () => {
    expect(isSvgFilename('logo.svg')).toBe(true);
    expect(isSvgFilename('LOGO.SVG')).toBe(true);
  });

  it('rejects other extensions', () => {
    expect(isSvgFilename('logo.png')).toBe(false);
    expect(isSvgFilename('svg')).toBe(false);
  });
});

describe('sniffSvg', () => {
  it('detects a root svg element', () => {
    expect(sniffSvg('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe(true);
    expect(sniffSvg('<?xml version="1.0"?>\n<SVG viewBox="0 0 1 1"/>')).toBe(true);
  });

  it('rejects non-svg content', () => {
    expect(sniffSvg('just some text')).toBe(false);
    expect(sniffSvg('<html><body></body></html>')).toBe(false);
  });
});

describe('sanitizeFilename', () => {
  it('strips directory traversal', () => {
    expect(sanitizeFilename('../../etc/passwd.svg')).toBe('passwd.svg');
    expect(sanitizeFilename('C:\\Users\\me\\logo.svg')).toBe('logo.svg');
  });

  it('strips quotes and control characters', () => {
    expect(sanitizeFilename('bad"name\x00.svg')).toBe('badname.svg');
  });

  it('falls back when nothing usable remains', () => {
    expect(sanitizeFilename('   ')).toBe('file.svg');
  });

  it('truncates very long names', () => {
    expect(sanitizeFilename(`${'a'.repeat(400)}.svg`).length).toBe(255);
  });
});

describe('validateUpload', () => {
  const svg = (name: string, size = 10) => new File(['x'.repeat(size)], name, { type: 'image/svg+xml' });

  it('accepts a valid svg', () => {
    const result = validateUpload(svg('logo.svg'));
    expect(result.ok).toBe(true);
    expect(result.value?.filename).toBe('logo.svg');
  });

  it('rejects a missing file', () => {
    expect(validateUpload(null)).toEqual({ ok: false, error: 'No file provided' });
  });

  it('rejects a non-svg extension', () => {
    expect(validateUpload(svg('logo.txt'))).toEqual({ ok: false, error: 'Only SVG files allowed' });
  });

  it('rejects files over 10MB', () => {
    const big = new File([new ArrayBuffer(MAX_FILE_BYTES + 1)], 'big.svg');
    expect(validateUpload(big)).toEqual({ ok: false, error: 'File too large (max 10MB)' });
  });

  it('rejects empty files', () => {
    expect(validateUpload(svg('empty.svg', 0))).toEqual({ ok: false, error: 'File is empty' });
  });
});

describe('validateExportFormat', () => {
  it('defaults to svg when omitted', () => {
    expect(validateExportFormat(undefined)).toEqual({ ok: true, value: 'svg' });
  });

  it('rejects unknown formats', () => {
    expect(validateExportFormat('gif').ok).toBe(false);
  });

  it('accepts the raster and vector formats that are now implemented', () => {
    for (const format of ['png', 'pdf', 'dxf', 'eps', 'gcode', 'dst', 'pes', 'jef']) {
      expect(validateExportFormat(format)).toEqual({ ok: true, value: format });
    }
  });
});

describe('isExportFormat', () => {
  it('recognises the supported set', () => {
    expect(isExportFormat('png')).toBe(true);
    expect(isExportFormat('webp')).toBe(false);
  });
});
