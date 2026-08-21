import {
  USER_ANDROID_PACKAGE,
  USER_APP_STORE,
  USER_PLAY_STORE,
} from "@/lib/stores";

/** Custom scheme UNIQUEMENT User (nouveaux builds). */
export const USER_URL_SCHEME = "afrobite-user";
/** Legacy scheme encore présent sur les builds User TestFlight déjà installés. */
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

/** Safari iOS (affiche le Smart App Banner Apple) — pas Chrome/Instagram/etc. */
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

/**
 * Tente un custom scheme SANS `window.location` (évite l'alerte Safari
 * « address is invalid » quand le scheme n'est pas encore enregistré).
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
    }, 1500);
  } catch {}
}

/**
 * Ouvre AfroBite USER sur la vidéo /v/{videoId} (feed Découvertes).
 *
 * iOS Safari (Smart Banner visible) :
 *   → App Store User (bouton OPEN natif si l'app est installée).
 *   Ne JAMAIS faire location=afrobite-user:// (alerte « address is invalid »
 *   tant que le build User n'a pas le nouveau scheme).
 *
 * Autres iOS (Instagram, etc.) :
 *   → tente afrobite-user:// puis afrobite:// en iframe silencieux,
 *     puis App Store si la page reste visible.
 *
 * Android :
 *   → Intent HTTPS vers package com.afrobite.android uniquement.
 */
export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)", appTarget: "user" });

  if (!id) {
    log("fallback store", { reason: "missing_videoId" });
    window.location.href = storeUrlForDevice();
    return;
  }

  if (isAndroid()) {
    const fallback = encodeURIComponent(USER_PLAY_STORE);
    const intent =
      `intent://afrobite.app/v/${encodeURIComponent(id)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${fallback};end`;
    log("android intent", { package: USER_ANDROID_PACKAGE });
    window.location.href = intent;
    return;
  }

  // Safari iOS : Universal Links ne se re-déclenchent PAS depuis le même domaine.
  // Custom scheme non enregistré → alerte fatale. On envoie vers l'App Store
  // AfroBite USER (id6759185659) : si installée, iOS propose « Ouvrir ».
  if (isIOSSafariWithSmartBanner()) {
    log("ios safari → app store user", { store: USER_APP_STORE });
    window.location.href = USER_APP_STORE;
    return;
  }

  let settled = false;
  const cancel = (reason: string) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("blur", onBlur);
    log("fallback cancelled", { reason });
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      log("page hidden");
      cancel("visibilitychange");
    }
  };
  const onPageHide = () => cancel("pagehide");
  const onBlur = () => cancel("blur");

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("blur", onBlur);

  const timer = window.setTimeout(() => {
    if (settled) return;
    if (document.visibilityState !== "visible") {
      cancel("already_hidden");
      return;
    }
    settled = true;
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("blur", onBlur);
    log("fallback store", { reason: "timeout_visible" });
    window.location.href = storeUrlForDevice();
  }, 2200);

  // Nouveaux builds User d'abord, puis legacy (builds TestFlight déjà installés).
  const primary = `${USER_URL_SCHEME}://v/${encodeURIComponent(id)}`;
  const legacy = `${USER_URL_SCHEME_LEGACY}://v/${encodeURIComponent(id)}`;
  log("ios quiet schemes", { primary, legacy });
  trySchemeQuiet(primary);
  window.setTimeout(() => {
    if (!settled) trySchemeQuiet(legacy);
  }, 400);
}
