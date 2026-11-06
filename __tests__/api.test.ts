import { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createFakeSupabase, type FakeSupabase, type TestUser } from './helpers/supabase-fake';
import { resetRateLimits } from '@/lib/rate-limit';

/**
 * Auth is swapped per test: `mockAuth` is read by the jest.mock factory below,
 * so a test can sign a user in (or out) before calling a handler.
 */
const mockAuth = {
  user: null as TestUser | null,
  client: null as SupabaseClient | null,
  error: null as string | null,
};

jest.mock('@/lib/supabase/server', () => {
  const actual = jest.requireActual('@/lib/supabase/server');
  return {
    ...actual,
    authenticate: async () =>
      mockAuth.user && mockAuth.client
        ? { user: mockAuth.user, supabase: mockAuth.client, error: null }
        : { user: null, supabase: null, error: mockAuth.error ?? 'Unauthorized' },
  };
});

import { POST as loginHandler } from '@/app/api/auth/login/route';
import { GET as callbackHandler } from '@/app/api/auth/callback/route';
import { GET as healthHandler } from '@/app/api/health/route';
import { GET as listHandler } from '@/app/api/files/route';
import { POST as uploadHandler } from '@/app/api/files/upload/route';
import { GET as getFileHandler, DELETE as deleteFileHandler } from '@/app/api/files/[id]/route';
import { POST as fileExportHandler } from '@/app/api/files/[id]/export/route';
import { POST as exportHandler } from '@/app/api/export/route';
import { GET as downloadExportHandler } from '@/app/api/exports/[id]/route';
import { POST as optimizeHandler } from '@/app/api/files/[id]/optimize/route';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_USER_ID = '22222222-2222-4222-8222-222222222222';
const FILE_ID = '33333333-3333-4333-8333-333333333333';
const EXPORT_ID = '44444444-4444-4444-8444-444444444444';

const SIGNED_IN: TestUser = { id: USER_ID, email: 'artist@example.com' };

let fake: FakeSupabase;

function signIn(user: TestUser | null = SIGNED_IN) {
  fake = createFakeSupabase(user);
  mockAuth.user = user;
  mockAuth.client = user ? fake.client : null;
}

beforeEach(() => {
  resetRateLimits();
  signIn();
});

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';

function uploadRequest(file: File | null, headers: Record<string, string> = {}) {
  const formData = new FormData();
  if (file) formData.append('file', file);
  return new NextRequest('http://localhost:3000/api/files/upload', {
    method: 'POST',
    body: formData,
    headers,
  });
}

function jsonRequest(url: string, body?: unknown, method = 'POST') {
  return new NextRequest(url, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
  });
}

function svgFile(name = 'logo.svg', content = SVG) {
  return new File([content], name, { type: 'image/svg+xml' });
}

