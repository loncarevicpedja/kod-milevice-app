-- Podešavanja restorana: jedan red po ključu (key / value).
-- Pokreni u Supabase → SQL Editor.

-- Ako si ranije kreirao staru verziju tabele (jedan red sa više kolona), obriši je:
-- drop table if exists public.restaurant_settings;

create table if not exists public.restaurant_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

insert into public.restaurant_settings (key, value) values
  ('delivery_fee_rsd', '200'),
  ('prep_time_minutes', '25'),
  ('delivery_extra_minutes', '25'),
  ('weekday_work_start', '12:00'),
  ('weekday_work_end', '23:00'),
  ('weekend_work_start', '14:00'),
  ('weekend_work_end', '23:00'),
  ('menu_cart_enabled', 'true'),
  ('order_email_enabled', 'false')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

comment on table public.restaurant_settings is 'Key-value podešavanja (cena dostave, vremena, radno vreme)';
