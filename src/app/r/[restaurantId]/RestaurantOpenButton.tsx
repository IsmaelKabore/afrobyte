'use client';

import { openAfroBiteUserRestaurant } from '@/lib/openApp';

export default function RestaurantOpenButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  return (
    <button
      type="button"
      className="afr-btn-primary"
      onClick={() => openAfroBiteUserRestaurant(restaurantId)}
    >
      Ouvrir dans AfroBite
    </button>
  );
}
