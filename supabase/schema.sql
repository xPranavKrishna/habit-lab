create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id text primary key,
 display_name text,
 created_at timestamptz not null default now()
);

create table if not exists public.tasks (
 id uuid primary key default gen_random_uuid(),
 user_id text not null references public.profiles(id) on delete cascade,
 title text not null,
 category text not null default 'Other',
 minutes integer not null default 30,
 xp integer not null default 50,
 active boolean not null default true,
 created_at timestamptz not null default now()
);

create table if not exists public.task_logs (
 id uuid primary key default gen_random_uuid(),
 task_id uuid not null references public.tasks(id) on delete cascade,
 user_id text not null references public.profiles(id) on delete cascade,
 completed_on date not null default current_date,
 completed_at timestamptz not null default now(),
 unique(task_id, completed_on)
);

create table if not exists public.ideas (
 id uuid primary key default gen_random_uuid(),
 user_id text not null references public.profiles(id) on delete cascade,
 text text not null,
 created_at timestamptz not null default now()
);

create table if not exists public.songs (
 id uuid primary key default gen_random_uuid(),
 user_id text not null references public.profiles(id) on delete cascade,
 title text not null,
 created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.ideas enable row level security;
alter table public.songs enable row level security;

drop policy if exists "profiles own rows" on public.profiles;
create policy "profiles own rows" on public.profiles for all using ((auth.jwt()->>'sub') = id) with check ((auth.jwt()->>'sub') = id);

drop policy if exists "tasks own rows" on public.tasks;
create policy "tasks own rows" on public.tasks for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "task logs own rows" on public.task_logs;
create policy "task logs own rows" on public.task_logs for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "ideas own rows" on public.ideas;
create policy "ideas own rows" on public.ideas for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "songs own rows" on public.songs;
create policy "songs own rows" on public.songs for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists task_logs_user_date_idx on public.task_logs(user_id, completed_on);
create index if not exists ideas_user_id_idx on public.ideas(user_id);
create index if not exists songs_user_id_idx on public.songs(user_id);

-- Paradhushanam (Gossips & Persons)
create table if not exists public.gossips (
 id uuid primary key default gen_random_uuid(),
 user_id text not null references public.profiles(id) on delete cascade,
 content text not null,
 created_at timestamptz not null default now()
);

create table if not exists public.persons (
 id uuid primary key default gen_random_uuid(),
 user_id text not null references public.profiles(id) on delete cascade,
 name text not null,
 type text not null,
 tag text,
 description text,
 created_at timestamptz not null default now()
);

alter table public.gossips enable row level security;
alter table public.persons enable row level security;

drop policy if exists "gossips own rows" on public.gossips;
create policy "gossips own rows" on public.gossips for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "persons own rows" on public.persons;
create policy "persons own rows" on public.persons for all using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

create index if not exists gossips_user_id_idx on public.gossips(user_id);
create index if not exists persons_user_id_idx on public.persons(user_id);
