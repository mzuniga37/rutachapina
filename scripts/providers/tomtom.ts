import type { Leg, Point, Provider, Sample } from "../types";

const BASE = "https://api.tomtom.com/routing/1/calculateRoute";

type Body = {
  routes?: {
    summary?: {
      lengthInMeters?: number;
      travelTimeInSeconds?: number;
      trafficDelayInSeconds?: number;
      noTrafficTravelTimeInSeconds?: number;
    };
  }[];
};

const loc = (p: Point) => `${p.lat},${p.lng}`;

export function buildUrl(leg: Leg, key: string): string {
  const path = [leg.origin, ...leg.waypoints, leg.destination].map(loc).join(":");
  const query = new URLSearchParams({
    key,
    traffic: "true",
    travelMode: "car",
    routeType: "fastest",
    computeTravelTimeFor: "all", // needed to get noTrafficTravelTimeInSeconds
  });
  return `${BASE}/${path}/json?${query}`;
}

export function parseSummary(body: Body): Sample {
  const s = body.routes?.[0]?.summary;
  if (!s || typeof s.travelTimeInSeconds !== "number") {
    throw new Error("TomTom: no route summary in response");
  }
  return {
    travelTimeS: s.travelTimeInSeconds,
    noTrafficTimeS: s.noTrafficTravelTimeInSeconds ?? null,
    delayS: s.trafficDelayInSeconds ?? null,
    lengthM: s.lengthInMeters ?? null,
  };
}

export function tomtom(key: string): Provider {
  return {
    name: "tomtom",
    async getTravelTime(leg) {
      const res = await fetch(buildUrl(leg, key));
      // The URL carries the API key, so it is never put in an error message.
      if (!res.ok) throw new Error(`TomTom HTTP ${res.status}`);
      return parseSummary((await res.json()) as Body);
    },
  };
}
