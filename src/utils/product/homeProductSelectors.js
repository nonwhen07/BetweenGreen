export const HOME_FEATURED_MIN = 6;
export const HOME_FEATURED_LIMIT = 8;
export const SEASONAL_CAMPAIGN_LIMIT = 3;

export const splitProductCodes = (value = '') =>
  value
    .split('|')
    .map((code) => code.trim())
    .filter(Boolean);

export const getSeasonalCampaignPriority = (product = {}) => {
  const displayTags = splitProductCodes(product.displayTags);
  const [theme] = product.category?.split('-') || [];
  const isFeaturedSeasonal =
    displayTags.includes('Featured') && displayTags.includes('SeasonalHot');

  if (isFeaturedSeasonal) return 4;
  if (displayTags.includes('SeasonalHot')) return 3;
  if (theme === 'SeasonGift') return 2;
  if (theme === 'CelebrationGift') return 1;

  return 0;
};

export const selectSeasonalCampaignProducts = (
  products = [],
  limit = SEASONAL_CAMPAIGN_LIMIT,
) =>
  products
    .filter((product) => Number(product.is_enabled) === 1)
    .map((product, sourceIndex) => ({
      product,
      sourceIndex,
      priority: getSeasonalCampaignPriority(product),
    }))
    .filter(({ priority }) => priority > 0)
    .sort((a, b) => b.priority - a.priority || a.sourceIndex - b.sourceIndex)
    .slice(0, limit)
    .map(({ product }) => product);

export const selectHomepageFeaturedProducts = (
  products = [],
  limit = HOME_FEATURED_LIMIT,
) =>
  products
    .filter((product) => {
      if (Number(product.is_enabled) !== 1) return false;

      const displayTags = splitProductCodes(product.displayTags);
      const isFeatured = displayTags.includes('Featured');
      const belongsToSeasonalCampaign = getSeasonalCampaignPriority(product) > 0;

      return isFeatured && !belongsToSeasonalCampaign;
    })
    .slice(0, limit);
