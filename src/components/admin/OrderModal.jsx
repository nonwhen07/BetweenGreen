const OrderModal = ({ isOpen, onClose, tempOrder, onChange, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>訂單詳情</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p>訂單編號：{tempOrder.id}</p>
            <p>用戶：{tempOrder.user?.email}</p>

            <div className="form-check">
              <input
                type="checkbox"
                name="is_paid"
                checked={tempOrder.is_paid}
                onChange={onChange}
                className="form-check-input"
              />
              <label>是否付款</label>
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={onConfirm} className="btn btn-primary">
              更新
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
