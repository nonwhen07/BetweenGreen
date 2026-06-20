import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CreditCard, Landmark, PackageCheck, Smartphone } from 'lucide-react';

// utils
import { calculateCartTotal, formatCardNumber } from '@/utils/cartUtils';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';
// components
import ProductImage from '@/components/ProductImage';

// const formatCardNumber = (value = '') => {
//   return value
//     .replace(/\D/g, '')
//     .slice(0, 16)
//     .replace(/(\d{4})(?=\d)/g, '$1 ');
// };

const getProductTitle = (item) => {
  return item.product?.title || `商品 ID：${item.product_id || '—'}`;
};

const getProductImage = (item) => {
  return item.product?.imageUrl || '';
};

const getProductPrice = (item) => {
  return Number(item.product?.price || 0);
};

const getProductUnit = (item) => {
  return item.product?.unit || '';
};

const getItemTotal = (item) => {
  return Number(item.final_total ?? item.total ?? getProductPrice(item) * Number(item.qty || 0));
};

// const CheckoutPayment = ({ orderID, lastOrderCart, onSubmit }) => {
const CheckoutPayment = ({ orderID, lastOrderCart = [], orderAmount = null, onSubmit }) => {
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

  // const cartTotal = useMemo(() => calculateCartTotal(lastOrderCart), [lastOrderCart]);
  // const shipping = cartTotal >= minfreeShippingFee ? 0 : shippingFee;
  // const paymentTotal = cartTotal + shipping;

  const cartTotal = useMemo(() => {
    const calculatedTotal = calculateCartTotal(lastOrderCart);

    if (calculatedTotal > 0) {
      return calculatedTotal;
    }

    return lastOrderCart.reduce((total, item) => total + getItemTotal(item), 0);
  }, [lastOrderCart]);
  const shipping = cartTotal >= minfreeShippingFee ? 0 : shippingFee;
  const paymentTotal = Number(orderAmount) > 0 ? Math.round(orderAmount) : cartTotal + shipping;

  const handlePaymentSubmit = handleSubmit(() => {
    onSubmit();
  });

  const handleCardNumberChange = (event) => {
    const formattedValue = formatCardNumber(event.target.value);

    setValue('cardNumber', formattedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="checkout-payment-page">
      <div className="checkout-payment-hero text-center mb-4">
        <span className="checkout-payment-hero__eyebrow">Payment</span>
        <h2 className="mb-2">請完成付款流程</h2>
        <p className="text-muted mb-0">訂單已建立，您的訂單編號為：{orderID}</p>
      </div>

      <form onSubmit={handlePaymentSubmit}>
        <div className="row cart-checkout checkout-payment-layout">
          <div className="col-lg-7">
            <div className="checkout-payment-card card p-3 mb-3">
              <div className="checkout-payment-card__header">
                <h3 className="mb-1">本次訂單明細</h3>
                <p className="text-muted mb-0">請確認商品與數量後完成付款。</p>
              </div>

              <div className="table-responsive checkout-carttable mt-3">
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
                    {/* {lastOrderCart.map((cart) => (
                      <tr key={cart.id}>
                        <td className="cart-table__col--info">{cart.product.title}</td>

                        <td className="cart-table__col--image">
                          <ProductImage
                            src={cart.product.imageUrl}
                            alt={cart.product.title}
                            size="small"
                          />
                        </td>

                        <td className="cart-table__col--price">
                          NT$ {cart.product.price.toLocaleString()}
                        </td>

                        <td className="cart-table__col--qty">
                          <div className="d-flex justify-content-center align-items-center">
                            <span className="me-2">{cart.qty}</span>
                            <span className="bg-transparent border-0">{cart.product.unit}</span>
                          </div>
                        </td>

                        <td className="cart-table__col--subtotal">
                          NT$ {cart.total.toLocaleString()}
                        </td>
                      </tr>
                    ))} */}
                    {lastOrderCart.map((item) => {
                      const title = getProductTitle(item);
                      const imageUrl = getProductImage(item);
                      const price = getProductPrice(item);
                      const unit = getProductUnit(item);
                      const itemTotal = getItemTotal(item);

                      return (
                        <tr key={item.id || item.product_id}>
                          <td className="cart-table__col--info">{title}</td>

                          <td className="cart-table__col--image">
                            <ProductImage src={imageUrl} alt={title} size="small" />
                          </td>

                          <td className="cart-table__col--price">NT$ {price.toLocaleString()}</td>

                          <td className="cart-table__col--qty">
                            <div className="d-flex justify-content-center align-items-center">
                              <span className="me-2">{item.qty}</span>
                              <span className="bg-transparent border-0">{unit}</span>
                            </div>
                          </td>

                          <td className="cart-table__col--subtotal">
                            NT$ {itemTotal.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="checkout-payment-card card p-3">
              <div className="checkout-payment-card__header">
                <h3 className="mb-1">付款方式</h3>
                <p className="text-muted mb-0">
                  此為作品集模擬付款流程，用於呈現第三方金流串接與欄位驗證體驗。
                </p>
              </div>

              <div className="checkout-payment-methods mt-3 mb-4">
                <label
                  className={`checkout-payment-method ${
                    paymentMethod === 'credit-card' ? 'active' : ''
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
                  className={`checkout-payment-method ${
                    paymentMethod === 'line-pay' ? 'active' : ''
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
                  className={`checkout-payment-method ${paymentMethod === 'atm' ? 'active' : ''}`}
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
                  className={`checkout-payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}
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
                <div className="checkout-payment-form">
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

                  <div className="row mb-3">
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

                  <div className="row mb-3">
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

                  <div className="row mb-3">
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
                <div className="checkout-payment-note">
                  <h4 className="checkout-payment-note__title">LINE Pay 模擬付款</h4>
                  <p className="checkout-payment-note__text">
                    確認付款後，系統將模擬導向 LINE Pay 授權流程，並透過測試付款 API 更新訂單狀態。
                  </p>
                  <p className="checkout-payment-note__hint">
                    實際商業環境會由後端建立付款請求，導向 LINE Pay
                    頁面後再透過金流回傳結果確認付款。
                  </p>
                </div>
              )}

              {paymentMethod === 'atm' && (
                <div className="checkout-payment-note">
                  <h4 className="checkout-payment-note__title">ATM 轉帳資訊</h4>
                  <p className="checkout-payment-note__text">
                    轉帳銀行：玉山銀行 808
                    <br />
                    模擬帳號：1234-5678-9012
                  </p>
                  <p className="checkout-payment-note__hint">
                    本專案會在確認付款後模擬完成訂單付款狀態；實際商業環境通常需等待銀行入帳通知或後台人工核帳。
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="checkout-payment-note">
                  <h4 className="checkout-payment-note__title">貨到付款</h4>
                  <p className="checkout-payment-note__text">
                    選擇貨到付款後，系統將模擬建立待出貨訂單，並於本作品集中以付款完成狀態呈現。
                  </p>
                  <p className="checkout-payment-note__hint">
                    實際商業環境通常會由物流配送與後台收款狀態共同確認，不會由前端單方面決定付款完成。
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="cart-summary checkout-payment-summary card p-3">
              <h3 className="mb-3">付款摘要</h3>

              <div className="d-flex justify-content-between mb-3">
                <span>訂單編號</span>
                <strong>{orderID}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>付款狀態</span>
                <strong className="text-warning">尚未付款</strong>
              </div>

              <hr className="mb-3" />

              <div className="d-flex justify-content-between mb-3">
                <strong>商品小計</strong>
                <strong>NT$ {cartTotal.toLocaleString()}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <strong>運費</strong>

                {shipping === 0 ? (
                  <strong className="text-success">免運費</strong>
                ) : (
                  <strong>NT$ {shipping.toLocaleString()}</strong>
                )}
              </div>

              <hr className="mb-3" />

              <div className="d-flex justify-content-between mb-3">
                <strong>應付金額</strong>
                <strong>NT$ {paymentTotal.toLocaleString()}</strong>
              </div>

              <button type="submit" className="ui-btn ui-btn--primary w-100">
                確認付款
              </button>

              <p className="text-muted small mt-3 mb-0">
                此頁面用於模擬金流流程與欄位驗證，不會送出真實信用卡資訊。
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPayment;
