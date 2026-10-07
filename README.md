# KERN

Don't guess your passion, test it. Try short missions in design, writing, code, video, selling and music, free. Installable web app (PWA) by Manuel Di Paolo.

## Run it

```bash
npm install
npm run dev      # http://localhost:4322
npm run build    # static site in dist/
npm test         # sync rules, next-mission and rounds rules, every mission complete and translated, the distress screen (same in app and server), the Studio and the usage report maths
npm run stats    # usage numbers from people who opted in (see docs/ANALYTICS.md)
```

## Show it in a minute (demo profile)

Open the app address followed by `/?demo` once on a phone. It opens a labelled sample profile (rank Cairn, six sample answers, two finds, three versions of an idea in KERN.AI, a Kern card ready, round 2 waiting) so the app can be shown without playing through the first run. Tap the gold DEMO marker in the header twice to leave it (the first tap only asks), or open `/?demo=off` (`off`, `0`, `false` and `no` leave it; the flag only works on the app page, not on `/privacy/`). A sheet or the reward screen repeats a Demo tag at the top right, and Delete my data inside the demo only resets the sample, and leaving the demo throws it away (what a visitor typed in it too), so the next visitor gets a fresh one. The demo has its own storage (`kern:demo`), never syncs, never publishes a sign and is never counted, and it does not touch the real trail. The answers and numbers in it are sample data, not users.

## Deploy on Netlify

Add new site, Import from Git, pick this repository. Settings come from `netlify.toml` (build `npm run build`, publish `dist`, Node 22). Every push to `main` redeploys.

Without the two Supabase variables below, KERN runs without accounts and everything stays on the device.

## Accounts and sync (Supabase)

1. Create a project at supabase.com. Pick an EU region (for example Frankfurt).
2. SQL Editor, New query: paste `supabase/schema.sql` and Run. It creates the `kern_state` table with Row Level Security (each user reads and writes only their own row) the `delete_my_account` function, the `kern_signs` table with `add_sign` / `delete_my_sign` for signs on the trail, and the `kern_events` table with `log_event` / `forget_events` for usage counts without names. Run it again after updating: every statement is safe to repeat. (Round 2 needs this once: it widens the `kern_signs` mission limit from 0-2 to 0-5. Until you run it, a sign left on missions 4 to 6 is rejected by the database and just stays on the device.)
3. Project Settings, API: copy the Project URL and the anon (publishable) key. The key is meant to be public; the database rules protect the data.
4. Netlify, Site configuration, Environment variables: add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, then redeploy. For local dev copy `.env.example` to `.env` and fill it in.
5. Supabase, Authentication, URL Configuration: set Site URL to your Netlify address (for example `https://kern.netlify.app`) and add `https://kern.netlify.app/**` and `http://localhost:4322/**` to Redirect URLs.
6. Authentication, Sign In / Providers, Email: keep "Confirm email" on. It also stops strangers from finding out which emails have an account.
7. Before real users sign up, set a custom SMTP sender (Authentication, Emails, SMTP settings, with Resend, Brevo or Postmark). The built-in sender only delivers to your own team's addresses and a few emails per hour.

Email links (confirm, reset password) sign you in on the device and browser where you asked for them. Opened elsewhere, the app says so and offers to log in there instead.

## What is in it

