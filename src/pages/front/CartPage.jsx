import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// constants
import { CART_STEPS } from '@/constants/cartConstants';
// components
import CartSteps from '@/components/front/Cart/CartSteps';
import CartEmpty from '@/components/front/Cart/CartEmpty';
import CartTable from '@/components/front/Cart/CartTable';
import CheckoutForm from '@/components/front/Cart/CheckoutForm';
import CartSummary from '@/components/front/Cart/CartSummary';
import CheckoutPayment from '@/components/front/Cart/CheckoutPayment';

// services
import { createOrder, payOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useCart } from '@/hooks/cart/useCart';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const CartPage = () => {
  const { step: stepParam } = useParams(); // 取得網址中 :step 的值
  // 根據 Hash 找出目前的步驟物件 (預設為第一步)
  const currentStepData = useMemo(() => {
    return CART_STEPS.find((s) => s.path === stepParam) || CART_STEPS[0];
  }, [stepParam]);
  // 取得 ID 用於判斷條件
  const activeStep = currentStepData.id;

  const location = useLocation();
  const routeState = location.state || {};

  const navigate = useNavigate();
  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();

  const {
    cartData,
    carts,
    loadingItems,
    error,
    fetchCart,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleClearCart,
    handleApplyCoupon,
    isCouponLoading,
  } = useCart();

  const [lastOrderCart, setLastOrderCart] = useState([]);
  const [orderID, setOrderID] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const finalError = error || errorMessage;
  const finalOrderID = routeState.orderId || orderID;
  const finalCart = routeState.carts || lastOrderCart;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm();

  // 修改/刪除 cart item 時的 loading 狀態，由於是區域性的狀態，且會同時存在多個，所以改用物件來儲存，以 cart_id 作為 key 來標定 loading 的位置
  const isQtyLoading = (id) => loadingItems[id] === 'qty';
  const isDeleteLoading = (id) => loadingItems[id] === 'delete';

  // 送出購物車轉化成訂單 + Submit事件驅動
  const handleCreateOrder = async (orderPayload) => {
    start();
    try {
      const orderData = await createOrder(orderPayload);
      // 由於前台沒有會員機制，所以是所有人共用cart， 訂單送出成功後刷新購物車等待下一位客人，
      // 並先記錄紀錄這一次訂單資料(轉換成訂單後購物車會被清空)
      setLastOrderCart([...carts]); // OrderCreated  顯示訂單資料
      const currentCartSnapshot = [...carts];
      await fetchCart();

      const { orderId } = orderData;
      setOrderID(orderId); // OrderCreated  顯示訂單ID

      //成功後才跳轉到 Step_3
      navigate('/cart/step3', {
        state: {
          orderId,
          carts: currentCartSnapshot,
        },
      });
      setErrorMessage('');
      success(`已送出訂單，您的訂單編號為：${orderId}`);
      reset(); // 提交成功後重設表單
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setErrorMessage, '訂單送出失敗。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };
  const handleSubmitOrder = handleSubmit(async (formData) => {
    if (carts?.length < 1) {
      // 如果 購物車為空，直接返回不做任何處理
      setErrorMessage('您的購物車是空的!!');
      warning('您的購物車是空的!!');
      return;
    }

    const { shippingName, shippingTel, shippingEmail, city, district, addressDetail, message } =
      formData;
    const fullAddress = `${city}${district}${addressDetail}`;
    const orderPayload = {
      data: {
        user: {
          name: shippingName,
          tel: shippingTel,
          email: shippingEmail,
          address: fullAddress,
        },
        message,
      },
    };

    await handleCreateOrder(orderPayload);
  });

  // 付款金流事件驅動
  const handlePay = async () => {
    const targetOrderID = finalOrderID;
    const targetCart = finalCart;

    if (!targetOrderID) {
      warning('找不到訂單編號，請重新建立訂單。');
      return;
    }

    start();

    try {
      await payOrder(targetOrderID);

      success('您的訂單付款成功。');

      navigate(`/checkout-success/${targetOrderID}`, {
        state: {
          orderId: targetOrderID,
          carts: targetCart,
        },
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setErrorMessage, '訂單付款失敗。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  // 畫面渲染後初步載入購物車
  useEffect(() => {
    const initCart = async () => {
      start();
      try {
        await fetchCart();

        setErrorMessage('');
      } catch (error) {
        const errorMessage = extractErrorMessage(error, setErrorMessage);
        showError(errorMessage);
      } finally {
        stop();
      }
    };

    initCart();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  // 改為簡單的：切換步驟就回到頂部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  return (
    <>
      <div className="container ui-container ui-container--cart">
        {/* Hero-Section */}
        {/* <div className="cart-hero">
          <h1 className="page-title" key={activeStep} data-aos="flip-left" data-aos-delay="300">
            {currentStepData.label}
          </h1>
        </div> */}
        <div className="cart-hero" data-aos="fade-up">
          <h1 className="page-title" key={activeStep}>
            {currentStepData.label}
          </h1>
        </div>
        {/* Step Indicator */}
        {/* <CartSteps currentStep={activeStep} /> */}
        <div className="cart-steps-container" data-aos="fade-in" data-aos-delay="100">
          <CartSteps currentStep={activeStep} />
        </div>

        {/* Main Content */}
        <div className="cart-main">
          {/* error  */}
          {finalError && (
            <section className="ui-section ui-section--cartError" key={finalError}>
              <div className="d-flex flex-column align-items-center text-center py-3">
                <div className="cartError-mian alert alert-danger">
                  <h2 className="mb-3">Oops! 您的訂單資訊有點問題</h2>
                  <p className="mt-2">詳細錯誤訊息：{finalError}</p>
                </div>
              </div>
            </section>
          )}
          {/* step1 */}
          {activeStep === 1 && (
            <section
              id="step1"
              className="ui-section ui-section--cart ui-section--cart-slide-up active mt-4"
            >
              {carts?.length === 0 ? (
                <>
                  <CartEmpty />
                </>
              ) : (
                <>
                  <CartTable
                    carts={carts}
                    actions={{
                      onClear: handleClearCart,
                      onUpdate: handleUpdateCartItem,
                      onDelete: handleDeleteCartItem,
                    }}
                    isQtyLoading={isQtyLoading}
                    isDeleteLoading={isDeleteLoading}
                  />
                  <CartSummary
                    carts={carts}
                    cartData={cartData}
                    isCouponLoading={isCouponLoading}
                    actions={{
                      onClear: handleClearCart,
                      onApplyCoupon: handleApplyCoupon,
                    }}
                    onNext={() => {
                      setErrorMessage(''); // 先重置

                      if (carts?.length === 0) {
                        setErrorMessage('您的購物車是空的!!');
                        warning('您的購物車是空的!!');
                        return;
                      }

                      navigate('/cart/step2');
                    }}
                  />
                </>
              )}
            </section>
          )}

          {/* step2 */}
          {activeStep === 2 && (
            <section id="step2" className="ui-section ui-section--cart active">
              <CheckoutForm
                carts={carts}
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                watch={watch}
                onSubmit={handleSubmitOrder}
                onBack={() => {
                  navigate('/cart/step1');
                }}
              />
            </section>
          )}

          {/* step3 */}
          {activeStep === 3 && (
            <section id="step3" className="ui-section ui-section--cart active">
              {!finalOrderID ? (
                <p>訂單資料不存在</p>
              ) : finalCart.length === 0 ? (
                <p>訂單內容為空</p>
              ) : (
                <CheckoutPayment
                  orderID={finalOrderID}
                  orderItems={finalCart}
                  onSubmit={handlePay}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
