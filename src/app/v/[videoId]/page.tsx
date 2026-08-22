import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchVideo,
  priceLabel,
  priceShort,
  publicOgImageUrl,
} from '@/lib/video';
import { USER_APP_STORE_ID } from '@/lib/stores';
import VideoPlayer from './VideoPlayer';
import AppCtas from './AppCtas';
import OpenPrompt from './OpenPrompt';
import TopBanner from './TopBanner';

const SITE = 'https://afrobite.app';

type Params = { params: Promise<{ videoId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { videoId } = await params;
  const video = await fetchVideo(videoId);
  const canonical = `${SITE}/v/${videoId}`;
  const appBanner = `app-id=${USER_APP_STORE_ID}, app-argument=${canonical}`;

  if (!video) {
    return {
      title: 'Vidéo AfroBite',
      description: 'Découvrez des plats faits maison sur AfroBite.',
      alternates: { canonical },
      robots: { index: false, follow: true },
      other: { 'apple-itunes-app': appBanner },
    };
  }

  const dish = video.dishName || 'Plat';
  const resto = video.restaurantName || 'AfroBite';
  const title = `${dish} — ${resto} | AfroBite`;
  const price = priceLabel(video.price);
  const description = [price, dish, resto].filter(Boolean).join(' · ');
  // Proxy afrobite.app — Mux a x-robots-tag:noindex (WhatsApp refuse l'image).
  const image = publicOgImageUrl(videoId);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'AfroBite',
      locale: 'fr_FR',
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
    other: { 'apple-itunes-app': appBanner },
  };
}

const styles = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:#000}
.afv-root{
  position:fixed;inset:0;z-index:50;
  width:100%;height:100%;height:100dvh;
  background:#000;color:#fff;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;
  overflow:hidden;display:flex;flex-direction:column;
}
.afv-banner{
  flex:0 0 auto;display:flex;align-items:center;gap:10px;
  padding:8px 12px;min-height:52px;
  background:rgba(18,18,22,.92);backdrop-filter:saturate(140%) blur(12px);
  border-bottom:1px solid rgba(255,255,255,.08);z-index:5;
}
.afv-banner-logo{
  width:34px;height:34px;border-radius:8px;object-fit:cover;flex:0 0 auto;
  background:#222;
}
.afv-banner-text{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.15}
.afv-banner-text strong{font-size:14px;font-weight:800}
.afv-banner-text span{font-size:11px;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.afv-banner-cta{
  flex:0 0 auto;border:none;border-radius:999px;
  background:#f5a623;color:#1a1200;
  font-size:13px;font-weight:800;letter-spacing:.02em;
  padding:9px 16px;cursor:pointer;
}
.afv-stage{
  position:relative;flex:1 1 auto;min-height:0;width:100%;
  background:#000;overflow:hidden;
}
.afv-player,.afv-player video{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;background:#000;
}
.afv-mute{
  position:absolute;top:12px;right:12px;z-index:4;
  background:rgba(0,0,0,.55);color:#fff;border:none;border-radius:999px;
  padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer;
  backdrop-filter:blur(6px);
}
.afv-shade{
  position:absolute;left:0;right:0;bottom:0;z-index:3;pointer-events:none;
  height:55%;
  background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.45) 45%,transparent 100%);
}
.afv-meta{
  position:absolute;left:0;right:0;bottom:0;z-index:4;
  padding:0 14px 14px;display:flex;flex-direction:column;gap:10px;
  pointer-events:none;
}
.afv-meta > *{pointer-events:auto}
.afv-copy{max-width:78%}
.afv-resto{font-size:14px;font-weight:800;margin:0 0 4px;opacity:.95}
.afv-dish{font-size:20px;font-weight:900;margin:0 0 4px;line-height:1.15;
  text-shadow:0 1px 8px rgba(0,0,0,.45)}
.afv-price{font-size:16px;font-weight:800;color:#f5a623;margin:0;
  text-shadow:0 1px 6px rgba(0,0,0,.4)}
