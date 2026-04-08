import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Link } from 'react-router-dom';
import { handleApiError } from '@/utils/apiErrorHandler';
// hooks
import { useToast } from '@/hooks/useToast';

import {
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
} from '@/services/cartService';

import { calculateCartTotal } from '@/utils/cartUtils';

import PageLoader from '@/components/PageLoader';
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

import { FaTrash, FaPlus, FaMinus, FaCartPlus, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const { success, showError, warning } = useToast();

  const [carts, setCarts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // 修改/刪除 cart item 時的 loading 狀態，由於是區域性的狀態，且會同時存在多個，所以改用物件來儲存，以 cart_id 作為 key 來標定 loading 的位置
  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態
  const isQtyLoading = (id) => loadingItems[id] === 'qty';
  const isDeleteLoading = (id) => loadingItems[id] === 'delete';
  // const cartTotal = calculateCartTotal(carts);
  // useMemo 可用可不用，主要是給大型專案用來優化效能，避免不必要的重複計算，這裡示範用法，實際上對這個小專案幫助不大
  const cartTotal = useMemo(() => calculateCartTotal(carts), [carts]);

  // 取得 cart.js 並將try catch交給呼叫的函式處理包含loading，
  // 讓 fetchCart  專注在抓資料，並且能在需要時重複使用
  const fetchCart = async () => {
    const carts = await getCartItems();
    setCarts(carts);
  };

  // 調整購物車品項
  const handleUpdateCartItem = async (cart_id, product_id, qty = 1) => {
    // 改為在局部按鈕上顯示 loading， 避免整個畫面都被遮罩，提升使用體驗
    // setIsScreenLoading(true); 所以這段刪掉，
    // 改為下面的 loadingItems 狀態來控制按鈕的 loading 狀態

    // 如果 qty 小於 1，直接返回不做任何處理 作法A
    // 如果 qty 小於 1，直接刪掉cart item 作法B
    if (qty < 1) {
      const confirmDelete = window.confirm('商品數量為 0 會直接刪除購物車品項，確定要刪除嗎？');

      if (!confirmDelete) return;

      await handleDeleteCartItem(cart_id);
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: 'qty',
    }));

    try {
      await updateCartItem(cart_id, product_id, qty);
      await fetchCart();
      setErrorMessage('');
    } catch (error) {
      const errorMessage = handleApiError(error, setErrorMessage, '調整購物車數量失敗');
      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => {
        const newState = { ...prev };
        delete newState[cart_id];
        return newState;
      });
    }
  };
  // 刪除購物車品項
  const handleDeleteCartItem = async (cart_id) => {
    // 改為在局部按鈕上顯示 loading， 避免整個畫面都被遮罩，提升使用體驗
    // setIsScreenLoading(true); 所以這段刪掉，改為下面的 loadingItems 狀態來控制按鈕的 loading 狀態
    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: 'delete',
    }));
    try {
      await deleteCartItem(cart_id);
      //成功後刷新購物車
      await fetchCart();
      setErrorMessage('');
    } catch (error) {
      const errorMessage = handleApiError(error, setErrorMessage, '刪除購物車品項失敗');
      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => {
        const newState = { ...prev };
        delete newState[cart_id];
        return newState;
      });
    }
  };
  // 移除全部購物車品項
  const handleClearCart = async () => {
    if (!window.confirm('確定要清空購物車嗎？')) return;
    setIsScreenLoading(true);
    try {
      await clearCart();
      await fetchCart();
      setErrorMessage('');

      success('清空全部購物車成功。');
    } catch (error) {
      const errorMessage = handleApiError(error, setErrorMessage, '清空全部購物車失敗');
      showError(errorMessage);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 送出訂單 + Submit事件驅動
  const handleCreateOrder = async (orderData) => {
    setIsScreenLoading(true);
    try {
      await createOrder(orderData);
      // 由於前台沒有會員機制，所以是所有人共用cart，訂單送出成功後刷新購物車等待下一位客人
      await fetchCart();
      setErrorMessage('');
      reset(); // 提交成功後重設表單
      success('已送出訂單。');
    } catch (error) {
      const errorMessage = handleApiError(error, setErrorMessage, '訂單送出失敗。');
      showError(errorMessage);
    } finally {
      setIsScreenLoading(false);
    }
  };
  const onSubmit = handleSubmit((data) => {
    if (carts.length < 1) {
      // 如果 購物車為空，直接返回不做任何處理
      setErrorMessage('您的購物車是空的');
      warning('您的購物車是空的');
      return;
    }

    // data資料"解構"成message，剩下的打包一起變成user
    const { message, ...user } = data;
    const orderData = {
      data: {
        user: user,
        message: message,
      },
    };
    handleCreateOrder(orderData);
  });

  // 畫面渲染後初步載入購物車
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const loadCart = async () => {
      setIsScreenLoading(true);
      try {
        await fetchCart();
        setErrorMessage('');
      } catch (error) {
        const errorMessage = handleApiError(error, setErrorMessage);
        showError(errorMessage);
      } finally {
        setIsScreenLoading(false);
      }
    };

    loadCart();
  }, []);

  return (
    <>
      <div className="container">
        {errorMessage && (
          <div className="col-12">
            <div className="alert alert-danger py-2">{errorMessage}</div>
          </div>
        )}
        <div className="mt-4">
          {/* cartTable */}
          {carts.length > 0 ? (
            <>
              <div className="text-end py-3">
                <button
                  onClick={() => handleClearCart()}
                  className="btn btn-outline-danger"
                  type="button"
                >
                  清空購物車
                </button>
              </div>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>操作</th>
                    <th style={{ width: '250px' }}>品名</th>
                    <th style={{ width: '250px' }}>圖片</th>
                    <th style={{ width: '200px' }}>單價</th>
                    <th style={{ width: '200px' }}>數量/單位</th>
                    <th style={{ width: '200px' }} className="text-end">
                      合計
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {carts.map((cart) => (
                    <tr key={cart.id}>
                      <td>
                        <button
                          onClick={() => handleDeleteCartItem(cart.id)}
                          disabled={isDeleteLoading(cart.id)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          {isDeleteLoading(cart.id) ? (
                            <BtnLoader size="sm" />
                          ) : (
                            <FaTrash size={18} />
                          )}
                        </button>
                      </td>
                      <td>{cart.product.title}</td>
                      <td>
                        <ProductImage
                          src={cart.product.imageUrl}
                          alt={cart.product.title}
                          size="small"
                        />
                      </td>
                      <td>{cart.product.price.toLocaleString()}</td>
                      <td style={{ width: '150px' }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() =>
                                handleUpdateCartItem(cart.id, cart.product.id, cart.qty - 1)
                              }
                              disabled={isQtyLoading(cart.id)}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              {isQtyLoading(cart.id) ? (
                                <BtnLoader aria-hidden="true" size="sm" />
                              ) : (
                                <FaMinus size={20} />
                              )}
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: '50px', cursor: 'auto' }}
                            >
                              {cart.qty}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdateCartItem(cart.id, cart.product.id, cart.qty + 1)
                              }
                              disabled={isQtyLoading(cart.id)}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              {isQtyLoading(cart.id) ? (
                                <BtnLoader aria-hidden="true" size="sm" />
                              ) : (
                                <FaPlus size={20} />
                              )}
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cart.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cart.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: '130px' }}>
                      {cartTotal.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <div className="text-center text-muted">
              <p className="">
                <FaShoppingCart size={20} /> 購物車是空的
              </p>
              <Link to="/products" className="btn btn-outline-primary mt-2">
                <FaCartPlus size={20} />
                去逛商品
              </Link>
            </div>
          )}
        </div>

        {/* orderFormTable */}
        <div className="my-5 row justify-content-center">
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
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default CartPage;
