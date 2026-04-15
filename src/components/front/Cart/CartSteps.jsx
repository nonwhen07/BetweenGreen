import React from 'react';

// constants
import { CART_STEPS } from '@/constants/cartConstants';

const CartSteps = ({ currentStep }) => {
  return (
    <>
      <div className="cart-steps-container">
        {CART_STEPS.map((step, index) => {
          const IconComponent = step.icon; // 取得元件
          const isActive = currentStep >= step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className={`step-item ${isActive ? 'active' : ''}`}>
                <div className="icon-wrapper">
                  <IconComponent size={20} />
                </div>
                <span className="step-label">{step.label}</span>
              </div>

              {index < CART_STEPS.length - 1 && (
                <div className={`step-line ${isCompleted ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default CartSteps;
