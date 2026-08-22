'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUserRestaurant,
  openUserStore,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
} from '@/lib/openApp';

const STAY_KEY = 'afr_stay_web';
const RECLAIM_KEY = 'afr_scheme_once';

export default function RestaurantOpenPrompt({
  restaurantId,
  thumbUrl,
  restaurantName,
}: {
  restaurantId: string;
  thumbUrl: string | null;
  restaurantName: string | null;
}) {
  const [show, setShow] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isReclaimBrowser, setIsReclaimBrowser] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    setIsSafari(safari);
    setIsReclaimBrowser(reclaim);

    let onVis: (() => void) | null = null;
    if (reclaim) {
      const k = `${RECLAIM_KEY}:${restaurantId}`;
      const trySchemeOnce = () => {
        try {
          if (sessionStorage.getItem(STAY_KEY) === '1') return;
          if (sessionStorage.getItem(k) === '1') return;
          if (document.visibilityState !== 'visible') return;
          sessionStorage.setItem(k, '1');
          openAfroBiteUserRestaurant(restaurantId);
        } catch {}
      };
      window.setTimeout(trySchemeOnce, 350);
      onVis = () => {
        if (document.visibilityState === 'visible') trySchemeOnce();
      };
      document.addEventListener('visibilitychange', onVis);
    }

    const delay = reclaim ? 1200 : 2500;
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
  }, [restaurantId]);

  const unlock = useCallback(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  if (!show) return null;

  return (
    <div className="afr-modal" role="dialog" aria-modal="true">
      <div className="afr-modal-card">
        <div className="afr-modal-avatar-wrap">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="afr-modal-avatar" src={thumbUrl} alt="" />
          ) : (
            <div className="afr-modal-avatar afr-modal-avatar-fallback">🍽️</div>
          )}
        </div>
        <h2 className="afr-modal-title">
          Ouvrir ce restaurant dans
          <br />
          AfroBite&nbsp;?
        </h2>
        <p className="afr-modal-desc">
          {isReclaimBrowser
            ? 'Touchez Ouvrir AfroBite pour rester dans l’app sur ce restaurant.'
            : isSafari
              ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari.'
              : restaurantName
                ? `Découvrez « ${restaurantName} » et ses plats dans l’application.`
                : 'Découvrez ce restaurant et ses plats dans l’application.'}
        </p>
        <button
          type="button"
          className="afr-modal-primary"
          onClick={() => openAfroBiteUserRestaurant(restaurantId)}
        >
          Ouvrir AfroBite
        </button>
        <button
          type="button"
          className="afr-modal-download"
          onClick={() => openUserStore()}
        >
          Télécharger l’app
        </button>
        <button
          type="button"
          className="afr-modal-secondary"
          onClick={() => {
            try {
              sessionStorage.setItem(STAY_KEY, '1');
            } catch {}
            setShow(false);
            unlock();
          }}
        >
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
