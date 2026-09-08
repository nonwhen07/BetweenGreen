import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// constants
import { ORDER_PER_PAGE, ORDER_UNPAID_AGE_FILTERS } from '@/constants/orderConstants';
// services
import { deleteOrder, updateOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAdminDataFreshness } from '@/hooks/useAdminDataFreshness';
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { useOrderExport } from '@/hooks/order/useOrderExport';
import { useOrderHealth } from '@/hooks/order/useOrderHealth';
import { useOrderModal } from '@/hooks/order/useOrderModal';
import { useOrderProductLookup } from '@/hooks/order/useOrderProductLookup';
import { useOrderQuarterlyAnalytics } from '@/hooks/order/useOrderQuarterlyAnalytics';
import { useOrderUnpaidAging } from '@/hooks/order/useOrderUnpaidAging';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
import { filterOrdersBySearch, getOrderDateRangeError } from '@/utils/order/orderFilter';
// components
import BrandPagination from '@/components/shared/BrandPagination';
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DeleteModal from '@/components/admin/DeleteModal';
import OrderModal from '@/components/admin/order/OrderModal';
import OrderExportModal from '@/components/admin/order/OrderExportModal';
import OrderHealthToolbar from '@/components/admin/order/OrderHealthToolbar';
import OrderQuarterlyReport from '@/components/admin/order/OrderQuarterlyReport';
import OrderSearchToolbar from '@/components/admin/order/OrderSearchToolbar';
import OrdersTable from '@/components/admin/order/OrdersTable';
import AdminDataFreshness from '@/components/admin/AdminDataFreshness';
import AdminCollapsibleSection from '@/components/admin/AdminCollapsibleSection';

