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
      { id: "fonctionnement", label: "La commande en bref" },
      { id: "livraison-ou-retrait", label: "Livraison ou retrait" },
    ],
  },
  {
    id: "utilisateur",
    label: "Utilisateur",
    items: [
      { id: "decouvrir", label: "Découvrir" },
      { id: "passer-commande", label: "Commander" },
      { id: "paiement", label: "Paiement" },
      { id: "recevoir-commande-client", label: "Recevoir sa commande" },
      { id: "suivi-commande", label: "Suivi et historique" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    items: [
      { id: "afrobite-resto", label: "Prise en main" },
      { id: "recevoir-commande", label: "Recevoir une commande" },
      { id: "accepter-refuser", label: "Accepter ou refuser" },
      { id: "preparation-restaurant", label: "Paiement et préparation" },
      { id: "remise-restaurant", label: "Remettre la commande" },
      { id: "gerer-restaurant", label: "Gérer son restaurant" },
    ],
  },
  {
    id: "livraison",
    label: "Livreur",
    items: [
      { id: "afrobite-livreur", label: "Prise en main" },
      { id: "offres-livraison", label: "Recevoir une course" },
      { id: "recuperation-restaurant", label: "Récupération au restaurant" },
      { id: "livraison-au-client", label: "Livraison au client" },
      { id: "historique-livreur", label: "Historique" },
    ],
  },
];

export const DOCUMENTATION_ITEMS = DOCUMENTATION_GROUPS.flatMap(
  (group) => group.items,
);
