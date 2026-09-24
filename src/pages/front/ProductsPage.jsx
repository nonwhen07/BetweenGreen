import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

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

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const isInitialLoading = status === 'idle' || (status === 'loading' && products.length === 0);
  const hasBlockingError = status === 'error' && products.length === 0;
  const hasActiveFilters =
    selectedTheme !== 'AllProducts' || Boolean(selectedType) || sortType !== 'latest';
  const activeTheme = CATEGORY_THEME_MAP[selectedTheme];
  const resultStart = sortedProducts.length === 0 ? 0 : pageStart + 1;
  const resultEnd = Math.min(pageStart + PRODUCTS_PER_PAGE, sortedProducts.length);

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
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          <div className="products-page__content">
            {!hasBlockingError && (
              <div className="products-page__results-header">
                <div>
                  <p className="products-page__results-eyebrow">Curated Collection</p>
                  <h2 className="products-page__results-title">
                    {activeTheme?.label || '全部商品'}
                  </h2>
                  <p className="products-page__results-intro">
                    {activeTheme?.intro || '探索 Between Green 的植感生活選物。'}
                  </p>
                </div>

                {!isInitialLoading && (
                  <p className="products-page__results-count" aria-live="polite">
                    共 {sortedProducts.length} 件
                    {sortedProducts.length > 0 && (
                      <span>
                        顯示 {resultStart}–{resultEnd}
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {hasBlockingError && (
              <div className="products-page__state products-page__state--error" role="alert">
                <span className="products-page__state-icon" aria-hidden="true">
                  <RefreshCw size={24} strokeWidth={1.6} />
                </span>
                <div>
                  <h2>商品資料暫時無法載入</h2>
                  <p>{error || '請稍後再試，或重新載入商品資料。'}</p>
                </div>
                <button
                  className="ui-btn ui-btn--outline-primary"
                  type="button"
                  onClick={refreshProducts}
                >
                  再試一次
                </button>
              </div>
            )}

            {!hasBlockingError && (
              <>
                <ProductsGrid
                  products={currentPageProducts}
                  onAddCart={handleAddCartItem}
                  loadingItems={loadingItems}
                  isLoading={isInitialLoading}
                  onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
                />
                {!isInitialLoading && (
                  <BrandPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="products-page__pagination"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
