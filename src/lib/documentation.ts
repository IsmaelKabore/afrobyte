export type DocumentationItem = {
  id: string;
  label: string;
};

export type DocumentationGroup = {
  id: string;
  label: string;
  items: DocumentationItem[];
};

/** Navigation et ancres de la documentation publique. */
export const DOCUMENTATION_GROUPS: DocumentationGroup[] = [
  {
    id: "afrobite",
    label: "AfroBite",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "fonctionnement", label: "Comment fonctionne AfroBite" },
      { id: "cycle-commande", label: "Cycle complet d’une commande" },
    ],
  },
  {
    id: "utilisateur",
    label: "Utilisateur",
    items: [
      { id: "decouvrir-restaurants", label: "Découvrir les restaurants" },
      { id: "feed-video", label: "Feed vidéo" },
      { id: "passer-commande", label: "Passer une commande" },
      { id: "paiement", label: "Paiement" },
      { id: "livraison-client", label: "Livraison" },
      { id: "retrait-client", label: "Retrait au restaurant" },
      { id: "suivi-commande", label: "Suivre une commande" },
      { id: "historique-client", label: "Historique des commandes" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    items: [
      { id: "restaurant-introduction", label: "Introduction" },
      { id: "afrobite-resto", label: "Application AfroBite Resto" },
      { id: "tablette-restaurant", label: "Tablette restaurant" },
      { id: "mobile-restaurant", label: "Application mobile" },
      { id: "recevoir-commande", label: "Recevoir une commande" },
      { id: "accepter-refuser", label: "Accepter ou refuser" },
      { id: "paiement-confirme", label: "Paiement confirmé" },
      { id: "preparer-commande", label: "Préparer la commande" },
      { id: "plat-pret", label: "Plat prêt" },
      { id: "remise-livreur", label: "Remise au livreur" },
      { id: "retrait-par-client", label: "Retrait par le client" },
      { id: "revenus-historique", label: "Revenus et historique" },
      { id: "videos-catalogue", label: "Vidéos et catalogue" },
    ],
  },
  {
    id: "livraison",
    label: "Livraison",
    items: [
      { id: "livraison-fonctionnement", label: "Fonctionnement général" },
      { id: "societe-livraison", label: "Société de livraison" },
      { id: "afrobite-livreur", label: "Application AfroBite Livreur" },
      { id: "mise-en-ligne", label: "Mise en ligne" },
      { id: "attribution-livraison", label: "Attribution d’une livraison" },
      { id: "acceptation-course", label: "Acceptation d’une course" },
      { id: "recuperation-restaurant", label: "Récupération au restaurant" },
      { id: "livraison-au-client", label: "Livraison au client" },
      { id: "confirmation-livraison", label: "Confirmation de livraison" },
      { id: "historique-livreur", label: "Historique" },
    ],
  },
  {
    id: "operations",
    label: "Opérations AfroBite",
    items: [
      { id: "dashboard-admin", label: "Dashboard administratif" },
      { id: "supervision-commandes", label: "Supervision des commandes" },
      { id: "support-call-center", label: "Support / Call Center" },
      { id: "gestion-incidents", label: "Gestion des incidents" },
      { id: "operations-restaurants", label: "Restaurants" },
      { id: "operations-livreurs", label: "Livreurs" },
    ],
  },
  {
    id: "technique",
    label: "Technique",
    items: [
      { id: "architecture", label: "Architecture générale" },
      { id: "applications", label: "Applications AfroBite" },
      { id: "environnements", label: "Environnements" },
      { id: "principes-developpeurs", label: "Principes pour les développeurs" },
    ],
  },
];

export const DOCUMENTATION_ITEMS = DOCUMENTATION_GROUPS.flatMap(
  (group) => group.items,
);
