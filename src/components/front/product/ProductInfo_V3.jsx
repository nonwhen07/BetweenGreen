import { parseCategoryParts, parseContentTags } from '@/constants/productConstants';

const ProductInfo_V3 = ({ product, qtySelect, setQtySelect, addCartItem, isLoading }) => {
  const { theme, species } = parseCategoryParts(product?.category);

  const tags = parseContentTags(product?.content).slice(0, 4);

  const discount =
    product?.origin_price > product?.price ? product.origin_price - product.price : 0;

  return (
    <div className="product-info">
      {/* Header */}
      <section className="product-info__header">
        <p className="product-info__eyebrow">{theme?.title || 'Between Green'}</p>

        <h1 className="product-info__title">{product?.title}</h1>

        <div className="product-info__sub">
          <span>{species?.label}</span>
          <span>★★★★☆</span>
        </div>
      </section>

      {/* Price */}
      <section className="product-info__pricing">
        <div className="product-info__price">NT$ {product?.price?.toLocaleString()}</div>

        {discount > 0 && (
          <div className="product-info__origin">
            <span className="text-danger">NT$ {product?.origin_price?.toLocaleString()}</span>

            <span>現省 NT$ {discount.toLocaleString()}</span>
          </div>
        )}
      </section>

      {/* Tags */}
      {tags.length > 0 && (
        <section className="product-info__tags">
          {tags.map((tag) => (
            <span key={tag.badge} className="product-info__tag">
              {tag.badge}
            </span>
          ))}
        </section>
      )}

      {/* Summary */}
      <section className="product-info__summary">
        <p>{product?.description}</p>
      </section>

      {/* Purchase */}
      <section className="product-info__purchase">
        <div className="product-info__qty">
          <button type="button" onClick={() => setQtySelect((prev) => Math.max(1, prev - 1))}>
            −
          </button>

          <span>{qtySelect}</span>

          <button type="button" onClick={() => setQtySelect((prev) => Math.min(10, prev + 1))}>
            +
          </button>
        </div>

        <button
          type="button"
          className="product-info__cart-btn"
          disabled={isLoading}
          onClick={() => addCartItem(product?.id, qtySelect)}
        >
          {isLoading ? '加入中...' : '加入購物車'}
        </button>
      </section>

      {/* Service */}
      <section className="product-info__service">
        <div className="product-info__service-item">7天鑑賞期</div>

        <div className="product-info__service-item">滿 NT$999 免運</div>

        <div className="product-info__service-item">專業防撞包裝</div>

        <div className="product-info__service-item">到貨補寄保障</div>
      </section>

      {/* Meta */}
      <section className="product-info__meta">
        <div className="product-info__meta-item">
          <span>尺寸</span>
          <span>約 15-25 cm</span>
        </div>

        <div className="product-info__meta-item">
          <span>光照</span>
          <span>明亮散射光</span>
        </div>

        <div className="product-info__meta-item">
          <span>難易度</span>
          <span>新手友善</span>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo_V3;
