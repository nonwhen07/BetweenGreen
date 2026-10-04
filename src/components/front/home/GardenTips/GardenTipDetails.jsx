import { Link } from 'react-router-dom';

import { ARTICLE_CATEGORY_MAP } from '@/constants/articleConstants';

const getGardenTipCategoryLabel = (category) =>
  Object.values(ARTICLE_CATEGORY_MAP).find((item) => item.value === category)?.shortLabel ||
  '植栽筆記';

const GardenTipDetails = ({ tip, onClose }) => {
  const categoryLabel = getGardenTipCategoryLabel(tip.category);

  return (
    <>
      <p className="garden-tip-card__eyebrow">{categoryLabel}</p>
      <h3 className="garden-tip-card__title">{tip.title}</h3>
      <p className="garden-tip-card__description">{tip.description}</p>
      <p className="garden-tip-card__author">By {tip.author}</p>

      <div className="garden-tip-card__actions">
        <Link to={`/article/${tip.id}`} className="garden-tip-card__link">
          閱讀文章
        </Link>
        {onClose && (
          <button type="button" className="garden-tip-card__close" onClick={onClose}>
            收合
          </button>
        )}
      </div>
    </>
  );
};

export default GardenTipDetails;
