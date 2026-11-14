import pg from "pg";
import { providerFromEnv, requireEnv } from "./providers/index";
import { loadRoutes } from "./routes";
import { collectOnce } from "./sample";

const provider = providerFromEnv();
const db = new pg.Client({ connectionString: requireEnv("DATABASE_URL") });
await db.connect();

const { saved, failed } = await collectOnce(db, provider, loadRoutes().filter((r) => r.active));

await db.end();
console.log(`samples saved: ${saved}, failed: ${failed}`);
// shortcut: a partial failure still exits 0 so one flaky request does not alert; fail only if nothing was saved.
if (saved === 0) process.exit(1);
