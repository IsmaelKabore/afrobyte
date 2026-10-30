"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { DECOUVERTES_POSTS, DecouvertesVideo } from "@/components/decouvertes-video";
import { useAutoplayInView, usePrefersReducedMotion } from "@/lib/video-autoplay";

const POSTS = DECOUVERTES_POSTS;
const TOTAL = POSTS.length;

/**
 * Découverte — feed vidéo vertical (type TikTok) épinglé au scroll. Le téléphone
 * joue l'enregistrement de l'app, et c'est le scroll de la section qui choisit
 * le post : en descendant, on joue le glissement de l'app jusqu'au post suivant ;
 * en remontant, on revient directement au post. Chaque post tourne en boucle
 * tant qu'on y reste ; le pager suit.
 */
export function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  // La vidéo ne se charge qu'à l'approche de la section.
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

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.round(v * (TOTAL - 1))));
    const from = activeRef.current;
    if (i === from) return;
    activeRef.current = i;
    setActive(i);
    const video = videoRef.current;
    if (!video) return;
    // En descendant : le glissement de l'app jusqu'au post. En remontant (ou en
    // mouvement réduit, image fixe) : le post directement.
    video.currentTime = i > from && !reducedMotion ? POSTS[i].swipeFrom : POSTS[i].start;
  });

  // Le post en cours tourne en boucle : arrivé à sa fin (juste avant le
  // glissement suivant de la vidéo), on revient à son début. Vérifié à chaque
  // image affichée, pour ne jamais laisser voir le début du glissement.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    const check = (t: number) => {
      const post = POSTS[activeRef.current];
      if (!video.seeking && (t >= post.end || t < post.swipeFrom)) video.currentTime = post.start;
    };
    let stopped = false;
    let handle = 0;
    // requestVideoFrameCallback : Chrome, Safari 15.4+, Firefox 132+ ; sinon, à chaque frame d'écran.
    const perFrame = typeof video.requestVideoFrameCallback === "function";
    const next = () => {
      if (stopped) return;
      handle = perFrame
        ? video.requestVideoFrameCallback((_, meta) => {
            check(meta.mediaTime);
            next();
          })
        : requestAnimationFrame(() => {
            check(video.currentTime);
            next();
          });
    };
    next();
    return () => {
      stopped = true;
      if (perFrame) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
  }, [reducedMotion]);

  return (
    <section
      className="discovery"
      id="discover"
      ref={sectionRef}
      data-nav-dark
      style={{ height: `${TOTAL * 100}vh` }}
    >
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
            className="phone phone-video"
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
              <DecouvertesVideo ref={videoRef} />
            </div>
          </motion.div>
        </div>

        <div className="scroll-pager" aria-hidden>
          {POSTS.map((p, i) => (
            <div key={p.name} className={i === active ? "dot active" : "dot"} />
          ))}
        </div>
      </div>
    </section>
  );
}
