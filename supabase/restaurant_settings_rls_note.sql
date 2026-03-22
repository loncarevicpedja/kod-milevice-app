-- =============================================================================
-- RLS greška: "new row violates row-level security policy"
-- =============================================================================
-- Admin API koristi service role (SUPABASE_SERVICE_ROLE_KEY) za upsert u
-- restaurant_settings – to zaobilazi RLS i ne zahteva ove politike za upis.
--
-- Ako želiš da javni (anon) ključ može samo da ČITA podešavanja, možeš dodati:
-- =============================================================================

-- alter table public.restaurant_settings enable row level security;

-- create policy "restaurant_settings_select_anon"
-- on public.restaurant_settings
-- for select
-- to anon, authenticated
-- using (true);

-- Upis admina i dalje ide preko service role u kodu (preporučeno).
