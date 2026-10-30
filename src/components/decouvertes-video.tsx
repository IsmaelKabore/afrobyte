import type { Ref } from "react";

/**
 * Enregistrement de l'onglet Découvertes de l'app (public/videos/afrobite-decouvertes.*) :
 * 720 × 1560 ramené à 576 px, sans son, 45 s, boucle continue (la dernière image
 * est la première). Toute l'interface de l'app est incrustée : le téléphone qui
 * l'affiche est un cadre vide (classe `phone-video`).
 * Utilisé par la section Découverte de l'accueil et par /telecharger.
 */
export function DecouvertesVideo({ ref, loop = true }: { ref?: Ref<HTMLVideoElement>; loop?: boolean }) {
  return (
    <video
      ref={ref}
      muted
      loop={loop}
      playsInline
      preload="none"
      poster="/videos/afrobite-decouvertes-poster.jpg"
      aria-label="L'app AfroBite : le feed Découvertes, des plats de restaurants d'Ouagadougou en vidéo qu'on ajoute au panier"
    >
      <source src="/videos/afrobite-decouvertes.webm" type="video/webm; codecs=vp9" />
      <source src="/videos/afrobite-decouvertes.mp4" type="video/mp4" />
    </video>
  );
}

/**
 * Les 4 posts de la vidéo, en secondes. Un post se joue en boucle de `start` à
 * `end` ; `swipeFrom` est la dernière image fixe avant le glissement de l'app qui
 * l'amène (relevé image par image sur la carte du plat). Les deux fichiers ont
 * une image clé forcée à chaque `swipeFrom` et `start` : les sauts sont immédiats.
 */
export const DECOUVERTES_POSTS = [
  { name: "After Work", swipeFrom: 0, start: 0, end: 7.5 },
  { name: "Afiyet Kebab", swipeFrom: 7.567, start: 8.067, end: 26.9 },
  { name: "Miss Thé", swipeFrom: 26.934, start: 27.434, end: 42 },
  { name: "Baguette du Faso", swipeFrom: 42.034, start: 42.601, end: 44.55 },
] as const;
