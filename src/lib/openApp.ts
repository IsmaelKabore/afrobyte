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
  if (/FBAN|FBAV|Instagram|Line\//i.test(ua)) return false;
  if (!/Safari/i.test(ua)) return false;
  return true;
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

/**
 * Tente un custom scheme SANS `window.location` (évite l'alerte Safari
 * « address is invalid » et évite de remplacer la page web).
 */
function trySchemeQuiet(url: string) {
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");
    iframe.src = url;
    document.body.appendChild(iframe);
    window.setTimeout(() => {
      try {
        iframe.remove();
      } catch {}
    }, 2000);
  } catch {}
}

/**
 * Ouvre AfroBite USER sur /v/{videoId} (feed Découvertes).
 *
 * RÈGLE ANTI-BOUNCE :
 * - Aucun timer de fallback store / web après l'ouverture.
 * - Si l'app s'ouvre, le navigateur NE DOIT PAS reprendre la main tout seul.
 * - Le store n'est ouvert que via `openUserStore()` (clic utilisateur).
 *
 * iOS Safari : laisser le Smart App Banner natif ; tenter les schemes en
 * silencieux pour les builds qui les supportent (pas de location.href).
 *
 * Android : Intent HTTPS package User (fallback store géré par le système
 * Intent lui-même, pas par un setTimeout JS).
 */
export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)", appTarget: "user" });

  if (!id) {
    openUserStore();
    return;
  }

  if (isAndroid()) {
    // Pas de S.browser_fallback_url agressif : si l'app s'ouvre, Chrome
    // ne doit pas rebondir vers le store 1–2 s plus tard.
    const intent =
      `intent://afrobite.app/v/${encodeURIComponent(id)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`;
    log("android intent", { package: USER_ANDROID_PACKAGE });
    window.location.href = intent;
    return;
  }

  // iOS (Safari + in-app browsers) :
  // - PAS de window.location = custom scheme (alerte / bounce)
  // - PAS de setTimeout → App Store (cause n°1 du retour web après 2 s)
  // - Schemes en iframe silencieux uniquement
  const primary = `${USER_URL_SCHEME}://v/${encodeURIComponent(id)}`;
  const legacy = `${USER_URL_SCHEME_LEGACY}://v/${encodeURIComponent(id)}`;
  log("ios quiet schemes only — no store timer", {
    primary,
    legacy,
    safari: String(isIOSSafariWithSmartBanner()),
  });
  trySchemeQuiet(primary);
  window.setTimeout(() => trySchemeQuiet(legacy), 350);
}
