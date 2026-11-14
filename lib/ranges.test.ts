import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { MIN_SAMPLES, rangesFor } from "./ranges";

let db: PGlite;

async function add(slug: string, direction: string, utc: string, seconds: number) {
  await db.query(
    `insert into samples (route_slug, direction, provider, sampled_at, travel_time_s)
     values ($1, $2, 'test', $3, $4)`,
    [slug, direction, utc, seconds],
  );
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(readFileSync("schema.sql", "utf8"));

  // Tuesday 2026-11-10, 07:00-07:14 Guatemala time (UTC-6) = 13:00-13:14 UTC.
  // Eleven samples: 600, 700, ... 1600 s.
  for (let i = 0; i <= 10; i++) {
    await add("r", "forward", `2026-11-10T13:${String(i).padStart(2, "0")}:00Z`, 600 + i * 100);
  }
  // Same Tuesday, next block (07:15 local), a single sample.
  await add("r", "forward", "2026-11-10T13:15:00Z", 900);
  // Monday 23:30 local is already Tuesday 05:30 in UTC: it must count as Monday.
  await add("r", "forward", "2026-11-10T05:30:00Z", 500);
  // The other direction and another route must not leak in.
  await add("r", "reverse", "2026-11-10T13:00:00Z", 9999);
  await add("other", "forward", "2026-11-10T13:00:00Z", 9999);
}, 60_000);

describe("rangesFor", () => {
  it("computes p10 / p50 / p90 per day of week and 15-minute block", async () => {
    const ranges = await rangesFor(db, "r", "forward");
    const tue7 = ranges.find((r) => r.dow === 2 && r.block === 28);
    expect(tue7).toEqual({ dow: 2, block: 28, n: 11, p10: 700, p50: 1100, p90: 1500, lowConfidence: false });
  });

  it("uses Guatemala local time, not UTC, for the day and the block", async () => {
    const ranges = await rangesFor(db, "r", "forward");
    const mon = ranges.find((r) => r.dow === 1);
    expect(mon).toMatchObject({ block: 94, n: 1, p50: 500 }); // 23:30 = 23 * 4 + 2
  });

  it("flags blocks with too few samples", async () => {
    const ranges = await rangesFor(db, "r", "forward");
    const tue715 = ranges.find((r) => r.dow === 2 && r.block === 29);
    expect(tue715?.n).toBeLessThan(MIN_SAMPLES);
    expect(tue715?.lowConfidence).toBe(true);
  });

  it("keeps routes and directions separate", async () => {
    expect(await rangesFor(db, "r", "reverse")).toHaveLength(1);
    expect(await rangesFor(db, "nope", "forward")).toEqual([]);
  });
});
