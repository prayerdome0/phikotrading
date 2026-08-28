/**
 * PHIKO TRADING — Cloudinary image registry.
 * ---------------------------------------------------------------------------
 * The website references Cloudinary delivery URLs for every image:
 *     https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<public_id>
 *
 * Public IDs match scripts/cloudinary-manifest.tsv exactly (root level,
 * "no folders", fixed public IDs — preset has "Disallow public ID: OFF").
 *
 * Every <img data-img-key="..."> is wired in js/main.js:
 *   1) primary src  = Cloudinary URL (f_auto/q_auto + sizing transforms)
 *   2) fallback     = optimized local copy in assets/img/ (onerror only),
 *                     so the page never renders a broken image while the
 *                     one-command upload to Cloudinary is still pending.
 */
(function () {
  'use strict';

  var REGISTRY = {
    /* key                 public_id                                 local fallback                      alt */
    'logo':                { id: 'phikotrading-logo',                  alt: 'Phiko Trading logo — Construction, Luxury Estate' },
    'hero-marble-floor':   { id: 'phikotrading-hero-marble-floor',     alt: 'Polished marble-look porcelain floor tiles installed by Phiko Trading in a newly renovated room' },
    'svc-tiling':          { id: 'phikotrading-svc-tiling',            alt: 'Professional tiler laying large-format grey porcelain floor tiles with a leveling clip system' },
    'svc-bathroom':        { id: 'phikotrading-svc-bathroom',          alt: 'Luxury renovated bathroom with marble-look tiles, navy vanity and brushed gold fittings' },
    'svc-plumbing':        { id: 'phikotrading-svc-plumbing',          alt: 'Matte black rainfall shower column installed on rustic wood-look porcelain wall tiles' },
    'svc-building':        { id: 'phikotrading-svc-building',          alt: 'New home foundation and concrete block walls under construction on a KZN hillside site' },
    'svc-paving':          { id: 'phikotrading-svc-paving',            alt: 'Crew laying multicolour interlocking brick pavers in a herringbone pattern on a driveway' },
    'svc-tar':             { id: 'phikotrading-svc-tar',               alt: 'Tar surfacing crew with vibratory roller compacting fresh asphalt on an estate road' },
    'svc-renovations':     { id: 'phikotrading-svc-renovations',       alt: 'Renovated commercial studio with backlit arched mirrors and polished dark porcelain floor' },
    'vanity-travertine':   { id: 'phikotrading-vanity-travertine',     alt: 'Travertine floating bathroom vanity with integrated stone basin and chrome mixer tap' },
    'shower-timber':       { id: 'phikotrading-shower-timber-ceiling', alt: 'Spacious double rainfall walk-in shower with stone-look tiles and timber vaulted ceiling' },
    'bathroom-tub':        { id: 'phikotrading-bathroom-tub-marble',   alt: 'New marble-look tiled bathroom with wall-hung toilet and freestanding bathtub' },
    'bathroom-mosaic':     { id: 'phikotrading-bathroom-mosaic-small', alt: 'Compact modern guest bathroom with mosaic strip feature wall and wall-hung vanity' },
    'bathroom-vessel':     { id: 'phikotrading-bathroom-vessel-dark',  alt: 'Luxury dark marble-look bathroom with vessel basin on floating quartz shelf and black tap' },
    'staircase-grey':      { id: 'phikotrading-staircase-grey',        alt: 'Staircase tiled in large-format grey porcelain with a white painted balustrade' },
    'tiling-wood-green':   { id: 'phikotrading-tiling-wood-green-wedges', alt: 'Wood-look porcelain plank floor being installed with green and orange leveling wedges' },
    'tiling-wood-adhesive':{ id: 'phikotrading-tiling-wood-adhesive',  alt: 'Wood-look porcelain planks bedded on fresh notched adhesive with cross spacers' },
    'tiling-shower-clips': { id: 'phikotrading-tiling-shower-clips',   alt: 'Shower room wall tiling in progress with leveling clips, niches and new shower tray' },
    'tiling-darkwood':     { id: 'phikotrading-tiling-darkwood-orange',alt: 'Dark walnut wood-look porcelain floor planks freshly laid with orange leveling wedges' },
    'tiling-redclips':     { id: 'phikotrading-tiling-redclips-bathroom', alt: 'Freshly tiled bathroom corner with wavy beige wall tiles, red leveling clips and floor drain' },
    'paving-grey':         { id: 'phikotrading-paving-interlocking-grey', alt: 'New grey interlocking paver driveway with charcoal accent band and string-line alignment' },
    'tar-farm-silos':      { id: 'phikotrading-tar-farm-road-silos',   alt: 'Freshly tarred farm access road curving past grain silos in the KZN Midlands' },
    'house-roof':          { id: 'phikotrading-house-roof-construction', alt: 'Newly built house with terracotta roof tiles nearing completion by Phiko Trading' },
  };

  /**
   * Build a Cloudinary delivery URL for a registered asset.
   * @param {string} key   registry key
   * @param {object} opts  { w, h, crop, quality } — applied as URL transforms
   */
  function cloudinaryUrl(key, opts) {
    var cfg = window.PHIKO_CONFIG || {};
    var cloud = cfg.CLOUDINARY_CLOUD_NAME || 'dhad95cch';
    var asset = REGISTRY[key];
    if (!asset) return '';
    opts = opts || {};
    var t = ['f_auto', 'q_auto' + (opts.quality ? ':' + opts.quality : '')];
    if (opts.w) t.push('w_' + opts.w);
    if (opts.h) t.push('h_' + opts.h);
    if (opts.w || opts.h) t.push('c_' + (opts.crop || 'fill'));
    if (opts.gravity) t.push('g_' + opts.gravity);
    var folder = cfg.CLOUDINARY_ASSET_FOLDER ? cfg.CLOUDINARY_ASSET_FOLDER + '/' : '';
    return 'https://res.cloudinary.com/' + cloud + '/image/upload/' + t.join(',') + '/' + folder + asset.id + '.jpg';
  }

  /** Local optimized fallback (committed web-size copy). */
  function localFallbackUrl(key) {
    var asset = REGISTRY[key];
    return asset ? 'assets/img/' + asset.id + '.jpg' : '';
  }

  function altText(key) {
    var asset = REGISTRY[key];
    return asset ? asset.alt : '';
  }

  window.PHIKO_IMAGES = {
    registry: REGISTRY,
    url: cloudinaryUrl,
    fallback: localFallbackUrl,
    alt: altText,
  };
})();
