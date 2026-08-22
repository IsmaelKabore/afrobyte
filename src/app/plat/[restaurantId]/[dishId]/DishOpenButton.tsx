'use client';

import { useEffect, useState } from 'react';
import {
  hrefOpenDish,
  openAfroBiteUserDish,
  isSnapchatBrowser,
} from '@/lib/openApp';

export default function DishOpenButton({
  restaurantId,
  dishId,
  label = 'Ouvrir dans AfroBite',
}: {
  restaurantId: string;
  dishId: string;
  label?: string;
}) {
  const [href, setHref] = useState('#');

  useEffect(() => {
    setHref(hrefOpenDish(restaurantId, dishId));
  }, [restaurantId, dishId]);

  return (
    <a
      className="afp-btn-primary"
      href={href}
      onClick={(e) => {
        if (isSnapchatBrowser()) return;
        e.preventDefault();
        openAfroBiteUserDish(restaurantId, dishId);
      }}
    >
      {label}
    </a>
  );
}
