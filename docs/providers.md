# Providers and rate limits

Google Maps is not usable for this project: its terms restrict storing results, and storing results is exactly what building a history requires. Google is used only as a **manual** reference when validating accuracy (a person comparing travel times on the app).

Quotas and terms below were noted from memory and **must be re-verified** against each provider's current documentation before relying on them.

## Candidates

| Provider | API | Free quota (to verify) | Notes |
|---|---|---|---|
| TomTom | Routing API (`calculateRoute` with traffic) | About 2,500 requests/day | Tested 2026-11-13: returned no traffic data for Guatemala City (see findings below). |
| Mapbox | Directions API (`driving-traffic` profile) | About 100,000 requests/month | Returns traffic in Guatemala City (see findings). Storage terms not yet confirmed. |
| HERE | Routing API v8 | Uncertain (reports of 30k vs 250k/month) | Tested 2026-11-13: returned no traffic data for Guatemala City (see findings below). |

## Findings so far (2026-11-13)

- **TomTom has no usable traffic data here.** On a Friday at 18:43 local time, the Routing API returned identical live, historic and no-traffic travel times, zero delay and no traffic sections for every route. Its Flow Segment Data API found no segments near three points on main avenues. Only free-flow times are available.
- **Mapbox has traffic data here, with gaps.** `driving-traffic` returned a live `duration` different from `duration_typical`, and congestion levels (`low`, `moderate`, `heavy`) on all tested routes. A share of road segments came back as `unknown`. Routes with 5-6 coordinates were accepted. Accuracy against real trips has not been measured yet.
- **HERE has no usable traffic data here either.** On all 10 routes in both directions (Friday 19:54 local time), the Routing API v8 returned a travel time with traffic identical to its base (free-flow) duration. A control run of Mapbox at the same minute still showed 4% to 22% above typical, so the time of day does not explain it.
- **Mapbox storage terms are unconfirmed.** The public Terms of Service do not state a rule for storing Directions results, and the Product Terms could not be read. Written confirmation has been requested.
- **No long-term collection until the storage question is settled.**

## Terms to read before collecting

- **TomTom**: Maps API terms, section on storage and caching.
- **Mapbox**: Terms of Service, restrictions on storing and caching results.
- **HERE**: Terms on storage of platform data.

For each provider, record here: may we store travel times long term, may we publish derived statistics, any attribution required.

## Request budget (one request per series per sample)

- Routes: 10 corridors x 2 directions = 20 series.
- Window: 5:00-22:00 = 17 hours = 68 samples per series at 15 min.
- Total: about 1,360 requests/day, or about 41,000 per month. That fits TomTom's daily quota (about 1,100 requests/day of headroom) and Mapbox's monthly quota.

If more routes or higher frequency are needed, this is the ceiling to watch.

## Evaluation plan

Run the candidates side by side for one week on 3-5 routes, then compare against real timed trips and manual readings from Google Maps. Keep the provider whose travel times deviate least from reality. The collector stores a `provider` column so the comparison and any later switch are cheap.
