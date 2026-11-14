import type { Queryable } from "../lib/ranges";
import { legsOf, type Route } from "./routes";
import type { Provider } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Takes one measurement per route and direction and stores each one.
 * A failed measurement is logged and skipped; the rest still run.
 * The pause keeps requests under the provider's per-second limit (TomTom answered HTTP 429 at ~5.5/s).
 */
export async function collectOnce(
  db: Queryable,
  provider: Provider,
  routes: Route[],
  pauseMs = 300,
): Promise<{ saved: number; failed: number }> {
  let saved = 0;
  let failed = 0;
  for (const route of routes) {
    for (const { direction, leg } of legsOf(route)) {
      await sleep(pauseMs);
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
  return { saved, failed };
}
