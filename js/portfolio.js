/* =========================================================
   RUHAN PORTFOLIO — PORTFOLIO.JS
   ========================================================= */

const filterBtns  = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        item.classList.remove('hidden', 'filtering-out');
        item.classList.add('filtering-in');
        item.removeAttribute('aria-hidden');
      } else {
        item.classList.add('filtering-out');
        item.removeAttribute('filtering-in');
        setTimeout(() => {
          if (!item.classList.contains('filtering-in')) {
            item.classList.add('hidden');
            item.setAttribute('aria-hidden', 'true');
          }
        }, 400);
      }
    });
  });
});

/* ─── KEYBOARD SUPPORT ───────────────────────────────────── */
portfolioItems.forEach(item => {
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.querySelector('.portfolio-overlay').style.opacity = '1';
    }
    if (e.key === 'Escape') {
      item.querySelector('.portfolio-overlay').style.opacity = '';
    }
  });
});
