-- Opciono: dodaj ključeve za pon–pet i sub–ned ako ih još nema u bazi.
-- Ako ti fale samo vikend redovi, možeš i restaurant_settings_weekend_only.sql
-- Aplikacija i dalje čita stare work_start_time / work_end_time dok ne sačuvaš u Admin → Podešavanja.

insert into public.restaurant_settings (key, value) values
  ('weekday_work_start', '12:00'),
  ('weekday_work_end', '23:00'),
  ('weekend_work_start', '14:00'),
  ('weekend_work_end', '23:00')
on conflict (key) do nothing;
