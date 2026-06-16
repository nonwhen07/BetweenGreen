import React from 'react';
import { useState, useEffect } from 'react';

import taiwanDistricts from '@/data/taiwanDistricts.json';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// utils
import { formatCategoryPreview2, getProductUnitLabel } from '@/utils/productFormatter';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

const CheckoutForm = ({
  carts,
  register,
  onSubmit,
  setValue,
  // getValues,
  watch,
  errors,
  onBack,
}) => {
  const total = calculateCartTotal(carts);
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

  useEffect(() => {
    setValue('district', '');

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [city]);

  useEffect(() => {
    if (isSame) {
      setValue('shippingName', name);
      setValue('shippingTel', tel);
      setValue('shippingEmail', email);
    }
  }, [isSame, name, tel, email]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="row cart-checkout">
          <div className="col-lg-7">
            <div className="cart-checkout card row justify-content-center p-3 mb-3">
              <h2 className="mb-3">訂購人資訊</h2>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label htmlFor="name" className="form-label">
                    訂購人姓名
                  </label>
                  <input
                    {...register('name', { required: '姓名 欄位必填' })}
                    id="name"
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
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="請輸入 Email"
                  />
                  {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            <div className="cart-checkout-again card row justify-content-center p-3">
              <h2 className="mb-3">寄送資訊</h2>
              {/* <button
                type="button"
                onClick={() => {
                  setValue('shippingName', getValues('name'));
                  setValue('shippingTel', getValues('tel'));
                  setValue('shippingEmail', getValues('email'));
                }}
              >
                同訂購人資訊
              </button> */}
              <div className="col-12 mb-3">
                {/* <input
                  type="checkbox"
                  checked={isSame}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSame(checked);

                    if (checked) {
                      setValue('shippingName', getValues('name'));
                      setValue('shippingTel', getValues('tel'));
                      setValue('shippingEmail', getValues('email'));
                    }
                  }}
                />
                同訂購人資訊 */}
                <label className={`ui-toggle-btn ${isSame ? 'active' : ''}`}>
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
                    className={`form-control ${errors.shippingName ? 'is-invalid' : ''}`}
                    placeholder="請輸入收件人姓名"
                    disabled={isSame}
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
                    className={`form-control ${errors.shippingTel ? 'is-invalid' : ''}`}
                    placeholder="請輸入電話"
                    disabled={isSame}
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
                    className={`form-control ${errors.shippingEmail ? 'is-invalid' : ''}`}
                    placeholder="請輸入收件人 Email"
                    disabled={isSame}
                  />
                  {errors.shippingEmail && (
                    <p className="text-danger my-2">{errors.shippingEmail.message}</p>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <h3>訂購人地址</h3>
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
                  >
                    <option value="">請選擇縣市</option>
                    {cityList.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
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
                  >
                    <option value="">請選擇區域</option>
                    {districtList?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  {/* <label htmlFor="address" className="form-label">
                    訂購人地址
                  </label>
                  <input
                    {...register('address', { required: '地址 欄位必填' })}
                    id="address"
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="請輸入地址"
                  /> */}
                  {/* 詳細地址 */}
                  <label htmlFor="addressDetail" className="form-label">
                    訂購人地址
                  </label>
                  <input
                    id="addressDetail"
                    type="text"
                    {...register('addressDetail', { required: '請輸入詳細地址' })}
                    className={`form-control ${errors.addressDetail ? 'is-invalid' : ''}`}
                    placeholder="例如：忠孝東路一段 100 號"
                  />
                </div>

                {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
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
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="cart-summary card p-3">
              <h2 className="mb-3">訂單摘要</h2>

              {carts.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-3">
                  <span style={{ width: '120px' }}>{item.product.title}</span>
                  <span style={{ width: '150px' }}>
                    {formatCategoryPreview2(item.product.category) || '未設定分類'}
                  </span>
                  <span>
                    {item.qty}
                    {getProductUnitLabel(item.product.unit) || '未設定單位'}
                  </span>
                  <span>NT$ {item.total.toLocaleString()}</span>
                </div>
              ))}

              <hr className="mb-3" />

              <div className="d-flex justify-content-between mb-3">
                <strong>小計</strong>
                <strong>NT$ {total.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <strong>運費(本館滿 {minfreeShippingFee} 免運)</strong>
                {total >= minfreeShippingFee ? (
                  <>
                    <strong className="text-success">已享免運</strong>
                  </>
                ) : (
                  <>
                    <strong>NT$ {shippingFee.toLocaleString()}</strong>
                  </>
                )}
              </div>
              <hr className="mb-3" />
              <div className="d-flex justify-content-between mb-3">
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

              <div className="summary-box mb-1">
                <button
                  type="button"
                  className="ui-btn ui-btn--outline-primary w-100 mb-2"
                  onClick={onBack}
                >
                  回到購物車
                </button>
                <button type="submit" className="ui-btn ui-btn--primary w-100">
                  送出訂單
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default CheckoutForm;
