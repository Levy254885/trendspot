# TrendSpot.co.ke

Kenya's entertainment, celebrity, fashion, music and trending-news publication.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Firebase** (Auth + Firestore), and **Cloudinary** for images. Designed from the supplied editorial HTML/CSS reference — black / white / red palette, serif headlines, newspaper hierarchy.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

Without Firebase credentials the site runs on **seed content** so the full editorial UI is usable for development and demos.

## Environment

See `.env.example`. For production set:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FIREBASE_*` (client)
- `FIREBASE_ADMIN_*` (server only — never expose)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + upload credentials
- `NEXT_PUBLIC_USE_FIREBASE=true` to switch from seed data to Firestore

Never commit `.env.local` or Admin private keys.

## Architecture

```
src/
  app/                  # App Router pages + API routes
    article/[slug]/
    category/[slug]/
    search/
    admin/              # CMS dashboard, login, articles
    api/                # newsletter, contact, admin articles
    feed.xml/           # RSS
  components/
    layout/             # UtilityBar, Masthead, Nav, Ticker, Footer
    home/               # TopStory, EditorialGrid, NewsRail, Awards…
    article/            # ShareButtons
    shared/             # ArticleImage, SearchForm
  data/seed.ts          # Demo articles matching reference copy
  lib/                  # constants, utils, seo, cloudinary, firebase
  services/articles.ts  # Data layer (seed ↔ Firestore ready)
  types/
```

## Features

- Editorial homepage matching the THR-style reference
- Dynamic article and category pages
- Site search (`/search?q=`)
- Breaking / trending ticker
- Newsletter + contact / tip forms
- Admin dashboard (list, create, edit scaffold)
- SEO: metadata, Open Graph, JSON-LD, sitemap, robots, RSS
- Firestore security rules (`firestore.rules`)
- Cloudinary URL transforms (hero, card, thumbnail, OG)
- Responsive mobile nav + `prefers-reduced-motion`

## Deploy (Vercel)

1. Import the repo into Vercel.
2. Set environment variables from `.env.example`.
3. Deploy `firestore.rules` to your Firebase project.
4. Create an admin user in Firebase Auth and a matching `users/{uid}` document with `role: "admin"`.

```bash
npm run build
```

## Design

Preserve the reference's editorial language:

- Libre Baskerville + Source Serif 4 + Inter
- Thin borders, red accents, strong headlines
- No glassmorphism, giant rounded cards, or SaaS gradients

Demo images use picsum.photos seeds. Point `featuredImage` at Cloudinary public IDs in production.
