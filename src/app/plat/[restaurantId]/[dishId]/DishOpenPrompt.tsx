'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUserDish,
  openUserStore,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
} from '@/lib/openApp';

const STAY_KEY = 'afp_stay_web';
const RECLAIM_KEY = 'afp_scheme_once';

/** Modal + reclaim in-app browser pour les liens /plat/*. */
export default function DishOpenPrompt({
  restaurantId,
  dishId,
  thumbUrl,
  dishName,
}: {
  restaurantId: string;
  dishId: string;
  thumbUrl: string | null;
  dishName: string | null;
}) {
  const [show, setShow] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isReclaimBrowser, setIsReclaimBrowser] = useState(false);

  useEffect(() => {
    if (!restaurantId || !dishId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    setIsSafari(safari);
    setIsReclaimBrowser(reclaim);

    let onVis: (() => void) | null = null;
    if (reclaim) {
      const k = `${RECLAIM_KEY}:${restaurantId}:${dishId}`;
      const trySchemeOnce = () => {
        try {
          if (sessionStorage.getItem(STAY_KEY) === '1') return;
          if (sessionStorage.getItem(k) === '1') return;
          if (document.visibilityState !== 'visible') return;
          sessionStorage.setItem(k, '1');
          console.log('[DISH_MODAL] reclaim → custom scheme');
          openAfroBiteUserDish(restaurantId, dishId);
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
  }, [restaurantId, dishId]);

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
    <div className="afp-modal" role="dialog" aria-modal="true">
      <div className="afp-modal-card">
        <div className="afp-modal-avatar-wrap">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="afp-modal-avatar" src={thumbUrl} alt="" />
          ) : (
            <div className="afp-modal-avatar afp-modal-avatar-fallback">🍽️</div>
          )}
        </div>
        <h2 className="afp-modal-title">
          Ouvrir ce plat dans
          <br />
          AfroBite&nbsp;?
        </h2>
        <p className="afp-modal-desc">
          {isReclaimBrowser
            ? 'L’app s’est ouverte puis la page web est revenue. Touchez Ouvrir AfroBite pour rester dans l’app.'
            : isSafari
              ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari pour ouvrir l’app.'
              : dishName
                ? `Découvrez « ${dishName} » et commandez directement dans l’application.`
                : 'Commandez ce plat directement dans l’application AfroBite.'}
        </p>
        <button
          type="button"
          className="afp-modal-primary"
          onClick={() => openAfroBiteUserDish(restaurantId, dishId)}
        >
          Ouvrir AfroBite
        </button>
        <button
          type="button"
          className="afp-modal-download"
          onClick={() => openUserStore()}
        >
          Télécharger l’app
        </button>
        <button type="button" className="afp-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
