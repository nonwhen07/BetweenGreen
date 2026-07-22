import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, ClipboardList, PackageCheck, ReceiptText } from 'lucide-react';

// services
import { getOrder } from '@/services/orderService';

// components
import CartSteps from '@/components/front/Cart/CartSteps';
import ProductImage from '@/components/ProductImage';
import ReadonlyOrderItems from '@/components/front/Cart/ReadonlyOrderItems';

// utils
import { getProductUnitShortLabel } from '@/utils/productFormatter';
import { calculateCartFinalTotal, calculateCartTotal } from '@/utils/cartUtils';
import { extractErrorMessage } from '@/utils/errorHandler';
import { normalizeOrderItems } from '@/utils/orderItemUtils';

// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';

const getProductTitle = (item) => {
  return item.product?.title || `商品 ID：${item.product_id || '—'}`;
};

const getProductImage = (item) => {
  return item.product?.imageUrl || '';
};

const getProductPrice = (item) => {
  return Number(item.product?.price || 0);
};

// const getProductUnit = (item) => {
//   return item.product?.unit || '';
// };
const getProductUnit = (item) => {
  return getProductUnitShortLabel(item.product?.unit) || '未設定單位';
};

const getItemTotal = (item) => {
  return Number(item.final_total ?? item.total ?? getProductPrice(item) * Number(item.qty || 0));
};

const formatCurrency = (value = 0) => {
  return Math.round(Number(value || 0)).toLocaleString();
};

