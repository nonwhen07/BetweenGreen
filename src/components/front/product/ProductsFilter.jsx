// ProductsFilter.jsx

import { CATEGORY_THEME_MAP, PRIMARY_CONTENT_TAGS } from '@/constants/productConstants';

const ProductsFilter = () => {
  return (
    <div className="products-filter">
      {/* theme */}
      <div className="products-filter__group">
        <div className="products-filter__header">
          <h2 className="products-filter__title">主題探索</h2>
        </div>

        <div className="products-filter__chips">
          {Object.values(CATEGORY_THEME_MAP).map((theme) => (
            <button key={theme.code} type="button" className="products-filter__chip">
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="products-filter__group">
        <div className="products-filter__header">
          <h2 className="products-filter__title">風格篩選</h2>
        </div>

        <div className="products-filter__chips">
          {PRIMARY_CONTENT_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className="products-filter__chip products-filter__chip--soft"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* sort */}
      <div className="products-filter__sort">
        <select className="products-filter__select">
          <option value="latest">最新上架</option>
          <option value="highPrice">價格高到低</option>
          <option value="lowPrice">價格低到高</option>
          <option value="popular">人氣推薦</option>
        </select>
      </div>
    </div>
  );
};

export default ProductsFilter;
