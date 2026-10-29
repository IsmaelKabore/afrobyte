import type { Metadata } from "next";
import { Bike, Megaphone, Store, Video } from "lucide-react";
import { CardGrid, ContentSection, InfoCard, PageHero } from "@/components/page-parts";
import { CareersForm } from "@/components/careers-form";

export const metadata: Metadata = {
  title: "Carrières",
  description: "Rejoignez AfroBite à Ouagadougou : agents terrain, livreurs, call center, commerciaux, créateurs de contenu, développeurs.",
  alternates: { canonical: "/carrieres" },
};

export default function CarrieresPage() {
  return (
    <main>
      <PageHero
        badge="Carrières"
        title="Construisons la livraison de repas à Ouagadougou"
        subtitle="AfroBite recrute sur le terrain, au téléphone, en vidéo et dans le code. Postulez en deux minutes, avec ou sans CV."
      />
      <ContentSection>
        <CardGrid>
          <InfoCard icon={Megaphone} title="Terrain et commercial">
            Agents terrain et commerciaux qui font découvrir AfroBite aux clients et aux restaurants des quartiers.
          </InfoCard>
          <InfoCard icon={Bike} title="Livraison">
            Livreurs à moto, payés à la course. Vous pouvez aussi passer directement par la page{" "}
            <a href="/partenaire#livreurs">Devenir livreur</a>.
          </InfoCard>
          <InfoCard icon={Video} title="Vidéo et réseaux">
            Créateurs de contenu et marketing : des vidéos de plats qui donnent faim, sur TikTok et dans l&apos;app.
          </InfoCard>
          <InfoCard icon={Store} title="Restaurants partenaires">
            Vous avez un restaurant ? Ce n&apos;est pas une candidature : rendez-vous sur{" "}
            <a href="/partenaire">Devenir partenaire</a>.
          </InfoCard>
        </CardGrid>
        <CareersForm />
      </ContentSection>
    </main>
  );
}
