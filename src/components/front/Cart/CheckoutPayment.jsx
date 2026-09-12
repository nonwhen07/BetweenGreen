import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CreditCard, Landmark, PackageCheck, Smartphone } from 'lucide-react';

// utils
import { calculateCartFinalTotal, formatCardNumber, getShippingPricing } from '@/utils/cartUtils';
import { normalizeOrderItems } from '@/utils/order/orderItemUtils';
// constants
// components
import ReadonlyOrderItems from '@/components/front/Cart/ReadonlyOrderItems';

const formatCurrency = (value = 0) => {
  return Math.round(Number(value || 0)).toLocaleString();
};

const CheckoutPayment = ({ orderID, orderItems = [], onSubmit }) => {
  const paymentItems = useMemo(() => {
    return normalizeOrderItems(orderItems);
  }, [orderItems]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      paymentMethod: 'credit-card',
      cardNumber: '',
      cardHolder: '',
      expiredDate: '',
      cvv: '',
    },
    shouldUnregister: true,
  });

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
    defaultValue: 'credit-card',
  });

  const cardNumber = useWatch({
    control,
    name: 'cardNumber',
    defaultValue: '',
  });

  const cardHolder = useWatch({
    control,
    name: 'cardHolder',
    defaultValue: '',
  });

  const expiredDate = useWatch({
    control,
    name: 'expiredDate',
    defaultValue: '',
  });

  const itemsTotal = useMemo(() => {
    return calculateCartFinalTotal(paymentItems);
  }, [paymentItems]);

  const { shipping, paymentTotal } = getShippingPricing(itemsTotal);

  const handlePaymentSubmit = handleSubmit((formData) => {
    onSubmit?.(formData);
  });

  const handleCardNumberChange = (event) => {
    const formattedValue = formatCardNumber(event.target.value);

    setValue('cardNumber', formattedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="checkout-payment">
      <div className="checkout-payment__hero text-center mb-4">
        <span className="checkout-payment__eyebrow">Payment</span>
        <h2 className="checkout-payment__title mb-2">請完成付款流程</h2>
        <p className="checkout-payment__intro text-muted mb-0">
          訂單已建立，您的訂單編號為：{orderID}
        </p>
      </div>

      <form onSubmit={handlePaymentSubmit}>
        <div className="checkout-payment__layout row mx-0">
          <div className="col-lg-7">
            <div className="checkout-payment__card card p-3 mb-3">
              <div className="checkout-payment__card-header">
                <h2 className="checkout-payment__section-title mb-1">本次訂單明細</h2>
                <p className="checkout-payment__section-intro text-muted mb-0">
                  請確認商品與數量後完成付款。
                </p>
              </div>

              <div className="mt-3">
                <ReadonlyOrderItems
                  items={paymentItems}
                  variant="cards"
                  emptyTitle="訂單內容為空"
                  emptyDescription="目前無法顯示這筆訂單的商品明細。"
                />
              </div>
            </div>

            <div className="checkout-payment__card card p-3">
              <div className="checkout-payment__card-header">
                <h2 className="checkout-payment__section-title mb-1">付款方式</h2>
                <p className="checkout-payment__section-intro text-muted mb-0">
                  此為作品集模擬付款流程，用於呈現第三方金流串接與欄位驗證體驗。
                </p>
              </div>

              <div className="checkout-payment__methods mt-3 mb-4">
                <label
                  className={`checkout-payment__method ${
                    paymentMethod === 'credit-card' ? 'is-active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value="credit-card"
                    {...register('paymentMethod', { required: '請選擇付款方式' })}
                  />
                  <CreditCard size={20} />
                  <span>信用卡</span>
                </label>

                <label
                  className={`checkout-payment__method ${
                    paymentMethod === 'line-pay' ? 'is-active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value="line-pay"
                    {...register('paymentMethod', { required: '請選擇付款方式' })}
                  />
                  <Smartphone size={20} />
                  <span>LINE Pay</span>
                </label>

                <label
                  className={`checkout-payment__method ${paymentMethod === 'atm' ? 'is-active' : ''}`}
                >
                  <input
                    type="radio"
                    value="atm"
                    {...register('paymentMethod', { required: '請選擇付款方式' })}
                  />
                  <Landmark size={20} />
                  <span>ATM 轉帳</span>
                </label>

                <label
                  className={`checkout-payment__method ${paymentMethod === 'cod' ? 'is-active' : ''}`}
                >
                  <input
                    type="radio"
                    value="cod"
                    {...register('paymentMethod', { required: '請選擇付款方式' })}
                  />
                  <PackageCheck size={20} />
                  <span>貨到付款</span>
                </label>
              </div>

              {errors.paymentMethod && (
                <p className="text-danger my-2">{errors.paymentMethod.message}</p>
              )}

              {paymentMethod === 'credit-card' && (
                <div className="checkout-payment__form">
                  <div className="fake-card-preview mb-4">
                    <div className="fake-card-preview__brand">BETWEEN GREEN CARD</div>

                    <div className="fake-card-preview__number">
                      {cardNumber || '4242 4242 4242 4242'}
                    </div>

                    <div className="fake-card-preview__footer">
                      <span>{cardHolder || 'CARD HOLDER'}</span>
                      <span>{expiredDate || 'MM/YY'}</span>
                    </div>
                  </div>

                  <div className="row mb-3 mx-0">
                    <div className="col-12">
                      <label htmlFor="cardNumber" className="form-label">
                        卡號
                      </label>

                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        placeholder="4242 4242 4242 4242"
                        {...register('cardNumber', {
                          required: '卡號欄位必填',
                          validate: (value) =>
                            value.replace(/\s/g, '').length === 16 || '卡號需為 16 碼',
                          onChange: handleCardNumberChange,
                        })}
                      />

                      {errors.cardNumber && (
                        <p className="text-danger my-2">{errors.cardNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3 mx-0">
                    <div className="col-12">
                      <label htmlFor="cardHolder" className="form-label">
                        持卡人姓名
                      </label>

                      <input
                        id="cardHolder"
                        type="text"
                        className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                        placeholder="JEFF LIN"
                        {...register('cardHolder', {
                          required: '持卡人姓名欄位必填',
                        })}
                      />

                      {errors.cardHolder && (
                        <p className="text-danger my-2">{errors.cardHolder.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3 mx-0">
                    <div className="col-lg-6">
                      <label htmlFor="expiredDate" className="form-label">
                        有效期限
                      </label>

                      <input
                        id="expiredDate"
                        type="text"
                        className={`form-control ${errors.expiredDate ? 'is-invalid' : ''}`}
                        placeholder="MM/YY"
                        {...register('expiredDate', {
                          required: '有效期限欄位必填',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: '請輸入 MM/YY 格式',
                          },
                        })}
                      />

                      {errors.expiredDate && (
                        <p className="text-danger my-2">{errors.expiredDate.message}</p>
                      )}
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="cvv" className="form-label">
                        安全碼
                      </label>

                      <input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        {...register('cvv', {
                          required: '安全碼欄位必填',
                          pattern: {
                            value: /^\d{3}$/,
                            message: '安全碼需為 3 碼',
                          },
                        })}
                      />

                      {errors.cvv && <p className="text-danger my-2">{errors.cvv.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'line-pay' && (
                <div className="checkout-payment__note">
                  <h3 className="checkout-payment__note-title">LINE Pay 模擬付款</h3>
                  <p className="checkout-payment__note-text">
                    確認付款後，系統將模擬導向 LINE Pay 授權流程，並透過測試付款 API 更新訂單狀態。
                  </p>
                  <p className="checkout-payment__note-hint">
                    實際商業環境會由後端建立付款請求，導向 LINE Pay
                    頁面後再透過金流回傳結果確認付款。
                  </p>
                </div>
              )}

              {paymentMethod === 'atm' && (
                <div className="checkout-payment__note">
                  <h3 className="checkout-payment__note-title">ATM 轉帳資訊</h3>
                  <p className="checkout-payment__note-text">
                    轉帳銀行：玉山銀行 808
                    <br />
                    模擬帳號：1234-5678-9012
                  </p>
                  <p className="checkout-payment__note-hint">
                    本專案會在確認付款後模擬完成訂單付款狀態；實際商業環境通常需等待銀行入帳通知或後台人工核帳。
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="checkout-payment__note">
                  <h3 className="checkout-payment__note-title">貨到付款</h3>
                  <p className="checkout-payment__note-text">
                    選擇貨到付款後，系統將模擬建立待出貨訂單，並於本作品集中以付款完成狀態呈現。
                  </p>
                  <p className="checkout-payment__note-hint">
                    實際商業環境通常會由物流配送與後台收款狀態共同確認，不會由前端單方面決定付款完成。
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="order-summary checkout-payment__summary card p-3">
              <div className="order-summary__header">
                <h3 className="order-summary__title mb-3">付款摘要</h3>
              </div>

              <div className="order-summary__list">
                <div className="order-summary__row">
                  <span className="order-summary__label">訂單編號</span>
                  <strong className="order-summary__value">{orderID}</strong>
                </div>

                <div className="order-summary__row">
                  <span className="order-summary__label">付款狀態</span>
                  <strong className="order-summary__value text-warning">尚未付款</strong>
                </div>

                <hr className="order-summary__divider" />

                <div className="order-summary__row">
                  <strong className="order-summary__label">商品小計</strong>
                  <strong className="order-summary__value">NT$ {formatCurrency(itemsTotal)}</strong>
                </div>

                <div className="order-summary__row">
                  <strong className="order-summary__label">運費</strong>
                  <strong className="order-summary__value">
                    {shipping === 0 ? '免運費' : `NT$ ${formatCurrency(shipping)}`}
                  </strong>
                </div>

                <hr className="order-summary__divider" />

                <div className="order-summary__row order-summary__row--total">
                  <strong className="order-summary__label">應付金額</strong>
                  <strong className="order-summary__value">
                    NT$ {formatCurrency(paymentTotal)}
                  </strong>
                </div>
              </div>

              <div className="order-summary__actions ui-action-group ui-action-group--single">
                <button type="submit" className="ui-btn ui-btn--primary">
                  確認付款
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPayment;
