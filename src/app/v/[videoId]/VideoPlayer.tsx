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

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

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
