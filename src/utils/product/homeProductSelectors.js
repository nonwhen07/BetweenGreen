export const HOME_FEATURED_MIN = 6;
export const HOME_FEATURED_LIMIT = 8;
export const SEASONAL_CAMPAIGN_LIMIT = 3;

const HOME_FEATURED_THEME_ORDER = [
  'DeskLiving',
  'SpaceStyling',
  'BalconyMood',
  'PlantCare',
  'CelebrationGift',
];

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
) => {
  const candidates = products
    .filter((product) => {
      if (Number(product.is_enabled) !== 1) return false;

      const displayTags = splitProductCodes(product.displayTags);
      const isFeatured = displayTags.includes('Featured');
      const belongsToSeasonalCampaign = getSeasonalCampaignPriority(product) > 0;

      return isFeatured && !belongsToSeasonalCampaign;
    });

  const groups = candidates.reduce((result, product) => {
    const [theme = 'Other'] = product.category?.split('-') || [];
    const group = result.get(theme) || [];
    group.push(product);
    result.set(theme, group);
    return result;
  }, new Map());
  const orderedThemes = [
    ...HOME_FEATURED_THEME_ORDER.filter((theme) => groups.has(theme)),
    ...[...groups.keys()].filter((theme) => !HOME_FEATURED_THEME_ORDER.includes(theme)),
  ];
  const diversifiedProducts = [];
  let groupIndex = 0;

  while (diversifiedProducts.length < candidates.length) {
    let addedInRound = false;

    orderedThemes.forEach((theme) => {
      const product = groups.get(theme)?.[groupIndex];
      if (!product) return;
      diversifiedProducts.push(product);
      addedInRound = true;
    });

    if (!addedInRound) break;
    groupIndex += 1;
  }

  return diversifiedProducts.slice(0, limit);
};
