import BtnLoader from '@/components/BtnLoader';

const ProductInfo2 = ({
  product,
  qtySelect,
  setQtySelect,
  addCartItem,
  isLoading,
  cartMessage,
  isAdded,
}) => {
  return (
    <>
      <div className="product-info">
        {/* 標題與分類 */}
        <div className="d-flex align-items-start justify-content-between mb-2">
          <h2 className="h2 fw-bold mb-0">{product.title}</h2>
          {product?.category && (
            <span className="badge bg-primary px-3 py-2">{product.category}</span>
          )}
        </div>

        {/* 評價，後台有★★★★☆設定等等搬遷 */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="text-warning fs-5">★★★★☆</div>
          <span className="text-muted small">(12 則評價)</span>
        </div>

        {/* 價格 */}
        <div className="mb-4">
          <span className="fs-1 fw-bold text-primary">NT${product.price?.toLocaleString()}</span>
          {product.origin_price > product.price && (
            <span className="text-decoration-line-through text-muted ms-3">
              NT${product.origin_price?.toLocaleString()}
            </span>
          )}
        </div>

        {/* 描述 */}
        <p className="text-muted mb-4 lh-lg">{product.description}</p>
        {product.content && <p className="text-secondary mb-5 lh-lg">{product.content}</p>}

        {/* 購買區域 */}
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-end mb-5">
          <div className="w-100 w-sm-auto">
            <label className="form-label text-muted mb-1 small">數量</label>
            <select
              value={qtySelect}
              onChange={(e) => setQtySelect(Number(e.target.value))}
              className="form-select form-select-lg"
              disabled={isLoading}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`btn flex-grow-1 py-3 fw-semibold ${isAdded ? 'btn-success' : 'btn-primary'}`}
            style={{ height: '56px' }}
            disabled={isLoading || isAdded}
            onClick={() => addCartItem(product?.id, qtySelect)}
          >
            {isLoading ? (
              <>
                <BtnLoader aria-hidden="true" size="sm" /> 加入中...
              </>
            ) : isAdded ? (
              '✓ 已加入購物車'
            ) : (
              '加入購物車'
            )}
          </button>
        </div>

        {cartMessage && <div className="alert alert-success py-2">{cartMessage}</div>}

        {/* 商品規格 */}
        <div className="mb-5">
          <h6 className="fw-semibold text-primary mb-3">商品規格</h6>
          <div className="row g-3 text-sm">
            <div className="col-6 col-sm-4">
              <div className="text-muted small">尺寸</div>
              <div className="fw-medium">約 15–25 cm</div>
            </div>
            <div className="col-6 col-sm-4">
              <div className="text-muted small">難易度</div>
              <div className="fw-medium">新手友好 ★★★</div>
            </div>
            <div className="col-6 col-sm-4">
              <div className="text-muted small">光照需求</div>
              <div className="fw-medium">明亮散射光</div>
            </div>
          </div>
        </div>

        {/* 服務保證 */}
        <div className="pt-4 border-top">
          <div className="d-flex flex-wrap gap-x-4 gap-y-2 small text-muted">
            <div>✅ 7天鑑賞期</div>
            <div>✅ 到貨枯萎免費補寄</div>
            <div>✅ NT$999 以上免運</div>
            <div>✅ 專業防撞包裝</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo2;
