"use client";

import { useEffect, useState } from "react";
import { SiApple, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { USER_APP_STORE, USER_PLAY_STORE } from "@/lib/stores";

type Os = "ios" | "android" | "other";

/** Boutons App Store / Google Play ; celui du téléphone du visiteur passe en premier. */
export function DownloadButtons() {
  const [os, setOs] = useState<Os>("other");

  useEffect(() => {
    const ua = navigator.userAgent;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- détection du système, côté client uniquement
    setOs(/iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "other");
  }, []);

  const apple = (
    <a key="ios" className="store-badge dl-badge" href={USER_APP_STORE} target="_blank" rel="noopener noreferrer">
      <SiApple color="currentColor" aria-hidden />
      <span>
        <small>Télécharger sur</small>
        <strong>App Store</strong>
      </span>
    </a>
  );
  const play = (
    <a key="android" className="store-badge dl-badge" href={USER_PLAY_STORE} target="_blank" rel="noopener noreferrer">
      <SiGoogleplay color="currentColor" aria-hidden />
      <span>
        <small>Disponible sur</small>
        <strong>Google Play</strong>
      </span>
    </a>
  );

  return <div className="store-badges dl-badges">{os === "android" ? [play, apple] : [apple, play]}</div>;
}
