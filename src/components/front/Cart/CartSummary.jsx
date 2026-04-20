// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

const CartSummary = ({ carts, actions, onNext }) => {
  const total = calculateCartTotal(carts);

  if (carts?.length === 0) {
    return null; // 如果購物車是空的，就不顯示摘要
  }

  return (
    <>
      <div className="cart-summary card p-3">
        <h2 className="">訂單摘要</h2>

        <ul className="cart-summary-list">
          <li className="d-flex justify-content-between mb-2">
            <strong>小計</strong>
            <strong>NT$ {total.toLocaleString()}</strong>
          </li>
          <li className="d-flex justify-content-between mb-1">
            <strong>運費</strong>

            {total >= minfreeShippingFee ? (
              <>
                <strong className="text-success">免運費</strong>
              </>
            ) : (
              <>
                <strong>NT$ {shippingFee.toLocaleString()}</strong>
              </>
            )}
          </li>
          <li className="d-flex justify-content-between mb-2">
            <p>全館滿五百免運</p>
            {total >= minfreeShippingFee ? (
              <>
                <strong className="text-success">已享免運</strong>
              </>
            ) : (
              <>
                <p className="text-muted">
                  距離免運還差額NT$ {(minfreeShippingFee - total).toLocaleString()}
                </p>
              </>
            )}
          </li>
        </ul>

        <hr className="mb-3" />
        <div className="d-flex justify-content-between  mb-3">
          <strong>合計</strong>
          {total >= minfreeShippingFee ? (
            <>
              <strong>NT$ {total.toLocaleString()}</strong>
            </>
          ) : (
            <>
              <strong>NT$ {(total + shippingFee).toLocaleString()}</strong>
            </>
          )}
        </div>
      </div>
      {/* 底部動作列 */}
      <div className="cart-table-actions text-end py-3">
        {/* */}
        <button
          type="button"
          onClick={actions.onClear}
          className="btn ui-btn ui-btn--outline-danger me-2"
        >
          清空購物車
        </button>
        {/* <Link to="/products" className="cart-table-actions__btn--back">繼續購物</Link> */}
        <button onClick={onNext} className="btn ui-btn ui-btn--primary">
          前往結帳
        </button>
      </div>
    </>
  );
};

export default CartSummary;
