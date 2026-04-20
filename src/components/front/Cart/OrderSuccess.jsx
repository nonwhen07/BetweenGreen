import { useMemo } from 'react';
import { Link } from 'react-router-dom';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// components
import ProductImage from '@/components/ProductImage';

const OrderSuccess = ({ orderID, lastOrderCart }) => {
  const cartTotal = useMemo(() => calculateCartTotal(lastOrderCart), [lastOrderCart]);

  return (
    <div className="order-success text-center">
      <h2 className="mb-2">🎉 訂單已完成，您的訂單編號為：{orderID}</h2>
      <p className="mb-2">感謝您的購買！</p>

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
                <ProductImage src={cart.product.imageUrl} alt={cart.product.title} size="small" />
              </td>
              <td className="cart-table__col--price">NT$ {cart.product.price.toLocaleString()}</td>
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

      <Link to="/customer-orders" className="btn ui-btn ui-btn--outline-primary">
        查看歷史訂單
      </Link>
    </div>
  );
};

export default OrderSuccess;
