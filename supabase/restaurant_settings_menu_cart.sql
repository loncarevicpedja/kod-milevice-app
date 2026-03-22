-- Ključ za dozvolu dodavanja u korpu (meni + naručivanje). Podrazumevano uključeno.
insert into public.restaurant_settings (key, value) values
  ('menu_cart_enabled', 'true')
on conflict (key) do nothing;
