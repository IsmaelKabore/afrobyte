import type { NextRequest } from "next/server";

/**
 * Lien suivi : afrobite.app/go/TT-MISTER (vidéo TikTok), /go/AG-OUSMANE (agent terrain)…
 *
 * 1. Compte le clic (Cloud Function marketingLinkClick : jour, système, appli d'origine ;
 *    aucune IP stockée). Les robots d'aperçu (WhatsApp, Facebook…) ne comptent pas.
 * 2. Redirige vers /telecharger avec la source : la page la transmet aux stores
 *    (Play Store `referrer`, App Store `ct`) et affiche le code à saisir à l'inscription.
 *
 * Le clic ne bloque jamais la redirection : 1,5 s max, sinon on redirige quand même.
 */

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodsocialnetwork-74a07";
const CLICK_URL =
  process.env.MARKETING_LINK_CLICK_URL || `https://us-central1-${PROJECT}.cloudfunctions.net/marketingLinkClick`;

const PREFIX_CHANNEL: Record<string, string> = {
  TT: "tiktok", AG: "agent", INF: "influenceur", WA: "whatsapp", FB: "facebook",
  IG: "instagram", AF: "affiche", RE: "restaurant", LV: "livreur",
};

const BOT = /bot|crawler|spider|preview|facebookexternalhit|WhatsApp\/|TelegramBot|Slackbot|Discordbot|Twitterbot|LinkedInBot|Google-Read-Aloud/i;

function normalizeCode(raw: string): string | null {
  const code = decodeURIComponent(raw).trim().toUpperCase().replace(/[\s_]+/g, "-").replace(/[^A-Z0-9-]/g, "");
  return /^[A-Z0-9][A-Z0-9-]{2,23}$/.test(code) ? code : null;
}

async function countClick(code: string, userAgent: string): Promise<string | null> {
  try {
    const res = await fetch(CLICK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userAgent }),
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { channel?: string };
    return data.channel ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, ctx: RouteContext<"/go/[code]">) {
  const { code: raw } = await ctx.params;
  const code = normalizeCode(raw);
  const target = new URL("/telecharger", request.url);
  if (!code) return Response.redirect(target, 302);

  const ua = request.headers.get("user-agent") || "";
  const channel = (BOT.test(ua) ? null : await countClick(code, ua)) || PREFIX_CHANNEL[code.split("-")[0]] || "lien";

  target.searchParams.set("utm_source", channel);
  target.searchParams.set("utm_medium", "lien");
  target.searchParams.set("utm_campaign", code.toLowerCase());
  target.searchParams.set("code", code);
  return new Response(null, { status: 302, headers: { Location: target.toString(), "Cache-Control": "no-store" } });
}
