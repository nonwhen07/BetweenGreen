import { FaMinus, FaPlus } from 'react-icons/fa';

import BtnLoader from '@/components/BtnLoader';

const QuantityStepper = ({
  value = 0,
  unit = '',
  itemName = '商品',
  isLoading = false,
  isDisabled = false,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  size = 'md',
  onDecrease,
  onIncrease,
}) => {
  return (
    <div className={`quantity-stepper quantity-stepper--${size}`}>
      <button
        type="button"
        className="quantity-stepper__button"
        disabled={isDisabled || isLoading || value <= min}
        aria-label={`減少 ${itemName} 數量`}
        onClick={onDecrease}
      >
        {isLoading ? <BtnLoader size="sm" /> : <FaMinus size={14} aria-hidden="true" />}
      </button>

      <span className="quantity-stepper__value" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        className="quantity-stepper__button"
        disabled={isDisabled || isLoading || value >= max}
        aria-label={`增加 ${itemName} 數量`}
        onClick={onIncrease}
      >
        {isLoading ? <BtnLoader size="sm" /> : <FaPlus size={14} aria-hidden="true" />}
      </button>

      {unit && <span className="quantity-stepper__unit">{unit}</span>}
    </div>
  );
};

export default QuantityStepper;
