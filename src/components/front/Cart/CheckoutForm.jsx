// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// constants
import { shippingFee, minfreeShippingFee } from '@/constants/cartConstants';

const CheckoutForm = ({ carts, register, onSubmit, errors, onBack }) => {
  const total = calculateCartTotal(carts);

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

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label htmlFor="nameCheck" className="form-label">
                    訂購人姓名
                  </label>
                  <input
                    {...register('nameCheck', { required: '姓名 欄位必填' })}
                    id="nameCheck"
                    type="text"
                    className={`form-control ${errors.nameCheck ? 'is-invalid' : ''}`}
                    placeholder="請輸入姓名"
                  />
                  {errors.nameCheck && (
                    <p className="text-danger my-2">{errors.nameCheck.message}</p>
                  )}
                </div>

                <div className="col-lg-6">
                  <label htmlFor="telCheck" className="form-label">
                    訂購人電話
                  </label>
                  <input
                    {...register('telCheck', {
                      required: '電話 欄位必填',
                      pattern: {
                        value: /^(0[2-8]\d{7}|09\d{8})$/,
                        message: '電話 格式錯誤',
                      },
                    })}
                    id="telCheck"
                    type="text"
                    className={`form-control ${errors.telCheck ? 'is-invalid' : ''}`}
                    placeholder="請輸入電話"
                  />
                  {errors.telCheck && <p className="text-danger my-2">{errors.telCheck.message}</p>}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="emailCheck" className="form-label">
                    訂購人Email
                  </label>
                  <input
                    {...register('emailCheck', {
                      required: 'Email 欄位必填',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email 格式錯誤',
                      },
                    })}
                    id="emailCheck"
                    type="email"
                    className={`form-control ${errors.emailCheck ? 'is-invalid' : ''}`}
                    placeholder="請輸入 Email"
                  />
                  {errors.emailCheck && (
                    <p className="text-danger my-2">{errors.emailCheck.message}</p>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    訂購人地址
                  </label>
                  <input
                    {...register('address', { required: '地址 欄位必填' })}
                    id="address"
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="請輸入地址"
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
                  <span style={{ width: '150px' }}>{item.product.title}</span>
                  <span>{item.product.category}</span>
                  <span>
                    {item.qty}
                    {item.product.unit}
                  </span>
                  <span>NT$ {item.total}</span>
                </div>
              ))}

              <hr className="mb-3" />

              <div className="d-flex justify-content-between mb-3">
                <strong>小計</strong>
                <strong>NT$ {total}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <strong>運費(本館滿799免運)</strong>
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
              <div className="d-flex justify-content-between mb-3">
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

              <div className="summary-box mb-1">
                <button
                  type="button"
                  className="btn ui-btn ui-btn--outline-primary w-100 mb-2"
                  onClick={onBack}
                >
                  回到購物車
                </button>
                <button type="submit" className="btn ui-btn ui-btn--primary w-100">
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
