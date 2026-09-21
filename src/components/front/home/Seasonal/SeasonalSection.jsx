import { useMemo } from 'react';
import { Pause, Play } from 'lucide-react';

// SeasonalCard 已刪除：四張商品卡版型改由 SeasonalSpotlight + SeasonalSelectorItem
// 組成單一 Campaign 舞台，避免與商品列表用的 ProductCard 混用。
import SeasonalSelectorItem from '@/components/front/home/Seasonal/SeasonalSelectorItem';
import SeasonalSpotlight from '@/components/front/home/Seasonal/SeasonalSpotlight';
import { useSeasonalRotation } from '@/hooks/home/useSeasonalRotation';

const CAMPAIGN_LIMIT = 3;
const ROTATION_DELAY = 6000;

const splitCodes = (value = '') =>
  value
    .split('|')
    .map((code) => code.trim())
    .filter(Boolean);

const getCampaignPriority = (product) => {
  const displayTags = splitCodes(product.displayTags);
  const [theme] = product.category?.split('-') || [];
  const isFeaturedSeasonal =
    displayTags.includes('Featured') && displayTags.includes('SeasonalHot');

  if (isFeaturedSeasonal) return 4;
  if (displayTags.includes('SeasonalHot')) return 3;
  if (theme === 'SeasonGift') return 2;
  if (theme === 'CelebrationGift') return 1;

  return 0;
};

const SeasonalSection = ({ products = [] }) => {
  const campaignProducts = useMemo(
    () =>
      products
        .filter((product) => Number(product.is_enabled) === 1)
        .map((product, sourceIndex) => ({
          product,
          sourceIndex,
          priority: getCampaignPriority(product),
        }))
        .filter(({ priority }) => priority > 0)
        .sort((a, b) => b.priority - a.priority || a.sourceIndex - b.sourceIndex)
        .slice(0, CAMPAIGN_LIMIT)
        .map(({ product }) => product),
    [products],
  );

  const {
    activeIndex,
    rotationCycle,
    isUserPaused,
    isRotationPaused,
    prefersReducedMotion,
    selectItem,
    toggleUserPause,
    setPointerPaused,
    setKeyboardPaused,
  } = useSeasonalRotation({ itemCount: campaignProducts.length, delay: ROTATION_DELAY });

  if (campaignProducts.length === 0) return null;

  const activeProduct = campaignProducts[activeIndex];
  const activeTabId = `seasonal-selector-${activeIndex}`;

  const focusSelector = (index) => {
    window.requestAnimationFrame(() => {
      document.getElementById(`seasonal-selector-${index}`)?.focus();
    });
  };

  const handleSelectorKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % campaignProducts.length;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + campaignProducts.length) % campaignProducts.length;
    }

    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = campaignProducts.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectItem(nextIndex);
    focusSelector(nextIndex);
  };

  const handleBlurCapture = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setKeyboardPaused(false);
    }
  };

  const handleFocusCapture = (event) => {
    if (event.target.matches(':focus-visible')) {
      setKeyboardPaused(true);
    }
  };

  const handlePointerEnter = (event) => {
    if (event.pointerType === 'mouse') {
      setPointerPaused(true);
    }
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') {
      setPointerPaused(false);
    }
  };

  return (
    <section className="ui-section seasonal-section" aria-labelledby="seasonal-section-title">
      <div
        className="ui-container seasonal-section__content"
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <div className="seasonal-section__header">
          <div className="seasonal-section__intro">
            <p className="seasonal-section__eyebrow">Seasonal Campaign</p>
            <h2 id="seasonal-section-title" className="seasonal-section__title">
              蒐集當季的生活風景
            </h2>
            <p className="seasonal-section__description">
              從季節植栽到節慶心意，挑一份適合此刻的綠意提案。
            </p>
          </div>

          {campaignProducts.length > 1 && !prefersReducedMotion && (
            <button
              type="button"
              className="seasonal-section__rotation-toggle"
              aria-pressed={isUserPaused}
              onClick={toggleUserPause}
            >
              {isUserPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              <span>{isUserPaused ? '播放輪播' : '暫停輪播'}</span>
            </button>
          )}
        </div>

        <div
          className="seasonal-campaign"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <SeasonalSpotlight
            key={activeProduct.id}
            product={activeProduct}
            labelledBy={activeTabId}
          />

          {campaignProducts.length > 1 && (
            <div
              className="seasonal-selector"
              role="tablist"
              aria-label="選擇當季推薦商品"
              style={{ '--seasonal-rotation-delay': `${ROTATION_DELAY}ms` }}
            >
              {campaignProducts.map((product, index) => (
                <SeasonalSelectorItem
                  key={product.id}
                  product={product}
                  index={index}
                  isActive={index === activeIndex}
                  rotationCycle={rotationCycle}
                  isRotationPaused={isRotationPaused}
                  onSelect={selectItem}
                  onKeyDown={handleSelectorKeyDown}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeasonalSection;
