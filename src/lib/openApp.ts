import {
  USER_ANDROID_PACKAGE,
  USER_APP_STORE,
  USER_PLAY_STORE,
} from "@/lib/stores";

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

export function storeUrlForDevice() {
  if (isIOS()) return USER_APP_STORE;
  if (isAndroid()) return USER_PLAY_STORE;
  return USER_APP_STORE;
}

/**
 * Ouvre AfroBite USER sur /v/{videoId}.
 * - Android : Intent explicite vers le package USER (jamais Resto/Livreur).
 * - iOS : scheme afrobite://v/{id} (seule l'app USER doit le gérer pour /v).
 * Fallback store UNIQUEMENT si la page reste visible (app non ouverte).
 * Dès que la page est hidden / blur / pagehide → annule le fallback.
 * JAMAIS de navigation vers la même Universal Link (évite app→web→store).
 */
export function openAfroBiteUser(videoId: string) {
  const id = (videoId || "").trim();
  log("attempt", { videoId: id || "(none)" });

  if (!id) {
    log("fallback store", { reason: "missing_videoId" });
    window.location.href = storeUrlForDevice();
    return;
  }

  // Android Chrome Intent → package USER uniquement + fallback store intégré.
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

  // Si l'app s'ouvre, la page devient hidden rapidement → on annule.
  // Sinon (app absente), on envoie au store après ~2 s.
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

  // Custom scheme USER — ne pas recharger https://afrobite.app/v/... (même URL).
  const scheme = `afrobite://v/${encodeURIComponent(id)}`;
  log("ios scheme", { scheme: `afrobite://v/${id}` });
  window.location.href = scheme;
}
