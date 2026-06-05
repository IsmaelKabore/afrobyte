/**
 * Contrôles « Comment ça marche » — iframe demo + indicateur d'étapes
 */
(function () {
  const CONFIG = {
    restaurant: {
      iframeSrc: 'restaurant-demo/?embed=1&minimal=1',
      steps: [
        { label: 'Connexion restaurant', sub: 'Email et mot de passe AfroBite' },
        { label: 'Validation en cours', sub: 'Compte pending — activation par AfroBite' },
        { label: 'Onglet « Mes plats »', sub: 'Gérez votre menu' },
        { label: 'Ajouter un plat', sub: 'Bouton + sur Mes plats' },
        { label: 'Détails du plat', sub: 'Nom, prix, photo, catégorie' },
        { label: 'Plat enregistré', sub: 'Disponible pour les commandes' },
        { label: 'Onglet « Ajouter »', sub: 'Publier une vidéo' },
        { label: 'Enregistrer la vidéo', sub: 'Filmer ou choisir depuis la galerie' },
        { label: 'Publier', sub: 'Description, plat lié, puis Publier' },
        { label: 'Vidéo en ligne', sub: 'Visible dans le feed client AfroBite' },
      ],
    },
    delivery: {
      iframeSrc: 'delivery-demo/?embed=1&minimal=1',
      steps: [
        { label: 'Connexion livreur', sub: 'Compte créé sur afrobite.app' },
        { label: 'Validation en cours', sub: 'Pending — approbation admin requise' },
        { label: 'Carte — Passer en ligne', sub: 'Activez pour recevoir des offres' },
        { label: 'Nouvelle offre', sub: 'Course proposée sur la carte' },
        { label: 'Accepter la course', sub: 'Voir restaurant et client' },
        { label: 'Vers le restaurant', sub: 'Navigation Mapbox' },
        { label: 'Commande récupérée', sub: 'Confirmer au restaurant' },
        { label: 'Vers le client', sub: 'Suivi GPS en direct' },
        { label: 'Livraison confirmée', sub: 'Code ou confirmation client' },
        { label: 'Gains', sub: 'Historique dans l\'onglet Gains' },
      ],
    },
  };

  function initDemoSection(section) {
    const kind = section.dataset.demoKind;
    const cfg = CONFIG[kind];
    if (!cfg) return;

    const iframe = section.querySelector('.demo-iframe');
    const stepBadge = section.querySelector('.demo-step-badge');
    const stepTitle = section.querySelector('.demo-step-title');
    const stepSub = section.querySelector('.demo-step-sub');
    const prevBtn = section.querySelector('.demo-prev');
    const playBtn = section.querySelector('.demo-play');
    const nextBtn = section.querySelector('.demo-next');
    const dotsContainer = section.querySelector('.demo-dots');

    if (iframe && cfg.iframeSrc) iframe.src = cfg.iframeSrc;

    let currentIndex = 0;
    let playing = true;
    const steps = cfg.steps;

    function sendGo(index) {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: 'demoGo', index: Math.max(0, Math.min(index, steps.length - 1)) },
          '*'
        );
      }
    }

    function sendPlayPause(value) {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'demoPlayPause', playing: value }, '*');
      }
    }

    function updateUI(index, isPlaying) {
      currentIndex = index;
      playing = isPlaying;
      const s = steps[index] || steps[0];
      if (stepBadge) stepBadge.textContent = index + 1;
      if (stepTitle) stepTitle.textContent = s.label;
      if (stepSub) stepSub.textContent = s.sub;
      if (playBtn) playBtn.textContent = playing ? '⏸' : '▶';
      dotsContainer?.querySelectorAll('.demo-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.classList.toggle('passed', i < index);
      });
    }

    window.addEventListener('message', (e) => {
      const d = e.data;
      if (d && d.type === 'demoSlideChange' && iframe && e.source === iframe.contentWindow) {
        updateUI(d.index ?? 0, d.playing ?? true);
      }
    });

    prevBtn?.addEventListener('click', () => sendGo(currentIndex - 1));
    nextBtn?.addEventListener('click', () => sendGo(currentIndex + 1));
    playBtn?.addEventListener('click', () => {
      playing = !playing;
      sendPlayPause(playing);
      updateUI(currentIndex, playing);
    });

    steps.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'demo-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Étape ' + (i + 1));
      dot.addEventListener('click', () => sendGo(i));
      dotsContainer?.appendChild(dot);
    });

    updateUI(0, true);
  }

  document.querySelectorAll('[data-demo-kind]').forEach(initDemoSection);

  document.querySelectorAll('.fade-in').forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
  });
})();
