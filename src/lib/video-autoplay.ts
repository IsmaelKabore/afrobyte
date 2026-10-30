import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";

/**
 * Lecture automatique silencieuse fiable, y compris dans les navigateurs in-app
 * (WhatsApp, TikTok, Instagram, Facebook) où les liens AfroBite s'ouvrent souvent.
 * Même logique que src/app/v/[videoId]/VideoPlayer.tsx :
 *  - React n'écrit pas `muted` dans le HTML serveur ; sans lui la WebView
 *    considère la vidéo comme sonore et refuse l'autoplay ;
 *  - un play() refusé n'est jamais relancé : on réessaie au premier geste, au
 *    retour au premier plan, à l'entrée dans l'écran et quelques fois après le
 *    montage. Hors écran : pause, pour ne pas consommer de données.
 */
export function ensurePlaying(video: HTMLVideoElement) {
  if (!video.paused) return;
  video.muted = true;
  video.setAttribute("muted", "");
  video.playsInline = true;
  void video.play().catch(() => {});
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** Le visiteur demande moins d'animations. Vrai côté serveur : rien ne démarre avant l'hydratation. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => true);
}

/**
 * Fait jouer la vidéo `current()` quand `target` est à l'écran (à `rootMargin`
 * près, pour commencer à charger juste avant), la met en pause sinon.
 * Renvoie l'état « à l'écran », pour qui en a besoin.
 */
export function useAutoplayInView(
  target: RefObject<Element | null>,
  current: () => HTMLVideoElement | null | undefined,
  { enabled = true, rootMargin = "0px" }: { enabled?: boolean; rootMargin?: string } = {},
): RefObject<boolean> {
  const visible = useRef(true);
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  });

  useEffect(() => {
    if (!enabled) {
      currentRef.current()?.pause();
      return;
    }
    // Avec IntersectionObserver, on attend son verdict pour ne pas charger une
    // vidéo encore loin de l'écran ; sans lui, on la considère visible.
    const observed = target.current;
    let inView = !observed || typeof IntersectionObserver === "undefined";
    visible.current = inView;
    const resume = () => {
      const video = currentRef.current();
      if (video && inView) ensurePlaying(video);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") resume();
    };
    document.addEventListener("touchstart", resume, { passive: true });
    document.addEventListener("click", resume);
    document.addEventListener("visibilitychange", onVisibility);
    let io: IntersectionObserver | null = null;
    if (observed && !inView) {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          visible.current = inView;
          if (inView) resume();
          else currentRef.current()?.pause();
        },
        { rootMargin },
      );
      io.observe(observed);
    }
    const retries = [0, 200, 800, 2000].map((d) => window.setTimeout(resume, d));
    return () => {
      document.removeEventListener("touchstart", resume);
      document.removeEventListener("click", resume);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
      retries.forEach((t) => window.clearTimeout(t));
    };
  }, [enabled, target, rootMargin]);

  return visible;
}
