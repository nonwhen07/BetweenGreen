import PropTypes from 'prop-types';

// utils
import {
  formatOrderCurrency,
  formatOrderDateTime,
  getOrderCustomerName,
} from '@/utils/orderFormatter';

const OrdersTable = ({
  orders,
  hasOrders,
  openOrderModal,
  openDeleteModal,
}) => {
  if (orders.length === 0) {
    return (
      <div className="admin-empty-state admin-empty-state--panel">
        <p className="text-muted mb-2">
          {hasOrders ? '目前沒有符合篩選條件的訂單' : '目前尚無訂單資料'}
        </p>
        <small className="text-secondary">
          顧客完成結帳後，訂單資料會顯示在此處
        </small>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="table admin-table align-middle mb-0">
        <thead>
          <tr>
            <th width="30%">訂單資訊</th>
            <th width="23%">顧客</th>
            <th width="13%">訂單金額</th>
            <th width="12%">付款狀態</th>
            <th width="22%">操作</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <code className="admin-order-id" title={order.id}>
                  {order.id}
                </code>
                <small className="text-muted d-block mt-1">
                  {formatOrderDateTime(order.create_at)}
                </small>
              </td>

              <td>
                <span className="fw-semibold d-block">
                  {getOrderCustomerName(order)}
                </span>
                <span
                  className="admin-order-email text-muted small"
                  title={order.user?.email || '未提供信箱'}
                >
                  {order.user?.email || '未提供信箱'}
                </span>
              </td>

              <td className="text-nowrap">
                NT$ {formatOrderCurrency(order.total)}
              </td>

              <td className="text-nowrap">
                {order.is_paid ? (
                  <span className="badge text-bg-success">已付款</span>
                ) : (
                  <span className="badge text-bg-warning">未付款</span>
                )}
              </td>

              <td>
                <div className="btn-group admin-table__actions">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openOrderModal(order)}
                  >
                    查看
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openDeleteModal(order)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrdersTable.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasOrders: PropTypes.bool.isRequired,
  openOrderModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
};

export default OrdersTable;
