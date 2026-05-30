/* =========================================================
   RUHAN PORTFOLIO — SLIDER.JS
   Testimonials carousel + Before/After comparison slider
   ========================================================= */

/* ─── TESTIMONIALS SLIDER ────────────────────────────────── */
(function initTestimonials() {
  const track   = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsWrap = document.getElementById('slider-dots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 1.5}rem))`;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  });

  startAuto();
})();

/* ─── BEFORE / AFTER SLIDER ──────────────────────────────── */
(function initBeforeAfter() {
  const slider   = document.getElementById('ba-slider');
  const handle   = document.getElementById('ba-handle');
  const before   = slider?.querySelector('.ba-before');
  if (!slider) return;

  let isDragging = false;
  let pct = 50;

  function updateSlider(x) {
    const rect = slider.getBoundingClientRect();
    pct = Math.max(2, Math.min(98, (x - rect.left) / rect.width * 100));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  // Mouse
  handle.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (isDragging) updateSlider(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch
  handle.addEventListener('touchstart', e => { isDragging = true; e.preventDefault(); }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (isDragging) updateSlider(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  // Click on slider
  slider.addEventListener('click', e => {
    if (e.target === handle || handle.contains(e.target)) return;
    updateSlider(e.clientX);
  });

  // Keyboard accessibility
  handle.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { pct = Math.max(2,  pct - 2); updateSlider(slider.getBoundingClientRect().left + slider.offsetWidth * pct / 100); }
    if (e.key === 'ArrowRight') { pct = Math.min(98, pct + 2); updateSlider(slider.getBoundingClientRect().left + slider.offsetWidth * pct / 100); }
  });

  // BA tabs (demo: change gradient palette)
  const baTabs = document.querySelectorAll('.ba-tab');
  const beforeVisual = slider.querySelector('.ba-visual-before');
  const afterVisual  = slider.querySelector('.ba-visual-after');

  const palettes = [
    { // Portrait Retouch
      before: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      after:  'linear-gradient(135deg, #1a1a2e 0%, #4F46E5 40%, #D4AF37 100%)',
      bFilter: 'saturate(0.3) brightness(0.8)',
      aFilter: 'saturate(1.4) brightness(1.1)',
    },
    { // Color Grading
      before: 'linear-gradient(135deg, #2d1b00 0%, #5c3300 50%, #8a4d00 100%)',
      after:  'linear-gradient(135deg, #002244 0%, #004488 40%, #00aaff 100%)',
      bFilter: 'saturate(0.5) brightness(0.7) sepia(0.4)',
      aFilter: 'saturate(1.6) brightness(1.2) contrast(1.1)',
    },
    { // Background Removal
      before: 'linear-gradient(135deg, #3a3a3a 0%, #555 50%, #777 100%)',
      after:  'linear-gradient(135deg, #f0f4f8 0%, #fff 50%, #e8f4fd 100%)',
      bFilter: 'saturate(0.2)',
      aFilter: 'saturate(1)',
    },
  ];

  baTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      baTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const p = palettes[i];
      beforeVisual.style.background = p.before;
      afterVisual.style.background  = p.after;
      beforeVisual.style.filter = p.bFilter;
      afterVisual.style.filter  = p.aFilter;
      // Reset handle
      pct = 50;
      before.style.clipPath = 'inset(0 50% 0 0)';
      handle.style.left = '50%';
    });
  });
})();
