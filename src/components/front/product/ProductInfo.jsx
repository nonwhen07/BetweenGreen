import BtnLoader from '@/components/BtnLoader';

const ProductInfo = ({
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
      <div className="d-flex align-items-center gap-2 mb-3">
        <h2 className="mb-0">{product.title}</h2>

        {product?.category && <span className="badge text-bg-success">{product.category}</span>}
      </div>

      <p className="text-muted mb-3">{product.description}</p>

      <p className="mb-4">{product.content}</p>

      <h4 className="text-danger mb-4">NT$ {product.price?.toLocaleString()}</h4>

      <div className="input-group mb-3 w-100 w-md-75">
        <select
          disabled={isLoading}
          value={qtySelect}
          onChange={(e) => setQtySelect(Number(e.target.value))}
          className="form-select"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`btn d-flex align-items-center gap-2 ${
            isAdded ? 'btn-success' : 'btn-primary'
          }`}
          disabled={isLoading || isAdded}
          onClick={() => addCartItem(product?.id, qtySelect)}
        >
          {isLoading ? (
            <>
              <BtnLoader aria-hidden="true" size="sm" />
              加入中...
            </>
          ) : isAdded ? (
            '✓ 已加入'
          ) : (
            '加入購物車'
          )}
        </button>
      </div>

      {cartMessage && <div className="alert alert-success py-2">{cartMessage}</div>}
    </>
  );
};

export default ProductInfo;
