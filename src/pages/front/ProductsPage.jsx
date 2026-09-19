import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

// assets
import productsBanner from '@/assets/images/brand/hero/hero-desk.png';

// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useProducts } from '@/hooks/product/useProducts';
import { useAddToCart } from '@/hooks/cart/useAddToCart';
import { usePagination } from '@/hooks/usePagination';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import PageHero from '@/components/shared/PageHero';
import ProductsFilter from '@/components/front/product/ProductsFilter';
import ProductsGrid from '@/components/front/product/ProductsGrid';
import BrandPagination from '@/components/shared/BrandPagination';

const ProductsPage = () => {
  const PRODUCTS_PER_PAGE = 12;

  const [searchParams, setSearchParams] = useSearchParams();
  const theme = searchParams.get('theme');
  const initialTheme = theme && CATEGORY_THEME_MAP[theme] ? theme : 'AllProducts';
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);

  const { showError } = useToast();
  const { start, stop } = useLoading();

  const { products, fetchProducts } = useProducts({ isAdmin: false });

  const { loadingItems, handleAddCartItem } = useAddToCart();

  const [selectedType, setSelectedType] = useState('');

  // sort
  const [sortType, setSortType] = useState('latest');

  const themeFilteredProducts =
    selectedTheme === 'AllProducts'
      ? products
      : products.filter((product) => product.category?.startsWith(selectedTheme));

  const filteredProducts = !selectedType
    ? themeFilteredProducts
    : themeFilteredProducts.filter((product) => {
        const [, type] = product.category.split('-');

        return type === selectedType;
      });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case 'highPrice':
        return b.price - a.price;

      case 'lowPrice':
        return a.price - b.price;

      case 'latest':
      default:
        return b.create_at - a.create_at;
    }
  });

  const {
    page,
    totalPages,
    currentItems: currentPageProducts,
    goToPage,
    resetPage,
  } = usePagination({
    items: sortedProducts,
    perPage: PRODUCTS_PER_PAGE,
  });

  // 取得商品列表
  const initProducts = async () => {
    start();

    try {
      await fetchProducts();
    } catch (error) {
      const errorMessage = extractErrorMessage(error, '', '取得產品列表失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  useEffect(() => {
    const nextTheme = theme && CATEGORY_THEME_MAP[theme] ? theme : 'AllProducts';

    setSelectedTheme(nextTheme);
  }, [theme]);

  useEffect(() => {
    initProducts();
    // 由於前端 filter，所以theme 改變 不需要重新 fetchProducts()

    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <main className="products-page">
      <PageHero
        eyebrow="Between Green Collection"
        title="探索植感生活選物"
        text="從書桌陪伴、陽台生活到空間造景，找到適合你日常節奏的植物與生活提案。"
        backgroundImage={productsBanner}
        tone=""
        align="left"
        size="md"
      />

      <section className="products-page__section ui-section ui-section--tight">
        <div className="ui-container">
          <div className="products-page__toolbar">
            <ProductsFilter
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              setSearchParams={setSearchParams}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              sortType={sortType}
              setSortType={setSortType}
              resetPage={resetPage}
            />
          </div>

          <div className="products-page__content">
            <ProductsGrid
              products={currentPageProducts}
              onAddCart={handleAddCartItem}
              loadingItems={loadingItems}
            />
            <BrandPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
              className="products-page__pagination"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;
