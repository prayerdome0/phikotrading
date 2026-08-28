/**
 * PHIKO TRADING — site behaviour.
 * - Resolves every <img data-img-key> to its CLOUDINARY delivery URL (primary),
 *   with an optimized local copy as onerror fallback.
 * - Mobile nav, sticky header, gallery filters + lightbox, contact links,
 *   and the booking-calendar placeholder (activated by PUBLIC_CALENDAR_NAME).
 */
(function () {
  'use strict';

  var CFG = window.PHIKO_CONFIG || {};
  var IMG = window.PHIKO_IMAGES;

  /* ── 1. Wire images: Cloudinary primary src + local fallback ─────────── */
  function resolveImages() {
    if (!IMG) return;
    document.querySelectorAll('img[data-img-key]').forEach(function (el) {
      var key = el.getAttribute('data-img-key');
      var w = parseInt(el.getAttribute('data-w') || '1200', 10);
      var primary = IMG.url(key, { w: w });
      var backup = IMG.fallback(key);

      if (!el.getAttribute('alt')) el.setAttribute('alt', IMG.alt(key));
      // Keep the full-res Cloudinary key for the lightbox
      el.setAttribute('data-cld-id', (IMG.registry[key] || {}).id || '');

      el.addEventListener('error', function onErr() {
        el.removeEventListener('error', onErr);
        if (backup && el.src.indexOf(backup) === -1) el.src = backup;
      });
      el.src = primary;
    });
  }

  /* ── 2. Contact links (tel / WhatsApp) ───────────────────────────────── */
  function resolveContactLinks() {
    var tel = CFG.PHONE_TEL || '+27747248037';
    var wa = CFG.WHATSAPP_NUMBER || '27747248037';
    var defaultMsg = encodeURIComponent(
      'Hi Phiko Trading, I would like a free quotation for my project.'
    );
    document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:' + tel; });
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = 'https://wa.me/' + wa + '?text=' + defaultMsg;
    });
  }

  /* ── 3. Sticky header + mobile nav ───────────────────────────────────── */
  function initHeader() {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ── 3b. Highlight the nav link for the current page ───────────────── */
  function initActiveNav() {
    var here = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' || href.indexOf('://') !== -1) return;
      var target = (href.split('#')[0].split('/').pop() || 'index.html').replace(/\.html$/, '');
      // Hash links to another page (e.g. contact.html#areas) stay neutral
      if (target === here && href.indexOf('#') === -1) a.classList.add('active');
    });
  }

  /* ── 4. Gallery filters ──────────────────────────────────────────────── */
  function initGalleryFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('.g-item');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        items.forEach(function (it) {
          it.classList.toggle('hidden', f !== 'all' && it.getAttribute('data-cat') !== f);
        });
      });
    });
  }

  /* ── 5. Lightbox ─────────────────────────────────────────────────────── */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImage');
    var lbCap = document.getElementById('lbCaption');
    var close = document.getElementById('lbClose');
    if (!lb || !lbImg || !close) return; // pages without the viewer markup

    document.querySelectorAll('.g-item').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var img = fig.querySelector('img');
        var key = img.getAttribute('data-img-key');
        var id = img.getAttribute('data-cld-id');
        var caption = fig.querySelector('figcaption');
        // Request a larger Cloudinary rendition for the viewer
        lbImg.src = IMG.url(key, { w: 1600 });
        lbImg.onerror = function () { lbImg.onerror = null; lbImg.src = img.src; };
        lbImg.alt = img.alt;
        lbCap.textContent = caption ? caption.textContent : '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function dismiss() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    close.addEventListener('click', dismiss);
    lb.addEventListener('click', function (e) { if (e.target === lb) dismiss(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dismiss(); });
  }

  /* ── 6. Booking calendar block ─────────────────────────────────────────
         The owner will provide the calendar name separately. Until it is set
         (PUBLIC_CALENDAR_NAME in js/config.js + .env), a placeholder is shown
         so no broken embed ever appears. */
  function initCalendar() {
    var card = document.getElementById('calendarCard');
    if (!card) return;
    var name = (CFG.PUBLIC_CALENDAR_NAME || '').trim();

    if (name) {
      // Calendar provider URL can be refined once the name/provider is known.
      var src = 'https://calendar.google.com/calendar/appointments/' +
                encodeURIComponent(name) + '?gv=true';
      card.innerHTML =
        '<h3>Choose your slot</h3>' +
        '<iframe src="' + src + '" title="Book a free quotation with Phiko Trading" loading="lazy"></iframe>';
    } else {
      card.innerHTML =
        '<span class="badge-soon">Booking calendar — coming online</span>' +
        '<h3>Book your free quotation</h3>' +
        '<p>Our online booking calendar is being connected. In the meantime, the ' +
        'fastest way to reserve your free site assessment is a call or WhatsApp ' +
        'message to the Director.</p>' +
        '<p style="font-weight:700;color:#0a1f3c">' + (CFG.PHONE_DISPLAY || '+27 74 724 8037') + '</p>';
    }
  }

  /* ── 7. Misc ─────────────────────────────────────────────────────────── */
  function initMisc() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    resolveImages();
    resolveContactLinks();
    initHeader();
    initActiveNav();
    initGalleryFilters();
    initLightbox();
    initCalendar();
    initMisc();
  });
})();
