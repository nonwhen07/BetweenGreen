import { useState, useEffect, useMemo } from 'react';

// services
import { deleteProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';

import { useProducts } from '@/hooks/product/useProducts';
import { useProductImport } from '@/hooks/product/useProductImport';
import { useProductModal } from '@/hooks/useProductModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import ProductsTable from '@/components/admin/product/ProductsTable';
import ProductModal from '@/components/admin/product/ProductModal';
import ProductImportModal from '@/components/admin/product/ProductImportModal';
import DeleteModal from '@/components/admin/DeleteModal';
import BrandPagination from '@/components/shared/BrandPagination';
import AdminFilter from '@/components/admin/AdminFilter';
// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

const ProductsPage = () => {
  // hooks init
  const { success, showError } = useToast();
  const { start, stop } = useLoading();
  const { products, fetchProducts } = useProducts({
    isAdmin: true,
  });
  const {
    isImportModalOpen,
    jsonText: importJsonText,
    analysis: importAnalysis,
    parseError: importParseError,
    isConfirmed: isImportConfirmed,
    isUpdating: isImportUpdating,
    progress: importProgress,
    results: importResults,
    openImportModal,
    closeImportModal,
    handleJsonTextChange,
    analyzeImport,
    setIsConfirmed: setIsImportConfirmed,
    executeUpdate: executeImportUpdate,
  } = useProductImport({
    products,
    onUpdated: fetchProducts,
  });
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

  // AdminFilter
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchKeyword =
        !keyword || product.title.toLowerCase().includes(keyword.toLowerCase());

      const matchCategory =
        !selectedCategory ||
        product.category?.split('-')[0] === selectedCategory;

      return matchKeyword && matchCategory;
    });
  }, [products, keyword, selectedCategory]);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const handleOpenProductModal = (mode, product) => {
    setSelectedProductId(product?.id || null);

    openProductModal(mode, product);
  };
  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();

  const handleUpdateProduct = handleSubmit((formData) => {
    // submit 真正發生在點按鈕那瞬間 start() 會先觸發，然後才是 handleSubmitProduct 的邏輯
    start();

    return handleSubmitProduct(
      formData,
      async () => {
        // await fetchProducts({ page: pageInfo.current_page || 1 });
        await fetchProducts();
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
      // await fetchProducts({ page: pageInfo.current_page || 1 });
      await fetchProducts();
      success('產品刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        '刪除產品失敗，請稍後再試。',
      );
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  const {
    page,
    totalPages,
    currentItems: currentPageProducts,
    goToPage,
    resetPage,
  } = usePagination({
    items: filteredProducts,
    perPage: 10,
  });

  // lifecycle
  useEffect(() => {
    // useEffect getProducts 初始載入產品資料，先page=1，category先不指定
    const initProducts = async () => {
      try {
        // await fetchProducts({ page: 1 });
        await fetchProducts();
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          '取得產品列表失敗，請稍後再試。',
        );
        showError(errorMessage);
      }
    };

    initProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 監控 keyword/category 變化，重置分頁到第一頁
  useEffect(() => {
    resetPage();
  }, [keyword, selectedCategory]);

  return (
    <>
      <div className="container py-1">
        <h2 className="mb-1">商品列表</h2>

        <div className="admin-panel m-2">
          <AdminFilter
            keyword={keyword}
            setKeyword={setKeyword}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <ProductsTable
            products={currentPageProducts}
            openProductModal={handleOpenProductModal}
            openDeleteModal={openDeleteModal}
            productTotalCount={filteredProducts.length}
            selectedProductId={selectedProductId}
            openProductImportModal={openImportModal}
          />
          <div className="m-4">
            <BrandPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
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

      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        jsonText={importJsonText}
        onJsonTextChange={handleJsonTextChange}
        onAnalyze={analyzeImport}
        analysis={importAnalysis}
        parseError={importParseError}
        isConfirmed={isImportConfirmed}
        onConfirmChange={setIsImportConfirmed}
        onExecuteUpdate={executeImportUpdate}
        isUpdating={isImportUpdating}
        progress={importProgress}
        results={importResults}
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

// ======================================================
// TODO：Product Display Tags（商業展示標籤）
// ======================================================
//
// 目前 category / content 已能描述：
// 1. 商品是什麼（category）
// 2. 商品有哪些風格與特性（content）
//
// 但首頁 ProductSection、SeasonalCollection、HeroBanner
// 未來需要的是：
//
// 「現在想怎麼展示 / 推薦 / 行銷這個商品」
//
// ------------------------------------------------------
// displayTags 與 category / content 的差異
// ------------------------------------------------------
//
// category：商品本體分類（固定）
// 例如：
// DeskLiving-Plant-Succulent
//
// content：商品特性（半固定）
// 例如：
// Minimal|Nordic|EasyCare
//
// displayTags：商業展示狀態（可變動）
// 例如：
// TopSeller|Featured|SeasonalHot
//
// ------------------------------------------------------
// 未來預計新增：
// ------------------------------------------------------
//
// export const PRODUCT_DISPLAY_TAGS_MAP = {
//   TopSeller: {
//     label: '熱銷商品',
//   },
//
//   Featured: {
//     label: '精選推薦',
//   },
//
//   SeasonalHot: {
//     label: '當季熱門',
//   },
//
//   EditorPick: {
//     label: '品牌選品',
//   },
//
//   Limited: {
//     label: '限定推薦',
//   },
// };
//
// ------------------------------------------------------
// DEFAULT_PRODUCT 預計新增：
// ------------------------------------------------------
//
// displayTags: '',
//
// 格式：
// 'TopSeller|Featured'
//
// ------------------------------------------------------
// 實作方向
// ------------------------------------------------------
//
// 實作方式可參考：
// 1. PRODUCT_PERSONALITY_MAP
// 2. parsePersonalityTags()
//
// displayTags 結構會比較接近 content，
// 而不是 category 的 Theme-Type-Species 階層式分類。
//
// ------------------------------------------------------
// 未來用途
// ------------------------------------------------------
//
// ProductSection：
// → TopSeller / Featured
//
// SeasonalCollection：
// → SeasonalHot / Limited
//
// HeroBanner：
// → HeroFeatured（可選）
//
// Dashboard：
// → 統計各 displayTags 商品數量
//
// ------------------------------------------------------
// 注意事項
// ------------------------------------------------------
//
// displayTags 是「商業展示用途」，
// 不建議混入 category。
//
// category 是商品永久分類，
// displayTags 是現在想怎麼賣它。
//
// displayTags 建議控制在 0~3 個，
// 避免首頁 badge 過多造成 UI 混亂。
//
// 現階段先完成 LifestyleSection 與 Theme flow，
// ProductSection 再回頭補 displayTags 架構。
// ======================================================

export default ProductsPage;
