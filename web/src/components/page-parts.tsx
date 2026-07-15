import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./icon";

/** En-tête de page de contenu (badge + titre + sous-titre). */
export function PageHero({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        {badge ? <span className="hero-badge">{badge}</span> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}

/** Corps de texte lisible d'une page de contenu. */
export function ContentSection({ children }: { children: ReactNode }) {
  return (
    <section className="content-section">
      <div className="container">{children}</div>
    </section>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

export function InfoCard({
  icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="info-card">
      <div className="info-card-icon">
        <Icon icon={icon} size={22} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