const formatDate = (timestamp) => {
  if (!timestamp) return '—';

  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const { orderId: orderIdParam } = useParams();

  const routeState = location.state || {};
  const orderID = routeState.orderId || orderIdParam;

  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [orderData, setOrderData] = useState(null);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stateCarts = useMemo(() => {
    return routeState.carts || [];
  }, [routeState.carts]);

  const orderProducts = useMemo(() => {
    if (stateCarts.length > 0) {
      return stateCarts;
    }

    // return normalizeOrderProducts(orderData?.products);
    return normalizeOrderItems(orderData?.products);
  }, [stateCarts, orderData]);

  const productCount = useMemo(() => {
    return orderProducts.reduce((total, item) => total + Number(item.qty || 0), 0);
  }, [orderProducts]);

  const subtotal = useMemo(() => {
    if (stateCarts.length > 0) {
      return calculateCartTotal(stateCarts);
    }

    return orderProducts.reduce((total, item) => {
      const price = getProductPrice(item);
      const qty = Number(item.qty || 0);

      return total + price * qty;
    }, 0);
  }, [stateCarts, orderProducts]);

  const finalTotal = useMemo(() => {
    if (orderData?.final_total != null || orderData?.total != null) {
      return Number(orderData.final_total ?? orderData.total);
    }

    if (stateCarts.length > 0) {
      return calculateCartFinalTotal(stateCarts);
    }

    return orderProducts.reduce((total, item) => total + getItemTotal(item), 0);
  }, [orderData, stateCarts, orderProducts]);

  const hasDiscount = finalTotal > 0 && subtotal > finalTotal;
  const discountAmount = hasDiscount ? subtotal - finalTotal : 0;

  const userInfo = orderData?.user || {};
  const orderStatusText = orderData?.is_paid ? '已付款' : '付款狀態確認中';

  const fetchOrder = async () => {
    if (!orderID) return;

    setIsFetchingOrder(true);
    start();

    try {
      const res = await getOrder(orderID);
      const order = res.data;

      if (!order || !order.id) {
        setOrderData(null);
        setErrorMessage('查無此訂單，請確認訂單編號是否正確。');
        return;
      }

      setOrderData(order);
      setErrorMessage('');
    } catch (error) {
      const message = extractErrorMessage(error, setErrorMessage, '取得付款完成資料失敗。');
      showError(message);
    } finally {
      setIsFetchingOrder(false);
      stop();
    }
  };

  useEffect(() => {
    fetchOrder();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [orderID]);

  if (!orderID) {
    return (
      <div className="container ui-container py-5 text-center">
        <div className="checkout-success checkout-success--empty">
          <h1 className="page-title mb-3">找不到付款完成資料</h1>
          <p className="text-muted mb-4">缺少訂單編號，請回到商品頁重新操作。</p>

          <Link to="/products" className="ui-btn ui-btn--primary">
            回到商品頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container ui-container ui-container--cart py-5">
      <div className="cart-hero text-center mb-4">
        <h1 className="page-title">付款完成</h1>
      </div>

      <CartSteps currentStep={4} />

      {errorMessage && (
        <section className="checkout-success checkout-success--error card p-4 text-center my-4">
          <h2 className="h5 mb-2">暫時無法取得訂單資料</h2>
          <p className="text-muted mb-3">{errorMessage}</p>
          <div className="d-flex justify-content-center gap-2">
            <button type="button" className="ui-btn ui-btn--primary" onClick={fetchOrder}>
              重新整理
            </button>

            <Link to="/customer-orders" className="ui-btn ui-btn--outline-primary">
              回到歷次訂單
            </Link>
          </div>
        </section>
      )}

      {!errorMessage && (
        <div className="checkout-success mt-4">
          <section className="checkout-success__hero card p-4 text-center" data-aos="fade-up">
            <div className="checkout-success__icon mx-auto mb-3">
              <CheckCircle2 size={40} />
            </div>

            <span className="checkout-success__eyebrow">Payment Complete</span>

            <h2 className="checkout-success__title mb-2">已完成付款，感謝您的購買</h2>

            <p className="checkout-success__text text-muted mb-3">
              我們已收到您的訂單，會盡快為您安排出貨。
            </p>

            <div className="checkout-success__order-code mx-auto">
              <span>訂單編號</span>
              <strong>{orderID}</strong>
            </div>
          </section>

          <section
            className="checkout-success__summary-grid row g-3 mt-3 mx-0 mx-0"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="col-4">
              <article className="checkout-success__summary-card card p-3 h-100">
                <div className="checkout-success__summary-icon">
                  <ReceiptText size={22} />
                </div>

                <div>
                  <p className="checkout-success__summary-label mb-1">付款狀態</p>
                  <h3 className="checkout-success__summary-value mb-0">{orderStatusText}</h3>
                </div>
              </article>
            </div>

            <div className="col-4">
              <article className="checkout-success__summary-card card p-3 h-100">
                <div className="checkout-success__summary-icon">
                  <PackageCheck size={22} />
                </div>

                <div>
                  <p className="checkout-success__summary-label mb-1">商品數量</p>
                  <h3 className="checkout-success__summary-value mb-0">{productCount} 件</h3>
                </div>
              </article>
            </div>

            <div className="col-4">
              <article className="checkout-success__summary-card card p-3 h-100">
                <div className="checkout-success__summary-icon">
                  <ClipboardList size={22} />
                </div>

                <div>
                  <p className="checkout-success__summary-label mb-1">建立日期</p>
                  <h3 className="checkout-success__summary-value mb-0">
                    {formatDate(orderData?.create_at)}
                  </h3>
                </div>
              </article>
            </div>
          </section>

          <section
            className="checkout-success__content row g-4 mt-1 mx-0 mx-0"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="col-lg-8">
              <div className="checkout-success__items card p-3">
                <div className="checkout-success__section-header mb-3">
                  <h3 className="mb-1">本次購買商品</h3>
                  <p className="text-muted mb-0">請確認本次訂單商品與數量。</p>
                </div>

                {isFetchingOrder && orderProducts.length === 0 ? (
                  <div className="checkout-success__empty card p-4 text-center">
                    <h4 className="h5 mb-2">訂單明細載入中</h4>
                    <p className="text-muted mb-0">正在確認付款完成資料，請稍候。</p>
                  </div>
                ) : orderProducts.length > 0 ? (
                  <div className="table-responsive checkout-carttable">
                    <table className="table cart-table align-middle mb-0">
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
                        {orderProducts.map((item) => {
                          const title = getProductTitle(item);
                          const price = getProductPrice(item);
                          const itemTotal = getItemTotal(item);

                          return (
                            <tr key={item.id || item.product_id}>
                              <td className="cart-table__col--info">{title}</td>

                              <td className="cart-table__col--image">
                                <ProductImage
                                  src={getProductImage(item)}
                                  alt={title}
                                  size="small"
                                />
                              </td>

                              <td className="cart-table__col--price">
                                NT$ {price.toLocaleString()}
                              </td>

                              <td className="cart-table__col--qty">
                                <div className="d-flex justify-content-center align-items-center">
                                  <span className="me-2">{item.qty}</span>
                                  <span className="bg-transparent border-0">
                                    {getProductUnit(item)}
                                  </span>
                                </div>
                              </td>

                              <td className="cart-table__col--subtotal">
                                NT$ {formatCurrency(itemTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="checkout-success__empty card p-4 text-center">
                    <h4 className="h5 mb-2">目前沒有商品明細</h4>
                    <p className="text-muted mb-0">您仍可以前往訂單查詢頁確認訂單狀態。</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="checkout-success__aside card p-3">
                <div className="checkout-success__section-header mb-3">
                  <h3 className="mb-1">訂單摘要</h3>
                  <p className="text-muted mb-0">付款與收件資訊</p>
                </div>

                <div className="checkout-success__info-list">
                  <div className="checkout-success__info-row">
                    <span>訂單狀態</span>
                    <strong>{orderStatusText}</strong>
                  </div>

                  <div className="checkout-success__info-row">
                    <span>商品小計</span>
                    <strong>NT$ {formatCurrency(subtotal)}</strong>
                  </div>

                  {hasDiscount && (
                    <div className="checkout-success__info-row">
                      <span>優惠折抵</span>
                      <strong>- NT$ {formatCurrency(discountAmount)}</strong>
                    </div>
                  )}

                  <div className="checkout-success__info-row checkout-success__info-row--total">
                    <span>訂單金額</span>
                    <strong>NT$ {formatCurrency(finalTotal)}</strong>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="checkout-success__customer">
                  <h4 className="checkout-success__customer-title mb-2">收件資訊</h4>

                  <p className="mb-1">
                    <span className="text-muted">收件人：</span>
                    {userInfo.name || '—'}
                  </p>

                  <p className="mb-1">
                    <span className="text-muted">電話：</span>
                    {userInfo.tel || '—'}
                  </p>

                  <p className="mb-0">
                    <span className="text-muted">地址：</span>
                    {userInfo.address || '—'}
                  </p>
                </div>
              </aside>
            </div>
          </section>

          <div className="checkout-success__actions d-flex justify-content-center gap-2 mt-4">
            <Link to="/customer-orders" className="ui-btn ui-btn--outline-primary">
              查看歷史訂單
            </Link>

            <Link to="/products" className="ui-btn ui-btn--primary">
              繼續購物
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccessPage;
