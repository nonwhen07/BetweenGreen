import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// constants
import { ORDER_PER_PAGE } from '@/constants/orderConstants';
// services
import { deleteOrder, updateOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { useOrderHealth } from '@/hooks/order/useOrderHealth';
import { useOrderModal } from '@/hooks/order/useOrderModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import BrandPagination from '@/components/shared/BrandPagination';
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DeleteModal from '@/components/admin/DeleteModal';
import OrderModal from '@/components/admin/order/OrderModal';
import OrderHealthToolbar from '@/components/admin/order/OrderHealthToolbar';
import OrdersTable from '@/components/admin/order/OrdersTable';

const OrdersPage = () => {
  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();
  const { orders, fetchOrders, saveOrderPaymentToStore, removeOrderFromStore } = useAdminOrders();
  const { summary: healthSummary, results: healthResults, issueGroups } = useOrderHealth(orders);
  const {
    activities: orderActivities,
    addActivity,
    markActivityReviewed,
  } = useAdminActivities({ module: 'order' });
  const [searchParams, setSearchParams] = useSearchParams();
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

  const requestedHealthFilter = searchParams.get('health') || 'all';
  const validHealthFilters = ['all', 'error', 'warning', 'healthy', 'paid', 'unpaid'];
  const healthFilter = validHealthFilters.includes(requestedHealthFilter)
    ? requestedHealthFilter
    : 'all';
  const issueFilter = searchParams.get('issue') || '';

  const filteredOrders = useMemo(() => {
    return orders.filter((order, index) => {
      const orderHealth = healthResults[index];
      const matchHealth =
        healthFilter === 'all' ||
        (healthFilter === 'paid' && order.is_paid === true) ||
        (healthFilter === 'unpaid' && order.is_paid === false) ||
        orderHealth?.status === healthFilter;
      const matchIssue =
        !issueFilter || orderHealth?.issues.some((issue) => issue.code === issueFilter);

      return matchHealth && matchIssue;
    });
  }, [healthFilter, healthResults, issueFilter, orders]);

  const {
    page,
    totalPages,
    currentItems: currentPageOrders,
    goToPage,
    resetPage,
  } = usePagination({ items: filteredOrders, perPage: ORDER_PER_PAGE });

  const handleHealthFilterChange = (nextHealthFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('issue');

    if (nextHealthFilter === 'all') nextSearchParams.delete('health');
    else nextSearchParams.set('health', nextHealthFilter);

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleIssueFilterChange = (nextIssueFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('health');

    if (nextIssueFilter) nextSearchParams.set('issue', nextIssueFilter);
    else nextSearchParams.delete('issue');

    setSearchParams(nextSearchParams, { replace: true });
  };

  const recordOrderActivity = async ({ action, status, order, message }) => {
    const isSuccess = status === 'success';

    try {
      await addActivity({
        module: 'order',
        action,
        status,
        totalCount: 1,
        successCount: isSuccess ? 1 : 0,
        errorCount: isSuccess ? 0 : 1,
        isReviewed: isSuccess,
        details: isSuccess
          ? []
          : [
              {
                id: order?.id || '',
                title: order?.id ? `#${order.id}` : '未知訂單',
                message,
              },
            ],
      });
    } catch {
      warning('訂單操作結果未能保存至操作紀錄');
    }
  };

  const handleUpdateOrderPayment = async () => {
    if (!selectedOrder?.id || !hasPaymentChanged || isSavingOrder) return;

    setIsSavingOrder(true);
    start();

    try {
      await updateOrder(selectedOrder.id, { is_paid: isPaid });
      saveOrderPaymentToStore(selectedOrder.id, isPaid);
      closeOrderModal();
      await recordOrderActivity({
        action: 'update',
        status: 'success',
        order: selectedOrder,
      });
      success('訂單付款狀態已更新');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '更新訂單付款狀態失敗，請稍後再試。');
      showError(errorMessage);
      await recordOrderActivity({
        action: 'update',
        status: 'error',
        order: selectedOrder,
        message: errorMessage,
      });
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
      await recordOrderActivity({
        action: 'delete',
        status: 'success',
        order: deleteTarget,
      });
      success('訂單刪除成功');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除訂單失敗，請稍後再試。');
      showError(errorMessage);
      await recordOrderActivity({
        action: 'delete',
        status: 'error',
        order: deleteTarget,
        message: errorMessage,
      });
    } finally {
      stop();
    }
  };

  useEffect(() => {
    fetchOrders().catch((error) => {
      showError(extractErrorMessage(error, null, '取得訂單列表失敗，請稍後再試。'));
    });
  }, [fetchOrders, showError]);

  useEffect(() => {
    resetPage();
  }, [healthFilter, issueFilter, resetPage]);

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

        <OrderHealthToolbar
          summary={healthSummary}
          issueGroups={issueGroups}
          healthFilter={healthFilter}
          issueFilter={issueFilter}
          onHealthFilterChange={handleHealthFilterChange}
          onIssueFilterChange={handleIssueFilterChange}
        />

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">訂單快速總覽</h4>
              <p className="text-muted small mb-0">
                篩選結果共 {filteredOrders.length} 筆，本頁顯示 {currentPageOrders.length} 筆
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

        <AdminActivityPanel
          sectionId="order-activity"
          title="訂單操作紀錄"
          description="查看付款狀態更新與刪除結果，並確認需要處理的失敗操作"
          activities={orderActivities}
          showFilters
          showDetails
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
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
