/**
 * Système d'animation unifié (Framer Motion).
 * Une seule courbe d'easing et des variants partagés pour toute
 * cohérence de mouvement à travers le site.
 */
import type { Variants } from "motion/react";

/** Courbe d'easing maison — reprise du site d'origine (var(--ease)). */
export const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

/** Apparition douce vers le haut — la brique de base des révélations. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Conteneur qui décale l'apparition de ses enfants (stagger). */
export function staggerContainer(stagger = 0.12, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Réglage de viewport commun pour les révélations au scroll. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
