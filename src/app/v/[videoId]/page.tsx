import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchVideo, priceLabel } from '@/lib/video';
import VideoPlayer from './VideoPlayer';
import AppCtas from './AppCtas';

const SITE = 'https://afrobite.app';

type Params = { params: Promise<{ videoId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { videoId } = await params;
  const video = await fetchVideo(videoId);
  const canonical = `${SITE}/v/${videoId}`;

  if (!video) {
    return {
      title: 'Vidéo AfroBite',
      description: 'Découvrez des plats faits maison sur AfroBite.',
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const dish = video.dishName || 'Plat';
  const resto = video.restaurantName || 'AfroBite';
  const title = `${dish} — ${resto} | AfroBite`;
  const price = priceLabel(video.price);
  const description =
    [price, video.caption].filter(Boolean).join(' · ') ||
    `Découvrez ${dish} chez ${resto} sur AfroBite.`;
  const image =
    video.ogImageUrl || video.posterUrl || `${SITE}/assets/logo-afrobite.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'video.other',
      siteName: 'AfroBite',
      images: [
        {
          url: image,
          secureUrl: image,
          width: 1200,
          height: 1200,
          alt: `${dish} — ${resto}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

const styles = `
.afv-root{min-height:100dvh;background:#0f0f14;color:#fff;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  display:flex;align-items:center;justify-content:center;padding:0}
.afv-stage{width:100%;max-width:520px;min-height:100dvh;display:flex;flex-direction:column;
  position:relative;background:#000}
.afv-video{position:relative;flex:1 1 auto;width:100%;
  aspect-ratio:9/16;max-height:100dvh;overflow:hidden;background:#000}
.afv-topbar{position:absolute;top:0;left:0;right:0;z-index:3;
  display:flex;justify-content:center;padding:14px;
  background:linear-gradient(to bottom,rgba(0,0,0,.55),transparent)}
.afv-brand{font-weight:900;letter-spacing:.3px;font-size:16px}
.afv-brand span{color:#f5a623}
.afv-info{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:18px 18px 22px;
  background:linear-gradient(to top,rgba(0,0,0,.82),rgba(0,0,0,.35),transparent)}
.afv-resto{font-size:13px;font-weight:700;opacity:.9;margin-bottom:4px}
.afv-dish{font-size:22px;font-weight:900;line-height:1.15;margin-bottom:6px}
.afv-price{display:inline-block;background:#f5a623;color:#1a1a2e;font-weight:900;
  font-size:15px;padding:5px 12px;border-radius:999px;margin-bottom:10px}
.afv-caption{font-size:14px;opacity:.85;line-height:1.4;margin-bottom:14px;
  max-width:92%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.afv-ctas{display:flex;flex-direction:column;gap:9px}
.afv-btn{width:100%;border:none;border-radius:14px;padding:13px 18px;
  font-size:15px;font-weight:800;cursor:pointer;transition:transform .12s ease}
.afv-btn:active{transform:scale(.98)}
.afv-btn-primary{background:#f5a623;color:#1a1a2e;box-shadow:0 6px 20px rgba(245,166,35,.4)}
.afv-btn-order{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.22)}
.afv-btn-ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.28)}
.afv-sheet{position:fixed;inset:0;z-index:20;background:rgba(0,0,0,.6);
  display:flex;align-items:flex-end;justify-content:center;padding:16px}
.afv-sheet-card{width:100%;max-width:440px;background:#16161e;border-radius:20px;
  padding:22px;display:flex;flex-direction:column;gap:10px;
  box-shadow:0 -8px 40px rgba(0,0,0,.5)}
.afv-sheet-title{font-size:16px;font-weight:800;text-align:center;margin-bottom:6px}
.afv-fallback{min-height:100dvh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;padding:32px;gap:14px}
.afv-fallback h1{font-size:24px;font-weight:900}
.afv-fallback p{opacity:.8;max-width:340px;line-height:1.5}
.afv-fallback a{margin-top:8px}
@media(min-width:820px){
  .afv-root{padding:32px}
  .afv-stage{max-width:1000px;min-height:auto;flex-direction:row;background:transparent;gap:28px;align-items:center}
  .afv-video{max-width:420px;border-radius:22px;aspect-ratio:9/16;max-height:82dvh;flex:0 0 auto;
    box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .afv-info{position:static;flex:1 1 320px;max-width:420px;padding:0;background:none}
  .afv-caption{-webkit-line-clamp:6}
}
`;

export default async function VideoPage({ params }: Params) {
  const { videoId } = await params;
  const video = await fetchVideo(videoId);

  if (!video || !video.hlsUrl) {
    return (
      <main className="afv-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="afv-fallback">
          <div className="afv-brand" style={{ fontSize: 22 }}>
            Afro<span>Bite</span>
          </div>
          <h1>Cette vidéo n’est plus disponible</h1>
          <p>Elle a peut-être été retirée. Découvrez d’autres plats sur AfroBite.</p>
          <AppCtas videoId="" />
          <Link href="/" className="afv-btn afv-btn-ghost" style={{ maxWidth: 300 }}>
            Découvrir AfroBite
          </Link>
        </div>
      </main>
    );
  }

  const price = priceLabel(video.price);

  return (
    <main className="afv-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="afv-stage">
        <div className="afv-video">
          <div className="afv-topbar">
            <div className="afv-brand">
              Afro<span>Bite</span>
            </div>
          </div>
          <VideoPlayer hlsUrl={video.hlsUrl} poster={video.posterUrl} />
        </div>

        <div className="afv-info">
          {video.restaurantName && (
            <div className="afv-resto">📍 {video.restaurantName}</div>
          )}
          <div className="afv-dish">{video.dishName || 'Plat AfroBite'}</div>
          {price && <div className="afv-price">{price}</div>}
          {video.caption && <div className="afv-caption">{video.caption}</div>}
          <AppCtas videoId={video.id} />
        </div>
      </div>
    </main>
  );
}
