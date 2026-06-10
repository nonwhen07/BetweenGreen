// constants
import { PRODUCT_PERSONALITY_MAP } from '@/constants/productConstants';
// utils
import { formatCategoryPreview, getProductUnitLabel } from '@/utils/productFormatter';
// components
import StarRating from '@/components/admin/StarRating';

const ProductsTable = ({
  products,
  // pageInfo,
  // handlePageChange,
  openProductModal,
  openDeleteModal,
  // productCount,
  productTotalCount,
  selectedProductId,
}) => {
  return (
    <>
      <div className="admin-panel__header">
        <div>
          <h4 className="mb-1">商品快速總覽</h4>
          {/* <p className="text-muted small mb-0">目前共 {productCount} 筆商品資料</p> */}
          <p className="text-muted small mb-0">目前共 {productTotalCount} 筆商品資料</p>
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
        {productTotalCount === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-2">目前尚商品資料</p>
            <small className="text-secondary">點擊右上角「新增商品」開始建立第一篇內容</small>
          </div>
        ) : (
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
                const rawTags = product.personalityTags ? product.personalityTags.split('|') : [];
                const contentTags = rawTags.slice(0, 2);
                const extraTagCount = rawTags.length - 2;

                return (
                  <tr
                    key={product.id}
                    className={
                      selectedProductId === product.id
                        ? 'table-active admin-table__row--active'
                        : ''
                    }
                  >
                    {/* 商品資訊 */}
                    <td>
                      <div className="admin-product-info">
                        <div className="admin-product-info__thumb">
                          <img src={product.imageUrl || null} alt={product.title} />
                        </div>

                        <div className="admin-product-info__content">
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
        )}
      </div>

      {/* <div className="admin-panel__footer d-flex justify-content-center">
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        <BrandPagination
          currentPage={pageInfo.current_page}
          totalPages={pageInfo.total_pages}
          onPageChange={handlePageChange}
        />
      </div> */}
    </>
  );
};

export default ProductsTable;
