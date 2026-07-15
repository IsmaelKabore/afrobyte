import Link from "next/link";
import Image from "next/image";
import {
  BRAND,
  FOOTER_COLUMNS,
  STORE_LINKS,
  type FooterLinkItem,
} from "@/lib/site";
import { StoreBadges } from "./store-badges";

function FooterLink({ link }: { link: FooterLinkItem }) {
  if (link.store) {
    const url = STORE_LINKS[link.store];
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    ) : (
      <span className="store-soon" aria-disabled="true" title="Bientôt disponible">
        {link.label}
      </span>
    );
  }
  const href = link.href ?? "#";
  return href.startsWith("/") ? (
    <Link href={href}>{link.label}</Link>
  ) : (
    <a href={href}>{link.label}</a>
  );
}

/** Footer unique du site (DRY) : colonnes mappées depuis FOOTER_COLUMNS. */
export function SiteFooter() {
  return (
    <footer className="shell-footer">
      <div className="sf-inner">
        <div className="sf-grid">
          <div>
            <div className="sf-brand">
              <span className="sf-logo">
                <Image src="/assets/logo-afrobite.png" alt="AfroBite" width={52} height={52} />
              </span>
              <span className="sf-name">{BRAND.name}</span>
            </div>
            <p className="sf-tag">
              L&apos;app de livraison conçue pour la génération du feed. {BRAND.tagline}
            </p>
            <StoreBadges apps="client" />
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div className="sf-col" key={col.title}>
              <h6>{col.title}</h6>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink link={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sf-bottom">
          <div>{BRAND.legal}</div>
          <div>{BRAND.location}</div>
        </div>
      </div>
    </footer>
  );
}
