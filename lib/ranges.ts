import type { Direction } from "../scripts/routes";

export type Queryable = {
  query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
};

export type Range = {
  /** Day of week in Guatemala local time: 0 = Sunday ... 6 = Saturday. */
  dow: number;
  /** 15-minute block of the local day: 0 = 00:00, 28 = 07:00, 95 = 23:45. */
  block: number;
  n: number;
  p10: number;
  p50: number;
  p90: number;
  lowConfidence: boolean;
};

// shortcut: one fixed threshold for every block; tune it once there is real data.
export const MIN_SAMPLES = 5;

// Guatemala has no daylight saving time, so 'America/Guatemala' is always UTC-6.
export const RANGES_SQL = `
  with local as (
    select travel_time_s, sampled_at at time zone 'America/Guatemala' as t
    from samples
    where route_slug = $1 and direction = $2
  )
  select
    extract(dow from t)::int as dow,
    extract(hour from t)::int * 4 + floor(extract(minute from t) / 15)::int as block,
    count(*)::int as n,
    percentile_cont(0.1) within group (order by travel_time_s) as p10,
    percentile_cont(0.5) within group (order by travel_time_s) as p50,
    percentile_cont(0.9) within group (order by travel_time_s) as p90
  from local
  group by 1, 2
  order by 1, 2`;

/** p10 / p50 / p90 of travel time (seconds) per day of week and 15-minute block. */
export async function rangesFor(db: Queryable, slug: string, direction: Direction): Promise<Range[]> {
  const { rows } = await db.query(RANGES_SQL, [slug, direction]);
  return rows.map((r) => ({
    dow: Number(r.dow),
    block: Number(r.block),
    n: Number(r.n),
    p10: Number(r.p10),
    p50: Number(r.p50),
    p90: Number(r.p90),
    lowConfidence: Number(r.n) < MIN_SAMPLES,
  }));
}
