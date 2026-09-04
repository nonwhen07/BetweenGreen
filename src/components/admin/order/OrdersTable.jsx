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
    <div
      className="admin-table-wrapper admin-orders-table-wrapper"
      role="region"
      aria-label="訂單資料表，可水平捲動"
      tabIndex="0"
    >
      <table className="table admin-table admin-orders-table align-middle mb-0">
        <caption className="visually-hidden">
          訂單編號與日期、顧客、訂單金額、付款狀態與管理操作
        </caption>
        <thead>
          <tr>
            <th className="admin-orders-table__info">訂單資訊</th>
            <th className="admin-orders-table__customer">顧客</th>
            <th className="admin-orders-table__total">訂單金額</th>
            <th className="admin-orders-table__status">付款狀態</th>
            <th className="admin-orders-table__actions">操作</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="admin-orders-table__info-cell">
                <code className="admin-order-id" title={order.id}>
                  {order.id}
                </code>
                <small className="text-muted d-block mt-1">
                  {formatOrderDateTime(order.create_at)}
                </small>
              </td>

              <td className="admin-orders-table__customer-cell">
                <span
                  className="admin-orders-table__customer-name fw-semibold d-block"
                  title={getOrderCustomerName(order)}
                >
                  {getOrderCustomerName(order)}
                </span>
                <span
                  className="admin-order-email text-muted small"
                  title={order.user?.email || '未提供信箱'}
                >
                  {order.user?.email || '未提供信箱'}
                </span>
              </td>

              <td className="admin-orders-table__total-cell text-nowrap">
                NT$ {formatOrderCurrency(order.total)}
              </td>

              <td className="admin-orders-table__status-cell text-nowrap">
                {order.is_paid ? (
                  <span className="badge text-bg-success">已付款</span>
                ) : (
                  <span className="badge text-bg-warning">未付款</span>
                )}
              </td>

              <td className="admin-orders-table__actions-cell">
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
