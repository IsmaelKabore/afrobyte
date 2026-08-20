'use client';

import { useCallback, useState } from 'react';

const APP_STORE = 'https://apps.apple.com/app/afrobite/id6740143420';
const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.afrobite.android';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function storeUrl() {
  return isIOS() ? APP_STORE : PLAY_STORE;
}

/** CTAs : ouvrir l'app USER sur la vidéo exacte, ou installer.
 *  Jamais Resto / Livreur. Pas de boucle web→app→web. */
export default function AppCtas({ videoId }: { videoId: string }) {
  const [showOrder, setShowOrder] = useState(false);

  const openInApp = useCallback(() => {
    // Scheme custom → ouvre l'app USER pile sur /v/{id} si installée.
    // Si rien ne se passe (~1,2 s = app absente) → store.
    const started = Date.now();
    const timer = window.setTimeout(() => {
      if (Date.now() - started < 1600) window.location.href = storeUrl();
    }, 1200);
    const clear = () => window.clearTimeout(timer);
    document.addEventListener('visibilitychange', clear, { once: true });
    window.addEventListener('pagehide', clear, { once: true });
    window.location.href = `afrobite://v/${videoId}`;
  }, [videoId]);

  const download = useCallback(() => {
    window.location.href = storeUrl();
  }, []);

  return (
    <div className="afv-ctas">
      <button className="afv-btn afv-btn-primary" onClick={openInApp}>
        Ouvrir dans AfroBite
      </button>
      <button className="afv-btn afv-btn-order" onClick={() => setShowOrder(true)}>
        Commander ce plat
      </button>
      <button className="afv-btn afv-btn-ghost" onClick={download}>
        Télécharger l’app
      </button>

      {showOrder && (
        <div className="afv-sheet" onClick={() => setShowOrder(false)}>
          <div className="afv-sheet-card" onClick={(e) => e.stopPropagation()}>
            <p className="afv-sheet-title">Pour commander ce plat, ouvrez AfroBite.</p>
            <button className="afv-btn afv-btn-primary" onClick={openInApp}>
              Ouvrir AfroBite
            </button>
            <button className="afv-btn afv-btn-ghost" onClick={download}>
              Télécharger AfroBite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
