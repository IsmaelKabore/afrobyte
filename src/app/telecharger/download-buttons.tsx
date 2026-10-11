"use client";

import { useEffect, useState } from "react";
import { SiApple, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { appStoreUrl, playStoreUrl, readAdSource, type AdSource } from "@/lib/adAttribution";
import { trackStoreClick } from "./ad-pixels";

type Os = "ios" | "android" | "other";

/** Boutons App Store / Google Play ; celui du téléphone du visiteur passe en premier. */
export function DownloadButtons() {
  const [os, setOs] = useState<Os>("other");
  const [ad, setAd] = useState<AdSource | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- détection du système et de la pub d'origine, côté client uniquement
    setOs(/iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "other");
    setAd(readAdSource());
  }, []);

  const apple = (
    <a key="ios" className="store-badge dl-badge" href={appStoreUrl(ad)} target="_blank" rel="noopener noreferrer" onClick={() => trackStoreClick("app_store")}>
      <SiApple color="currentColor" aria-hidden />
      <span>
        <small>Télécharger sur</small>
        <strong>App Store</strong>
      </span>
    </a>
  );
  const play = (
    <a key="android" className="store-badge dl-badge" href={playStoreUrl(ad)} target="_blank" rel="noopener noreferrer" onClick={() => trackStoreClick("google_play")}>
      <SiGoogleplay color="currentColor" aria-hidden />
      <span>
        <small>Disponible sur</small>
        <strong>Google Play</strong>
      </span>
    </a>
  );

  return <div className="store-badges dl-badges">{os === "android" ? [play, apple] : [apple, play]}</div>;
}
