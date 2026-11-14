# Roadmap

Principle: collect first, present later. The history is the asset.

## High priority (security)

- [ ] **Encrypt the database connection.** The collector and the web app connect to PostgreSQL without TLS: the connection string has no `sslmode`, and the server does not force it, so data and writes travel in clear text. Fix, with no code change: add `?uselibpqcompat=true&sslmode=require` to `DATABASE_URL` (local `.env`, GitHub secret and hosting variable), and turn on "Enforce SSL" in the database settings of the hosting dashboard. This encrypts the traffic but does not verify the server's identity; full verification needs the provider's CA certificate. Must be done before the first real data collection and before deploying the web app.

## Phase 0: Foundation (done)

- [x] Repository, branching model and commit conventions
- [x] Documentation: architecture, stack, providers, routes
- [x] Route pins and waypoints (`routes.json`)
- [x] CI: type-check, tests and build on every push to `dev` and every pull request to `main`
- [x] Repository public, with branch rules and secret scanning

## Phase 1: Provider evaluation (in progress)

- [x] Provider selected by the `PROVIDER` environment variable
- [x] TomTom and HERE tested: no traffic data for Guatemala City
- [x] Mapbox tested: has traffic data, with gaps
- [ ] Written answer from Mapbox on storing results (see [providers](providers.md))
- [ ] Mapbox adapter (after the answer)
- [ ] Compare against timed real trips and manual Google Maps readings
- [ ] Choose the primary provider, or switch to [plan B](plan-b.md)

## Phase 2: Collector

- [x] Database schema (`schema.sql`) applied, with row level security
- [x] Collector script with the full route list, both directions
- [x] Manual collection workflow (scheduled runs stay off until storage is allowed)
- [ ] Enable the schedule (5:00-22:00 local time, denser at peak hours)
- [ ] Handling of failures, retries and quota limits
- [ ] Monitoring: detect days with missing data

## Phase 3: Analysis

- [x] Percentile query (p10 / p50 / p90) by day of week and 15-minute block, tested
- [x] Low-confidence flag for blocks with few samples
- [ ] Locate bottlenecks on Interamericana using the 1a / 1b split

## Phase 4: Frontend

- [x] Route, direction and day picker, with a range chart across the day
- [ ] "Best departure window" suggestion
- [ ] Deploy to Vercel
- [x] Caching: 5-minute shared cache per route and direction

## Phase 5: Local context

- [ ] Payday weeks (quincena)
- [ ] School calendar and holidays
- [ ] Rain
- [ ] Events

## Later ideas

- More routes and neighboring municipalities
- Public read-only API
- Open dataset of aggregates, where provider terms allow it
