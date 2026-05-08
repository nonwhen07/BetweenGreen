// components
import { formatUnixToDateInput } from '@/utils/adminBuilderUtils';
// components
import Pagination from '@/components/Pagination';

const CouponsTable = ({
  coupons,
  pageInfo,
  handlePageChange,
  openCouponModal,
  openDeleteModal,
  couponCount,
}) => {
  return (
    <>
      {/* <div className="admin-panel__header">
        <div>
          <h4 className="mb-1">優惠券快速總覽</h4>
          <p className="text-muted small mb-0">目前共 {couponCount} 筆優惠券資料</p>
        </div>

        <button className="btn btn-primary px-4" onClick={() => openCouponModal('create')}>
          ＋ 新增優惠券
        </button>
      </div> */}

      <div className="admin-panel__body">
        {couponCount === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-2">目前尚無優惠券資料</p>
            <small className="text-secondary">點擊右上角「新增優惠券」開始建立第一篇內容</small>
          </div>
        ) : (
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th width="34%">名稱</th>
                <th width="12%">優惠碼</th>
                <th width="12%">折扣</th>
                <th width="12%">到期日</th>
                <th width="10%">狀態</th>
                <th width="20%">操作</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.title}</td>

                  <td>
                    <code>{coupon.code}</code>
                  </td>

                  <td>{coupon.percent}%</td>

                  <td>{formatUnixToDateInput(coupon.due_date)}</td>

                  <td>
                    {coupon.is_enabled ? (
                      <span className="ui-badge ui-badge--success">啟用中</span>
                    ) : (
                      <span className="ui-badge ui-badge--muted">未啟用</span>
                    )}
                  </td>

                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        // onClick={() => onEdit('edit', coupon)}
                        // 後面可以考慮把 openCouponModal 縮成 onEdit
                        onClick={() => openCouponModal('edit', coupon)}
                      >
                        編輯
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        // onClick={() => onDelete(coupon)}
                        // 後面可以考慮把 openDeleteModal縮成 onDelete
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
        )}
      </div>

      {couponCount > 0 && (
        <div className="admin-panel__footer d-flex justify-content-center">
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      )}
    </>
  );
};

export default CouponsTable;
