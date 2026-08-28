/**
 * PHIKO TRADING — public runtime configuration.
 * ---------------------------------------------------------------------------
 * Everything in this file is PUBLIC and NON-SECRET (safe for the browser):
 *   - Cloudinary cloud name and the UNSIGNED upload preset name
 *   - Never put the API key / API secret / CLOUDINARY_URL here.
 *     Those belong only in the server-side .env file (see .env.example).
 */
window.PHIKO_CONFIG = {
  // Cloudinary (public delivery settings)
  CLOUDINARY_CLOUD_NAME: 'dhad95cch',
  CLOUDINARY_UPLOAD_PRESET: 'phikotrading', // Signing mode: Unsigned
  CLOUDINARY_ASSET_FOLDER: '',              // "No folders" — root-level public IDs

  // Serve images from Cloudinary instead of the local assets/img/ copies.
  // KEEP THIS FALSE until the clean (watermark-free) assets have been
  // re-uploaded with:  bash scripts/upload-cloudinary.sh
  // (the old Cloudinary copies carry an unwanted "PT" logo watermark)
  USE_CLOUDINARY: false,

  // Booking calendar — the owner will provide the calendar name separately.
  // Once provided, set it here and in .env (PUBLIC_CALENDAR_NAME).
  PUBLIC_CALENDAR_NAME: '',

  // Business contact
  PHONE_DISPLAY: '+27 74 724 8037',
  PHONE_TEL: '+27747248037',
  WHATSAPP_NUMBER: '27747248037',
};
