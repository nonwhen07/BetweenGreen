import { Trash2 } from 'lucide-react';

// utils
import { formatCategoryPreview, getProductUnitShortLabel } from '@/utils/product/productFormatter';

// components
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';
import QuantityStepper from '@/components/shared/QuantityStepper';

const EditableCartItems = ({ carts, actions, isQtyLoading, isDeleteLoading }) => {
  const getCategoryParts = (category = '') => {
    return formatCategoryPreview(category).split('-').filter(Boolean);
  };

  if (carts?.length === 0) {
    return null;
  }

  return (
    <div className="cart-ui-wrapper">
      <div className="editable-cart-items">
        <div className="editable-cart-items__list">
          {carts.map((cart) => {
            const unitLabel = getProductUnitShortLabel(cart.product.unit) || '未設定單位';

            return (
              <article key={cart.id} className="editable-cart-item">
                <div className="editable-cart-item__image">
                  <ProductImage src={cart.product.imageUrl} alt={cart.product.title} size="small" />
                </div>

                <div className="editable-cart-item__content">
                  <h3 className="editable-cart-item__title">{cart.product.title}</h3>

                  <div className="cart-category-tags editable-cart-item__categories">
                    {getCategoryParts(cart.product.category).map((item) => (
                      <span key={item} className="cart-category-tag">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="editable-cart-item__price">
                    單價 NT$ {cart.product.price.toLocaleString()}
                  </div>

                  <div className="editable-cart-item__footer">
                    <div className="editable-cart-item__qty">
                      <QuantityStepper
                        value={cart.qty}
                        unit={unitLabel}
                        isLoading={isQtyLoading(cart.id)}
                        itemName={cart.product.title}
                        onDecrease={() => actions.onUpdate(cart.id, cart.product.id, cart.qty - 1)}
                        onIncrease={() => actions.onUpdate(cart.id, cart.product.id, cart.qty + 1)}
                      />
                    </div>

                    <div className="editable-cart-item__subtotal">
                      <span>小計</span>
                      <strong>NT$ {cart.total.toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm btn-trash editable-cart-item__delete"
                    disabled={isDeleteLoading(cart.id)}
                    aria-label={`刪除 ${cart.product.title}`}
                    onClick={() => actions.onDelete(cart.id)}
                  >
                    {isDeleteLoading(cart.id) ? <BtnLoader size="sm" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditableCartItems;
