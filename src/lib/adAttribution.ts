import { USER_APP_STORE, USER_PLAY_STORE } from "@/lib/stores";

/**
 * Attribution des pubs sans SDK : la source (utm_source, ou fbclid / ttclid ajoutés
 * automatiquement par Facebook / TikTok) est transmise aux stores.
 * - Google Play : `referrer=utm_source=…` → Play Console › Acquisition › installations
 *   par campagne.
 * - App Store : `ct=` (+ `pt=` jeton fournisseur App Store Connect) → App Analytics ›
 *   Sources › Campagnes.
 */
export type AdSource = { source: string; campaign: string | null };

const KEY = "afb_ad_source";
const APPLE_PROVIDER_TOKEN = process.env.NEXT_PUBLIC_APPSTORE_PROVIDER_TOKEN || "";

const clean = (v: string | null) => (v ? v.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40) : "");

export function readAdSource(): AdSource | null {
  try {
    const q = new URLSearchParams(window.location.search);
    const source =
      clean(q.get("utm_source")) || (q.get("fbclid") ? "facebook" : q.get("ttclid") ? "tiktok" : "");
    if (source) {
      const found = { source, campaign: clean(q.get("utm_campaign")) || null };
      sessionStorage.setItem(KEY, JSON.stringify(found));
      return found;
    }
    const saved = sessionStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as AdSource) : null;
  } catch {
    return null;
  }
}

export function playStoreUrl(ad: AdSource | null): string {
  if (!ad) return USER_PLAY_STORE;
  const referrer = new URLSearchParams({
    utm_source: ad.source,
    utm_medium: "paid",
    ...(ad.campaign ? { utm_campaign: ad.campaign } : {}),
  }).toString();
  return `${USER_PLAY_STORE}&referrer=${encodeURIComponent(referrer)}`;
}

export function appStoreUrl(ad: AdSource | null): string {
  if (!ad) return USER_APP_STORE;
  const ct = [ad.source, ad.campaign].filter(Boolean).join("-").slice(0, 40);
  const params = new URLSearchParams({ ct, mt: "8", ...(APPLE_PROVIDER_TOKEN ? { pt: APPLE_PROVIDER_TOKEN } : {}) });
  return `${USER_APP_STORE}?${params.toString()}`;
}
