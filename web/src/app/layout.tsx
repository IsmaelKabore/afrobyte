import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const DESCRIPTION =
  "AfroBite — l'app de livraison de repas en vidéo au Burkina Faso. Découvre des plats en vidéo, commande en un geste, suis ta livraison en direct.";

export const metadata: Metadata = {
  metadataBase: new URL("https://afrobite.app"),
  title: {
    default: "AfroBite — Scrolle. Choisis. Mange.",
    template: "%s · AfroBite",
  },
  description: DESCRIPTION,
  keywords: [
    "AfroBite",
    "livraison de repas",
    "Burkina Faso",
    "Ouagadougou",
    "commande en ligne",
    "restaurant",
    "livraison en vidéo",
    "Orange Money",
    "Wave",
  ],
  authors: [{ name: "CORRIDOR SARL" }],
  creator: "CORRIDOR SARL",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://afrobite.app",
    siteName: "AfroBite",
    title: "AfroBite — Scrolle. Choisis. Mange.",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "AfroBite — Scrolle. Choisis. Mange.",
    description: DESCRIPTION,
  },
  icons: { icon: "/assets/logo-afrobite.png" },
  other: { "facebook-domain-verification": "l64sl6fnet3kfigxnb43j5ntx1d4wx" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AfroBite",
  url: "https://afrobite.app",
  logo: "https://afrobite.app/assets/logo-afrobite.png",
  description: DESCRIPTION,
  email: "afrobyteapp@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ouagadougou",
    addressCountry: "BF",
  },
  parentOrganization: { "@type": "Organization", name: "CORRIDOR SARL" },
};

// Pose le thème avant le premier paint (aucun flash clair/sombre).
const themeScript = `(function(){try{var k='afrobite-theme';var t=localStorage.getItem(k)||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
