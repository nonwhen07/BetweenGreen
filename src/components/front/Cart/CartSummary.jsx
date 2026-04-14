// utils
import { calculateCartTotal } from '@/utils/cartUtils';

const CartSummary = ({ carts }) => {
  const total = calculateCartTotal(carts);

  return (
    <div className="cart-summary card p-3">
      <h5>訂單摘要</h5>

      {carts.map((item) => (
        <div key={item.id} className="d-flex justify-content-between">
          <span>{item.product.title}</span>
          <span>{item.qty}</span>
        </div>
      ))}

      <hr />

      <div className="d-flex justify-content-between">
        <strong>總計</strong>
        <strong>${total}</strong>
      </div>
    </div>
  );
};

export default CartSummary;
