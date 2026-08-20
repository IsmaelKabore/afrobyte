// Lecture PUBLIQUE d'une vidéo AfroBite via l'API REST Firestore.
// La collection `videos` est en lecture publique (allow read: if true) : on ne
// lit qu'UN seul document et on n'expose QUE des champs publics (aucun userId,
// numéro, orderId, token…). Aucun service account, aucun secret côté site.

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'foodsocialnetwork-74a07';
// Clé API web Firebase = clé publique (restreinte par referrer côté console).
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs';

export interface PublicVideo {
  id: string;
  dishName: string | null;
  restaurantName: string | null;
  price: number | null;
  caption: string | null;
  muxPlaybackId: string | null;
  hlsUrl: string | null;
  posterUrl: string | null;
  /** Image OG optimisée réseaux sociaux (carré 1200, frame nette à ~1s). */
  ogImageUrl: string | null;
}

type FsValue = Record<string, unknown>;

function fv(field: FsValue | undefined): string | number | boolean | null {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue as string;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue as number;
  if ('booleanValue' in field) return field.booleanValue as boolean;
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
      // Aperçu social : carré 1200×1200, recadré intelligemment sur le plat,
      // frame prise à ~1 s (évite une première image noire).
      ogImageUrl: playbackId
        ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200&height=1200&fit_mode=smartcrop&time=1`
        : explicitPoster,
    };
  } catch {
    return null;
  }
}

export function priceLabel(price: number | null): string | null {
  if (price == null || Number.isNaN(price)) return null;
  return `${Math.round(price)} FCFA`;
}
