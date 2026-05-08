import { useEffect } from 'react';

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
import ProductsTable from '@/components/admin/product/ProductsTable';
import ProductModal from '@/components/admin/product/ProductModal';
import DeleteModal from '@/components/admin/DeleteModal';

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
        <div className="admin-panel mt-4">
          <ProductsTable
            products={products}
            pageInfo={pageInfo}
            handlePageChange={handlePageChange}
            openProductModal={openProductModal}
            openDeleteModal={openDeleteModal}
            productCount={productCount}
          />
        </div>
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
