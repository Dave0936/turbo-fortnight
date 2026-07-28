/* ==========================================================================
   Phoenix Drilling — site behaviour

   Progressive enhancement only. With JavaScript off: the nav is a plain list,
   every section is visible, the strata diagram is fully annotated, all FAQ
   answers are open, and the form submits normally. Nothing here is load
   bearing.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ Config
     The quote form currently shows a message pointing the visitor at the phone
     and the office email — it does not send anything. To connect it to a real
     endpoint (Formspree, Netlify Forms, or a script on the host), set the
     action and method on the <form> and remove its data-demo-form attribute.
     Validation and the honeypot below keep working either way. */
  var OFFICE_PHONE = '01506 411448';
  var OFFICE_EMAIL = 'info@phoenixdrilling.co.uk';

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
    window.matchMedia('(min-width: 1061px)').addEventListener('change', function (e) {
      if (e.matches) closeNav();
    });
  }

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

  /* ------------------------------------------------- Current section in nav */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var markCurrent = function (id) {
      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      // Whichever tracked section is nearest the top of the viewport wins.
      var best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible[entry.target.id] = entry.intersectionRatio;
        else delete visible[entry.target.id];
      });
      Object.keys(visible).forEach(function (id) {
        var top = document.getElementById(id).getBoundingClientRect().top;
        if (!best || top < best.top) best = { id: id, top: top };
      });
      if (best) markCurrent(best.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ------------------------------------------------------------ Stat count */

  var statStrip = document.querySelector('[data-stats]');
  if (statStrip) {
    var counters = Array.prototype.slice.call(statStrip.querySelectorAll('[data-count]'));

    var runCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      // Years count from a nearby figure rather than from zero — watching a
      // date spin up from 0 looks like a bug, not a flourish.
      var from = el.hasAttribute('data-plain') ? target - 40 : 0;
      var duration = 1100;
      var started = null;

      var frame = function (now) {
        if (started === null) started = now;
        var progress = Math.min((now - started) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(from + (target - from) * eased));
        if (progress < 1) window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    };

    if (!reduceMotion && counters.length && 'IntersectionObserver' in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          runCount(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIo.observe(el); });
    }
  }

  /* ------------------------------------------- Strata diagram annotations */

  var depthFigure = document.querySelector('[data-depth-figure]');
  if (depthFigure) {
    var annos = Array.prototype.slice.call(depthFigure.querySelectorAll('.depth-anno'));

    if (annos.length && !reduceMotion && 'IntersectionObserver' in window) {
      // Only hide the labels once we know we can bring them back. Priming
      // here rather than in the stylesheet means a script that fails to load
      // leaves a fully readable diagram.
      annos.forEach(function (el) { el.classList.add('is-primed'); });

      var depthIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          depthIo.unobserve(entry.target);
          annos.forEach(function (el, i) {
            window.setTimeout(function () { el.classList.add('is-lit'); }, i * 220);
          });
        });
      }, { threshold: 0.25 });
      depthIo.observe(depthFigure);

      // Same safety net as the reveals: if the figure is scrolled past before
      // the observer fires, light the labels rather than lose them.
      window.addEventListener('load', function () {
        var box = depthFigure.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          annos.forEach(function (el) { el.classList.add('is-lit'); });
        }
      });
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

  /* ------------------------------------------------------------- Accordion */

  document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
    accordion.querySelectorAll('.accordion__btn').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      // Closed on load, but only under script — the answers are readable
      // without it.
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
  });

  /* ----------------------------------------------------------- Quote form */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll('[data-quote-form]').forEach(function (form) {
    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input[required], select[required], textarea[required]')
    );

    var errorFor = function (field) {
      return form.querySelector('[data-error-for="' + field.id + '"]');
    };

    var validate = function (field) {
      var value = (field.value || '').trim();
      var message = '';

      if (!value) {
        message = field.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.';
      } else if (field.type === 'email' && !EMAIL_RE.test(value)) {
        message = 'Please enter a valid email address.';
      }

      var slot = errorFor(field);
      var wrap = field.closest('.field');
      if (slot) slot.textContent = message;
      if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    };

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validate(field); });
      // Clear an error as soon as the visitor fixes it, but never introduce
      // one mid-keystroke.
      field.addEventListener('input', function () {
        if (field.closest('.field').classList.contains('is-invalid')) validate(field);
      });
    });

    form.addEventListener('submit', function (e) {
      var firstBad = null;
      fields.forEach(function (field) {
        if (!validate(field) && !firstBad) firstBad = field;
      });

      if (firstBad) {
        e.preventDefault();
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        return;
      }

      // Honeypot: a real visitor never sees this field, so anything in it is a
      // bot. Fail silently rather than telling it why.
      var trap = form.querySelector('.hp input');
      if (trap && trap.value) {
        e.preventDefault();
        return;
      }

      if (!form.hasAttribute('data-demo-form')) return;

      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      if (!status) return;
      status.hidden = false;
      status.setAttribute('role', 'status');
      status.innerHTML =
        '<p><strong>Thank you — your enquiry has been noted.</strong> This site is not yet ' +
        'connected to a live mail handler, so please call <a href="tel:+441506411448">' +
        OFFICE_PHONE + '</a> or email <a href="mailto:' + OFFICE_EMAIL + '">' + OFFICE_EMAIL +
        '</a> and we will come back to you the same working day.</p>';
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ------------------------------------------------------------- Copyright */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
