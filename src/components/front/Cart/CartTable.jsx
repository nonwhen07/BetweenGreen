import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaCartPlus, FaShoppingCart } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';

// constants

// utils
import { calculateCartTotal } from '@/utils/cartUtils';
// import { formatCategoryPreview, getProductUnitLabel } from '@/utils/productFormatter';
import { formatCategoryPreview, getProductUnitShortLabel } from '@/utils/productFormatter';

// components
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

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
        {/* 工具列：未來可擴充「批次操作」或「優惠提醒」 */}
        {/* <div className="cart-table-tools d-flex justify-content-between align-items-center text-end">
              <div className="cart-table-tools__extra">
                <div className="cart-table-tag">滿千免運中</div>
              </div>
            </div> */}

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
                      {isDeleteLoading(cart.id) ? <BtnLoader size="sm" /> : <Trash2 size={20} />}
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
                  <td className="cart-table__col--qty" style={{ width: '150px' }}>
                    <div className="qty-group d-flex align-items-center">
                      <div className="btn-group" role="group">
                        <button
                          onClick={() => actions.onUpdate(cart.id, cart.product.id, cart.qty - 1)}
                          disabled={isQtyLoading(cart.id)}
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                        >
                          {isQtyLoading(cart.id) ? (
                            <BtnLoader aria-hidden="true" size="sm" />
                          ) : (
                            <FaMinus size={20} />
                          )}
                        </button>
                        <span
                          className="btn border border-dark"
                          style={{ width: '50px', cursor: 'auto' }}
                        >
                          {cart.qty}
                        </span>

                        <button
                          onClick={() => actions.onUpdate(cart.id, cart.product.id, cart.qty + 1)}
                          disabled={isQtyLoading(cart.id)}
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                        >
                          {isQtyLoading(cart.id) ? (
                            <BtnLoader aria-hidden="true" size="sm" />
                          ) : (
                            <FaPlus size={20} />
                          )}
                        </button>
                      </div>

                      <span className="input-group-text bg-transparent border-0">
                        {getProductUnitShortLabel(cart.product.unit) || '未設定單位'}
                      </span>
                    </div>
                  </td>
                  <td className="cart-table__col--subtotal">NT$ {cart.total.toLocaleString()}</td>
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
    </>
  );
};

export default CartTable;
