'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUserRestaurant,
  openUserStore,
  hrefOpenRestaurant,
  isIOSSafariWithSmartBanner,
  isInAppBrowserThatReclaims,
  isSnapchatBrowser,
} from '@/lib/openApp';

const STAY_KEY = 'afr_stay_web';

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
  const [isSnap, setIsSnap] = useState(false);
  const [openHref, setOpenHref] = useState('#');

  useEffect(() => {
    if (!restaurantId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}

    const safari = isIOSSafariWithSmartBanner();
    const reclaim = isInAppBrowserThatReclaims();
    const snap = isSnapchatBrowser();
    const hydrate = window.setTimeout(() => {
      setIsSafari(safari);
      setIsReclaimBrowser(reclaim);
      setIsSnap(snap);
      setOpenHref(hrefOpenRestaurant(restaurantId));
    }, 0);

    const delay = reclaim ? 900 : 2500;
    const t = window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      setShow(true);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }, delay);
    return () => {
      window.clearTimeout(hydrate);
      window.clearTimeout(t);
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
          {isSnap
            ? 'Sur Snapchat, touchez Ouvrir AfroBite. Si rien ne se passe, ouvrez le lien dans Safari.'
            : isReclaimBrowser
              ? 'Touchez Ouvrir AfroBite pour rester dans l’app.'
              : isSafari
                ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari.'
                : restaurantName
                  ? `Découvrez « ${restaurantName} » et ses plats dans l’application.`
                  : 'Découvrez ce restaurant et ses plats dans l’application.'}
        </p>
        <a
          className="afr-modal-primary"
          href={openHref}
          onClick={(e) => {
            if (isSnapchatBrowser()) return;
            e.preventDefault();
            openAfroBiteUserRestaurant(restaurantId);
          }}
        >
          Ouvrir AfroBite
        </a>
        <button type="button" className="afr-modal-download" onClick={() => openUserStore()}>
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
