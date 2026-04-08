import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

// URL 驅動 pagination 中 Link 的實現方式，會在 URL 中加入 `?page=2` 這樣的查詢參數，並透過 React Router 的 `<Link>` 元件來實現分頁按鈕的跳轉。
// 但在這裡我們的分頁按鈕並不需要切換路由，而是直接呼叫 `handlePageChange` 函式來更新頁面內容。
// 因此 State 驅動 pagination，我們改用 `<button>` 元素來實現分頁按鈕，並在 `onClick` 事件中呼叫 `handlePageChange` 函式來更新頁面內容。

// 最簡單判斷心法 會不會改 URL ? Link ： button，主要是看使用者需不需要分享分頁連結，
// 或是需要瀏覽器的前進後退功能來切換分頁，如果需要就用 Link，不需要就用 button。
// 前台大多情況可能會需要分享分頁連結，所以會使用 Link，後台管理系統通常不需要分享分頁連結，所以使用 button 就好。

// 這裡我們新增一個 `useRouter` 的 prop，來判斷是否使用 URL 驅動 pagination，如果 `useRouter` 為 `true` 就使用 `<Link>` 元件來實現分頁按鈕，否則就使用 `<button>` 元素來實現分頁按鈕。

// 這樣我們就可以在前台使用 URL 驅動 pagination，在後台使用 State 驅動 pagination，
// 達到同一個 Pagination 元件在不同情境下的彈性使用，使用時：
// 前台：<Pagination
//   pageInfo={pageInfo}
//   useRouter
// />
// 後台：<Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />;

const Pagination = ({ pageInfo, handlePageChange, useRouter = false }) => {
  const renderPageItem = (page) => {
    if (useRouter) {
      return (
        <Link className="page-link" to={`?page=${page}`}>
          {page}
        </Link>
      );
    }

    return (
      <button type="button" className="page-link" onClick={() => handlePageChange(page)}>
        {page}
      </button>
    );
  };

  return (
    <ul className="pagination">
      {Array.from({ length: pageInfo.total_pages }).map((_, i) => (
        <li key={i} className="page-item">
          {renderPageItem(i + 1)}
        </li>
      ))}
    </ul>
  );
};

// 下面這段是PropTypes.shape()的說明：pageInfo 必須是一個 object且裡面要符合指定結構;
// 例如：pageInfo = {
//   total_pages: 10,
//   has_pre: true,
//   has_next: true,
//   current_page: 2
// }
// shape 的一個小缺點：shape 只檢查指定欄位存在與否，但不會檢查是否有額外的欄位存在，
// 例如：如果 pageInfo 中除了 total_pages、has_pre、has_next、current_page 之外，
// 還有其他欄位，PropTypes.shape() 不會報錯，因為它只關心指定的欄位是否存在，
// 而不會檢查是否有額外的欄位存在。
// 例如：pageInfo = {
//   total_pages: 10,
//   has_pre: true,
//   has_next: true,
//   current_page: 2,
//   hello: "world" // 不會報錯
// }
// React 會覺得：OK 沒問題，但有些專案希望：只能有指定欄位，不能有額外欄位，這時候就可以使用 PropTypes.exact() 來取代 PropTypes.shape()，
// 這樣就會檢查指定欄位存在與否，還會檢查是否有額外的欄位存在，如果有額外的欄位存在就會報錯。
// 例如：Pagination.propTypes = {
//   handlePageChange: PropTypes.func.isRequired,
//   pageInfo: PropTypes.exact({
//     total_pages: PropTypes.number.isRequired,
//     has_pre: PropTypes.bool.isRequired,
//     has_next: PropTypes.bool.isRequired,
//     current_page: PropTypes.number.isRequired,
//   }).isRequired,
// };

// === 新增 `propTypes` 驗證 ===
Pagination.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  useRouter: PropTypes.bool,
  // isLoading: PropTypes.bool, // 新增 `isLoading` prop 的驗證
  pageInfo: PropTypes.shape({
    total_pages: PropTypes.number.isRequired,
    has_pre: PropTypes.bool.isRequired,
    has_next: PropTypes.bool.isRequired,
    current_page: PropTypes.number.isRequired,
    // category: PropTypes.string,
  }).isRequired, // 確保 `pageInfo` 是物件，且內部屬性為必填
};

//額外筆記：
// 1. PropTypes.shape() 只檢查指定欄位存在與否，但不會檢查是否有額外的欄位存在
// 2. PropTypes.exact() 會檢查指定欄位存在與否，還會檢查是否有額外的欄位存在，如果有額外的欄位存在就會報錯
// 3. PropTypes vs TypeScript 差別？
// PropTypes 是在運行時檢查 props 的類型，TypeScript 是在編譯時檢查 props 的類型，
// PropTypes 是一個獨立的庫，需要額外安裝，TypeScript 是一個語言特性，不需要額外安裝，
// PropTypes 只能檢查 props 的類型，TypeScript 可以檢查 props 的類型，也可以檢查 state 的類型，
// PropTypes 只能檢查 props 的類型，TypeScript 可以檢查 props 的類型，也可以檢查函式的參數和返回值的類型。

export default Pagination;
