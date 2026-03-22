-- =============================================================================
-- Radno vreme VIKENDOM (subota + nedelja)
-- Tabela: public.restaurant_settings (key / value / updated_at)
-- U aplikaciji su potrebna DVA reda: početak i kraj intervala za vikend.
-- =============================================================================
-- Pokreni u Supabase → SQL Editor (jednom).
-- Ako redovi već postoje, ništa se ne menja (do nothing).
-- =============================================================================

insert into public.restaurant_settings (key, value) values
  ('weekend_work_start', '14:00'),
  ('weekend_work_end', '23:00')
on conflict (key) do nothing;

-- (Opciono) Ako želiš da PRISILNO ažuriraš vrednosti čak i kada redovi postoje:
-- insert into public.restaurant_settings (key, value) values
--   ('weekend_work_start', '14:00'),
--   ('weekend_work_end', '23:00')
-- on conflict (key) do update set
--   value = excluded.value,
--   updated_at = now();
