import { useMemo } from 'react';
import PropTypes from 'prop-types';

// hooks
import useAdminModalLifecycle from '@/hooks/useAdminModalLifecycle';
// utils
import { normalizeOrderItems } from '@/utils/orderItemUtils';
import {
  formatOrderCurrency,
  formatOrderDateTime,
} from '@/utils/orderFormatter';

const OrderModal = ({
  isOpen,
  order,
  productLookup,
  isProductCatalogReady,
  isPaid,
  hasPaymentChanged,
  isSaving,
  onPaidChange,
  onClose,
  onConfirm,
}) => {
  const { modalRef, handleBackdropMouseDown } = useAdminModalLifecycle({
    isOpen,
    onClose,
    isDismissDisabled: isSaving,
  });

  const items = useMemo(
    () => normalizeOrderItems(order?.products, productLookup),
    [order?.products, productLookup],
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block admin-modal admin-order-modal"
      ref={modalRef}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <div>
              <h5 id="order-modal-title" className="modal-title text-light fs-4">
                訂單詳情
              </h5>
              <small className="text-white-50">查看訂單內容與更新付款狀態</small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="關閉"
              onClick={onClose}
              disabled={isSaving}
            />
          </div>

          <div className="modal-body p-4">
            <div className="admin-order-detail__summary mb-4">
              <div>
                <span className="text-muted small d-block mb-1">訂單編號</span>
                <code className="admin-order-detail__id">{order?.id || '—'}</code>
              </div>
              <div>
                <span className="text-muted small d-block mb-1">建立時間</span>
                <strong>{formatOrderDateTime(order?.create_at)}</strong>
              </div>
              <div>
                <span className="text-muted small d-block mb-1">訂單總額</span>
                <strong className="text-primary">
                  NT$ {formatOrderCurrency(order?.total)}
                </strong>
              </div>
            </div>

            <section className="admin-order-detail__section mb-4">
              <h6 className="admin-order-detail__section-title">顧客與收件資訊</h6>
              <dl className="admin-order-detail__customer mb-0">
                <div>
                  <dt>姓名</dt>
                  <dd>{order?.user?.name || '未提供'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{order?.user?.email || '未提供'}</dd>
                </div>
                <div>
                  <dt>電話</dt>
                  <dd>{order?.user?.tel || '未提供'}</dd>
                </div>
                <div>
                  <dt>地址</dt>
                  <dd>{order?.user?.address || '未提供'}</dd>
                </div>
              </dl>
            </section>

            <section className="admin-order-detail__section mb-4">
              <h6 className="admin-order-detail__section-title">商品明細</h6>
              {items.length === 0 ? (
                <div className="admin-empty-state">
                  目前無法顯示這筆訂單的商品資料
                </div>
              ) : (
                <div
                  className="admin-table-wrapper admin-order-detail__items-wrapper border rounded"
                  role="region"
                  aria-label="訂單商品明細，可水平捲動"
                  tabIndex="0"
                >
                  <table className="table admin-order-detail__items-table align-middle mb-0">
                    <caption className="visually-hidden">訂單商品、單價、數量與小計</caption>
                    <thead>
                      <tr>
                        <th>商品</th>
                        <th className="text-end">單價</th>
                        <th className="text-center">數量</th>
                        <th className="text-end">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.displayId || `order-item-${index}`}>
                          <td>
                            <div className="admin-order-item">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  title={
                                    item.usesCatalogImage
                                      ? '圖片來自目前商品資料'
                                      : undefined
                                  }
                                />
                              ) : (
                                <div className="admin-order-item__placeholder">
                                  無圖片
                                </div>
                              )}
                              <span className="admin-order-item__content">
                                <span>{item.title}</span>
                                {item.usesCatalogImage && (
                                  <small className="text-muted">目前商品圖</small>
                                )}
                                {item.catalogStatus === 'disabled' && (
                                  <small className="text-warning">商品目前已停用</small>
                                )}
                                {isProductCatalogReady &&
                                  item.productId &&
                                  item.catalogStatus === 'missing' && (
                                    <small className="text-muted">
                                      商品資料已不存在
                                    </small>
                                  )}
                              </span>
                            </div>
                          </td>
                          <td className="text-end text-nowrap">
                            NT$ {formatOrderCurrency(item.price)}
                          </td>
                          <td className="text-center text-nowrap">
                            {item.qty} {item.unit}
                          </td>
                          <td className="text-end text-nowrap fw-semibold">
                            NT$ {formatOrderCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-order-detail__section mb-4">
              <h6 className="admin-order-detail__section-title">顧客留言</h6>
              <p className="admin-order-detail__message mb-0">
                {order?.message || '顧客未填寫留言'}
              </p>
            </section>

            <section className="admin-order-detail__section">
              <h6 className="admin-order-detail__section-title">付款狀態</h6>
              <div className="form-check form-switch mb-0">
                <input
                  type="checkbox"
                  id="admin-order-is-paid"
                  name="is_paid"
                  checked={isPaid}
                  onChange={(event) => onPaidChange(event.target.checked)}
                  className="form-check-input"
                  disabled={isSaving}
                />
                <label className="form-check-label" htmlFor="admin-order-is-paid">
                  {isPaid ? '已付款' : '未付款'}
                </label>
              </div>
              <small className="text-muted d-block mt-2">
                六角後台 Order API 目前只支援更新付款狀態。
              </small>
            </section>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              onClick={onConfirm}
              className="btn btn-primary"
              disabled={!hasPaymentChanged || isSaving}
            >
              {isSaving ? '更新中…' : '更新付款狀態'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSaving}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  order: PropTypes.object,
  productLookup: PropTypes.instanceOf(Map).isRequired,
  isProductCatalogReady: PropTypes.bool.isRequired,
  isPaid: PropTypes.bool.isRequired,
  hasPaymentChanged: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onPaidChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default OrderModal;
