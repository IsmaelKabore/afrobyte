import type { Metadata } from "next";
import { ContentSection, PageHero } from "@/components/page-parts";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales d'AfroBite — service édité et exploité par la société CORRIDOR SARL, immatriculée au Burkina Faso.",
};

export default function MentionsLegalesPage() {
  return (
    <main>
      <PageHero
        badge="Informations légales"
        title="Mentions légales"
        subtitle="AfroBite est une marque et un service édités et exploités par la société CORRIDOR SARL."
      />
      <ContentSection>
        <p className="legal-meta">Dernière mise à jour : juillet 2026</p>

        <h2 id="editeur">1. Éditeur du site et de l&apos;application</h2>
        <p>
          Le site <strong>afrobite.app</strong> et les applications <strong>AfroBite</strong>,{" "}
          <strong>AfroBite Resto</strong> et <strong>AfroBite Livreur</strong> sont édités et
          exploités par :
        </p>
        <ul>
          <li>
            <strong>Dénomination sociale :</strong> CORRIDOR
          </li>
          <li>
            <strong>Nom commercial / marque :</strong> AfroBite
          </li>
          <li>
            <strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)
          </li>
          <li>
            <strong>Capital social :</strong> 1 000 000 FCFA
          </li>
          <li>
            <strong>Siège social :</strong> Ouagadougou, secteur 42, Lot 27, Parcelle 10, Section YS,
            11 BP 1287 Ouagadougou 11, Burkina Faso
          </li>
          <li>
            <strong>RCCM :</strong> BF-OUA-01-2024-B13-12199
          </li>
          <li>
            <strong>Identifiant Financier Unique (IFU) :</strong> 00244586U
          </li>
        </ul>

        <h2 id="publication">2. Directeur de la publication</h2>
        <p>
          Le directeur de la publication est le gérant de la société CORRIDOR SARL,{" "}
          <strong>M. KABORE Sada</strong>.
        </p>

        <h2 id="contact">3. Contact</h2>
        <p>
          <strong>E-mail :</strong>{" "}
          <a href="mailto:afrobyteapp@gmail.com">afrobyteapp@gmail.com</a>
          <br />
          <strong>Site web :</strong> <a href="https://afrobite.app">afrobite.app</a>
        </p>

        <h2 id="hebergement">4. Hébergement</h2>
        <p>
          Le site <strong>afrobite.app</strong> est hébergé par <strong>Vercel Inc.</strong>, 340 S
          Lemon Ave #4133, Walnut, CA 91789, États-Unis (<a href="https://vercel.com">vercel.com</a>
          ). Les services applicatifs (back-end) sont opérés sur Google Cloud Platform / Firebase
          (Google LLC).
        </p>

        <h2 id="marque">5. Marque et propriété intellectuelle</h2>
        <p>
          « AfroBite » est une marque exploitée par la société CORRIDOR SARL. L&apos;ensemble des
          éléments du site et des applications (textes, logos, graphismes, interfaces, code) est
          protégé par le droit de la propriété intellectuelle et demeure la propriété de CORRIDOR
          SARL, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation écrite
          préalable est interdite.
        </p>

        <h2 id="donnees">6. Données personnelles</h2>
        <p>
          Le traitement des données personnelles des utilisateurs est décrit dans notre{" "}
          <a href="/privacy-policy">Politique de confidentialité</a>. Les conditions
          d&apos;utilisation du service sont détaillées dans nos{" "}
          <a href="/terms">Conditions d&apos;utilisation</a>.
        </p>

        <h2 id="droit">7. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit du Burkina Faso. Tout litige relève
          de la compétence des tribunaux du Burkina Faso.
        </p>
      </ContentSection>
    </main>
  );
}
