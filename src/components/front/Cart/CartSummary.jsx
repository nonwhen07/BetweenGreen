import { useState } from 'react';

// utils
import { getAppliedCoupon, getCartPricing, formatCouponDueDate } from '@/utils/cartUtils';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

const CartSummary = ({ carts, cartData, actions, onNext, isCouponLoading }) => {
  const [couponCode, setCouponCode] = useState('');

  // const subtotal = calculateCartTotal(carts);
  const { subtotal, finalTotal, hasDiscount, discountAmount, discountRate } = getCartPricing({
    carts,
    cartData,
  });

  const shipping = finalTotal >= minfreeShippingFee ? 0 : shippingFee;
  const paymentTotal = finalTotal + shipping;
  const amountToFreeShipping = Math.max(minfreeShippingFee - finalTotal, 0);
  const appliedCoupon = getAppliedCoupon(carts);

  // const handleApplyCoupon = () => {
  //   actions.onApplyCoupon?.(couponCode);
  // };
  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim();
    if (!trimmedCode) return;
    actions.onApplyCoupon?.(trimmedCode);
  };

  if (carts?.length === 0) {
    return null; // 如果購物車是空的，就不顯示摘要
  }

  return (
    <>
      <div className="cart-summary card p-3">
        <h2 className="mb-3">訂單摘要</h2>

        <ul className="cart-summary-list">
          <li className="d-flex justify-content-between mb-2">
            <strong>商品小計</strong>

            {hasDiscount ? (
              <strong className="text-success">
                <del className="text-muted me-2">NT$ {subtotal.toLocaleString()}</del>
                NT$ {finalTotal.toLocaleString()}
              </strong>
            ) : (
              <strong>NT$ {subtotal.toLocaleString()}</strong>
            )}
          </li>

          <li className="cart-summary-coupon mb-3">
            <div className="cart-summary-coupon__top">
              <label htmlFor="couponCode" className="form-label mb-0">
                優惠碼
              </label>

              {appliedCoupon && (
                <span className="cart-summary-coupon__current">目前使用：{appliedCoupon.code}</span>
              )}
            </div>

            <div className="row g-2 mb-2">
              <div className="col-lg-6 col-12">
                <div className="cart-summary-coupon__input-group">
                  <input
                    id="couponCode"
                    type="text"
                    className="form-control"
                    value={couponCode}
                    placeholder="請輸入優惠碼"
                    disabled={isCouponLoading}
                    onChange={(event) => setCouponCode(event.target.value)}
                  />

                  <button
                    type="button"
                    className="ui-btn ui-btn--outline-primary"
                    disabled={isCouponLoading}
                    onClick={handleApplyCoupon}
                  >
                    {isCouponLoading ? '套用中' : '套用'}
                  </button>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                {hasDiscount && appliedCoupon ? (
                  <div className="cart-coupon-applied">
                    <div className="cart-coupon-applied__header">
                      <span className="cart-coupon-applied__label">已套用優惠碼</span>
                      <strong className="cart-coupon-applied__code">{appliedCoupon.code}</strong>
                    </div>

                    <p className="cart-coupon-applied__text">
                      約 {discountRate}% OFF，折抵 NT$ {discountAmount.toLocaleString()}。
                      <span className="cart-coupon-applied__hint">
                        到期日：{formatCouponDueDate(appliedCoupon.due_date)}
                        ，再次輸入其他優惠碼系統會以最後成功套用優惠碼為準。
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-muted small mt-2 mb-0">
                    有優惠碼嗎？請在建立訂單前輸入，單筆訂單限套用一組優惠碼。
                  </p>
                )}
              </div>
            </div>
            {/* <div className="cart-summary-coupon__input-group">
              <input
                id="couponCode"
                type="text"
                className="form-control"
                value={couponCode}
                placeholder="請輸入優惠碼"
                disabled={isCouponLoading}
                onChange={(event) => setCouponCode(event.target.value)}
              />

              <button
                type="button"
                className="ui-btn ui-btn--outline-primary"
                disabled={isCouponLoading}
                onClick={handleApplyCoupon}
              >
                {isCouponLoading ? '套用中' : '套用'}
              </button>
            </div>

            {hasDiscount && appliedCoupon ? (
              <div className="cart-coupon-applied mt-2">
                <div className="cart-coupon-applied__header">
                  <span className="cart-coupon-applied__label">已套用優惠碼</span>
                  <strong className="cart-coupon-applied__code">{appliedCoupon.code}</strong>
                </div>

                <p className="cart-coupon-applied__text">
                  約 {discountRate}% OFF，折抵 NT$ {discountAmount.toLocaleString()}。
                  <span className="cart-coupon-applied__hint">
                    到期日：{formatCouponDueDate(appliedCoupon.due_date)}
                    。再次輸入其他優惠碼時，系統會以最後成功套用的優惠碼為準。
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-muted small mt-2 mb-0">
                有優惠碼嗎？請在建立訂單前輸入，單筆訂單限套用一組優惠碼。
              </p>
            )} */}
          </li>
          {hasDiscount && (
            <li className="d-flex justify-content-between mb-2">
              <strong>優惠折抵</strong>
              <strong className="text-success">- NT$ {discountAmount.toLocaleString()}</strong>
            </li>
          )}
          <li className="d-flex justify-content-between mb-1">
            <strong>運費</strong>

            {shipping === 0 ? (
              <strong className="text-success">免運費</strong>
            ) : (
              <strong>NT$ {shipping.toLocaleString()}</strong>
            )}
          </li>
          <li className="d-flex justify-content-between mb-2">
            <p>全館 NT$ {minfreeShippingFee.toLocaleString()} 免運</p>

            {shipping === 0 ? (
              <strong className="text-success">已享免運</strong>
            ) : (
              <p className="text-muted">距離免運還差 NT$ {amountToFreeShipping.toLocaleString()}</p>
            )}
          </li>
        </ul>

        <hr className="mb-3" />

        <div className="d-flex justify-content-between mb-3">
          <strong>合計</strong>
          <strong>NT$ {paymentTotal.toLocaleString()}</strong>
        </div>
      </div>

      <div className="cart-table-actions text-end py-3">
        <button
          type="button"
          onClick={actions.onClear}
          className="ui-btn ui-btn--outline-danger me-2"
        >
          清空購物車
        </button>

        <button type="button" onClick={onNext} className="ui-btn ui-btn--primary">
          前往結帳
        </button>
      </div>
    </>
  );
};

export default CartSummary;
