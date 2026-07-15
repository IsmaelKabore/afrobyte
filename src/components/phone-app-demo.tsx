"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Icon } from "./icon";
import { EASE } from "@/lib/motion";
import type { DemoStep } from "@/lib/demos";

const STEP_MS = 4200;

/** Démo app : les vraies captures défilent dans un cadre téléphone (autoplay + contrôles). */
export function PhoneAppDemo({ steps }: { steps: DemoStep[] }) {
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((n: number) => setIndex(((n % total) + total) % total), [total]);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setIndex((p) => (p + 1) % total), STEP_MS);
    return () => clearTimeout(t);
  }, [index, playing, total]);

  const step = steps[index];

  return (
    <div className="app-demo">
      <div className="app-demo-indicator">
        <div className="app-demo-num">{index + 1}</div>
        <div>
          <div className="app-demo-label">{step.label}</div>
          <div className="app-demo-sub">{step.sub}</div>
        </div>
      </div>

      <div className="app-demo-phone">
        <div className="app-demo-screen">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="app-demo-slide"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Image
                src={step.src}
                alt={`${step.label} — ${step.sub}`}
                fill
                sizes="320px"
                className="app-demo-img"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          {step.hint ? (
            <motion.div
              key={`hint-${index}`}
              className="app-demo-hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
            >
              {step.hint}
            </motion.div>
          ) : null}

          <div className="app-demo-island" aria-hidden />
        </div>
      </div>

      <div className="app-demo-controls">
        <button className="app-demo-btn" onClick={() => go(index - 1)} aria-label="Écran précédent">
          <Icon icon={ChevronLeft} size={18} />
        </button>
        <button
          className="app-demo-btn play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Lecture"}
        >
          <Icon icon={playing ? Pause : Play} size={18} />
        </button>
        <button className="app-demo-btn" onClick={() => go(index + 1)} aria-label="Écran suivant">
          <Icon icon={ChevronRight} size={18} />
        </button>
      </div>

      <div className="app-demo-dots">
        {steps.map((s, idx) => (
          <button
            key={s.src}
            className={idx === index ? "app-demo-dot active" : "app-demo-dot"}
            onClick={() => go(idx)}
            aria-label={`Aller à l'écran ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
