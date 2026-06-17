export const calculateCartTotal = (carts) => {
  return carts.reduce((total, cart) => total + (cart.total || 0), 0);
};

export const formatCardNumber = (value = '') => {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
};
