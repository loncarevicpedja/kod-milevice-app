-- Slanje porudžbine na email: podrazumevano ISKLJUČENO (samo POS / baza).
-- Uključi u Admin → Podešavanja ili postavi value na 'true' ovde.
-- Supabase → SQL Editor → Run

insert into public.restaurant_settings (key, value) values
  ('order_email_enabled', 'false')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
