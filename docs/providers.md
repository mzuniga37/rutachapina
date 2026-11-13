# Providers and rate limits

Google Maps is not usable for this project: its terms restrict storing results, and storing results is exactly what building a history requires. Google is used only as a **manual** reference when validating accuracy (a person comparing travel times on the app).

Quotas and terms below were noted from memory and **must be re-verified** against each provider's current documentation before relying on them.

## Candidates

| Provider | API | Free quota (to verify) | Notes |
|---|---|---|---|
| TomTom | Routing API (`calculateRoute` with traffic) | About 2,500 requests/day | First candidate. Returns live travel time, no-traffic time and delay. |
| Mapbox | Directions API (`driving-traffic` profile) | About 100,000 requests/month | Check terms on storing results. |
| HERE | Routing API v8 | Uncertain (reports of 30k vs 250k/month) | Confirm the real free quota first. |

## Terms to read before collecting

- **TomTom**: Maps API terms, section on storage and caching.
- **Mapbox**: Terms of Service, restrictions on storing and caching results.
- **HERE**: Terms on storage of platform data.

For each provider, record here: may we store travel times long term, may we publish derived statistics, any attribution required.

## Request budget (TomTom)

- Routes: 10 corridors x 2 directions = 20 series.
- Window: 5:00-22:00 = 17 hours = 68 samples per series at 15 min.
- Total: about 1,360 requests/day, leaving about 1,100 requests/day of headroom for denser peak-hour sampling.

If more routes or higher frequency are needed, this is the ceiling to watch.

## Evaluation plan

Run the candidates side by side for one week on 3-5 routes, then compare against real timed trips and manual readings from Google Maps. Keep the provider whose travel times deviate least from reality. The collector stores a `provider` column so the comparison and any later switch are cheap.
