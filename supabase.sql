-- Al Día · base de datos en Supabase
-- Pégalo en SQL Editor y presiona Run. Si pegar todo junto da problemas
-- (por ejemplo desde el celular), corre los 4 bloques por separado, en orden.

-- ===== Bloque 1: tabla de tareas =====
create table if not exists public.tasks (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- ===== Bloque 2: solo tú puedes ver y cambiar tus tareas =====
alter table public.tasks enable row level security;

-- ===== Bloque 3: reglas de acceso =====
create policy "Ver mis tareas" on public.tasks
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Crear mis tareas" on public.tasks
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Editar mis tareas" on public.tasks
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Borrar mis tareas" on public.tasks
  for delete to authenticated using (user_id = (select auth.uid()));

-- ===== Bloque 4: cambios en vivo entre el celular y el computador =====
alter publication supabase_realtime add table public.tasks;
