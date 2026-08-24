'use client';

import { useEffect, useRef } from 'react';

/**
 * COUCHE DATA — trace une vue web de la page /v/ (contexte `web_view`).
 *
 * POST best-effort vers la Cloud Function `logVideoClick` (Admin SDK, écrit
 * `video_share_clicks` → onVideoShareClickCreated incrémente `videos.webViewCount`).
 * `?s=` du lien = shareId d'origine (attribution du partage). Ne rend rien, ne
 * bloque jamais l'affichage : si le POST rate, la page fonctionne normalement.
 */

const PROJECT =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'foodsocialnetwork-74a07';
const LOG_URL =
  process.env.NEXT_PUBLIC_LOG_CLICK_URL ||
  `https://us-central1-${PROJECT}.cloudfunctions.net/logVideoClick`;

export default function ViewTracker({ videoId }: { videoId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return; // 1 vue par montage (évite le double-mount StrictMode dev)
    sent.current = true;
    if (!videoId) return;

    let shareId: string | null = null;
    try {
      shareId = new URLSearchParams(window.location.search).get('s');
    } catch {
      shareId = null;
    }

    try {
      void fetch(LOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, shareId: shareId || null }),
        keepalive: true, // survit à un départ immédiat (ouverture app)
      }).catch(() => {});
    } catch {
      /* best-effort : jamais bloquant */
    }
  }, [videoId]);

  return null;
}
