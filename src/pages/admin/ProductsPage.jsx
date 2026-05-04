import { useEffect } from 'react';

// constants
import {
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  CATEGORY_SPECIES_MAP,
  PRODUCT_CONTENT_MAP,
  PRODUCT_UNIT_MAP,
} from '@/constants/productConstants';
// services
import { deleteProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useProducts } from '@/hooks/product/useProducts';
import { useProductModal } from '@/hooks/useProductModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import Pagination from '@/components/Pagination';
import ProductModal from '@/components/admin/ProductModal';
import DeleteModal from '@/components/admin/DeleteModal';
import StarRating from '@/components/admin/StarRating';

const ProductsPage = () => {
  // hooks init
  const { success, showError } = useToast();
  const { start, stop } = useLoading();
  const { products, pageInfo, fetchProducts } = useProducts({ isAdmin: true });
  const {
    isModalOpen: isProductModalOpen,
    modalMode,
    openProductModal,
    closeProductModal,

    categoryBuilder,
    selectedTags,
    handleCategoryBuilderChange,
    handleTagToggle,

    handleCustomFieldChange,
    handleImageChange,
    handleAddImage,
    handleDeleteImage,

    handleSubmitProduct,

    register,
    handleSubmit,
    watch,
    errors,
  } = useProductModal();
  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();

  // derived values
  const productCount = products?.length || 0;

  // helper functions（純顯示工具）
  // 產品分類預覽 - 從 category code 轉換為可讀的分類名稱
  const getCategoryPreview = (categoryCode = '') => {
    const [theme, type, species] = categoryCode.split('-');

    return [
      CATEGORY_THEME_MAP[theme]?.label,
      CATEGORY_TYPE_MAP[type]?.label,
      CATEGORY_SPECIES_MAP[species]?.label,
    ]
      .filter(Boolean)
      .join(' - ');
  };
  // 產品單位預覽 - 從 unit code 轉換為可讀的單位名稱
  const getUnitLabel = (unitValue = '') => {
    return (
      Object.values(PRODUCT_UNIT_MAP).find((item) => item.value === unitValue)?.label || unitValue
    );
  };

  // Page actions（CRUD / pagination）
  const handlePageChange = (page = 1) => {
    fetchProducts({ page });
  };
  const handleUpdateProduct = handleSubmit((formData) => {
    // submit 真正發生在點按鈕那瞬間 start() 會先觸發，然後才是 handleSubmitProduct 的邏輯
    start();

    return handleSubmitProduct(
      formData,
      async () => {
        await fetchProducts({ page: pageInfo.current_page || 1 });
        success(modalMode === 'create' ? '產品新增成功！' : '產品更新成功！');
        stop();
      },
      (errorMessage) => {
        showError(errorMessage);
        stop();
      },
    );
  });
  const handleDeleteProduct = async () => {
    if (!deleteTarget?.id) return;
    start();

    try {
      await deleteProduct(deleteTarget.id);
      // close 要提早，確保無論成功或失敗都會關閉刪除確認視窗
      closeDeleteModal();
      await fetchProducts({ page: pageInfo.current_page || 1 });
      success('產品刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除產品失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  // lifecycle
  useEffect(() => {
    // useEffect getProducts 初始載入產品資料，先page=1，category先不指定
    const initProducts = async () => {
      try {
        await fetchProducts({ page: 1 });
      } catch (error) {
        const errorMessage = extractErrorMessage(error, null, '取得產品列表失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container py-1">
        <div className="d-flex justify-content-between">
          <h2>產品列表</h2>
        </div>
        {productCount === 0 && <p className="text-muted">目前沒有訂單資料。</p>}
        {productCount > 0 && (
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
                                <p>{getCategoryPreview(product.category) || '未設定分類'}</p>
                                <small>{getUnitLabel(product.unit) || '未設定單位'}</small>
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
                                      <span className="badge text-bg-secondary">
                                        +{extraTagCount}
                                      </span>
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
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        modalMode={modalMode}
        onModalChange={handleCustomFieldChange}
        onImageChange={handleImageChange}
        addImage={handleAddImage}
        deleteImage={handleDeleteImage}
        onConfirm={handleUpdateProduct}
        categoryBuilder={categoryBuilder}
        handleCategoryBuilderChange={handleCategoryBuilderChange}
        selectedTags={selectedTags}
        handleTagToggle={handleTagToggle}
        register={register}
        watch={watch}
        errors={errors}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        itemName={deleteTarget?.title}
        itemType="商品"
      />
    </>
  );
};

/**
 * =========================================
 * NEXT REFACTOR / UI PLAN
 * =========================================
 *
 * 1. Extract Admin ProductsTable component
 * 2. Optional ProductPreviewModal
 * 3. Optional optimistic update after CRUD
 * 4. Code clean: remove legacy tempProduct comments
 *
 */

export default ProductsPage;
