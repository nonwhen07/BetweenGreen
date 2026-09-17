import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

// services
import { getCartSummary } from '@/services/cartService';

// features
import { updateCartData } from '@/features/cart/cartSlice';

export const useCartActions = () => {
  const dispatch = useDispatch();

  const refreshCart = useCallback(async () => {
    const cartData = await getCartSummary();
    dispatch(updateCartData(cartData));

    return cartData;
  }, [dispatch]);

  return { refreshCart };
};
