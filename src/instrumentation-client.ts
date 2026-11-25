/**
 * PostHog sur afrobite.app — même projet que l'app (EU, « AfroBite App »).
 *
 * - Chargé APRÈS l'affichage de la page (import dynamique quand le navigateur est
 *   libre) : le site reste aussi rapide qu'avant sur les connexions lentes.
 * - Pages vues (y compris la navigation interne) + clics vers l'App Store / le
 *   Play Store (`store_click`), lus par la page « Dans l'app » du Dashboard.
 * - Pas d'enregistrement d'écran, pas de profil personne pour les visiteurs
 *   anonymes, rien dans les cookies (stockage local du navigateur).
 */
const POSTHOG_KEY = "phc_qkT3H5oiXGY2h5jLNurUWtXoWFVfNnA6HM2rZL3ziGQQ"; // clé publique du projet
const POSTHOG_HOST = "https://eu.i.posthog.com";

function storeOf(href: string): "apple" | "google" | null {
  if (href.includes("apps.apple.com")) return "apple";
  if (href.includes("play.google.com")) return "google";
  return null;
}

function start() {
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: "2025-05-24", // pages vues à chaque changement d'URL
      person_profiles: "identified_only",
      persistence: "localStorage",
      disable_session_recording: true,
      autocapture: false,
    });
    document.addEventListener(
      "click",
      (event) => {
        const link = (event.target as Element | null)?.closest?.("a[href]");
        const href = link?.getAttribute("href") ?? "";
        const store = storeOf(href);
        if (store) posthog.capture("store_click", { store, $pathname: window.location.pathname });
      },
      { capture: true },
    );
  });
}

if (typeof window !== "undefined") {
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
  if (idle) idle(start, { timeout: 4000 });
  else window.setTimeout(start, 1500);
}
