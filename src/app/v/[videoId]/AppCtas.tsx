'use client';

import { openAfroBiteUser } from '@/lib/openApp';

/** CTAs vidéo : ouvre USER uniquement. Pas d'auto-redirect. */
export default function AppCtas({
  videoId,
  compact = false,
}: {
  videoId: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        type="button"
        className="afv-banner-cta"
        onClick={() => openAfroBiteUser(videoId)}
      >
        Ouvrir
      </button>
    );
  }

  return (
    <button
      type="button"
      className="afv-order-btn"
      onClick={() => openAfroBiteUser(videoId)}
    >
      Commander
    </button>
  );
}
