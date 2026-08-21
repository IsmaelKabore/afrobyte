import type { Metadata } from "next";
import { Mail, Smartphone, Zap } from "lucide-react";
import { CardGrid, ContentSection, InfoCard, PageHero } from "@/components/page-parts";
import { Faq } from "@/components/faq";
import { SupportForm } from "@/components/support-form";

export const metadata: Metadata = {
  title: "Aide & Support",
  description:
    "Centre d'aide AfroBite — FAQ, contact et assistance pour vos commandes et votre compte.",
};

export default function SupportPage() {
  return (
    <main>
      <PageHero
        badge="Centre d'aide"
        title="Aide & Support"
        subtitle="Une question sur une commande, un paiement ou votre compte ? Notre équipe est là pour vous aider."
      />
      <ContentSection>
        <CardGrid>
          <InfoCard icon={Mail} title="Contact direct">
            Écrivez-nous à <a href="mailto:afrobyteapp@gmail.com">afrobyteapp@gmail.com</a>. Réponse
            sous 24 à 48 h ouvrées.
          </InfoCard>
          <InfoCard icon={Zap} title="Commande en cours">
            Pour une urgence liée à une commande active, indiquez <strong>URGENT</strong> dans
            l&apos;objet de votre e-mail.
          </InfoCard>
          <InfoCard icon={Smartphone} title="Suivi en temps réel">
            Suivez votre commande dans l&apos;application AfroBite : préparation, livraison et
            confirmation de réception.
          </InfoCard>
        </CardGrid>

        <h2>Nous contacter</h2>
        <p>Pour toute demande d&apos;assistance, contactez-nous par e-mail :</p>
        <a className="email-chip" href="mailto:afrobyteapp@gmail.com">
          afrobyteapp@gmail.com
        </a>
        <p>
          Merci d&apos;indiquer votre numéro de commande (si disponible), l&apos;e-mail de votre
          compte et une description claire de votre demande.
        </p>

        <Faq />

        <h2>Formulaire de contact</h2>
        <p>Ce formulaire ouvre votre application e-mail avec un message prérempli.</p>
        <SupportForm />
      </ContentSection>
    </main>
  );
}
