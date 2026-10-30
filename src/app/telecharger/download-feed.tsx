"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bookmark, Clock, Heart, House, MessageSquareMore, Minus, Plus, ReceiptText, Send, ShoppingBag, Star, User, Zap, type LucideIcon } from "lucide-react";
import { ensurePlaying, useAutoplayInView, usePrefersReducedMotion } from "@/lib/video-autoplay";
import { FEED_CLIPS, type FeedClip } from "./feed-clips";

const SLIDE_MS = 600;
/** Au-delà, l'app coupe la description et affiche « voir plus ». */
const DESCRIPTION_MAX = 118;
/** La première vidéo est répétée (image fixe) en fin de piste : on reboucle sans remonter visiblement tout le feed. */
const ITEMS = [...FEED_CLIPS, FEED_CLIPS[0]];
const LAST = FEED_CLIPS.length;

/**
 * Téléphone qui reproduit l'écran Découvertes de l'app : de vraies vidéos de
 * restaurants (feed-clips.ts) qui défilent seules, une par une, avec l'interface
 * de l'app par-dessus (mêmes mesures, en points iPhone : --pt = largeur / 393).
 */
export function DownloadFeed() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const phone = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const visible = useAutoplayInView(phone, () => videos.current[indexRef.current], { enabled: !reducedMotion });

  // Défilement : chaque clip joue jusqu'au bout, puis on passe au suivant. Sur un
  // réseau lent la vidéo met du temps à démarrer : on attend sa vraie fin plutôt
  // qu'un minuteur. Filet : si elle n'a jamais démarré (lecture bloquée), on
  // avance quand même sur l'image fixe.
  useEffect(() => {
    if (reducedMotion) return;
    if (index === LAST) {
      // Arrivé sur la copie de la première vidéo : on revient à 0 sans animation.
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, SLIDE_MS);
      return () => clearTimeout(t);
    }
    const video = videos.current[index];
    const next = () => {
      setAnimate(true);
      setIndex((i) => i + 1);
    };
    video?.addEventListener("ended", next);
    const fallback = setTimeout(() => {
      if (visible.current && (!video || video.currentTime === 0)) next();
    }, FEED_CLIPS[index].durationMs + 2500);
    return () => {
      video?.removeEventListener("ended", next);
      clearTimeout(fallback);
    };
  }, [index, reducedMotion, visible]);

  useEffect(() => {
    indexRef.current = index;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && !reducedMotion && visible.current) {
        v.currentTime = 0;
        ensurePlaying(v);
      } else v.pause();
    });
  }, [index, reducedMotion, visible]);

  return (
    <div
      ref={phone}
      className="phone dl-phone"
      role="img"
      aria-label="Aperçu de l'app AfroBite : des plats de restaurants d'Ouagadougou en vidéo, qu'on ajoute au panier"
    >
      <div className="screen dl-app" aria-hidden>
        <div
          className="dl-track"
          style={{
            transform: `translateY(-${(index * 100) / ITEMS.length}%)`,
            transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)` : "none",
            height: `${ITEMS.length * 100}%`,
          }}
        >
          {ITEMS.map((clip, i) => (
            <FeedItem key={i} clip={clip}>
              {i < LAST ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  muted
                  playsInline
                  // Seuls la vidéo en cours et la suivante se chargent.
                  preload={i === index || i === (index + 1) % LAST ? "auto" : "none"}
                  poster={clip.poster}
                  src={clip.video}
                />
              ) : (
                <Image className="dl-still" src={clip.poster} alt="" fill sizes="330px" unoptimized />
              )}
            </FeedItem>
          ))}
        </div>
        <StatusBar />
        <div className="dl-trend">
          <Zap strokeWidth={2} />
          Tendances
        </div>
        <NavBar />
        <span className="dl-island" />
        <span className="dl-home-bar" />
      </div>
    </div>
  );
}

function FeedItem({ clip, children }: { clip: FeedClip; children: ReactNode }) {
  const long = clip.description.length > DESCRIPTION_MAX;
  const description = long ? `${clip.description.slice(0, DESCRIPTION_MAX).trimEnd()} ...` : clip.description;
  return (
    <div className="dl-item" style={{ height: `${100 / ITEMS.length}%` }}>
      {children}
      <div className="dl-shade" />

      <div className="dl-actions">
        <div className="dl-avatar">
          <Image src={clip.logo} alt="" width={48} height={48} unoptimized />
          <span className="dl-follow">
            <Plus strokeWidth={2.5} />
          </span>
        </div>
        {clip.rating ? (
          <div className="dl-rating">
            <Star strokeWidth={2} />
            {clip.rating.toFixed(1)}
          </div>
        ) : null}
        <Action icon={Heart} label={clip.likes} />
        <Action icon={MessageSquareMore} label={clip.comments} />
        <Action icon={Send} label={clip.shares} />
        <Action icon={Bookmark} />
      </div>

      <div className="dl-info">
        <div className="dl-name">{clip.restaurant}</div>
        <p className="dl-desc">{description}</p>
        {long ? <div className="dl-more">voir plus</div> : null}
        <div className="dl-chips">
          <span className="dl-chip">
            <Clock strokeWidth={2} />
            {clip.eta}
          </span>
          <span className="dl-chip">
            <i className="dl-dot" />
            Ouvert
          </span>
          <span className="dl-chip">
            <i className="dl-dot" />
            Livraison
          </span>
        </div>
      </div>

      <div className="dl-card">
        <Image className="dl-card-img" src={clip.dishImage} alt="" width={56} height={56} unoptimized />
        <div className="dl-card-text">
          <div className="dl-card-name">{clip.dish}</div>
          <div className="dl-card-price">{clip.price}</div>
        </div>
        <div className="dl-qty">
          <span className="dl-qty-btn is-off">
            <Minus strokeWidth={2} />
          </span>
          <span className="dl-qty-n">0</span>
          <span className="dl-qty-btn">
            <Plus strokeWidth={2} />
          </span>
        </div>
        <span className="dl-add">
          <ShoppingBag strokeWidth={2} />
          Ajouter
        </span>
      </div>
    </div>
  );
}

function Action({ icon: Icon, label }: { icon: LucideIcon; label?: number }) {
  return (
    <div className="dl-act">
      <Icon strokeWidth={1.5} />
      {label !== undefined ? <span>{label}</span> : null}
    </div>
  );
}

/** Barre d'état iOS (heure, réseau, Wi-Fi, batterie). */
function StatusBar() {
  return (
    <div className="dl-status">
      <span className="dl-time">9:41</span>
      <span className="dl-sys">
        <svg viewBox="0 0 18 12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12">
          <path d="M8 11.5 5.9 9.4a3 3 0 0 1 4.2 0Z" />
          <path d="M3.8 7.3a6 6 0 0 1 8.4 0l-1.4 1.4a4 4 0 0 0-5.6 0Z" />
          <path d="M1.6 5.1a9.2 9.2 0 0 1 12.8 0L13 6.5a7.2 7.2 0 0 0-10 0Z" />
        </svg>
        <svg viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" />
          <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

const NAV: { label: string; icon?: LucideIcon }[] = [
  { label: "Découvertes" },
  { label: "Accueil", icon: House },
  { label: "Panier", icon: ShoppingBag },
  { label: "Commandes", icon: ReceiptText },
  { label: "Profil", icon: User },
];

/** Barre de navigation de l'app, transparente sur Découvertes (onglet actif). */
function NavBar() {
  return (
    <div className="dl-nav">
      {NAV.map(({ label, icon: Icon }) => (
        <div key={label} className={Icon ? "dl-nav-item" : "dl-nav-item is-active"}>
          <span className="dl-nav-pill">
            {Icon ? (
              <Icon strokeWidth={1.6} />
            ) : (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M10 8.3v7.4c0 .5.6.8 1 .5l5.2-3.7c.4-.3.4-.8 0-1.1L11 7.8c-.4-.3-1 0-1 .5Z" fill="#0a0a0a" />
              </svg>
            )}
          </span>
          {label}
        </div>
      ))}
    </div>
  );
}
