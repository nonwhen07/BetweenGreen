// utils
import { calculateCartTotal } from '@/utils/cartUtils';

const CartSummary = ({ carts }) => {
  const total = calculateCartTotal(carts);
  const shippingFee = 60;
  const minfreeShippingFee = 599;

  return (
    <div className="cart-summary card p-3">
      <h4 className="mb-4">訂單摘要</h4>
      <h5 className="mb-4">商品明細</h5>
      {carts.map((item) => (
        <div key={item.id} className="row mb-3">
          <div className="col-4">
            <span>{item.product.title}</span>
          </div>
          <div className="col-4">
            <span>{item.product.category}</span>
          </div>
          <div className="col-2">
            <span>
              {item.qty}
              {item.product.unit}
            </span>
          </div>
          <div className="col-2">
            <span>NT$ {item.total}</span>
          </div>
        </div>
      ))}

      <hr className="mb-4" />

      <div className="d-flex justify-content-between mb-3">
        <strong>小計</strong>
        <strong>NT$ {total}</strong>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <strong>運費(本館滿599免運)</strong>
        {total >= minfreeShippingFee ? (
          <>
            <strong className="text-success">已享免運</strong>
          </>
        ) : (
          <>
            <strong>NT$ {shippingFee}</strong>
          </>
        )}
      </div>
      <hr className="mb-3" />
      <div className="d-flex justify-content-between  mb-3">
        <strong>合計</strong>
        {total >= minfreeShippingFee ? (
          <>
            <strong>NT$ {total}</strong>
          </>
        ) : (
          <>
            <strong>NT$ {total + shippingFee}</strong>
          </>
        )}
      </div>

      <div class="summary-box mb-1">
        <button class="btn btn-outline-primary w-100 mb-2">返回購物車</button>
        <button class="btn btn-primary w-100">送出訂單</button>
      </div>
    </div>
  );
};

export default CartSummary;
