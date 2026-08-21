import {
  USER_ANDROID_PACKAGE,
  USER_APP_STORE,
  USER_PLAY_STORE,
} from "@/lib/stores";

/** Custom scheme UNIQUEMENT User — jamais partagé avec Resto/Livreur. */
export const USER_URL_SCHEME = "afrobite-user";

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
  // WebView générique (WKWebView in-app) : souvent sans "Safari"
  if (!/Safari/i.test(ua)) return false;
  return true;
}

export function storeUrlForDevice() {
  if (isIOS()) return USER_APP_STORE;
  if (isAndroid()) return USER_PLAY_STORE;
  return USER_APP_STORE;
}

/**
 * Ouvre AfroBite USER sur /v/{videoId}.
 * - Android : Intent explicite package USER.
 * - iOS : scheme afrobite-user:// (Resto/Livreur ne le déclarent PAS).
 * Fallback store annulé dès hidden/blur/pagehide.
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
  }, 2000);

  const scheme = `${USER_URL_SCHEME}://v/${encodeURIComponent(id)}`;
  log("ios scheme", { scheme: `${USER_URL_SCHEME}://v/${id}` });
  window.location.href = scheme;
}
