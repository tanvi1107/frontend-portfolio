/**
 * ══════════════════════════════════════════════════
 * TANVI BHATT — PORTFOLIO SCRIPT
 * Features :  Preloader · Custom Cursor · Navbar
 *             Theme Toggle · Typing Animation
 *             Scroll Reveal · Skill Bars
 *             Project Filter · Contact Form
 *             Footer Year · Button Ripple · Parallax
 * ══════════════════════════════════════════════════
 */

/* ─── DOMContentLoaded bootstrap ─── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initThemeToggle();
  initNavbar();
  initTypingAnimation();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initFooterYear();
  initButtonRipple();
  initParallax();
});

/* ══════════════════════════════════════════════════
   1. PRELOADER
   ══════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counter   = document.getElementById('preloaderCounter');
  if (!preloader) return;

  let count = 0;
  const target   = 100;
  const duration = 1800;                 // ms
  const step     = duration / target;   // interval per tick

  const tick = setInterval(() => {
    count += 1;
    if (counter) counter.textContent = count;

    if (count >= target) {
      clearInterval(tick);
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger hero reveals staggered
        document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
          setTimeout(() => el.classList.add('revealed'), i * 120);
        });
      }, 300);
    }
  }, step);
}

/* ══════════════════════════════════════════════════
   2. CUSTOM CURSOR
   ══════════════════════════════════════════════════ */
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (!window.matchMedia('(hover: hover)').matches) return;  // Skip touch

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  // Dot tracks mouse instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lerp lag
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover enlarge on interactive elements
  const targets = 'a, button, input, textarea, .filter-btn, .project-card, .skill-tag';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = ''; });
}

/* ══════════════════════════════════════════════════
   3. THEME TOGGLE (Dark / Light)
   ══════════════════════════════════════════════════ */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Restore saved preference
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ══════════════════════════════════════════════════
   4. NAVBAR — Scroll · Active Link · Mobile Menu
   ══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  // Scrolled class + active link
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 120) current = sec.id;
    });
    allLinks.forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`)
    );
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for all hash anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id     = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════════
   5. TYPING ANIMATION
   ══════════════════════════════════════════════════ */
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // Phrases relevant to Tanvi's skills
  const phrases = [
    'responsive React interfaces.',
    'pixel-perfect UI layouts.',
    'mobile-first web apps.',
    'clean, reusable components.',
    'interactive experiences.',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  function type() {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
    } else {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
    }

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === phrase.length) {
      isPaused = true;
      setTimeout(() => {
        isPaused   = false;
        isDeleting = true;
        type();
      }, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed       = 400;
    }

    if (!isPaused) setTimeout(type, speed);
  }

  // Start after preloader finishes
  setTimeout(type, 2400);
}

/* ══════════════════════════════════════════════════
   6. SCROLL REVEAL
   ══════════════════════════════════════════════════ */
function initScrollReveal() {
  const all = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  // Hero elements revealed by preloader — exclude them
  const els = Array.from(all).filter(el => !el.closest('.hero'));

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════
   7. SKILL BARS ANIMATION
   ══════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width') || '0';
        setTimeout(() => { fill.style.width = width + '%'; }, 250);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ══════════════════════════════════════════════════
   8. PROJECT FILTER
   ══════════════════════════════════════════════════ */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ══════════════════════════════════════════════════
   9. CONTACT FORM VALIDATION
   ══════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError')    },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError')   },
    subject: { el: document.getElementById('contactSubject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn ? submitBtn.querySelector('.btn-text') : null;

  const validators = {
    name:    v => v.trim().length >= 2                         ? '' : 'Name must be at least 2 characters.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3                         ? '' : 'Subject must be at least 3 characters.',
    message: v => v.trim().length >= 15                        ? '' : 'Message must be at least 15 characters.',
  };

  // Real-time validation after first blur
  Object.entries(fields).forEach(([key, { el, err }]) => {
    if (!el) return;
    el.addEventListener('blur',  () => validateField(key, el, err));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(key, el, err); });
  });

  function validateField(key, el, err) {
    const msg = validators[key](el.value);
    el.classList.toggle('error', !!msg);
    if (err) err.textContent = msg;
    return !msg;
  }

  function validateAll() {
    return Object.entries(fields).reduce((valid, [key, { el, err }]) => {
      return validateField(key, el, err) && valid;
    }, true);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Loading state
    if (submitBtn) submitBtn.classList.add('btn--loading');
    if (btnText)   btnText.textContent = 'Sending…';

    // Simulate network request (replace with real fetch / EmailJS / Formspree)
    await new Promise(resolve => setTimeout(resolve, 1600));

    form.reset();
    Object.values(fields).forEach(({ el }) => el && el.classList.remove('error'));

    if (successEl) successEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
    if (submitBtn) submitBtn.classList.remove('btn--loading');
    if (btnText)   btnText.textContent = 'Send Message';

    setTimeout(() => { if (successEl) successEl.textContent = ''; }, 5000);
  });
}

/* ══════════════════════════════════════════════════
   10. FOOTER YEAR
   ══════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════
   11. BUTTON RIPPLE MICRO-INTERACTION
   ══════════════════════════════════════════════════ */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--x', ((e.clientX - r.left) / r.width  * 100) + '%');
      btn.style.setProperty('--y', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  });
}

/* ══════════════════════════════════════════════════
   12. PARALLAX — Orbs follow mouse subtly
   ══════════════════════════════════════════════════ */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const f = (i + 1) * 12;
      orb.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
    });
  });
}