'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  openAfroBiteUser,
  openUserStore,
  isIOSSafariWithSmartBanner,
} from '@/lib/openApp';

const STAY_KEY = 'afv_stay_web';

/**
 * Modal CENTRAL bloquant.
 * Pas d'auto-open app. Pas de timer store.
 * Ouvrir → tente l'app User. Télécharger → store explicite.
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

  useEffect(() => {
    if (!videoId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}
    setIsSafari(isIOSSafariWithSmartBanner());
    const t = window.setTimeout(() => {
      setShow(true);
      console.log('[MODAL] shown');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }, 2500);
    return () => {
      window.clearTimeout(t);
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
    // Sur Safari iOS le Smart App Banner natif (OPEN) est le chemin fiable.
    // On tente quand même les schemes silencieux (builds User ≥ 7).
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
          {isSafari
            ? 'Astuce iPhone : utilisez le bouton bleu OPEN en haut de Safari pour ouvrir l’app directement.'
            : dishName
              ? `Découvrez « ${dishName} » et commandez directement dans l’application.`
              : 'Découvrez ce restaurant et commandez directement dans l’application pour une meilleure expérience.'}
        </p>
        <button type="button" className="afv-modal-primary" onClick={openApp}>
          Ouvrir AfroBite
        </button>
        <button type="button" className="afv-modal-secondary" onClick={download}>
          Télécharger l’app
        </button>
        <button type="button" className="afv-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
