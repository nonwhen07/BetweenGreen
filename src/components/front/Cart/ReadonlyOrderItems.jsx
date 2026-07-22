import ProductImage from '@/components/ProductImage';

const formatCurrency = (value = 0) => {
  return Math.round(Number(value || 0)).toLocaleString();
};

const ReadonlyOrderItems = ({
  items = [],
  emptyTitle = '目前沒有商品明細',
  emptyDescription = '目前無法顯示這筆訂單的商品資料。',
}) => {
  if (items.length === 0) {
    return (
      <div className="cart-state-card p-4 text-center">
        <h3 className="h5 mb-2">{emptyTitle}</h3>
        <p className="text-muted mb-0">{emptyDescription}</p>
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
        <div className="table-responsive checkout-carttable">
          <table className="table cart-table align-middle mb-0">
            <thead className="cart-table__header">
              <tr>
                <th className="cart-table__col--info">商品名稱</th>
                <th className="cart-table__col--image">圖片</th>
                <th className="cart-table__col--price">單價</th>
                <th className="cart-table__col--qty">數量</th>
                <th className="cart-table__col--subtotal">小計</th>
              </tr>
            </thead>

            <tbody className="cart-table__body">
              {items.map((item) => (
                <tr key={`table-${item.displayId || item.id || item.product_id}`}>
                  <td className="cart-table__col--info">{item.title}</td>

                  <td className="cart-table__col--image">
                    <ProductImage src={item.imageUrl} alt={item.title} size="small" />
                  </td>

                  <td className="cart-table__col--price">NT$ {formatCurrency(item.price)}</td>

                  <td className="cart-table__col--qty">
                    {item.qty} {item.unit || '未設定單位'}
                  </td>

                  <td className="cart-table__col--subtotal">NT$ {formatCurrency(item.total)}</td>
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
