import { unstable_cache } from "next/cache";
import routes from "../routes.json";
import { pool } from "../lib/db";
import { rangesFor, type Range } from "../lib/ranges";
import type { Direction } from "../scripts/routes";

// All visitors share one database query per route and direction every 5 minutes.
// A failed query is not cached, so the next visit retries.
const cachedRanges = unstable_cache(
  (slug: string, dir: Direction) => rangesFor(pool(), slug, dir),
  ["ranges"],
  { revalidate: 300 },
);

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const FIRST_BLOCK = 5 * 4; // 05:00
const LAST_BLOCK = 22 * 4; // 22:00

type Search = { route?: string; dir?: string; day?: string };

const minutes = (seconds: number) => Math.round(seconds / 60);
const clock = (block: number) =>
  `${String(Math.floor(block / 4)).padStart(2, "0")}:${String((block % 4) * 15).padStart(2, "0")}`;
// Guatemala is UTC-6 all year.
const todayInGuatemala = () => new Date(Date.now() - 6 * 3600 * 1000).getUTCDay();

function href(route: string, dir: Direction, day: number) {
  return `/?route=${route}&dir=${dir}&day=${day}`;
}

export default async function Page({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  const active = routes.filter((r) => r.active);
  const route = active.find((r) => r.slug === q.route) ?? active[0];
  const dir: Direction = q.dir === "reverse" ? "reverse" : "forward";
  const day = /^[0-6]$/.test(q.day ?? "") ? Number(q.day) : todayInGuatemala();

  let ranges: Range[] = [];
  let failed = false;
  try {
    ranges = (await cachedRanges(route.slug, dir)).filter(
      (r) => r.dow === day && r.block >= FIRST_BLOCK && r.block <= LAST_BLOCK,
    );
  } catch (e) {
    console.error("ranges query failed:", e);
    failed = true;
  }
  const scale = Math.max(600, ...ranges.map((r) => r.p90)); // at least 10 minutes wide

  return (
    <main>
      <h1>Ruta Chapina</h1>
      <p className="lead">Cuánto tardarás de verdad: un rango, no un solo número.</p>

      <nav aria-label="Ruta">
        {active.map((r) => (
          <a key={r.slug} href={href(r.slug, dir, day)} aria-current={r.slug === route.slug ? "page" : undefined}>
            {r.name.split(":")[0]}
          </a>
        ))}
      </nav>
      <nav aria-label="Sentido">
        <a href={href(route.slug, "forward", day)} aria-current={dir === "forward" ? "page" : undefined}>Ida</a>
        <a href={href(route.slug, "reverse", day)} aria-current={dir === "reverse" ? "page" : undefined}>Vuelta</a>
      </nav>
      <nav aria-label="Día">
        {DAYS.map((d, i) => (
          <a key={d} href={href(route.slug, dir, i)} aria-current={i === day ? "page" : undefined}>{d}</a>
        ))}
      </nav>

      <h2>{route.name}</h2>

      {failed ? (
        <p className="note">No pudimos leer los datos en este momento. Intenta de nuevo en unos minutos.</p>
      ) : ranges.length === 0 ? (
        <p className="note">Todavía no hay datos para este día. Estamos empezando a recolectarlos.</p>
      ) : (
        <ol className="chart">
          {ranges.map((r) => (
            <li key={r.block} className={r.lowConfidence ? "faint" : undefined}>
              <time>{clock(r.block)}</time>
              <span className="track">
                <span
                  className="range"
                  style={{ left: `${(r.p10 / scale) * 100}%`, width: `${((r.p90 - r.p10) / scale) * 100}%` }}
                />
                <span className="median" style={{ left: `${(r.p50 / scale) * 100}%` }} />
              </span>
              <span className="label">
                {minutes(r.p10)}–{minutes(r.p90)} min
                {r.lowConfidence ? ` (pocas muestras: ${r.n})` : ""}
              </span>
            </li>
          ))}
        </ol>
      )}

      <p className="note">
        La barra va de un buen día (p10) a un mal día (p90); la marca es el día típico (p50). Datos propios,
        recolectados en la ruta. <a href="https://github.com/mzuniga37/rutachapina">Código y metodología</a>.
      </p>
    </main>
  );
}
