import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaCartPlus, FaShoppingCart } from 'react-icons/fa';

// utils
import { calculateCartTotal } from '@/utils/cartUtils';

// components
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

const CartTable = ({
  carts,

  // onClear,
  // onUpdate,
  // onDelete,
  actions,
  isQtyLoading,
  isDeleteLoading,
  onNext,
}) => {
  const cartTotal = useMemo(() => calculateCartTotal(carts), [carts]);

  return (
    <>
      {carts.length > 0 ? (
        <>
          <div className="text-end py-3">
            <button onClick={actions.onClear} className="btn btn-outline-danger" type="button">
              清空購物車
            </button>
          </div>
          <table className="table cart-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '200px' }}>操作</th>
                <th style={{ width: '250px' }}>品名</th>
                <th style={{ width: '250px' }}>圖片</th>
                <th style={{ width: '200px' }}>單價</th>
                <th style={{ width: '200px' }}>數量/單位</th>
                <th style={{ width: '200px' }} className="text-end">
                  合計
                </th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id}>
                  <td>
                    <button
                      onClick={() => actions.onDelete(cart.id)}
                      disabled={isDeleteLoading(cart.id)}
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                    >
                      {isDeleteLoading(cart.id) ? <BtnLoader size="sm" /> : <FaTrash size={18} />}
                    </button>
                  </td>
                  <td>{cart.product.title}</td>
                  <td>
                    <ProductImage
                      src={cart.product.imageUrl}
                      alt={cart.product.title}
                      size="small"
                    />
                  </td>
                  <td>{cart.product.price.toLocaleString()}</td>
                  <td style={{ width: '150px' }}>
                    <div className="d-flex align-items-center">
                      <div className="btn-group me-2" role="group">
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
                        {cart.product.unit}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">{cart.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="text-end">
                  總計：
                </td>
                <td className="text-end" style={{ width: '130px' }}>
                  {cartTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="text-end py-3">
            <button onClick={onNext} className="btn btn-outline-primary" type="button">
              前往填寫資料 →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-muted">
          <p className="">
            <FaShoppingCart size={20} /> 購物車是空的
          </p>
          <Link to="/products" className="btn btn-outline-primary mt-2">
            <FaCartPlus size={20} />
            去逛商品
          </Link>
        </div>
      )}
    </>
  );
};

export default CartTable;
