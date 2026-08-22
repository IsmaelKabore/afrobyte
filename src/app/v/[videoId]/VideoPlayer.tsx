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

    // Safari / iOS : HLS natif via l'attribut src (déjà en SSR → preview immédiat).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== hlsUrl) video.src = hlsUrl;
      video.play().catch(() => {});
      return;
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
          video.play().catch(() => {});
        } else {
          video.src = hlsUrl;
          video.play().catch(() => {});
        }
      })
      .catch(() => {
        video.src = hlsUrl;
      });

    return () => {
      cancelled = true;
      hls?.destroy();
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
