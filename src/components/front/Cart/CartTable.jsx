import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
import { formatCategoryPreview, getProductUnitShortLabel } from '@/utils/productFormatter';

// components
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';
import QuantityStepper from '@/components/shared/QuantityStepper';

const CartTable = ({ carts, actions, isQtyLoading, isDeleteLoading }) => {
  const cartTotal = useMemo(() => calculateCartTotal(carts), [carts]);

  const getCategoryParts = (category = '') => {
    return formatCategoryPreview(category).split('-').filter(Boolean);
  };

  if (carts?.length === 0) {
    return null; // 如果購物車是空的，就不顯示摘要
  }

  return (
    <>
      <div className="cart-ui-wrapper">
        <div className="editable-cart-items">
          {/* Mobile / Pad */}
          <div className="editable-cart-items__list">
            {carts.map((cart) => {
              const unitLabel = getProductUnitShortLabel(cart.product.unit) || '未設定單位';

              return (
                <article key={`list-${cart.id}`} className="editable-cart-item">
                  <div className="editable-cart-item__image">
                    <ProductImage
                      src={cart.product.imageUrl}
                      alt={cart.product.title}
                      size="small"
                    />
                  </div>

                  <div className="editable-cart-item__content">
                    <div className="editable-cart-item__main">
                      <h3 className="editable-cart-item__title">{cart.product.title}</h3>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm btn-trash"
                        disabled={isDeleteLoading(cart.id)}
                        aria-label={`刪除 ${cart.product.title}`}
                        onClick={() => actions.onDelete(cart.id)}
                      >
                        {isDeleteLoading(cart.id) ? <BtnLoader size="sm" /> : <Trash2 size={18} />}
                      </button>
                    </div>

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
                          onDecrease={() =>
                            actions.onUpdate(cart.id, cart.product.id, cart.qty - 1)
                          }
                          onIncrease={() =>
                            actions.onUpdate(cart.id, cart.product.id, cart.qty + 1)
                          }
                        />
                      </div>

                      <div className="editable-cart-item__subtotal">
                        <span>小計</span>
                        <strong>NT$ {cart.total.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="editable-cart-items__table">
            <div className="table-responsive cart-table-container">
              <table className="table cart-table align-middle">
                <thead className="cart-table__header">
                  <tr>
                    <th className="cart-table__col--action">操作</th>
                    <th className="cart-table__col--info">商品名稱</th>
                    <th className="cart-table__col--category">品項種類</th>
                    <th className="cart-table__col--image">圖片</th>
                    <th className="cart-table__col--price">單價</th>
                    <th className="cart-table__col--qty">數量</th>
                    <th className="cart-table__col--subtotal">小計</th>
                  </tr>
                </thead>
                <tbody className="cart-table__body">
                  {carts.map((cart) => (
                    <tr key={cart.id}>
                      <td className="cart-table__col--action">
                        <button
                          onClick={() => actions.onDelete(cart.id)}
                          disabled={isDeleteLoading(cart.id)}
                          type="button"
                          className="btn btn-outline-danger btn-sm btn-trash"
                        >
                          {isDeleteLoading(cart.id) ? (
                            <BtnLoader size="sm" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </td>
                      <td className="cart-table__col--info">{cart.product.title}</td>
                      <td className="cart-table__col--category">
                        <div className="cart-category-tags">
                          {getCategoryParts(cart.product.category).map((item) => (
                            <span key={item} className="cart-category-tag">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="cart-table__col--image">
                        <ProductImage
                          src={cart.product.imageUrl}
                          alt={cart.product.title}
                          size="small"
                        />
                      </td>
                      <td className="cart-table__col--price">
                        NT$ {cart.product.price.toLocaleString()}
                      </td>
                      <td className="cart-table__col--qty">
                        <QuantityStepper
                          value={cart.qty}
                          unit={getProductUnitShortLabel(cart.product.unit) || '未設定單位'}
                          isLoading={isQtyLoading(cart.id)}
                          itemName={cart.product.title}
                          onDecrease={() =>
                            actions.onUpdate(cart.id, cart.product.id, cart.qty - 1)
                          }
                          onIncrease={() =>
                            actions.onUpdate(cart.id, cart.product.id, cart.qty + 1)
                          }
                        />
                      </td>
                      <td className="cart-table__col--subtotal">
                        NT$ {cart.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="cart-table__footer">
                  <tr>
                    <td colSpan="6" className="text-end">
                      總計：
                    </td>
                    <td className="cart-table__total-amount text-end" style={{ width: '130px' }}>
                      NT$ {cartTotal.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartTable;
