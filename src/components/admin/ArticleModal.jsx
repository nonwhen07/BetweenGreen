// import { useState } from 'react';
// import PropTypes from 'prop-types';

// constants
import { ARTICLE_TAG_MAP } from '@/constants/adminBuilderMaps';

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
  const watchContent = watch('content');

  if (!isOpen) return null;

  return (
    <div
      id="articleModal"
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <h5 className="modal-title text-light fs-4">
              {modalMode === 'create' ? '新增文章' : `編輯 - ${watchTitle || ''}`}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* 左：封面圖 */}
              <div className="col-md-4">
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
                  <img src={watchImage} alt="article-preview" className="img-fluid rounded mt-2" />
                )}
              </div>

              {/* 右：表單欄位 */}
              <div className="col-md-8">
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <label htmlFor="title" className="form-label">
                      文章標題
                    </label>
                    <input
                      {...register('title', {
                        required: '請輸入文章標題',
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
                      {...register('author', {
                        required: '請輸入作者名稱',
                      })}
                      id="author"
                      type="text"
                      className="form-control"
                    />
                    {errors.author && (
                      <small className="text-danger">{errors.author.message}</small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    文章摘要
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    className="form-control"
                    placeholder="請輸入文章摘要"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    文章內容
                  </label>
                  <textarea
                    {...register('content')}
                    id="content"
                    rows={6}
                    className="form-control"
                    placeholder="請輸入文章內容"
                  ></textarea>
                </div>

                <div className="mb-3">
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
                    {watchContent || '尚未選擇文章標籤'}
                  </div>
                </div>

                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <label htmlFor="create_at" className="form-label">
                      建立日期
                    </label>
                    <input
                      {...register('create_at')}
                      id="create_at"
                      type="date"
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6 pt-4">
                    <div className="form-check">
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
              </div>
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
