import { useState } from 'react';

export const useOrderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const openOrderModal = (order) => {
    if (!order?.id) return false;

    setSelectedOrder(order);
    setIsPaid(Boolean(order.is_paid));
    setIsOpen(true);
    return true;
  };

  const closeOrderModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
    setIsPaid(false);
  };

  return {
    isOpen,
    selectedOrder,
    isPaid,
    hasPaymentChanged:
      selectedOrder !== null && Boolean(selectedOrder.is_paid) !== isPaid,
    openOrderModal,
    closeOrderModal,
    setIsPaid,
  };
};

