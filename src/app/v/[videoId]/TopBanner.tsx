'use client';

import { useEffect, useState } from 'react';
import { openAfroBiteUser, isIOSSafariWithSmartBanner } from '@/lib/openApp';

/** Bandeau haut : masqué sur Safari iOS (Smart App Banner natif déjà présent). */
export default function TopBanner({ videoId }: { videoId: string }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setHide(isIOSSafariWithSmartBanner());
  }, []);

  if (hide) return null;

  return (
    <header className="afv-banner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="afv-banner-logo"
        src="/assets/logo-afrobite.png"
        alt="AfroBite"
        width={34}
        height={34}
      />
      <div className="afv-banner-text">
        <strong>AfroBite</strong>
        <span>Découvrez et commandez vos plats</span>
      </div>
      <button
        type="button"
        className="afv-banner-cta"
        onClick={() => openAfroBiteUser(videoId)}
      >
        Ouvrir
      </button>
    </header>
  );
}
