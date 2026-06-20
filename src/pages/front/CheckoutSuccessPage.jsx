import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

// services
import { getOrder } from '@/services/orderService';
// components
import CartSteps from '@/components/front/Cart/CartSteps';
import ProductImage from '@/components/ProductImage';
// utils
import { calculateCartTotal } from '@/utils/cartUtils';
import { extractErrorMessage } from '@/utils/errorHandler';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';

const normalizeOrderProducts = (products) => {
  if (!products) return [];

  if (Array.isArray(products)) {
    return products;
  }

  return Object.entries(products).map(([id, item]) => ({
    id,
    ...item,
  }));
};

const getProductTitle = (item) => {
  return item.product?.title || `商品 ID：${item.product_id || '—'}`;
};

const getProductImage = (item) => {
  return item.product?.imageUrl || '';
};

const getProductPrice = (item) => {
  return Number(item.product?.price || 0);
};

const getProductUnit = (item) => {
  return item.product?.unit || '';
};

const getItemTotal = (item) => {
  return Number(item.total || getProductPrice(item) * Number(item.qty || 0));
};

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const { orderId: orderIdParam } = useParams();

  const routeState = location.state || {};
  const orderID = routeState.orderId || orderIdParam;

  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const stateCarts = useMemo(() => {
    return routeState.carts || [];
  }, [routeState.carts]);

  const orderProducts = useMemo(() => {
    if (stateCarts.length > 0) {
      return stateCarts;
    }

    return normalizeOrderProducts(orderData?.products);
  }, [stateCarts, orderData]);

  const cartTotal = useMemo(() => {
    if (stateCarts.length > 0) {
      return calculateCartTotal(stateCarts);
    }

    return orderProducts.reduce((total, item) => total + getItemTotal(item), 0);
  }, [stateCarts, orderProducts]);

  useEffect(() => {
    const shouldFetchOrder = orderID && stateCarts.length === 0;

    if (!shouldFetchOrder) return;

    const fetchOrder = async () => {
      start();

      try {
        const res = await getOrder(orderID);

        setOrderData(res.data);
        setErrorMessage('');
      } catch (error) {
        const message = extractErrorMessage(error, setErrorMessage, '取得付款完成資料失敗。');
        showError(message);
      } finally {
        stop();
      }
    };

    fetchOrder();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [orderID, stateCarts.length]);

  if (!orderID) {
    return (
      <div className="container ui-container py-5 text-center">
        <h2 className="mb-3">找不到付款完成資料</h2>
        <p className="mb-4">缺少訂單編號，請回到商品頁重新操作。</p>

        <Link to="/products" className="ui-btn ui-btn--primary">
          回到商品頁
        </Link>
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
        <div className="card p-4 text-center my-4">
          <h2 className="h5 mb-2">暫時無法取得訂單資料</h2>
          <p className="text-muted mb-3">可能是網路連線不穩或系統忙碌，請稍後再試。</p>
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            onClick={() => window.location.reload()}
          >
            重新整理
          </button>
        </div>
      )}

      {!errorMessage && (
        <div className="order-success text-center mt-4">
          <h2 className="mb-2">🎉 已完成付款，您的訂單編號為：{orderID}</h2>
          <p className="mb-4">感謝您的購買！我們會盡快為您安排出貨。</p>

          {orderProducts.length > 0 ? (
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
                  <tr key={item.id || item.product_id}>
                    <td className="cart-table__col--info">{getProductTitle(item)}</td>

                    <td className="cart-table__col--image">
                      <ProductImage
                        src={getProductImage(item)}
                        alt={getProductTitle(item)}
                        size="small"
                      />
                    </td>

                    <td className="cart-table__col--price">
                      NT$ {getProductPrice(item).toLocaleString()}
                    </td>

                    <td className="cart-table__col--qty" style={{ width: '150px' }}>
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="me-2">{item.qty}</span>
                        <span className="bg-transparent border-0">{getProductUnit(item)}</span>
                      </div>
                    </td>

                    <td className="cart-table__col--subtotal">
                      NT$ {getItemTotal(item).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end">
                    訂單金額：
                  </td>
                  <td className="cart-table__total-amount text-end" style={{ width: '130px' }}>
                    NT${' '}
                    {Math.round(
                      orderData?.final_total ?? orderData?.total ?? cartTotal,
                    ).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="card p-4 text-center">
              <h2 className="h5 mb-2">訂單明細載入中或暫無商品資料</h2>
              <p className="text-muted mb-0">您仍可以前往訂單查詢頁確認訂單狀態。</p>
            </div>
          )}

          <div className="success-actions d-flex justify-content-center gap-2 mt-4">
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
