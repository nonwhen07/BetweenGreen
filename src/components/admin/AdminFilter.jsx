// AdminFilter.jsx

import PropTypes from 'prop-types';

// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

const AdminFilter = ({ keyword, setKeyword, selectedCategory, setSelectedCategory }) => {
  return (
    <section className="admin-product-filter" aria-label="商品搜尋與主題篩選">
      <div className="admin-product-filter__field admin-product-filter__field--keyword">
        <label htmlFor="admin-product-search" className="form-label fw-semibold">
          商品搜尋
        </label>

        <input
          id="admin-product-search"
          type="search"
          className="form-control"
          placeholder="輸入中英文商品名稱..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="admin-product-filter__field">
        <label htmlFor="admin-product-category" className="form-label fw-semibold">
          商品主題
        </label>

        <select
          id="admin-product-category"
          className="form-select"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">全部主題</option>

          {Object.values(CATEGORY_THEME_MAP)
            .filter((item) => item.code !== 'AllProducts')
            .map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
        </select>
      </div>
    </section>
  );
};

AdminFilter.propTypes = {
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
};

export default AdminFilter;
