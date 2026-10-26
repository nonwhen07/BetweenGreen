import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  PackageSearch,
  ReceiptText,
  ShoppingBag,
  UserRound,
} from 'lucide-react';

// components
import ReadonlyOrderItems from '@/components/front/Cart/ReadonlyOrderItems';
import BrandPagination from '@/components/shared/BrandPagination';
import PageHero from '@/components/shared/PageHero';
// 暫用既有素材，正式子頁圖片留待集中圖片整合時替換。
import { SITE_ASSETS } from '@/constants/siteAssets';
// services
import { getOrders } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { normalizeOrderItems } from '@/utils/order/orderItemUtils';
import { extractErrorMessage } from '@/utils/errorHandler';
import { calculateCartFinalTotal, getShippingPricing } from '@/utils/cartUtils';

const normalizeOrders = (orders) => {
  const normalizedOrders = Array.isArray(orders)
    ? orders
    : Object.entries(orders || {}).map(([id, order]) => ({
        ...order,
        id: order?.id || id,
      }));

  return normalizedOrders.filter((order) => order && typeof order === 'object');
};

const formatDate = (timestamp) => {
  if (!timestamp) return '—';

  const date = new Date(Number(timestamp) * 1000);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatCurrency = (value = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? Math.round(number).toLocaleString('zh-TW') : '0';
};

const isOrderPaid = (order) => order?.is_paid === true || Number(order?.is_paid) === 1;

const CustomerOrdersPage = () => {
  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const requestControllerRef = useRef(null);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => Number(b.create_at || 0) - Number(a.create_at || 0));
  }, [orders]);

  const pageStats = useMemo(() => {
    return sortedOrders.reduce(
      (stats, order) => {
        if (isOrderPaid(order)) stats.paid += 1;
        else stats.unpaid += 1;

        return stats;
      },
      { total: sortedOrders.length, paid: 0, unpaid: 0 },
    );
  }, [sortedOrders]);

  const fetchOrders = useCallback(
    async (page = 1) => {
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      requestControllerRef.current = controller;

      setIsFetchingOrders(true);
      setErrorMessage('');
      start();

      try {
        const res = await getOrders(page, { signal: controller.signal });

        if (requestControllerRef.current !== controller) return;

        setOrders(normalizeOrders(res.data));
        setPagination(res.pagination || null);
      } catch (error) {
        if (error.code === 'ERR_CANCELED') return;
        if (requestControllerRef.current !== controller) return;

        const message = extractErrorMessage(error, setErrorMessage, '取得歷次訂單失敗。');
        showError(message);
      } finally {
        stop();

        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
          setIsFetchingOrders(false);
        }
      }
    },
    [showError, start, stop],
  );

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    fetchOrders(currentPage);

    return () => {
      const controller = requestControllerRef.current;

      if (!controller) return;

      controller.abort();
      requestControllerRef.current = null;
    };
  }, [currentPage, fetchOrders]);

  return (
    <>
      <PageHero
        eyebrow="Order History"
        title="歷次訂單"
        titleId="customer-orders-page-title"
        text="查看訂單內容、付款狀態與後續操作。"
        backgroundAsset={SITE_ASSETS.ordersHero}
        imagePosition="center 58%"
        variant="subpage"
        className="page-hero--orders"
      />
      <div className="customer-orders container ui-container">

        {isFetchingOrders && sortedOrders.length === 0 ? (
          <div className="cart-state-card cart-state-card--loading">
            <PackageSearch size={32} className="cart-state-card__icon" aria-hidden="true" />
            <h2 className="cart-state-card__title">訂單資料載入中</h2>
            <p className="cart-state-card__description">正在整理您的歷次訂單，請稍候。</p>
          </div>
        ) : errorMessage ? (
          <div className="cart-state-card cart-state-card--error">
            <ReceiptText size={32} className="cart-state-card__icon" aria-hidden="true" />
            <h2 className="cart-state-card__title">暫時無法取得訂單資料</h2>
            <p className="cart-state-card__description">{errorMessage}</p>

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
          <div className="cart-state-card cart-state-card--empty">
            <ShoppingBag size={32} className="cart-state-card__icon" aria-hidden="true" />
            <h2 className="cart-state-card__title">目前沒有訂單資料</h2>
            <p className="cart-state-card__description">完成購買後，訂單紀錄會顯示在這裡。</p>

            <div className="cart-state-card__actions">
              <Link to="/products" className="ui-btn ui-btn--primary">
                去逛商品
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="customer-orders__overview" aria-label="本頁訂單摘要">
              <div className="customer-orders__overview-copy">
                <p>Page {currentPage}</p>
                <h2>本頁訂單摘要</h2>
              </div>

              <dl className="customer-orders__stats">
                <div>
                  <dt>本頁訂單</dt>
                  <dd>{pageStats.total}</dd>
                </div>
                <div>
                  <dt>待付款</dt>
                  <dd>{pageStats.unpaid}</dd>
                </div>
                <div>
                  <dt>已付款</dt>
                  <dd>{pageStats.paid}</dd>
                </div>
              </dl>
            </section>

            <div className="customer-orders__list">
              {sortedOrders.map((order, index) => {
                const orderProducts = normalizeOrderItems(order.products);
                const isPaid = isOrderPaid(order);
                const orderId = order.id || '';
                const productCount = orderProducts.reduce(
                  (total, item) => total + Number(item.qty || 0),
                  0,
                );
                const discountedItemsTotal = calculateCartFinalTotal(orderProducts);
                const { paymentTotal } = getShippingPricing(discountedItemsTotal);
                const fallbackAmount = Number(order.final_total ?? order.total ?? 0);
                const orderAmount = orderProducts.length > 0 ? paymentTotal : fallbackAmount;
                const cardKey = orderId || `order-${currentPage}-${index}`;

                return (
                  <article
                    key={cardKey}
                    className={`customer-order-card ${isPaid ? 'is-paid' : 'is-unpaid'}`}
                    data-aos="fade-up"
                    data-aos-delay={Math.min(index * 50, 200)}
                  >
                    <header className="customer-order-card__header">
                      <div className="customer-order-card__identity">
                        <p className="customer-order-card__eyebrow">Order Number</p>
                        <h2 className="customer-order-card__title">{orderId || '訂單編號未提供'}</h2>
                      </div>

                      <span className={`customer-order-card__status ${isPaid ? 'is-paid' : 'is-unpaid'}`}>
                        {isPaid ? (
                          <CheckCircle2 size={16} aria-hidden="true" />
                        ) : (
                          <Clock3 size={16} aria-hidden="true" />
                        )}
                        {isPaid ? '已付款' : '待付款'}
                      </span>
                    </header>

                    <dl className="customer-order-card__summary">
                      <div>
                        <dt>
                          <CalendarDays size={16} aria-hidden="true" />
                          建立日期
                        </dt>
                        <dd>{formatDate(order.create_at)}</dd>
                      </div>
                      <div>
                        <dt>
                          <UserRound size={16} aria-hidden="true" />
                          收件人
                        </dt>
                        <dd>{order.user?.name || '—'}</dd>
                      </div>
                      <div>
                        <dt>
                          <ShoppingBag size={16} aria-hidden="true" />
                          商品數量
                        </dt>
                        <dd>{productCount} 件</dd>
                      </div>
                      <div className="customer-order-card__amount">
                        <dt>
                          <ReceiptText size={16} aria-hidden="true" />
                          訂單金額
                        </dt>
                        <dd>NT$ {formatCurrency(orderAmount)}</dd>
                      </div>
                    </dl>

                    <details className="customer-order-card__details">
                      <summary>
                        <span>查看商品明細</span>
                        <ChevronDown size={18} aria-hidden="true" />
                      </summary>

                      <div className="customer-order-card__details-content">
                        <ReadonlyOrderItems
                          items={orderProducts}
                          variant="cards"
                          emptyTitle="此訂單沒有商品明細"
                          emptyDescription="目前無法顯示這筆訂單的商品資料。"
                        />
                      </div>
                    </details>

                    <div className="customer-order-card__actions">
                      <Link to="/products" className="ui-btn ui-btn--outline-primary">
                        繼續購物
                      </Link>

                      {isPaid ? (
                        orderId ? (
                          <Link to={`/checkout-success/${orderId}`} className="ui-btn ui-btn--primary">
                            查看完成資訊
                          </Link>
                        ) : null
                      ) : orderId ? (
                        <Link to={`/checkout-payment/${orderId}`} className="ui-btn ui-btn--primary">
                          前往付款
                          <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                      ) : (
                        <button type="button" className="ui-btn ui-btn--primary" disabled>
                          缺少訂單編號
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <BrandPagination
              currentPage={currentPage}
              totalPages={pagination?.total_pages ?? 1}
              onPageChange={handlePageChange}
              className="customer-orders__pagination"
              ariaLabel="歷次訂單分頁"
            />
        </>
      )}
    </div>
    </>
  );
};

export default CustomerOrdersPage;


