// AdminFilter.jsx

import PropTypes from 'prop-types';

// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

const AdminFilter = ({ keyword, setKeyword, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* keyword */}
          <div className="col-md-8">
            <label htmlFor="admin-product-search" className="form-label fw-semibold">
              商品搜尋
            </label>

            <input
              id="admin-product-search"
              type="text"
              className="form-control"
              placeholder="輸入商品名稱..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* category */}
          <div className="col-md-4">
            <label htmlFor="admin-product-category" className="form-label fw-semibold">
              Category
            </label>

            <select
              id="admin-product-category"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

AdminFilter.propTypes = {
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
};

export default AdminFilter;
