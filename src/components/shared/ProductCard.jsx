import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

// assets
import noImage from '@/assets/images/no-image.png';
// constants
import { parseCategoryParts, parsePersonalityTags } from '@/constants/productConstants';

const ProductCard = ({
  product,
  onAddCart,
  onToggleFavorite,
  onQuickView,

  loading = false,

  variant = 'default',
}) => {
  const isEmptySrc = !product.imageUrl || product.imageUrl.trim() === '';

  const { theme, species } = parseCategoryParts(product.category);
  const previewTags = parsePersonalityTags(product.personalityTags).slice(0, 2);

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  return (
    <article
      className={clsx(
        'product-card',
        `product-card--${variant}`,
        loading && 'is-loading',
        !product.is_enabled && 'is-disabled',
      )}
    >
      <Link to={`/product/${product.id}`} className="product-card__link">
        {/* image */}
        <div className={clsx('product-card__media', isEmptySrc && 'is-fallback')}>
          <img
            src={!isEmptySrc ? product.imageUrl : noImage}
            alt={product.title}
            className="product-card__image"
          />

          <div className="product-card__overlay" />

          {/* display tag (負責處理熱銷、促銷庫存...商業處理標籤，後台尚未開工) */}
          {/* displayTags 後續接 PRODUCT_DISPLAY_TAGS_MAP */}
          {/* {product.displayTags && (
              <span className="product-card__badge">{product.displayTags}</span>
            )} */}
        </div>

        {/* body */}
        <div className="product-card__body">
          {/* left */}
          <div className="product-card__info">
            <p className="product-card__eyebrow">{theme?.title || 'Between Green'}</p>
            <h3 className="product-card__title">{product.title}</h3>
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
              {/* optional species */}
              <p className="product-card__price">NT$ {product.price?.toLocaleString()}</p>
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
              aria-label="加入購物車"
              title="加入購物車"
              disabled={loading || !product.is_enabled}
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
