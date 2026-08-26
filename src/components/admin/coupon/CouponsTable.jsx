import { formatUnixToDateInput } from '@/utils/adminBuilderUtils';
// components
import BrandPagination from '@/components/shared/BrandPagination';

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
      <div className="admin-panel__body">
        {couponCount === 0 ? (
          <div className="admin-empty-state admin-empty-state--panel">
            <p className="text-muted mb-2">目前尚無優惠券資料</p>
            <small className="text-secondary">
              點擊右上角「新增優惠券」開始建立第一筆資料
            </small>
          </div>
        ) : (
          <div className="admin-table-wrapper">
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

                    <td className="text-nowrap">{coupon.percent}%</td>

                    <td className="text-nowrap">{formatUnixToDateInput(coupon.due_date)}</td>

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
        )}
      </div>

      {(pageInfo.total_pages || 1) > 1 && (
        <div className="admin-panel__footer d-flex justify-content-center">
          <BrandPagination
            currentPage={pageInfo.current_page || 1}
            totalPages={pageInfo.total_pages || 1}
            onPageChange={handlePageChange}
            ariaLabel="優惠券分頁導覽"
          />
        </div>
      )}
    </>
  );
};

export default CouponsTable;
