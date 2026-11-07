'use client';

import { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DragDropUploadProps {
  className?: string;
}

export function DragDropUpload({ className = '' }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['PNG', 'JPG', 'SVG', 'GIF', 'WebP'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    if (!supportedFormats.includes(ext) || file.size > maxFileSize) {
      setHasError(true);
      return false;
    }
    setHasError(false);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        handleFileUpload();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        handleFileUpload();
      }
    }
  };

  const handleFileUpload = () => {
    // Send the user to the real conversion flow to pick the file there.
    window.location.href = '/convert';
  };

  const handleClickUpload = () => {
    setHasError(false);
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:bg-muted/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={supportedFormats.map((f) => `.${f.toLowerCase()}`).join(',')}
          className="hidden"
        />

        {!hasError && (
          <>
            <Upload className="mx-auto h-10 w-10 mb-4 text-text-secondary" />
            <h3 className="text-lg font-semibold mb-2">Try with your own image</h3>
            <p className="text-text-secondary text-sm mb-4">
              Drag and drop your image here, or click to browse
            </p>

            <button
              onClick={handleClickUpload}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Choose Image
            </button>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-text-tertiary mb-3">Supported formats:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {supportedFormats.map((format) => (
                  <Badge key={format} tone="neutral">
                    {format}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-text-tertiary mt-3">Max file size: 50 MB</p>
            </div>
          </>
        )}

        {hasError && (
          <div className="py-4">
            <AlertCircle className="mx-auto h-10 w-10 mb-4 text-red-600" />
            <p className="font-semibold text-text-primary mb-2">Unsupported file</p>
            <p className="text-sm text-text-tertiary mb-4">
              Please check the file format and size, then try again.
            </p>
            <button
              onClick={handleClickUpload}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
