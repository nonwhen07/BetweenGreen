import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// components
import CartSteps from '@/components/front/Cart/CartSteps';
import CheckoutPayment from '@/components/front/Cart/CheckoutPayment';

// services
import { getOrder, payOrder } from '@/services/orderService';

// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';

// utils
import { extractErrorMessage } from '@/utils/errorHandler';
import { normalizeOrderItems } from '@/utils/orderItemUtils';

const CheckoutPaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();

  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const orderProducts = useMemo(() => {
    return normalizeOrderItems(orderData?.products);
  }, [orderData]);

  const orderAmount = useMemo(() => {
    return Number(orderData?.final_total ?? orderData?.total ?? 0);
  }, [orderData]);

  const fetchOrder = async () => {
    if (!orderId) return;

    start();

    try {
      const res = await getOrder(orderId);
      const order = res.data;

      if (!order || !order.id) {
        setOrderData(null);
        setErrorMessage('查無此訂單，請確認訂單編號是否正確。');
        return;
      }

      setOrderData(order);
      setErrorMessage('');
    } catch (error) {
      const message = extractErrorMessage(error, setErrorMessage, '取得訂單付款資料失敗。');

      showError(message);
    } finally {
      stop();
    }
  };

  const handlePay = async (paymentData) => {
    if (!orderId) {
      warning('找不到訂單編號，請返回訂單查詢頁重新操作。');
      return;
    }

    start();

    try {
      const latestOrder = await getOrder(orderId);
      const order = latestOrder.data;

      if (!order || !order.id) {
        setOrderData(null);
        setErrorMessage('查無此訂單，請確認訂單編號是否正確。');
        return;
      }

      if (order.is_paid) {
        warning('此訂單已完成付款，不需要重複付款。');

        navigate(`/checkout-success/${orderId}`, {
          state: {
            orderId,
            paymentMethod: paymentData?.paymentMethod,
          },
        });

        return;
      }

      await payOrder(orderId);

      success('您的訂單付款成功。');

      navigate(`/checkout-success/${orderId}`, {
        state: {
          orderId,
          carts: orderProducts,
          paymentMethod: paymentData?.paymentMethod,
        },
      });
    } catch (error) {
      const message = extractErrorMessage(error, setErrorMessage, '訂單付款失敗。');

      showError(message);
    } finally {
      stop();
    }
  };

  useEffect(() => {
    fetchOrder();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="checkout-payment-page container ui-container ui-container--cart py-5">
        <div className="cart-state-card cart-state-card--error">
          <h1 className="cart-state-card__title">找不到付款資料</h1>

          <p className="cart-state-card__description">缺少訂單編號，請回到訂單查詢頁重新操作。</p>

          <div className="cart-state-card__actions cart-cta-group">
            <Link to="/customer-orders" className="ui-btn ui-btn--primary">
              回到歷次訂單
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="checkout-payment-page container ui-container ui-container--cart py-5">
        <div className="cart-state-card cart-state-card--error">
          <h1 className="cart-state-card__title">暫時無法取得訂單資料</h1>

          <p className="cart-state-card__description">{errorMessage}</p>

          <div className="cart-state-card__actions cart-cta-group">
            <button type="button" className="ui-btn ui-btn--primary" onClick={fetchOrder}>
              重新整理
            </button>

            <Link to="/customer-orders" className="ui-btn ui-btn--outline-primary">
              回到歷次訂單
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="checkout-payment-page container ui-container ui-container--cart py-5">
        <div className="cart-state-card cart-state-card--loading">
          <h1 className="cart-state-card__title">訂單資料載入中</h1>

          <p className="cart-state-card__description">正在確認這筆訂單的付款資訊，請稍候。</p>
        </div>
      </div>
    );
  }

  if (orderData.is_paid) {
    return (
      <div className="checkout-payment-page container ui-container ui-container--cart py-5">
        <div className="cart-state-card cart-state-card--empty">
          <h1 className="cart-state-card__title">此訂單已付款</h1>

          <p className="cart-state-card__description">這筆訂單已完成付款，不需要再次付款。</p>

          <div className="cart-state-card__actions cart-cta-group">
            <Link to={`/checkout-success/${orderId}`} className="ui-btn ui-btn--primary">
              查看付款完成頁
            </Link>

            <Link to="/customer-orders" className="ui-btn ui-btn--outline-primary">
              回到歷次訂單
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-payment-page container ui-container ui-container--cart">
      <header className="checkout-payment-page__hero">
        <h1 className="page-title">確認付款</h1>
      </header>

      <CartSteps currentStep={3} />

      <section className="checkout-payment-page__content ui-section ui-section--cart active">
        {orderProducts.length === 0 ? (
          <div className="cart-state-card cart-state-card--empty">
            <h2 className="cart-state-card__title">訂單內容為空</h2>

            <p className="cart-state-card__description">目前無法顯示這筆訂單的商品明細。</p>

            <div className="cart-state-card__actions cart-cta-group">
              <Link to="/customer-orders" className="ui-btn ui-btn--primary">
                回到歷次訂單
              </Link>
            </div>
          </div>
        ) : (
          <CheckoutPayment
            orderID={orderId}
            orderItems={orderProducts}
            orderAmount={orderAmount}
            onSubmit={handlePay}
          />
        )}
      </section>
    </div>
  );
};

export default CheckoutPaymentPage;
