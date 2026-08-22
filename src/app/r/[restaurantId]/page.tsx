import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchRestaurant,
  publicRestaurantOgImageUrl,
} from '@/lib/restaurant';
import { USER_APP_STORE_ID, USER_APP_STORE, USER_PLAY_STORE } from '@/lib/stores';
import RestaurantOpenButton from './RestaurantOpenButton';
import RestaurantOpenPrompt from './RestaurantOpenPrompt';

const SITE = 'https://afrobite.app';

type Params = { params: Promise<{ restaurantId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { restaurantId } = await params;
  const resto = await fetchRestaurant(restaurantId);
  const canonical = `${SITE}/r/${restaurantId}`;
  const appBanner = `app-id=${USER_APP_STORE_ID}, app-argument=${canonical}`;

  if (!resto) {
    return {
      title: 'Restaurant AfroBite',
      description: 'Découvrez des restaurants sur AfroBite.',
      alternates: { canonical },
      robots: { index: false, follow: true },
      other: { 'apple-itunes-app': appBanner },
    };
  }

  const name = resto.name || 'Restaurant';
  const title = `${name} | AfroBite`;
  const description = [
    resto.city,
    resto.description?.trim() || `Découvrez ${name} et commandez sur AfroBite.`,
  ]
    .filter(Boolean)
    .join(' · ');
  const image = publicRestaurantOgImageUrl(restaurantId);

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
          alt: name,
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
html,body{margin:0;padding:0;background:#0f0f14;color:#fff}
.afr-root{
  min-height:100dvh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:24px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;
  background:radial-gradient(120% 80% at 50% 0%,#2a2110 0%,#0f0f14 55%);
}
.afr-card{
  width:min(100%,420px);background:#16161c;border:1px solid rgba(255,255,255,.08);
  border-radius:24px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.45);
}
.afr-cover{width:100%;aspect-ratio:16/9;background:#222;overflow:hidden;position:relative}
.afr-cover img{width:100%;height:100%;object-fit:cover;display:block}
.afr-cover-fallback{width:100%;height:100%;background:#1c1c24}
.afr-logo-wrap{
  position:absolute;left:18px;bottom:-28px;width:72px;height:72px;border-radius:18px;
  overflow:hidden;border:3px solid #16161c;background:#222;box-shadow:0 8px 24px rgba(0,0,0,.35);
}
.afr-logo-wrap img{width:100%;height:100%;object-fit:cover;display:block}
.afr-body{padding:40px 18px 22px}
.afr-eyebrow{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#f5a623;margin:0 0 8px}
.afr-title{font-size:24px;font-weight:900;margin:0 0 6px;line-height:1.2}
.afr-city{font-size:14px;opacity:.7;margin:0 0 12px}
.afr-desc{font-size:14px;line-height:1.45;opacity:.75;margin:0 0 18px}
.afr-actions{display:flex;flex-direction:column;gap:10px}
.afr-btn-primary{
  width:100%;border:none;border-radius:14px;background:#f5a623;color:#1a1200;
  font-size:15px;font-weight:900;padding:14px 16px;cursor:pointer;
}
.afr-btn-secondary{
  width:100%;border:none;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;
  font-size:14px;font-weight:800;padding:13px 16px;cursor:pointer;text-decoration:none;
  text-align:center;display:block;
}
.afr-fallback{text-align:center;max-width:360px;padding:32px 16px}
.afr-fallback h1{font-size:22px;font-weight:900;margin:12px 0 8px}
.afr-fallback p{opacity:.7;line-height:1.5;margin:0 0 18px}
.afr-brand{font-weight:900;font-size:22px}
.afr-brand span{color:#f5a623}
.afr-modal{
  position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.72);
  display:flex;align-items:center;justify-content:center;padding:24px 18px;touch-action:none;
}
.afr-modal-card{
  position:relative;width:min(88vw,360px);background:#fff;color:#111;border-radius:22px;
  padding:52px 22px 22px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.45);
}
.afr-modal-avatar-wrap{position:absolute;left:50%;top:0;transform:translate(-50%,-50%)}
.afr-modal-avatar{
  width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;
  box-shadow:0 6px 20px rgba(0,0,0,.25);background:#eee;
}
.afr-modal-avatar-fallback{display:grid;place-items:center;font-size:30px;background:#f3f3f3}
.afr-modal-title{font-size:20px;font-weight:900;line-height:1.25;margin:0 0 10px}
.afr-modal-desc{font-size:14px;line-height:1.45;color:#666;margin:0 0 18px}
.afr-modal-primary{
  width:100%;border:none;border-radius:14px;background:#f5a623;color:#1a1200;
  font-size:15px;font-weight:900;padding:14px 16px;cursor:pointer;margin-bottom:10px;
}
.afr-modal-download{
  width:100%;border:1px solid #ddd;border-radius:14px;background:#f7f7f7;color:#222;
  font-size:14px;font-weight:800;padding:12px 16px;cursor:pointer;margin-bottom:6px;
}
.afr-modal-secondary{
  width:100%;border:none;background:transparent;color:#888;
  font-size:14px;font-weight:700;padding:10px;cursor:pointer;
}
`;

export default async function RestaurantPage({ params }: Params) {
  const { restaurantId } = await params;
  const resto = await fetchRestaurant(restaurantId);

  if (!resto) {
    return (
      <main className="afr-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="afr-fallback">
          <div className="afr-brand">
            Afro<span>Bite</span>
          </div>
          <h1>Restaurant introuvable</h1>
          <p>Ce lien n’est plus valide. Découvrez d’autres restaurants sur AfroBite.</p>
          <Link href="/" className="afr-btn-primary" style={{ display: 'inline-block' }}>
            Découvrir AfroBite
          </Link>
        </div>
      </main>
    );
  }

  const name = resto.name || 'Restaurant AfroBite';
  const thumb = resto.logoUrl || resto.coverUrl;

  return (
    <main className="afr-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <article className="afr-card">
        <div className="afr-cover">
          {resto.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resto.coverUrl} alt="" />
          ) : (
            <div className="afr-cover-fallback" />
          )}
          <div className="afr-logo-wrap">
            {resto.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resto.logoUrl} alt="" />
            ) : (
              <div className="afr-modal-avatar-fallback" style={{ width: '100%', height: '100%' }}>
                🍽️
              </div>
            )}
          </div>
        </div>
        <div className="afr-body">
          <p className="afr-eyebrow">Restaurant AfroBite</p>
          <h1 className="afr-title">{name}</h1>
          {resto.city && <p className="afr-city">{resto.city}</p>}
          <p className="afr-desc">
            {resto.description?.trim() ||
              'Ouvrez AfroBite pour voir le menu, les vidéos et commander.'}
          </p>
          <div className="afr-actions">
            <RestaurantOpenButton restaurantId={restaurantId} />
            <a className="afr-btn-secondary" href={USER_APP_STORE}>
              Télécharger sur l’App Store
            </a>
            <a className="afr-btn-secondary" href={USER_PLAY_STORE}>
              Télécharger sur Google Play
            </a>
          </div>
        </div>
      </article>

      <RestaurantOpenPrompt
        restaurantId={restaurantId}
        thumbUrl={thumb}
        restaurantName={resto.name}
      />
    </main>
  );
}
