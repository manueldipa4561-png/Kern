# Usage numbers

KERN can count what pilot users do, without their names, and only for people who say yes. The random code it uses is still personal data (it is pseudonymous), which is why it is opt-in and why the privacy page explains it. This page is how to switch it on, read the numbers, and quote them honestly.

## What is counted

When someone says yes (a card on Home, or Settings), their device makes a random code and sends one short line per event to your Supabase database:

| Event | When |
|---|---|
| `optin` | they said yes |
| `visit` | first time KERN is opened that day |
| `open` | a mission is opened to answer |
| `answer` | a new answer is sent |
| `reflect` | a reflection is saved |
| `share` | Share or dare link is tapped |
| `ask_ai` | KERN.AI is asked for help inside a mission |

Each line also has the field, the mission number, whether it is a brand mission, the language and the time. Never a name, an email, an answer, a draft, a chat message or an account. Nobody can read the table from the app, even signed in. Switching off, Delete my data, Log out and Delete my account all delete that device's lines. The privacy page promises to delete lines after 12 months: see "Keeping the 12-month promise" below.

## Set up (once)

1. Supabase, SQL Editor: run `supabase/schema.sql` again. Every statement is safe to repeat. It adds the `kern_events` table and two functions.
2. Supabase, Project Settings, API: copy the **service_role** key (the secret one). Put it in `.env` as `SUPABASE_SERVICE_KEY=...`. `.env` is ignored by git. Never put it in Netlify and never in a `PUBLIC_` variable: it can read the whole database.
3. `PUBLIC_SUPABASE_URL` in `.env` must be the same address the deployed app uses.
4. Deploy the site with the two Supabase variables set. Counting only exists where they are set.

### Keeping the 12-month promise

The database removes old lines (500 at a time) whenever new events arrive. If KERN goes quiet that never happens, so do one of these:

- Once, in Supabase, Database, Extensions: enable `pg_cron`, then in the SQL Editor run the statement written in the comment above `log_event` in `supabase/schema.sql`. It cleans up every night.
- Or, whenever you check in, run the same clean-up by hand: remove the lines from `kern_events` whose `created_at` is more than 12 months ago.

## Read the numbers

```bash
npm run stats            # the report
npm run stats -- --json  # the same numbers for a spreadsheet
```

It prints how many people said yes, how many opened a mission, answered, reflected, finished a round, started round 2, shared, asked KERN.AI, and how many came back on another day. Day 1 and day 7 only count people whose day 1 or day 7 is already over, so someone who joined yesterday never drags day 1 down before the day has finished. Then it breaks the same down by field (missions opened and answered, once per person per mission) and by mission, and compares brand missions with the others.

## How to quote them

- The numbers cover **people who said yes**, not everyone who used KERN. Say so, and say how many people you invited. "7 of the 9 people I invited said yes; 5 of those 7 wrote an answer, 3 came back the next day."
- Under 30 people, quote counts, not percentages. The report does this for you: it prints "5 of 7" and only adds a percentage when the group is 30 or more.
- A person is a browser. Clearing browser data or using a second phone makes a new person.
- Events sent while a phone is offline are lost, so the numbers lean low, not high.
- Brand missions are demos with three sponsors and a handful of people: show the line, do not claim a trend.

## Limits

- Anyone can send fake lines with the public key. The database caps each code at 300 events a day and everyone together at 2,000 an hour (a script could still add about 50,000 lines a day, roughly 10 MB, and while the cap is hit real events are dropped). The report cannot tell a real person from a script, so check the numbers against the people you actually met.
- A person who logs out of an account is counted as a new person if they say yes again, because Log out also deletes the counts of that device.
- "Started round 2" can be larger than "finished all 3": round 2 is never locked. A reflection can outnumber answers if an answer event was lost offline.
- There is no live dashboard. Run the report on your laptop.
- A new round needs `mission` widened in `supabase/schema.sql` for both `kern_signs` and `kern_events`.
