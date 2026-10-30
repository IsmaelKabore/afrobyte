"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useAutoplayInView, usePrefersReducedMotion } from "@/lib/video-autoplay";

/**
 * Découverte — section épinglée au scroll. Le téléphone joue l'enregistrement
 * de l'onglet Découvertes de l'app (public/videos/afrobite-decouvertes.*) : le
 * feed y défile tout seul, en boucle continue, avec toute l'interface de l'app
 * déjà incrustée. La vidéo ne se charge qu'à l'approche de la section.
 */
export function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  useAutoplayInView(videoRef, () => videoRef.current, { enabled: !reducedMotion, rootMargin: "300px 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  // Le téléphone « vit » au scroll : il flotte vers le haut au milieu du
  // parcours puis redescend, gonfle légèrement, et pivote en profondeur.
  // (Intention reprise du GSAP du site d'origine, portée en Framer Motion.)
  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -24, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.06, 1]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 1], [-8, -4]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 1], [4, 2]);

  return (
    <section className="discovery" id="discover" ref={sectionRef} data-nav-dark>
      <div className="sticky-stage">
        <motion.div className="bg-parallax" style={{ y: bgY }} aria-hidden />

        <div className="copy">
          <div className="section-head">
            <span className="num">01</span> Découverte
          </div>
          <h2 className="display">
            Un feed de <em>saveurs.</em>
          </h2>
          <p>
            Oublie les menus à faire défiler. Ouvre AfroBite et glisse à travers un feed
            cinématographique de plats — chacun une vidéo de 15 secondes, filmée dans la cuisine qui
            l&apos;a préparé.
          </p>
          <p>Grésillement. Vapeur. Dressage. Tu le goûtes avant de cliquer.</p>
        </div>

        <div className="phone-wrap">
          <motion.div
            className="phone"
            id="phone-discovery"
            style={{
              y: phoneY,
              scale: phoneScale,
              rotateY: phoneRotateY,
              rotateX: phoneRotateX,
              transformPerspective: 1500,
            }}
          >
            <div className="screen">
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster="/videos/afrobite-decouvertes-poster.jpg"
                aria-label="L'app AfroBite : le feed Découvertes, des plats de restaurants d'Ouagadougou en vidéo qu'on ajoute au panier"
              >
                <source src="/videos/afrobite-decouvertes.webm" type="video/webm; codecs=vp9" />
                <source src="/videos/afrobite-decouvertes.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
