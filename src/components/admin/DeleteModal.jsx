const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = '',
  itemType = '資料',
  confirmText = '確認刪除',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title text-danger fw-semibold">刪除確認</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <p className="mb-2">你是否確定要刪除此{itemType}？</p>

            <div className="p-3 rounded bg-light border text-danger fw-bold">
              {itemName || '未指定項目'}
            </div>

            <small className="text-muted d-block mt-2">刪除後將無法復原，請再次確認。</small>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onConfirm} className="btn btn-danger">
              {confirmText}
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
export default DeleteModal;
