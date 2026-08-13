import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { Icon } from "@/components/icon";

export function DocChapter({
  id,
  number,
  label,
  title,
  lead,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-chapter" id={id} aria-labelledby={`${id}-title`}>
      <header className="doc-chapter-head">
        <span className="doc-chapter-number">{number}</span>
        <div>
          <p className="doc-kicker">{label}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p className="doc-lead">{lead}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

export function DocTopic({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <article className="doc-topic" id={id} data-doc-section aria-labelledby={`${id}-title`}>
      {eyebrow ? <p className="doc-topic-eyebrow">{eyebrow}</p> : null}
      <h3 id={`${id}-title`}>{title}</h3>
      <div className="doc-topic-body">{children}</div>
    </article>
  );
}

export function DocGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={`doc-grid doc-grid-${columns}`}>{children}</div>;
}

export function DocCard({
  icon,
  title,
  children,
  tone = "default",
}: {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  tone?: "default" | "gold" | "dark";
}) {
  return (
    <div className={`doc-card doc-card-${tone}`}>
      {icon ? (
        <span className="doc-card-icon" aria-hidden="true">
          <Icon icon={icon} size={19} />
        </span>
      ) : null}
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}

export function DocSteps({
  items,
}: {
  items: { title: string; text: string; status?: string }[];
}) {
  return (
    <ol className="doc-steps">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`}>
          <span className="doc-step-number">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <div className="doc-step-title">
              <h4>{item.title}</h4>
              {item.status ? <span className="doc-status">{item.status}</span> : null}
            </div>
            <p>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DocFlow({ items }: { items: { label: string; meta?: string }[] }) {
  return (
    <div className="doc-flow" aria-label="Parcours">
      {items.map((item, index) => (
        <div className="doc-flow-node" key={`${item.label}-${index}`}>
          <span>{item.label}</span>
          {item.meta ? <small>{item.meta}</small> : null}
        </div>
      ))}
    </div>
  );
}

const calloutIcons = {
  info: Info,
  important: AlertTriangle,
  success: CheckCircle2,
  private: ShieldAlert,
};

export function DocCallout({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: keyof typeof calloutIcons;
}) {
  const CalloutIcon = calloutIcons[tone];
  return (
    <aside className={`doc-callout doc-callout-${tone}`}>
      <Icon icon={CalloutIcon} size={20} />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </aside>
  );
}

export function DocBullets({ children }: { children: ReactNode }) {
  return <ul className="doc-bullets">{children}</ul>;
}
