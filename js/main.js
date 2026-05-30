/* =========================================================
   RUHAN PORTFOLIO — MAIN.JS
   ========================================================= */

/* ─── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Kick off hero reveal
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
    startCounters();
  }, 2200);
});

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ─── SCROLL PROGRESS BAR ────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max      = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / max * 100) + '%';
}, { passive: true });

/* ─── STICKY HEADER ──────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE MENU ────────────────────────────────────────── */
const menuToggle  = document.getElementById('menu-toggle');
const mobileMenu  = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal:not(.hero .reveal)');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── SKILL BARS ─────────────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      card.classList.add('in-view');
      const fill = card.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
      skillObserver.unobserve(card);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function startCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.count));
  });
}

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ─── BACK TO TOP ────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.hidden = window.scrollY < 400;
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── CONTACT FORM VALIDATION ────────────────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name',    msg: 'Please enter your name.' },
      { id: 'email',   msg: 'Please enter a valid email.' },
      { id: 'message', msg: 'Please describe your project.' },
    ];

    fields.forEach(({ id, msg }) => {
      const input = document.getElementById(id);
      const error = input.nextElementSibling;
      const val   = input.value.trim();
      let fieldOk = val.length > 0;
      if (id === 'email') fieldOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      input.classList.toggle('error', !fieldOk);
      error.textContent = fieldOk ? '' : msg;
      if (!fieldOk) valid = false;
    });

    if (valid) {
      const successMsg = document.getElementById('form-success');
      const submitBtn  = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending…';
      setTimeout(() => {
        form.reset();
        successMsg.hidden = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
      }, 1400);
    }
  });

  // Live validation clear
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const error = input.nextElementSibling;
      if (error && error.classList.contains('form-error')) error.textContent = '';
    });
  });
}

/* ─── FOOTER YEAR ────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
