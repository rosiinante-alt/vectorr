const getAll = jest.fn();
const cookies = jest.fn(async () => ({ getAll }));

jest.mock('next/headers', () => ({ cookies: () => cookies() }));

import { hasSessionCookie } from '@/lib/session';

const ORIGINAL_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

beforeEach(() => {
  getAll.mockReset();
  getAll.mockReturnValue([]);
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
});

afterAll(() => {
  if (ORIGINAL_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_URL;
});

describe('hasSessionCookie', () => {
  it('returns false without a Supabase url, without reading cookies', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    await expect(hasSessionCookie()).resolves.toBe(false);
    expect(cookies).not.toHaveBeenCalled();
  });

  it('detects a chunked auth token cookie', async () => {
    getAll.mockReturnValue([
      { name: 'theme', value: 'dark' },
      { name: 'sb-abcdefgh-auth-token.0', value: 'part' },
    ]);

    await expect(hasSessionCookie()).resolves.toBe(true);
  });

  it('detects an unchunked auth token cookie', async () => {
    getAll.mockReturnValue([{ name: 'sb-abcdefgh-auth-token', value: 'jwt' }]);
    await expect(hasSessionCookie()).resolves.toBe(true);
  });

  it('returns false when only unrelated cookies exist', async () => {
    getAll.mockReturnValue([{ name: 'theme', value: 'dark' }]);
    await expect(hasSessionCookie()).resolves.toBe(false);
  });

  it('does not match a cookie that merely starts with sb-', async () => {
    getAll.mockReturnValue([{ name: 'sb-abcdefgh-code-verifier', value: 'x' }]);
    await expect(hasSessionCookie()).resolves.toBe(false);
  });
});
