"use client";

import { useEffect, useState } from "react";

/**
 * Arrivé par un lien suivi (afrobite.app/go/CODE) : on affiche le code à saisir à
 * l'inscription. C'est ce code qui relie le nouveau client à l'agent, l'influenceur
 * ou la vidéo TikTok qui l'a amené, jusqu'à ses commandes.
 */
export function InviteCode() {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const c = new URLSearchParams(window.location.search).get("code");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture de l'URL côté client uniquement
      if (c && /^[A-Z0-9][A-Z0-9-]{2,23}$/.test(c)) setCode(c);
    } catch {
      /* rien à afficher */
    }
  }, []);

  if (!code) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* le code reste lisible à l'écran */
    }
  };

  return (
    <button type="button" className="dl-invite" onClick={copy} aria-label={`Copier le code ${code}`}>
      <span className="dl-invite-label">Ton code d&apos;invitation</span>
      <strong className="dl-invite-code">{code}</strong>
      <span className="dl-invite-hint">{copied ? "Copié ✓" : "Touche pour copier · à saisir à l'inscription"}</span>
    </button>
  );
}
