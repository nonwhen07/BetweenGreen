import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  CATEGORY_THEME_MAP,
  THEME_TYPE_RELATION_MAP,
  parseCategoryParts,
} from '@/constants/productConstants';

import productsBanner from '@/assets/images/brand/hero/hero-desk.png';

import { useProducts } from '@/hooks/product/useProducts';
import { useAddToCart } from '@/hooks/cart/useAddToCart';

import PageHero from '@/components/shared/PageHero';
import ProductsFilter from '@/components/front/product/ProductsFilter';
import ProductsGrid from '@/components/front/product/ProductsGrid';
import BrandPagination from '@/components/shared/BrandPagination';

const PRODUCTS_PER_PAGE = 12;
const SORT_TYPES = new Set(['latest', 'highPrice', 'lowPrice']);

const getCreatedTime = (product) => {
  const unixTime = Number(product?.create_at);

  if (Number.isFinite(unixTime)) return unixTime;

  const isoTime = Date.parse(product?.createdAt || '');

  return Number.isNaN(isoTime) ? 0 : isoTime;
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const themeParam = searchParams.get('theme');
  const typeParam = searchParams.get('type');
  const sortParam = searchParams.get('sort');
  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);

  const selectedTheme =
    themeParam && CATEGORY_THEME_MAP[themeParam] ? themeParam : 'AllProducts';
  const availableTypes = THEME_TYPE_RELATION_MAP[selectedTheme] || [];
  const selectedType = availableTypes.includes(typeParam) ? typeParam : '';
  const sortType = SORT_TYPES.has(sortParam) ? sortParam : 'latest';
  const requestedPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { products, status, error, fetchProducts, refreshProducts } = useProducts();
  const { loadingItems, handleAddCartItem } = useAddToCart();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateSearchParams = useCallback(
    (updates) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const sortedProducts = useMemo(() => {
    const enabledProducts = products.filter((product) => Number(product.is_enabled) === 1);

    const filteredProducts = enabledProducts.filter((product) => {
      const { themeKey, typeKey } = parseCategoryParts(product.category);
      const matchesTheme = selectedTheme === 'AllProducts' || themeKey === selectedTheme;
      const matchesType = !selectedType || typeKey === selectedType;

      return matchesTheme && matchesType;
    });

    return [...filteredProducts].sort((a, b) => {
      if (sortType === 'highPrice') return Number(b.price || 0) - Number(a.price || 0);
      if (sortType === 'lowPrice') return Number(a.price || 0) - Number(b.price || 0);

      return getCreatedTime(b) - getCreatedTime(a);
    });
  }, [products, selectedTheme, selectedType, sortType]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const pageStart = (page - 1) * PRODUCTS_PER_PAGE;
  const currentPageProducts = sortedProducts.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (status !== 'success' || requestedPage === page) return;

    updateSearchParams({ page: page === 1 ? null : page });
  }, [page, requestedPage, status, updateSearchParams]);

  const handleThemeChange = (theme) => {
    updateSearchParams({
      theme: theme === 'AllProducts' ? null : theme,
      type: null,
      page: null,
    });
  };

  const handleTypeChange = (type) => {
    updateSearchParams({ type, page: null });
  };

  const handleSortChange = (sort) => {
    updateSearchParams({ sort: sort === 'latest' ? null : sort, page: null });
  };

  const handlePageChange = (nextPage) => {
    updateSearchParams({ page: nextPage === 1 ? null : nextPage });
  };

  const isInitialLoading = status === 'idle' || (status === 'loading' && products.length === 0);
  const hasBlockingError = status === 'error' && products.length === 0;

  return (
    <div className="products-page">
      <PageHero
        eyebrow="Between Green Collection"
        title="探索植感生活選物"
        titleId="products-page-title"
        text="從書桌陪伴、陽台生活到空間造景，找到適合你日常節奏的植物與生活提案。"
        backgroundImage={productsBanner}
        tone=""
        align="left"
        size="md"
      />

      <section
        className="products-page__section ui-section ui-section--tight"
        aria-labelledby="products-filter-title"
      >
        <div className="ui-container">
          <div className="products-page__toolbar">
            <ProductsFilter
              selectedTheme={selectedTheme}
              selectedType={selectedType}
              sortType={sortType}
              onThemeChange={handleThemeChange}
              onTypeChange={handleTypeChange}
              onSortChange={handleSortChange}
            />
          </div>

          <div className="products-page__content">
            {isInitialLoading && (
              <div className="products-page__state" role="status">
                商品資料載入中…
              </div>
            )}

            {hasBlockingError && (
              <div className="products-page__state products-page__state--error" role="alert">
                <p>{error || '目前無法取得商品資料。'}</p>
                <button className="ui-btn ui-btn--outline-primary" type="button" onClick={refreshProducts}>
                  重新載入
                </button>
              </div>
            )}

            {!isInitialLoading && !hasBlockingError && (
              <>
                <ProductsGrid
                  products={currentPageProducts}
                  onAddCart={handleAddCartItem}
                  loadingItems={loadingItems}
                />
                <BrandPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="products-page__pagination"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
