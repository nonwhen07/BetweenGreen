const formatIndex = (index) => String(index + 1).padStart(2, '0');

const SeasonalSelectorItem = ({
  product,
  index,
  isActive,
  isRotationPaused,
  onSelect,
  onKeyDown,
}) => {
  return (
    <button
      id={`seasonal-selector-${index}`}
      type="button"
      className={`seasonal-selector__item${isActive ? ' is-active' : ''}`}
      role="tab"
      aria-selected={isActive}
      aria-controls="seasonal-campaign-panel"
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      <span className="seasonal-selector__number">{formatIndex(index)}</span>

      <span className="seasonal-selector__copy">
        <span className="seasonal-selector__title">{product.title}</span>
        <span className="seasonal-selector__price">NT$ {product.price?.toLocaleString()}</span>
      </span>

      {isActive && (
        <span
          className={`seasonal-selector__progress${isRotationPaused ? ' is-paused' : ''}`}
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default SeasonalSelectorItem;
