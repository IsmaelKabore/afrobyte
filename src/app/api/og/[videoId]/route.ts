import { NextResponse } from "next/server";
import { fetchVideo } from "@/lib/video";

export const runtime = "nodejs";
export const revalidate = 3600;

/**
 * Proxy OG image pour WhatsApp / iMessage / Facebook.
 * Mux renvoie `x-robots-tag: noindex` → les crawlers sociaux refusent l'image.
 * On ressert le JPEG depuis afrobite.app sans noindex.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ videoId: string }> },
) {
  const { videoId } = await ctx.params;
  const video = await fetchVideo(videoId);

  const upstream =
    video?.ogImageUrl ||
    video?.posterUrl ||
    "https://afrobite.app/assets/logo-afrobite.png";

  try {
    const res = await fetch(upstream, {
      next: { revalidate: 3600 },
      headers: { Accept: "image/*" },
    });
    if (!res.ok) {
      return NextResponse.redirect(
        "https://afrobite.app/assets/logo-afrobite.png",
        302,
      );
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
    return NextResponse.redirect(
      "https://afrobite.app/assets/logo-afrobite.png",
      302,
    );
  }
}
