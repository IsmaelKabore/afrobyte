import { PageHero } from "./page-parts";

/**
 * Gabarit de page légale (DRY) : hero + contenu verbatim.
 * Le contenu juridique est rendu tel quel (source de confiance, non
 * modifiable par l'utilisateur) pour rester fidèle au texte d'origine.
 */
export function LegalPage({
  badge,
  title,
  subtitle,
  html,
}: {
  badge: string;
  title: string;
  subtitle: string;
  html: string;
}) {
  return (
    <main>
      <PageHero badge={badge} title={title} subtitle={subtitle} />
      <section className="content-section">
        <div className="container" dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </main>
  );
}
