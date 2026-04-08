export const calculateCartTotal = (carts) => {
  return carts.reduce((total, cart) => total + (cart.total || 0), 0);
};
