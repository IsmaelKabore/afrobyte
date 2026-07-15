"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";
import { Icon } from "./icon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/** Hero d'accueil — mêmes mots/rendu que l'original, entrée animée unifiée. */
export function Hero() {
  return (
    <section className="hero">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
      >
        <motion.div className="eyebrow" variants={item}>
          Disponible maintenant · v1.0
        </motion.div>

        <h1>
          <motion.span className="line" variants={item}>
            Scrolle.
          </motion.span>
          <motion.span className="line italic" variants={item}>
            Choisis.
          </motion.span>
          <motion.span className="line" variants={item}>
            Mange.
          </motion.span>
        </h1>

        <motion.p className="sub" variants={item}>
          L&apos;app de livraison conçue pour la génération du feed. Découvre des plats en vidéo.
          Commande en un geste. Suis ta livraison en direct.
        </motion.p>

        <motion.div className="actions" variants={item}>
          <a href="#cta" className="btn btn-dark">
            Télécharger <Icon icon={ArrowUpRight} size={17} />
          </a>
          <a href="#discover" className="btn btn-ghost">
            Voir comment ça marche
          </a>
        </motion.div>
      </motion.div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scrolle</span>
        <div className="line" />
      </div>
    </section>
  );
}
