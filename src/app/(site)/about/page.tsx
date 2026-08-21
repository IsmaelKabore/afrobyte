import type { Metadata } from "next";
import { Handshake, Lock, Truck } from "lucide-react";
import { CardGrid, ContentSection, InfoCard, PageHero } from "@/components/page-parts";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission AfroBite : livraison de repas digitale, paiements sécurisés et logistique fiable au Burkina Faso.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        badge="Notre histoire"
        title="À propos d'AfroBite"
        subtitle="Technologie locale au service de la gastronomie africaine et de la communauté."
      />
      <ContentSection>
        <h2>Notre mission</h2>
        <p>
          AfroBite révolutionne la livraison de repas au Burkina Faso et en Afrique de l&apos;Ouest.
          Nous croyons que chacun mérite un accès simple, rapide et fiable à la restauration locale.
          Notre mission : connecter les communautés à leurs restaurants préférés tout en soutenant
          les commerces de proximité et en créant des opportunités pour les livreurs.
        </p>

        <h2>Notre vision</h2>
        <p>
          Nous voulons faire de la commande en ligne un réflexe du quotidien. Grâce à la technologie
          et à des partenariats locaux, AfroBite vise à devenir la plateforme de confiance pour la
          livraison de repas en Afrique francophone.
        </p>

        <h2>Basés au Burkina Faso</h2>
        <p>
          AfroBite est fièrement basée au Burkina Faso. Nous comprenons le marché local, la culture
          et les besoins de notre communauté. Nous ne sommes pas une plateforme étrangère
          déconnectée — nous sommes vos voisins, engagés à servir avec intégrité.
        </p>

        <CardGrid>
          <InfoCard icon={Lock} title="Paiements sécurisés">
            Intégration Orange Money, Wave et autres prestataires de confiance. Vos codes PIN ne sont
            jamais stockés par AfroBite.
          </InfoCard>
          <InfoCard icon={Truck} title="Logistique fiable">
            Suivi en temps réel, notifications à chaque étape et réseau de livreurs vérifiés.
          </InfoCard>
          <InfoCard icon={Handshake} title="Écosystème local">
            Clients, restaurants partenaires et livreurs — tout un écosystème pensé pour l&apos;Afrique.
          </InfoCard>
        </CardGrid>

        <h2>L&apos;équipe AfroBite</h2>
        <p>
          Une équipe passionnée par la tech, la gastronomie et le service client. Nous améliorons
          continuellement la plateforme pour offrir la meilleure expérience possible.
        </p>
        <p>
          Merci de faire partie de la communauté AfroBite. Ensemble, nous construisons l&apos;avenir
          de la livraison de repas en Afrique de l&apos;Ouest.
        </p>
      </ContentSection>
    </main>
  );
}
