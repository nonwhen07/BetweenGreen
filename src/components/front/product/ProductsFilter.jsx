import {
  THEME_TYPE_RELATION_MAP,
  CATEGORY_TYPE_MAP,
  CATEGORY_THEME_MAP,
} from '@/constants/productConstants';

import clsx from 'clsx';

const ProductsFilter = ({
  selectedTheme,
  setSearchParams,
  selectedType,
  setSelectedType,
  sortType,
  setSortType,
  resetPage,
}) => {
  return (
    <div className="products-filter">
      {/* theme */}
      <div className="products-filter__group">
        <div className="products-filter__header">
          <h2 className="products-filter__title">主題探索</h2>
        </div>

        <div className="products-filter__chips">
          {Object.values(CATEGORY_THEME_MAP).map((theme) => (
            <button
              key={theme.code}
              type="button"
              className={clsx('products-filter__chip', selectedTheme === theme.code && 'is-active')}
              onClick={() => {
                if (theme.code === 'AllProducts') {
                  setSearchParams({});
                } else {
                  setSearchParams({
                    theme: theme.code,
                  });
                }
                setSelectedType('');
                resetPage();
              }}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
      {/* type */}
      {selectedTheme !== 'AllProducts' && (
        <div className="products-filter__group">
          <div className="products-filter__header">
            <h2 className="products-filter__title">類型分類</h2>
          </div>

          <div className="products-filter__chips">
            {THEME_TYPE_RELATION_MAP[selectedTheme]?.map((typeKey) => {
              const type = CATEGORY_TYPE_MAP[typeKey];

              return (
                <button
                  key={type.code}
                  type="button"
                  className={clsx(
                    'products-filter__chip',
                    selectedType === type.code && 'is-active',
                  )}
                  onClick={() => {
                    setSelectedType(type.code);
                    resetPage();
                  }}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* sort */}
      <div className="products-filter__sort">
        <select
          className="products-filter__select"
          aria-label="商品排序方式"
          value={sortType}
          onChange={(e) => {
            setSortType(e.target.value);
            resetPage();
          }}
        >
          <option value="latest">最新上架</option>
          <option value="highPrice">價格高到低</option>
          <option value="lowPrice">價格低到高</option>
        </select>
      </div>
    </div>
  );
};

export default ProductsFilter;
