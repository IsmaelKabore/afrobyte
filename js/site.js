/**
 * AfroBite site — navigation mobile, FAQ accordéon, formulaire support → email.
 */
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('open', !open);
    });
  }

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
