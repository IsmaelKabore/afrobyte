'use client';

import { useEffect, useState } from 'react';

const APP_STORE = 'https://apps.apple.com/us/app/afrobite/id6759185659';
const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.afrobite.android&pcampaignid=web_share';

function storeUrl() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ? APP_STORE : PLAY_STORE;
}

/** Invitation DISCRÈTE à ouvrir l'app, après ~2,5 s. Ne bloque jamais la vidéo,
 *  n'est pas une popup plein écran, et ne se répète pas si l'user a choisi
 *  « Continuer sur le web » (mémorisé pour la session). */
export default function OpenPrompt({ videoId }: { videoId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    try {
      if (sessionStorage.getItem('afv_stay_web') === '1') return;
    } catch {}
    const t = window.setTimeout(() => setShow(true), 2500);
    return () => window.clearTimeout(t);
  }, [videoId]);

  if (!show) return null;

  const stayWeb = () => {
    try {
      sessionStorage.setItem('afv_stay_web', '1');
    } catch {}
    setShow(false);
  };

  const openApp = () => {
    setShow(false);
    const started = Date.now();
    const timer = window.setTimeout(() => {
      if (Date.now() - started < 1700 && document.visibilityState === 'visible') {
        window.location.href = storeUrl();
      }
    }, 1300);
    const clear = () => window.clearTimeout(timer);
    document.addEventListener('visibilitychange', clear, { once: true });
    window.location.href = `https://afrobite.app/v/${videoId}`;
  };

  return (
    <div className="afv-prompt" role="dialog" aria-label="Ouvrir dans AfroBite">
      <div className="afv-prompt-text">
        <strong>Ouvrir dans AfroBite&nbsp;?</strong>
        <span>Meilleure expérience dans l’app.</span>
      </div>
      <div className="afv-prompt-actions">
        <button className="afv-prompt-ghost" onClick={stayWeb}>Continuer sur le web</button>
        <button className="afv-prompt-cta" onClick={openApp}>Ouvrir</button>
      </div>
    </div>
  );
}
