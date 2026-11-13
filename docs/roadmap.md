# Roadmap

Principle: collect first, present later. The history is the asset.

## Phase 0: Foundation (current)

- [x] Repository, branching model and commit conventions
- [x] Documentation: architecture, stack, providers, routes
- [ ] Fix exact route pins and waypoints
- [ ] CI skeleton (lint, type-check, tests)

## Phase 1: Provider evaluation

- [ ] Read storage terms for TomTom, Mapbox and HERE
- [ ] Provider interface and a first adapter
- [ ] Run candidates side by side for one week on 3-5 routes
- [ ] Compare against timed real trips and manual Google Maps readings
- [ ] Choose the primary provider

## Phase 2: Collector

- [ ] Database schema (`schema.sql`)
- [ ] Collector script with the full route list
- [ ] Scheduled workflow (5:00-22:00, denser at peak hours)
- [ ] Handling of failures, retries and quota limits
- [ ] Monitoring: detect days with missing data

## Phase 3: Analysis

- [ ] Percentile query (p10 / p50 / p90) by day of week and 15-minute block
- [ ] Low-confidence flag for blocks with few samples
- [ ] Locate bottlenecks on Interamericana using the 1a / 1b split

## Phase 4: Frontend

- [ ] Route and direction picker
- [ ] Range chart across the day
- [ ] "Best departure window" suggestion

## Phase 5: Local context

- [ ] Payday weeks (quincena)
- [ ] School calendar and holidays
- [ ] Rain
- [ ] Events

## Later ideas

- More routes and neighboring municipalities
- Public read-only API
- Open dataset of aggregates, where provider terms allow it
