# HireLoop

A full-featured job hunting portal that connects job seekers with employers. Seekers discover and apply for jobs, recruiters register companies and hire, and admins moderate the platform. Subscriptions are handled with Stripe, and applicants get email updates when their status changes.

Built with Next.js, shadcn/ui, Better Auth and MongoDB. The UI follows the HireLoop Figma design (dark theme, purple brand color).

**Live site:** https://hireloop-v1.vercel.app

### Try it
You can create your own account on the live site as either a **Job Seeker** or a **Recruiter** and explore that dashboard. Payments run in Stripe test mode (card `4242 4242 4242 4242`). The Admin dashboard isn't public.

---

## Features

### Public site
- **Home**: hero with search, animated stats, featured jobs, features grid, pricing preview, footer
- **Browse Jobs** (`/jobs`): keyword search plus filters for job type, location, category and salary
- **Job Details** (`/jobs/:jobId`): description, responsibilities, requirements, company card, similar jobs, Apply and Save
- **Companies** (`/companies`): approved companies with industry tabs, plus company profile pages
- **Pricing** (`/pricing`): separate plans for seekers and recruiters, FAQ, and working upgrade, downgrade and cancel buttons for signed-in users

### Job Seeker dashboard
- Overview with stats, profile card, application status chart and recent activity
- Browse & Apply, with Save and an Apply dialog (optional cover letter)
- Saved Jobs, My Applications (relative dates and status badges)
- Billing with plan usage and payment history
- Settings for profile, skills, resume link, and password

### Recruiter dashboard
- Overview with stats, company card, applicants-per-job chart and recent applications
- Company registration and editing, with logo upload and an approval status
- Post, edit, draft, close, reopen and delete jobs, with plan usage shown
- Applicants per job, with resume link, cover letter, and a status dropdown that emails the applicant
- Billing and Settings

### Admin dashboard
- Overview with five stats, jobs-by-category chart, registrations chart, and recent payments
- Manage Users: search by email, role filter, change role, suspend or reactivate
- Manage Companies: approve or reject registrations
- Manage Jobs: search, filters, view, remove
- Payments & Subscriptions: revenue, active subscriptions, transaction table
- Settings

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui (base-nova style, Base UI primitives), lucide-react |
| Motion | Framer Motion (respects "reduce motion") |
| Charts | Recharts |
| Auth | Better Auth (email and password, Google) |
| Database | MongoDB (official driver, Better Auth Mongo adapter) |
| Payments | Stripe (Checkout, subscriptions, webhooks) |
| Email | Nodemailer (any SMTP provider) |
| Validation | Zod |
| Toasts | Sonner |

