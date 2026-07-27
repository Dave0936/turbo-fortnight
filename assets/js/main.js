/* ==========================================================================
   Coul House — site behaviour
   Progressive enhancement only: every page works with JavaScript disabled.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ Config
     Every availability form on the site posts here. To hand booking over to a
     real reservations engine (SiteMinder, Guestline, ResDiary, Little Hotelier
     and friends all accept dates as query parameters), change this one value to
     the engine's deep-link base and, if its parameter names differ from ours,
     map them in BOOKING_PARAM_MAP below. Nothing else needs to change. */
  var BOOKING_URL = 'book.html';
  var BOOKING_PARAM_MAP = {
    // ours    : theirs
    arrive: 'arrive',
    depart: 'depart',
    guests: 'guests',
    rooms:  'rooms'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Header */

  var header = document.querySelector('[data-header]');
  if (header) {
    var setStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  /* ------------------------------------------------------------ Mobile nav */

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');

  if (navToggle && nav) {
    var closeNav = function () {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    };

    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('is-locked', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Reset the panel if the viewport grows past the mobile breakpoint
    window.matchMedia('(min-width: 1121px)').addEventListener('change', function (e) {
      if (e.matches) closeNav();
    });
  }

  /* --------------------------------------------------- Current page in nav */

  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
  });

  /* -------------------------------------------------------- Scroll reveals */

  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });

      /* Safety net. A fast fling, a jump to an anchor, or pressing End can move
         an element through the viewport between rendered frames, so the
         observer never sees it intersect and the content would stay invisible.
         Sweep anything at or above the fold and reveal it outright. */
      var sweeping = false;
      var sweep = function () {
        sweeping = false;
        var pending = document.querySelectorAll('.reveal:not(.is-in)');
        for (var i = 0; i < pending.length; i++) {
          if (pending[i].getBoundingClientRect().top < window.innerHeight) {
            pending[i].classList.add('is-in');
            io.unobserve(pending[i]);
          }
        }
      };
      var queueSweep = function () {
        if (sweeping) return;
        sweeping = true;
        window.requestAnimationFrame(sweep);
      };
      window.addEventListener('scroll', queueSweep, { passive: true });
      window.addEventListener('resize', queueSweep);
      window.addEventListener('load', sweep);
      queueSweep();
    }
  }

  /* ---------------------------------------------------------- Sticky CTA */

  var stickyCta = document.querySelector('[data-sticky-cta]');
  if (stickyCta) {
    var toggleCta = function () {
      stickyCta.classList.toggle('is-visible', window.scrollY > 600);
    };
    toggleCta();
    window.addEventListener('scroll', toggleCta, { passive: true });
  }

  /* ------------------------------------------------------ Guest testimonials */

  var quotesRoot = document.querySelector('[data-quotes]');
  if (quotesRoot) {
    var quotes = Array.prototype.slice.call(quotesRoot.querySelectorAll('[data-quote]'));
    var dots = Array.prototype.slice.call(quotesRoot.querySelectorAll('[data-quote-dot]'));
    var index = 0;
    var timer = null;

    var show = function (next) {
      index = (next + quotes.length) % quotes.length;
      quotes.forEach(function (q, i) { q.classList.toggle('is-active', i === index); });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); });
    };

    var start = function () {
      if (reduceMotion || quotes.length < 2) return;
      stop();
      timer = window.setInterval(function () { show(index + 1); }, 8000);
    };
    var stop = function () { if (timer) window.clearInterval(timer); timer = null; };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });
    quotesRoot.addEventListener('mouseenter', stop);
    quotesRoot.addEventListener('mouseleave', start);
    quotesRoot.addEventListener('focusin', stop);
    quotesRoot.addEventListener('focusout', start);

    start();
  }

  /* --------------------------------------------------------- Date handling */

  var toISO = function (date) { return date.toISOString().slice(0, 10); };
  var addDays = function (date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  };

  document.querySelectorAll('[data-booking-form]').forEach(function (form) {
    var arrive = form.querySelector('input[name="arrive"]');
    var depart = form.querySelector('input[name="depart"]');
    if (!arrive || !depart) return;

    var today = new Date();
    var params = new URLSearchParams(location.search);

    arrive.min = toISO(today);
    depart.min = toISO(addDays(today, 1));

    // Prefill from the URL when a form on another page sent us here,
    // otherwise offer a sensible default of tomorrow for two nights.
    arrive.value = params.get('arrive') || toISO(addDays(today, 1));
    depart.value = params.get('depart') || toISO(addDays(today, 3));

    // Carry across every other field the sending page named — room type, guest
    // and room counts, dogs, dinner — so "Check Dates" links from the rooms
    // page arrive with the right room already chosen.
    params.forEach(function (value, key) {
      if (key === 'arrive' || key === 'depart' || !value) return;
      var field = form.querySelector('[name="' + key + '"]');
      if (!field) return;
      if (field.tagName === 'SELECT') {
        var match = Array.prototype.some.call(field.options, function (o) { return o.value === value; });
        if (match) field.value = value;
      } else {
        field.value = value;
      }
    });

    // Offer links carry no matching field, so note the offer for whoever picks
    // up the enquiry rather than dropping it silently.
    var offer = params.get('offer');
    var notes = form.querySelector('textarea[name="notes"]');
    if (offer && notes && !notes.value) {
      notes.value = 'I would like to book the "' +
        offer.replace(/-/g, ' ').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); }) +
        '" offer.';
    }

    // Departure must always follow arrival
    var syncDepart = function () {
      if (!arrive.value) return;
      var minDepart = toISO(addDays(new Date(arrive.value), 1));
      depart.min = minDepart;
      if (!depart.value || depart.value <= arrive.value) depart.value = minDepart;
      updateNights();
    };

    var nightsOut = form.querySelector('[data-nights]');
    var updateNights = function () {
      if (!nightsOut || !arrive.value || !depart.value) return;
      var ms = new Date(depart.value) - new Date(arrive.value);
      var nights = Math.max(0, Math.round(ms / 86400000));
      nightsOut.textContent = nights + (nights === 1 ? ' night' : ' nights');
    };

    arrive.addEventListener('change', syncDepart);
    depart.addEventListener('change', updateNights);
    updateNights();

    // Route the form at whatever BOOKING_URL points to, renaming fields if the
    // configured engine expects different parameter names. Skipped on the
    // booking page's own form, which is the destination rather than a sender.
    if (!form.hasAttribute('data-demo-form')) {
      form.setAttribute('action', BOOKING_URL);
      form.addEventListener('submit', function () {
        Object.keys(BOOKING_PARAM_MAP).forEach(function (ours) {
          var field = form.querySelector('[name="' + ours + '"]');
          if (field) field.name = BOOKING_PARAM_MAP[ours];
        });
      });
    }
  });

  /* ------------------------------------------------------------- Accordion */

  document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
    accordion.querySelectorAll('.accordion__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.accordion__item');
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-open', !open);
      });
    });
  });

  /* -------------------------------------------------------------- Lightbox */

  var galleryItems = document.querySelectorAll('[data-lightbox]');
  if (galleryItems.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Gallery image');
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close gallery">&times;</button>' +
      '<figure class="lightbox__figure"><img alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    document.body.appendChild(box);

    var boxImg = box.querySelector('img');
    var boxCap = box.querySelector('figcaption');
    var closeBtn = box.querySelector('.lightbox__close');
    var lastFocus = null;

    var openBox = function (src, alt, caption) {
      lastFocus = document.activeElement;
      boxImg.src = src;
      boxImg.alt = alt || '';
      boxCap.textContent = caption || '';
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    };
    var closeBox = function () {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    };

    var openFrom = function (item) {
      var img = item.querySelector('img');
      var cap = item.querySelector('figcaption');
      if (img) openBox(img.currentSrc || img.src, img.alt, cap ? cap.textContent.trim() : '');
    };

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openFrom(item); });
      // The gallery figures carry role="button", so they must answer to the
      // keyboard the way a button does.
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openFrom(item);
        }
      });
    });

    closeBtn.addEventListener('click', closeBox);
    box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) closeBox();
      // Keep focus inside the dialog while it is open
      if (e.key === 'Tab' && box.classList.contains('is-open')) {
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }

  /* ------------------------------------------------------- Enquiry forms */

  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      if (!status) return;
      status.hidden = false;
      status.textContent =
        'Thank you — your enquiry has been noted. This site is not yet connected to a live ' +
        'reservations system, so please call +44 (0)1997 421487 or email stay@coulhousehotel.com ' +
        'and we will reply the same day.';
      status.setAttribute('role', 'status');
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ------------------------------------------------------------- Copyright */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
