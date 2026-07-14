/**
 * AfroBite — liens de téléchargement des applications.
 *
 * ⚠️ UN SEUL ENDROIT À METTRE À JOUR : remplacez `null` par l'URL réelle
 * dès qu'une app est publiée. Tous les boutons/badges du site qui portent
 * un attribut data-store="clé" seront mis à jour automatiquement.
 * Tant qu'un lien vaut null, le badge affiche « Bientôt disponible ».
 */
(function () {
  var STORE_LINKS = {
    /* App client (grand public) */
    'client-ios': null,        // TODO: URL App Store  — ex. https://apps.apple.com/app/id0000000000
    'client-android': null,    // TODO: URL Play Store — ex. https://play.google.com/store/apps/details?id=apps.artcom.foodtok

    /* App restaurant (gérants) */
    'restaurant-ios': null,    // TODO: URL App Store AfroBite Restaurant
    'restaurant-android': null,

    /* App livraison (livreurs) */
    'delivery-ios': null,      // TODO: URL App Store AfroBite Livraison
    'delivery-android': null
  };

  document.querySelectorAll('[data-store]').forEach(function (el) {
    var url = STORE_LINKS[el.getAttribute('data-store')];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.classList.add('store-soon');
      el.title = 'Bientôt disponible';
      el.setAttribute('aria-disabled', 'true');
      el.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });
})();
