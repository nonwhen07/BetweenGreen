import { FaMinus, FaPlus } from 'react-icons/fa';

import BtnLoader from '@/components/BtnLoader';

const QuantityStepper = ({
  value = 0,
  unit = '',
  itemName = '商品',
  isLoading = false,
  onDecrease,
  onIncrease,
}) => {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-stepper__button"
        disabled={isLoading || value <= 1}
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
        disabled={isLoading}
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
