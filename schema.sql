-- Organizador: dados separados por conta. Aplicado no Supabase via MCP.
create table public.org_projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check (length(trim(name)) between 1 and 160),
 description text not null default '',
 color text not null default '#55796b' check (color ~ '^#[0-9a-fA-F]{6}$'),
 due_date date,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(id, user_id)
);
create table public.org_tasks (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 project_id uuid,
 title text not null check (length(trim(title)) between 1 and 240),
 description text not null default '',
 next_action text not null default '',
 status text not null default 'todo' check (status in ('todo','doing','waiting','review','done')),
 priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
 due_date date,
 planned_date date,
 checklist jsonb not null default '[]' check (jsonb_typeof(checklist) = 'array'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 foreign key(project_id,user_id) references public.org_projects(id,user_id) on delete restrict
);
create index org_projects_owner_idx on public.org_projects(user_id);
create index org_tasks_owner_due_idx on public.org_tasks(user_id,due_date);
create index org_tasks_project_idx on public.org_tasks(project_id,user_id);
alter table public.org_projects enable row level security;
alter table public.org_tasks enable row level security;
create policy projects_owner on public.org_projects for all to authenticated
 using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy tasks_owner on public.org_tasks for all to authenticated
 using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.org_projects, public.org_tasks from anon;
grant select,insert,update,delete on public.org_projects, public.org_tasks to authenticated;
create function public.org_touch_updated_at() returns trigger language plpgsql
 security invoker set search_path = '' as $$
begin new.updated_at = clock_timestamp(); return new; end; $$;
create trigger projects_updated before update on public.org_projects
 for each row execute function public.org_touch_updated_at();
create trigger tasks_updated before update on public.org_tasks
 for each row execute function public.org_touch_updated_at();
