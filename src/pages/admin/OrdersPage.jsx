import { useEffect, useState } from 'react';

// constants
import { ORDER_PER_PAGE } from '@/constants/orderConstants';
// services
import { deleteOrder, updateOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { useOrderModal } from '@/hooks/order/useOrderModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import BrandPagination from '@/components/shared/BrandPagination';
import DeleteModal from '@/components/admin/DeleteModal';
import OrderModal from '@/components/admin/OrderModal';
import OrdersTable from '@/components/admin/order/OrdersTable';

const OrdersPage = () => {
  const { success, showError } = useToast();
  const { start, stop } = useLoading();
  const {
    orders,
    fetchOrders,
    saveOrderPaymentToStore,
    removeOrderFromStore,
  } = useAdminOrders();
  const {
    isOpen: isOrderModalOpen,
    selectedOrder,
    isPaid,
    hasPaymentChanged,
    openOrderModal,
    closeOrderModal,
    setIsPaid,
  } = useOrderModal();
  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const {
    page,
    totalPages,
    currentItems: currentPageOrders,
    goToPage,
  } = usePagination({ items: orders, perPage: ORDER_PER_PAGE });

  const handleUpdateOrderPayment = async () => {
    if (!selectedOrder?.id || !hasPaymentChanged || isSavingOrder) return;

    setIsSavingOrder(true);
    start();

    try {
      await updateOrder(selectedOrder.id, { is_paid: isPaid });
      saveOrderPaymentToStore(selectedOrder.id, isPaid);
      closeOrderModal();
      success('訂單付款狀態已更新');
    } catch (error) {
      showError(
        extractErrorMessage(error, null, '更新訂單付款狀態失敗，請稍後再試。'),
      );
    } finally {
      setIsSavingOrder(false);
      stop();
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget?.id) return;

    start();

    try {
      await deleteOrder(deleteTarget.id);
      removeOrderFromStore(deleteTarget.id);
      closeDeleteModal();
      success('訂單刪除成功');
    } catch (error) {
      showError(
        extractErrorMessage(error, null, '刪除訂單失敗，請稍後再試。'),
      );
    } finally {
      stop();
    }
  };

  useEffect(() => {
    fetchOrders().catch((error) => {
      showError(
        extractErrorMessage(error, null, '取得訂單列表失敗，請稍後再試。'),
      );
    });
  }, [fetchOrders, showError]);

  return (
    <>
      <div className="admin-resource-page admin-resource-page--order admin-orders-page py-1">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-heading__title">訂單列表</h1>
            <p className="admin-page-heading__description">
              查閱訂單、付款狀態、商品明細與顧客聯絡資訊
            </p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">訂單快速總覽</h4>
              <p className="text-muted small mb-0">
                共 {orders.length} 筆訂單，本頁顯示 {currentPageOrders.length} 筆
              </p>
            </div>
          </div>

          <div className="admin-panel__body">
            <OrdersTable
              orders={currentPageOrders}
              hasOrders={orders.length > 0}
              openOrderModal={openOrderModal}
              openDeleteModal={openDeleteModal}
            />
          </div>

          {totalPages > 1 && (
            <div className="admin-panel__footer d-flex justify-content-center">
              <BrandPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
                ariaLabel="訂單分頁導覽"
              />
            </div>
          )}
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        order={selectedOrder}
        isPaid={isPaid}
        hasPaymentChanged={hasPaymentChanged}
        isSaving={isSavingOrder}
        onPaidChange={setIsPaid}
        onClose={closeOrderModal}
        onConfirm={handleUpdateOrderPayment}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteOrder}
        itemName={deleteTarget?.id ? `#${deleteTarget.id}` : ''}
        itemType="訂單"
      />
    </>
  );
};

export default OrdersPage;
