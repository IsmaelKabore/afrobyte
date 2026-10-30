"use client";

import { useRef } from "react";
import { DecouvertesVideo } from "@/components/decouvertes-video";
import { useAutoplayInView, usePrefersReducedMotion } from "@/lib/video-autoplay";

/**
 * Téléphone qui joue l'enregistrement de l'onglet Découvertes de l'app, comme
 * sur l'accueil. La page tient sur un écran (pas de scroll) : la vidéo se joue
 * en entier, en boucle, et le feed y défile tout seul.
 */
export function DownloadFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  useAutoplayInView(videoRef, () => videoRef.current, { enabled: !reducedMotion });

  return (
    <div className="phone phone-video dl-phone">
      <div className="screen">
        <DecouvertesVideo ref={videoRef} />
      </div>
    </div>
  );
}
