import { SearchX } from 'lucide-react';

import ProductCard from '@/components/shared/ProductCard';

const SKELETON_COUNT = 8;

const ProductsGrid = ({
  products = [],
  onAddCart,
  loadingItems = {},
  isLoading = false,
  onResetFilters,
}) => {
  const isEmpty = Array.isArray(products) && products.length === 0;

  if (isLoading) {
    return (
      <div className="products-grid" aria-label="商品資料載入中" aria-busy="true">
        <div className="products-grid__list">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <div className="product-card-skeleton" key={index} aria-hidden="true">
              <div className="product-card-skeleton__media" />
              <div className="product-card-skeleton__body">
                <span className="product-card-skeleton__line product-card-skeleton__line--eyebrow" />
                <span className="product-card-skeleton__line product-card-skeleton__line--title" />
                <span className="product-card-skeleton__line product-card-skeleton__line--text" />
                <span className="product-card-skeleton__line product-card-skeleton__line--price" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only" role="status">
          商品資料載入中
        </span>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="products-grid">
        <div className="products-grid__empty">
          <span className="products-grid__empty-icon" aria-hidden="true">
            <SearchX size={24} strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="products-grid__empty-title">還沒有符合條件的商品</h2>
            <p className="products-grid__empty-text">換一個主題或類型，繼續探索適合你的植感選物。</p>
          </div>
          {onResetFilters && (
            <button
              className="ui-btn ui-btn--outline-primary"
              type="button"
              onClick={onResetFilters}
            >
              查看全部商品
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="products-grid">
      <div className="products-grid__list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddCart={onAddCart}
            loading={loadingItems[product.id]}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
