import type { Metadata } from "next";
import Image from "next/image";
import { DownloadFeed } from "./download-feed";
import { DownloadButtons } from "./download-buttons";
import { AdPixels } from "./ad-pixels";
import { InviteCode } from "./invite-code";
import "./telecharger.css";

/**
 * Page d'atterrissage des publicités (Facebook / Instagram) : un seul écran,
 * pas de nav ni de footer. Le téléphone reproduit l'écran Découvertes de l'app
 * avec de vraies vidéos de restaurants qui défilent seules ; les boutons
 * App Store / Google Play restent visibles.
 */
export const metadata: Metadata = {
  title: "Télécharger",
  description: "Télécharge AfroBite : découvre les plats d'Ouagadougou en vidéo, commande en un geste et suis ton livreur en direct.",
  alternates: { canonical: "/telecharger" },
  openGraph: {
    title: "Télécharge AfroBite — Scrolle. Choisis. Mange.",
    description: "Les plats d'Ouagadougou en vidéo, livrés chez toi. Disponible sur App Store et Google Play.",
    url: "https://afrobite.app/telecharger",
  },
};

export default function TelechargerPage() {
  return (
    <main className="dl">
      <AdPixels />
      <div className="dl-glow" aria-hidden />
      <section className="dl-copy">
        <Image src="/assets/logo-afrobite.png" alt="AfroBite" width={64} height={64} className="dl-logo" priority />
        <h1 className="dl-title">
          Scrolle. Choisis. <em>Mange.</em>
        </h1>
        <p className="dl-sub">Les plats d&apos;Ouaga en vidéo, livrés chez toi. Tu suis ton livreur en direct.</p>
        <InviteCode />
        <DownloadButtons />
        <p className="dl-note">Gratuit · Ouagadougou</p>
      </section>
      <section className="dl-phone-wrap">
        <DownloadFeed />
      </section>
    </main>
  );
}
