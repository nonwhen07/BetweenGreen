import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

export const calculateCartTotal = (carts = []) => {
  return carts.reduce((total, cart) => total + Number(cart.total || 0), 0);
};

// 前台自訂運費不會寫入六角 Order API，因此所有前台訂單畫面都以
// 「優惠後商品金額」作為免運判斷基準，再於顯示層補上運費。
export const getShippingPricing = (discountedMerchandiseTotal = 0) => {
  const merchandiseTotal = Math.max(0, getSafeNumber(discountedMerchandiseTotal));
  const shipping = merchandiseTotal > 0 && merchandiseTotal < minfreeShippingFee ? shippingFee : 0;

  return {
    shipping,
    paymentTotal: merchandiseTotal + shipping,
    amountToFreeShipping: Math.max(minfreeShippingFee - merchandiseTotal, 0),
  };
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
  const hasApiTotal = cartData.total != null && Number.isFinite(Number(cartData.total));
  const hasApiFinalTotal =
    cartData.final_total != null && Number.isFinite(Number(cartData.final_total));

  const subtotal = hasApiTotal ? Math.round(apiTotal) : Math.round(calculatedSubtotal);

  const finalTotal = hasApiFinalTotal
    ? Math.round(apiFinalTotal)
    : Math.round(calculatedFinalTotal || subtotal);

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
