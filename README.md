# PHIKO TRADING — Website

Marketing website for **Phiko Trading — Construction • Luxury Estate**
(Tiling · Plumbing · Renovations · Building · Paving · TAR Surfacing — KZN, South Africa).

Source imagery was extracted from `phikotrading images.zip`, individually inspected
(see `IMAGE-INVENTORY.md`), and recreated as clean, text-free, high-resolution
photographs that preserve the original subjects (no stock photos).

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

## Run locally

```bash
cd site-root    # this repository root
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html                 single-page website
css/styles.css             navy + gold brand theme
js/config.js               public, non-secret runtime config (cloud name, preset, calendar)
js/images.js               Cloudinary URL builder + asset registry (public IDs)
js/main.js                 interactions (nav, gallery lightbox, WhatsApp links)
assets/img/                optimized local fallback copies (git-committed, web-size)
scripts/cloudinary-manifest.tsv   public_id → file → tags → alt (single source of truth)
scripts/upload-cloudinary.sh      unsigned bulk uploader + URL verifier
IMAGE-INVENTORY.md         what every image in the original ZIP was and where it went
```