> Next.js 16 has breaking changes compared with older versions. Before changing framework-level code, read the docs bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- A MongoDB database. [MongoDB Atlas](https://www.mongodb.com/atlas) free tier works and is already a replica set
- A free Stripe account (test mode) for payments
- A Google OAuth client (optional) for Google sign-in
- An SMTP account for email (optional). [Mailtrap](https://mailtrap.io) is handy for testing

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
```
Fill in `.env.local` (see [Environment variables](#environment-variables)).

### 3. Load sample data
```bash
npm run seed
```
This adds sample companies and jobs. It is safe to run repeatedly. Skip it in production if you don't want demo data.

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000.

### 5. Create your first admin
Admin accounts can't be created from the website, on purpose. Register a normal account, then run:
```bash
npm run set-role -- you@example.com admin
```
Refresh the page and you'll land on `/dashboard/admin`. From there you can manage everyone else in **Manage Users**.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `MONGODB_TRANSACTIONS` | No | Set to `false` only for a standalone local `mongod` (see [Troubleshooting](#troubleshooting)) |
| `BETTER_AUTH_SECRET` | Yes | Long random string. Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | Public URL of the app, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | For Google sign-in | From Google Cloud Console. Redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` |
| `STRIPE_SECRET_KEY` | For payments | `sk_test_…` in test mode |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | `whsec_…` (see [Stripe setup](#stripe-setup)) |
| `APP_URL` | No | Public address used in Stripe return links. Defaults to `BETTER_AUTH_URL` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | For email | Any SMTP provider. Leave `SMTP_HOST` empty to only log emails |
| `EMAIL_FROM` | For email | e.g. `HireLoop <no-reply@yourdomain.com>` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | No | Only if the auth API is on a different domain than the app |

Never commit `.env.local`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier |
| `npm run seed` | Load sample companies and jobs |
| `npm run set-role -- <email> <seeker\|recruiter\|admin>` | Change a user's role (use for your first admin) |
| `npm run company-status -- <companyId> <pending\|approved\|rejected>` | Change a company's status from the terminal |

---

## Stripe setup

1. In the Stripe dashboard (test mode or a sandbox), open **Developers → API keys** and copy the **Secret key** into `STRIPE_SECRET_KEY`.
2. For local webhooks, install the [Stripe CLI](https://github.com/stripe/stripe-cli/releases/latest), then:
   ```bash
   stripe login
   stripe listen --events "checkout.session.completed,invoice.paid,customer.subscription.updated,customer.subscription.deleted" --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET` and restart the dev server. Keep that terminal open while testing.
3. Pay with the test card `4242 4242 4242 4242`, any future expiry and any CVC.

**In production**, add a webhook endpoint in the Stripe dashboard (**Developers → Webhooks**) at `https://yourdomain.com/api/webhooks/stripe` with the same four events, and use that endpoint's signing secret. It differs from the CLI's.

### How billing works
- A new subscription goes through Stripe Checkout. On return, the app confirms the payment with Stripe and activates the plan, so it works even if the webhook is delayed.
- Plan switches are prorated by Stripe. Downgrading to Free cancels at the end of the billing period.
- Payments are stored under the Stripe invoice id, so retried webhooks never double-count revenue.
- Prices live in one place: `lib/pricing.ts`.

---

## Email setup

Status-change emails are sent over SMTP with Nodemailer. Example for Mailtrap (testing inbox):
```dotenv
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=HireLoop <no-reply@hireloop.test>
```
Use `SMTP_SECURE=true` only with port 465. If sending fails, the status change still saves and the error is logged to the server console.

---

## Roles, plans and rules

### Roles
| Role | How you get it |
|---|---|
| Seeker | Default on sign-up |
| Recruiter | Chosen at sign-up, or set by an admin |
| Admin | Only via `npm run set-role` or by editing the database. Admins can switch other users between Seeker and Recruiter in **Manage Users**, but can't create or change other admins |

The server only accepts `seeker` or `recruiter` at sign-up; anything else is stored as `seeker`.

### Plans and limits
| Seeker plan | Price | Applications / month | Saved jobs |
|---|---|---|---|
| Free | $0 | 3 | 10 |
| Pro | $19/mo | 30 | Unlimited |
| Premium | $39/mo | Unlimited | Unlimited |

| Recruiter plan | Price | Active job posts |
|---|---|---|
| Free | $0 | 3 |
| Growth | $49/mo | 10 |
| Enterprise | $149/mo | 50 |

Limits are enforced on the server, not just in the UI.

### Application status flow
`Applied → Under Review → Shortlisted → Offered / Rejected`

The recruiter changes the status, the applicant is emailed, and their dashboard updates.

### Company status
`Pending → Approved / Rejected`

New companies start as **Pending** and are hidden from the public. A recruiter can save job drafts at any time but can only publish once the company is **Approved**. Rejecting a company hides it and all its jobs. Editing an approved company keeps it approved. Editing a rejected one resubmits it for review.

---

## Project structure

```
app/
  (public pages)        /, jobs, companies, pricing, login, register
  dashboard/
    seeker/             seeker pages
    recruiter/          recruiter pages
    admin/              admin pages
    [role]/             role guard and fallbacks
  api/
    auth/[...all]       Better Auth
    webhooks/stripe     Stripe webhook (signature verified)
    companies/[id]/logo company logo images
  fonts/                self-hosted fonts
components/
  ui/                   shadcn-style primitives (button, dialog, input, ...)
  site/                 navbar, hero, footer, homepage sections
  jobs/                 job cards, search, apply and save buttons
  dashboard/            sidebar shell, tables, forms, charts
  billing/, pricing/, auth/
lib/
  auth.ts               Better Auth server config
  auth-client.ts        Better Auth browser client
  session.ts            session and role helpers for server code
  mongo-client.ts, db.ts  shared MongoDB connection
  pricing.ts, format.ts, data/types.ts
server/
  repositories/         all database access (pages never query MongoDB directly)
  actions/              server actions (seeker, recruiter, admin, billing)
  services/             stripe, billing, email, plan limits
scripts/                seed, set-role, set-company-status
```

**Collections:** `user`, `session`, `account` (Better Auth), `companies`, `company_logos`, `jobs`, `applications`, `saved_jobs`, `profiles`, `subscriptions`, `payments`, `stripe_products`.

**Conventions**
- Pages read data through `server/repositories/*`, and write through `server/actions/*`.
- Every action checks the session, the role, and that the record belongs to the user.
- Server-only files import `server-only` so they can't end up in browser code.

---

## Security notes

- Roles are checked on the server for every page and action. Hiding a button is never the only protection.
- Recruiters can only touch their own company's jobs and applicants. Other IDs return 404.
- Stripe webhooks are verified with the signing secret before anything is trusted.
- Email content is HTML-escaped. Logo uploads are limited to PNG/JPG/WebP (checked by file contents), up to 300 KB.
- Suspended users lose their sessions immediately and cannot sign in.
- Better Auth rate-limits sign-ups and sign-ins. Behind a proxy or CDN, configure its client IP header so one address isn't counted for everyone.

---

## Testing the site manually

A suggested order that avoids dead ends:

1. Browse the public pages signed out, at desktop, tablet and phone widths.
2. Register a seeker, a recruiter, and a third account that you promote to admin.
3. As recruiter: register a company, save a draft (publishing is blocked while pending).
4. As admin: approve the company. As recruiter: publish jobs (the 4th on Free is blocked).
5. As seeker: save, apply (the 4th application on Free is blocked), check My Applications.
6. As recruiter: open Applicants and change a status. Check the email arrives and the seeker's status changes.
7. As seeker: pay for a plan with the Stripe test card. Check the toast, higher limits, upgrade, and cancel.
8. As admin: check Overview, Users (role, suspend), Companies, Jobs, Payments.
9. Check access control: wrong-role URLs redirect, and another recruiter's applicants URL returns 404.

Before shipping, run `npm run typecheck`, `npm run lint` and `npm run build`.

---

## Troubleshooting

**"Transaction numbers are only allowed on a replica set member or mongos"**
Better Auth's Mongo adapter uses transactions, which need a replica set. MongoDB Atlas is one already. For a plain local `mongod`, either run it as a single-node replica set or set `MONGODB_TRANSACTIONS=false` in `.env.local`.

**Sign-up or sign-in stops responding after a few attempts**
Better Auth rate-limits these to about 3 per 10 seconds in production mode. Wait a few seconds.

**`stripe listen` says "must specify events to forward"**
Add `--events "checkout.session.completed,invoice.paid,customer.subscription.updated,customer.subscription.deleted"` as shown above.

**Payment works but a later plan change or cancellation doesn't show**
The Stripe CLI must be signed in to the same account or sandbox as your `STRIPE_SECRET_KEY`, and `stripe listen` must still be running.

**Environment changes aren't picked up**
Restart `npm run dev`. Environment files are read at startup.

**Animations look missing**
If your operating system has "reduce motion" turned on, the site shows everything immediately without animation. That's intentional.

**PowerShell can't find `stripe`**
Run it with its path, e.g. `.\stripe.exe` from the folder it was unzipped to, or add that folder to your PATH.

---

## Deployment notes

- Use MongoDB Atlas (or any replica set), and set every variable from the table above in your host's settings.
- Set `BETTER_AUTH_URL` (and `APP_URL` if different) to your real public URL, and add the production redirect URI in Google Cloud Console.
- Add the Stripe webhook endpoint in the dashboard and use its signing secret. Switch to live keys only after Stripe activates your account.
- For real email, use a provider with a verified sending domain, and set `EMAIL_FROM` on that domain.
- Create your first admin with `npm run set-role` against the production database.

---

## Design notes

- The design source is the Figma file `hireloop.fig`. The homepage matches it, and the rest of the product reuses its colors, fonts and components.
- The UI is scaled to 90% by default (`font-size: 90%` on `html` in `app/globals.css`). Everything is sized in `rem`, so changing that one value rescales the whole site.
- Fonts are self-hosted in `app/fonts`, so builds need no network access.

---

## Known limitations

- The resume is a pasted link, not a file upload. Uploads need a storage decision.
- A user's email address can't be changed from Settings.
- Admin and dashboard tables show up to 200 rows with no pagination, and scroll sideways on phones.
- The salary filter compares raw numbers, so it mixes currencies. Billing is USD only.
- Plan prices can't be edited from the admin UI.
- Plan limit checks are not atomic, so two simultaneous actions could exceed a limit by one.
- No emails are sent when a company is approved or rejected, and there are no receipts or Stripe customer portal.
- The pricing preview on the homepage still shows the original Figma prices, while `/pricing` uses the real plans.
- Live Stripe, Google sign-in and a production email provider need to be verified with your own credentials.

---

## License

Private project. Add a license before publishing.