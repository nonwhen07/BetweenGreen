import { useEffect } from 'react';
import PropTypes from 'prop-types';

// hooks
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
// utils
import { ORDER_EXPORT_PERIOD_TYPES } from '@/utils/orderExporter';

const PERIOD_TYPE_OPTIONS = [
  { value: ORDER_EXPORT_PERIOD_TYPES.MONTH, label: '月份' },
  { value: ORDER_EXPORT_PERIOD_TYPES.QUARTER, label: '季度' },
  { value: ORDER_EXPORT_PERIOD_TYPES.YEAR, label: '年度' },
];

const OrderExportModal = ({
  isOpen,
  periodType,
  month,
  year,
  quarter,
  period,
  previewCount,
  isConfirmed,
  isProcessing,
  canExport,
  onPeriodTypeChange,
  onMonthChange,
  onYearChange,
  onQuarterChange,
  onConfirmChange,
  onClose,
  onExport,
}) => {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen || isProcessing) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block admin-modal admin-order-export-modal"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-export-modal-title"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <div>
              <h5
                id="order-export-modal-title"
                className="modal-title text-light fs-4"
              >
                匯出訂單 JSON
              </h5>
              <small className="text-white-50">
                依月份、季度或年度下載歷史訂單
              </small>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="關閉"
              onClick={onClose}
              disabled={isProcessing}
            />
          </div>

          <div className="modal-body p-4">
            <div className="alert alert-warning" role="alert">
              匯出檔包含顧客姓名、Email、電話與地址。請只在必要情況下載，並妥善保存。
            </div>

            <fieldset className="mb-4" disabled={isProcessing}>
              <legend className="form-label fw-semibold fs-6">匯出期間</legend>
              <div className="admin-order-export-modal__period-types">
                {PERIOD_TYPE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`btn ${
                      periodType === option.value
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      className="visually-hidden"
                      name="order-export-period-type"
                      value={option.value}
                      checked={periodType === option.value}
                      onChange={(event) =>
                        onPeriodTypeChange(event.target.value)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="admin-order-export-modal__selection mb-4">
              {periodType === ORDER_EXPORT_PERIOD_TYPES.MONTH && (
                <div>
                  <label htmlFor="order-export-month" className="form-label">
                    選擇月份
                  </label>
                  <input
                    id="order-export-month"
                    type="month"
                    className="form-control"
                    min="2000-01"
                    value={month}
                    onChange={(event) => onMonthChange(event.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              )}

              {periodType !== ORDER_EXPORT_PERIOD_TYPES.MONTH && (
                <div>
                  <label htmlFor="order-export-year" className="form-label">
                    年份
                  </label>
                  <input
                    id="order-export-year"
                    type="number"
                    className="form-control"
                    min="2000"
                    max="9999"
                    value={year}
                    onChange={(event) => onYearChange(event.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              )}

              {periodType === ORDER_EXPORT_PERIOD_TYPES.QUARTER && (
                <div>
                  <label htmlFor="order-export-quarter" className="form-label">
                    季度
                  </label>
                  <select
                    id="order-export-quarter"
                    className="form-select"
                    value={quarter}
                    onChange={(event) => onQuarterChange(event.target.value)}
                    disabled={isProcessing}
                  >
                    <option value="1">Q1（1～3 月）</option>
                    <option value="2">Q2（4～6 月）</option>
                    <option value="3">Q3（7～9 月）</option>
                    <option value="4">Q4（10～12 月）</option>
                  </select>
                </div>
              )}
            </div>

            <div
              className="admin-order-export-modal__summary mb-4"
              aria-live="polite"
            >
              {period ? (
                <>
                  <strong>{period.label}</strong>
                  <span>目前 Store 估計 {previewCount} 筆訂單</span>
                  <small>
                    按下匯出後會重新取得全部訂單，再以 Asia/Taipei 時區確認最終筆數。
                  </small>
                </>
              ) : (
                <span className="text-danger">請輸入有效的匯出期間</span>
              )}
            </div>

            <div className="form-check">
              <input
                id="confirm-order-export"
                className="form-check-input"
                type="checkbox"
                checked={isConfirmed}
                onChange={(event) => onConfirmChange(event.target.checked)}
                disabled={!period || isProcessing}
              />
              <label className="form-check-label" htmlFor="confirm-order-export">
                我已確認匯出期間，並了解檔案包含顧客個人資料。
              </label>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onExport}
              disabled={!canExport}
            >
              {isProcessing ? '刷新並匯出中…' : '匯出 JSON'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  periodType: PropTypes.oneOf(Object.values(ORDER_EXPORT_PERIOD_TYPES))
    .isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  quarter: PropTypes.string.isRequired,
  period: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  previewCount: PropTypes.number.isRequired,
  isConfirmed: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  canExport: PropTypes.bool.isRequired,
  onPeriodTypeChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onQuarterChange: PropTypes.func.isRequired,
  onConfirmChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default OrderExportModal;
