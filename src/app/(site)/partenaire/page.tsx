import type { Metadata } from "next";
import { ArrowRight, Bike, Truck, Utensils } from "lucide-react";
import { PageHero } from "@/components/page-parts";
import { StoreBadges } from "@/components/store-badges";
import { PartnerDemos } from "@/components/partner-demos";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Devenir partenaire",
  description:
    "AfroBite — Devenez partenaire : restaurants et livreurs via les applications mobiles, sociétés de livraison par candidature.",
};

export default function PartenairePage() {
  return (
    <main>
      <PageHero
        badge="Rejoignez le réseau"
        title="Devenez partenaire AfroBite"
        subtitle="Restaurants, livreurs, sociétés de livraison — chacun son parcours, une seule communauté."
      />

      <section className="demo-section">
        <div className="container">
          <h2>Découvrez les applications</h2>
          <p className="demo-intro">
            Choisissez votre parcours — la démo vous montre chaque étape, de l&apos;inscription aux
            premières commandes, avec les vraies interfaces de nos apps.
          </p>
          <PartnerDemos />
        </div>
      </section>

      <section className="partner-section">
        <div className="container">
          <div className="partner-panels">
            <article className="partner-panel" id="restaurants">
              <span className="panel-kicker">
                <Icon icon={Utensils} size={15} /> Restaurants
              </span>
              <h2>Vos plats en vidéo, vos commandes en direct</h2>
              <p>
                Publiez vos plats et vos vidéos, recevez les commandes en temps réel et développez
                votre clientèle dans toute la ville. La création de votre compte gérant se fait
                directement dans l&apos;application <strong>AfroBite Restaurant</strong> — en deux
                étapes, validée par notre équipe.
              </p>
              <div className="panel-actions">
                <StoreBadges apps="restaurant" />
              </div>
            </article>

            <article className="partner-panel" id="livreurs">
              <span className="panel-kicker">
                <Icon icon={Bike} size={15} /> Livreurs
              </span>
              <h2>Roulez avec AfroBite, à votre rythme</h2>
              <p>
                Acceptez les courses qui vous conviennent, suivez vos gains et encaissez chaque
                période sans friction. Créez votre compte livreur directement dans
                l&apos;application <strong>AfroBite Livraison</strong> — votre dossier est validé par
                l&apos;équipe avant votre première course.
              </p>
              <div className="panel-actions">
                <StoreBadges apps="delivery" />
              </div>
            </article>

            <article className="partner-panel" id="societe">
              <span className="panel-kicker">
                <Icon icon={Truck} size={15} /> Sociétés de livraison
              </span>
              <h2>Mettez votre flotte au service du réseau</h2>
              <p>
                Vous gérez une équipe de livreurs ? Déposez votre candidature : nous vous contactons
                pour définir vos zones, intégrer vos livreurs et finaliser le partenariat. Aucun
                compte en ligne n&apos;est requis pour candidater.
              </p>
              <div className="panel-actions">
                <a
                  href="mailto:afrobyteapp@gmail.com?subject=Candidature%20société%20de%20livraison"
                  className="btn-pill"
                >
                  Déposer une candidature <Icon icon={ArrowRight} size={16} />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
