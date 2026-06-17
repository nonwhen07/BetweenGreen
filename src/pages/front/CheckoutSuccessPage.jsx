import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// components
import ProductImage from '@/components/ProductImage';
// components
import CartSteps from '@/components/front/Cart/CartSteps';

const CheckoutSuccessPage = () => {
  const location = useLocation();

  const orderID = location.state?.orderId;

  const lastOrderCart = useMemo(() => {
    return location.state?.carts || [];
  }, [location.state?.carts]);

  const cartTotal = useMemo(() => {
    return calculateCartTotal(lastOrderCart);
  }, [lastOrderCart]);

  if (!orderID) {
    return (
      <div className="container ui-container py-5 text-center">
        <h2 className="mb-3">找不到付款完成資料</h2>
        <p className="mb-4">可能是重新整理頁面或直接進入此頁，付款資訊已遺失。</p>
        <Link to="/products" className="ui-btn ui-btn--primary">
          回到商品頁
        </Link>
      </div>
    );
  }

  return (
    <div className="container ui-container ui-container--cart">
      {/* Step Indicator */}
      <CartSteps currentStep={4} />
      {/* Main Content */}
      <div className="cart-main text-center">
        <h2 className="mb-2">已完成付款流程，您的訂單編號為：{orderID}</h2>
        <p className="mb-4">感謝您的購買！</p>
        {lastOrderCart.length > 0 && (
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
              {lastOrderCart.map((cart) => (
                <tr key={cart.id}>
                  <td className="cart-table__col--info">{cart.product.title}</td>
                  <td className="cart-table__col--image">
                    <ProductImage
                      src={cart.product.imageUrl}
                      alt={cart.product.title}
                      size="small"
                    />
                  </td>
                  <td className="cart-table__col--price">
                    NT$ {cart.product.price.toLocaleString()}
                  </td>
                  <td className="cart-table__col--qty" style={{ width: '150px' }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="me-2">{cart.qty}</span>
                      <span className="bg-transparent border-0">{cart.product.unit}</span>
                    </div>
                  </td>
                  <td className="cart-table__col--subtotal">NT$ {cart.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-end">
                  總計：
                </td>
                <td className="cart-table__total-amount text-end" style={{ width: '130px' }}>
                  NT$ {cartTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
        <div className="success-actions d-flex justify-content-center gap-3 mt-4">
          <Link to="/customer-orders" className="ui-btn ui-btn--outline-primary">
            查看歷史訂單
          </Link>

          <Link to="/products" className="ui-btn ui-btn--primary">
            繼續購物
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
