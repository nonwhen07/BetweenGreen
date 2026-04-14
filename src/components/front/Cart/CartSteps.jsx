const CartSteps = ({ currentStep }) => {
  const steps = ['購物車', '填寫資料', '完成訂單'];

  return (
    <div className="cart-steps">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        return (
          <div
            key={step}
            className={`step 
              ${currentStep >= stepNumber ? 'active' : ''}
            `}
          >
            <div className="step-circle">{stepNumber}</div>
            <p>{step}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CartSteps;
