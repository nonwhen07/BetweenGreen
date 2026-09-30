import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, Truck } from 'lucide-react';

import taiwanDistricts from '@/data/taiwanDistricts.json';

// utils
import { getCartPricing, getShippingPricing } from '@/utils/cartUtils';
import { normalizeOrderItems } from '@/utils/order/orderItemUtils';
// import { formatCategoryShortPreview, getProductUnitLabel } from '@/utils/product/productFormatter';
// import { formatCategoryShortPreview, getProductUnitShortLabel } from '@/utils/product/productFormatter';
// constants
import { minfreeShippingFee } from '@/constants/cartConstants';
// components
import ReadonlyOrderItems from '@/components/front/Cart/ReadonlyOrderItems';

const CheckoutForm = ({ carts, cartData, register, onSubmit, setValue, watch, errors, onBack }) => {
  const { subtotal, finalTotal, hasDiscount, discountAmount } = getCartPricing({
    carts,
    cartData,
  });
  const { shipping, paymentTotal, amountToFreeShipping } = getShippingPricing(finalTotal);
  const [isSame, setIsSame] = useState(false);

  const city = watch('city');
  const name = watch('name');
  const tel = watch('tel');
  const email = watch('email');

  //等等抽出去做hook
  const getCities = () => Object.keys(taiwanDistricts);
  const getDistricts = (city) => taiwanDistricts[city] || [];

  const cityList = getCities();
  const districtList = getDistricts(city);

  const summaryItems = useMemo(() => {
    return normalizeOrderItems(carts);
  }, [carts]);

  useEffect(() => {
    setValue('district', '');
  }, [city, setValue]);

  useEffect(() => {
    if (!isSame) return;

    const syncOptions = {
      shouldDirty: true,
      shouldValidate: true,
    };

    setValue('shippingName', name || '', syncOptions);
    setValue('shippingTel', tel || '', syncOptions);
    setValue('shippingEmail', email || '', syncOptions);
  }, [email, isSame, name, setValue, tel]);

  return (
    <>
      <form className="checkout-form" onSubmit={onSubmit} noValidate>
        <div className="checkout-form__layout row">
          <div className="col-lg-7">
            <section className="checkout-form__section checkout-form__section--customer">
              <header className="checkout-form__section-header">
                <span className="checkout-form__section-number">01</span>
                <div>
                  <p className="checkout-form__eyebrow">Contact</p>
                  <h2 className="checkout-form__title">訂購人資訊</h2>
                  <p className="checkout-form__section-intro">用於訂單通知與必要聯繫。</p>
                </div>
              </header>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label htmlFor="name" className="form-label">
                    訂購人姓名
                  </label>
                  <input
                    {...register('name', { required: '姓名 欄位必填' })}
                    id="name"
                    autoComplete="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="請輸入姓名"
                  />
                  {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                </div>

                <div className="col-lg-6">
                  <label htmlFor="tel" className="form-label">
                    訂購人電話
                  </label>
                  <input
                    {...register('tel', {
                      required: '電話 欄位必填',
                      pattern: {
                        value: /^(0[2-8]\d{7}|09\d{8})$/,
                        message: '電話 格式錯誤',
                      },
                    })}
                    id="tel"
                    type="text"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                    placeholder="請輸入電話"
                  />
                  {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    訂購人Email
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email 欄位必填',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email 格式錯誤',
                      },
                    })}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="請輸入 Email"
                  />
                  {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                </div>
              </div>
            </section>

            <section className="checkout-form__section checkout-form__section--shipping">
              <header className="checkout-form__section-header">
                <span className="checkout-form__section-number">02</span>
                <div>
                  <p className="checkout-form__eyebrow">Delivery</p>
                  <h2 className="checkout-form__title">寄送資訊</h2>
                  <p className="checkout-form__section-intro">請填寫可正常收件的聯絡資訊與地址。</p>
                </div>
              </header>

              <div className="col-12 mb-3">
                <label className={`ui-toggle-btn ${isSame ? 'is-active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSame}
                    onChange={(e) => setIsSame(e.target.checked)}
                  />
                  同訂購人資訊
                </label>
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label htmlFor="shippingName" className="form-label">
                    收件人姓名
                  </label>
                  <input
                    {...register('shippingName', { required: '姓名 欄位必填' })}
                    id="shippingName"
                    type="text"
                    autoComplete="shipping name"
                    className={`form-control ${errors.shippingName ? 'is-invalid' : ''}`}
                    placeholder="請輸入收件人姓名"
                    readOnly={isSame}
                    aria-readonly={isSame}
                  />
                  {errors.shippingName && (
                    <p className="text-danger my-2">{errors.shippingName.message}</p>
                  )}
                </div>

                <div className="col-lg-6">
                  <label htmlFor="shippingTel" className="form-label">
                    收件人電話
                  </label>
                  <input
                    {...register('shippingTel', {
                      required: '收件人電話 欄位必填',
                      pattern: {
                        value: /^(0[2-8]\d{7}|09\d{8})$/,
                        message: '收件人電話 格式錯誤',
                      },
                    })}
                    id="shippingTel"
                    type="text"
                    inputMode="tel"
                    autoComplete="shipping tel"
                    className={`form-control ${errors.shippingTel ? 'is-invalid' : ''}`}
                    placeholder="請輸入電話"
                    readOnly={isSame}
                    aria-readonly={isSame}
                  />
                  {errors.shippingTel && (
                    <p className="text-danger my-2">{errors.shippingTel.message}</p>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="shippingEmail" className="form-label">
                    收件人Email
                  </label>
                  <input
                    {...register('shippingEmail', {
                      required: '收件人Email 欄位必填',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: '收件人Email 格式錯誤',
                      },
                    })}
                    id="shippingEmail"
                    type="email"
                    autoComplete="shipping email"
                    className={`form-control ${errors.shippingEmail ? 'is-invalid' : ''}`}
                    placeholder="請輸入收件人 Email"
                    readOnly={isSame}
                    aria-readonly={isSame}
                  />
                  {errors.shippingEmail && (
                    <p className="text-danger my-2">{errors.shippingEmail.message}</p>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <h3 className="checkout-form__subtitle">收件地址</h3>
                </div>
                <div className="col-lg-6">
                  {/* 縣市 */}
                  <label htmlFor="city" className="form-label">
                    縣市
                  </label>
                  <select
                    id="city"
                    {...register('city', { required: '請選擇縣市' })}
                    className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                    autoComplete="shipping address-level1"
                  >
                    <option value="">請選擇縣市</option>
                    {cityList.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-danger my-2">{errors.city.message}</p>}
                </div>
                <div className="col-lg-6">
                  {/* 鄉鎮 */}
                  <label htmlFor="district" className="form-label">
                    鄉鎮
                  </label>
                  <select
                    id="district"
                    {...register('district', { required: '請選擇區域' })}
                    className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                    autoComplete="shipping address-level2"
                  >
                    <option value="">請選擇區域</option>
                    {districtList?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="text-danger my-2">{errors.district.message}</p>}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  {/* 詳細地址 */}
                  <label htmlFor="addressDetail" className="form-label">
                    詳細地址
                  </label>
                  <input
                    id="addressDetail"
                    type="text"
                    {...register('addressDetail', { required: '請輸入詳細地址' })}
                    className={`form-control ${errors.addressDetail ? 'is-invalid' : ''}`}
                    autoComplete="shipping street-address"
                    placeholder="例如：忠孝東路一段 100 號"
                  />
                </div>

                {errors.addressDetail && (
                  <p className="text-danger my-2">{errors.addressDetail.message}</p>
                )}
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="message" className="form-label">
                    訂單備註
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    className="form-control"
                    cols="30"
                    rows="3"
                    maxLength="200"
                    placeholder="如有配送時間或其他需求，可在此補充（選填）"
                  ></textarea>
                </div>
              </div>
            </section>
          </div>
          <div className="col-lg-5">
            <aside className="order-summary order-summary--checkout">
              <div className="order-summary__header">
                <p className="order-summary__eyebrow">Review Order</p>
                <h2 className="order-summary__title">確認訂單</h2>
                <p className="order-summary__intro">建立訂單前，請再次確認商品與金額。</p>
              </div>

              <ReadonlyOrderItems
                items={summaryItems}
                variant="summary"
                emptyTitle="購物車目前沒有商品"
                emptyDescription="請返回購物車加入商品後再填寫訂購資料。"
              />

              <hr className="order-summary__divider" />

              <div className="order-summary__list">
                <div className="order-summary__row">
                  <strong className="order-summary__label">商品小計</strong>
                  <strong className="order-summary__value">NT$ {subtotal.toLocaleString()}</strong>
                </div>

                {hasDiscount && (
                  <div className="order-summary__row order-summary__row--discount">
                    <strong className="order-summary__label">優惠折抵</strong>
                    <strong className="order-summary__value">
                      - NT$ {discountAmount.toLocaleString()}
                    </strong>
                  </div>
                )}

                <div className="order-summary__row">
                  <strong className="order-summary__label">
                    運費(本館滿 {minfreeShippingFee} 免運)
                  </strong>
                  <strong
                    className={`order-summary__value ${shipping === 0 ? 'text-success' : ''}`}
                  >
                    {shipping === 0 ? <>已享免運</> : <>NT$ {shipping.toLocaleString()}</>}
                  </strong>
                </div>

                <div className="order-summary__shipping-note">
                  <span className="order-summary__shipping-title">
                    <Truck size={17} aria-hidden="true" />
                    優惠後滿 NT$ {minfreeShippingFee.toLocaleString()} 免運
                  </span>

                  {shipping === 0 ? (
                    <strong className="order-summary__value text-success">已享免運</strong>
                  ) : (
                    <span className="order-summary__value text-muted">
                      再購 NT$ {amountToFreeShipping.toLocaleString()} 即享免運
                    </span>
                  )}
                </div>

                <div className="order-summary__row order-summary__row--total">
                  <strong className="order-summary__label">合計</strong>
                  <strong className="order-summary__value">
                    NT$ {paymentTotal.toLocaleString()}
                  </strong>
                </div>
              </div>

              <p className="order-summary__assurance">
                <LockKeyhole size={17} aria-hidden="true" />
                送出後會建立訂單，再進入模擬付款頁。
              </p>

              <div className="order-summary__actions order-summary__actions--checkout">
                <button type="button" className="ui-btn ui-btn--outline-primary" onClick={onBack}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  回到購物車
                </button>
                <button type="submit" className="ui-btn ui-btn--primary">
                  建立訂單並前往付款
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </form>
    </>
  );
};
export default CheckoutForm;
