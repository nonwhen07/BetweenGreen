import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';

// utils
import { formatCategoryPreview, getProductUnitShortLabel } from '@/utils/product/productFormatter';

// components
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';
import QuantityStepper from '@/components/shared/QuantityStepper';

const EditableCartItems = ({ carts, actions, isQtyLoading, isDeleteLoading }) => {
  const currencyFormatter = new Intl.NumberFormat('zh-TW');

  const getCategoryParts = (category = '') => {
    return formatCategoryPreview(category).split('-').filter(Boolean);
  };

  if (carts?.length === 0) {
    return null;
  }

  return (
    <div className="cart-ui-wrapper">
      <div className="editable-cart-items">
        <header className="editable-cart-items__header">
          <div>
            <p className="editable-cart-items__eyebrow">Your Selection</p>
            <h2 className="editable-cart-items__heading">購物車內容</h2>
          </div>

          <span className="editable-cart-items__count">
            <ShoppingBag size={16} aria-hidden="true" />
            {carts.length} 項商品
          </span>
        </header>

        <div className="editable-cart-items__list">
          {carts.map((cart) => {
            const product = cart.product || {};
            const cartId = cart.id;
            const productId = product.id;
            const productTitle = product.title || '商品資料暫時無法取得';
            const categoryParts = getCategoryParts(product.category);
            const unitLabel = getProductUnitShortLabel(product.unit) || '件';
            const unitPrice = Number(product.price || 0);
            const subtotal = Number(
              cart.final_total ?? cart.total ?? unitPrice * Number(cart.qty || 0),
            );
            const isItemBusy = isQtyLoading(cartId) || isDeleteLoading(cartId);

            return (
              <article
                key={cartId || productId || productTitle}
                className={`editable-cart-item${isItemBusy ? ' is-loading' : ''}`}
                aria-busy={isItemBusy}
              >
                <div className="editable-cart-item__image">
                  <ProductImage src={product.imageUrl} alt={productTitle} size="small" />
                </div>

                <div className="editable-cart-item__content">
                  <div className="editable-cart-item__heading-group">
                    <p className="editable-cart-item__eyebrow">Between Green Selection</p>

                    <h3 className="editable-cart-item__title">
                      {productId ? (
                        <Link to={`/product/${productId}`}>{productTitle}</Link>
                      ) : (
                        productTitle
                      )}
                    </h3>

                    {product.titleEn && (
                      <p className="editable-cart-item__title-en">{product.titleEn}</p>
                    )}
                  </div>

                  {categoryParts.length > 0 && (
                    <div className="cart-category-tags editable-cart-item__categories">
                      {categoryParts.map((item) => (
                        <span key={item} className="cart-category-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="editable-cart-item__price">
                    <span>單價</span>
                    <strong>NT$ {currencyFormatter.format(unitPrice)}</strong>
                  </div>

                  <div className="editable-cart-item__footer">
                    <div className="editable-cart-item__qty">
                      <QuantityStepper
                        value={cart.qty}
                        unit={unitLabel}
                        isLoading={isQtyLoading(cart.id)}
                        isDisabled={!cartId || !productId}
                        itemName={productTitle}
                        onDecrease={() => actions.onUpdate(cartId, productId, cart.qty - 1)}
                        onIncrease={() => actions.onUpdate(cartId, productId, cart.qty + 1)}
                      />
                    </div>

                    <div className="editable-cart-item__subtotal">
                      <span>小計</span>
                      <strong>NT$ {currencyFormatter.format(subtotal)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="editable-cart-item__delete"
                    disabled={!cartId || isDeleteLoading(cartId)}
                    aria-label={`刪除 ${productTitle}`}
                    title="移除商品"
                    onClick={() => actions.onDelete(cartId)}
                  >
                    {isDeleteLoading(cartId) ? <BtnLoader size="sm" /> : <Trash2 size={18} />}
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
