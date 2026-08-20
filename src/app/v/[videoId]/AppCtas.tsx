'use client';

import { useCallback, useState } from 'react';

const APP_STORE = 'https://apps.apple.com/us/app/afrobite/id6759185659';
const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.afrobite.android&pcampaignid=web_share';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function storeUrl() {
  return isIOS() ? APP_STORE : PLAY_STORE;
}

/** CTAs : ouvre l'app USER (jamais Resto/Livreur). On utilise l'Universal Link
 *  https://afrobite.app/v/{id} — associé EXCLUSIVEMENT à l'app USER — et non le
 *  scheme afrobite:// (réclamé aussi par Resto). Fallback store si non installée. */
export default function AppCtas({ videoId }: { videoId: string }) {
  const [showOrder, setShowOrder] = useState(false);

  const openInApp = useCallback(() => {
    if (!videoId) {
      window.location.href = storeUrl();
      return;
    }
    // Universal Link / App Link USER-only. Si l'app est installée, iOS/Android
    // l'ouvre sur la vidéo ; sinon on bascule vers le store.
    const started = Date.now();
    const timer = window.setTimeout(() => {
      if (Date.now() - started < 1700 && document.visibilityState === 'visible') {
        window.location.href = storeUrl();
      }
    }, 1300);
    const clear = () => window.clearTimeout(timer);
    document.addEventListener('visibilitychange', clear, { once: true });
    window.addEventListener('pagehide', clear, { once: true });
    window.location.href = `https://afrobite.app/v/${videoId}`;
  }, [videoId]);

  return (
    <div className="afv-ctas">
      <button className="afv-btn afv-btn-primary" onClick={openInApp}>
        Ouvrir dans AfroBite
      </button>
      {videoId && (
        <button className="afv-btn afv-btn-order" onClick={() => setShowOrder(true)}>
          Commander ce plat
        </button>
      )}

      <div className="afv-stores">
        <a className="afv-store" href={APP_STORE} target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur l'App Store">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 3.02-.75.9-1.98 1.6-3.13 1.5-.14-1.1.42-2.28 1.1-3.06.76-.87 2.06-1.53 3.14-1.46zM20.9 17.1c-.55 1.28-.82 1.85-1.53 2.98-1 1.58-2.4 3.55-4.14 3.56-1.55.02-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.09 1-.9-.02-2.02-1.06-2.9-2.2C-.24 18.6-1.4 12.3.7 8.6c1-1.72 2.75-2.8 4.62-2.83 1.68-.03 2.65 1.04 4 1.04 1.31 0 2.11-1.04 4.05-1.04 1.5.02 3.1.82 4.2 2.24-3.7 2.03-3.1 7.3.33 8.5z"/>
          </svg>
          <span><small>Télécharger sur</small>App Store</span>
        </a>
        <a className="afv-store" href={PLAY_STORE} target="_blank" rel="noopener noreferrer" aria-label="Disponible sur Google Play">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="#00D2FF" d="M3.6 1.8 13 11.2 3.6 20.6c-.35-.2-.6-.6-.6-1.1V2.9c0-.5.25-.9.6-1.1z"/>
            <path fill="#00E676" d="M13 11.2 3.6 1.8c.1-.06.2-.1.3-.1.25-.06.5 0 .74.14L16.3 8.5 13 11.2z"/>
            <path fill="#FFC400" d="M16.3 8.5 20 10.6c.7.4.7 1.4 0 1.8l-3.7 2.1L13 11.2l3.3-2.7z"/>
            <path fill="#FF3D00" d="M13 11.2l3.3 2.7-11.66 6.66c-.24.14-.5.2-.74.14-.1 0-.2-.05-.3-.1L13 11.2z"/>
          </svg>
          <span><small>Disponible sur</small>Google Play</span>
        </a>
      </div>

      {showOrder && (
        <div className="afv-sheet" onClick={() => setShowOrder(false)}>
          <div className="afv-sheet-card" onClick={(e) => e.stopPropagation()}>
            <p className="afv-sheet-title">Pour commander ce plat, ouvrez AfroBite.</p>
            <button className="afv-btn afv-btn-primary" onClick={openInApp}>
              Ouvrir AfroBite
            </button>
            <a className="afv-btn afv-btn-ghost" href={storeUrl()} target="_blank" rel="noopener noreferrer">
              Télécharger AfroBite
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
