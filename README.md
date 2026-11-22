# Command Centre OS

Internal operating system for Cadexus.

## Live demo
https://cadexus-command-centre-beyond-business.vercel.app

## Open locally
Open `index.html` in any browser. The page loads `app.js` from the same folder. Everything is stored in this browser under `cadexus-os-v2`. No server or account required.

## What is included
- **Dashboard** command centre. KPIs, dated next actions, pipeline funnel, onboarding tracker, risk radar, verified outcomes and recent activity are calculated from stored records.
- **90 Day Plan** with three phases, a 12 week timeline and measures. Targets start blank. Current values are calculated from the same records where the data exists.
- **Pipeline** as a table or a board. Add, edit and remove leads (source, segment, stage, deal value, next action, due date, owner and notes).
- **Customers** for onboarding, active and at-risk accounts, including the Cadexus org ID, first value, risks, verified outcome, next action, due date and owner.
- **Decisions** with a timestamp on every note.
- **Search** across leads, customers and notes (Ctrl K or Cmd K) and quick add.
- **Backup** as JSON so two people can share a file until there is a shared database. CSV export remains for leads and customers.
- **Sample data** on first open, marked with a Sample badge and a control to clear it.
- **Light theme** with a dark mode toggle.
- **Mobile layout** with keyboard focus and readable contrast.

## Data
The stored object keeps `leads`, `customers` and `notes`. It also holds `activity` and `plan` once this version has loaded. Older data still opens. Missing lists are added in place and existing records are kept. Optional fields (due date, owner, deal value, lead source, onboarding start) can be blank.

## Boundaries
- Cadexus remains the source of truth for customer jobs, invoices and permissions.
- This is the partner and founder decision layer.
- Only record verified outcomes with customer permission.
- The screen never invents a metric. If the records do not support a number, it says there is no data yet or that it is not tracked yet.

## Next paid upgrades (once used)
- Shared multi-user access
- Calendar reminder export
- Direct link to Cadexus first-value events
