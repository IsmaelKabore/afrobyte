'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUserDish,
  openUserStore,
  hrefOpenDish,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
  isSnapchatBrowser,
} from '@/lib/openApp';

const STAY_KEY = 'afp_stay_web';
const RECLAIM_KEY = 'afp_scheme_once';

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
  const [isSnap, setIsSnap] = useState(false);
  const [openHref, setOpenHref] = useState('#');

  useEffect(() => {
    if (!restaurantId || !dishId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    const snap = isSnapchatBrowser();
    setIsSafari(safari);
    setIsReclaimBrowser(reclaim);
    setIsSnap(snap);
    setOpenHref(hrefOpenDish(restaurantId, dishId));

    let onVis: (() => void) | null = null;
    if (reclaim && !snap) {
      const k = `${RECLAIM_KEY}:${restaurantId}:${dishId}`;
      const trySchemeOnce = () => {
        try {
          if (sessionStorage.getItem(STAY_KEY) === '1') return;
          if (sessionStorage.getItem(k) === '1') return;
          if (document.visibilityState !== 'visible') return;
          sessionStorage.setItem(k, '1');
          openAfroBiteUserDish(restaurantId, dishId);
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
          {isSnap
            ? 'Sur Snapchat, touchez Ouvrir AfroBite. Si rien ne se passe, ouvrez le lien dans Safari.'
            : isReclaimBrowser
              ? 'Touchez Ouvrir AfroBite pour rester dans l’app.'
              : isSafari
                ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari.'
                : dishName
                  ? `Découvrez « ${dishName} » et commandez dans l’application.`
                  : 'Commandez ce plat directement dans l’application AfroBite.'}
        </p>
        <a
          className="afp-modal-primary"
          href={openHref}
          onClick={(e) => {
            if (isSnapchatBrowser()) return;
            e.preventDefault();
            openAfroBiteUserDish(restaurantId, dishId);
          }}
        >
          Ouvrir AfroBite
        </a>
        <button type="button" className="afp-modal-download" onClick={() => openUserStore()}>
          Télécharger l’app
        </button>
        <button type="button" className="afp-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
