import pg from "pg";

const g = globalThis as { __pool?: pg.Pool };

/**
 * One connection per server instance: on serverless hosting every instance has its own pool,
 * and the free database tier allows few connections. Set DATABASE_URL on the host to the
 * Supabase Transaction pooler (port 6543), which is built for many short-lived clients.
 */
export function pool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing env var DATABASE_URL");
  g.__pool ??= new pg.Pool({ connectionString, max: 1 });
  return g.__pool;
}
