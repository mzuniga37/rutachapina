# Architecture

## Overview

```
GitHub Actions (cron)        Traffic provider API         PostgreSQL (free tier)        Next.js on Vercel
  collector script   --->    TomTom / Mapbox / HERE  ---> samples table          --->   reads aggregates,
  every 10-15 min            (swappable adapter)          + aggregates               renders ranges
```

Three parts, each independent:

1. **Collector**: a scheduled script that, for each configured route and direction, asks the provider for the current travel time and stores one row.
2. **Database**: PostgreSQL holding raw samples and derived aggregates.
3. **Web app**: reads aggregates and shows ranges per route, day and time block.

Data collection comes first. The history is the long-term asset; the frontend can come later.

## Collector

- Runs on a schedule, no server to maintain.
- Reads the route list from a configuration file, so adding or removing a route is a one-line change.
- Talks to the provider through a small **provider interface** (`getTravelTime(route) -> sample`). Each provider is one adapter. Switching or comparing providers does not touch the rest of the code.
- Every row records which `provider` produced it.
- Samples 5:00-22:00 local time (America/Guatemala, UTC-6, no daylight saving), more often during peak hours.
- Stores the **actual timestamp** of each measurement, so scheduler delays do not distort the data.

## Data model (draft)

**routes**: `id`, `slug`, `name`, `direction`, `origin`, `destination`, `waypoints`, `active`

**samples**: `id`, `route_id`, `provider`, `sampled_at` (timestamptz), `travel_time_s`, `no_traffic_time_s`, `delay_s`, `length_m`

**aggregates** (materialized, refreshed periodically): `route_id`, `day_of_week`, `time_block` (15 min), `p10_s`, `p50_s`, `p90_s`, `n_samples`

Raw provider responses are **not** stored: only the numeric fields we need, to stay within provider terms (see [providers](providers.md)).

## Aggregation

For each route, day of week and 15-minute block (in local time), compute p10 / p50 / p90 of `travel_time_s` over the available history. A block with too few samples is flagged as low confidence instead of shown as precise.

Later refinements: separate payday weeks, school vs. vacation periods, holidays, rainy days.

## Web app

- Next.js on Vercel (free tier), read-only access to the database.
- Main view: pick a route and direction, see the expected range across the day, and a suggestion of the best departure window.

## Design principles

- **Collect first, present later.**
- **Provider-agnostic.** No provider is trusted blindly; accuracy is measured (see roadmap, phase 1).
- **Free to run.** Every component fits inside free tiers.
- **Honest uncertainty.** Show the range and the sample size.
