# Routes

Every route is measured in **both directions**, because congestion flips with the time of day (toward the city in the morning, outward in the evening).

Coordinates live in [`routes.json`](../routes.json). Long corridors have intermediate waypoints so the routing API does not take a shortcut off the avenue being measured.

| # | Slug | Route | From | To | Waypoints |
|---|---|---|---|---|---|
| 1 | `interamericana-full` | Interamericana (priority) | Bulevar Los Proceres | San Lucas Sacatepequez | 3 |
| 1a | `interamericana-urban` | Interamericana, urban section | Bulevar Los Proceres | Km 15 | 3 |
| 1b | `interamericana-outer` | Interamericana, outer section | Km 15 | San Lucas Sacatepequez | 0 |
| 2 | `aguilar-batres` | Calzada Aguilar Batres | Trebol | Villa Nueva (entrance) | 0 |
| 3 | `periferico` | Periferico | Near USAC | Zona 1 | 4 |
| 4 | `vista-hermosa` | Bulevar Vista Hermosa | Zona 15 | Zona 4 | 0 |
| 5 | `san-cristobal` | Bulevar San Cristobal (Mixco, Zona 8) | Bulevar San Cristobal | Calzada Roosevelt | 0 |
| 6 | `calzada-san-juan` | Calzada San Juan | Start of the avenue | End of the avenue (La Florida, Zona 19) | 0 |
| 7 | `mateo-flores` | Calzada Mateo Flores | Start of the avenue | End of the avenue | 0 |
| 8 | `calle-marti` | Calle Marti | City entrance from Puerto Barrios | Into the city | 0 |

Route 1 is split into 1a and 1b so the bottleneck can be located, not just measured as a total. The Km 15 point is the same in 1a and 1b.

## Series count

10 corridors, both directions: 20 series. Details of the request budget are in [providers](providers.md).

## Configuration format

`routes.json` is an array with one entry per route. Adding or removing a route means editing one entry.

```json
{
  "slug": "periferico",
  "name": "Periférico: cerca de la USAC a Zona 1",
  "origin": { "lat": 14.59289, "lng": -90.55092 },
  "destination": { "lat": 14.64281, "lng": -90.52267 },
  "waypoints": [{ "lat": 14.60839, "lng": -90.55739 }],
  "bothDirections": true,
  "active": true
}
```

Waypoints are listed in driving order from origin to destination. For the reverse direction, the collector swaps origin and destination and reverses the waypoints.
