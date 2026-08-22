'use client';

import { useEffect, useState } from 'react';
import {
  hrefOpenVideo,
  openAfroBiteUser,
  isSnapchatBrowser,
} from '@/lib/openApp';

/** CTA vidéo : vrai <a href> — Snapchat ignore souvent location.href sur custom scheme. */
export default function AppCtas({
  videoId,
  compact = false,
}: {
  videoId: string;
  compact?: boolean;
}) {
  const [href, setHref] = useState('#');

  useEffect(() => {
    const hydrate = window.setTimeout(
      () => setHref(hrefOpenVideo(videoId)),
      0,
    );
    return () => window.clearTimeout(hydrate);
  }, [videoId]);

  return (
    <a
      className={compact ? 'afv-banner-cta' : 'afv-order-btn'}
      href={href}
      onClick={(e) => {
        // Snapchat : laisser le navigateur suivre le href natif (seul chemin fiable).
        if (isSnapchatBrowser()) return;
        e.preventDefault();
        openAfroBiteUser(videoId);
      }}
    >
      {compact ? 'Ouvrir' : 'Commander'}
    </a>
  );
}