const OrdersPage = () => {
  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();
  const {
    orders,
    status: orderStatus,
    lastFetchedAt: orderLastFetchedAt,
    fetchOrders,
    refreshOrders,
    saveOrderPaymentToStore,
    removeOrderFromStore,
  } = useAdminOrders();
  const { productLookup, productCatalogStatus, ensureProductCatalog } = useOrderProductLookup();
  const {
    isOpen: isOrderExportModalOpen,
    periodType: exportPeriodType,
    month: exportMonth,
    year: exportYear,
    quarter: exportQuarter,
    period: exportPeriod,
    previewCount: exportPreviewCount,
    isConfirmed: isExportConfirmed,
    isProcessing: isExportProcessing,
    canExport,
    openExportModal,
    closeExportModal,
    changePeriodType: changeExportPeriodType,
    changeMonth: changeExportMonth,
    changeYear: changeExportYear,
    changeQuarter: changeExportQuarter,
    setIsConfirmed: setIsExportConfirmed,
    executeExport: executeOrderExport,
  } = useOrderExport({ orders, refreshOrders });
  const {
    summary: healthSummary,
    byOrderId: healthByOrderId,
    issueGroups,
  } = useOrderHealth(orders);
  const {
    activities: orderActivities,
    addActivity,
    markActivityReviewed,
  } = useAdminActivities({ module: 'order', reviewedLimit: 5 });
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
  const orderFreshness = useAdminDataFreshness({
    resourceLabel: '訂單',
    lastFetchedAt: orderLastFetchedAt,
    status: orderStatus,
    refreshData: refreshOrders,
    isInteractionLocked: isOrderModalOpen || isOrderExportModalOpen || isDeleteModalOpen,
  });
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const {
    analytics: quarterlyAnalytics,
    quarterOptions,
    selectedQuarter,
    allOverdueUnpaidCount,
  } = useOrderQuarterlyAnalytics(orders, searchParams.get('quarter') || '');
  const { summary: agingSummary, byOrderId: agingByOrderId } = useOrderUnpaidAging(orders);

  const requestedHealthFilter = searchParams.get('health') || 'all';
  const validHealthFilters = ['all', 'error', 'warning', 'healthy', 'paid', 'unpaid'];
  const healthFilter = validHealthFilters.includes(requestedHealthFilter)
    ? requestedHealthFilter
    : 'all';
  const issueFilter = searchParams.get('issue') || '';
  const keyword = searchParams.get('q') || '';
  const dateFrom = searchParams.get('from') || '';
  const dateTo = searchParams.get('to') || '';
  const requestedAgingFilter = searchParams.get('aging') || '';
  const validAgingFilters = Object.values(ORDER_UNPAID_AGE_FILTERS);
  const agingFilter = validAgingFilters.includes(requestedAgingFilter) ? requestedAgingFilter : '';
  const dateRangeError = getOrderDateRangeError(dateFrom, dateTo);

  const filteredOrders = useMemo(() => {
    const searchFilteredOrders = filterOrdersBySearch(orders, {
      keyword,
      dateFrom,
      dateTo,
    });
    return searchFilteredOrders.filter((order) => {
      const orderHealth = healthByOrderId[order.id];
      const matchHealth =
        healthFilter === 'all' ||
        (healthFilter === 'paid' && order.is_paid === true) ||
        (healthFilter === 'unpaid' && order.is_paid === false) ||
        orderHealth?.status === healthFilter;
      const matchIssue =
        !issueFilter || orderHealth?.issues.some((issue) => issue.code === issueFilter);
      const matchAging = !agingFilter || agingByOrderId[order.id]?.level === agingFilter;

      return matchHealth && matchIssue && matchAging;
    });
  }, [
    agingByOrderId,
    agingFilter,
    dateFrom,
    dateTo,
    healthByOrderId,
    healthFilter,
    issueFilter,
    keyword,
    orders,
  ]);

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
    nextSearchParams.delete('aging');

    if (nextHealthFilter === 'all') nextSearchParams.delete('health');
    else nextSearchParams.set('health', nextHealthFilter);

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleIssueFilterChange = (nextIssueFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('health');
    nextSearchParams.delete('aging');

    if (nextIssueFilter) nextSearchParams.set('issue', nextIssueFilter);
    else nextSearchParams.delete('issue');

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleAgingFilterChange = (nextAgingFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('health');
    nextSearchParams.delete('issue');

    if (nextAgingFilter) nextSearchParams.set('aging', nextAgingFilter);
    else nextSearchParams.delete('aging');

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleSearchParamChange = (key, value) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    const normalizedValue = key === 'q' ? value : value.trim();

    if (normalizedValue) nextSearchParams.set(key, normalizedValue);
    else nextSearchParams.delete(key);

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleResetSearch = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('q');
    nextSearchParams.delete('from');
    nextSearchParams.delete('to');
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleQuarterChange = (nextQuarter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('quarter', nextQuarter);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const recordOrderActivity = async ({
    action,
    status,
    order,
    message,
    totalCount = 1,
    activityTitle,
  }) => {
    const isSuccess = status === 'success';

    try {
      await addActivity({
        module: 'order',
        action,
        status,
        totalCount,
        successCount: isSuccess ? totalCount : 0,
        errorCount: isSuccess ? 0 : totalCount,
        isReviewed: isSuccess,
        details: isSuccess
          ? []
          : [
              {
                id: order?.id || '',
                title: activityTitle || (order?.id ? `#${order.id}` : '未知訂單'),
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

  const handleExportOrders = async () => {
    if (!canExport) return;

    start();

    try {
      const result = await executeOrderExport();
      if (!result) return;

      if (result.status === 'empty') {
        warning(`${result.period.label}沒有可匯出的訂單資料`);
        return;
      }

      await recordOrderActivity({
        action: 'export',
        status: 'success',
        totalCount: result.total,
      });
      success(`已匯出 ${result.period.label}，共 ${result.total} 筆訂單資料`);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '匯出訂單 JSON 失敗，請稍後再試。');
      showError(errorMessage);
      await recordOrderActivity({
        action: 'export',
        status: 'error',
        message: errorMessage,
        activityTitle: exportPeriod ? `${exportPeriod.label}訂單匯出` : '訂單匯出',
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
    ensureProductCatalog().catch(() => {
      warning('商品圖片資料載入失敗，訂單內容仍可正常查看');
    });
  }, [ensureProductCatalog, warning]);

  useEffect(() => {
    resetPage();
  }, [agingFilter, dateFrom, dateTo, healthFilter, issueFilter, keyword, resetPage]);

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

        <AdminDataFreshness {...orderFreshness} onRefresh={orderFreshness.refreshCurrentData} />

        <AdminCollapsibleSection
          sectionId="order-health-filter"
          title="訂單健康與篩選"
          summary={`顯示 ${filteredOrders.length}／${orders.length} 筆${
            keyword || dateFrom || dateTo || agingFilter || healthFilter !== 'all' || issueFilter
              ? '，已套用篩選'
              : '，未套用篩選'
          }`}
        >
          <OrderHealthToolbar
            summary={healthSummary}
            issueGroups={issueGroups}
            healthFilter={healthFilter}
            issueFilter={issueFilter}
            isAgingFilterActive={Boolean(agingFilter)}
            onHealthFilterChange={handleHealthFilterChange}
            onIssueFilterChange={handleIssueFilterChange}
          />

          <OrderSearchToolbar
            keyword={keyword}
            dateFrom={dateFrom}
            dateTo={dateTo}
            agingFilter={agingFilter}
            agingSummary={agingSummary}
            dateRangeError={dateRangeError}
            resultCount={filteredOrders.length}
            totalCount={orders.length}
            onKeywordChange={(value) => handleSearchParamChange('q', value)}
            onDateFromChange={(value) => handleSearchParamChange('from', value)}
            onDateToChange={(value) => handleSearchParamChange('to', value)}
            onAgingFilterChange={handleAgingFilterChange}
            onReset={handleResetSearch}
          />
        </AdminCollapsibleSection>

        <AdminCollapsibleSection
          sectionId="order-quarterly-analytics"
          title="季度訂單分析"
          summary={`${quarterlyAnalytics.period?.label || selectedQuarter}：${
            quarterlyAnalytics.summary.orderCount
          } 筆訂單，付款率 ${quarterlyAnalytics.summary.paymentRate}%`}
        >
          <OrderQuarterlyReport
            analytics={quarterlyAnalytics}
            quarterOptions={quarterOptions}
            selectedQuarter={selectedQuarter}
            allOverdueUnpaidCount={allOverdueUnpaidCount}
            onQuarterChange={handleQuarterChange}
          />
        </AdminCollapsibleSection>

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">訂單快速總覽</h4>
              <p className="text-muted small mb-0">
                篩選結果共 {filteredOrders.length} 筆，本頁顯示 {currentPageOrders.length} 筆
              </p>
            </div>

            <div className="admin-panel__actions">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={openExportModal}
              >
                匯出訂單 JSON
              </button>
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
            <div className="admin-panel__footer">
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
          description="查看付款狀態更新、刪除與 JSON 匯出結果"
          activities={orderActivities}
          showFilters
          showDetails
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
      </div>

      <OrderExportModal
        isOpen={isOrderExportModalOpen}
        periodType={exportPeriodType}
        month={exportMonth}
        year={exportYear}
        quarter={exportQuarter}
        period={exportPeriod}
        previewCount={exportPreviewCount}
        isConfirmed={isExportConfirmed}
        isProcessing={isExportProcessing}
        canExport={canExport}
        onPeriodTypeChange={changeExportPeriodType}
        onMonthChange={changeExportMonth}
        onYearChange={changeExportYear}
        onQuarterChange={changeExportQuarter}
        onConfirmChange={setIsExportConfirmed}
        onClose={closeExportModal}
        onExport={handleExportOrders}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        order={selectedOrder}
        productLookup={productLookup}
        isProductCatalogReady={productCatalogStatus === 'success'}
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
