const CheckoutForm = ({ register, onSubmit, errors, onBack }) => {
  return (
    <>
      <div className="cart-table my-5 row justify-content-center">
        <form onSubmit={onSubmit} className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
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

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              {...register('name', { required: '姓名 欄位必填' })}
              id="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="請輸入姓名"
            />
            {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
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

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              {...register('address', { required: '地址 欄位必填' })}
              id="address"
              type="text"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="請輸入地址"
            />

            {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              {...register('message')}
              id="message"
              className="form-control"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-end">
            <button type="button" className="btn btn-default" onClick={onBack}>
              回上一步
            </button>
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default CheckoutForm;
