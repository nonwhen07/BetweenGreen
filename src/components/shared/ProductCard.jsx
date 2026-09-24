import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

// assets
import noImage from '@/assets/images/no-image.png';
// constants
import {
  PRODUCT_DISPLAY_TAGS_MAP,
  parseCategoryParts,
  parsePersonalityTags,
} from '@/constants/productConstants';

const currencyFormatter = new Intl.NumberFormat('zh-TW');

const ProductCard = ({
  product,
  onAddCart,
  onToggleFavorite,
  onQuickView,

  loading = false,

  variant = 'default',
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = product.imageUrl?.trim();
  const isEnabled = Number(product.is_enabled) === 1;
  const isFallback = !imageUrl || hasImageError;

  const { theme, species } = parseCategoryParts(product.category);
  const previewTags = parsePersonalityTags(product.personalityTags).slice(0, 2);
  const displayTag = useMemo(() => {
    const displayTagKey = product.displayTags
      ?.split('|')
      .map((tag) => tag.trim())
      .find((tag) => PRODUCT_DISPLAY_TAGS_MAP[tag]);

    return displayTagKey
      ? { key: displayTagKey, ...PRODUCT_DISPLAY_TAGS_MAP[displayTagKey] }
      : null;
  }, [product.displayTags]);

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';
  const isGrid = variant === 'grid';
  const currentPrice = Number(product.price || 0);
  const originPrice = Number(product.origin_price || 0);
  const isOnSale = originPrice > currentPrice;

  return (
    <article
      className={clsx(
        'product-card',
        `product-card--${variant}`,
        loading && 'is-loading',
        !isEnabled && 'is-disabled',
      )}
    >
      <Link to={`/product/${product.id}`} className="product-card__link">
        {/* image */}
        <div className={clsx('product-card__media', isFallback && 'is-fallback')}>
          <img
            src={!isFallback ? imageUrl : noImage}
            alt={product.title || 'Between Green 商品'}
            className="product-card__image"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />

          <div className="product-card__overlay" aria-hidden="true" />

          {isGrid && displayTag && (
            <span className={clsx('product-card__badge', `is-${displayTag.type}`)}>
              {displayTag.badge}
            </span>
          )}
        </div>

        {/* body */}
        <div className="product-card__body">
          {/* left */}
          <div className="product-card__info">
            <p className="product-card__eyebrow">{theme?.title || 'Between Green'}</p>
            <h3 className="product-card__title">{product.title}</h3>
            {isGrid && product.titleEn && (
              <p className="product-card__title-en">{product.titleEn}</p>
            )}
            {!isMinimal && !isCompact && <p className="product-card__species">{species?.label}</p>}
          </div>

          {/* right */}
          <div className="product-card__meta">
            {!isCompact && previewTags.length > 0 && (
              <ul className="product-card__tags">
                {previewTags.map((tag) => (
                  <li key={tag.badge} className="product-card__tag">
                    {tag.badge}
                  </li>
                ))}
              </ul>
            )}
            {/* footer */}
            <div className="product-card__footer">
              <div className="product-card__pricing">
                <p className="product-card__price">NT$ {currencyFormatter.format(currentPrice)}</p>
                {isGrid && isOnSale && (
                  <del className="product-card__origin-price">
                    NT$ {currencyFormatter.format(originPrice)}
                  </del>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {!isMinimal && (
        <div className="product-card__actions">
          {onToggleFavorite && (
            <button
              type="button"
              className="product-card__icon-btn"
              aria-label="加入收藏"
              title="加入收藏"
              onClick={() => onToggleFavorite(product.id)}
            >
              <Heart size={18} strokeWidth={1.75} />
            </button>
          )}

          {onQuickView && (
            <button
              type="button"
              className="product-card__icon-btn"
              aria-label="快速查看"
              title="快速查看"
              onClick={() => onQuickView(product.id)}
            >
              <Eye size={18} strokeWidth={1.75} />
            </button>
          )}

          {onAddCart && (
            <button
              type="button"
              className={clsx('product-card__icon-btn', loading && 'is-loading')}
              aria-label={`將${product.title || '商品'}加入購物車`}
              title="加入購物車"
              disabled={loading || !isEnabled}
              aria-busy={loading}
              onClick={() => onAddCart(product.id)}
            >
              {loading ? (
                <span className="product-card__loading-dot" />
              ) : (
                <ShoppingBag size={18} strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default ProductCard;
