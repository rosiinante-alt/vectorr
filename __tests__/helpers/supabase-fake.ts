import type { SupabaseClient } from '@supabase/supabase-js';

export interface TestUser {
  id: string;
  email: string | null;
}

export interface StoredObject {
  body: Blob;
  contentType?: string;
}

/**
 * In-memory Supabase stand-in covering exactly what the routes touch:
 * auth.getUser, from(table) queries, and storage.
 *
 * `failOn` lets a test force a specific operation to error so the failure
 * branches (500s, rollbacks) are exercised too.
 */
export type FailPoint =
  | 'insert:files'
  | 'insert:exports'
  | 'insert:audit_log'
  | 'select:files'
  | 'select:exports'
  | 'delete:files'
  | 'storage:upload'
  | 'storage:download'
  | 'storage:createSignedUrl';

export interface FakeSupabase {
  client: SupabaseClient;
  tables: Record<string, Record<string, unknown>[]>;
  objects: Map<string, StoredObject>;
  inserts: { table: string; row: Record<string, unknown> }[];
  failures: Set<FailPoint>;
}

interface QueryState {
  table: string;
  op: 'select' | 'insert' | 'delete';
  payload?: Record<string, unknown>;
  filters: [string, unknown][];
  single: boolean;
  maybeSingle: boolean;
  count: boolean;
  orderDesc: string | null;
  range: [number, number] | null;
  embeds: string[];
}

export function createFakeSupabase(user: TestUser | null): FakeSupabase {
  const tables: Record<string, Record<string, unknown>[]> = {
    users: [],
    files: [],
    exports: [],
    audit_log: [],
  };
  const objects = new Map<string, StoredObject>();
  const inserts: { table: string; row: Record<string, unknown> }[] = [];
  const failures = new Set<FailPoint>();

  const fail = (point: FailPoint) => {
    if (!failures.has(point)) return null;
    return { message: `forced failure: ${point}` };
  };

  function run(state: QueryState) {
    const rows = tables[state.table] ?? (tables[state.table] = []);
    const matches = (row: Record<string, unknown>) =>
      state.filters.every(([col, val]) => {
        // Dotted filters model Supabase embedded-resource joins, e.g.
        // `.eq('files.user_id', id)` on an `exports` query.
        if (col.includes('.')) {
          const [, field] = col.split('.');
          const parent = row.file_id
            ? tables.files?.find((f) => f.id === row.file_id)
            : undefined;
          return parent ? parent[field] === val : false;
        }
        return row[col] === val;
      });

    if (state.op === 'insert') {
      const forced = fail(`insert:${state.table}` as FailPoint);
      if (forced) return { data: null, error: forced };

      const row = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...state.payload,
      };
      rows.push(row);
      inserts.push({ table: state.table, row });
      return { data: state.single ? row : [row], error: null };
    }

    if (state.op === 'delete') {
      const forced = fail(`delete:${state.table}` as FailPoint);
      if (forced) return { data: null, error: forced };
      tables[state.table] = rows.filter((r) => !matches(r));
      return { data: null, error: null };
    }

    const forced = fail(`select:${state.table}` as FailPoint);
    if (forced) return { data: null, error: forced };

    let found = rows.filter(matches);
    const total = found.length;
    if (state.orderDesc) {
      const col = state.orderDesc;
      found = [...found].sort((a, b) => String(b[col]).localeCompare(String(a[col])));
    }
    if (state.range) {
      found = found.slice(state.range[0], state.range[1] + 1);
    }

    // Emulate `files!inner(...)` embeds requested by select().
    found = found.map((row) => {
      if (!state.embeds.includes('files') || !row.file_id) return row;
      const parent = tables.files?.find((f) => f.id === row.file_id);
      return { ...row, files: parent ?? null };
    });

    if (state.single) {
      return found.length === 1
        ? { data: found[0], error: null }
        : { data: null, error: { message: 'no rows returned' } };
    }
    if (state.maybeSingle) {
      return { data: found[0] ?? null, error: null };
    }
    return { data: found, error: null, count: state.count ? total : null };
  }

  const from = (table: string) => {
    const state: QueryState = {
      table,
      op: 'select',
      filters: [],
      single: false,
      maybeSingle: false,
      count: false,
      orderDesc: null,
      range: null,
      embeds: [],
    };

    const builder = {
      select: (cols?: string, opts?: { count?: string }) => {
        state.count = Boolean(opts?.count);
        const match = cols?.match(/(\w+)!inner/);
        if (match) state.embeds.push(match[1]);
        return builder;
      },
      insert: (payload: Record<string, unknown>) => {
        state.op = 'insert';
        state.payload = payload;
        return builder;
      },
      delete: () => {
        state.op = 'delete';
        return builder;
      },
      eq: (col: string, val: unknown) => {
        state.filters.push([col, val]);
        return builder;
      },
      order: (col: string, opts?: { ascending?: boolean }) => {
        if (opts?.ascending === false) state.orderDesc = col;
        return builder;
      },
      range: (fromIdx: number, toIdx: number) => {
        state.range = [fromIdx, toIdx];
        return builder;
      },
      single: () => {
        state.single = true;
        return builder;
      },
      maybeSingle: () => {
        state.maybeSingle = true;
        return builder;
      },
      then: <R1, R2>(
        onFulfilled?: ((v: unknown) => R1 | PromiseLike<R1>) | null,
        onRejected?: ((e: unknown) => R2 | PromiseLike<R2>) | null,
      ) => Promise.resolve(run(state)).then(onFulfilled, onRejected),
    };
    return builder;
  };

  const storageBucket = {
    upload: async (path: string, body: Buffer | ArrayBuffer, options?: { contentType?: string }) => {
      const forced = fail('storage:upload');
      if (forced) return { data: null, error: forced };
      objects.set(path, {
        body: new Blob([body as BlobPart]),
        contentType: options?.contentType,
      });
      return { data: { path }, error: null };
    },
    download: async (path: string) => {
      const forced = fail('storage:download');
      if (forced) return { data: null, error: forced };
      const object = objects.get(path);
      if (!object) return { data: null, error: { message: 'Object not found' } };
      return { data: object.body, error: null };
    },
    remove: async (paths: string[]) => {
      for (const path of paths) objects.delete(path);
      return { data: paths, error: null };
    },
    createSignedUrl: async (path: string, expiresIn: number) => {
      const forced = fail('storage:createSignedUrl');
      if (forced) return { data: null, error: forced };
      if (!objects.has(path)) return { data: null, error: { message: 'Object not found' } };
      return {
        data: { signedUrl: `https://fake.supabase.co/sign/${path}?ttl=${expiresIn}` },
        error: null,
      };
    },
  };

  const client = {
    auth: {
      getUser: async () =>
        user
          ? { data: { user: { id: user.id, email: user.email } }, error: null }
          : { data: { user: null }, error: { message: 'Not authenticated' } },
    },
    from,
    storage: { from: () => storageBucket },
  } as unknown as SupabaseClient;

  return { client, tables, objects, inserts, failures };
}