function seedFile(overrides: Record<string, unknown> = {}) {
  const row = {
    id: FILE_ID,
    user_id: USER_ID,
    filename: 'logo.svg',
    original_size_bytes: SVG.length,
    optimized_size_bytes: null,
    file_path: `${USER_ID}/123-logo.svg`,
    status: 'ready',
    metadata: {},
    created_at: '2026-11-01T00:00:00.000Z',
    updated_at: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
  fake.tables.files.push(row);
  return row;
}

function seedConversion(overrides: Record<string, unknown> = {}) {
  const row = {
    id: FILE_ID,
    user_id: USER_ID,
    original_file_url: `https://example.test/${USER_ID}/123-logo.png`,
    converted_file_url: 'https://example.test/out/logo.svg',
    original_format: 'png',
    output_format: 'svg',
    status: 'complete',
    credits_used: 0.2,
    error_message: null,
    created_at: '2026-11-01T00:00:00.000Z',
    completed_at: '2026-11-01T00:00:05.000Z',
    ...overrides,
  };
  fake.tables.conversions.push(row);
  return row;
}

function seedExport(overrides: Record<string, unknown> = {}) {
  const row = {
    id: EXPORT_ID,
    file_id: FILE_ID,
    format: 'svg',
    file_path: `${USER_ID}/123-logo.svg`,
    file_size_bytes: SVG.length,
    created_at: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
  fake.tables.exports.push(row);
  return row;
}

// ---------------------------------------------------------------------------
// health
// ---------------------------------------------------------------------------
describe('GET /api/health', () => {
  it('reports ok', async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe('ok');
  });
});

// ---------------------------------------------------------------------------
// auth
// ---------------------------------------------------------------------------
describe('POST /api/auth/login', () => {
  /**
   * The login route imports `createSupabaseServerClient` from the same module
   * we already jest.mock, so the spy must live on the mock's export rather than
   * on the real module.
   */
  const serverModule = jest.requireMock<typeof import('@/lib/supabase/server')>('@/lib/supabase/server');

  function mockSupabaseAuth(behaviour: 'ok' | 'error' | 'throw') {
    const actual = jest.requireActual('@/lib/supabase/server');
    const spy = jest.spyOn(serverModule, 'createSupabaseServerClient').mockImplementation(async () => {
      if (behaviour === 'throw') throw new actual.ConfigurationError('Missing required environment variable: X');
      return {
        auth: {
          signInWithOtp: async () => ({
            error: behaviour === 'error' ? { message: 'rate limited by provider' } : null,
          }),
        },
      } as unknown as SupabaseClient;
    });
    return spy;
  }

  afterEach(() => jest.restoreAllMocks());

  it('rejects an invalid email with 400', async () => {
    const res = await loginHandler(jsonRequest('http://localhost:3000/api/auth/login', { email: 'nope' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid email');
  });

  it('rejects a missing body', async () => {
    const res = await loginHandler(jsonRequest('http://localhost:3000/api/auth/login'));
    expect(res.status).toBe(400);
  });

  it('sends a magic link for a valid email', async () => {
    mockSupabaseAuth('ok');
    const res = await loginHandler(
      jsonRequest('http://localhost:3000/api/auth/login', { email: 'artist@example.com' }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toMatch(/check your email/i);
  });

  it('surfaces a provider error as 400', async () => {
    mockSupabaseAuth('error');
    const res = await loginHandler(
      jsonRequest('http://localhost:3000/api/auth/login', { email: 'artist@example.com' }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('rate limited by provider');
  });

  it('returns 500 when Supabase is not configured', async () => {
    mockSupabaseAuth('throw');
    const res = await loginHandler(
      jsonRequest('http://localhost:3000/api/auth/login', { email: 'artist@example.com' }),
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/environment variable/);
  });

  it('rate limits after 5 attempts per minute', async () => {
    mockSupabaseAuth('ok');
    const req = () =>
      jsonRequest('http://localhost:3000/api/auth/login', { email: 'artist@example.com' }, 'POST');

    for (let i = 0; i < 5; i += 1) {
      const res = await loginHandler(req());
      expect(res.status).toBe(200);
    }
    const limited = await loginHandler(req());
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// auth callback
// ---------------------------------------------------------------------------
describe('GET /api/auth/callback', () => {
  const serverModule = jest.requireMock<typeof import('@/lib/supabase/server')>('@/lib/supabase/server');

  function mockExchange(result: 'ok' | 'error') {
    return jest.spyOn(serverModule, 'createSupabaseRouteClient').mockImplementation((_read, write) => {
      if (result === 'ok') {
        write([{ name: 'sb-access-token', value: 'token-value', options: { path: '/' } }]);
      }
      return {
        auth: {
          exchangeCodeForSession: async () => ({
            error: result === 'error' ? { message: 'invalid code' } : null,
          }),
        },
      } as unknown as SupabaseClient;
    });
  }

  afterEach(() => jest.restoreAllMocks());

  it('redirects to /login when the code is missing', async () => {
    const res = await callbackHandler(new NextRequest('http://localhost:3000/api/auth/callback'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login?error=missing_code');
  });

  it('redirects to /login when the exchange fails', async () => {
    mockExchange('error');
    const res = await callbackHandler(
      new NextRequest('http://localhost:3000/api/auth/callback?code=bad'),
    );
    expect(res.headers.get('location')).toContain('/login?error=invalid_code');
  });

  it('sets the session cookie and redirects to /dashboard on success', async () => {
    mockExchange('ok');
    const res = await callbackHandler(
      new NextRequest('http://localhost:3000/api/auth/callback?code=good'),
    );
    expect(res.headers.get('location')).toContain('/dashboard');
    expect(res.cookies.get('sb-access-token')?.value).toBe('token-value');
  });
});

// ---------------------------------------------------------------------------
// upload
// ---------------------------------------------------------------------------
describe('POST /api/files/upload', () => {
  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await uploadHandler(uploadRequest(svgFile()));
    expect(res.status).toBe(401);
  });

  it('rejects a missing file', async () => {
    const res = await uploadHandler(uploadRequest(null));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('No file provided');
  });

  it('rejects non-SVG files', async () => {
    const res = await uploadHandler(uploadRequest(new File(['test'], 'file.txt', { type: 'text/plain' })));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Only SVG files allowed');
  });

  it('rejects files over 10MB', async () => {
    const res = await uploadHandler(uploadRequest(new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.svg')));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('File too large (max 10MB)');
  });

  it('rejects an oversized Content-Length before buffering', async () => {
    const res = await uploadHandler(
      uploadRequest(svgFile(), { 'content-length': String(11 * 1024 * 1024) }),
    );
    expect(res.status).toBe(400);
  });

  it('rejects an .svg file whose content is not SVG', async () => {
    const res = await uploadHandler(uploadRequest(svgFile('fake.svg', 'hello world')));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/svg/i);
  });

  it('rejects a body that is not multipart', async () => {
    const res = await uploadHandler(jsonRequest('http://localhost:3000/api/files/upload', { a: 1 }));
    expect(res.status).toBe(400);
  });

  it('stores the object and creates a file + audit row', async () => {
    const res = await uploadHandler(uploadRequest(svgFile()));
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body).toMatchObject({
      user_id: USER_ID,
      filename: 'logo.svg',
      status: 'ready',
      original_size_bytes: SVG.length,
    });
    expect(body.file_path).toMatch(new RegExp(`^${USER_ID}/\\d+-logo\\.svg$`));

    expect(fake.objects.has(body.file_path)).toBe(true);
    expect(fake.objects.get(body.file_path)?.contentType).toBe('image/svg+xml');
    expect(fake.tables.files).toHaveLength(1);
    expect(fake.tables.audit_log[0]).toMatchObject({
      user_id: USER_ID,
      action: 'upload',
      resource_id: body.id,
    });
  });

  it('sanitises a traversal filename', async () => {
    const res = await uploadHandler(uploadRequest(svgFile('../../../evil.svg')));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.file_path).toMatch(/evil\.svg$/);
    expect(body.filename).toBe('evil.svg');
  });

  it('returns 500 and leaves no object when the DB insert fails', async () => {
    fake.failures.add('insert:files');
    const res = await uploadHandler(uploadRequest(svgFile()));
    expect(res.status).toBe(500);
    expect(fake.objects.size).toBe(0);
  });

  it('returns 500 when storage upload fails', async () => {
    fake.failures.add('storage:upload');
    const res = await uploadHandler(uploadRequest(svgFile()));
    expect(res.status).toBe(500);
    expect(fake.tables.files).toHaveLength(0);
  });

  it('rate limits after 10 uploads', async () => {
    for (let i = 0; i < 10; i += 1) {
      const res = await uploadHandler(uploadRequest(svgFile(`f${i}.svg`)));
      expect(res.status).toBe(201);
    }
    const res = await uploadHandler(uploadRequest(svgFile('last.svg')));
    expect(res.status).toBe(429);
  });
});

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------
describe('GET /api/files', () => {
  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await listHandler(new NextRequest('http://localhost:3000/api/files'));
    expect(res.status).toBe(401);
  });

  it('returns only the caller’s conversions', async () => {
    seedConversion();
    seedConversion({ id: '55555555-5555-4555-8555-555555555555', user_id: OTHER_USER_ID });

    const res = await listHandler(new NextRequest('http://localhost:3000/api/files'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.files).toHaveLength(1);
    expect(body.total).toBe(1);
  });

  it('maps a complete conversion to a download link', async () => {
    seedConversion();
    const res = await listHandler(new NextRequest('http://localhost:3000/api/files'));
    const [file] = (await res.json()).files;
    expect(file).toMatchObject({
      filename: 'logo.png',
      status: 'complete',
      output_format: 'svg',
      credits_used: 0.2,
      download_url: 'https://example.test/out/logo.svg',
    });
  });

  it('clamps pagination params', async () => {
    seedConversion();
    const res = await listHandler(
      new NextRequest('http://localhost:3000/api/files?limit=9999&offset=-5'),
    );
    const body = await res.json();
    expect(body.limit).toBe(100);
    expect(body.offset).toBe(0);
  });

  it('returns 500 on a query error', async () => {
    fake.failures.add('select:conversions');
    const res = await listHandler(new NextRequest('http://localhost:3000/api/files'));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// single file
// ---------------------------------------------------------------------------
describe('GET /api/files/:id', () => {
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(401);
  });

  it('rejects a malformed id', async () => {
    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx('nope'));
    expect(res.status).toBe(400);
  });

  it('returns the file with a signed preview url', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(FILE_ID);
    expect(body.preview_url).toMatch(/^https:\/\/fake\.supabase\.co\/sign\//);
  });

  it('returns 404 for another user’s file', async () => {
    seedFile({ user_id: OTHER_USER_ID });
    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(404);
  });

  it('still returns the record when signing fails', async () => {
    seedFile();
    fake.failures.add('storage:createSignedUrl');
    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(200);
    expect((await res.json()).preview_url).toBeNull();
  });

  it('returns 500 on a query error', async () => {
    fake.failures.add('select:files');
    const res = await getFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/files/:id', () => {
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(401);
  });

  it('rejects a malformed id', async () => {
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx('bad'));
    expect(res.status).toBe(400);
  });

  it('returns 404 for a missing file', async () => {
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(404);
  });

  it('returns 404 for another user’s file', async () => {
    seedFile({ user_id: OTHER_USER_ID });
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(404);
  });

  it('deletes the row, the object, and logs the action', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(200);
    expect((await res.json()).deleted).toBe(true);
    expect(fake.tables.files).toHaveLength(0);
    expect(fake.objects.size).toBe(0);
    expect(fake.tables.audit_log[0]).toMatchObject({ action: 'delete', resource_id: FILE_ID });
  });

  it('returns 500 when the delete fails', async () => {
    seedFile();
    fake.failures.add('delete:files');
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(500);
  });

  it('returns 500 when the lookup fails', async () => {
    fake.failures.add('select:files');
    const res = await deleteFileHandler(new NextRequest('http://localhost/api/files/x'), ctx(FILE_ID));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// export
// ---------------------------------------------------------------------------
describe('POST /api/export', () => {
  const url = 'http://localhost:3000/api/export';

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(401);
  });

  it('rejects a missing file_id', async () => {
    const res = await exportHandler(jsonRequest(url, {}));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/file_id/);
  });

  it('rejects an unsupported format', async () => {
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID, format: 'gif' }));
    expect(res.status).toBe(400);
  });

  it('exports a raster format when the source is rasterised', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID, format: 'png' }));
    expect(res.status).toBe(201);
    expect((await res.json()).format).toBe('png');
  });

  it('returns 404 for another user’s file', async () => {
    seedFile({ user_id: OTHER_USER_ID });
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(404);
  });

  it('creates an export record and audits it', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      file_id: FILE_ID,
      format: 'svg',
      file_size_bytes: SVG.length,
    });
    // Exports are written under their own prefix, not over the source object.
    expect(body.file_path.startsWith(`exports/${USER_ID}/`)).toBe(true);
    expect(body.file_path.endsWith('.svg')).toBe(true);
    expect(fake.tables.audit_log[0]).toMatchObject({ action: 'export', resource_id: body.id });
  });

  it('returns 500 when the source object is missing', async () => {
    seedFile();
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(500);
  });

  it('returns 500 when the export insert fails', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });
    fake.failures.add('insert:exports');
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(500);
  });

  it('returns 500 when the file lookup fails', async () => {
    fake.failures.add('select:files');
    const res = await exportHandler(jsonRequest(url, { file_id: FILE_ID }));
    expect(res.status).toBe(500);
  });

  it('accepts an empty body without crashing', async () => {
    const res = await exportHandler(jsonRequest(url));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/files/:id/export', () => {
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await fileExportHandler(jsonRequest('http://localhost/api/files/x/export'), ctx(FILE_ID));
    expect(res.status).toBe(401);
  });

  it('exports the file named in the path', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });
    const res = await fileExportHandler(
      jsonRequest('http://localhost/api/files/x/export', { format: 'svg' }),
      ctx(FILE_ID),
    );
    expect(res.status).toBe(201);
    expect((await res.json()).file_id).toBe(FILE_ID);
  });

  it('rejects a malformed id in the path', async () => {
    const res = await fileExportHandler(jsonRequest('http://localhost/api/files/x/export'), ctx('bad'));
    expect(res.status).toBe(400);
  });

  it('rate limits exports', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });
    for (let i = 0; i < 20; i += 1) {
      const res = await fileExportHandler(jsonRequest('http://localhost/api/files/x/export'), ctx(FILE_ID));
      expect(res.status).toBe(201);
    }
    const res = await fileExportHandler(jsonRequest('http://localhost/api/files/x/export'), ctx(FILE_ID));
    expect(res.status).toBe(429);
  });
});

