// import { useState } from 'react';
// import PropTypes from 'prop-types';

// constants
import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_DISPLAY_ZONE_MAP,
  ARTICLE_PRIORITY_MAP,
  ARTICLE_TAG_MAP,
  ARTICLE_VIEWER_SCOPE_MAP,
} from '@/constants/articleConstants';

// hooks
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

const ArticleModal = ({
  isOpen,
  onClose,
  modalMode,
  onConfirm,

  selectedTags,
  handleTagToggle,

  register,
  watch,
  errors,
}) => {
  const watchTitle = watch('title');
  const watchImage = watch('image');
  // const watchContent = watch('content');
  const tagPreviewText = selectedTags.join(' | ');

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      id="articleModal"
      className="modal show d-block admin-modal"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <h5 id="article-modal-title" className="modal-title text-light fs-4">
              {modalMode === 'create' ? '新增文章' : `編輯 - ${watchTitle || ''}`}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="關閉"
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* 第一列：標題 / 作者 */}
            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label htmlFor="title" className="form-label">
                  文章標題
                </label>
                <input
                  {...register('title', {
                    required: '請輸入文章標題',
                    maxLength: { value: 60, message: '文章標題不得超過 60 字' },
                  })}
                  id="title"
                  type="text"
                  className="form-control"
                />
                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </div>

              <div className="col-md-4">
                <label htmlFor="author" className="form-label">
                  作者
                </label>
                <input
                  {...register('author', { required: '請輸入作者名稱' })}
                  id="author"
                  type="text"
                  className="form-control"
                />
                {errors.author && <small className="text-danger">{errors.author.message}</small>}
              </div>
            </div>

            {/* 第二列：分類 / 對象 / 權重 / 建立日 */}
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label htmlFor="articleCategory" className="form-label">
                  文章分類
                </label>
                <select
                  {...register('articleCategory')}
                  id="articleCategory"
                  className="form-select"
                >
                  {Object.values(ARTICLE_CATEGORY_MAP).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label htmlFor="viewerScope" className="form-label">
                  顯示對象
                </label>
                <select {...register('viewerScope')} id="viewerScope" className="form-select">
                  {Object.values(ARTICLE_VIEWER_SCOPE_MAP).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label htmlFor="priorityLevel" className="form-label">
                  排序權重
                </label>
                <select {...register('priorityLevel')} id="priorityLevel" className="form-select">
                  {Object.values(ARTICLE_PRIORITY_MAP).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label htmlFor="create_at" className="form-label">
                  建立日期
                </label>
                <input
                  {...register('create_at', { required: '請設定建立日期' })}
                  id="create_at"
                  type="date"
                  className="form-control"
                />
              </div>
            </div>

            {/* 第三列：投放區域 / 短公告文 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="displayZone" className="form-label">
                  顯示區域
                </label>
                <select {...register('displayZone')} id="displayZone" className="form-select">
                  {Object.values(ARTICLE_DISPLAY_ZONE_MAP).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-8">
                <label htmlFor="bannerText" className="form-label">
                  短公告文字（Banner）
                </label>
                <input
                  {...register('bannerText', {
                    required: '請輸入卡片短文',
                    maxLength: { value: 100, message: '卡片短文不得超過 100 字' },
                  })}
                  id="bannerText"
                  type="text"
                  className="form-control"
                  placeholder="可供首頁公告條、輪播卡片簡述使用"
                />
                {errors.bannerText && (
                  <small className="text-danger">{errors.bannerText.message}</small>
                )}
              </div>
            </div>

            {/* 第四列：上下架 */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="publishStart" className="form-label">
                  上架開始
                </label>
                <input
                  {...register('publishStart')}
                  id="publishStart"
                  type="date"
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="publishEnd" className="form-label">
                  上架結束
                </label>
                <input
                  {...register('publishEnd', {
                    validate: (value) => {
                      const start = watch('publishStart');
                      if (start && value && value < start) {
                        return '下架日期不可早於上架日期';
                      }
                      return true;
                    },
                  })}
                  id="publishEnd"
                  type="date"
                  className="form-control"
                />
                {errors.publishEnd && (
                  <small className="text-danger">{errors.publishEnd.message}</small>
                )}
                <small className="text-muted d-block mt-1">若未設定將持續顯示不自動下架</small>
              </div>
            </div>

            {/* 第七列：標籤 + 公開 */}
            <div className="row g-3 mb-3 align-items-end">
              <div className="col-md-9">
                <label className="form-label fw-semibold">文章標籤</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {Object.values(ARTICLE_TAG_MAP).map((item) => {
                    const isActive = selectedTags.includes(item.value);

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleTagToggle(item.value)}
                        className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="form-control bg-light small text-muted">
                  {tagPreviewText || '尚未選擇文章標籤'}
                </div>
              </div>

              <div className="col-md-3 pb-2">
                <div className="form-check mt-4">
                  <input
                    {...register('isPublic')}
                    type="checkbox"
                    className="form-check-input"
                    id="isPublic"
                  />
                  <label className="form-check-label" htmlFor="isPublic">
                    是否公開
                  </label>
                </div>
              </div>
            </div>

            {/* 第五列：摘要 */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                文章摘要
              </label>
              <textarea
                {...register('description', { required: '請輸入文章摘要' })}
                id="description"
                rows={3}
                className="form-control"
                placeholder="請輸入文章摘要"
              ></textarea>
              {errors.description && (
                <small className="text-danger">{errors.description.message}</small>
              )}
            </div>

            {/* 第六列：內容 */}
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                文章內容
              </label>
              <textarea
                {...register('content', { required: '請輸入文章內容' })}
                id="content"
                rows={6}
                className="form-control"
                placeholder="請輸入文章內容"
              ></textarea>
              {errors.content && (
                <small className="text-danger">{errors.content.message}</small>
              )}
            </div>

            {/* 第八列：圖片 */}
            <div className="mb-2">
              <label htmlFor="image" className="form-label">
                封面圖片
              </label>
              <input
                {...register('image')}
                id="image"
                type="text"
                className="form-control"
                placeholder="請輸入圖片網址"
              />
              {watchImage && (
                <img src={watchImage} alt="article-preview" className="img-fluid rounded mt-3" />
              )}
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button type="button" onClick={onConfirm} className="btn btn-primary">
              確認
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
