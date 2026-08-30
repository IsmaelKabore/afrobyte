'use client';

import { useEffect, useRef, useState } from 'react';

/** Player HLS (Mux) : natif Safari/iOS, hls.js ailleurs. Autoplay muted. */
export default function VideoPlayer({
  hlsUrl,
  poster,
  interactive = true,
}: {
  hlsUrl: string;
  poster: string | null;
  /** false quand le modal bloque l'UI */
  interactive?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [useNativeSrc, setUseNativeSrc] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Autoplay robuste — surtout dans les navigateurs IN-APP (TikTok, Instagram,
    // Facebook) où la lecture ne démarrait pas seule :
    //  1. React n'émet PAS l'attribut `muted` dans le HTML rendu côté serveur ;
    //     sans lui la WebView considère la vidéo comme sonore et refuse
    //     l'autoplay. On force donc la propriété avant chaque tentative.
    //  2. Un seul `play()` au montage ne suffit pas : s'il est rejeté, plus rien
    //     ne relance. On réessaie au premier geste utilisateur, au retour au
    //     premier plan, et dès que la vidéo devient visible.
    const ensurePlaying = () => {
      if (!video.paused) return;
      video.muted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      void video.play().catch(() => {});
    };

    const onFirstGesture = () => ensurePlaying();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') ensurePlaying();
    };
    // `once: false` : certaines WebView ne débloquent qu'au 2ᵉ geste.
    document.addEventListener('touchstart', onFirstGesture, { passive: true });
    document.addEventListener('click', onFirstGesture);
    document.addEventListener('visibilitychange', onVisibility);

    // Relance quand la vidéo entre dans le viewport (utile si la page défile).
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) ensurePlaying();
            else if (!video.paused) video.pause();
          }
        },
        { threshold: 0.5 },
      );
      io.observe(video);
    }

    // Filet : quelques tentatives espacées après le montage (la WebView peut
    // n'autoriser la lecture qu'une fois la page pleinement chargée).
    const retries = [200, 800, 2000].map((d) =>
      window.setTimeout(ensurePlaying, d),
    );

    const cleanupAutoplay = () => {
      document.removeEventListener('touchstart', onFirstGesture);
      document.removeEventListener('click', onFirstGesture);
      document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
      retries.forEach((t) => window.clearTimeout(t));
    };

    // Safari / iOS : HLS natif via l'attribut src (déjà en SSR → preview immédiat).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== hlsUrl) video.src = hlsUrl;
      ensurePlaying();
      return cleanupAutoplay;
    }

    // Chrome / Android / desktop : retirer le src m3u8 brut, laisser hls.js.
    setUseNativeSrc(false);
    let hls: { destroy: () => void } | null = null;
    let cancelled = false;
    import('hls.js')
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          video.removeAttribute('src');
          video.load();
          const inst = new Hls({ maxBufferLength: 10, capLevelToPlayerSize: true });
          inst.loadSource(hlsUrl);
          inst.attachMedia(video);
          hls = inst;
          // Dès que le 1er segment est prêt, on (re)tente la lecture.
          inst.on(Hls.Events.MANIFEST_PARSED, ensurePlaying);
          ensurePlaying();
        } else {
          video.src = hlsUrl;
          ensurePlaying();
        }
      })
      .catch(() => {
        video.src = hlsUrl;
        ensurePlaying();
      });

    return () => {
      cancelled = true;
      hls?.destroy();
      cleanupAutoplay();
    };
  }, [hlsUrl]);

  const toggleSound = () => {
    if (!interactive) return;
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    video.play().catch(() => {});
  };

  return (
    <div className="afv-player">
      <video
        ref={ref}
        // src SSR : Safari joue tout de suite même avant hydratation JS.
        src={useNativeSrc ? hlsUrl : undefined}
        poster={poster ?? undefined}
        muted={muted}
        loop
        playsInline
        autoPlay
        onClick={toggleSound}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      />
      {muted && interactive && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Activer le son"
          className="afv-mute"
        >
          🔇 Son
        </button>
      )}
    </div>
  );
}
