import Pagination from '@/components/Pagination';

const ArticlesTable = ({
  articles,
  pageInfo,
  handlePageChange,
  openArticleModal,
  openDeleteModal,
  articleCount,
}) => {
  if (articleCount === 0) {
    return <p className="text-muted mt-4">目前沒有文章資料。</p>;
  }

  return (
    <>
      <div className="admin-panel mt-4">
        <div className="admin-panel__header">
          <div>
            <h4 className="mb-1">文章快速總覽</h4>
            <p className="text-muted small mb-0">目前共 {articleCount} 筆文章資料</p>
          </div>

          <button
            className="btn btn-primary px-4"
            onClick={() => {
              openArticleModal('create');
            }}
          >
            ＋ 新增文章
          </button>
        </div>

        <div className="admin-panel__body">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th width="34%">文章資訊</th>
                <th width="18%">作者 / 日期</th>
                <th width="20%">文章標籤</th>
                <th width="10%">狀態</th>
                <th width="18%">操作</th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => {
                const previewTags = Array.isArray(article.tag) ? article.tag.slice(0, 2) : [];
                const extraTagCount = Array.isArray(article.tag) ? article.tag.length - 2 : 0;

                return (
                  <tr key={article.id}>
                    {/* 文章資訊 */}
                    <td>
                      <div className="admin-product-info">
                        <div className="admin-product-info__thumb">
                          <img src={article.image} alt={article.title} />
                        </div>

                        <div className="admin-product-info__content">
                          <h6>{article.title}</h6>
                          <p>{article.description || '尚未填寫文章摘要'}</p>
                        </div>
                      </div>
                    </td>

                    {/* 作者日期 */}
                    <td>
                      <div className="small">
                        <div>{article.author || '未填作者'}</div>
                        <div className="text-muted mt-1">
                          {article.create_at
                            ? new Date(article.create_at * 1000).toLocaleDateString()
                            : '未設定日期'}
                        </div>
                      </div>
                    </td>

                    {/* 標籤 */}
                    <td>
                      <div className="admin-tags__list">
                        {previewTags.length > 0 ? (
                          <>
                            {previewTags.map((tag, i) => (
                              <span key={i} className="badge text-bg-light border me-1">
                                {tag}
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
                    </td>

                    {/* 狀態 */}
                    <td>
                      {article.isPublic ? (
                        <span className="badge text-bg-success">公開</span>
                      ) : (
                        <span className="badge text-bg-secondary">草稿</span>
                      )}
                    </td>

                    {/* 操作 */}
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

        <div className="admin-panel__footer d-flex justify-content-center">
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default ArticlesTable;
