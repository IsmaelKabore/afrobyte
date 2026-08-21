'use client';

import { useCallback, useEffect, useState } from 'react';
import { openAfroBiteUser } from '@/lib/openApp';

const STAY_KEY = 'afv_stay_web';

/**
 * Modal CENTRAL bloquant (réf. TikTok).
 * Apparaît après ~2,5 s. Pas d'auto-open app.
 * Continuer sur le web → sessionStorage, ne se réaffiche pas.
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

  useEffect(() => {
    if (!videoId) return;
    try {
      if (sessionStorage.getItem(STAY_KEY) === '1') return;
    } catch {}
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
    openAfroBiteUser(videoId);
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
          {dishName
            ? `Découvrez « ${dishName} » et commandez directement dans l’application.`
            : 'Découvrez ce restaurant et commandez directement dans l’application pour une meilleure expérience.'}
        </p>
        <button type="button" className="afv-modal-primary" onClick={openApp}>
          Ouvrir AfroBite
        </button>
        <button type="button" className="afv-modal-secondary" onClick={stayWeb}>
          Continuer sur le web
        </button>
      </div>
    </div>
  );
}
