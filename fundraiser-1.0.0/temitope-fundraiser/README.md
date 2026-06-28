# Temitope Ogungbuji — Fundraising Campaign Website

A complete, production-ready fundraising website built with Next.js 14, TypeScript, Supabase, Flutterwave, and Resend. Designed to be deployed in under an hour.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Local Setup](#local-setup)
5. [Supabase Setup](#supabase-setup)
6. [Flutterwave Setup](#flutterwave-setup)
7. [Email Setup (Resend)](#email-setup-resend)
8. [Environment Variables](#environment-variables)
9. [Running Locally](#running-locally)
10. [Pages & Features](#pages--features)
11. [Admin Dashboard](#admin-dashboard)
12. [API Reference](#api-reference)
13. [Security](#security)
14. [Deployment (Vercel)](#deployment-vercel)
15. [Post-Deployment Checklist](#post-deployment-checklist)
16. [Database Schema](#database-schema)

---

## Project Overview

This is a personal fundraising campaign website for **Temitope Ogungbuji**, an aspiring software developer raising ₦350,000 to purchase a Dell Latitude 7400 laptop.

### Campaign Goal
- **Target:** ₦350,000
- **Purpose:** Dell Latitude 7400 (Intel i5-8365U, 8GB RAM, 256GB SSD)
- **Beneficiary:** Temitope Ogungbuji — aspiring data engineer and software developer

### Features
- Live campaign progress tracker
- Secure Flutterwave payment integration (one-time donations)
- Guestbook with moderation
- Career support submission system (internships, mentorship, resources)
- Admin dashboard (password-protected)
- Automated donor thank-you emails
- Full transparency page with campaign updates
- WCAG-accessible, mobile-first design
- SEO + Open Graph tags

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS + inline styles      |
| Database    | Supabase (PostgreSQL)             |
| Payments    | Flutterwave                       |
| Email       | Resend                            |
| Hosting     | Vercel (recommended)              |
| Validation  | Zod                               |
| Forms       | React Hook Form                   |

---

## Folder Structure

```
temitope-fundraiser/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, SEO metadata
│   │   ├── page.tsx                # Home page
│   │   ├── about/
│   │   │   └── page.tsx            # About Temitope
│   │   ├── transparency/
│   │   │   └── page.tsx            # Campaign transparency
│   │   ├── guestbook/
│   │   │   └── page.tsx            # Public guestbook
│   │   ├── admin/
│   │   │   └── page.tsx            # Admin dashboard (protected)
│   │   └── api/
│   │       ├── donate/             # Initiate Flutterwave payment
│   │       ├── webhook/            # Flutterwave webhook handler
│   │       ├── guestbook/          # GET approved / POST new entry
│   │       ├── career-support/     # POST career submission
│   │       ├── campaign/
│   │       │   ├── stats/          # GET campaign totals
│   │       │   └── updates/        # GET campaign timeline
│   │       └── admin/
│   │           ├── login/          # POST admin auth
│   │           ├── stats/          # GET/PATCH campaign stats
│   │           ├── guestbook/      # GET all / PATCH approve / DELETE
│   │           ├── updates/        # GET all / POST new update
│   │           ├── submissions/    # GET all / PATCH status
│   │           ├── donations/      # GET all donations
│   │           └── export/         # GET CSV export
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx             # Sticky navigation bar
│   │   │   └── Footer.tsx          # Site footer
│   │   ├── modals/
│   │   │   ├── DonateModal.tsx     # Multi-step donation flow
│   │   │   └── CareerModal.tsx     # Career support form
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx     # Hero with stats card
│   │   │   └── GuestbookForm.tsx   # Guestbook submission form
│   │   └── ui/
│   │       ├── ProgressBar.tsx     # Animated progress bar
│   │       ├── StatCard.tsx        # Metric display card
│   │       ├── Tag.tsx             # Pill/badge component
│   │       ├── SectionLabel.tsx    # Section eyebrow label
│   │       └── Divider.tsx         # Horizontal rule
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client (public + admin)
│   │   ├── constants.ts            # Campaign values, specs, URLs
│   │   ├── format.ts               # Currency, date, percent helpers
│   │   ├── email.ts                # Resend email functions
│   │   ├── auth.ts                 # Admin token signing/verification
│   │   ├── validation.ts           # Zod schemas
│   │   └── rate-limit.ts           # In-memory rate limiter
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── styles/
│       └── globals.css             # Global styles + Google Fonts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Tables, RLS, stored procedures
│       └── 002_rls_service_policies.sql  # Service role policies
├── public/
│   └── robots.txt
├── .env.local.example              # Environment variable template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Local Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier is sufficient)
- A [Flutterwave](https://flutterwave.com) account
- A [Resend](https://resend.com) account (free tier: 3,000 emails/month)

### 1. Clone and install

```bash
git clone https://github.com/your-username/temitope-fundraiser.git
cd temitope-fundraiser
npm install
```

### 2. Copy environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values — see [Environment Variables](#environment-variables) below.

---

## Supabase Setup

### Step 1: Create a project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose a name (e.g. `temitope-fundraiser`) and a strong database password
4. Select the **West EU (Ireland)** or nearest region
5. Click **Create new project** and wait ~2 minutes

### Step 2: Run migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Repeat for `supabase/migrations/002_rls_service_policies.sql`

### Step 3: Get your API keys

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Never commit the service_role key.** It bypasses all RLS policies.

---

## Flutterwave Setup

### Step 1: Create an account

1. Go to [flutterwave.com](https://flutterwave.com) and sign up
2. Complete identity verification (required for Nigerian businesses)

### Step 2: Get your API keys

1. Go to **Dashboard → Settings → API Keys**
2. Toggle to **Test Mode** first for development
3. Copy:
   - **Public Key** → `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
   - **Secret Key** → `FLUTTERWAVE_SECRET_KEY`

### Step 3: Configure webhook

1. Go to **Dashboard → Settings → Webhooks**
2. Set URL to: `https://your-domain.com/api/webhook`
3. Set a **Secret Hash** — any random string → `FLUTTERWAVE_SECRET_HASH`

### Step 4: Switch to Live Mode before launch

Repeat step 2 in **Live Mode** and replace keys in your production environment variables.

---

## Email Setup (Resend)

### Step 1: Create a Resend account

1. Go to [resend.com](https://resend.com) and sign up (free: 3,000 emails/month)

### Step 2: Add and verify your domain

1. Go to **Domains → Add Domain**
2. Add your domain (e.g. `yourdomain.com`)
3. Add the DNS records Resend provides to your DNS registrar
4. Click **Verify**

> **No custom domain yet?** Use `onboarding@resend.dev` as the FROM address while testing. You must verify a domain before going to production.

### Step 3: Get your API key

1. Go to **API Keys → Create API Key**
2. Copy the key → `RESEND_API_KEY`

---

## Environment Variables

Create `.env.local` from the example file and fill in all values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Flutterwave
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxx-X
FLUTTERWAVE_SECRET_HASH=your-random-webhook-secret

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=temitope@yourdomain.com

# Admin Dashboard
ADMIN_PASSWORD=choose-a-very-strong-password
ADMIN_JWT_SECRET=a-64-character-random-string-here

# App
NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com
```

Generate `ADMIN_JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

> In development, use your Flutterwave **Test Mode** keys. Test card: `5531886652142950`, exp `09/32`, CVV `564`.

---

## Pages & Features

### Home Page (`/`)
- Hero with personal introduction and campaign objective
- Live campaign progress (goal, raised, donors, percentage)
- Dell Latitude 7400 spec card
- "Why This Laptop Matters" — 6-panel grid
- Featured projects (Sahel Security Analytics Platform + ETL Framework)
- GitHub section with profile link
- Share links (X, WhatsApp, LinkedIn)
- "Beyond Donations" career support cards
- Final donation CTA

### About (`/about`)
- Full biography
- Current skills + currently learning (tag grids)
- Learning roadmap (4-phase timeline)
- Career goals
- GitHub + donate CTAs

### Transparency (`/transparency`)
- Live campaign stats (goal, raised, donors)
- Animated progress bar
- Full Dell Latitude 7400 spec table
- Commitment statement (accountability pledges)
- Post-purchase update placeholder
- Campaign timeline (populated from admin dashboard)

### Guestbook (`/guestbook`)
- Public message submission form
- Displays all approved messages (name, optional handle, date)
- Submissions pending admin review before appearing
- Empty state with clear CTA

### Admin Dashboard (`/admin`)
- Password-protected login
- Campaign stats editor (update raised amount and donor count)
- Guestbook moderation (approve / hide / delete)
- Campaign updates posting (feeds the Transparency timeline)
- Career submissions inbox (filter by type, mark reviewed/actioned)
- Donation history table
- CSV export of all donations

---

## Admin Dashboard

Access at `/admin` with your `ADMIN_PASSWORD`.

### What you can do

| Action | Where |
|--------|-------|
| Update campaign totals after manual bank transfers | Overview tab → Edit Stats |
| Approve guestbook messages | Guestbook tab |
| Post campaign milestones (laptop arrived, etc.) | Updates tab |
| Review internship referrals, mentorship offers | Submissions tab |
| View all donation records | Donations tab |
| Export donor CSV | Donations tab → Export CSV |

### Admin session

Sessions are valid for **8 hours** using a signed HMAC token stored in an httpOnly cookie. To log out, clear your cookies or close the browser session.

---

## API Reference

All API routes return JSON. Error responses follow `{ "error": "message" }`.

### Public endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/campaign/stats` | Current campaign totals |
| `GET` | `/api/campaign/updates` | Campaign timeline entries |
| `GET` | `/api/guestbook` | Approved guestbook messages |
| `POST` | `/api/guestbook` | Submit a new message |
| `POST` | `/api/donate` | Initiate Flutterwave payment |
| `POST` | `/api/career-support` | Submit a career support form |
| `POST` | `/api/webhook` | Flutterwave webhook (verified by hash) |

### Admin endpoints (require `admin_token` cookie)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/login` | Authenticate and set session cookie |
| `GET` | `/api/admin/stats` | Get full campaign stats |
| `PATCH` | `/api/admin/stats` | Update raised amount / donor count |
| `GET` | `/api/admin/guestbook` | All messages (approved + pending) |
| `PATCH` | `/api/admin/guestbook` | Approve or hide a message |
| `DELETE` | `/api/admin/guestbook` | Delete a message |
| `GET` | `/api/admin/updates` | All timeline updates |
| `POST` | `/api/admin/updates` | Post a new update |
| `GET` | `/api/admin/submissions` | All career submissions |
| `PATCH` | `/api/admin/submissions` | Update submission status |
| `GET` | `/api/admin/donations` | All donation records |
| `GET` | `/api/admin/export` | Download donations CSV |

---

## Security

### Measures implemented

- **Input validation** — All user inputs validated with Zod before database writes
- **Rate limiting** — In-memory rate limiter on all POST endpoints (donate: 5/min, guestbook: 3/min)
- **Webhook signature verification** — Flutterwave webhook validated with HMAC-SHA256
- **Admin authentication** — HMAC-signed token, httpOnly cookie, 8-hour expiry
- **Timing-safe comparison** — `crypto.timingSafeEqual` used for password and token checks
- **Service role isolation** — `SUPABASE_SERVICE_ROLE_KEY` never exposed to client
- **RLS policies** — Row Level Security enforced on all Supabase tables
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` on all API routes
- **No donor PII exposed publicly** — Donor names, emails, and handles are never returned by public API endpoints

### For production scale

Consider replacing the in-memory rate limiter with [Upstash Redis](https://upstash.com) for persistence across serverless function instances:

```bash
npm install @upstash/redis @upstash/ratelimit
```

---

## Deployment (Vercel)

Vercel is the recommended host for Next.js projects. Free Hobby plan is sufficient for this campaign.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/temitope-fundraiser.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Select your `temitope-fundraiser` repository
4. Click **Deploy** (Vercel auto-detects Next.js)

### Step 3: Add environment variables

1. In Vercel dashboard → **Settings → Environment Variables**
2. Add all variables from `.env.local.example` with your **production** values
3. Make sure to use Flutterwave **Live Mode** keys
4. Set `NEXT_PUBLIC_SITE_URL` to your actual Vercel domain

### Step 4: Redeploy

After adding environment variables, go to **Deployments** and click **Redeploy**.

### Alternative: Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

Add environment variables in **Site settings → Build & deploy → Environment variables**.

### Alternative: Cloudflare Pages

Use `@cloudflare/next-on-pages` adapter. See [Cloudflare docs](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

---

## Post-Deployment Checklist

Run through this after your first deployment:

- [ ] Visit your live URL and confirm the home page loads
- [ ] Check campaign progress bar displays correctly
- [ ] Submit a test guestbook message
- [ ] Confirm message appears in admin dashboard under Guestbook (pending)
- [ ] Approve the message and verify it appears on `/guestbook`
- [ ] Submit a test career support form (any type)
- [ ] Confirm submission appears in admin Submissions tab
- [ ] Make a test donation using Flutterwave test card
- [ ] Confirm webhook fires and donation appears in admin Donations tab
- [ ] Confirm thank-you email arrives (if email provided)
- [ ] Confirm admin email notification arrives
- [ ] Post a campaign update in admin → verify it appears on `/transparency`
- [ ] Test on mobile (Android + iPhone)
- [ ] Check all share links work correctly
- [ ] Verify `/admin` is not indexed (check `robots.txt`)
- [ ] Switch Flutterwave to **Live Mode** keys
- [ ] Update `NEXT_PUBLIC_SITE_URL` to final domain

---

## Database Schema

### `campaign_stats`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| goal_amount | INTEGER | Campaign target in kobo/naira |
| amount_raised | INTEGER | Total raised (updated by webhook) |
| donor_count | INTEGER | Total donors |
| updated_at | TIMESTAMPTZ | Auto-updated |

### `donations`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| amount | INTEGER | Donation amount in NGN |
| donor_email | TEXT | Private, nullable |
| twitter_profile | TEXT | Private, nullable |
| linkedin_profile | TEXT | Private, nullable |
| discord_username | TEXT | Private, nullable |
| anonymous | BOOLEAN | True if no email provided |
| transaction_reference | TEXT | Unique Flutterwave TX ref |
| flw_transaction_id | TEXT | Flutterwave internal ID |
| status | TEXT | pending / successful / failed |
| created_at | TIMESTAMPTZ | Auto-set |

### `guestbook_entries`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Publicly visible |
| social_handle | TEXT | Optional, publicly visible |
| message | TEXT | Publicly visible after approval |
| approved | BOOLEAN | Default false — requires admin |
| created_at | TIMESTAMPTZ | Auto-set |

### `campaign_updates`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| title | TEXT | Update headline |
| content | TEXT | Update body |
| image_url | TEXT | Optional image |
| created_at | TIMESTAMPTZ | Auto-set |

### `career_support_submissions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| submission_type | TEXT | internship / learning_resource / certification / mentorship / project_idea / networking |
| name | TEXT | Submitter name |
| email | TEXT | Private, nullable |
| linkedin_url | TEXT | Private, nullable |
| message | TEXT | Submission content |
| status | TEXT | new / reviewed / actioned |
| created_at | TIMESTAMPTZ | Auto-set |

---

## Updating Campaign Totals

The campaign stats update **automatically** when Flutterwave confirms a payment via webhook. However, if you receive a direct bank transfer or cash contribution, update manually:

1. Go to `/admin`
2. Select the **Overview** tab
3. Edit **Amount Raised** and **Donor Count**
4. Click **Save Changes**

The live progress bar on the website will reflect the update immediately.

---

## Support

If you encounter issues setting up the project:

- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Flutterwave:** [developer.flutterwave.com](https://developer.flutterwave.com)
- **Resend:** [resend.com/docs](https://resend.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)

---

*Built with care for Temitope Ogungbuji's journey into software development.*
