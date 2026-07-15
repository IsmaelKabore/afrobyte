"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Check, MapPin } from "lucide-react";
import { SiApplepay } from "@icons-pack/react-simple-icons";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";

/* ---- Visuels des cartes (bespoke, contenus dans la section) ---- */

const PICKS = [
  { name: "Riz Gras", price: "2 500 F", img: "/videos/riz-gras.jpg", selected: true },
  { name: "Brochettes", price: "2 000 F", img: "/videos/brochettes-boeuf.jpg" },
  { name: "Galettes", price: "1 500 F", img: "/videos/galettes-mil.jpg" },
  { name: "Bissap", price: "1 000 F", img: "/videos/bissap-glace.jpg" },
];

function PickVisual() {
  return (
    <div className="visual">
      <div className="pick-vis">
        {PICKS.map((p) => (
          <div key={p.name} className={p.selected ? "pick-item selected" : "pick-item"}>
            <div className="swatch" style={{ background: `url(${p.img}) center/cover` }} />
            <div className="name">{p.name}</div>
            <div className="p">{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocVisual() {
  return (
    <div className="visual">
      <div className="loc-vis">
        <svg viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden>
          <defs>
            <pattern id="ofgrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(212,162,74,.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ofgrid)" />
          <path d="M0 120 Q100 60 200 120 T400 100" stroke="rgba(212,162,74,.3)" strokeWidth="2" fill="none" />
          <path d="M50 180 L150 140 L250 200 L350 150" stroke="rgba(255,255,255,.1)" strokeWidth="1" fill="none" />
        </svg>
        <div className="loc-pulse" />
        <div className="loc-address">
          <Icon icon={MapPin} size={12} />
          Avenue Kwame N&apos;Krumah · Ouagadougou
        </div>
      </div>
    </div>
  );
}

function EtaVisual() {
  return (
    <div className="visual">
      <div className="eta-vis">
        <div className="big">18</div>
        <div className="unit">minutes avant ta porte</div>
        <div className="eta-bar">
          <div />
        </div>
        <div className="eta-meta">
          <span>PRÉPA · 8m</span>
          <span>ROUTE · 10m</span>
        </div>
      </div>
    </div>
  );
}

function PayVisual() {
  return (
    <div className="visual">
      <div className="pay-vis">
        <div className="pay-row">
          <span>Brochettes × 1</span>
          <span>2 000 F</span>
        </div>
        <div className="pay-row">
          <span>Alloco × 2</span>
          <span>1 000 F</span>
        </div>
        <div className="pay-row">
          <span>Livraison</span>
          <span>500 F</span>
        </div>
        <div className="pay-row total">
          <span>Total</span>
          <span>3 500 F</span>
        </div>
        <div className="pay-btn">
          <SiApplepay color="currentColor" aria-hidden /> Payer
        </div>
      </div>
    </div>
  );
}

function DoneVisual() {
  return (
    <div className="visual done-vis">
      <div className="check">
        <Icon icon={Check} size={32} strokeWidth={2.5} />
      </div>
      <h4>Commande confirmée</h4>
      <p style={{ color: "#aaa", fontSize: 13 }}>Chez Tantie Aminata prépare ta commande</p>
    </div>
  );
}

const STEPS: { tag: string; num: string; title: ReactNode; text: string; visual: ReactNode }[] = [
  {
    tag: "Étape 01",
    num: "01",
    title: "Choisis ton plat.",
    text: "Clique sur une vidéo. Ajoute au panier. C'est tout. Chaque plat est vérifié frais, prix affiché — aucune surprise.",
    visual: <PickVisual />,
  },
  {
    tag: "Étape 02",
    num: "02",
    title: "Indique ton adresse.",
    text: "Pose un point, enregistre un favori, ou utilise simplement ton domicile. Les zones de livraison sont calculées en millisecondes.",
    visual: <LocVisual />,
  },
  {
    tag: "Étape 03",
    num: "03",
    title: "Découvre l'heure d'arrivée.",
    text: "Notre moteur choisit la cuisine la plus proche et le coursier le plus rapide. Tu sais avant de payer.",
    visual: <EtaVisual />,
  },
  {
    tag: "Étape 04",
    num: "04",
    title: "Paye, terminé.",
    text: "Apple Pay, Google Pay, carte, wallet. Un geste, signé et chiffré. Le restaurant ne voit la commande qu'une fois payée.",
    visual: <PayVisual />,
  },
  {
    tag: "Étape 05",
    num: "05",
    title: "Suis-la en direct.",
    text: "Tu passes sur une carte en direct. Chaque étape, de la cuisine à ta porte, sur ton écran verrouillé.",
    visual: <DoneVisual />,
  },
];

/**
 * Parcours de commande — scroll horizontal épinglé.
 * La hauteur du conteneur = 100vh + distance horizontale, ce qui convertit
 * le scroll vertical en translation X 1:1 (piloté par Framer Motion).
 */
export function OrderFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const d = trackRef.current.scrollWidth - window.innerWidth;
      setDistance(Math.max(0, d));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="order-flow" id="order">
      <Reveal className="intro">
        <div className="section-head">
          <span className="num">02</span> Parcours de commande
        </div>
        <h2 className="display">
          Cinq gestes <em>et la faim disparaît.</em>
        </h2>
      </Reveal>

      <div
        className="h-scroll-container"
        ref={containerRef}
        style={{ height: `calc(100vh + ${distance}px)` }}
      >
        <div className="h-scroll-sticky">
          <motion.div className="h-scroll-track" ref={trackRef} style={{ x }}>
            {STEPS.map((s) => (
              <article className="step-card" key={s.num}>
                <div>
                  <div className="step-tag">{s.tag}</div>
                  <div className="num-big">{s.num}</div>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.visual}
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
