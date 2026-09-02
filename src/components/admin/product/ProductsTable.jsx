import PropTypes from 'prop-types';

// constants
import { PRODUCT_PERSONALITY_MAP } from '@/constants/productConstants';
// utils
import { formatCategoryPreview, getProductUnitLabel } from '@/utils/product/productFormatter';
// components
import StarRating from '@/components/admin/StarRating';

const ProductsTable = ({
  products,
  openProductModal,
  openDeleteModal,
  productTotalCount,
  hasProducts,
  selectedProductId,
}) => {
  if (productTotalCount === 0) {
    return (
      <div className="admin-empty-state admin-empty-state--panel">
        <p className="text-muted mb-2">
          {hasProducts ? '目前沒有符合篩選條件的商品' : '目前尚無商品資料'}
        </p>
        <small className="text-secondary">
          {hasProducts
            ? '請調整搜尋、主題、健康狀態或問題類型後再查看'
            : '點擊右上角「新增商品」開始建立第一筆商品'}
        </small>
      </div>
    );
  }

  return (
    <div
      className="admin-table-wrapper admin-products-table-wrapper"
      role="region"
      aria-label="商品資料表，可水平捲動"
      tabIndex={0}
    >
      <table className="table admin-table admin-products-table align-middle mb-0">
        <caption className="visually-hidden">商品資訊、價格、標籤、啟用狀態與管理操作</caption>
        <thead>
          <tr>
            <th className="admin-products-table__info">商品資訊</th>
            <th className="admin-products-table__price">價格資訊</th>
            <th className="admin-products-table__tags">商品標籤</th>
            <th className="admin-products-table__status">狀態</th>
            <th className="admin-products-table__actions">操作</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const rawTags = product.personalityTags ? product.personalityTags.split('|') : [];
            const contentTags = rawTags.slice(0, 2);
            const extraTagCount = rawTags.length - 2;

            return (
              <tr
                key={product.id}
                className={
                  selectedProductId === product.id ? 'table-active admin-table__row--active' : ''
                }
              >
                {/* 商品資訊 */}
                <td>
                  <div className="admin-resource-info">
                    <div className="admin-resource-info__thumb">
                      <img src={product.imageUrl || null} alt={product.title} />
                    </div>

                    <div className="admin-resource-info__content">
                      <h6>{product.title}</h6>
                      <p>{formatCategoryPreview(product.category) || '未設定分類'}</p>
                      <small>{getProductUnitLabel(product.unit) || '未設定單位'}</small>
                    </div>
                  </div>
                </td>

                {/* 價格 */}
                <td>
                  <div className="admin-price">
                    <span className="old-price">NT$ {product.origin_price}</span>
                    <span className="new-price">NT$ {product.price}</span>
                  </div>
                </td>

                {/* 標籤 */}
                <td>
                  <div className="admin-tags">
                    <div className="admin-tags__list">
                      {contentTags.length > 0 ? (
                        <>
                          {contentTags.map((tag, i) => (
                            <span key={i} className="badge text-bg-light border">
                              {PRODUCT_PERSONALITY_MAP[tag]?.label || tag}
                            </span>
                          ))}

                          {extraTagCount > 0 && (
                            <span className="badge text-bg-secondary">+{extraTagCount}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted small">尚未設定標籤</span>
                      )}
                    </div>

                    <StarRating rating={product.rating ?? 0} />
                  </div>
                </td>

                {/* 狀態 */}
                <td>
                  {product.is_enabled ? (
                    <span className="badge text-bg-success">啟用中</span>
                  ) : (
                    <span className="badge text-bg-secondary">未啟用</span>
                  )}
                </td>

                {/* 操作 */}
                <td>
                  <div className="btn-group admin-table__actions">
                    <button
                      type="button"
                      onClick={() => openProductModal('edit', product)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      編輯
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(product)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ProductsTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  openProductModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  productTotalCount: PropTypes.number.isRequired,
  hasProducts: PropTypes.bool.isRequired,
  selectedProductId: PropTypes.string,
};

ProductsTable.defaultProps = {
  selectedProductId: null,
};

export default ProductsTable;
