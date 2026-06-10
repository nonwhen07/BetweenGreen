// constants
import { parseCategoryParts, parsePersonalityTags } from '@/constants/productConstants';

// components
import BtnLoader from '@/components/BtnLoader';

const ProductInfo_V3 = ({
  currentProduct,
  qtySelect,
  setQtySelect,
  addCartItem,
  isLoading,
  isAdded,
}) => {
  const { theme, species } = parseCategoryParts(currentProduct?.category);

  // const tags = parsePersonalityTags(currentProduct?.content).slice(0, 4);
  const tags = parsePersonalityTags(currentProduct?.personalityTags).slice(0, 4);

  const discount =
    currentProduct?.origin_price > currentProduct?.price
      ? currentProduct.origin_price - currentProduct.price
      : 0;

  return (
    <div className="product-info">
      {/* Header */}
      <section className="product-info__header">
        <p className="product-info__eyebrow">{theme?.title || 'Between Green'}</p>

        <h1 className="product-info__title">{currentProduct?.title}</h1>

        <div className="product-info__sub">
          <span>{species?.label}</span>
          {/* <span>★★★★☆</span> */}
        </div>
      </section>

      {/* Price */}
      <section className="product-info__pricing">
        <div className="product-info__price">NT$ {currentProduct?.price?.toLocaleString()}</div>

        {discount > 0 && (
          <div className="product-info__origin">
            <span className="text-danger">
              NT$ {currentProduct?.origin_price?.toLocaleString()}
            </span>

            <span>現省 NT$ {discount.toLocaleString()}</span>
          </div>
        )}
      </section>

      {/* Tags */}
      {tags.length > 0 && (
        <section className="product-info__tags">
          {tags.map((tag) => (
            <span key={tag.badge} className="product-info__tag">
              {tag.label}
            </span>
          ))}
        </section>
      )}

      {/* Summary 產品實際內容說明 */}
      {/* <section className="product-info__summary">
        <p>{product?.content}</p>
      </section> */}

      {/* Purchase */}
      <section className="product-info__purchase">
        <div className="product-info__qty">
          <button
            type="button"
            className={`
              product-info__qty-btn
              ${isAdded ? 'is-success' : ''}
            `}
            disabled={isLoading || isAdded || qtySelect <= 1}
            onClick={() => setQtySelect((prev) => Math.max(1, prev - 1))}
          >
            −
          </button>

          <span>{qtySelect}</span>

          <button
            type="button"
            className={`
              product-info__qty-btn
              ${isAdded ? 'is-success' : ''}
            `}
            disabled={isLoading || isAdded}
            onClick={() => setQtySelect((prev) => Math.min(10, prev + 1))}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="ui-btn ui-btn--primary product-info__cart-btn"
          disabled={isLoading}
          onClick={() => addCartItem(currentProduct?.id, qtySelect)}
        >
          {isLoading ? (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <BtnLoader size="sm" />
                <span className="ms-2">加入中...</span>
              </div>
            </>
          ) : isAdded ? (
            '✓ 已加入購物車'
          ) : (
            '加入購物車'
          )}
        </button>
      </section>

      {/* Service */}
      <section className="product-info__service">
        <div className="product-info__service-item">7天鑑賞期</div>

        <div className="product-info__service-item">滿 NT$999 免運</div>

        <div className="product-info__service-item">專業防撞包裝</div>

        <div className="product-info__service-item">到貨補寄保障</div>
      </section>
    </div>
  );
};

export default ProductInfo_V3;
