// constants
import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_VIEWER_SCOPE_MAP,
  ARTICLE_TAG_MAP,
  ARTICLE_PRIORITY_MAP,
} from '@/constants/adminBuilderMaps';
// utils
import { getLabelByValue } from '@/utils/adminBuilderUtils';
// components
import Pagination from '@/components/Pagination';

const formatDate = (timestamp) => {
  if (!timestamp) return '未設定';
  return new Date(timestamp * 1000).toLocaleDateString();
};

const ArticlesTable = ({
  articles,
  pageInfo,
  handlePageChange,
  openArticleModal,
  openDeleteModal,
  articleCount,
}) => {
  // if (articleCount === 0) {
  //   return <p className="text-muted mt-4">目前沒有文章資料。</p>;
  // }

  return (
    <>
      <div className="admin-panel mt-4">
        <div className="admin-panel__header">
          <div>
            <h4 className="mb-1">文章快速總覽</h4>
            <p className="text-muted small mb-0">目前共 {articleCount} 筆文章資料</p>
          </div>

          <button className="btn btn-primary px-4" onClick={() => openArticleModal('create')}>
            ＋ 新增文章
          </button>
        </div>

        <div className="admin-panel__body">
          {articleCount === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-2">目前尚無文章資料</p>
              <small className="text-secondary">點擊右上角「新增文章」開始建立第一篇內容</small>
            </div>
          ) : (
            <table className="table admin-table align-middle mb-0">
              <thead>
                <tr>
                  <th width="32%">文章資訊</th>
                  <th width="18%">分類 / 對象</th>
                  <th width="20%">標籤 / 權重</th>
                  <th width="16%">上下架</th>
                  <th width="8%">狀態</th>
                  <th width="16%">操作</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((article) => {
                  const previewTags = Array.isArray(article.tag) ? article.tag.slice(0, 2) : [];
                  const extraTagCount = Array.isArray(article.tag) ? article.tag.length - 2 : 0;

                  return (
                    <tr key={article.id}>
                      <td>
                        <div className="admin-product-info">
                          <div className="admin-product-info__thumb">
                            {article.image ? (
                              <img src={article.image} alt={article.title} />
                            ) : (
                              <div className="text-muted small">No Image</div>
                            )}
                          </div>

                          <div className="admin-product-info__content">
                            <h6>{article.title}</h6>
                            <p>{article.description || '尚未填寫文章摘要'}</p>
                            <small className="text-muted">{article.author || '未填作者'}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="badge text-bg-light border">
                            {getLabelByValue(
                              ARTICLE_CATEGORY_MAP,
                              article.articleCategory,
                              '未分類',
                            )}
                          </span>
                          <span className="badge text-bg-secondary">
                            {getLabelByValue(
                              ARTICLE_VIEWER_SCOPE_MAP,
                              article.viewerScope,
                              '未設定對象',
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-tags__list mb-2">
                          {previewTags.length > 0 ? (
                            <>
                              {previewTags.map((tag) => (
                                <span key={tag} className="badge text-bg-light border me-1">
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
                        <div className="small">
                          <div>開始：{formatDate(article.publishStart)}</div>
                          <div className="text-muted mt-1">
                            結束：{formatDate(article.publishEnd)}
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
          )}
        </div>

        {articleCount > 0 && (
          <div className="admin-panel__footer d-flex justify-content-center">
            <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
          </div>
        )}
      </div>
    </>
  );
};

export default ArticlesTable;
