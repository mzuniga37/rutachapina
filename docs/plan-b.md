# Plan B: if no provider allows storing traffic data

The main plan depends on a commercial provider that both has traffic data for Guatemala City and allows its results to be stored (see [providers](providers.md)). Today only Mapbox has traffic data here, and its storage terms are unconfirmed. This document lists the alternatives, so the project does not depend on one answer.

Everything below is a set of options, not decisions. Items marked **not verified** come from a single search and must be checked at the source before relying on them.

## Options

| Option | Data comes from | Cost | Effort | Main risk |
|---|---|---|---|---|
| A. Own GPS trips | Phones of volunteers driving the corridors | Free | High | Few trips means sparse data |
| B. Public data request | Municipal traffic systems | Free | Low to start | May be refused or slow |
| C. Waze for Cities Data | Waze, through a public agency | Free (per program description) | Needs a partner agency | Not open to individuals |
| D. Live-only product | A provider queried on demand, nothing stored | Per-request | Low | No history, no forecasting |

## A. Own GPS trips

Volunteers run a tracking app on their phone while driving. The server receives the points, detects when a trip crosses a corridor from its start to its end, and stores that travel time.

- The OwnTracks apps can post locations to any HTTP endpoint you control, with no MQTT broker ([OwnTracks HTTP mode](https://owntracks.org/booklet/tech/http/), [usage scenarios](https://owntracks.org/booklet/guide/scenarios/)). One source notes the Android app was described as unmaintained in 2018; later sources list it as current, so check the store listing first (**not verified**). GPS Logger is named as an alternative.
- What has to be built: an ingest endpoint, matching trips to corridors (for example "virtual gates" at each end), and removing trips that stop or detour.
- Data is real and fully ours, with no third-party terms. But coverage depends on how many people drive each corridor at each hour, so it is likely too sparse to be the main source at first.
- Privacy: trips are personal location data. Collect only with explicit consent, keep only the corridor travel time (not the path), and never publish individual trips.

A smaller version is valuable even if the main plan works: a few timed trips are the ground truth needed to measure how accurate any provider is.

## B. Public data request

The Municipality of Guatemala operates a connected traffic light network. Its manager has said that its analytics cover travel times, average speed and stopped time on the main roads, and the national Ministry of Communications (CIV) has installed 350 traffic cameras with speed and volume analytics ([Emisoras Unidas](https://emisorasunidas.com/nacional/2026/07/13/municipalidad-guatemala-capital-transito-semaforos-conectados/), [Centroamérica 360](https://centroamerica360.com/region/monitoreo-inteligente-del-transito-instalan-350-camaras-en-el-area-metropolitana-de-guatemala)).

- No public download page, API or license was found for any of these datasets, and the city's [data strategy](https://docs.muniguate.com/2025/datos/EstrategiaDeDatosMuni.pdf) says open data will be developed progressively.
- The next step would be a written request for aggregated travel times or speeds on specific avenues, to EMETRA, the Municipality, or CIV. A request under the access to public information law is also an option (**check the current law and procedure before relying on it**).
- A data-sharing agreement with a public body could also unlock option C.

## C. Waze for Cities Data

Waze runs a free data-sharing program for public agencies, formerly called Connected Citizens, where partners receive a traffic feed in exchange for sharing their own data ([overview](https://waze.com/wiki/USA/Waze_for_Cities), [program history](https://datacollaboratives.org/cases/waze-connected-citizens.html)).

- It is built for governments, not individuals, so this project could only use it through a partner agency (**current eligibility not verified**).
- Whether the Municipality of Guatemala already takes part is unknown.

## D. Live-only product

Query a provider at the moment a user asks, and show the result without storing it. This avoids storage restrictions but removes the point of the project: a single number now, with no history and no ranges.

## Suggested order

1. Wait for Mapbox's written answer on storage.
2. In parallel, collect a handful of timed trips (option A, small scale) to measure provider accuracy.
3. If Mapbox says no, or does not answer, start option B: a written data request to the municipal and national traffic bodies.
4. Build the full volunteer pipeline (option A) only if B and C lead nowhere, because it is the most work and the thinnest data.
