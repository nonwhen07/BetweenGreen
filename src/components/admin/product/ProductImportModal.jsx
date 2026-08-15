import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductImportModal = ({
  isOpen,
  onClose,
  jsonText,
  onJsonTextChange,
  onAnalyze,
  analysis,
  parseError,
  isConfirmed,
  onConfirmChange,
  onExecuteUpdate,
  isUpdating,
  progress,
  results,
}) => {
  useEffect(() => {
    if (!isOpen || isUpdating) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUpdating, onClose]);

  if (!isOpen) return null;

  const canExecute = Boolean(analysis?.canUpdate && isConfirmed && !isUpdating);

  return (
    <div
      className="modal show d-block product-import-modal"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-import-modal-title"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <div>
              <h5
                id="product-import-modal-title"
                className="modal-title text-light fs-4"
              >
                JSON 批次更新商品
              </h5>
              <small className="text-white-50">
                Update existing products only
              </small>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="關閉"
              disabled={isUpdating}
            />
          </div>

          <div className="modal-body p-4">
            <div className="alert alert-warning" role="alert">
              本功能會依商品 ID 覆寫既有商品資料。請先分析
              JSON，確認沒有錯誤後再執行更新。
            </div>

            <div className="mb-3">
              <label
                htmlFor="product-import-json"
                className="form-label fw-semibold"
              >
                商品 JSON
              </label>
              <textarea
                id="product-import-json"
                className={`form-control font-monospace ${parseError ? 'is-invalid' : ''}`}
                rows="12"
                value={jsonText}
                onChange={(event) => onJsonTextChange(event.target.value)}
                placeholder={
                  '{\n  "products": {\n    "商品 ID": { ...商品資料 }\n  }\n}'
                }
                disabled={isUpdating}
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
                disabled={!jsonText.trim() || isUpdating}
              >
                分析 JSON
              </button>

              {analysis && (
                <div className="product-import-summary d-flex flex-wrap gap-2 align-items-center">
                  <span className="badge text-bg-secondary">
                    共 {analysis.summary.total} 筆
                  </span>
                  <span className="badge text-bg-primary">
                    待更新 {analysis.summary.changed} 筆
                  </span>
                  <span className="badge text-bg-light border">
                    無變更 {analysis.summary.unchanged} 筆
                  </span>
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
                    筆錯誤。第一版採全批阻擋，修正後請重新分析。
                  </div>
                )}

                <div className="product-import-preview table-responsive border rounded mb-4">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>商品</th>
                        <th>ID</th>
                        <th>變更</th>
                        <th>檢查結果</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.entries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.title || '未命名商品'}</td>
                          <td>
                            <code>{entry.id}</code>
                          </td>
                          <td>
                            {entry.hasChanges ? (
                              <span className="badge text-bg-primary">
                                {entry.changedFields.length} 個欄位
                              </span>
                            ) : (
                              <span className="text-muted small">無變更</span>
                            )}
                          </td>
                          <td>
                            {entry.errors.length > 0 ? (
                              <ul className="product-import-errors text-danger small mb-0">
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
                                  <ul className="product-import-errors text-warning small mb-0 mt-1">
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

                {analysis.canUpdate && (
                  <div className="form-check mb-4">
                    <input
                      id="confirm-product-import"
                      className="form-check-input"
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(event) =>
                        onConfirmChange(event.target.checked)
                      }
                      disabled={isUpdating}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="confirm-product-import"
                    >
                      我已確認商品 ID 與預覽內容，執行{' '}
                      {analysis.summary.changed} 筆更新。
                    </label>
                  </div>
                )}
              </>
            )}

            {isUpdating && (
              <div className="mb-4" aria-live="polite">
                <div className="d-flex justify-content-between small mb-2">
                  <span>正在逐筆更新商品</span>
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
              <div className="product-import-results border rounded">
                <h6 className="px-3 pt-3">更新結果</h6>
                <ul className="list-group list-group-flush">
                  {results.map((result) => (
                    <li
                      key={result.id}
                      className="list-group-item d-flex justify-content-between gap-3"
                    >
                      <span>
                        {result.title} <code>{result.id}</code>
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
              className="btn btn-danger"
              onClick={onExecuteUpdate}
              disabled={!canExecute}
            >
              {isUpdating ? '更新中…' : '執行批次更新'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isUpdating}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jsonText: PropTypes.string.isRequired,
  onJsonTextChange: PropTypes.func.isRequired,
  onAnalyze: PropTypes.func.isRequired,
  analysis: PropTypes.shape({
    canUpdate: PropTypes.bool.isRequired,
    summary: PropTypes.shape({
      total: PropTypes.number.isRequired,
      valid: PropTypes.number.isRequired,
      invalid: PropTypes.number.isRequired,
      changed: PropTypes.number.isRequired,
      unchanged: PropTypes.number.isRequired,
    }).isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
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
  onExecuteUpdate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      status: PropTypes.oneOf(['success', 'error']).isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

ProductImportModal.defaultProps = {
  analysis: null,
};

export default ProductImportModal;
