import { Link } from 'react-router-dom';

// assets
import noImage from '@/assets/images/no-image.png';
// constants
import { parseCategoryParts, parseContentTags } from '@/constants/productConstants';

const ProductCard = ({ product }) => {
  const isEmptySrc = !product.imageUrl || product.imageUrl.trim() === '';

  const { theme, species } = parseCategoryParts(product.category);
  const previewTags = parseContentTags(product.content).slice(0, 2);

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        {/* image */}
        <div className="product-card__media">
          <img
            // src={productItem.imageUrl}
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
          {/* eyebrow */}
          <p className="product-card__eyebrow">{theme?.title || 'Between Green'}</p>

          {/* title */}
          <h3 className="product-card__title">{product.title}</h3>

          {/* optional species */}
          <p className="product-card__species">{species?.label}</p>

          {/* content tags */}
          {previewTags.length > 0 && (
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
            <p className="product-card__price">NT$ {product.price?.toLocaleString()}</p>

            <div className="product-card__actions">
              <button type="button" className="product-card__icon-btn" aria-label="加入收藏">
                收藏
              </button>

              <button type="button" className="product-card__cart-btn">
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
