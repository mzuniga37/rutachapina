import { describe, expect, it } from "vitest";
import { buildUrl, parseSummary } from "./tomtom";

const leg = {
  origin: { lat: 1, lng: -1 },
  destination: { lat: 5, lng: -5 },
  waypoints: [{ lat: 3, lng: -3 }],
};

describe("buildUrl", () => {
  it("lists origin, waypoints and destination in order and requests traffic", () => {
    const url = buildUrl(leg, "KEY");
    expect(url).toContain("/1,-1:3,-3:5,-5/json?");
    expect(url).toContain("key=KEY");
    expect(url).toContain("traffic=true");
  });
});

describe("parseSummary", () => {
  it("maps the TomTom summary to a sample", () => {
    const sample = parseSummary({
      routes: [
        {
          summary: {
            lengthInMeters: 1000,
            travelTimeInSeconds: 600,
            trafficDelayInSeconds: 120,
            noTrafficTravelTimeInSeconds: 480,
          },
        },
      ],
    });
    expect(sample).toEqual({ travelTimeS: 600, noTrafficTimeS: 480, delayS: 120, lengthM: 1000 });
  });

  it("throws when the response has no route", () => {
    expect(() => parseSummary({ routes: [] })).toThrow("no route summary");
  });
});
