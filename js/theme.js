/* =========================================================
   RUHAN PORTFOLIO — THEME.JS
   Dark / Light mode toggle with localStorage persistence
   ========================================================= */

(function initTheme() {
  const toggle  = document.getElementById('theme-toggle');
  const icon    = toggle?.querySelector('.theme-icon');
  const htmlEl  = document.documentElement.closest('html') || document.querySelector('html');
  const bodyEl  = document.body;

  // Restore saved preference or default to dark
  const savedTheme = localStorage.getItem('ruhan-theme') || 'dark';
  applyTheme(savedTheme);

  toggle?.addEventListener('click', () => {
    const current = bodyEl.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ruhan-theme', next);
  });

  function applyTheme(theme) {
    bodyEl.dataset.theme = theme;
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle?.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
})();
