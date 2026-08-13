"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, ChevronRight, Menu, X } from "lucide-react";
import { DOCUMENTATION_GROUPS } from "@/lib/documentation";
import { Icon } from "@/components/icon";

export function DocumentationShell({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState("introduction");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-doc-section]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -68% 0px", threshold: [0, 0.1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const current = DOCUMENTATION_GROUPS.flatMap((group) => group.items).find(
    (item) => item.id === activeId,
  );

  return (
    <div className="doc-shell">
      <button
        type="button"
        className="doc-mobile-trigger"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="documentation-navigation"
      >
        <Icon icon={Menu} size={18} />
        <span>
          <small>Dans la documentation</small>
          {current?.label ?? "Parcourir les rubriques"}
        </span>
        <Icon icon={ChevronRight} size={18} />
      </button>

      {open ? (
        <button
          className="doc-sidebar-backdrop"
          aria-label="Fermer la navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`doc-sidebar${open ? " is-open" : ""}`}
        id="documentation-navigation"
        aria-label="Navigation de la documentation"
      >
        <div className="doc-sidebar-title">
          <span><Icon icon={BookOpen} size={17} /></span>
          <div>
            <strong>Documentation</strong>
            <small>Guide opérationnel</small>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer">
            <Icon icon={X} size={19} />
          </button>
        </div>
        <nav>
          {DOCUMENTATION_GROUPS.map((group) => (
            <div className="doc-nav-group" key={group.id}>
              <p>{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeId === item.id ? "active" : ""}
                      aria-current={activeId === item.id ? "location" : undefined}
                      onClick={() => {
                        setActiveId(item.id);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="doc-content">{children}</div>

      <aside className="doc-rail" aria-label="Repères rapides">
        <div className="doc-rail-card">
          <p>Repères rapides</p>
          <a href="#cycle-commande">Cycle d’une commande</a>
          <a href="#recevoir-commande">Nouvelle commande resto</a>
          <a href="#recuperation-restaurant">Remise au livreur</a>
          <a href="#support-call-center">Checklist Call Center</a>
          <a href="#architecture">Écosystème technique</a>
        </div>
        <div className="doc-rail-meta">
          <span className="doc-live-dot" />
          Vérifié sur le code actuel
        </div>
      </aside>
    </div>
  );
}
