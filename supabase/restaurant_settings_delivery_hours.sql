-- =============================================================================
-- Interval dostave (pon–pet, subota, nedelja)
-- Tabela: public.restaurant_settings (key / value / updated_at)
-- =============================================================================
-- Pokreni u Supabase → SQL Editor (jednom).
-- Ako redovi već postoje, ništa se ne menja (do nothing).
-- Ako ključevi još nisu u bazi, aplikacija koristi interval naručivanja
-- dok ne sačuvaš u Admin → Podešavanja.
-- =============================================================================

insert into public.restaurant_settings (key, value) values
  ('weekday_delivery_start', '12:00'),
  ('weekday_delivery_end', '22:45'),
  ('saturday_delivery_start', '14:00'),
  ('saturday_delivery_end', '22:45'),
  ('sunday_delivery_start', '14:00'),
  ('sunday_delivery_end', '22:45')
on conflict (key) do nothing;
