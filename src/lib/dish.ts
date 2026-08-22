import { customerPriceLabel } from "@/lib/pricing";

// Lecture PUBLIQUE d'un plat AfroBite via l'API REST Firestore.
// `restaurants/{id}` et `restaurants/{id}/dishes/{dishId}` : allow read: if true.

const PROJECT =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodsocialnetwork-74a07";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs";

export interface PublicDish {
  restaurantId: string;
  dishId: string;
  name: string | null;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  isAvailable: boolean;
  restaurantName: string | null;
  restaurantLogoUrl: string | null;
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

async function fetchDoc(path: string): Promise<Record<string, FsValue> | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/` +
    `${path}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const doc = (await res.json()) as { fields?: Record<string, FsValue> };
    return doc.fields ?? null;
  } catch {
    return null;
  }
}

export async function fetchDish(
  restaurantId: string,
  dishId: string,
): Promise<PublicDish | null> {
  if (!ID_RE.test(restaurantId) || !ID_RE.test(dishId)) return null;

  const [dishFields, restoFields] = await Promise.all([
    fetchDoc(
      `restaurants/${encodeURIComponent(restaurantId)}/dishes/${encodeURIComponent(dishId)}`,
    ),
    fetchDoc(`restaurants/${encodeURIComponent(restaurantId)}`),
  ]);
  if (!dishFields) return null;

  return {
    restaurantId,
    dishId,
    name: (fv(dishFields.name) as string | null) || null,
    description: (fv(dishFields.description) as string | null) || null,
    price: fv(dishFields.price) as number | null,
    imageUrl: (fv(dishFields.imageUrl) as string | null) || null,
    isAvailable: fv(dishFields.isAvailable) !== false,
    restaurantName: restoFields
      ? ((fv(restoFields.name) as string | null) || null)
      : null,
    restaurantLogoUrl: restoFields
      ? ((fv(restoFields.logoUrl) as string | null) || null)
      : null,
  };
}

/** Image OG servie depuis afrobite.app (proxy) — Snapchat / WhatsApp. */
export function publicDishOgImageUrl(
  restaurantId: string,
  dishId: string,
): string {
  return (
    `https://afrobite.app/api/og/plat/` +
    `${encodeURIComponent(restaurantId)}/${encodeURIComponent(dishId)}`
  );
}

/** Prix client (base Firestore + 5 %, arrondi 100) — jamais le prix resto brut. */
export function dishPriceLabel(price: number | null): string | null {
  return customerPriceLabel(price);
}
