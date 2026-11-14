export type Point = { lat: number; lng: number };

/** One drive from `origin` to `destination` through `waypoints`, in driving order. */
export type Leg = { origin: Point; destination: Point; waypoints: Point[] };

export type Sample = {
  travelTimeS: number;
  noTrafficTimeS: number | null;
  delayS: number | null;
  lengthM: number | null;
};

export type Provider = {
  name: string;
  getTravelTime: (leg: Leg) => Promise<Sample>;
};
