'use client';

import { useEffect, useRef, useState } from 'react';

/** Player HLS (Mux) : natif sur Safari/iOS, hls.js ailleurs.
 *  Autoplay muted (politique navigateur), tap pour activer le son. */
export default function VideoPlayer({
  hlsUrl,
  poster,
}: {
  hlsUrl: string;
  poster: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Safari / iOS : HLS natif.
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

    // Autres navigateurs : hls.js chargé dynamiquement (léger, hors bundle initial).
    let hls: { destroy: () => void } | null = null;
    let cancelled = false;
    import('hls.js')
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
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
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    video.play().catch(() => {});
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={ref}
        poster={poster ?? undefined}
        muted={muted}
        loop
        playsInline
        autoPlay
        onClick={toggleSound}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: '#000',
          cursor: 'pointer',
        }}
      />
      {muted && (
        <button
          onClick={toggleSound}
          aria-label="Activer le son"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          🔇 Son
        </button>
      )}
    </div>
  );
}
