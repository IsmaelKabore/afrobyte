/**
 * AfroBite site — navigation mobile, FAQ accordéon, formulaire support → email,
 * thème clair/sombre partagé (clé localStorage commune avec l'accueil).
 */
(function () {
  // ── Thème clair / sombre ──────────────────────────────────────────────────
  const THEME_KEY = 'afrobite-theme';
  function applyTheme(theme, btn) {
    document.documentElement.dataset.theme = theme;
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  const savedTheme =
    localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme, null);

  // Bouton injecté dans le header de toutes les pages (partenaire compris —
  // leur variante claire vit dans css/partenaire-light.css).
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    btn.setAttribute('aria-label', 'Basculer entre thème clair et sombre');
    applyTheme(document.documentElement.dataset.theme, btn);
    btn.addEventListener('click', function () {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next, btn);
    });
    const navToggleBtn = siteNav.querySelector('.nav-toggle');
    siteNav.insertBefore(btn, navToggleBtn || null);
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('open', !open);
    });
  }

  document.querySelectorAll('.nav-dropdown').forEach(function (item) {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        e.preventDefault();
        const isOpen = item.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  document.querySelectorAll('.faq-accordion').forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('is-open', !expanded);
      panel.hidden = expanded;
    });
  });

  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const subject = document.getElementById('subject');
      const subjectLabel = subject?.options[subject.selectedIndex]?.text || '';
      const orderNum = document.getElementById('order-number')?.value || '';
      const message = document.getElementById('message')?.value || '';
      const body = [
        'Message depuis le centre d\'aide AfroBite',
        '',
        'Nom : ' + name,
        'E-mail : ' + email,
        orderNum ? 'N° commande : ' + orderNum : '',
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n');
      const mailto =
        'mailto:afrobyteapp@gmail.com?subject=' +
        encodeURIComponent('[AfroBite] ' + subjectLabel) +
        '&body=' +
        encodeURIComponent(body);
      window.location.href = mailto;
    });
  }
})();
