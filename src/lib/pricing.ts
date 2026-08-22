/**
 * Prix affiché client — miroir exact de
 * `PricingService.customerDisplayPrice` (Flutter).
 * Firestore stocke le prix resto (base). Le client voit base + 5 %,
 * arrondi au 100 supérieur.
 */
export const COMMISSION_RATE = 0.05;
export const ROUNDING_UNIT = 100;

export function customerDisplayPrice(basePrice: number | null | undefined): number {
  if (basePrice == null || Number.isNaN(basePrice) || basePrice <= 0) return 0;
  const withMargin = basePrice * (1 + COMMISSION_RATE);
  return Math.ceil(withMargin / ROUNDING_UNIT) * ROUNDING_UNIT;
}

export function customerPriceLabel(
  basePrice: number | null | undefined,
): string | null {
  const n = customerDisplayPrice(basePrice);
  if (n <= 0) return null;
  const formatted = n.toLocaleString("fr-FR").replace(/\u202f/g, " ");
  return `${formatted} FCFA`;
}

export function customerPriceShort(
  basePrice: number | null | undefined,
): string | null {
  const n = customerDisplayPrice(basePrice);
  if (n <= 0) return null;
  const formatted = n.toLocaleString("fr-FR").replace(/\u202f/g, " ");
  return `${formatted} F`;
}
