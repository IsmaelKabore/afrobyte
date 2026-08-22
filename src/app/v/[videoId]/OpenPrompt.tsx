'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUser,
  openUserStore,
  hrefOpenVideo,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
  isSnapchatBrowser,
} from '@/lib/openApp';

const STAY_KEY = 'afv_stay_web';
const WA_OPEN_KEY = 'afv_wa_scheme_once';

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
  const [isSnap, setIsSnap] = useState(false);
  const [openHref, setOpenHref] = useState('#');

  useEffect(() => {
    if (!videoId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    const snap = isSnapchatBrowser();
    setIsSafari(safari);
    setIsReclaimBrowser(reclaim);
    setIsSnap(snap);
    setOpenHref(hrefOpenVideo(videoId));

    let onVis: (() => void) | null = null;
    // Snapchat bloque souvent l'auto-open scheme — on laisse le tap utilisateur.
    if (reclaim && !snap) {
      const k = `${WA_OPEN_KEY}:${videoId}`;
      const trySchemeOnce = () => {
        try {
          if (sessionStorage.getItem(STAY_KEY) === '1') return;
          if (sessionStorage.getItem(k) === '1') return;
          if (document.visibilityState !== 'visible') return;
          sessionStorage.setItem(k, '1');
          openAfroBiteUser(videoId);
        } catch {}
      };
      window.setTimeout(trySchemeOnce, 350);
      onVis = () => {
        if (document.visibilityState === 'visible') trySchemeOnce();
      };
      document.addEventListener('visibilitychange', onVis);
    }

    const delay = reclaim ? 900 : 2500;
    const t = window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      setShow(true);
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
    try {
      sessionStorage.setItem(STAY_KEY, '1');
    } catch {}
    setShow(false);
    unlock();
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
          {isSnap
            ? 'Sur Snapchat, touchez Ouvrir AfroBite. Si rien ne se passe, ouvrez le lien dans Safari (icône en bas à droite).'
            : isReclaimBrowser
              ? 'Touchez Ouvrir AfroBite pour rester dans l’app.'
              : isSafari
                ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari.'
                : dishName
                  ? `Découvrez « ${dishName} » et commandez dans l’application.`
                  : 'Commandez ce plat directement dans l’application AfroBite.'}
        </p>
        <a
          className="afv-modal-primary"
          href={openHref}
          onClick={(e) => {
            if (isSnapchatBrowser()) return;
            e.preventDefault();
            openAfroBiteUser(videoId);
          }}
        >
          Ouvrir AfroBite
        </a>
        <button type="button" className="afv-modal-download" onClick={() => openUserStore()}>
          Télécharger l’app
        </button>
        <button type="button" className="afv-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
