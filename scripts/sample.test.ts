import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Route } from "./routes";
import { collectOnce } from "./sample";
import type { Leg, Provider } from "./types";

const p = (n: number) => ({ lat: n, lng: -n });
const route: Route = {
  slug: "r",
  name: "r",
  origin: p(1),
  destination: p(5),
  waypoints: [p(2), p(3)],
  bothDirections: true,
  active: true,
};

// Every field is derived from the leg, so a swapped column or a wrong direction shows up in the test.
const fake: Provider = {
  name: "fake",
  getTravelTime: async (leg: Leg) => ({
    travelTimeS: leg.origin.lat * 100,
    noTrafficTimeS: leg.origin.lat * 10,
    delayS: leg.origin.lat,
    lengthM: leg.destination.lat * 1000,
  }),
};

let db: PGlite;

beforeEach(async () => {
  db = new PGlite();
  await db.exec(readFileSync("schema.sql", "utf8"));
});

const rows = async () =>
  (
    await db.query<Record<string, unknown>>(
      `select route_slug, direction, provider, travel_time_s, no_traffic_time_s, delay_s, length_m
       from samples order by direction`,
    )
  ).rows;

describe("collectOnce", () => {
  it("stores one row per direction with every column in the right place", async () => {
    const result = await collectOnce(db, fake, [route], 0);
    expect(result).toEqual({ saved: 2, failed: 0 });
    expect(await rows()).toEqual([
      // forward starts at lat 1 and ends at lat 5
      { route_slug: "r", direction: "forward", provider: "fake", travel_time_s: 100, no_traffic_time_s: 10, delay_s: 1, length_m: 5000 },
      // reverse starts at lat 5 and ends at lat 1
      { route_slug: "r", direction: "reverse", provider: "fake", travel_time_s: 500, no_traffic_time_s: 50, delay_s: 5, length_m: 1000 },
    ]);
  });

  it("stores missing optional values as null", async () => {
    const sparse: Provider = {
      name: "sparse",
      getTravelTime: async () => ({ travelTimeS: 60, noTrafficTimeS: null, delayS: null, lengthM: null }),
    };
    await collectOnce(db, sparse, [{ ...route, bothDirections: false }], 0);
    expect(await rows()).toEqual([
      { route_slug: "r", direction: "forward", provider: "sparse", travel_time_s: 60, no_traffic_time_s: null, delay_s: null, length_m: null },
    ]);
  });

  it("skips a failed measurement and keeps the others", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const flaky: Provider = {
      name: "flaky",
      getTravelTime: async (leg) => {
        if (leg.origin.lat === 5) throw new Error("HTTP 429");
        return fake.getTravelTime(leg);
      },
    };
    const result = await collectOnce(db, flaky, [route], 0);
    expect(result).toEqual({ saved: 1, failed: 1 });
    expect((await rows()).map((r) => r.direction)).toEqual(["forward"]);
  });
});
