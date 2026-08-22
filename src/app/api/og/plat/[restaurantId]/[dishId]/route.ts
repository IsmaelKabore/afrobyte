import { NextResponse } from "next/server";
import { fetchDish } from "@/lib/dish";

export const runtime = "nodejs";
export const revalidate = 3600;

const FALLBACK = "https://afrobite.app/assets/logo-afrobite.png";

/**
 * Proxy OG image plat pour Snapchat / WhatsApp / iMessage.
 * Firebase Storage URLs can be blocked or poorly cached by social crawlers.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ restaurantId: string; dishId: string }> },
) {
  const { restaurantId, dishId } = await ctx.params;
  const dish = await fetchDish(restaurantId, dishId);
  const upstream = dish?.imageUrl || dish?.restaurantLogoUrl || FALLBACK;

  try {
    const res = await fetch(upstream, {
      next: { revalidate: 3600 },
      headers: { Accept: "image/*" },
    });
    if (!res.ok) {
      return NextResponse.redirect(FALLBACK, 302);
    }
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Content-Length": String(buf.byteLength),
      },
    });
  } catch {
    return NextResponse.redirect(FALLBACK, 302);
  }
}
