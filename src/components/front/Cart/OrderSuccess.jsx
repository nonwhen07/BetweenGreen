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
      <h2>🎉 訂單已完成，您的訂單編號為：{orderID}</h2>
      <p>感謝您的購買！</p>

      <table className="table align-middle">
        <thead>
          <tr>
            <th style={{ width: '250px' }}>品名</th>
            <th style={{ width: '250px' }}>圖片</th>
            <th style={{ width: '200px' }}>單價</th>
            <th style={{ width: '200px' }}>數量/單位</th>
            <th style={{ width: '200px' }} className="text-end">
              合計
            </th>
          </tr>
        </thead>
        <tbody>
          {lastOrderCart.map((cart) => (
            <tr key={cart.id}>
              <td>{cart.product.title}</td>
              <td>
                <ProductImage src={cart.product.imageUrl} alt={cart.product.title} size="small" />
              </td>
              <td>{cart.product.price.toLocaleString()}</td>
              <td style={{ width: '150px' }}>
                <div className="d-flex align-items-center">
                  <div className="btn-group me-2" role="group">
                    <span
                      className="btn border border-dark"
                      style={{ width: '50px', cursor: 'auto' }}
                    >
                      {cart.qty}
                    </span>
                  </div>
                  <span className="input-group-text bg-transparent border-0">
                    {cart.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{cart.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-end">
              總計：
            </td>
            <td className="text-end" style={{ width: '130px' }}>
              {cartTotal.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      <Link to="/customer-orders" className="btn btn-outline-primary">
        查看訂單
      </Link>
    </div>
  );
};

export default OrderSuccess;
