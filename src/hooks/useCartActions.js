import { useDispatch } from 'react-redux';

// services
import { getCartSummary, addsCartItem } from '@/services/cartService';

// features
import { updateCartData } from '@/features/cart/cartSlice';

export const useCartActions = () => {
  const dispatch = useDispatch();

  const refreshCart = async () => {
    const cartData = await getCartSummary();
    dispatch(updateCartData(cartData));
  };

  const addItem = async (data) => {
    await addsCartItem(data);
    await refreshCart();
  };

  return { addItem, refreshCart };
};
