import { useState } from 'react';
import { ArrowRight, ShieldCheck, TicketPercent, Truck } from 'lucide-react';

// utils
import {
  getAppliedCoupon,
  getCartPricing,
  getShippingPricing,
  formatCouponDueDate,
} from '@/utils/cartUtils';
// constants
import { minfreeShippingFee } from '@/constants/cartConstants';

const CartSummary = ({ carts, cartData, actions, onNext, isCouponLoading }) => {
  const [couponCode, setCouponCode] = useState('');

  const { subtotal, finalTotal, hasDiscount, discountAmount, discountRate } = getCartPricing({
    carts,
    cartData,
  });

  const { shipping, paymentTotal, amountToFreeShipping } = getShippingPricing(finalTotal);
  const appliedCoupon = getAppliedCoupon(carts);
  const freeShippingProgress = Math.min(
    100,
    Math.round((Math.max(0, finalTotal) / minfreeShippingFee) * 100),
  );

  const handleApplyCoupon = (event) => {
    event.preventDefault();
    const trimmedCode = couponCode.trim();
    if (!trimmedCode) return;
    actions.onApplyCoupon?.(trimmedCode);
  };

  if (carts?.length === 0) {
    return null; // 如果購物車是空的，就不顯示摘要
  }

  return (
    <div className="cart-summary-panel">
      <div className="order-summary order-summary--cart">
        <div className="order-summary__header">
          <p className="order-summary__eyebrow">Order Summary</p>
          <h2 className="order-summary__title">訂單摘要</h2>
          <p className="order-summary__intro">確認品項與優惠後，再前往填寫收件資料。</p>
        </div>

        <ul className="order-summary__list">
          <li className="order-summary__row">
            <strong className="order-summary__label">商品小計</strong>

            <strong
              className={`order-summary__value${
                hasDiscount ? ' order-summary__value--stack' : ''
              }`}
            >
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
              <span className="cart-summary-coupon__label">
                <TicketPercent size={17} aria-hidden="true" />
                優惠碼
              </span>

              {appliedCoupon && (
                <span className="cart-summary-coupon__current">目前使用：{appliedCoupon.code}</span>
              )}
            </div>

            <form className="cart-summary-coupon__form" onSubmit={handleApplyCoupon}>
              <label htmlFor="couponCode" className="visually-hidden">
                輸入優惠碼
              </label>

              <div className="cart-summary-coupon__input-group">
                <input
                  id="couponCode"
                  type="text"
                  className="cart-summary-coupon__input"
                  value={couponCode}
                  placeholder="請輸入優惠碼"
                  disabled={isCouponLoading}
                  autoComplete="off"
                  onChange={(event) => setCouponCode(event.target.value)}
                />

                <button
                  type="submit"
                  className="ui-btn ui-btn--outline-primary"
                  disabled={isCouponLoading || !couponCode.trim()}
                  aria-busy={isCouponLoading}
                >
                  {isCouponLoading ? '套用中' : '套用'}
                </button>
              </div>
            </form>

            {hasDiscount && appliedCoupon ? (
              <div className="cart-coupon-applied">
                <div className="cart-coupon-applied__header">
                  <span className="cart-coupon-applied__label">已套用</span>
                  <strong className="cart-coupon-applied__code">{appliedCoupon.code}</strong>
                </div>

                <p className="cart-coupon-applied__text">
                  約 {discountRate}% OFF，折抵 NT$ {discountAmount.toLocaleString()}。
                </p>
                <p className="cart-coupon-applied__hint">
                  到期日：{formatCouponDueDate(appliedCoupon.due_date)}
                </p>
              </div>
            ) : (
              <p className="cart-summary-coupon__hint">
                單筆訂單限套用一組，以最後成功套用的優惠碼為準。
              </p>
            )}
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
            <div className="order-summary__shipping-copy">
              <span className="order-summary__shipping-title">
                <Truck size={17} aria-hidden="true" />
                全館 NT$ {minfreeShippingFee.toLocaleString()} 免運
              </span>

              {shipping === 0 ? (
                <strong className="order-summary__shipping-status is-complete">已享免運</strong>
              ) : (
                <span className="order-summary__shipping-status">
                  還差 NT$ {amountToFreeShipping.toLocaleString()}
                </span>
              )}
            </div>

            <div
              className="order-summary__shipping-progress"
              role="progressbar"
              aria-label="免運門檻進度"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={freeShippingProgress}
            >
              <span style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </li>
        </ul>

        <hr className="order-summary__divider" />

        <div className="order-summary__row order-summary__row--total">
          <strong className="order-summary__label">合計</strong>
          <strong className="order-summary__value">NT$ {paymentTotal.toLocaleString()}</strong>
        </div>

        <p className="order-summary__assurance">
          <ShieldCheck size={17} aria-hidden="true" />
          下一步才會建立訂單，目前仍可返回修改。
        </p>

        <div className="order-summary__actions">
          <button type="button" onClick={onNext} className="ui-btn ui-btn--primary">
            前往填寫資料
            <ArrowRight size={18} aria-hidden="true" />
          </button>

          <button type="button" onClick={actions.onClear} className="order-summary__clear">
            清空購物車
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
