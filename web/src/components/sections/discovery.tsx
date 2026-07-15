"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { DISHES } from "@/lib/content";
import { Icon } from "@/components/icon";

const TOTAL = DISHES.length;

/**
 * Découverte — feed vidéo vertical (type TikTok) épinglé au scroll.
 * Le scroll de la section scrube le feed ; la vidéo active joue, les
 * autres se mettent en pause ; le pager suit. Piloté par Framer Motion.
 */
export function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackY = useTransform(scrollYProgress, [0, 1], ["0%", `-${(TOTAL - 1) * 25}%`]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.round(v * (TOTAL - 1))));
    if (i === active) return;
    setActive(i);
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === i) void vid.play?.().catch(() => {});
      else vid.pause?.();
    });
  });

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
          <div className="phone" id="phone-discovery">
            <div className="screen">
              <div className="status-bar">
                <span>9:41</span>
                <span>•••</span>
              </div>
              <div className="feed">
                <motion.div className="feed-track" style={{ y: trackY }}>
                  {DISHES.map((d, i) => (
                    <div
                      key={d.name}
                      className={
                        "feed-item" +
                        (i === active ? " is-active" : Math.abs(i - active) === 1 ? " is-neighbor" : "")
                      }
                    >
                      <div className="dish-visual" style={{ background: d.bg }}>
                        <video
                          ref={(el) => {
                            videoRefs.current[i] = el;
                          }}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          poster={d.poster}
                          autoPlay={i === 0}
                        >
                          <source src={d.video} type="video/mp4" />
                        </video>
                      </div>
                      <div className="actions-side">
                        <div className="action-ico heart">
                          <Icon icon={Heart} size={16} />
                        </div>
                        <div className="action-ico">
                          <Icon icon={Bookmark} size={16} />
                        </div>
                        <div className="action-ico">
                          <Icon icon={Share2} size={16} />
                        </div>
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
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-pager" aria-hidden>
          {DISHES.map((d, i) => (
            <div key={d.name} className={i === active ? "dot active" : "dot"} />
          ))}
        </div>
      </div>
    </section>
  );
}
