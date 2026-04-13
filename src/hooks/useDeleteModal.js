import { useState } from 'react';

export const useDeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  // 打開 modal（帶資料）
  const openDeleteModal = (item) => {
    setTargetItem(item);
    setIsOpen(true);
  };

  // 關閉 modal
  const closeDeleteModal = () => {
    setIsOpen(false);
    setTargetItem(null);
  };

  return {
    isOpen,
    targetItem,
    openDeleteModal,
    closeDeleteModal,
  };
};
