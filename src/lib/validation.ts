import type { ExportFormat } from './types';

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const SUPPORTED_EXPORT_FORMATS: readonly ExportFormat[] = ['svg', 'png', 'pdf', 'dxf', 'eps', 'gcode', 'dst', 'pes', 'jef'];
export const MVP_EXPORT_FORMATS: readonly ExportFormat[] = SUPPORTED_EXPORT_FORMATS;
export const STORAGE_BUCKET = 'vector-files';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value);
}

export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

/**
 * Accepts only .svg by extension. Browsers report wildly inconsistent MIME
 * types for SVG (image/svg+xml, text/xml, application/octet-stream, empty), so
 * the extension is the reliable signal; `sniffSvg` validates the content.
 */
export function isSvgFilename(name: string): boolean {
  return /\.svg$/i.test(name.trim());
}

/**
 * A valid SVG must contain a root <svg> element. We deliberately do not parse
 * XML here — that happens at render time. This is a cheap sanity gate so that
 * a renamed .txt file cannot reach storage.
 */
export function sniffSvg(content: string): boolean {
  const head = content.slice(0, 4096);
  return /<svg[\s>]/i.test(head);
}

/** Strips directory components and control characters from an uploaded name. */
export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? 'file.svg';
  const cleaned = base.replace(/[\u0000-\u001f\u007f"]/g, '').trim();
  return cleaned.length > 0 ? cleaned.slice(0, 255) : 'file.svg';
}

export function isExportFormat(value: unknown): value is ExportFormat {
  return typeof value === 'string' && (SUPPORTED_EXPORT_FORMATS as readonly string[]).includes(value);
}

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export function validateUpload(file: File | null): ValidationResult<{ filename: string; size: number }> {
  if (!file) {
    return { ok: false, error: 'No file provided' };
  }
  if (!isSvgFilename(file.name)) {
    return { ok: false, error: 'Only SVG files allowed' };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'File too large (max 10MB)' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'File is empty' };
  }
  return { ok: true, value: { filename: sanitizeFilename(file.name), size: file.size } };
}

export function validateExportFormat(value: unknown): ValidationResult<ExportFormat> {
  const format = value ?? 'svg';
  if (!isExportFormat(format)) {
    return {
      ok: false,
      error: `Unsupported format. Allowed: ${SUPPORTED_EXPORT_FORMATS.join(', ')}`,
    };
  }
  return { ok: true, value: format };
}
