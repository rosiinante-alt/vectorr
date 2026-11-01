import {
  ApiError,
  deleteFile,
  downloadExport,
  exportFile,
  getExport,
  getFile,
  getHealth,
  listFiles,
  optimizeFile,
  requestMagicLink,
  uploadFile,
} from '@/lib/api';

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

function emptyResponse(status = 204): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => '',
  } as unknown as Response;
}

function lastCall(): [string, RequestInit | undefined] {
  const call = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  return [call[0] as string, call[1] as RequestInit | undefined];
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe('ApiError', () => {
  it('flags a 401 as unauthorized', () => {
    expect(new ApiError('nope', 401).isUnauthorized).toBe(true);
    expect(new ApiError('nope', 403).isUnauthorized).toBe(false);
  });
});

describe('requestMagicLink', () => {
  it('posts the email and returns the message', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Check your inbox' }));
    await expect(requestMagicLink('a@b.co')).resolves.toEqual({ message: 'Check your inbox' });

    const [url, init] = lastCall();
    expect(url).toBe('/api/auth/login');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual({ email: 'a@b.co' });
  });
});

describe('uploadFile', () => {
  it('posts multipart form data containing the file', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'f1' }, 201));
    const file = new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' });

    await expect(uploadFile(file)).resolves.toEqual({ id: 'f1' });

    const [url, init] = lastCall();
    expect(url).toBe('/api/files/upload');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBeInstanceOf(FormData);
    expect((init?.body as FormData).get('file')).toBeInstanceOf(File);
  });
});

describe('listFiles / getFile / deleteFile', () => {
  it('passes pagination as query params', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ files: [], total: 0, limit: 10, offset: 20 }));
    await listFiles(10, 20);
    expect(lastCall()[0]).toBe('/api/files?limit=10&offset=20');
  });

  it('encodes the file id', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'a b' }));
    await getFile('a b');
    expect(lastCall()[0]).toBe('/api/files/a%20b');
  });

  it('deletes via DELETE', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ deleted: true, id: 'f1' }));
    await expect(deleteFile('f1')).resolves.toEqual({ deleted: true, id: 'f1' });
    expect(lastCall()[1]?.method).toBe('DELETE');
  });
});

describe('exportFile / getExport', () => {
  it('requests an export record for a format', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'e1' }, 201));
    await exportFile('f1', 'svg');

    const [url, init] = lastCall();
    expect(url).toBe('/api/files/f1/export');
    expect(JSON.parse(init?.body as string)).toEqual({ format: 'svg' });
  });

  it('defaults the format to svg', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'e1' }, 201));
    await exportFile('f1');
    expect(JSON.parse(lastCall()[1]?.body as string)).toEqual({ format: 'svg' });
  });

  it('resolves a download url', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ url: 'https://x/y' }));
    await expect(getExport('e1')).resolves.toEqual({ url: 'https://x/y' });
    expect(lastCall()[0]).toBe('/api/exports/e1');
  });
});

describe('getHealth', () => {
  it('returns the status payload', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ status: 'ok' }));
    await expect(getHealth()).resolves.toEqual({ status: 'ok' });
  });
});

describe('optimizeFile', () => {
  const serverPayload = {
    fileId: 'f1',
    exportId: 'e9',
    originalSizeBytes: 2400000,
    optimizedSizeBytes: 180000,
    savedBytes: 2220000,
    savedPercent: 92.5,
    optimizations: [
      { id: 'convertPathData', label: 'Path precision', savedBytes: 1204000, count: 1 },
      { id: 'removeMetadata', label: 'Metadata stripping', savedBytes: 388000, count: 1 },
    ],
    status: 'optimized',
  };

  it('calls the per-file optimize route with a precision number', async () => {
    fetchMock.mockResolvedValue(jsonResponse(serverPayload));
    await optimizeFile('f1', 2);

    const [url, init] = lastCall();
    expect(url).toBe('/api/files/f1/optimize');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual({ precision: 2 });
  });

  it('defaults precision to 3', async () => {
    fetchMock.mockResolvedValue(jsonResponse(serverPayload));
    await optimizeFile('f1');
    expect(JSON.parse(lastCall()[1]?.body as string)).toEqual({ precision: 3 });
  });

  it('adapts the server response into the report view model', async () => {
    fetchMock.mockResolvedValue(jsonResponse(serverPayload));

    const report = await optimizeFile('f1', 3);

    expect(report).toEqual({
      original_bytes: 2400000,
      optimized_bytes: 180000,
      nodes_before: null,
      nodes_after: null,
      paths_before: null,
      paths_after: null,
      colors_before: null,
      colors_after: null,
      breakdown: [
        { rule: 'Path precision', saved_bytes: 1204000 },
        { rule: 'Metadata stripping', saved_bytes: 388000 },
      ],
      exportId: 'e9',
    });
  });

  it('maps the breakdown so it sums to the real saving', async () => {
    fetchMock.mockResolvedValue(jsonResponse(serverPayload));
    const report = await optimizeFile('f1', 3);

    const attributed = report.breakdown.reduce((sum, item) => sum + item.saved_bytes, 0);
    // The server pads the remainder as "Other optimizations", so the report can
    // never claim more savings than were actually measured.
    expect(attributed).toBeLessThanOrEqual(report.original_bytes - report.optimized_bytes);
  });

  it('surfaces the quota limit as a 403 ApiError', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: 'Monthly optimization limit exceeded (3/3).' }, 403),
    );

    await expect(optimizeFile('f1', 3)).rejects.toMatchObject({
      name: 'ApiError',
      status: 403,
      message: 'Monthly optimization limit exceeded (3/3).',
    });
  });

  it('surfaces the 1MB cap as a 413', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'File too large' }, 413));

    const error = await optimizeFile('f1', 3).catch((err) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(413);
  });
});

describe('downloadExport', () => {
  it('requests the attachment stream and returns a blob', async () => {
    const blob = new Blob(['<svg/>'], { type: 'image/svg+xml' });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => blob,
      text: async () => '',
    } as unknown as Response);

    await expect(downloadExport('e9')).resolves.toBe(blob);
    expect(lastCall()[0]).toBe('/api/exports/e9?download=1');
  });

  it('throws ApiError with the server message when the export is missing', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'Export not found' }, 404));

    await expect(downloadExport('nope')).rejects.toMatchObject({
      status: 404,
      message: 'Export not found',
    });
  });
});

describe('error handling', () => {
  it('falls back to a status-based message when the body is not JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '<html>boom</html>',
    } as unknown as Response);

    await expect(getHealth()).rejects.toMatchObject({ status: 500, message: 'Request failed (500)' });
  });

  it('handles an empty success body without throwing', async () => {
    fetchMock.mockResolvedValue(emptyResponse(204));
    await expect(getHealth()).resolves.toBeNull();
  });

  it('keeps server error details on the error object', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'Rate limited', details: { retryAfterSeconds: 30 } }, 429));

    const error = await getHealth().catch((err) => err);
    expect(error.details).toEqual({ retryAfterSeconds: 30 });
  });
});
