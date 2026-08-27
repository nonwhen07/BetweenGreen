import { useEffect } from 'react';
import PropTypes from 'prop-types';

// hooks
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

const CouponImportModal = ({
  isOpen,
  mode,
  onClose,
  jsonText,
  onJsonTextChange,
  onAnalyze,
  analysis,
  parseError,
  isConfirmed,
  onConfirmChange,
  onExecute,
  isProcessing,
  progress,
  results,
}) => {
  const isCreateMode = mode === 'create';
  const content = isCreateMode
    ? {
        title: 'JSON 批次新增優惠券',
        subtitle: 'Create new coupons only',
        alert:
          '本功能會逐筆建立新優惠券，ID 由 API 自動產生。優惠代碼不可和 Store 或本次 JSON 內資料重複。',
        placeholder:
          '{\n  "coupons": [\n    {\n      "title": "春季優惠",\n      "code": "SPRING90",\n      "percent": 90,\n      "due_date": 1806422400,\n      "is_enabled": 1\n    }\n  ]\n}',
        progress: '正在逐筆新增優惠券',
        result: '新增結果',
        execute: '執行批次新增',
        processing: '新增中…',
      }
    : {
        title: 'JSON 批次更新優惠券',
        subtitle: 'Update existing coupons only',
        alert:
          '本功能會依優惠券 ID 覆寫既有資料。可先匯出全部 JSON，修改後再貼回此處分析與更新。',
        placeholder:
          '{\n  "coupons": {\n    "優惠券 ID": {\n      "title": "更新後名稱",\n      "code": "UPDATED90",\n      "percent": 90,\n      "due_date": 1806422400,\n      "is_enabled": 1\n    }\n  }\n}',
        progress: '正在逐筆更新優惠券',
        result: '更新結果',
        execute: '執行批次更新',
        processing: '更新中…',
      };

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

  const canExecute = Boolean(
    analysis?.canExecute && isConfirmed && !isProcessing,
  );

  return (
    <div
      className="modal show d-block admin-modal admin-json-import-modal coupon-import-modal"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-import-modal-title"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <div>
              <h5
                id="coupon-import-modal-title"
                className="modal-title text-light fs-4"
              >
                {content.title}
              </h5>
              <small className="text-white-50">{content.subtitle}</small>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="關閉"
              disabled={isProcessing}
            />
          </div>

          <div className="modal-body p-4">
            <div className="alert alert-warning" role="alert">
              {content.alert}
            </div>

            <div className="mb-3">
              <label
                htmlFor="coupon-import-json"
                className="form-label fw-semibold"
              >
                優惠券 JSON
              </label>
              <textarea
                id="coupon-import-json"
                className={`form-control font-monospace ${parseError ? 'is-invalid' : ''}`}
                rows="12"
                value={jsonText}
                onChange={(event) => onJsonTextChange(event.target.value)}
                placeholder={content.placeholder}
                disabled={isProcessing}
                spellCheck="false"
              />
              {parseError && (
                <div className="invalid-feedback">{parseError}</div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={onAnalyze}
                disabled={!jsonText.trim() || isProcessing}
              >
                分析 JSON
              </button>

              {analysis && (
                <div className="admin-json-import-summary d-flex flex-wrap gap-2 align-items-center">
                  <span className="badge text-bg-secondary">
                    共 {analysis.summary.total} 筆
                  </span>
                  {isCreateMode ? (
                    <span className="badge text-bg-success">
                      待新增 {analysis.summary.creatable} 筆
                    </span>
                  ) : (
                    <>
                      <span className="badge text-bg-primary">
                        待更新 {analysis.summary.changed} 筆
                      </span>
                      <span className="badge text-bg-light border">
                        無變更 {analysis.summary.unchanged} 筆
                      </span>
                    </>
                  )}
                  <span className="badge text-bg-danger">
                    錯誤 {analysis.summary.invalid} 筆
                  </span>
                </div>
              )}
            </div>

            {analysis && (
              <>
                {analysis.summary.invalid > 0 && (
                  <div className="alert alert-danger" role="alert">
                    JSON 仍有 {analysis.summary.invalid}{' '}
                    筆錯誤。本功能採全批阻擋，修正後請重新分析。
                  </div>
                )}

                <div className="admin-json-import-preview table-responsive border rounded mb-4">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>優惠券</th>
                        <th>{isCreateMode ? '順序' : 'ID'}</th>
                        {!isCreateMode && <th>變更</th>}
                        <th>檢查結果</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.entries.map((entry) => (
                        <tr key={entry.key}>
                          <td>{entry.title || '未命名優惠券'}</td>
                          <td>
                            {isCreateMode ? (
                              `第 ${entry.rowNumber} 筆`
                            ) : (
                              <code>{entry.id}</code>
                            )}
                          </td>
                          {!isCreateMode && (
                            <td>
                              {entry.hasChanges ? (
                                <span className="badge text-bg-primary">
                                  {entry.changedFields.length} 個欄位
                                </span>
                              ) : (
                                <span className="text-muted small">無變更</span>
                              )}
                            </td>
                          )}
                          <td>
                            {entry.errors.length > 0 ? (
                              <ul className="admin-json-import-errors text-danger small mb-0">
                                {entry.errors.map((message) => (
                                  <li key={message}>{message}</li>
                                ))}
                              </ul>
                            ) : (
                              <>
                                <span className="text-success small">
                                  格式正確
                                </span>
                                {entry.warnings.length > 0 && (
                                  <ul className="admin-json-import-errors text-warning small mb-0 mt-1">
                                    {entry.warnings.map((message) => (
                                      <li key={message}>{message}</li>
                                    ))}
                                  </ul>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {analysis.canExecute && (
                  <div className="form-check mb-4">
                    <input
                      id="confirm-coupon-import"
                      className="form-check-input"
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(event) => onConfirmChange(event.target.checked)}
                      disabled={isProcessing}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="confirm-coupon-import"
                    >
                      {isCreateMode
                        ? `我已確認優惠代碼與預覽內容，執行 ${analysis.summary.creatable} 筆新增。`
                        : `我已確認優惠券 ID 與預覽內容，執行 ${analysis.summary.changed} 筆更新。`}
                    </label>
                  </div>
                )}
              </>
            )}

            {isProcessing && (
              <div className="mb-4" aria-live="polite">
                <div className="d-flex justify-content-between small mb-2">
                  <span>{content.progress}</span>
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div
                  className="progress"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{
                      width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="admin-json-import-results border rounded">
                <h6 className="px-3 pt-3">{content.result}</h6>
                <ul className="list-group list-group-flush">
                  {results.map((result) => (
                    <li
                      key={result.key}
                      className="list-group-item d-flex justify-content-between gap-3"
                    >
                      <span>
                        {result.title}{' '}
                        {result.id && <code>{result.id}</code>}
                      </span>
                      <span
                        className={
                          result.status === 'success'
                            ? 'text-success'
                            : 'text-danger'
                        }
                      >
                        {result.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className={isCreateMode ? 'btn btn-success' : 'btn btn-danger'}
              onClick={onExecute}
              disabled={!canExecute}
            >
              {isProcessing ? content.processing : content.execute}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CouponImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
  onClose: PropTypes.func.isRequired,
  jsonText: PropTypes.string.isRequired,
  onJsonTextChange: PropTypes.func.isRequired,
  onAnalyze: PropTypes.func.isRequired,
  analysis: PropTypes.shape({
    canExecute: PropTypes.bool.isRequired,
    summary: PropTypes.shape({
      total: PropTypes.number.isRequired,
      valid: PropTypes.number.isRequired,
      invalid: PropTypes.number.isRequired,
      changed: PropTypes.number,
      unchanged: PropTypes.number,
      creatable: PropTypes.number,
    }).isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        rowNumber: PropTypes.number,
        title: PropTypes.string,
        changedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
        errors: PropTypes.arrayOf(PropTypes.string).isRequired,
        warnings: PropTypes.arrayOf(PropTypes.string).isRequired,
        hasChanges: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }),
  parseError: PropTypes.string.isRequired,
  isConfirmed: PropTypes.bool.isRequired,
  onConfirmChange: PropTypes.func.isRequired,
  onExecute: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      id: PropTypes.string,
      title: PropTypes.string,
      status: PropTypes.oneOf(['success', 'error']).isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

CouponImportModal.defaultProps = {
  analysis: null,
};

export default CouponImportModal;
