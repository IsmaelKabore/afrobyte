/**
 * Source de vérité unique du site AfroBite (DRY).
 * Liens de navigation, colonnes du footer, liens stores, marquee.
 * On ne recopie plus ces données page par page : on les mappe.
 */

export type StoreKey =
  | "client-ios"
  | "client-android"
  | "restaurant-ios"
  | "restaurant-android"
  | "delivery-ios"
  | "delivery-android";

/**
 * ⚠️ UN SEUL ENDROIT À METTRE À JOUR : remplacez `null` par l'URL réelle
 * dès qu'une app est publiée. Tant qu'un lien vaut null, le badge/lien
 * affiche « Bientôt disponible ».
 */
export const STORE_LINKS: Record<StoreKey, string | null> = {
  "client-ios": null,
  "client-android": null,
  "restaurant-ios": null,
  "restaurant-android": null,
  "delivery-ios": null,
  "delivery-android": null,
};

export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/partenaire", label: "Partenaire" },
  { href: "/about", label: "À propos" },
  { href: "/support", label: "Support" },
  { href: "/privacy-policy", label: "Confidentialité" },
  { href: "/terms", label: "Conditions" },
];

export const MARQUEE_ITEMS: string[] = [
  "Riz Gras",
  "Brochettes",
  "Bissap",
  "Galettes",
  "Alloco",
  "Poulet",
  "Sauce Arachide",
  "Tô",
];

export type FooterLinkItem = { label: string; href?: string; store?: StoreKey };
export type FooterColumn = { title: string; links: FooterLinkItem[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Applications",
    links: [
      { label: "AfroBite — iOS", store: "client-ios" },
      { label: "AfroBite — Android", store: "client-android" },
      { label: "Restaurant — iOS", store: "restaurant-ios" },
      { label: "Restaurant — Android", store: "restaurant-android" },
      { label: "Livraison — iOS", store: "delivery-ios" },
      { label: "Livraison — Android", store: "delivery-android" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Devenir partenaire", href: "/partenaire" },
      { label: "Aide & Support", href: "/support" },
      { label: "Contact", href: "mailto:afrobyteapp@gmail.com" },
    ],
  },
  {
    title: "Mentions légales",
    links: [
      { label: "Confidentialité", href: "/privacy-policy" },
      { label: "Conditions d'utilisation", href: "/terms" },
      { label: "Remboursements", href: "/refund" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Cookies", href: "/privacy-policy#cookies" },
    ],
  },
];

export const BRAND = {
  name: "AfroBite",
  tagline: "Scrolle. Choisis. Mange.",
  legal: "© 2026 AFROBITE, UN SERVICE DE CORRIDOR SARL",
  location: "OUAGADOUGOU · BURKINA FASO",
  contactEmail: "afrobyteapp@gmail.com",
};