describe('GET /api/exports/:id', () => {
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx(EXPORT_ID));
    expect(res.status).toBe(401);
  });

  it('rejects a malformed id', async () => {
    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx('bad'));
    expect(res.status).toBe(400);
  });

  it('returns 404 for a missing export', async () => {
    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx(EXPORT_ID));
    expect(res.status).toBe(404);
  });

  it('streams the export inline by default', async () => {
    const file = seedFile();
    seedExport();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx(EXPORT_ID));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(res.headers.get('Content-Disposition')).toBeNull();
    expect(await res.text()).toBe(SVG);
  });

  it('sets an attachment header when download=1', async () => {
    const file = seedFile();
    seedExport();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await downloadExportHandler(
      new NextRequest('http://localhost/api/exports/x?download=1'),
      ctx(EXPORT_ID),
    );
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="logo.svg"');
  });

  it('returns 500 when the object is gone', async () => {
    seedFile();
    seedExport();
    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx(EXPORT_ID));
    expect(res.status).toBe(500);
  });

  it('returns 500 when the lookup fails', async () => {
    fake.failures.add('select:exports');
    const res = await downloadExportHandler(new NextRequest('http://localhost/api/exports/x'), ctx(EXPORT_ID));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/files/:id/optimize', () => {
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

  it('returns 401 when signed out', async () => {
    signIn(null);
    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(401);
  });

  it('rejects a malformed id', async () => {
    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx('bad'));
    expect(res.status).toBe(404); // File not found after UUID validation passes in route path
  });

  it('returns 404 for a missing file', async () => {
    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(404);
  });

  it('returns 404 when accessing another user\'s file', async () => {
    seedFile({ user_id: OTHER_USER_ID });
    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(404); // RLS blocks access to another user's file
  });

  it('returns 400 when file exceeds size limit', async () => {
    const file = seedFile();
    const largeSVG = '<svg>' + 'x'.repeat(1024 * 1024 + 1) + '</svg>';
    fake.objects.set(file.file_path as string, { body: new Blob([largeSVG]) });

    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(413); // Payload Too Large
    const json = await res.json();
    expect(json.error).toContain('File too large');
  });

  it('returns 403 when quota is exceeded', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    // Seed 3 optimizations this month
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    fake.tables.optimization_quota.push({
      user_id: USER_ID,
      year_month: yearMonth,
      count: 3,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('optimization');
  });

  it('optimizes an SVG and returns savings report', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await optimizeHandler(new NextRequest('http://localhost/api/files/x/optimize'), ctx(FILE_ID));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe('optimized');
    expect(json.originalSizeBytes).toBe(SVG.length);
    expect(json.optimizedSizeBytes).toBeLessThan(SVG.length);
    expect(json.savedBytes).toBeGreaterThan(0);
    expect(json.savedPercent).toBeGreaterThan(0);
    expect(Array.isArray(json.optimizations)).toBe(true);
    expect(json.optimizations.length).toBeGreaterThan(0);

    // Verify export was created
    const exports = fake.tables.exports.filter((e: Record<string, unknown>) => e.file_id === FILE_ID);
    expect(exports.length).toBe(1);

    // Verify quota was updated
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const quotaRows = fake.tables.optimization_quota.filter(
      (q: Record<string, unknown>) => q.user_id === USER_ID && q.year_month === yearMonth
    );
    expect(quotaRows.length).toBe(1);
    expect(quotaRows[0].count).toBe(1);

    // Verify file metadata was updated
    const updatedFile = fake.tables.files.find((f: Record<string, unknown>) => f.id === FILE_ID);
    expect(updatedFile?.metadata).toBeDefined();
    expect((updatedFile?.metadata as Record<string, unknown>)?.optimization).toBeDefined();
  });

  it('accepts precision parameter', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await optimizeHandler(
      new NextRequest('http://localhost/api/files/x/optimize', {
        method: 'POST',
        body: JSON.stringify({ precision: 2 }),
      }),
      ctx(FILE_ID)
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe('optimized');
  });

  it('rejects invalid precision', async () => {
    const file = seedFile();
    fake.objects.set(file.file_path as string, { body: new Blob([SVG]) });

    const res = await optimizeHandler(
      new NextRequest('http://localhost/api/files/x/optimize', {
        method: 'POST',
        body: JSON.stringify({ precision: -1 }),
      }),
      ctx(FILE_ID)
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('precision');
  });
});
