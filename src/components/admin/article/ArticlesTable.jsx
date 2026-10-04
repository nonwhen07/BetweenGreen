import PropTypes from 'prop-types';

// constants
import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_PRIORITY_MAP,
  ARTICLE_TAG_MAP,
  ARTICLE_VIEWER_SCOPE_MAP,
} from '@/constants/articleConstants';
// utils
import { getLabelByValue } from '@/utils/adminBuilderUtils';
import { formatArticleDate } from '@/utils/articleFormatter';
const ArticlesTable = ({
  articles,
  openArticleModal,
  openDeleteModal,
  articleCount,
  hasArticles,
}) => {
  if (articleCount === 0) {
    return (
      <div className="admin-empty-state admin-empty-state--panel">
        <p className="text-muted mb-2">
          {hasArticles ? '目前沒有符合篩選條件的文章' : '目前尚無文章資料'}
        </p>
        <small className="text-secondary">
          {hasArticles
            ? '請切換健康狀態或問題類型後再查看'
            : '可使用「JSON 批次新增」匯入首批 Garden Tips'}
        </small>
      </div>
    );
  }

  return (
    <div
      className="admin-table-wrapper admin-articles-table-wrapper"
      role="region"
      aria-label="文章資料表，可水平捲動"
      tabIndex={0}
    >
      <table className="table admin-table admin-articles-table align-middle mb-0">
        <caption className="visually-hidden">
          文章資訊、分類與對象、標籤與權重、發布日期、公開狀態與管理操作
        </caption>
        <thead>
          <tr>
            <th className="admin-articles-table__info">文章資訊</th>
            <th className="admin-articles-table__classification">分類 / 對象</th>
            <th className="admin-articles-table__tags">標籤 / 權重</th>
            <th className="admin-articles-table__schedule">上下架</th>
            <th className="admin-articles-table__status">狀態</th>
            <th className="admin-articles-table__actions">操作</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => {
            const previewTags = Array.isArray(article.tag) ? article.tag.slice(0, 2) : [];
            const extraTagCount = Array.isArray(article.tag) ? article.tag.length - 2 : 0;

            return (
              <tr key={article.id}>
                <td>
                  <div className="admin-resource-info">
                    <div className="admin-resource-info__thumb">
                      {article.image ? (
                        <img src={article.image} alt={article.title} />
                      ) : (
                        <div className="text-muted small">No Image</div>
                      )}
                    </div>

                    <div className="admin-resource-info__content">
                      <h6 title={article.title}>{article.title}</h6>
                      <p title={article.bannerText || '尚未填寫文章摘要'}>
                        {article.bannerText || '尚未填寫文章摘要'}
                      </p>
                      <small className="text-muted">{article.author || '未填作者'}</small>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="admin-articles-table__classification-list">
                    <span className="badge text-bg-light border">
                      {getLabelByValue(ARTICLE_CATEGORY_MAP, article.articleCategory, '未分類')}
                    </span>
                    <span className="badge text-bg-secondary">
                      {getLabelByValue(ARTICLE_VIEWER_SCOPE_MAP, article.viewerScope, '未設定對象')}
                    </span>
                    {(article.isFeatured === true || Number(article.isFeatured) === 1) && (
                      <span className="badge text-bg-warning">Garden Tips 入選</span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="admin-tags__list admin-articles-table__tag-list mb-2">
                    {previewTags.length > 0 ? (
                      <>
                        {previewTags.map((tag) => (
                          <span key={tag} className="badge text-bg-light border">
                            {getLabelByValue(ARTICLE_TAG_MAP, tag, tag)}
                          </span>
                        ))}
                        {extraTagCount > 0 && (
                          <span className="badge text-bg-secondary">+{extraTagCount}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted small">尚未設定標籤</span>
                    )}
                  </div>

                  <span className="badge text-bg-info">
                    {getLabelByValue(ARTICLE_PRIORITY_MAP, article.priorityLevel, '一般')}
                  </span>
                </td>

                <td>
                  <div className="admin-articles-table__schedule-text small">
                    <div>開始：{formatArticleDate(article.publishStart)}</div>
                    <div className="text-muted mt-1">
                      結束：{formatArticleDate(article.publishEnd)}
                    </div>
                  </div>
                </td>

                <td>
                  {article.isPublic ? (
                    <span className="badge text-bg-success">公開</span>
                  ) : (
                    <span className="badge text-bg-secondary">草稿</span>
                  )}
                </td>

                <td>
                  <div className="btn-group admin-table__actions">
                    <button
                      type="button"
                      onClick={() => openArticleModal('edit', article)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      編輯
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(article)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ArticlesTable.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  openArticleModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  articleCount: PropTypes.number.isRequired,
  hasArticles: PropTypes.bool.isRequired,
};

export default ArticlesTable;
