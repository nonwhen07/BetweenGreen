import { PackageCheck, ShieldCheck, Star, Truck } from 'lucide-react';

// constants
import {
  PRODUCT_DISPLAY_TAGS_MAP,
  PRODUCT_UNIT_MAP,
  parseCategoryParts,
  parsePersonalityTags,
} from '@/constants/productConstants';

// components
import BtnLoader from '@/components/BtnLoader';
import QuantityStepper from '@/components/shared/QuantityStepper';

const currencyFormatter = new Intl.NumberFormat('zh-TW');

const ProductInfo = ({
  currentProduct,
  qtySelect,
  setQtySelect,
  addCartItem,
  isLoading,
  isAdded,
}) => {
  const { theme, type, species } = parseCategoryParts(currentProduct?.category);
  const tags = parsePersonalityTags(currentProduct?.personalityTags).slice(0, 4);
  const currentPrice = Number(currentProduct?.price || 0);
  const originPrice = Number(currentProduct?.origin_price || 0);
  const discount = Math.max(0, originPrice - currentPrice);
  const rating = Math.min(5, Math.max(0, Number(currentProduct?.rating || 0)));
  const unit = Object.values(PRODUCT_UNIT_MAP).find(
    (unitOption) => unitOption.value === currentProduct?.unit,
  );
  const displayTagKey = currentProduct?.displayTags
    ?.split('|')
    .map((tag) => tag.trim())
    .find((tag) => PRODUCT_DISPLAY_TAGS_MAP[tag]);
  const displayTag = displayTagKey ? PRODUCT_DISPLAY_TAGS_MAP[displayTagKey] : null;

  return (
    <div className="product-info">
      <header className="product-info__header">
        <div className="product-info__eyebrow-row">
          <p className="product-info__eyebrow">{theme?.title || 'Between Green'}</p>
          {displayTag && <span className="product-info__badge">{displayTag.badge}</span>}
        </div>

        <h1 className="product-info__title">{currentProduct?.title}</h1>
        {currentProduct?.titleEn && (
          <p className="product-info__title-en">{currentProduct.titleEn}</p>
        )}

        <div className="product-info__sub">
          <span>{species?.label || type?.label || '植感生活選物'}</span>
          {rating > 0 && (
            <span className="product-info__rating" aria-label={`商品評分 ${rating} 顆星，滿分 5 顆`}>
              <Star size={15} strokeWidth={1.8} fill="currentColor" aria-hidden="true" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </header>

      {currentProduct?.description && (
        <p className="product-info__summary">{currentProduct.description}</p>
      )}

      <section className="product-info__pricing" aria-label="商品價格">
        <div className="product-info__price">NT$ {currencyFormatter.format(currentPrice)}</div>

        {discount > 0 && (
          <div className="product-info__origin">
            <del className="product-info__origin-price">
              NT$ {currencyFormatter.format(originPrice)}
            </del>
            <span>現省 NT$ {currencyFormatter.format(discount)}</span>
          </div>
        )}
      </section>

      {tags.length > 0 && (
        <div className="product-info__tags" aria-label="商品特色標籤">
          {tags.map((tag) => (
            <span key={tag.badge} className="product-info__tag">
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <dl className="product-info__meta">
        <div className="product-info__meta-item">
          <dt>商品類型</dt>
          <dd>{type?.label || '生活選物'}</dd>
        </div>
        <div className="product-info__meta-item">
          <dt>販售單位</dt>
          <dd>{unit?.label || currentProduct?.unit || '單件商品'}</dd>
        </div>
      </dl>

      <section className="product-info__purchase" aria-label="選擇數量並加入購物車">
        <div className="product-info__quantity">
          <span className="product-info__quantity-label">數量</span>
          <QuantityStepper
            value={qtySelect}
            min={1}
            max={10}
            size="lg"
            itemName={currentProduct?.title}
            isLoading={isLoading}
            isDisabled={isAdded}
            onDecrease={() => setQtySelect((prev) => Math.max(1, prev - 1))}
            onIncrease={() => setQtySelect((prev) => Math.min(10, prev + 1))}
          />
        </div>

        <button
          type="button"
          className={`ui-btn ui-btn--primary ui-btn--lg product-info__cart-btn${isAdded ? ' is-success' : ''}`}
          disabled={isLoading || isAdded}
          aria-busy={isLoading}
          onClick={() => addCartItem(currentProduct?.id, qtySelect)}
        >
          {isLoading ? (
            <span className="product-info__cart-loading">
              <BtnLoader size="sm" />
              <span>加入中...</span>
            </span>
          ) : isAdded ? (
            '✓ 已加入購物車'
          ) : (
            '加入購物車'
          )}
        </button>
      </section>

      <ul className="product-info__service" aria-label="購物服務">
        <li className="product-info__service-item">
          <PackageCheck size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>專業防撞包裝</span>
        </li>
        <li className="product-info__service-item">
          <Truck size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>滿 NT$999 免運</span>
        </li>
        <li className="product-info__service-item">
          <ShieldCheck size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>到貨狀況保障</span>
        </li>
      </ul>
    </div>
  );
};

export default ProductInfo;
