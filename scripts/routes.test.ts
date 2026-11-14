import { describe, expect, it } from "vitest";
import { legsOf, loadRoutes, type Route } from "./routes";

const p = (n: number) => ({ lat: n, lng: -n });
const route: Route = {
  slug: "x",
  name: "x",
  origin: p(1),
  destination: p(5),
  waypoints: [p(2), p(3)],
  bothDirections: true,
  active: true,
};

describe("legsOf", () => {
  it("reverse swaps the ends and reverses the waypoints", () => {
    const [forward, reverse] = legsOf(route);
    expect(forward.leg.waypoints).toEqual([p(2), p(3)]);
    expect(reverse.direction).toBe("reverse");
    expect(reverse.leg).toEqual({ origin: p(5), destination: p(1), waypoints: [p(3), p(2)] });
  });

  it("returns only forward when bothDirections is false", () => {
    expect(legsOf({ ...route, bothDirections: false })).toHaveLength(1);
  });
});

describe("routes.json", () => {
  const routes = loadRoutes();
  const inGuatemalaCity = (q: { lat: number; lng: number }) =>
    q.lat > 14.4 && q.lat < 14.8 && q.lng > -90.8 && q.lng < -90.3;

  it("has unique slugs", () => {
    const slugs = routes.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps every point inside the metropolitan area (catches swapped lat/lng)", () => {
    for (const r of routes) {
      for (const q of [r.origin, r.destination, ...r.waypoints]) {
        expect(inGuatemalaCity(q), r.slug).toBe(true);
      }
    }
  });
});
