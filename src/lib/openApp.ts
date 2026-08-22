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

export function isSnapchatBrowser() {
  return /Snapchat/i.test(navigator.userAgent || "");
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

/**
 * Snapchat (et certains WebViews) ignorent `location.href = myapp://`.
 * Un vrai clic sur `<a href>` marche plus souvent. On simule ça.
 */
function navigateScheme(url: string) {
  log("navigate scheme", { url, snapchat: String(isSnapchatBrowser()) });
  try {
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      try {
        a.remove();
      } catch {}
    }, 1500);
  } catch {
    window.location.href = url;
  }
  // Dernier recours Snapchat / iframe WebView
  try {
    if (isSnapchatBrowser()) {
      (window.top || window).location.href = url;
    }
  } catch {
    try {
      window.location.href = url;
    } catch {}
  }
}

/** Hrefs pour boutons <a> (Snapchat exige un vrai lien, pas un button+JS). */
export function hrefOpenVideo(videoId: string): string {
  const id = (videoId || "").trim();
  if (!id) return storeUrlForDevice();
  if (isAndroid()) {
    return (
      `intent://afrobite.app/v/${encodeURIComponent(id)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`
    );
  }
  // Legacy d'abord pour build 7 (parse afrobite:// + afrobite-user://).
  return `${USER_URL_SCHEME_LEGACY}://v/${encodeURIComponent(id)}`;
}

export function hrefOpenDish(restaurantId: string, dishId: string): string {
  const rid = (restaurantId || "").trim();
  const did = (dishId || "").trim();
  if (!rid || !did) return storeUrlForDevice();
  if (isAndroid()) {
    return (
      `intent://afrobite.app/plat/${encodeURIComponent(rid)}/${encodeURIComponent(did)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`
    );
  }
  return `${USER_URL_SCHEME_LEGACY}://plat/${encodeURIComponent(rid)}/${encodeURIComponent(did)}`;
}

export function hrefOpenRestaurant(restaurantId: string): string {
  const rid = (restaurantId || "").trim();
  if (!rid) return storeUrlForDevice();
  if (isAndroid()) {
    return (
      `intent://afrobite.app/r/${encodeURIComponent(rid)}` +
      `#Intent;scheme=https;package=${USER_ANDROID_PACKAGE};end`
    );
  }
  return `${USER_URL_SCHEME_LEGACY}://r/${encodeURIComponent(rid)}`;
}

export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)", appTarget: "user", kind: "video" });
  if (!id) {
    openUserStore();
    return;
  }
  const href = hrefOpenVideo(id);
  navigateScheme(href);
  if (isIOS() && !isAndroid()) {
    const user = `${USER_URL_SCHEME}://v/${encodeURIComponent(id)}`;
    if (user !== href) window.setTimeout(() => navigateScheme(user), 400);
  }
}

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
  const href = hrefOpenDish(rid, did);
  navigateScheme(href);
  if (isIOS()) {
    const user =
      `${USER_URL_SCHEME}://plat/${encodeURIComponent(rid)}/${encodeURIComponent(did)}`;
    if (user !== href) window.setTimeout(() => navigateScheme(user), 400);
  }
}

export function openAfroBiteUserRestaurant(restaurantId: string) {
  const rid = (restaurantId || "").trim();
  log("attempt", {
    restaurantId: rid || "(none)",
    appTarget: "user",
    kind: "restaurant",
  });
  if (!rid) {
    openUserStore();
    return;
  }
  const href = hrefOpenRestaurant(rid);
  navigateScheme(href);
  if (isIOS()) {
    const user = `${USER_URL_SCHEME}://r/${encodeURIComponent(rid)}`;
    if (user !== href) window.setTimeout(() => navigateScheme(user), 400);
  }
}
