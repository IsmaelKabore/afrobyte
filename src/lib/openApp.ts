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

/** Safari iOS (Smart App Banner Apple) — pas Chrome / in-app browsers. */
export function isIOSSafariWithSmartBanner() {
  const ua = navigator.userAgent || "";
  if (!/iPhone|iPad|iPod/i.test(ua)) return false;
  if (/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua)) return false;
  if (/FBAN|FBAV|Instagram|Line\/|WhatsApp|Snapchat/i.test(ua)) return false;
  if (!/Safari/i.test(ua)) return false;
  return true;
}

/**
 * In-app browsers that often open Universal Links briefly then reclaim WebView.
 */
export function isInAppBrowserThatReclaims() {
  const ua = navigator.userAgent || "";
  return /WhatsApp|FBAN|FBAV|Instagram|Line\/|Snapchat/i.test(ua);
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
 * Pas de timer → store (anti-bounce).
 */
export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)", appTarget: "user", kind: "video" });

  if (!id) {
    openUserStore();
    return;
  }

  if (isAndroid()) {
    const intent =
      `intent://afrobite.app/v/${encodeURIComponent(id)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`;
    log("android intent", { package: USER_ANDROID_PACKAGE, kind: "video" });
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

/**
 * Ouvre AfroBite USER sur le plat /plat/{restaurantId}/{dishId}.
 * Scheme User-only (builds ≥ 7). Pas de timer store.
 */
export function openAfroBiteUserDish(restaurantId: string, dishId: string) {
  const rid = (restaurantId || "").trim();
  const did = (dishId || "").trim();
  log("attempt", {
    restaurantId: rid || "(none)",
    dishId: did || "(none)",
    appTarget: "user",
    kind: "dish",
  });

  if (!rid || !did) {
    openUserStore();
    return;
  }

  if (isAndroid()) {
    const intent =
      `intent://afrobite.app/plat/${encodeURIComponent(rid)}/${encodeURIComponent(did)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`;
    log("android intent", { package: USER_ANDROID_PACKAGE, kind: "dish" });
    window.location.href = intent;
    return;
  }

  const primary =
    `${USER_URL_SCHEME}://plat/${encodeURIComponent(rid)}/${encodeURIComponent(did)}`;
  log("ios dish scheme navigate — no store timer", {
    primary,
    inApp: String(isInAppBrowserThatReclaims()),
  });
  navigateScheme(primary);
}
