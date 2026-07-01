import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// components
import ProductImage from '@/components/ProductImage';
// services
import { getOrders } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const normalizeOrders = (orders) => {
  if (!orders) return [];

  if (Array.isArray(orders)) {
    return orders;
  }

  return Object.entries(orders).map(([id, order]) => ({
    id,
    ...order,
  }));
};

const getOrderProducts = (order) => {
  if (!order?.products) return [];

  if (Array.isArray(order.products)) {
    return order.products;
  }

  return Object.entries(order.products).map(([id, item]) => ({
    id,
    ...item,
  }));
};

const formatDate = (timestamp) => {
  if (!timestamp) return '—';

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const CustomerOrdersPage = () => {
  const navigate = useNavigate();

  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => (b.create_at || 0) - (a.create_at || 0));
  }, [orders]);

  const fetchOrders = async (page = 1) => {
    start();

    try {
      const res = await getOrders(page);

      setOrders(normalizeOrders(res.data));
      setPagination(res.pagination);
      setErrorMessage('');
    } catch (error) {
      const message = extractErrorMessage(error, setErrorMessage, '取得歷次訂單失敗。');
      showError(message);
    } finally {
      stop();
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [currentPage]);

  return (
    <div className="container ui-container py-5">
      <div className="cart-hero text-center mb-4">
        <h1 className="page-title">顧客歷次訂單查詢</h1>
      </div>

      {errorMessage && (
        <div className="card p-4 text-center mb-4">
          <h2 className="h5 mb-2">暫時無法取得訂單資料</h2>
          <p className="text-muted mb-3">可能是網路連線不穩或系統忙碌，請稍後再試。</p>
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            onClick={() => fetchOrders(currentPage)}
          >
            重新整理
          </button>
        </div>
      )}

      {sortedOrders.length === 0 ? (
        <div className="card p-4 text-center">
          <h2 className="mb-3">目前沒有訂單資料</h2>
          <Link to="/products" className="ui-btn ui-btn--primary">
            去逛商品
          </Link>
        </div>
      ) : (
        <div className="customer-orders">
          {sortedOrders.map((order) => {
            const orderProducts = getOrderProducts(order);
            const isPaid = order.is_paid;
            const orderId = order.id;
            const orderAmount = order.final_total ?? order.total ?? 0;
            const paymentAction = isPaid ? (
              <Link to={`/checkout-success/${orderId}`} className="ui-btn ui-btn--outline-primary">
                查看付款完成
              </Link>
            ) : (
              <button
                type="button"
                className="ui-btn ui-btn--primary"
                onClick={() => navigate(`/checkout-payment/${orderId}`)}
              >
                前往付款
              </button>
            );

            return (
              <section key={orderId} className="card customer-order-card p-3 mb-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
                  <div className="text-lg-start">
                    <h2 className="h5 mb-2">訂單編號：{orderId}</h2>
                    <p className="mb-1 text-muted">
                      收件人：{order.user?.name || '—'} 、 建立日期：{formatDate(order.create_at)}
                    </p>
                  </div>

                  <div className="text-lg-end">
                    <span className={`badge ${isPaid ? 'text-bg-success' : 'text-bg-warning'}`}>
                      {isPaid ? '已付款' : '未付款'}
                    </span>
                    <p className="mt-2 mb-0 fw-bold">
                      訂單金額：NT$ {Math.round(orderAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="table-responsive checkout-carttable">
                  <table className="table cart-table align-middle">
                    <thead className="cart-table__header">
                      <tr>
                        <th className="cart-table__col--info">商品名稱</th>
                        <th className="cart-table__col--image">圖片</th>
                        <th className="cart-table__col--price">單價</th>
                        <th className="cart-table__col--qty">數量</th>
                        <th className="cart-table__col--subtotal">小計</th>
                      </tr>
                    </thead>

                    <tbody className="cart-table__body">
                      {orderProducts.map((item) => (
                        <tr key={item.id}>
                          <td className="cart-table__col--info">
                            {item.product?.title || `商品 ID：${item.product_id || '—'}`}
                          </td>
                          <td className="cart-table__col--image">
                            <ProductImage
                              src={item.product?.imageUrl}
                              alt={item.product?.title || `商品 ID：${item.product_id || '—'}`}
                              size="small"
                            />
                          </td>
                          <td className="cart-table__col--price">
                            NT$ {Number(item.product?.price || 0).toLocaleString()}
                          </td>
                          <td className="cart-table__col--qty">
                            {item.qty}
                            {item.product?.unit || ''}
                          </td>
                          <td className="cart-table__col--subtotal">
                            NT$ {Number(item.final_total ?? item.total ?? 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Link to="/products" className="ui-btn ui-btn--outline-primary">
                    繼續購物
                  </Link>

                  {paymentAction}
                </div>
              </section>
            );
          })}

          {pagination?.total_pages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {Array.from({ length: pagination.total_pages }).map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    className={`ui-btn ${isActive ? 'ui-btn--primary' : 'ui-btn--outline-primary'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