- Optional account: sign up, log in, forgot password, log out, delete account; the trail syncs across devices and merges with what was on the device
- Or no account: local profile (first name, 18+ confirmation), everything stays in the browser
- Onboarding: the choice first, then one or more interests (fields); on Missions you switch path in one tap and progress is kept per field, "+ Add" picks more. Missions, yourKERN, Trail, KERN.AI co-pilot (it only asks questions: live through Claude via a Netlify function when online, with a scripted fallback)
- Home: your next mission first, then your 3 missions with status (done / next / draft)
- Rounds: every field has 6 missions, shown 3 at a time. Round 1 unlocks your Kern card; finishing it shows a "round complete" moment on Home. Round 2 is never locked: a "Round 2" link under the list shows it from day one. Round 2 repeats the same three kinds (improve what exists, start from zero, work with a partner), so the card gets sharper with every round. After a reward, the button leads straight into the next mission of the round. Missions live in `fields.ts`, `missions.ts`, `helps.ts` and `easy.ts` (same order in all four); `npm test` checks they match
- Brand missions: a mission can be presented by a brand, shown as "Brand mission · name" in the brand colour. The mission text stays brand-neutral (a made-up subject), so a deal is one line in `src/scripts/sponsors.ts`. The three in the app are samples, marked "(sample)", not real partners
- Mission Studio: `node scripts/mission-studio.mjs` has Claude draft a new English and Italian mission from a field, a kind and a subject, 29 automatic rules check it, and a person approves it. It needs `ANTHROPIC_API_KEY` for a live run and is covered offline by `npm test`. The authoring guide is `docs/MISSIONS.md`
- Usage counts without names: off until a person says yes (one card on Home, a switch in Settings). A random code plus the kind of event, field, mission, language and time, never a name or anything they wrote; deleted when they switch off, delete their data, or at 12 months. `npm run stats` turns it into pilot numbers, with small samples shown as counts, not percentages. Needs the Supabase variables. Guide: `docs/ANALYTICS.md`
- Answers with automatic drafts; edit or delete them (with Undo); +50 stones per answer, +20 for a reflection
- Quick reflection after each answer (how it felt, would you do it again, hardest part, a sign for the next person)
- Signs on the trail: with an account, the sign you leave is shown without your name to the next people who open that mission (`kern_signs` in `supabase/schema.sql`: public read of tip and date only, writes through `add_sign` / `delete_my_sign`, 20 a day each, no links, emails or long numbers). Deleting the answer removes its sign
- Badges for real milestones (first answer, first reflection, full trail, dare sent...)
- Real "first guess" and Kern card built from your reflections; Kern card shared as a 1080x1350 image
- Share your Kern card, dare a friend, copy links (native share sheet, clipboard fallback); dare links open the same mission
- Weekly reminder as a calendar file (no notifications permission, no streaks)
- Pilot: "Share my trail with the KERN team" sends answers and reflections as plain text
- EN / IT, system / dark / light theme
- Installable and works offline after the first visit (`public/sw.js`); security headers and CSP in `netlify.toml`
- Export and delete your data from Settings; privacy page at `/privacy/`
- Design (v1.0): one 3D object per screen, italic serif accents (Instrument Serif), energy bars from your reflections, a 28-day rhythm grid, a floating tab bar, film grain; View Transitions slide the panes and fly the chosen field object into the mission card (plain swap where unsupported, nothing moves with reduced motion)

The classic design before v1.0 is kept on the `classic-design` branch and the `v0.4-classic` tag.

## Not built yet

Real partner missions (brand missions are demos for now), peer review and ranking, push notifications, payments, premium missions with free windows, a live analytics dashboard (the numbers come from `npm run stats`).

## Structure

- `src/pages/index.astro` markup, `src/styles/app.css` styles, `src/scripts/app.ts` logic
- `src/scripts/cloud.ts` accounts and sync (loaded only when the Supabase variables are set), `supabase/schema.sql` database setup
- `src/scripts/i18n.ts` Italian strings (English is the source), `src/scripts/fields.ts` missions per field
- `src/scripts/next.ts` rounds and the next-mission rule, `src/scripts/sponsors.ts` brand missions, `src/scripts/stats.ts` opt-in usage counts, `src/scripts/demo.ts` the demo profile's sample trail (texts in both languages)
- `scripts/` the tests run by `npm test`, and the Mission Studio
- `public/` manifest, service worker, icons, favicons; `public/img/` 3D objects (fields, ranks, cairn, co-pilot orb)

## License

© 2026 Manuel Di Paolo. All rights reserved. This code is not open source: see [LICENSE](LICENSE).
