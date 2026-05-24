-- =============================================================================
-- Radno vreme SUBOTE i NEDELJE (odvojeno, sa neradnim danom)
-- Tabela: public.restaurant_settings (key / value / updated_at)
-- =============================================================================
-- Pokreni u Supabase → SQL Editor (jednom).
-- Ako redovi već postoje, ništa se ne menja (do nothing).
-- Stari weekend_work_* ključevi ostaju u bazi; aplikacija ih koristi kao fallback
-- dok ne sačuvaš u Admin → Podešavanja.
-- =============================================================================

insert into public.restaurant_settings (key, value) values
  ('saturday_work_start', '14:00'),
  ('saturday_work_end', '23:00'),
  ('saturday_closed', 'false'),
  ('sunday_work_start', '14:00'),
  ('sunday_work_end', '23:00'),
  ('sunday_closed', 'false')
on conflict (key) do nothing;
