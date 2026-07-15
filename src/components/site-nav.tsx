"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { Icon } from "./icon";

const THEME_KEY = "afrobite-theme";

/**
 * Navigation unique du site (DRY) : liens mappés depuis NAV_LINKS,
 * menu mobile, bascule de thème, et passage en sombre quand la barre
 * survole une section marquée [data-nav-dark].
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Le thème réel est posé avant paint par le script no-flash ; on le lit.
  useEffect(() => {
    const t = (document.documentElement.dataset.theme as "light" | "dark") || "light";
    setTheme(t);
  }, []);

  // Nav sombre au-dessus des sections sombres.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 60;
      let over = false;
      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((s) => {
        const top = s.offsetTop;
        if (y >= top && y < top + s.offsetHeight) over = true;
      });
      setOverDark(over);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  return (
    <nav className={overDark ? "nav dark" : "nav"} id="nav">
      <Link href="/" className="logo" aria-label="AfroBite — Accueil">
        <Image
          src="/assets/logofoodtok-removebg-preview.png"
          alt="AfroBite"
          className="logo-mark"
          width={52}
          height={52}
          priority
        />
      </Link>

      <ul className={open ? "open" : ""}>
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Basculer entre thème clair et sombre"
        >
          <Icon icon={theme === "dark" ? Sun : Moon} size={17} />
        </button>
        <button
          type="button"
          className="nav-burger"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
        <a href="/#cta" className="cta">
          Télécharger l&apos;app <Icon icon={ArrowRight} size={16} />
        </a>
      </div>
    </nav>
  );
}
