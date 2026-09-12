# Here & There ☀️ (Aquí & Allá)

Trip-proposal app for Eleny & Luis — Next.js 14 + Postgres (Neon) + Railway.

This is the same app you already saw as a single HTML file, ported into a
Next.js project so it can be deployed for real and so the "Daily priority
pick" ranking persists in a proper database instead of browser-only storage.

## What's here

- `app/page.tsx` — mounts the app (same markup/CSS/logic as the HTML
  prototype, unchanged visually).
- `app/api/state/route.ts` — GET/POST endpoint that reads/writes the
  priority ranking, blocked destinations, and the 24h cooldown timestamp.
- `prisma/schema.prisma` — one table (`app_state`) holding that state.
- `public/images/` — logo, hero photo, background photo, and both maps
  (previously embedded as base64, now real files).

Destinations, prices, highlights, and photos still live in `app/page.tsx`
(inside the embedded script, in the `REGIONS` object) — same as before.
Moving that into the database too is a natural next step once you're
comfortable editing it there instead of in code.

## Run it locally

```bash
npm install
cp .env.example .env       # paste your real Neon connection string in .env
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000.

## Deploy: Neon (database)

1. Create a free project at https://neon.tech
2. Copy the pooled connection string into `DATABASE_URL` (Railway env vars,
   see below) and into your local `.env` for migrations.
3. Run `npx prisma migrate deploy` once against that URL to create the
   `app_state` table (or `prisma migrate dev` locally, which does the same
   plus keeps a migration history in `prisma/migrations`).

## Deploy: Railway (hosting)

1. `npm install -g @railway/cli` (if you don't have it) then `railway login`
2. From this folder: `railway init`
3. `railway variables set DATABASE_URL="<your Neon pooled URL>"`
4. `railway up`
5. Railway will build with `npm run build` and start with `npm run start`
   (already wired in `package.json`, which reads Railway's `PORT`).

That's the whole loop — from here it's normal Claude Code work: `railway
logs` to debug, `railway open` to grab the live URL to send to Eleny.

## Notes / things to revisit later

- The passcode for Luis's admin view is still checked client-side in
  `app/page.tsx` (search `ADMIN_CODE`) — fine for a private link between
  two people, not meant to be real auth.
- `app_state` is a single row (id=1) — enough for "one couple, one trip."
  If this ever needs more than one pair of travelers, give `AppState` a
  real user/session id instead of the fixed `id: 1`.
