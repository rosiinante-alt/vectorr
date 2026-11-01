/**
 * Typed client for the Vectorr API.
 *
 * Every call is same-origin (Next.js route handlers), so there is no base URL to
 * configure. Responses are narrowed here rather than in components, and the one
 * endpoint that is still being built by the backend agent is isolated in
 * `optimizeFile` below so nothing else depends on its exact shape.
 */

import type { ExportFormat, FileMetadata, VectorFile } from "@/lib/types";

export type { ExportFormat, FileMetadata, VectorFile };

export interface ApiErrorShape {
  error: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /** True when the request failed only because there is no session. */
  get isUnauthorized() {
    return this.status === 401;
  }
}

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let body: unknown = null;
  if (text.trim()) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const shape = body as ApiErrorShape | null;
    throw new ApiError(
      shape?.error ?? `Request failed (${response.status})`,
      response.status,
      shape?.details,
    );
  }

  return body as T;
}

export interface FileWithPreview extends VectorFile {
  preview_url?: string | null;
}

export interface FileListResponse {
  files: VectorFile[];
  total: number;
  limit: number;
  offset: number;
}

/** POST /api/auth/login — sends a Supabase magic link. */
export async function requestMagicLink(email: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parse<{ message: string }>(response);
}

/** POST /api/files/upload — multipart upload; requires a session. */
export async function uploadFile(file: File): Promise<VectorFile> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/files/upload", { method: "POST", body });
  return parse<VectorFile>(response);
}

/** GET /api/files — the signed-in user's files, newest first. */
export async function listFiles(limit = 50, offset = 0): Promise<FileListResponse> {
  const response = await fetch(`/api/files?limit=${limit}&offset=${offset}`);
  return parse<FileListResponse>(response);
}

/** GET /api/files/:id — the record plus a short-lived signed preview URL. */
export async function getFile(id: string): Promise<FileWithPreview> {
  const response = await fetch(`/api/files/${encodeURIComponent(id)}`);
  return parse<FileWithPreview>(response);
}

/** DELETE /api/files/:id */
export async function deleteFile(id: string): Promise<{ deleted: true; id: string }> {
  const response = await fetch(`/api/files/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return parse<{ deleted: true; id: string }>(response);
}

export interface ExportRecord {
  id: string;
  file_id: string;
  format: ExportFormat;
  file_path: string;
  file_size_bytes: number | null;
  created_at: string;
}

/** POST /api/files/:id/export — creates an export record for a stored file. */
export async function exportFile(
  fileId: string,
  format: ExportFormat = "svg",
): Promise<ExportRecord> {
  const response = await fetch(
    `/api/files/${encodeURIComponent(fileId)}/export`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format }),
    },
  );
  return parse<ExportRecord>(response);
}

/** GET /api/exports/:id — resolves a signed download URL for an export. */
export async function getExport(id: string): Promise<{ url: string | null }> {
  const response = await fetch(`/api/exports/${encodeURIComponent(id)}`);
  return parse<{ url: string | null }>(response);
}

/** GET /api/health */
export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch("/api/health");
  return parse<{ status: string }>(response);
}

/* ---------------------------------------------------------------------------
 * Optimization
 *
 * The backend agent is adding the optimization endpoint in this same tree. The
 * route it lands on is not settled yet, so the path is confined to this one
 * constant: when the route ships, point OPTIMIZE_PATH at it and the savings
 * report picks it up everywhere.
 *
 * Until then `isOptimizeAvailable()` reports false and the UI shows the
 * signed-out estimate instead of pretending an optimization ran.
 * ------------------------------------------------------------------------ */

const OPTIMIZE_PATH = "/api/files/optimize";

export interface OptimizationReport {
  original_bytes: number;
  optimized_bytes: number;
  nodes_before: number | null;
  nodes_after: number | null;
  paths_before: number | null;
  paths_after: number | null;
  colors_before: number | null;
  colors_after: number | null;
  /** Per-rule savings, e.g. { "path precision": 412000 }. */
  breakdown: Array<{ rule: string; saved_bytes: number }>;
  optimized_svg: string;
  /** Server-side preset, mirrored from the destination selector. */
  preset: string;
}

export function isOptimizeAvailable(): boolean {
  return process.env.NEXT_PUBLIC_OPTIMIZE_ENABLED === "true";
}

/**
 * POST /api/files/optimize
 *
 * Throws ApiError(404) while the route is unbuilt, which callers surface as an
 * "optimization is not available yet" message rather than an error.
 */
export async function optimizeFile(
  fileId: string,
  preset: string,
): Promise<OptimizationReport> {
  const response = await fetch(OPTIMIZE_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, preset }),
  });
  return parse<OptimizationReport>(response);
}
