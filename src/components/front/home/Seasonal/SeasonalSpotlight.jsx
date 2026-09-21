import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import noImage from '@/assets/images/no-image.png';

const getSpotlightImage = (product) =>
  product.imagesUrl?.[2]?.trim() || product.imageUrl?.trim() || noImage;

const SeasonalSpotlight = ({ product, labelledBy }) => {
  const spotlightImage = getSpotlightImage(product);
  const [theme] = product.category?.split('-') || [];
  const collectionTheme = ['SeasonGift', 'CelebrationGift'].includes(theme)
    ? theme
    : 'SeasonGift';
  const description =
    product.description?.trim() || '把當季的植物氣息帶進日常，也替重要時刻留下一份綠意。';

  return (
    <article
      id="seasonal-campaign-panel"
      className="seasonal-spotlight"
      role="tabpanel"
      aria-labelledby={labelledBy}
    >
      <div className="seasonal-spotlight__media">
        <img
          key={spotlightImage}
          src={spotlightImage}
          alt={`${product.title} 情境展示`}
          className="seasonal-spotlight__image"
          loading="lazy"
        />
      </div>

      <div className="seasonal-spotlight__content">
        <p className="seasonal-spotlight__eyebrow">Collecting Time</p>
        <h3 className="seasonal-spotlight__title">{product.title}</h3>
        <p className="seasonal-spotlight__description">{description}</p>
        <p className="seasonal-spotlight__price">NT$ {product.price?.toLocaleString()}</p>

        <div className="seasonal-spotlight__actions">
          <Link to={`/product/${product.id}`} className="ui-btn ui-btn--season ui-btn--lg">
            查看商品
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>

          <Link
            to={`/products?theme=${collectionTheme}`}
            className="seasonal-spotlight__collection-link"
          >
            瀏覽同系列
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SeasonalSpotlight;
