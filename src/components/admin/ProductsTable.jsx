// constants
import { PRODUCT_CONTENT_MAP } from '@/constants/productConstants';
// utils
import { formatCategoryPreview, getProductUnitLabel } from '@/utils/productFormatter';
// components
import Pagination from '@/components/Pagination';
import StarRating from '@/components/admin/StarRating';

const ProductsTable = ({
  products,
  pageInfo,
  handlePageChange,
  openProductModal,
  openDeleteModal,
  productCount,
}) => {
  if (productCount === 0) {
    return <p className="text-muted mt-4">目前沒有商品資料。</p>;
  }

  return (
    <>
      <div className="admin-panel mt-4">
        <div className="admin-panel__header">
          <div>
            <h4 className="mb-1">商品快速總覽</h4>
            <p className="text-muted small mb-0">目前共 {productCount} 筆商品資料</p>
          </div>

          <button
            className="btn btn-primary px-4"
            onClick={() => {
              openProductModal('create');
            }}
          >
            ＋ 新增商品
          </button>
        </div>

        <div className="admin-panel__body">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th width="34%">商品資訊</th>
                <th width="14%">價格資訊</th>
                <th width="22%">商品標籤</th>
                <th width="10%">狀態</th>
                <th width="20%">操作</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const rawTags = product.content ? product.content.split('|') : [];
                const contentTags = rawTags.slice(0, 2);
                const extraTagCount = rawTags.length - 2;

                return (
                  <tr key={product.id}>
                    {/* 商品資訊 */}
                    <td>
                      <div className="admin-product-info">
                        <div className="admin-product-info__thumb">
                          <img src={product.imageUrl} alt={product.title} />
                        </div>

                        <div className="admin-product-info__content">
                          <h6>{product.title}</h6>
                          {/* <p>{getCategoryPreview(product.category) || '未設定分類'}</p> */}
                          <p>{formatCategoryPreview(product.category) || '未設定分類'}</p>
                          {/* <small>{getUnitLabel(product.unit) || '未設定單位'}</small> */}
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
                                  {PRODUCT_CONTENT_MAP[tag]?.label || tag}
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

        <div className="admin-panel__footer d-flex justify-content-center">
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
