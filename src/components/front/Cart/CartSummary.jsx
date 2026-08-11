import { useState } from 'react';

// utils
import { getAppliedCoupon, getCartPricing, formatCouponDueDate } from '@/utils/cartUtils';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

const CartSummary = ({ carts, cartData, actions, onNext, isCouponLoading }) => {
  const [couponCode, setCouponCode] = useState('');

  const { subtotal, finalTotal, hasDiscount, discountAmount, discountRate } = getCartPricing({
    carts,
    cartData,
  });

  const shipping = finalTotal >= minfreeShippingFee ? 0 : shippingFee;
  const paymentTotal = finalTotal + shipping;
  const amountToFreeShipping = Math.max(minfreeShippingFee - finalTotal, 0);
  const appliedCoupon = getAppliedCoupon(carts);

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
      <div className="order-summary order-summary--cart card mt-3 p-3">
        <div className="order-summary__header">
          <h2 className="order-summary__title mb-3">訂單摘要</h2>
        </div>

        <ul className="order-summary__list">
          <li className="order-summary__row">
            <strong className="order-summary__label">商品小計</strong>

            <strong className="order-summary__value">
              {hasDiscount && (
                <del className="text-muted me-2">NT$ {subtotal.toLocaleString()}</del>
              )}

              <span className={hasDiscount ? 'text-success' : ''}>
                NT$ {(hasDiscount ? finalTotal : subtotal).toLocaleString()}
              </span>
            </strong>
          </li>

          <li className="cart-summary-coupon">
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
          </li>

          {hasDiscount && (
            <li className="order-summary__row order-summary__row--discount">
              <strong className="order-summary__label">優惠折抵</strong>

              <strong className="order-summary__value">
                - NT$ {discountAmount.toLocaleString()}
              </strong>
            </li>
          )}
          <li className="order-summary__row">
            <strong className="order-summary__label">運費</strong>

            <strong className={`order-summary__value ${shipping === 0 ? 'text-success' : ''}`}>
              {shipping === 0 ? '免運費' : `NT$ ${shipping.toLocaleString()}`}
            </strong>
          </li>
          <li className="order-summary__shipping-note">
            <span>全館 NT$ {minfreeShippingFee.toLocaleString()} 免運</span>

            {shipping === 0 ? (
              <strong className="order-summary__value  text-success">已享免運</strong>
            ) : (
              <span className="order-summary__value text-muted">
                距離免運還差 NT$ {amountToFreeShipping.toLocaleString()}
              </span>
            )}
          </li>
        </ul>

        <hr className="order-summary__divider" />

        <div className="order-summary__row order-summary__row--total">
          <strong className="order-summary__label">合計</strong>
          <strong className="order-summary__value">NT$ {paymentTotal.toLocaleString()}</strong>
        </div>
      </div>

      <div className="order-summary__actions cart-cta-group">
        <button type="button" onClick={actions.onClear} className="ui-btn ui-btn--outline-danger">
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
