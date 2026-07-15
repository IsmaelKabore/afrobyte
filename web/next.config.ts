import type { NextConfig } from "next";

/* Anciennes URLs .html du site statique → nouvelles routes Next (permanent).
   Préserve les liens externes et le SEO. */
const HTML_REDIRECTS: Record<string, string> = {
  "/index.html": "/",
  "/about.html": "/about",
  "/support.html": "/support",
  "/terms.html": "/terms",
  "/privacy-policy.html": "/privacy-policy",
  "/mentions-legales.html": "/mentions-legales",
  "/partenaire.html": "/partenaire",
  "/partenaire-restaurant.html": "/partenaire",
  "/partenaire-livraison.html": "/partenaire",
  "/partner.html": "/partenaire",
  "/partner-restaurant.html": "/partenaire",
  "/partner-livreur.html": "/partenaire",
  "/partner-societe-livraison.html": "/partenaire",
  "/restaurant.html": "/",
  "/refund.html": "/",
  "/refund-confirmation.html": "/",
};

/* Anciens chemins /partner* (redirections temporaires, comme l'ancien vercel.json). */
const PATH_REDIRECTS: Record<string, string> = {
  "/partner": "/partenaire",
  "/partner/restaurant": "/partenaire",
  "/partner/livreur": "/partenaire",
  "/partner/societe-livraison": "/partenaire",
};

const JSON_HEADERS = [
  { key: "Content-Type", value: "application/json" },
  { key: "Cache-Control", value: "public, max-age=300" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(HTML_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...Object.entries(PATH_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
      })),
      // Ancien flux de remboursement (retiré) → accueil
      { source: "/refund/:token", destination: "/", permanent: false },
    ];
  },

  async rewrites() {
    return [
      // Partage vidéo des apps : /video/:id sert la page interstitielle (deep link)
      { source: "/video/:id", destination: "/video.html?id=:id" },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Deep links des apps : servis en application/json (sinon refusés)
      { source: "/.well-known/apple-app-site-association", headers: JSON_HEADERS },
      { source: "/.well-known/assetlinks.json", headers: JSON_HEADERS },
    ];
  },
};

export default nextConfig;