.afv-card{
  display:flex;align-items:center;gap:10px;
  background:rgba(16,16,20,.88);border:1px solid rgba(255,255,255,.1);
  border-radius:14px;padding:8px 8px 8px 8px;
  backdrop-filter:blur(10px);
}
.afv-card-thumb{
  width:48px;height:48px;border-radius:10px;object-fit:cover;flex:0 0 auto;
  background:#222;
}
.afv-card-thumb-fallback{
  display:grid;place-items:center;font-size:22px;
}
.afv-card-info{flex:1;min-width:0}
.afv-card-info strong{display:block;font-size:14px;font-weight:800;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.afv-card-info span{display:block;font-size:13px;font-weight:700;color:#f5a623;margin-top:2px}
.afv-order-btn{
  flex:0 0 auto;border:none;border-radius:12px;
  background:#f5a623;color:#1a1200;
  font-size:13px;font-weight:800;padding:11px 14px;cursor:pointer;
}
.afv-ctas{display:none}
.afv-stores{display:none}
.afv-fallback{
  min-height:100dvh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;padding:32px;gap:14px;color:#fff;
  background:#0f0f14;
}
.afv-fallback h1{font-size:22px;font-weight:900;margin:0}
.afv-fallback p{opacity:.75;max-width:320px;line-height:1.5;margin:0}
.afv-fallback a{
  margin-top:8px;color:#1a1200;background:#f5a623;text-decoration:none;
  padding:12px 18px;border-radius:12px;font-weight:800;
}
.afv-brand{font-weight:900;font-size:22px}
.afv-brand span{color:#f5a623}

/* Modal bloquant centré (au-dessus du grain body::before z-index:100) */
.afv-modal{
  position:fixed;inset:0;z-index:200;
  background:rgba(0,0,0,.72);
  display:flex;align-items:center;justify-content:center;
  padding:24px 18px;touch-action:none;
}
.afv-modal-card{
  position:relative;width:min(88vw,360px);
  background:#fff;color:#111;border-radius:22px;
  padding:52px 22px 22px;text-align:center;
  box-shadow:0 24px 64px rgba(0,0,0,.45);
}
.afv-modal-avatar-wrap{
  position:absolute;left:50%;top:0;transform:translate(-50%,-50%);
}
.afv-modal-avatar{
  width:72px;height:72px;border-radius:50%;object-fit:cover;
  border:3px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,.25);
  background:#eee;
}
.afv-modal-avatar-fallback{
  display:grid;place-items:center;font-size:30px;background:#f3f3f3;
}
.afv-modal-title{
  font-size:20px;font-weight:900;line-height:1.25;margin:0 0 10px;color:#111;
}
.afv-modal-desc{
  font-size:14px;line-height:1.45;color:#666;margin:0 0 18px;
}
.afv-modal-primary{
  width:100%;border:none;border-radius:14px;
  background:#f5a623;color:#1a1200;
  font-size:15px;font-weight:900;padding:14px 16px;cursor:pointer;
  margin-bottom:10px;
}
.afv-modal-download{
  width:100%;border:1px solid #ddd;border-radius:14px;
  background:#f7f7f7;color:#222;
  font-size:14px;font-weight:800;padding:12px 16px;cursor:pointer;
  margin-bottom:6px;
}
.afv-modal-secondary{
  width:100%;border:none;background:transparent;color:#888;
  font-size:14px;font-weight:700;padding:10px;cursor:pointer;
}
@media(min-width:900px){
  .afv-root{align-items:center;justify-content:center;background:#0a0a0e}
  .afv-banner{width:min(420px,100%)}
  .afv-stage{width:min(420px,100%);height:auto;aspect-ratio:9/16;max-height:calc(100dvh - 52px);
    border-radius:0 0 18px 18px;overflow:hidden}
}
`;

export default async function VideoPage({ params }: Params) {
  const { videoId } = await params;
  const video = await fetchVideo(videoId);

  if (!video || !video.hlsUrl) {
    return (
      <main className="afv-root" style={{ position: 'relative', overflow: 'auto' }}>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="afv-fallback">
          <div className="afv-brand">
            Afro<span>Bite</span>
          </div>
          <h1>Cette vidéo n’est plus disponible</h1>
          <p>Elle a peut-être été retirée. Découvrez d’autres plats sur AfroBite.</p>
          <Link href="/">Découvrir AfroBite</Link>
        </div>
      </main>
    );
  }

  const price = priceLabel(video.price);
  const priceMini = priceShort(video.price);
  const dish = video.dishName || 'Plat AfroBite';
  const thumb = video.posterUrl;

  return (
    <main className="afv-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <TopBanner videoId={video.id} />

      <div className="afv-stage">
        <VideoPlayer hlsUrl={video.hlsUrl} poster={video.posterUrl} />
        <div className="afv-shade" aria-hidden />
        <div className="afv-meta">
          <div className="afv-copy">
            {video.restaurantName && (
              <p className="afv-resto">{video.restaurantName}</p>
            )}
            <p className="afv-dish">{dish}</p>
            {price && <p className="afv-price">{price}</p>}
          </div>

          <div className="afv-card">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="afv-card-thumb" src={thumb} alt="" />
            ) : (
              <div className="afv-card-thumb afv-card-thumb-fallback">🍽️</div>
            )}
            <div className="afv-card-info">
              <strong>{dish}</strong>
              {priceMini && <span>{priceMini}</span>}
            </div>
            <AppCtas videoId={video.id} />
          </div>
        </div>
      </div>

      <OpenPrompt
        videoId={video.id}
        thumbUrl={thumb}
        dishName={video.dishName}
      />
    </main>
  );
}
