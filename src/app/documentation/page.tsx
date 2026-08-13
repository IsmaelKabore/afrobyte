import type { Metadata } from "next";
import { ArrowDown, BookOpen, ShieldCheck, UsersRound } from "lucide-react";
import { DocumentationContent } from "@/components/documentation/documentation-content";
import { DocumentationShell } from "@/components/documentation/documentation-shell";
import { Icon } from "@/components/icon";
import "./documentation.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guide de référence AfroBite pour les utilisateurs, restaurants, livreurs, opérations et équipes techniques.",
  alternates: { canonical: "/documentation" },
  openGraph: {
    title: "Documentation AfroBite",
    description:
      "Comprendre les parcours de commande, les applications partenaires et les opérations AfroBite.",
    url: "/documentation",
  },
};

export default function DocumentationPage() {
  return (
    <main className="documentation-page">
      <header className="documentation-hero">
        <div className="documentation-hero-inner">
          <div className="documentation-breadcrumb">
            <Icon icon={BookOpen} size={15} />
            Centre de connaissances
            <span>Version publique</span>
          </div>
          <div className="documentation-hero-copy">
            <div>
              <p className="documentation-overline">Documentation AfroBite</p>
              <h1>Un guide pour faire avancer chaque commande.</h1>
            </div>
            <div className="documentation-hero-side">
              <p>
                Parcours client, opérations restaurant, livraison, supervision et architecture
                générale — documentés à partir du fonctionnement actuel des applications AfroBite.
              </p>
              <a href="#introduction">
                Commencer la lecture <Icon icon={ArrowDown} size={17} />
              </a>
            </div>
          </div>
          <div className="documentation-audiences" aria-label="Public concerné">
            <span><Icon icon={UsersRound} size={16} /> Équipes et partenaires</span>
            <span><Icon icon={ShieldCheck} size={16} /> Sans données sensibles</span>
            <span><span className="doc-live-dot" /> Vérifié sur le code actuel</span>
          </div>
        </div>
      </header>

      <DocumentationShell>
        <DocumentationContent />
      </DocumentationShell>
    </main>
  );
}
