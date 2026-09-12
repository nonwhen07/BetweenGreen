import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// components
import ReadonlyOrderItems from '@/components/front/Cart/ReadonlyOrderItems';
import BrandPagination from '@/components/shared/BrandPagination';
// services
import { getOrders } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { normalizeOrderItems } from '@/utils/order/orderItemUtils';
import { extractErrorMessage } from '@/utils/errorHandler';
import { calculateCartTotal, getShippingPricing } from '@/utils/cartUtils';

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

const formatDate = (timestamp) => {
  if (!timestamp) return '—';

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// TODO: CustomerOrders UI refinement
// Desktop 評估改為 2 欄 compact order cards，降低 10 筆訂單造成的頁面高度。
// Order Card 預設只顯示訂單編號、日期、付款狀態、商品數量、金額與商品縮圖預覽，
// 完整 ReadonlyOrderItems 改為展開式詳情或獨立 Order Detail。
// 同時評估加入 All / Unpaid / Paid filter chips、訂單統計摘要與狀態 accent，
// 增加資訊層級與 Between Green 品牌感；Mobile 維持單欄，Pad 視寬度決定 1 / 2 欄。

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

  const handlePageChange = (page) => {
    if (page === currentPage) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    fetchOrders(currentPage);

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [currentPage]);

  return (
    <div className="customer-orders container ui-container py-5">
      <header className="customer-orders__hero text-center">
        <h1 className="page-title">顧客歷次訂單查詢</h1>
      </header>

      {errorMessage ? (
        <div className="cart-state-card cart-state-card--error card">
          <h2 className="cart-state-card__title">暫時無法取得訂單資料</h2>

          <p className="cart-state-card__description">可能是網路連線不穩或系統忙碌，請稍後再試。</p>

          <div className="cart-state-card__actions">
            <button
              type="button"
              className="ui-btn ui-btn--primary"
              onClick={() => fetchOrders(currentPage)}
            >
              重新整理
            </button>
          </div>
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="cart-state-card cart-state-card--empty card">
          <h2 className="cart-state-card__title">目前沒有訂單資料</h2>

          <p className="cart-state-card__description">完成購買後，訂單紀錄會顯示在這裡。</p>

          <div className="cart-state-card__actions">
            <Link to="/products" className="ui-btn ui-btn--primary">
              去逛商品
            </Link>
          </div>
        </div>
      ) : (
        <>
          <BrandPagination
            currentPage={currentPage}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={handlePageChange}
            className="customer-orders__pagination customer-orders__pagination--top"
            ariaLabel="訂單列表上方分頁"
          />

          <div className="customer-orders__list">
            {sortedOrders.map((order, index) => {
              const orderProducts = normalizeOrderItems(order.products);
              const isPaid = order.is_paid;
              const orderId = order.id;
              const discountedItemsTotal = calculateCartTotal(orderProducts);
              const { paymentTotal } = getShippingPricing(discountedItemsTotal);
              const orderAmount =
                orderProducts.length > 0 ? paymentTotal : (order.final_total ?? order.total ?? 0);

              const paymentAction = isPaid ? (
                <Link
                  to={`/checkout-success/${orderId}`}
                  className="ui-btn ui-btn--outline-primary"
                >
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
                <section
                  key={orderId}
                  className="customer-order-card card p-3"
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 50, 200)}
                >
                  <div className="customer-order-card__header d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
                    <div className="customer-order-card__identity text-lg-start">
                      <h2 className="customer-order-card__title mb-2">訂單編號：{orderId}</h2>

                      <p className="customer-order-card__meta mb-1">
                        收件人：{order.user?.name || '—'} 、 建立日期：
                        {formatDate(order.create_at)}
                      </p>
                    </div>

                    <div className="customer-order-card__status-group text-lg-end">
                      <span
                        className={`customer-order-card__status badge ${
                          isPaid ? 'text-bg-success' : 'text-bg-warning'
                        }`}
                      >
                        {isPaid ? '已付款' : '未付款'}
                      </span>

                      <p className="customer-order-card__amount mt-2 mb-0">
                        訂單金額：NT$ {Math.round(orderAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <ReadonlyOrderItems
                    items={orderProducts}
                    emptyTitle="此訂單沒有商品明細"
                    emptyDescription="目前無法顯示這筆訂單的商品資料。"
                  />

                  <div className="customer-order-card__actions ui-action-group">
                    <Link to="/products" className="ui-btn ui-btn--outline-primary">
                      繼續購物
                    </Link>

                    {paymentAction}
                  </div>
                </section>
              );
            })}
          </div>

          <BrandPagination
            currentPage={currentPage}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={handlePageChange}
            className="customer-orders__pagination customer-orders__pagination--bottom"
            ariaLabel="訂單列表下方分頁"
          />
        </>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
