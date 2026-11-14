# Ruta Chapina

Real traffic ranges for Guatemala City, built from historical data we collect ourselves.

Navigation apps give you a single number: "35 minutes". Ruta Chapina answers the question people actually ask: **"what time should I leave, and how long could it really take?"**

## The idea

Every 10-15 minutes, a collector queries a traffic provider for a fixed set of key routes in Guatemala City and its metropolitan area, and stores the travel time in a database. Over weeks, this builds a local history of how each route behaves.

From that history we compute **ranges, not single values**:

- **p10**: a good day
- **p50**: a typical day
- **p90**: a bad day

grouped by **day of week x 15-minute time block**. For example: "Interamericana toward the city, Tuesday 7:00-7:15: usually 38 min, between 29 and 61."

## Why this is different

- **Ranges instead of a point estimate.** Variability is the real cost of traffic, and it is what a single number hides.
- **Local history.** The data is ours, collected on the routes that matter here, not a generic model.
- **Local context (planned).** Payday weeks (quincena), school calendar, holidays, rain and events, which drive traffic in Guatemala City.

## Routes

Starting corridors (both directions): Interamericana (Bulevar Los Proceres to San Lucas Sacatepequez), Calzada Aguilar Batres, Periferico, Bulevar Vista Hermosa / Zona 4, Bulevar San Cristobal (Mixco), Calzada San Juan, Calzada Mateo Flores and Calle Marti. See [docs/routes.md](docs/routes.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Stack and platforms](docs/stack-and-platforms.md)
- [Providers and rate limits](docs/providers.md)
- [Routes](docs/routes.md)
- [Roadmap](docs/roadmap.md)
- [Plan B](docs/plan-b.md)

## Status

Early stage. The collector and database schema are written, and traffic providers are being evaluated: not every provider has traffic data for Guatemala (see [providers](docs/providers.md)). Long-term data collection has not started.

## Development

Requires Node.js 20 or newer.

```
npm install
npm test          # includes SQL tests on an in-memory Postgres
npm run typecheck
npm run build     # builds the web app
npm run dev       # web app at http://localhost:3000, needs DATABASE_URL
```

The collector and the web app read their settings from environment variables; see [`.env.example`](.env.example). Never commit real keys. The collector needs `PROVIDER` set explicitly, so it never queries a provider by accident.

If no provider can legally store traffic data, see the [alternatives](docs/plan-b.md).

## License

[MIT](LICENSE)
