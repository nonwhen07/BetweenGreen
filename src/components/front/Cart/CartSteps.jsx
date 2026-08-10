import React from 'react';

// constants
import { CART_STEPS } from '@/constants/cartConstants';

const CartSteps = ({ currentStep, ...props }) => {
  return (
    <nav className="cart-steps" aria-label="購物流程" {...props}>
      {CART_STEPS.map((step, index) => {
        const IconComponent = step.icon;
        const isActive = currentStep >= step.id;
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`cart-steps__item ${isActive ? 'is-active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="cart-steps__icon" aria-hidden="true">
                <IconComponent size={20} />
              </div>

              <span className="cart-steps__label">{step.label}</span>
            </div>

            {index < CART_STEPS.length - 1 && (
              <div
                className={`cart-steps__line ${isCompleted ? 'is-completed' : ''}`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CartSteps;
