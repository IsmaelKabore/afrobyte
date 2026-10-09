"use client";

import { useEffect, useRef, useState } from "react";
import { DISHES } from "@/lib/content";

const STEP_MS = 3000;
const SLIDE_MS = 600;
/** La première vidéo est répétée en fin de piste : on boucle sans remonter visiblement tout le feed. */
const ITEMS = [...DISHES, DISHES[0]];

/** Téléphone dont le feed vidéo défile tout seul (une vidéo toutes les 3 s), comme dans l'app. */
export function DownloadFeed() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [index]);

  // Arrivé sur la copie de la première vidéo : on revient à 0 sans animation.
  useEffect(() => {
    if (index !== DISHES.length) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index || (index === DISHES.length && i === 0)) void v.play().catch(() => {});
      else v.pause();
    });
  }, [index]);

  return (
    <div className="phone dl-phone">
      <div className="screen">
        <div className="status-bar">
          <span>9:41</span>
          <span>•••</span>
        </div>
        <div className="feed">
          <div
            className="dl-track"
            style={{
              transform: `translateY(-${(index * 100) / ITEMS.length}%)`,
              transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)` : "none",
              height: `${ITEMS.length * 100}%`,
            }}
          >
            {ITEMS.map((d, i) => (
              <div key={`${d.name}-${i}`} className="feed-item is-active" style={{ height: `${100 / ITEMS.length}%` }}>
                <div className="dish-visual" style={{ background: d.bg }}>
                  <video
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    muted
                    loop
                    playsInline
                    autoPlay={i === 0}
                    preload={i < 2 ? "auto" : "metadata"}
                    poster={d.poster}
                  >
                    <source src={d.video} type="video/mp4" />
                  </video>
                </div>
                <div className="info">
                  <h4>{d.name}</h4>
                  <div className="meta">
                    {d.vendor}
                    <span className="dot" />
                    {d.rating} ★<span className="dot" />
                    {d.time}
                  </div>
                  <div className="price-row">
                    <div className="price">{d.price}</div>
                    <div className="add-btn">Ajouter +</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
