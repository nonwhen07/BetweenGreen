import { ARTICLE_CATEGORY_MAP } from '@/constants/articleConstants';
import GardenTipDetails from '@/components/front/home/GardenTips/GardenTipDetails';

const getGardenTipCategoryLabel = (category) =>
  Object.values(ARTICLE_CATEGORY_MAP).find((item) => item.value === category)?.shortLabel ||
  '植栽筆記';

const GardenTipCard = ({
  tip,
  isActive,
  isDesktop,
  showInlineDetails,
  detailId: controlledDetailId,
  onToggle,
}) => {
  const fallbackDetailId = `garden-tip-${String(tip.id).replace(/[^a-zA-Z0-9_-]/g, '-')}-details`;
  const detailId = controlledDetailId || fallbackDetailId;
  const categoryLabel = getGardenTipCategoryLabel(tip.category);

  return (
    <article
      className={`garden-tip-card ${isActive ? 'is-active' : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="garden-tip-card__media">
        <img
          src={tip.image}
          alt=""
          className="garden-tip-card__image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = tip.fallbackImage;
          }}
        />
      </div>

      <button
        type="button"
        className="garden-tip-card__trigger"
        aria-expanded={isActive}
        aria-controls={detailId}
        onClick={onToggle}
      >
        <span className="garden-tip-card__trigger-eyebrow">{categoryLabel}</span>
        <span className="garden-tip-card__trigger-title">{tip.title}</span>
        <span className="garden-tip-card__trigger-hint">{isActive ? '收合資訊' : '查看摘要'}</span>
      </button>

      {showInlineDetails && (
        <div id={detailId} className="garden-tip-card__body" hidden={!isDesktop && !isActive}>
          <GardenTipDetails tip={tip} onClose={isDesktop ? undefined : onToggle} />
        </div>
      )}
    </article>
  );
};

export default GardenTipCard;
