# Routes

Every route is measured in **both directions**, because congestion flips with the time of day (toward the city in the morning, outward in the evening).

Exact coordinates are **pending**: they will be set by dropping pins on a map. Long corridors also get one or two intermediate waypoints so the routing API does not take a shortcut off the avenue being measured.

| # | Route | From | To | Status |
|---|---|---|---|---|
| 1 | Interamericana (priority) | Bulevar Los Proceres | San Lucas Sacatepequez | Pins pending |
| 1a | Interamericana, urban section | Bulevar Los Proceres | Km 15 | Pins pending |
| 1b | Interamericana, outer section | Km 15 | San Lucas Sacatepequez | Pins pending |
| 2 | Calzada Aguilar Batres | Trebol | Villa Nueva (entrance) | Pins pending |
| 3 | Periferico | Near USAC | Zona 1 | Pins pending |
| 4 | Bulevar Vista Hermosa | Zona 15 | Zona 4 | Pins pending |
| 5 | Bulevar San Cristobal (Mixco, Zona 8) | Bulevar San Cristobal | Calzada Roosevelt | Pins pending |
| 6 | Calzada San Juan | Start of the avenue | San Pedro Sacatepequez | Pins pending |
| 7 | Calzada Mateo Flores | Start of the avenue | End of the avenue | Pins pending |
| 8 | Calle Marti | City entrance from Puerto Barrios | Into the city | Pins pending |

Route 1 is split into 1a and 1b so the bottleneck can be located, not just measured as a total.

## Series count

10 corridors, both directions: 20 series. Details of the request budget are in [providers](providers.md).

## Configuration format (planned)

Routes will live in `routes.json` at the repo root:

```json
{
  "slug": "interamericana-full",
  "name": "Interamericana: Los Proceres to San Lucas",
  "origin": { "lat": 0, "lng": 0 },
  "destination": { "lat": 0, "lng": 0 },
  "waypoints": [],
  "bothDirections": true,
  "active": true
}
```

Adding or removing a route means editing one entry. Placeholder coordinates above are not real.
