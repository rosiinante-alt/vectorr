import {
  batchCreditCost,
  contentTypeFor,
  CREDITS_PER_BATCH_FILE,
  fileExtension,
  parseBatchOptions,
  progressPercent,
  toPersistedPreprocessing,
  validateBatchFileCount,
  validateBatchOptions,
} from '@/lib/batch/validation';

describe('batchCreditCost', () => {
  it('charges the single-conversion rate per file', () => {
    expect(CREDITS_PER_BATCH_FILE).toBe(0.2);
    expect(batchCreditCost(1)).toBe(0.2);
    expect(batchCreditCost(50)).toBe(10);
  });

  it('rounds to 2dp for numeric(6,2)', () => {
    expect(batchCreditCost(3)).toBe(0.6);
    expect(batchCreditCost(0)).toBe(0);
    expect(Number.isInteger(batchCreditCost(5) * 100)).toBe(true);
  });
});

describe('validateBatchOptions', () => {
  it('defaults to svg with no preprocessing', () => {
    expect(validateBatchOptions(undefined, undefined)).toEqual({
      ok: true,
      value: { preprocessing: {}, outputFormat: 'svg' },
    });
  });

  it('keeps recognised preprocessing keys only', () => {
    const result = validateBatchOptions(
      { removeBg: true, upscale: '4x', destination: 'cricut', junk: 1 },
      'dxf',
    );
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      preprocessing: { removeBg: true, upscale: '4x', destination: 'cricut' },
      outputFormat: 'dxf',
    });
  });

  it('accepts upscale: false as "no upscaling"', () => {
    expect(validateBatchOptions({ upscale: false }, 'svg').value?.preprocessing).toEqual({
      upscale: false,
    });
  });

  it('ignores invalid preprocessing values', () => {
    expect(
      validateBatchOptions({ removeBg: 'yes', upscale: '8x', destination: 'mars' }, 'svg').value,
    ).toEqual({ preprocessing: {}, outputFormat: 'svg' });
  });

  it('rejects unsupported output formats', () => {
    const result = validateBatchOptions({}, 'jpg');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Unsupported output format');
  });

  it('tolerates non-object preprocessing', () => {
    expect(validateBatchOptions('nope', 'svg').value?.preprocessing).toEqual({});
    expect(validateBatchOptions(null, 'svg').value?.preprocessing).toEqual({});
  });
});

describe('parseBatchOptions', () => {
  it('round-trips persisted options', () => {
    const options = { preprocessing: { removeBg: true, upscale: '2x' as const }, outputFormat: 'eps' as const };
    expect(parseBatchOptions(toPersistedPreprocessing(options))).toEqual(options);
  });

  it('falls back to svg when the format is missing or invalid', () => {
    expect(parseBatchOptions({ output_format: 'bogus' }).outputFormat).toBe('svg');
    expect(parseBatchOptions({}).outputFormat).toBe('svg');
    expect(parseBatchOptions(null).outputFormat).toBe('svg');
  });
});

describe('validateBatchFileCount', () => {
  it('accepts 1 through 50 files', () => {
    expect(validateBatchFileCount(1)).toBeNull();
    expect(validateBatchFileCount(50)).toBeNull();
  });

  it('rejects zero, negative and over-limit counts', () => {
    expect(validateBatchFileCount(0)).toContain('At least one file');
    expect(validateBatchFileCount(-1)).toContain('At least one file');
    expect(validateBatchFileCount(51)).toContain('Maximum 50 files');
  });

  it('rejects fractional counts', () => {
    expect(validateBatchFileCount(2.5)).toContain('At least one file');
  });
});

describe('contentTypeFor / fileExtension', () => {
  it('maps known formats', () => {
    expect(contentTypeFor('svg')).toBe('image/svg+xml');
    expect(contentTypeFor('pdf')).toBe('application/pdf');
    expect(contentTypeFor('lottie')).toBe('application/json');
    expect(contentTypeFor('dxf')).toBe('application/octet-stream');
  });

  it('uses .json for lottie and the format name otherwise', () => {
    expect(fileExtension('lottie')).toBe('json');
    expect(fileExtension('svg')).toBe('svg');
    expect(fileExtension('gcode')).toBe('gcode');
  });
});

describe('progressPercent', () => {
  it('counts both completed and failed files as done', () => {
    expect(progressPercent(5, 5, 10)).toBe(100);
    expect(progressPercent(0, 0, 10)).toBe(0);
    expect(progressPercent(1, 1, 4)).toBe(50);
  });

  it('never exceeds 100 or divides by zero', () => {
    expect(progressPercent(20, 20, 10)).toBe(100);
    expect(progressPercent(0, 0, 0)).toBe(0);
  });
});