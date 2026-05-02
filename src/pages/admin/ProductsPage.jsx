import { useState, useEffect } from 'react';

// constants
import {
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  CATEGORY_SPECIES_MAP,
  PRODUCT_CONTENT_MAP,
  PRODUCT_UNIT_MAP,
} from '@/constants/productConstants';
// services
import {
  // getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
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
import PageLoader from '@/components/shared/PageLoader';

/**
 * =========================================
 * TODO: ProductsPage Refactor Plan
 * =========================================
 *
 * Current status:
 * - Page logic slightly large but still manageable
 * - Service layer already separated (productService)
 * - Modal components already separated
 *
 * Future improvements (when time allows):
 *
 * 1️⃣ Extract Products Logic Hook
 * --------------------------------
 * Move product data logic into:
 *
 * hooks/useProducts.js
 *
 * Responsible for:
 * - getProducts
 * - pagination handling
 * - loading state
 *
 *
 * 2️⃣ Extract Modal Logic
 * --------------------------------
 * Move modal related state:
 *
 * hooks/useProductModal.js
 *
 * Responsible for:
 * - tempProduct
 * - modalMode
 * - open/close modal
 * - normalizeProduct
 *
 *
 * 3️⃣ Move Validation to Utils
 * --------------------------------
 * Move validateProduct() to:
 *
 * utils/productValidator.js
 *
 *
 * 4️⃣ Table Component Separation
 * --------------------------------
 * Extract UI table to:
 *
 * components/admin/ProductTable.jsx
 *
 * Props:
 * - products
 * - onEdit
 * - onDelete
 *
 *
 * 5️⃣ Optional Improvements
 * --------------------------------
 * - Add ProductPreviewModal
 * - Add optimistic update
 * - Add toast success message
 *
 *
 * Note:
 * --------------------------------
 * Do NOT refactor now to avoid interrupting
 * current UI and layout development.
 *
 */
function ProductsPage() {
  // hooks
  const { success, showError } = useToast();

  const { products, pageInfo, isLoading, fetchProducts } = useProducts({ isAdmin: true });
  const {
    modalMode,
    tempProduct,
    // setTempProduct,
    modalError,
    setModalError,

    isModalOpen: isProductModalOpen,
    openProductModal,
    closeProductModal,

    handleModalInputChange,
    handleImageChange,
    handleAddImage,
    handleDeleteImage,

    categoryBuilder,
    selectedTags,
    handleCategoryBuilderChange,
    handleTagToggle,

    handleSubmitProduct,
  } = useProductModal();

  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();

  // 狀態管理 (State)
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const productCount = products?.length || 0;

  // 產品列表分頁
  const handlePageChange = (page = 1) => {
    fetchProducts({ page });
  };

  // // 傳值data時，需包裝成物件{data: {}}，並將tempProduct的origin_price、price轉換為數字，is_enabled轉換為數字0或1
  // const formatProductData = (product) => ({
  //   ...product,
  //   origin_price: Number(product.origin_price),
  //   price: Number(product.price),
  //   is_enabled: product.is_enabled ? 1 : 0,
  // });

  // //做前端驗證函式 - 確保必填欄位都有填寫，並回傳對應的錯誤訊息
  // const validateProduct = (product) => {
  //   if (!product.title?.trim()) return '請輸入產品標題';
  //   if (!product.category?.trim()) return '請輸入產品分類';
  //   if (!product.unit?.trim()) return '請輸入產品單位';
  //   if (product.origin_price === '' || Number(product.origin_price) <= 0) return '請輸入原價';
  //   if (product.price === '' || Number(product.price) <= 0) return '請輸入售價';

  //   return null;
  // };

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

  // 更新產品 - 包含前端驗證、錯誤訊息顯示
  // const handleUpdateProduct = async () => {
  //   setIsScreenLoading(true);
  //   setModalError('');

  //   const validationError = validateProduct(tempProduct);

  //   if (validationError) {
  //     setModalError(validationError);
  //     setIsScreenLoading(false);
  //     return;
  //   }

  //   try {
  //     if (modalMode === 'create') {
  //       await createProduct(formatProductData(tempProduct));
  //     } else {
  //       await updateProduct(tempProduct.id, formatProductData(tempProduct));
  //     }
  //     await fetchProducts({ page: pageInfo.current_page || 1 });

  //     closeProductModal();
  //     success(modalMode === 'create' ? '產品新增成功！' : '產品更新成功！'); // 成功訊息
  //   } catch (error) {
  //     const errorMessage = extractErrorMessage(error, null, '更新產品失敗，請稍後再試。');
  //     showError(errorMessage);
  //   } finally {
  //     setIsScreenLoading(false);
  //   }
  // };

  const handleUpdateProduct = async () => {
    setIsScreenLoading(true);

    await handleSubmitProduct(
      async () => {
        await fetchProducts({ page: pageInfo.current_page || 1 });
        success(modalMode === 'create' ? '產品新增成功！' : '產品更新成功！');
      },
      (errorMessage) => {
        showError(errorMessage);
      },
    );

    setIsScreenLoading(false);
  };

  // 刪除產品
  const handleDeleteProduct = async () => {
    if (!deleteTarget?.id) return;
    setIsScreenLoading(true);

    try {
      await deleteProduct(deleteTarget.id);
      closeDeleteModal(); // close 要提早，確保無論成功或失敗都會關閉刪除確認視窗
      await fetchProducts({ page: pageInfo.current_page || 1 });
      success('產品刪除成功！'); // 成功訊息
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除產品失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // useEffect getProducts 初始載入產品資料，先page=1，category先不指定
  useEffect(() => {
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
                      // const contentTags = product.content
                      //   ? product.content.split('|').slice(0, 3)
                      //   : [];
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
                              {/* <div className="admin-tags__list">
                                {contentTags.length > 0 ? (
                                  contentTags.map((tag, i) => (
                                    <span key={i} className="badge text-bg-light border">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-muted small">尚未設定標籤</span>
                                )}
                              </div> */}
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
      {/* ScreenLoading */}
      <PageLoader show={isLoading || isScreenLoading} zIndex={2000} />

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        modalMode={modalMode}
        tempProduct={tempProduct}
        modalError={modalError}
        onModalChange={handleModalInputChange}
        onImageChange={handleImageChange}
        addImage={handleAddImage}
        deleteImage={handleDeleteImage}
        onConfirm={handleUpdateProduct}
        categoryBuilder={categoryBuilder}
        handleCategoryBuilderChange={handleCategoryBuilderChange}
        selectedTags={selectedTags}
        handleTagToggle={handleTagToggle}
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
}

export default ProductsPage;
