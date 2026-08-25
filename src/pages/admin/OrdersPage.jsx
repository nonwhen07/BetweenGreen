import { useEffect, useState } from 'react';

// services
import { getAdminOrders, deleteOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import BrandPagination from '@/components/shared/BrandPagination';
import DeleteModal from '@/components/admin/DeleteModal';

const formatCurrency = (value = 0) => {
  return Math.round(Number(value || 0)).toLocaleString();
};

const OrdersPage = () => {
  // hooks init
  const { success, showError } = useToast();
  const { start, stop } = useLoading();

  // states
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const [tempOrder, setTempOrder] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const orderCount = orders?.length || 0;

  // 取得訂單
  const getOrders = async (page = 1) => {
    start();
    try {
      const res = await getAdminOrders(page);
      setOrders(res.data);
      setPageInfo(res.pagination);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      stop();
    }
  };

  // 刪除
  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(tempOrder.id);
      success('訂單刪除成功');
      setIsDeleteModalOpen(false);
      getOrders(pageInfo.current_page);
    } catch (error) {
      showError(extractErrorMessage(error));
    }
  };

  useEffect(() => {
    getOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="admin-resource-page admin-resource-page--order admin-orders-page py-1">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-heading__title">訂單列表</h1>
            <p className="admin-page-heading__description">
              查閱訂單、付款狀態與顧客聯絡資訊
            </p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">訂單快速總覽</h4>
              <p className="text-muted small mb-0">
                本頁共 {orderCount} 筆訂單資料
              </p>
            </div>
          </div>

          <div className="admin-panel__body">
            {orderCount === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-2">目前尚無訂單資料</p>
                <small className="text-secondary">
                  顧客完成結帳後，訂單資料會顯示在此處
                </small>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="table admin-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th width="32%">訂單編號</th>
                      <th width="22%">顧客信箱</th>
                      <th width="14%">訂單金額</th>
                      <th width="12%">付款狀態</th>
                      <th width="20%">操作</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <code className="admin-order-id" title={order.id}>
                            {order.id}
                          </code>
                        </td>

                        <td>
                          <span
                            className="admin-order-email"
                            title={order.user?.email || '未提供信箱'}
                          >
                            {order.user?.email || '未提供信箱'}
                          </span>
                        </td>

                        <td className="text-nowrap">
                          NT$ {formatCurrency(order.total)}
                        </td>

                        <td className="text-nowrap">
                          {order.is_paid ? (
                            <span className="badge text-bg-success">已付款</span>
                          ) : (
                            <span className="badge text-bg-warning">未付款</span>
                          )}
                        </td>

                        <td>
                          <div className="btn-group admin-table__actions">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setTempOrder(order);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {orderCount > 0 && (
            <div className="admin-panel__footer d-flex justify-content-center">
              <BrandPagination
                currentPage={pageInfo.current_page || 1}
                totalPages={pageInfo.total_pages || 1}
                onPageChange={getOrders}
                ariaLabel="訂單分頁導覽"
              />
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        title="刪除訂單"
        message={
          <>
            是否刪除訂單
            <span className="text-danger fw-bold">#{tempOrder.id}</span>
          </>
        }
      />
    </>
  );
};

export default OrdersPage;
