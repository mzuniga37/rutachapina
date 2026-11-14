-- Apply once: psql "$DATABASE_URL" -f schema.sql
-- shortcut: no migration system, one table; add migrations when the schema starts changing.
create table if not exists samples (
  id                bigint generated always as identity primary key,
  route_slug        text        not null,
  direction         text        not null check (direction in ('forward', 'reverse')),
  provider          text        not null,
  sampled_at        timestamptz not null default now(),
  travel_time_s     integer     not null,
  no_traffic_time_s integer,
  delay_s           integer,
  length_m          integer
);

-- No policies on purpose: the public API key cannot read or write samples.
-- The collector connects straight to Postgres, which bypasses RLS.
alter table samples enable row level security;

create index if not exists samples_route_time_idx
  on samples (route_slug, direction, sampled_at);
