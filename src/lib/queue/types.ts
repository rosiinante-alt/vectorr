export interface VectorizeJobData {
  conversionId: string;
  userId: string;
  originalFileUrl: string;
  preprocessing?: {
    removeBg?: boolean;
    upscale?: '2x' | '4x';
    destination?: 'web' | 'cricut' | 'laser' | 'print';
  };
  outputFormat: 'svg' | 'dxf' | 'eps' | 'pdf' | 'gcode' | 'dst' | 'pes' | 'jef' | '3mf' | 'stl' | 'obj' | 'color-separation';
}

export interface BatchJobData {
  batchId: string;
  userId: string;
  files: Array<{
    fileId: string;
    url: string;
  }>;
  preprocessing?: Record<string, any>;
  /** Requested output format; defaults to svg in the worker. */
  outputFormat?: 'svg' | 'dxf' | 'eps' | 'pdf' | 'gcode' | 'dst' | 'pes' | 'jef' | '3mf' | 'stl' | 'obj' | 'color-separation';
}

export interface AIGenerateJobData {
  generationId: string;
  userId: string;
  type: 'style_transfer' | 'logo' | 'svg' | 'pattern';
  prompt?: string;
  preset?: string;
  inputFileUrl?: string;
}
