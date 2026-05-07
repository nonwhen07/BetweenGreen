// import { useState } from 'react';
// import PropTypes from 'prop-types';

// 先基本款CRUD，後面再設定優惠碼種類與項目用途，這邊是照抄命名constants
// constants
// import {
//   ARTICLE_Coupon_MAP,
// } from '@/constants/adminBuilderMaps';

const CouponModal = ({
  isOpen,
  onClose,
  modalMode,
  onConfirm,

  register,
  watch,
  errors,
}) => {
  const watchTitle = watch('title');
  const watchPercent = watch('percent');

  // const tagPreviewText = selectedTags.join(' | ');

  if (!isOpen) return null;

  return (
    <div
      id="couponModal"
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <h5 className="modal-title text-light fs-4">
              {modalMode === 'create' ? '新增優惠卷' : `編輯 - ${watchTitle || ''}`}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* 第一/二列： 名稱、優惠碼 */}
            <div className="admin-form-section">
              <div className="col-md-6">
                <label htmlFor="title" className="form-label">
                  優惠卷標題
                </label>
                <input
                  {...register('title', { required: '請輸入優惠卷標題' })}
                  id="title"
                  type="text"
                  className="form-control"
                />
                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </div>
              <div className="col-md-6">
                <label htmlFor="code" className="form-label">
                  優惠代碼
                </label>
                <input
                  {...register('code', { required: '請輸入優惠代碼' })}
                  id="code"
                  type="text"
                  className="form-control"
                />
                {errors.code && <small className="text-danger">{errors.code.message}</small>}
              </div>
            </div>

            {/* 第三列：折扣 % */}
            {/* 第四列：上架開始，後面可以像 Article 那樣在客製化 下架日 */}
            <div className="admin-form-section">
              <div className="col-md-6">
                <label htmlFor="percent" className="form-label">
                  折扣 %
                </label>
                <input
                  {...register('percent', { required: '請輸入折扣 %' })}
                  id="percent"
                  type="number"
                  className="form-control"
                />
                <div className="admin-form-section__header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">優惠設定</h6>
                  <div className="admin-coupon-preview">
                    <strong>{watchPercent || 0}% OFF</strong>
                  </div>
                </div>
                {errors.percent && <small className="text-danger">{errors.percent.message}</small>}
              </div>
              <div className="col-md-6">
                <label htmlFor="publishStart" className="form-label">
                  優惠到期日
                </label>
                <input
                  {...register('due_date')}
                  id="publishStart"
                  type="date"
                  className="form-control"
                />
              </div>
            </div>

            {/* 第五列：啟用 */}
            <div className="admin-form-section align-items-end">
              <div className="col-12 pb-2">
                <div className="form-check mt-4">
                  <input
                    {...register('is_enabled')}
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
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

export default CouponModal;
