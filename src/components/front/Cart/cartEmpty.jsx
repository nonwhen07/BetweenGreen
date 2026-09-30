import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const CartEmpty = () => {
  return (
    <div className="cart-empty-state cart-state-card cart-state-card--empty card">
      <div className="cart-state-card__icon-wrap">
        <ShoppingBag size={28} className="cart-state-card__icon" aria-hidden="true" />
      </div>

      <span className="cart-state-card__eyebrow">Your Cart</span>

      <h2 className="cart-state-card__title">您的購物車是空的</h2>

      <p className="cart-state-card__description">前往商品頁挑選喜歡的植栽與生活選品。</p>

      <div className="cart-state-card__actions">
        <Link to="/products" className="ui-btn ui-btn--primary">
          去逛商品
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
