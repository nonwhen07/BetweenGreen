import ProductImage from '@/components/ProductImage';

const formatCurrency = (value = 0) => {
  return Math.round(Number(value || 0)).toLocaleString();
};

const ReadonlyOrderItems = ({
  items = [],
  variant = 'detail',
  emptyTitle = '目前沒有商品明細',
  emptyDescription = '目前無法顯示這筆訂單的商品資料。',
}) => {
  const isSummary = variant === 'summary';

  if (items.length === 0) {
    return (
      <div className="cart-state-card cart-state-card--empty">
        <h3 className="cart-state-card__title">{emptyTitle}</h3>

        <p className="cart-state-card__description">{emptyDescription}</p>
      </div>
    );
  }

  if (isSummary) {
    return (
      <div className="order-items order-items--summary">
        <div className="order-items__summary-list">
          {items.map((item) => (
            <article
              key={`summary-${item.displayId || item.id || item.product_id}`}
              className="order-item-summary"
            >
              <div className="order-item-summary__main">
                <h3 className="order-item-summary__title">{item.title}</h3>

                <p className="order-item-summary__meta">
                  {item.qty} {item.unit || '未設定單位'}
                  <span aria-hidden="true"> · </span>
                  單價 NT$ {formatCurrency(item.price)}
                </p>
              </div>

              <strong className="order-item-summary__subtotal">
                NT$ {formatCurrency(item.total)}
              </strong>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="order-items">
      {/* Mobile / Pad */}
      <div className="order-items__list">
        {items.map((item) => (
          <article
            key={`list-${item.displayId || item.id || item.product_id}`}
            className="order-item"
          >
            <div className="order-item__image">
              <ProductImage src={item.imageUrl} alt={item.title} size="small" />
            </div>

            <div className="order-item__content">
              <h4 className="order-item__title">{item.title}</h4>

              <div className="order-item__meta">
                <span>單價 NT$ {formatCurrency(item.price)}</span>
                <span>
                  數量 {item.qty} {item.unit || '未設定單位'}
                </span>
              </div>

              <div className="order-item__subtotal">
                <span>小計</span>
                <strong>NT$ {formatCurrency(item.total)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop */}
      <div className="order-items__table">
        <div className="table-responsive order-items__table-scroll">
          <table className="table order-table order-table--readonly align-middle mb-0">
            <thead className="order-table__header">
              <tr>
                <th className="order-table__col--info">商品名稱</th>
                <th className="order-table__col--image">圖片</th>
                <th className="order-table__col--price">單價</th>
                <th className="order-table__col--qty">數量</th>
                <th className="order-table__col--subtotal">小計</th>
              </tr>
            </thead>

            <tbody className="order-table__body">
              {items.map((item) => (
                <tr key={`table-${item.displayId || item.id || item.product_id}`}>
                  <td className="order-table__col--info">{item.title}</td>

                  <td className="order-table__col--image">
                    <ProductImage src={item.imageUrl} alt={item.title} size="small" />
                  </td>

                  <td className="order-table__col--price">NT$ {formatCurrency(item.price)}</td>

                  <td className="order-table__col--qty">
                    {item.qty} {item.unit || '未設定單位'}
                  </td>

                  <td className="order-table__col--subtotal">NT$ {formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReadonlyOrderItems;
