import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';

const CartEmpty = () => {
  return (
    <div className="cart-empty-state cart-state-card cart-state-card--empty card">
      <FaCartPlus size={32} className="cart-state-card__icon" aria-hidden="true" />

      <h2 className="cart-state-card__title">您的購物車是空的</h2>

      <p className="cart-state-card__description">前往商品頁挑選喜歡的植栽與生活選品。</p>

      <div className="cart-state-card__actions">
        <Link to="/products" className="ui-btn ui-btn--outline-primary">
          去逛商品
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
