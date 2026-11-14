import { readFileSync } from "node:fs";
import type { Leg, Point } from "./types";

export type Route = {
  slug: string;
  name: string;
  origin: Point;
  destination: Point;
  waypoints: Point[];
  bothDirections: boolean;
  active: boolean;
};

export type Direction = "forward" | "reverse";

export function loadRoutes(path = "routes.json"): Route[] {
  return JSON.parse(readFileSync(path, "utf8")) as Route[];
}

/** The reverse direction swaps the ends and reverses the waypoints. */
export function legsOf(route: Route): { direction: Direction; leg: Leg }[] {
  const forward = { origin: route.origin, destination: route.destination, waypoints: route.waypoints };
  if (!route.bothDirections) return [{ direction: "forward", leg: forward }];
  const reverse = {
    origin: route.destination,
    destination: route.origin,
    waypoints: [...route.waypoints].reverse(),
  };
  return [
    { direction: "forward", leg: forward },
    { direction: "reverse", leg: reverse },
  ];
}
