import type { Metadata } from 'next';
import Link from 'next/link';
import {
  dishPriceLabel,
  fetchDish,
  publicDishOgImageUrl,
} from '@/lib/dish';
import { USER_APP_STORE_ID } from '@/lib/stores';
import DishOpenButton from './DishOpenButton';
import DishOpenPrompt from './DishOpenPrompt';
import DeepLinkStoreBadges from '@/components/deep-link-store-badges';

const SITE = 'https://afrobite.app';

type Params = {
  params: Promise<{ restaurantId: string; dishId: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { restaurantId, dishId } = await params;
  const dish = await fetchDish(restaurantId, dishId);
  const canonical = `${SITE}/plat/${restaurantId}/${dishId}`;
  const appBanner = `app-id=${USER_APP_STORE_ID}, app-argument=${canonical}`;

  if (!dish) {
    return {
      title: 'Plat AfroBite',
      description: 'Découvrez et commandez des plats faits maison sur AfroBite.',
      alternates: { canonical },
      robots: { index: false, follow: true },
      other: { 'apple-itunes-app': appBanner },
    };
  }

  const name = dish.name || 'Plat';
  const resto = dish.restaurantName || 'AfroBite';
  const title = `${name} — ${resto} | AfroBite`;
  const price = dishPriceLabel(dish.price);
  const description = [price, name, resto].filter(Boolean).join(' · ');
  const image = publicDishOgImageUrl(restaurantId, dishId);

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
          alt: `${name} — ${resto}`,
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
.afp-root{
  min-height:100dvh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:24px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;
  background:radial-gradient(120% 80% at 50% 0%,#2a2110 0%,#0f0f14 55%);
}
.afp-card{
  width:min(100%,420px);background:#16161c;border:1px solid rgba(255,255,255,.08);
  border-radius:24px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.45);
}
.afp-hero{
  position:relative;width:100%;aspect-ratio:1;background:#222;overflow:hidden;
}
.afp-hero img{width:100%;height:100%;object-fit:cover;display:block}
.afp-hero-fallback{
  width:100%;height:100%;display:grid;place-items:center;font-size:64px;background:#1c1c24;
}
.afp-body{padding:20px 18px 22px}
.afp-eyebrow{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
  color:#f5a623;margin:0 0 8px}
.afp-title{font-size:24px;font-weight:900;margin:0 0 6px;line-height:1.2}
.afp-resto{font-size:14px;opacity:.75;margin:0 0 10px}
.afp-price{font-size:18px;font-weight:800;color:#f5a623;margin:0 0 16px}
.afp-desc{font-size:14px;line-height:1.45;opacity:.7;margin:0 0 18px}
.afp-actions{display:flex;flex-direction:column;gap:10px}
.afp-btn-primary{
  width:100%;border:none;border-radius:14px;background:#f5a623;color:#1a1200;
  font-size:15px;font-weight:900;padding:14px 16px;cursor:pointer;
  text-decoration:none;display:block;text-align:center;box-sizing:border-box;
}
.afp-btn-secondary{
  width:100%;border:none;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;
  font-size:14px;font-weight:800;padding:13px 16px;cursor:pointer;text-decoration:none;
  text-align:center;display:none;
}
.afp-store-row{margin-top:4px;width:100%}
.afp-store-row .store-badges{
  display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;
  gap:8px;justify-content:center;align-items:stretch;width:100%;
}
.afp-store-row .store-badge{
  display:inline-flex;align-items:center;gap:7px;
  flex:1 1 0 !important;min-width:0;max-width:none !important;
  padding:6px 10px 6px 8px;border-radius:10px;
  border:1px solid rgba(255,255,255,.28);background:#060606;color:#fff;
  text-decoration:none;line-height:1.05;
}
.afp-store-row .store-badge svg{width:18px;height:18px;flex:none}
.afp-store-row .store-badge small{
  display:block;font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:#b5ada0;
  white-space:nowrap;
}
.afp-store-row .store-badge strong{display:block;font-size:12px;font-weight:700;white-space:nowrap}
.afp-fallback{
  text-align:center;max-width:360px;padding:32px 16px;
}
.afp-fallback h1{font-size:22px;font-weight:900;margin:12px 0 8px}
.afp-fallback p{opacity:.7;line-height:1.5;margin:0 0 18px}
.afp-brand{font-weight:900;font-size:22px}
.afp-brand span{color:#f5a623}
.afp-modal{
  position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.72);
  display:flex;align-items:center;justify-content:center;padding:24px 18px;touch-action:none;
}
.afp-modal-card{
  position:relative;width:min(88vw,360px);background:#fff;color:#111;border-radius:22px;
  padding:52px 22px 22px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.45);
}
.afp-modal-avatar-wrap{position:absolute;left:50%;top:0;transform:translate(-50%,-50%)}
.afp-modal-avatar{
  width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;
  box-shadow:0 6px 20px rgba(0,0,0,.25);background:#eee;
}
.afp-modal-avatar-fallback{display:grid;place-items:center;font-size:30px;background:#f3f3f3}
.afp-modal-title{font-size:20px;font-weight:900;line-height:1.25;margin:0 0 10px}
.afp-modal-desc{font-size:14px;line-height:1.45;color:#666;margin:0 0 18px}
.afp-modal-primary{
  width:100%;border:none;border-radius:14px;background:#f5a623;color:#1a1200;
  font-size:15px;font-weight:900;padding:14px 16px;cursor:pointer;margin-bottom:10px;
  display:block;text-decoration:none;text-align:center;box-sizing:border-box;
}
.afp-modal-download{
  width:100%;border:1px solid #ddd;border-radius:14px;background:#f7f7f7;color:#222;
  font-size:14px;font-weight:800;padding:12px 16px;cursor:pointer;margin-bottom:6px;
}
.afp-modal-secondary{
  width:100%;border:none;background:transparent;color:#888;
  font-size:14px;font-weight:700;padding:10px;cursor:pointer;
}
`;

export default async function DishPage({ params }: Params) {
  const { restaurantId, dishId } = await params;
  const dish = await fetchDish(restaurantId, dishId);

  if (!dish) {
    return (
      <main className="afp-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="afp-fallback">
          <div className="afp-brand">
            Afro<span>Bite</span>
          </div>
          <h1>Ce plat n’est plus disponible</h1>
          <p>Le lien est peut-être expiré. Découvrez d’autres plats sur AfroBite.</p>
          <Link href="/" className="afp-btn-primary" style={{ display: 'inline-block' }}>
            Découvrir AfroBite
          </Link>
        </div>
      </main>
    );
  }

  const price = dishPriceLabel(dish.price);
  const name = dish.name || 'Plat AfroBite';
  const thumb = dish.imageUrl;

  return (
    <main className="afp-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <article className="afp-card">
        <div className="afp-hero">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={name} />
          ) : (
            <div className="afp-hero-fallback" aria-hidden>
              🍽️
            </div>
          )}
        </div>
        <div className="afp-body">
          <p className="afp-eyebrow">Plat AfroBite</p>
          <h1 className="afp-title">{name}</h1>
          {dish.restaurantName && (
            <p className="afp-resto">{dish.restaurantName}</p>
          )}
          {price && <p className="afp-price">{price}</p>}
          <p className="afp-desc">
            Ouvrez AfroBite pour vérifier la disponibilité et commander ce plat.
          </p>
          <div className="afp-actions">
            <DishOpenButton restaurantId={restaurantId} dishId={dishId} />
            <DeepLinkStoreBadges />
          </div>
        </div>
      </article>

      <DishOpenPrompt
        restaurantId={restaurantId}
        dishId={dishId}
        thumbUrl={thumb}
        dishName={dish.name}
      />
    </main>
  );
}
