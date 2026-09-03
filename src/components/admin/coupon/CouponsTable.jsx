import { formatCouponDueDate } from '@/utils/coupon/couponFormatter';

const CouponsTable = ({ coupons, openCouponModal, openDeleteModal, couponCount, hasCoupons }) => {
  if (couponCount === 0) {
    return (
      <div className="admin-empty-state admin-empty-state--panel">
        <p className="text-muted mb-2">
          {hasCoupons ? '目前沒有符合篩選條件的優惠券' : '目前尚無優惠券資料'}
        </p>
        <small className="text-secondary">
          {hasCoupons
            ? '請切換健康狀態或問題類型後再查看'
            : '點擊右上角「新增優惠券」開始建立第一筆資料'}
        </small>
      </div>
    );
  }

  return (
    <div
      className="admin-table-wrapper admin-coupons-table-wrapper"
      role="region"
      aria-label="優惠券資料表，可水平捲動"
      tabIndex={0}
    >
      <table className="table admin-table admin-coupons-table align-middle mb-0">
        <caption className="visually-hidden">
          優惠券名稱、優惠碼、折扣、到期日、啟用狀態與管理操作
        </caption>
        <thead>
          <tr>
            <th className="admin-coupons-table__title">名稱</th>
            <th className="admin-coupons-table__code">優惠碼</th>
            <th className="admin-coupons-table__discount">折扣</th>
            <th className="admin-coupons-table__due-date">到期日</th>
            <th className="admin-coupons-table__status">狀態</th>
            <th className="admin-coupons-table__actions">操作</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>
                <span className="admin-coupons-table__title-text" title={coupon.title}>
                  {coupon.title}
                </span>
              </td>

              <td>
                <code>{coupon.code}</code>
              </td>

              <td className="text-nowrap">{coupon.percent}%</td>

              <td className="text-nowrap">{formatCouponDueDate(coupon.due_date)}</td>

              <td className="text-nowrap">
                {coupon.is_enabled ? (
                  <span className="badge text-bg-success">啟用中</span>
                ) : (
                  <span className="badge text-bg-secondary">未啟用</span>
                )}
              </td>

              <td>
                <div className="btn-group admin-table__actions">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openCouponModal('edit', coupon)}
                  >
                    編輯
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openDeleteModal(coupon)}
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

export default CouponsTable;
