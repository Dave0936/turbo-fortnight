/* ==========================================================================
   Coul House — site behaviour
   Progressive enhancement only: every page works with JavaScript disabled.
   Booking buttons are plain links to the booking page; menus, filters and
   pickers simply show everything until this script takes over.
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

  var PHONE = '+44 (0)1997 421487';
  var EMAIL = 'stay@coulhouse.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------- Dialog helpers
     Shared by the mobile menu and the booking dialog: lock the page, move
     focus in, keep Tab inside, and hand focus back on close. */

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var openDialog = null;
  var lastFocus = null;

  var showDialog = function (el, focusTarget) {
    if (openDialog) hideDialog();
    lastFocus = document.activeElement;
    el.hidden = false;
    openDialog = el;
    document.body.classList.add('is-locked');
    (focusTarget || el.querySelector(FOCUSABLE)).focus();
  };

  var hideDialog = function () {
    if (!openDialog) return;
    openDialog.hidden = true;
    openDialog = null;
    document.body.classList.remove('is-locked');
    document.querySelectorAll('[data-menu-open]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener('keydown', function (e) {
    if (!openDialog) return;
    if (e.key === 'Escape') { hideDialog(); return; }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(openDialog.querySelectorAll(FOCUSABLE), function (n) {
      return n.offsetParent !== null;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
    btn.addEventListener('click', hideDialog);
  });

  /* ----------------------------------------------------------------- Toast */

  var toastEl = document.querySelector('[data-toast]');
  var toastTimer = null;
  var toast = function (msg, isError) {
    if (!toastEl) return;
    window.clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.toggle('is-error', !!isError);
    toastEl.hidden = false;
    toastTimer = window.setTimeout(function () { toastEl.hidden = true; }, 6000);
  };

  /* ------------------------------------------------------------ Mobile menu */

  var menu = document.getElementById('site-menu');
  document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!menu) return;
      btn.setAttribute('aria-expanded', 'true');
      showDialog(menu);
    });
  });
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && openDialog === menu) hideDialog();
    });
    // Reset if the viewport grows past the breakpoint with the menu open
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches && openDialog === menu) hideDialog();
    });
  }

  /* --------------------------------------------------------- "More" menu */

  document.querySelectorAll('[data-more]').forEach(function (wrap) {
    var btn = wrap.querySelector('button');
    var panel = wrap.querySelector('.nav__menu');
    if (!btn || !panel) return;
    var set = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) set(false);
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        set(false);
        btn.focus();
      }
    });
    wrap.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !wrap.contains(e.relatedTarget)) set(false);
    });
  });

  /* --------------------------------------------------- Current page in nav */

  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .menu__nav a').forEach(function (link) {
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

    // Carry across every other field the sending page named — room type,
    // guest count, offer — so "Reserve this room" arrives with it chosen.
    if (!form.hasAttribute('data-booking-modal')) {
      params.forEach(function (value, key) {
        if (key === 'arrive' || key === 'depart' || !value) return;
        var field = form.querySelector('[name="' + key + '"]');
        if (!field) return;
        if (field.tagName === 'SELECT') {
          var has = function (v) {
            return Array.prototype.some.call(field.options, function (o) { return o.value === v; });
          };
          // The dialog's stepper allows larger parties than the select lists
          if (!has(value) && /^\d+$/.test(value) && Number(value) >= 5 && has('5+')) value = '5+';
          if (has(value)) field.value = value;
        } else {
          field.value = value;
        }
      });

      // Offer links carry no matching field, so note the offer for whoever
      // picks up the enquiry rather than dropping it silently.
      var offer = params.get('offer');
      var notes = form.querySelector('textarea[name="notes"]');
      if (offer && notes && !notes.value) {
        notes.value = 'I would like to book the "' +
          offer.replace(/-/g, ' ').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); }) +
          '" offer.';
      }
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
        // Don't send empty hidden fields along
        form.querySelectorAll('input[type="hidden"]').forEach(function (h) {
          h.disabled = !h.value;
        });
      });
    }
  });

  /* ------------------------------------------------------- Guest steppers */

  document.querySelectorAll('[data-stepper]').forEach(function (stepper) {
    var input = stepper.querySelector('input');
    var out = stepper.querySelector('[data-stepper-value]');
    var min = Number(stepper.getAttribute('data-min') || 1);
    var max = Number(stepper.getAttribute('data-max') || 12);
    stepper.querySelectorAll('[data-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = Math.min(max, Math.max(min, Number(input.value) + Number(btn.getAttribute('data-step'))));
        input.value = String(next);
        out.textContent = String(next);
      });
    });
  });

  /* ------------------------------------------------------- Booking dialog
     Every "Check Availability" / "Reserve" link carries data-book (and
     optionally a label for what was chosen). It is a real link to the booking
     page, so it still works without JavaScript; with it, the quick dialog
     opens in place instead. */

  var bookModal = document.getElementById('book-modal');
  if (bookModal) {
    var bookForm = bookModal.querySelector('form');
    var prefillEl = bookModal.querySelector('[data-book-prefill]');
    var guestsInput = bookModal.querySelector('input[name="guests"]');
    var guestsOut = bookModal.querySelector('[data-stepper-value]');

    document.querySelectorAll('[data-book]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var label = trigger.getAttribute('data-book') || '';
        var href = trigger.getAttribute('href') || '';
        var query = new URLSearchParams(href.split('?')[1] || '');

        prefillEl.textContent = label;
        prefillEl.hidden = !label;
        // Carry the link's room / offer / dinner choice through the dialog
        bookForm.querySelectorAll('input[type="hidden"]').forEach(function (field) {
          if (field.name === 'guests') return;
          field.disabled = false;
          field.value = query.get(field.name) || '';
        });
        if (guestsInput) { guestsInput.value = '2'; guestsOut.textContent = '2'; }

        if (openDialog === menu) hideDialog();
        showDialog(bookModal, bookModal.querySelector('input[name="arrive"]'));
      });
    });
  }

  /* --------------------------------------------- Room showcase (home page)
     A single-open accordion that also swaps the photograph beside it. */

  document.querySelectorAll('[data-showcase]').forEach(function (root) {
    var buttons = root.querySelectorAll('[data-showcase-btn]');
    var slides = root.querySelectorAll('[data-showcase-slide]');
    var select = function (index) {
      buttons.forEach(function (btn, i) {
        var on = i === index;
        btn.setAttribute('aria-expanded', String(on));
        document.getElementById(btn.getAttribute('aria-controls')).hidden = !on;
      });
      slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === index); });
    };
    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { select(i); });
    });
    select(0);
  });

  /* ---------------------------------------------------- Gift voucher picker */

  document.querySelectorAll('[data-picker]').forEach(function (root) {
    var opts = root.querySelectorAll('[data-pick]');
    var details = root.querySelectorAll('[data-pick-detail]');
    opts.forEach(function (opt, i) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o, j) { o.setAttribute('aria-pressed', String(i === j)); });
        details.forEach(function (d, j) { d.classList.toggle('is-active', i === j); });
      });
    });
  });

  /* --------------------------------------------- Filter chips (places, gallery) */

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var chips = root.querySelectorAll('[data-filter]');
    var items = root.querySelectorAll('[data-tags]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        items.forEach(function (item) {
          var tags = item.getAttribute('data-tags').split(' ');
          item.hidden = !(value === 'all' || tags.indexOf(value) !== -1);
        });
      });
    });
  });

  /* ------------------------------------------------- Room photo thumbnails */

  document.querySelectorAll('[data-thumbs]').forEach(function (root) {
    var main = root.querySelector('[data-thumbs-main]');
    var thumbs = root.querySelectorAll('.thumb');
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        main.src = img.currentSrc || img.src;
        thumbs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === thumb)); });
      });
    });
  });

  /* ------------------------------------------------------ Timeline arrows */

  document.querySelectorAll('[data-scroller-root]').forEach(function (root) {
    var scroller = root.querySelector('[data-scroller]');
    var step = function (dir) {
      scroller.scrollBy({ left: dir * 400, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var prev = root.querySelector('[data-scroll-prev]');
    var next = root.querySelector('[data-scroll-next]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
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
      '<button class="close-btn lightbox__close" type="button" aria-label="Close">' +
      '<svg aria-hidden="true"><use href="#i-x"/></svg></button>' +
      '<figure class="lightbox__figure"><img alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    document.body.appendChild(box);

    var boxImg = box.querySelector('img');
    var boxCap = box.querySelector('figcaption');
    var closeBtn = box.querySelector('.lightbox__close');
    var boxReturn = null;

    var openBox = function (item) {
      var img = item.querySelector('img');
      if (!img) return;
      boxReturn = item;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt || '';
      boxCap.textContent = item.getAttribute('data-caption') || img.alt || '';
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    };
    var closeBox = function () {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (boxReturn) boxReturn.focus();
    };

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openBox(item); });
    });

    closeBtn.addEventListener('click', closeBox);
    box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeBox();
      // Only one control inside, so keep focus on it
      if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
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
        'reservations system, so please call ' + PHONE + ' or email ' + EMAIL +
        ' and we will reply the same day.';
      status.setAttribute('role', 'status');
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ------------------------------------------------------------ Newsletter
     Not yet connected to a mailing service; say so rather than pretend. */

  document.querySelectorAll('[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (!email.value.trim() || !email.checkValidity()) {
        toast('Please enter a valid email address.', true);
        email.focus();
        return;
      }
      toast('Thank you. Our mailing list is not live yet — email ' + EMAIL + ' and we will add you.');
      form.reset();
    });
  });

  /* ------------------------------------------------------------- Copyright */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
