import { customerPriceLabel, customerPriceShort } from "@/lib/pricing";

// Lecture PUBLIQUE d'une vidéo AfroBite via l'API REST Firestore.
// La collection `videos` est en lecture publique (allow read: if true) : on ne
// lit qu'UN seul document et on n'expose QUE des champs publics (aucun userId,
// numéro, orderId, token…). Aucun service account, aucun secret côté site.

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodsocialnetwork-74a07";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs";

export interface PublicVideo {
  id: string;
  dishName: string | null;
  restaurantName: string | null;
  price: number | null;
  caption: string | null;
  muxPlaybackId: string | null;
  hlsUrl: string | null;
  posterUrl: string | null;
  /** Image Mux brute (ne pas exposer en og:image — robots noindex). */
  ogImageUrl: string | null;
  restaurantAvatar: string | null;
  /** Si clone démo → UUID source à partager / rediriger. */
  demoSourceVideoId: string | null;
}

type FsValue = Record<string, unknown>;

function fv(field: FsValue | undefined): string | number | boolean | null {
  if (!field) return null;
  if ("stringValue" in field) return field.stringValue as string;
  if ("integerValue" in field) return Number(field.integerValue);
  if ("doubleValue" in field) return field.doubleValue as number;
  if ("booleanValue" in field) return field.booleanValue as boolean;
  return null;
}

const ID_RE = /^[a-zA-Z0-9-]{6,60}$/;

export async function fetchVideo(videoId: string): Promise<PublicVideo | null> {
  if (!ID_RE.test(videoId)) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/videos/` +
    `${encodeURIComponent(videoId)}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const doc = (await res.json()) as { fields?: Record<string, FsValue> };
    if (!doc.fields) return null;
    const f = doc.fields;
    const playbackId = fv(f.muxPlaybackId) as string | null;
    const explicitPoster = fv(f.thumbnailUrl) as string | null;
    return {
      id: videoId,
      dishName: fv(f.dishName) as string | null,
      restaurantName: fv(f.restaurantName) as string | null,
      price: fv(f.price) as number | null,
      caption: fv(f.caption) as string | null,
      muxPlaybackId: playbackId,
      hlsUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null,
      posterUrl:
        explicitPoster ||
        (playbackId ? `https://image.mux.com/${playbackId}/thumbnail.jpg` : null),
      ogImageUrl: playbackId
        ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200&height=1200&fit_mode=smartcrop&time=1`
        : explicitPoster,
      restaurantAvatar: (fv(f.userPhotoUrl) as string | null) || null,
      demoSourceVideoId: (fv(f.demoSourceVideoId) as string | null) || null,
    };
  } catch {
    return null;
  }
}

/** Image OG servie depuis afrobite.app (proxy) — WhatsApp-compatible. */
export function publicOgImageUrl(videoId: string): string {
  return `https://afrobite.app/api/og/${encodeURIComponent(videoId)}`;
}

/** Prix client (base Firestore + 5 %, arrondi 100). */
export function priceLabel(price: number | null): string | null {
  return customerPriceLabel(price);
}

export function priceShort(price: number | null): string | null {
  return customerPriceShort(price);
}
