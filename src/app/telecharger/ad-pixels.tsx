"use client";

import Script from "next/script";

/**
 * Pixels Meta et TikTok de la page d'atterrissage des pubs. Ils ne se chargent que si
 * leur identifiant est configuré sur Vercel (NEXT_PUBLIC_META_PIXEL_ID,
 * NEXT_PUBLIC_TIKTOK_PIXEL_ID). Aucun compte développeur nécessaire : les pixels se
 * créent dans le Gestionnaire d'événements Meta / TikTok Ads Manager.
 */
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";

type Fbq = (...args: unknown[]) => void;
type Ttq = { track: (event: string, data?: Record<string, unknown>) => void };

/** Clic sur un bouton store : « Lead » côté Meta, « ClickButton » côté TikTok. */
export function trackStoreClick(store: "app_store" | "google_play") {
  try {
    const w = window as unknown as { fbq?: Fbq; ttq?: Ttq };
    w.fbq?.("track", "Lead", { content_name: store });
    w.fbq?.("trackCustom", "StoreClick", { store });
    w.ttq?.track("ClickButton", { content_name: store });
  } catch {
    /* best-effort */
  }
}

export function AdPixels() {
  return (
    <>
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}
    </>
  );
}
