export type FileStatus = 'processing' | 'ready' | 'failed';
export type ExportFormat = 'svg' | 'png' | 'pdf' | 'dxf' | 'eps' | 'gcode' | 'dst' | 'pes' | 'jef' | '3mf' | 'stl' | 'obj' | 'color-separation';
export type AuditAction = 'upload' | 'export' | 'delete' | 'login';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface VectorFile {
  id: string;
  user_id: string;
  filename: string;
  original_size_bytes: number | null;
  optimized_size_bytes: number | null;
  file_path: string;
  status: FileStatus;
  metadata: FileMetadata;
  created_at: string;
  updated_at: string;
}

export interface FileMetadata {
  nodes?: number;
  paths?: number;
  colors?: string[];
  [key: string]: unknown;
}

export interface ExportRecord {
  id: string;
  file_id: string;
  format: ExportFormat;
  file_path: string;
  file_size_bytes: number | null;
  created_at: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
