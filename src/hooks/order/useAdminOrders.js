import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// features
import {
  ensureAdminOrders,
  fetchAdminOrders,
  removeAdminOrder,
  selectAdminOrders,
  selectAdminOrdersError,
  selectAdminOrdersLastFetchedAt,
  selectAdminOrdersStatus,
  updateAdminOrderPayment,
} from '@/features/order/orderSlice';

export const useAdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const status = useSelector(selectAdminOrdersStatus);
  const error = useSelector(selectAdminOrdersError);
  const lastFetchedAt = useSelector(selectAdminOrdersLastFetchedAt);

  const fetchOrders = useCallback(
    () => dispatch(ensureAdminOrders()),
    [dispatch],
  );
  const refreshOrders = useCallback(
    ({ background = false } = {}) =>
      dispatch(fetchAdminOrders({ background })).unwrap(),
    [dispatch],
  );
  const saveOrderPaymentToStore = useCallback(
    (orderId, isPaid) =>
      dispatch(updateAdminOrderPayment({ orderId, isPaid })),
    [dispatch],
  );
  const removeOrderFromStore = useCallback(
    (orderId) => dispatch(removeAdminOrder(orderId)),
    [dispatch],
  );

  return {
    orders,
    status,
    error,
    lastFetchedAt,
    fetchOrders,
    refreshOrders,
    saveOrderPaymentToStore,
    removeOrderFromStore,
  };
};
