# Stack and platforms

The goal is to run everything at **zero cost**. Free-tier limits change, so confirm current numbers before relying on them.

## Platforms

| Role | Platform | Why | Watch out for |
|---|---|---|---|
| Source code and CI | GitHub | Free, hosts the repo and Actions | Private repos have a monthly Actions minutes cap; public repos do not |
| Collector scheduler | GitHub Actions (`schedule`) | Free cron, no server to run | Minimum interval is 5 min and runs can be delayed by a few minutes; scheduled workflows are disabled after 60 days without repo activity |
| Database | Supabase or Neon (PostgreSQL) | Free tier is enough for a few hundred rows per day | Free projects can pause when idle; storage cap on the free plan |
| Frontend | Vercel (Hobby) | Free, native Next.js | Non-commercial use on the free plan; Vercel cron on Hobby only runs once per day, so it is not used for collection |
| Traffic data | TomTom (first candidate) | Generous free daily quota | See [providers](providers.md) |

Railway was considered for the collector and database, but it is no longer free, so it was dropped.

Fallback scheduler if GitHub Actions timing proves unreliable: Cloudflare Workers Cron Triggers (free, more punctual).

## Technologies

| Layer | Choice |
|---|---|
| Language | TypeScript (collector and web share types) |
| Runtime | Node.js (current LTS) |
| Collector | Plain Node script, run by GitHub Actions |
| Database access | Typed SQL client (to be chosen when the collector is built) |
| Web | Next.js (App Router) |
| Charts | A lightweight charting library, chosen in the frontend phase |
| Package manager | npm |
| CI | GitHub Actions: lint, type-check, tests |
| Tests | Vitest for the collector and aggregation logic |

## Repository layout (planned)

```
rutachapina/
  collector/    scheduled script and provider adapters
  web/          Next.js app
  db/           migrations and SQL
  config/       route definitions
  docs/         documentation
  .github/workflows/
```

## Environments and secrets

- API keys and the database URL live in GitHub Actions secrets and Vercel environment variables.
- Nothing secret is committed. A `.env.example` documents the variables.

## Branching

- Two branches only: `main` and `dev`.
- All work is pushed to `dev`. When CI is green, a pull request to `main` can be opened.
- Commits follow Conventional Commits, in English, small and atomic.
