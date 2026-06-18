export const calculateCartTotal = (carts = []) => {
  return carts.reduce((total, cart) => total + Number(cart.total || 0), 0);
};

export const calculateCartFinalTotal = (carts = []) => {
  return carts.reduce((total, cart) => total + Number(cart.final_total ?? cart.total ?? 0), 0);
};

const getSafeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

export const getCartPricing = ({ carts = [], cartData = {} }) => {
  const calculatedSubtotal = calculateCartTotal(carts);
  const calculatedFinalTotal = calculateCartFinalTotal(carts);

  const apiTotal = getSafeNumber(cartData.total);
  const apiFinalTotal = getSafeNumber(cartData.final_total);

  const subtotal = apiTotal > 0 ? Math.round(apiTotal) : Math.round(calculatedSubtotal);

  const finalTotal =
    apiFinalTotal > 0 ? Math.round(apiFinalTotal) : Math.round(calculatedFinalTotal || subtotal);

  const hasDiscount = finalTotal < subtotal;
  const discountAmount = hasDiscount ? subtotal - finalTotal : 0;

  const discountRate =
    hasDiscount && subtotal > 0 ? Math.round((1 - finalTotal / subtotal) * 100) : 0;

  return {
    subtotal,
    finalTotal,
    hasDiscount,
    discountAmount,
    discountRate,
  };
};

export const getAppliedCoupon = (carts = []) => {
  const cartWithCoupon = carts.find((cart) => cart.coupon);

  return cartWithCoupon?.coupon || null;
};

export const formatCouponDueDate = (timestamp) => {
  if (!timestamp) return '未提供';

  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatCardNumber = (value = '') => {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
};
