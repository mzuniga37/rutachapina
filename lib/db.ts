import pg from "pg";

const g = globalThis as { __pool?: pg.Pool };

/** One small shared pool per server instance (the free database tier has few connections). */
export function pool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing env var DATABASE_URL");
  g.__pool ??= new pg.Pool({ connectionString, max: 3 });
  return g.__pool;
}
