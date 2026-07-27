import postgres from 'postgres';

// Cache the postgres client on globalThis to prevent creating new connection
// pools on every HMR reload in development. Without this, each hot reload
// spawns a new pool that leaks memory until the process runs out of heap.
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

export const sql =
  globalForDb.sql ??
  postgres(process.env.POSTGRES_URL!, {
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    prepare: false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sql = sql;
}
