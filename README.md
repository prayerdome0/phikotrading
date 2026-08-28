# PHIKO TRADING — Website

Marketing website for **Phiko Trading — Construction • Luxury Estate**
(Tiling · Plumbing · Renovations · Building · Paving · TAR Surfacing — KZN, South Africa).Source imagery was extracted from `phikotrading images.zip`, individually inspected
(see `IMAGE-INVENTORY.md`), and recreated as clean, text-free, high-resolution
photographs that preserve the original subjects (no stock photos).

## Image guidelines (strict)

1. **No logos, monograms, watermarks or text overlays** may ever be added to any
   photo — not "PT", not "PHIKO TRADING", nothing. A batch generated earlier
   carried a fake centered "PT" watermark; those images were cleaned and the
   watermark must never return.
2. The **only** permitted branding on the entire site is the real logo asset
   `assets/img/phikotrading-logo.jpg` (Cloudinary `phikotrading-logo`), used in
   the header and footer.
3. When (re)generating or editing any photo, always include in the prompt:
   *"no text, no letters, no logos, no watermarks, no branding anywhere"* —
   and verify the result (OCR check) before publishing.
4. Photos must look clean, professional and authentic: real job sites, natural
   lighting, no placeholders, no unrelated objects.

## Serving images (local-first)

The site serves the committed, verified-clean copies in `assets/img/` directly.
`USE_CLOUDINARY` in `js/config.js` is **false** by default; the old copies on
Cloudinary still carry the "PT" watermark. After re-uploading the clean assets
(below), you may flip it to `true` to serve from the CDN instead.

## Refreshing Cloudinary with the clean images (one command)

The manifest now points directly at the committed clean assets — no staging
folder needed:

```bash
bash scripts/upload-cloudinary.sh          # uploads + verifies every URL is 200
bash scripts/upload-cloudinary.sh --verify-only
```

Run it from your own machine (needs curl; no API secret required — unsigned
preset). It overwrites each public ID with the clean version, so every
Cloudinary URL the site could use becomes watermark-free.

## Cloudinary configuration

| Setting | Value |
|---|---|
| Cloud name | `dhad95cch` |
| Upload preset | `phikotrading` |
| Signing mode | **Unsigned** |
| Asset folder | *(none — uploads live at root)* |
| Disallow public ID | OFF (we set fixed public IDs for stable URLs) |

- **Secrets**: `CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@dhad95cch` lives
  **server-side only** in `.env` (git-ignored — see `.env.example`). It is never
  shipped to the browser, never embedded in frontend code, never committed.
- The website only needs the **public delivery URLs**:
  `https://res.cloudinary.com/dhad95cch/image/upload/<transforms>/<public_id>.jpg`
- All `<img>` tags use Cloudinary URLs as the primary `src` (centralised in
  `js/images.js`), with an optimized local copy in `assets/img/` as an offline
  fallback so the site never shows a broken image.

## Putting images live on Cloudinary (one command)

The site is pre-wired to the exact public IDs in `scripts/cloudinary-manifest.tsv`.

```bash
# 1. Ensure the final JPGs are in upload-staging/ (already prepared in this repo's
#    working files, names match the manifest)
# 2. Run from your own machine (needs curl; no API secret required — unsigned preset):
bash scripts/upload-cloudinary.sh
```

The script uploads with tags + alt text, then verifies that **every delivery URL
returns HTTP 200**.

## Booking calendar

The owner will provide the **calendar name** separately. When received:
1. Set `PUBLIC_CALENDAR_NAME=<name>` in `.env`
2. Set `PUBLIC_CALENDAR_NAME` in `js/config.js`
The placeholder is already wired into the Book section of the site.

## Deployment — Vercel (static, zero-config)

This repository is Vercel-ready (`vercel.json` included; no build step, framework = **Other**):

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → **Import** `prayerdome0/phikotrading`
2. Framework preset: **Other** · Root directory: `./` · Build command: *(none)* · Output dir: *(none)*
3. Deploy — done. Vercel auto-redeploys on every push to the connected branch.

CLI alternative (from your own machine):

```bash
npm i -g vercel
vercel login
vercel deploy --prod
```

No environment variables are required for the public site. If you later add
server-side tooling, set `CLOUDINARY_URL` in **Vercel → Project → Settings →
Environment Variables** — never in frontend code.

## Run locally

```bash
cd site-root    # this repository root
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html                 home page (hero, services overview, featured work, process)
about.html                 about the company (story, values) — no director portrait
services.html              detailed service pages content (all six trades)
gallery.html               our work — filterable project gallery + lightbox
contact.html               contact, free-quote booking, calendar & service areas
css/styles.css             navy + gold brand theme
js/config.js               public, non-secret runtime config (cloud name, preset, calendar)
js/images.js               Cloudinary URL builder + asset registry (public IDs)
js/main.js                 interactions (nav + active page, gallery lightbox, WhatsApp links)
assets/img/                optimized local fallback copies (git-committed, web-size)
scripts/cloudinary-manifest.tsv   public_id → file → tags → alt (single source of truth)
scripts/upload-cloudinary.sh      unsigned bulk uploader + URL verifier
IMAGE-INVENTORY.md         what every image in the original ZIP was and where it went
```

The site is multi-page: the header/nav links between the five pages, and the
current page is highlighted automatically by `js/main.js`. The founder/director
portrait was removed at the owner's request (no personal photos on the site).
