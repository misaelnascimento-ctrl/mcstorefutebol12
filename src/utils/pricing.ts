import { CartItem, WholesaleTier, Coupon } from '../types';

export const MIN_WHOLESALE_QUANTITY = 10;
export const FREE_SHIPPING_THRESHOLD = 30;

/**
 * Calculates unit price according to total pieces in cart
 */
export function getWholesaleUnitPrice(tiers: WholesaleTier[], totalCartQuantity: number): number {
  if (!tiers || tiers.length === 0) return 60;
  
  // Find matching tier
  for (const tier of tiers) {
    if (totalCartQuantity >= tier.minQuantity) {
      if (tier.maxQuantity === undefined || totalCartQuantity <= tier.maxQuantity) {
        return tier.unitPrice;
      }
    }
  }
  
  // If above highest tier
  const highestTier = tiers.reduce((prev, curr) => (curr.minQuantity > prev.minQuantity ? curr : prev), tiers[0]);
  if (totalCartQuantity >= highestTier.minQuantity) {
    return highestTier.unitPrice;
  }

  return tiers[0]?.unitPrice || 60;
}

export function calculateCartTotals(
  items: CartItem[], 
  productsMap: Record<string, { wholesaleTiers: WholesaleTier[] }>,
  appliedCoupon?: Coupon | null
) {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Recalculate each item unit price based on global volume
  const itemsWithTierPricing = items.map(item => {
    const product = productsMap[item.productId];
    const unitPrice = product ? getWholesaleUnitPrice(product.wholesaleTiers, totalQuantity) : item.unitPrice;
    return {
      ...item,
      unitPrice,
    };
  });

  const subtotal = itemsWithTierPricing.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const isFreeShipping = totalQuantity >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = totalQuantity === 0 ? 0 : (isFreeShipping ? 0 : 38.00);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && appliedCoupon.active && totalQuantity >= (appliedCoupon.minPieces || 1)) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  const total = Math.max(0, subtotal - discount + shippingCost);
  const meetsMinimumOrder = totalQuantity >= MIN_WHOLESALE_QUANTITY;
  const piecesLeftForMinOrder = Math.max(0, MIN_WHOLESALE_QUANTITY - totalQuantity);
  const piecesLeftForNextTier = totalQuantity < 10 ? (10 - totalQuantity) : (totalQuantity < 30 ? (30 - totalQuantity) : 0);

  return {
    totalQuantity,
    itemsWithTierPricing,
    subtotal,
    discount,
    shippingCost,
    isFreeShipping,
    total,
    meetsMinimumOrder,
    piecesLeftForMinOrder,
    piecesLeftForNextTier,
    currentTierName: totalQuantity >= 30 ? 'Atacado Máximo (R$ 45/un)' : totalQuantity >= 10 ? 'Atacado Padrão (R$ 50/un)' : 'Grade Mínima Não Atingida (R$ 60/un)'
  };
}
