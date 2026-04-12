import { useEffect, useState } from 'react';
import { getAdminOrders, deleteOrder } from '@/services/orderService';

import Pagination from '@/components/Pagination';
import DeleteModal from '@/components/admin/DeleteModal';
import PageLoader from '@/components/PageLoader';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/utils/apiErrorHandler';

function OrdersPage() {
  const { success, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [tempOrder, setTempOrder] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 取得訂單
  const getOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await getAdminOrders(page);
      setOrders(res.orders);
      setPageInfo(res.pagination);
    } catch (error) {
      showError(handleApiError(error));
    } finally {
      setIsLoading(false);
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
      showError(handleApiError(error));
    }
  };

  useEffect(() => {
    getOrders(1);
  }, []);

  return (
    <>
      <div className="container py-5">
        <h2>訂單列表</h2>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>用戶</th>
              <th>金額</th>
              <th>付款狀態</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.email}</td>
                <td>{order.total}</td>
                <td>{order.is_paid ? <span className="text-success">已付款</span> : '未付款'}</td>

                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setTempOrder(order);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pageInfo={pageInfo} handlePageChange={getOrders} />
      </div>

      <PageLoader show={isLoading} />

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
}

export default OrdersPage;
