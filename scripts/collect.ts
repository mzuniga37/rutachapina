import pg from "pg";
import { legsOf, loadRoutes } from "./routes";
import { tomtom } from "./providers/tomtom";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

const provider = tomtom(env("TOMTOM_API_KEY"));
const db = new pg.Client({ connectionString: env("DATABASE_URL") });
await db.connect();

let saved = 0;
let failed = 0;

// Sequential on purpose: 20 requests, and it stays far below the provider's per-second limit.
for (const route of loadRoutes().filter((r) => r.active)) {
  for (const { direction, leg } of legsOf(route)) {
    const sampledAt = new Date();
    try {
      const s = await provider.getTravelTime(leg);
      await db.query(
        `insert into samples
           (route_slug, direction, provider, sampled_at, travel_time_s, no_traffic_time_s, delay_s, length_m)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [route.slug, direction, provider.name, sampledAt, s.travelTimeS, s.noTrafficTimeS, s.delayS, s.lengthM],
      );
      saved++;
    } catch (e) {
      failed++;
      console.error(`${route.slug} ${direction}:`, e instanceof Error ? e.message : e);
    }
  }
}

await db.end();
console.log(`samples saved: ${saved}, failed: ${failed}`);
// shortcut: a partial failure still exits 0 so one flaky request does not alert; fail only if nothing was saved.
if (saved === 0) process.exit(1);
