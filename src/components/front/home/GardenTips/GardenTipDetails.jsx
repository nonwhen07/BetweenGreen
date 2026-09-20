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
        {/* 暫留 href="#"：前台 ArticlePage／ArticleDetailPage 尚未建立。 */}
        <a
          href="#"
          className="garden-tip-card__link"
          aria-disabled="true"
          onClick={(event) => event.preventDefault()}
        >
          閱讀文章
        </a>
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
