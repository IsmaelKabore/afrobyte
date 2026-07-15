"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bike, Check, Home, Phone } from "lucide-react";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";

const STAGES = [
  "Commande reçue",
  "Cuisine acceptée",
  "Préparation en cuisine",
  "Coursier en route",
  "Livrée",
];

/**
 * Suivi en direct — section épinglée. Le scroll fait progresser les étapes,
 * décompte l'ETA et fait avancer le coursier le long de l'itinéraire.
 */
export function Tracking() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(2);
  const [eta, setEta] = useState(4);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Le coursier reste au-dessus de la fiche (bottom-sheet) sur tout le trajet.
  const courierLeft = useTransform(scrollYProgress, [0, 1], ["14%", "56%"]);
  const courierBottom = useTransform(scrollYProgress, [0, 1], ["28%", "80%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(STAGES.length - 1, Math.max(0, Math.floor(p * STAGES.length))));
    setEta(Math.max(0, Math.round((1 - p) * 6)));
  });

  return (
    <section className="tracking" id="track" ref={sectionRef} data-nav-dark>
      <div className="container">
        <div className="grid">
          <Reveal className="copy">
            <div className="section-head">
              <span className="num">03</span> Suivi en direct
            </div>
            <h2 className="display">
              Toujours <em>sur la carte.</em>
            </h2>
            <p>
              Fini le rafraîchissement. Fini le « où est ma commande ? » Chaque étape a son
              battement — visible directement sur ton écran verrouillé grâce au widget d&apos;activité
              en direct.
            </p>
            <ul className="stages">
              {STAGES.map((label, i) => {
                const state = i < active ? "done" : i === active ? "active" : "";
                return (
                  <li className={state ? `stage ${state}` : "stage"} key={label}>
                    <div className="marker">
                      {i < active ? <Icon icon={Check} size={13} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <div>
                      <span className="label">
                        Étape {i + 1}
                        {i === active ? " · En cours" : ""}
                      </span>
                      {label}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="phone-side">
            <div className="phone">
              <div className="screen">
                <div className="d-island">
                  <div className="bike-ico">
                    <Icon icon={Bike} size={16} strokeWidth={2} />
                  </div>
                  <div className="info">
                    <div className="top">Arrivée dans</div>
                    <div className="bottom">Issouf · à 2 rues</div>
                  </div>
                  <div className="time">{eta <= 0 ? "Arrivé" : `${eta}m`}</div>
                </div>

                <div className="map-screen">
                  <svg className="map" viewBox="0 0 300 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
                    <defs>
                      <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2a3340" strokeWidth=".8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mapgrid)" />
                    <path
                      d="M30 50 L270 50 M30 150 L270 150 M30 250 L270 250 M30 350 L270 350 M30 450 L270 450"
                      stroke="#2a3340"
                      strokeWidth="2"
                    />
                    <path d="M60 0 L60 600 M150 0 L150 600 M240 0 L240 600" stroke="#2a3340" strokeWidth="2" />
                    <rect x="80" y="80" width="50" height="50" fill="#1a2230" rx="2" />
                    <rect x="170" y="180" width="60" height="40" fill="#1a2230" rx="2" />
                    <rect x="90" y="280" width="40" height="60" fill="#1a2230" rx="2" />
                    <rect x="180" y="390" width="50" height="50" fill="#1a2230" rx="2" />
                    <path className="route-path" d="M50 520 Q100 450 80 370 T140 220 Q200 160 180 80" />
                  </svg>

                  <motion.div className="courier" style={{ left: courierLeft, bottom: courierBottom }}>
                    <Icon icon={Bike} size={18} strokeWidth={2} />
                  </motion.div>
                  <div className="destination">
                    <Icon icon={Home} size={12} />
                  </div>

                  <div className="bottom-sheet">
                    <div className="handle" />
                    <h5>Commande n° AB-2847</h5>
                    <div className="sub">Depuis Chez Tantie Aminata · 3 articles</div>
                    <div className="courier-row">
                      <div className="avatar">I</div>
                      <div className="n">
                        <div className="name">Issouf Ouédraogo</div>
                        <div className="role">Ton coursier · 4.9 ★</div>
                      </div>
                      <div className="call">
                        <Icon icon={Phone} size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
