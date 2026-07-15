"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";

/**
 * Révélation au scroll réutilisable (DRY).
 * <Reveal> anime un bloc ; <Reveal stagger> décale ses enfants
 * (chaque enfant direct doit être un <RevealItem>).
 *
 * NB : RevealItem est un export nommé distinct (et non Reveal.Item),
 * car une propriété statique sur un composant client n'est pas
 * accessible depuis un composant serveur (frontière RSC).
 */
export function Reveal({
  children,
  className,
  stagger,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger ? staggerContainer() : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
