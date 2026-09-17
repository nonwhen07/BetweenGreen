import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// constants
import { CART_STEPS } from '@/constants/cartConstants';
// components
import CartSteps from '@/components/front/Cart/CartSteps';
import CartEmpty from '@/components/front/Cart/CartEmpty';
import CartTable from '@/components/front/Cart/CartTable';
import CheckoutForm from '@/components/front/Cart/CheckoutForm';
import CartSummary from '@/components/front/Cart/CartSummary';

// services
import { createOrder } from '@/services/orderService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useCart } from '@/hooks/cart/useCart';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const CartPage = () => {
  const { step: stepParam } = useParams(); // 取得網址中 :step 的值
  const isCartStep = stepParam === 'step1' || stepParam === 'step2';
  // 根據 Hash 找出目前的步驟物件 (預設為第一步)
  const currentStepData = useMemo(() => {
    return CART_STEPS.find((step) => step.path === stepParam) || CART_STEPS[0];
  }, [stepParam]);
  // 取得 ID 用於判斷條件
  const activeStep = currentStepData.id;

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

  const [errorMessage, setErrorMessage] = useState('');

  const finalError = error || errorMessage;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
      // 訂單成立後刷新購物車，並將付款流程交給帶有 orderId 的正式付款頁。
      try {
        await fetchCart();
      } catch {
        warning('訂單已建立，但購物車狀態更新失敗；請稍後重新整理確認。');
      }

      const { orderId } = orderData;

      navigate(`/checkout-payment/${orderId}`);
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

  // 畫面渲染後初步載入購物車
  useEffect(() => {
    if (!isCartStep) return;

    let isActive = true;

    const initCart = async () => {
      start();
      try {
        const latestCartData = await fetchCart();

        if (!isActive) return;

        setErrorMessage('');

        if (stepParam === 'step2' && latestCartData.carts.length === 0) {
          warning('購物車目前沒有商品，請先加入商品再填寫資料。');
          navigate('/cart/step1', { replace: true });
        }
      } catch (error) {
        if (!isActive) return;

        const errorMessage = extractErrorMessage(error, setErrorMessage);
        showError(errorMessage);
      } finally {
        stop();
      }
    };

    initCart();

    return () => {
      isActive = false;
    };
  }, [fetchCart, isCartStep, navigate, showError, start, stepParam, stop, warning]);

  // 改為簡單的：切換步驟就回到頂部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  if (!isCartStep) {
    return <Navigate to="/cart/step1" replace />;
  }

  return (
    <div className="cart-page container ui-container ui-container--checkout-flow">
      <header className="cart-page__hero" data-aos="fade-up">
        <h1 className="page-title" key={activeStep}>
          {currentStepData.label}
        </h1>
      </header>

      <CartSteps currentStep={activeStep} data-aos="fade-in" data-aos-delay="100" />

      <main className="cart-page__main">
        {finalError && (
          <section
            className="cart-page__error cart-state-card cart-state-card--error card"
            key={finalError}
          >
            <h2 className="cart-state-card__title">Oops! 您的訂單資訊有點問題</h2>

            <p className="cart-state-card__description">詳細錯誤訊息：{finalError}</p>
          </section>
        )}

        {activeStep === 1 && (
          <section
            id="step1"
            className="ui-section ui-section--checkout-flow ui-section--checkout-flow-slide-up is-active mt-4"
          >
            {carts?.length === 0 ? (
              <CartEmpty />
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
                    setErrorMessage('');

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

        {activeStep === 2 && (
          <section id="step2" className="ui-section ui-section--checkout-flow is-active">
            <CheckoutForm
              carts={carts}
              cartData={cartData}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              onSubmit={handleSubmitOrder}
              onBack={() => {
                navigate('/cart/step1');
              }}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default CartPage;
