'use client';

import { useEffect, useState } from 'react';
import {
  hrefOpenRestaurant,
  openAfroBiteUserRestaurant,
  isSnapchatBrowser,
} from '@/lib/openApp';

export default function RestaurantOpenButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [href, setHref] = useState('#');

  useEffect(() => {
    const hydrate = window.setTimeout(
      () => setHref(hrefOpenRestaurant(restaurantId)),
      0,
    );
    return () => window.clearTimeout(hydrate);
  }, [restaurantId]);

  return (
    <a
      className="afr-btn-primary"
      href={href}
      onClick={(e) => {
        if (isSnapchatBrowser()) return;
        e.preventDefault();
        openAfroBiteUserRestaurant(restaurantId);
      }}
    >
      Ouvrir dans AfroBite
    </a>
  );
}
