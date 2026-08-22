import {
  USER_ANDROID_PACKAGE,
  USER_APP_STORE,
  USER_PLAY_STORE,
} from "@/lib/stores";

/** Custom scheme UNIQUEMENT User (builds ≥ 7). */
export const USER_URL_SCHEME = "afrobite-user";
/** Legacy scheme encore présent sur d'anciens builds User. */
export const USER_URL_SCHEME_LEGACY = "afrobite";

function log(msg: string, extra?: Record<string, string>) {
  if (typeof console === "undefined") return;
  const tail = extra ? ` ${JSON.stringify(extra)}` : "";
  console.log(`[WEB_APP_OPEN] ${msg}${tail}`);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

/** Safari iOS (Smart App Banner Apple) — pas Chrome/Instagram/etc. */
export function isIOSSafariWithSmartBanner() {
  const ua = navigator.userAgent || "";
  if (!/iPhone|iPad|iPod/i.test(ua)) return false;
  if (/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua)) return false;
  if (/FBAN|FBAV|Instagram|Line\/|WhatsApp/i.test(ua)) return false;
  if (!/Safari/i.test(ua)) return false;
  return true;
}

/**
 * WhatsApp / Instagram / Facebook in-app browser.
 * Ces clients ouvrent souvent l'Universal Link ~1–2 s puis REPRENNENT
 * le WebView (bounce). Le custom scheme (comme le bouton Ouvrir) reste
 * dans l'app — c'est le chemin fiable ici.
 */
export function isInAppBrowserThatReclaims() {
  const ua = navigator.userAgent || "";
  return /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(ua);
}

export function storeUrlForDevice() {
  if (isIOS()) return USER_APP_STORE;
  if (isAndroid()) return USER_PLAY_STORE;
  return USER_APP_STORE;
}

/** Ouvre le store User UNIQUEMENT sur clic explicite (jamais via timer). */
export function openUserStore() {
  log("explicit store", { url: storeUrlForDevice() });
  window.location.href = storeUrlForDevice();
}

function navigateScheme(url: string) {
  log("navigate scheme", { url });
  window.location.href = url;
}

/**
 * Ouvre AfroBite USER sur /v/{videoId} (feed Découvertes).
 *
 * RÈGLE ANTI-BOUNCE :
 * - Aucun timer de fallback store / web après l'ouverture.
 * - Le store n'est ouvert que via `openUserStore()` (clic Télécharger).
 *
 * iOS : custom scheme en navigation directe (geste utilisateur OU reclaim WA).
 * Android : Intent HTTPS package User, sans S.browser_fallback_url JS.
 */
export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)", appTarget: "user" });

  if (!id) {
    openUserStore();
    return;
  }

  if (isAndroid()) {
    const intent =
      `intent://afrobite.app/v/${encodeURIComponent(id)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`;
    log("android intent", { package: USER_ANDROID_PACKAGE });
    window.location.href = intent;
    return;
  }

  const primary = `${USER_URL_SCHEME}://v/${encodeURIComponent(id)}`;
  log("ios scheme navigate — no store timer", {
    primary,
    safari: String(isIOSSafariWithSmartBanner()),
    inApp: String(isInAppBrowserThatReclaims()),
  });
  navigateScheme(primary);
}
