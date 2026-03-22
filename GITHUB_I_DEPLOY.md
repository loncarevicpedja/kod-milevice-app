# Povezivanje sa GitHub-om i deploy (Vercel)

## 1. Kreiraj repozitorijum na GitHub-u

1. Otvori **https://github.com** i uloguj se.
2. Klikni **"+"** u gornjem desnom uglu → **"New repository"**.
3. **Repository name:** npr. `kod-milevice-app` (ili kako želiš).
4. Ostavi **Public**.
5. **Nemoj** štiklirati "Add a README" / "Initialize with .gitignore" – repozitorijum treba da bude prazan.
6. Klikni **"Create repository"**.

## 2. Poveži Cursor projekat sa GitHub-om

U Cursor-u otvori **Terminal** (View → Terminal ili Ctrl+`). U rootu projekta (`kod-milevice-app`) pokreni:

```bash
# Zameni TVOJ_GITHUB_USERNAME i IME_REPO sa svojim podacima
git remote add origin https://github.com/TVOJ_GITHUB_USERNAME/IME_REPO.git
```

**Primer:** ako ti je GitHub username `predrag` i repo se zove `kod-milevice-app`:

```bash
git remote add origin https://github.com/predrag/kod-milevice-app.git
```

Zatim push na GitHub:

```bash
# Ako GitHub koristi granu "main", prvo preimenuj lokalnu:
git branch -M main
git push -u origin main
```

Ako želiš da ostane `master`:

```bash
git push -u origin master
```

(Prvi put će te možda pitati za GitHub username i password. Za password koristi **Personal Access Token** umesto lozinke – vidi ispod.)

## 3. GitHub prijava (ako zatraži)

GitHub više ne prihvata običnu lozinku za push. Moraš da koristiš **Personal Access Token**:

1. GitHub → **Settings** (tvoj profil) → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token** → označi **repo**.
3. Kopiraj token (samo jednom se prikazuje).
4. Kad terminal zatraži **Password**, nalepi taj token (ne svoju lozinku).

## 4. Deploy na Vercel

1. Otvori **https://vercel.com** i uloguj se (najlakše preko GitHub naloga).
2. **Add New** → **Project**.
3. Izaberi repozitorijum **kod-milevice-app** (ili kako si ga nazvao).
4. **Framework Preset:** Next.js (Vercel ga sam prepozna).
5. Klikni **Deploy**.

### Environment variables na Vercel-u

**Obavezno:** Bez ovih varijabli build na Vercel-u pada („supabaseUrl is required“).

Posle kreiranja projekta (ili pre prvog Deploy) idi u **Project → Settings → Environment Variables** i dodaj (vrednosti kao u `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL` – URL tvog Supabase projekta
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon key iz Supabase → Settings → API
- **`SUPABASE_SERVICE_ROLE_KEY`** – **service_role** ključ (Supabase → Settings → API). **Samo na serveru** – dodaj u Vercel i `.env.local`, **nemoj** `NEXT_PUBLIC_` prefiks. **Potreban je i za upis i za čitanje** tabele `restaurant_settings`: sa običnim (anon) ključem RLS često dozvoli upis preko API-ja ali **ne i SELECT**, pa forma i sajt vide „podrazumevana” stara vremena iako je baza tačna.
- `ADMIN_SECRET`
- `RESTAURANT_EMAIL`
- `RESEND_API_KEY`

Za svaku varijablu ostavi štiklirano **Production**, **Preview** i **Development** (ili bar Production i Preview), da build uvek ima pristup.

Zatim **Redeploy** (Deployments → tri tačkice na poslednjem deployu → Redeploy).

---

**Napomena:** `.env.local` se ne pushuje na GitHub (već je u `.gitignore`), zato moraš ručno da uneseš env varijable u Vercel-u.

### Supabase: tabela `restaurant_settings` (key / value)

Za cenu dostave, radno vreme i vremena koristi se tabela **`restaurant_settings`**: svaki **ključ** (`delivery_fee_rsd`, `weekday_work_start`, `weekend_work_end`, …) je **jedan red**, kolone su **`key`**, **`value`**, **`updated_at`**. Radno vreme za naručivanje je odvojeno za **pon–pet** i za **sub–ned**.

1. U Supabase otvori **SQL Editor**.
2. Pokreni **`supabase/restaurant_settings.sql`** (jednom).
3. Ako si ranije kreirao **staru** verziju ove tabele (jedan red sa više kolona), u SQL skripti je u komentaru naredba **`drop table`** – otkomentariši je pre pokretanja ili obriši tabelu ručno, pa ponovo pokreni skriptu.

Posle toga u admin panelu: **Podešavanja** (`/admin/podesavanja`).

Ako pri čuvanju vidiš grešku **„new row violates row-level security policy”**, proveri da je **`SUPABASE_SERVICE_ROLE_KEY`** postavljen (i **Redeploy** na Vercel-u posle dodavanja). Više u `supabase/restaurant_settings_rls_note.sql`.
