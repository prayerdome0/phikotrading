#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PHIKO TRADING — Cloudinary bulk uploader (UNSIGNED preset)
#
# • Uses ONLY the cloud name + the unsigned upload preset "phikotrading".
# • NO API key / API secret is required or used — safe for your local machine.
# • Uploads every asset listed in scripts/cloudinary-manifest.tsv to the ROOT
#   of cloud "dhad95cch" (preset configured as "no asset folder"), applying
#   fixed public IDs, tags and alt text so the website URLs match exactly.
#
# Usage:
#   1) Put the final JPGs in ./upload-staging/   (names must match the manifest)
#   2) Run:   bash scripts/upload-cloudinary.sh
#   3) Optional verify pass afterwards:
#        bash scripts/upload-cloudinary.sh --verify-only
#
# Requirements: curl, awk. Works on macOS and Linux.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

CLOUD_NAME="${CLOUDINARY_CLOUD_NAME:-dhad95cch}"
PRESET="${CLOUDINARY_UPLOAD_PRESET:-phikotrading}"
MANIFEST="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cloudinary-manifest.tsv"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="https://res.cloudinary.com/${CLOUD_NAME}/image/upload"
VERIFY_ONLY=0
[[ "${1:-}" == "--verify-only" ]] && VERIFY_ONLY=1

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: manifest not found: $MANIFEST" >&2; exit 1
fi

ok=0; fail=0
while IFS=$'\t' read -r public_id file tags alt; do
  [[ -z "${public_id// }" || "$public_id" =~ ^# || "$public_id" == "public_id" ]] && continue

  if [[ "$VERIFY_ONLY" == "0" ]]; then
    src="${ROOT_DIR}/${file}"
    if [[ ! -f "$src" ]]; then
      echo "SKIP  $public_id — file not found: $file"; fail=$((fail+1)); continue
    fi
    echo "→ Uploading $public_id ..."
    response=$(curl -sS "https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload" \
      -F "file=@${src}" \
      -F "upload_preset=${PRESET}" \
      -F "public_id=${public_id}" \
      -F "overwrite=true" \
      -F "tags=${tags}" \
      -F "context=alt=${alt}")
    if echo "$response" | grep -q '"secure_url"'; then
      url=$(echo "$response" | sed -n 's/.*"secure_url":"\([^"]*\)".*/\1/p' | sed 's/\\\//\//g')
      echo "  OK  $url"
      ok=$((ok+1))
    else
      echo "  FAILED: $response" >&2
      fail=$((fail+1))
    fi
  fi
done < "$MANIFEST"

# Verification: every delivery URL the website uses must return HTTP 200.
echo
echo "Verifying delivery URLs (this is exactly how the website references them)…"
vok=0; vfail=0
while IFS=$'\t' read -r public_id file tags alt; do
  [[ -z "${public_id// }" || "$public_id" =~ ^# || "$public_id" == "public_id" ]] && continue
  test_url="${BASE_URL}/f_auto,q_auto,w_1200,c_fill/${public_id}.jpg"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$test_url")
  if [[ "$code" == "200" ]]; then
    vok=$((vok+1)); echo "  200  $test_url"
  else
    vfail=$((vfail+1)); echo "  $code  $test_url  ← check this asset" >&2
  fi
done < "$MANIFEST"

echo
echo "Done. Uploaded: $ok  Failed: $fail  |  Verified 200: $vok  Bad: $vfail"
[[ "$fail" == "0" && "$vfail" == "0" ]] && echo "✔ All assets live — the website will render from Cloudinary."
