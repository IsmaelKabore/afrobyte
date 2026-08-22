'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUser,
  openUserStore,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
} from '@/lib/openApp';

const STAY_KEY = 'afv_stay_web';
const WA_OPEN_KEY = 'afv_wa_scheme_once';

/**
 * Modal + reclaim WhatsApp.
 *
 * WhatsApp (et IG/FB) ouvre souvent l'Universal Link HTTPS ~1–2 s puis
 * reprend son WebView → impression de « bounce ». Le bouton Ouvrir marche
 * car il utilise afrobite-user://. Ici on rejoue CE même chemin une fois
 * quand on détecte un in-app browser qui reclaim — sans timer store.
 */
export default function OpenPrompt({
  videoId,
  thumbUrl,
  dishName,
}: {
  videoId: string;
  thumbUrl: string | null;
  dishName: string | null;
}) {
  const [show, setShow] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isReclaimBrowser, setIsReclaimBrowser] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    setIsSafari(safari);
    setIsReclaimBrowser(reclaim);

    // WhatsApp / IG / FB : après le bounce UL→WebView, réouvrir via le
    // custom scheme (identique au bouton qui marche). Une seule fois /
    // onglet, jamais de fallback App Store.
    let onVis: (() => void) | null = null;
    if (reclaim) {
      const k = `${WA_OPEN_KEY}:${videoId}`;
      const trySchemeOnce = () => {
        try {
          if (sessionStorage.getItem(STAY_KEY) === '1') return;
          if (sessionStorage.getItem(k) === '1') return;
          if (document.visibilityState !== 'visible') return;
          sessionStorage.setItem(k, '1');
          console.log('[MODAL] whatsapp reclaim → custom scheme');
          openAfroBiteUser(videoId);
        } catch {}
      };
      // Si la page est déjà visible (WA a déjà reclaim), ouvrir vite.
      window.setTimeout(trySchemeOnce, 350);
      // Si UL a mis l'app au premier plan, le WebView est hidden : on
      // retente dès que WhatsApp reprend la page (visibility visible).
      onVis = () => {
        if (document.visibilityState === 'visible') trySchemeOnce();
      };
      document.addEventListener('visibilitychange', onVis);
    }

    // Modal plus rapide dans WhatsApp (si le scheme n'a pas sorti).
    const delay = reclaim ? 1200 : 2500;
    const t = window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      setShow(true);
      console.log('[MODAL] shown');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }, delay);
    return () => {
      window.clearTimeout(t);
      if (onVis) document.removeEventListener('visibilitychange', onVis);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [videoId]);

  const unlock = useCallback(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  const stayWeb = () => {
    console.log('[MODAL] stay_web');
    try {
      sessionStorage.setItem(STAY_KEY, '1');
    } catch {}
    setShow(false);
    unlock();
  };

  const openApp = () => {
    console.log('[MODAL] open_app');
    openAfroBiteUser(videoId);
  };

  const download = () => {
    console.log('[MODAL] download_store');
    openUserStore();
  };

  if (!show) return null;

  return (
    <div
      className="afv-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Ouvrir ce plat dans AfroBite"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="afv-modal-card">
        <div className="afv-modal-avatar-wrap">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="afv-modal-avatar" src={thumbUrl} alt="" />
          ) : (
            <div className="afv-modal-avatar afv-modal-avatar-fallback">🍽️</div>
          )}
        </div>
        <h2 className="afv-modal-title">
          Ouvrir ce plat dans
          <br />
          AfroBite&nbsp;?
        </h2>
        <p className="afv-modal-desc">
          {isReclaimBrowser
            ? 'WhatsApp a rouvert la page web. Touchez Ouvrir AfroBite pour rester dans l’app.'
            : isSafari
              ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari pour ouvrir l’app directement.'
              : dishName
                ? `Découvrez « ${dishName} » et commandez directement dans l’application.`
                : 'Découvrez ce restaurant et commandez directement dans l’application pour une meilleure expérience.'}
        </p>
        <button type="button" className="afv-modal-primary" onClick={openApp}>
          Ouvrir AfroBite
        </button>
        <button type="button" className="afv-modal-download" onClick={download}>
          Télécharger l’app
        </button>
        <button type="button" className="afv-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
