import { useMemo } from 'react';
// import { Link } from 'react-router-dom';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// components
import ProductImage from '@/components/ProductImage';

const CheckoutPayment = ({ orderID, lastOrderCart, onSubmit }) => {
  const cartTotal = useMemo(() => calculateCartTotal(lastOrderCart), [lastOrderCart]);

  return (
    <div className="order-success text-center">
      <h2 className="mb-2">請完成付款流程，您的訂單編號為：{orderID}</h2>

      <div className="checkout-carttable">
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
      </div>

      <div className="checkout-payment">
        <h3>付款方式</h3>○ 信用卡 ○ LINE Pay ○ ATM 轉帳 ○ 貨到付款
        {/* 這邊之後要處理切版介面+透過react-hook-form校對資料(卡號、信用卡基礎欄位或姓名空缺)後才可以送出完成付款 */}
        <form onSubmit={onSubmit}>
          <input placeholder="卡號" />
          <input placeholder="持卡人姓名" />
          <input placeholder="MM/YY" />
          <input placeholder="CVV" />

          <button type="submit" className="ui-btn ui-btn--primary">
            確認付款
          </button>
        </form>
      </div>
      {/* <Link to="/customer-orders" className="btn ui-btn ui-btn--outline-primary">
        查看歷史訂單
      </Link> */}
    </div>
  );
};

export default CheckoutPayment;
