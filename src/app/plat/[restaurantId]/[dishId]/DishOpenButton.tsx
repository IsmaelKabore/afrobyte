'use client';

import { openAfroBiteUserDish } from '@/lib/openApp';

export default function DishOpenButton({
  restaurantId,
  dishId,
  label = 'Ouvrir dans AfroBite',
}: {
  restaurantId: string;
  dishId: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="afp-btn-primary"
      onClick={() => openAfroBiteUserDish(restaurantId, dishId)}
    >
      {label}
    </button>
  );
}
