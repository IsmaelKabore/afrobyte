// Lecture PUBLIQUE d'un restaurant AfroBite via l'API REST Firestore.
// `restaurants/{id}` : allow read: if true.

const PROJECT =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodsocialnetwork-74a07";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs";

export interface PublicRestaurant {
  id: string;
  name: string | null;
  description: string | null;
  city: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  isActive: boolean;
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

const ID_RE = /^[a-zA-Z0-9_-]{8,100}$/;

export async function fetchRestaurant(
  restaurantId: string,
): Promise<PublicRestaurant | null> {
  if (!ID_RE.test(restaurantId)) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/restaurants/` +
    `${encodeURIComponent(restaurantId)}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const doc = (await res.json()) as { fields?: Record<string, FsValue> };
    const f = doc.fields;
    if (!f) return null;
    return {
      id: restaurantId,
      name: (fv(f.name) as string | null) || null,
      description: (fv(f.description) as string | null) || null,
      city: (fv(f.city) as string | null) || null,
      logoUrl: (fv(f.logoUrl) as string | null) || null,
      coverUrl: (fv(f.coverUrl) as string | null) || null,
      isActive: fv(f.isActive) !== false,
    };
  } catch {
    return null;
  }
}

export function publicRestaurantOgImageUrl(restaurantId: string): string {
  return `https://afrobite.app/api/og/r/${encodeURIComponent(restaurantId)}`;
}
