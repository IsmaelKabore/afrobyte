import type { Metadata } from "next";
import { ArrowDown, Bike, BookOpen, ShieldCheck, Store, UserRound } from "lucide-react";
import { DocumentationContent } from "@/components/documentation/documentation-content";
import { DocumentationShell } from "@/components/documentation/documentation-shell";
import { Icon } from "@/components/icon";
import "./documentation.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guide public AfroBite pour commander, gérer un restaurant partenaire ou effectuer une livraison.",
  alternates: { canonical: "/documentation" },
  openGraph: {
    title: "Documentation AfroBite",
    description:
      "Comprendre les parcours client, restaurant partenaire et livreur AfroBite.",
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
                Des explications simples pour commander, préparer ou livrer avec AfroBite — sans
                jargon, avec chaque parcours présenté étape par étape.
              </p>
              <a href="#introduction">
                Commencer la lecture <Icon icon={ArrowDown} size={17} />
              </a>
            </div>
          </div>
          <div className="documentation-audiences" aria-label="Public concerné">
            <span><Icon icon={ShieldCheck} size={16} /> Guide public et essentiel</span>
            <span><span className="doc-live-dot" /> Mis à jour</span>
          </div>
          <nav className="documentation-paths" aria-label="Choisir son parcours">
            <a href="#utilisateur" className="documentation-path documentation-path-user">
              <Icon icon={UserRound} size={24} />
              <span><small>Je souhaite</small><strong>Commander</strong></span>
              <ArrowDown size={17} />
            </a>
            <a href="#restaurant" className="documentation-path documentation-path-resto">
              <Icon icon={Store} size={24} />
              <span><small>Je suis</small><strong>Restaurant</strong></span>
              <ArrowDown size={17} />
            </a>
            <a href="#livraison" className="documentation-path documentation-path-driver">
              <Icon icon={Bike} size={24} />
              <span><small>Je suis</small><strong>Livreur</strong></span>
              <ArrowDown size={17} />
            </a>
          </nav>
        </div>
      </header>

      <DocumentationShell>
        <DocumentationContent />
      </DocumentationShell>
    </main>
  );
}
