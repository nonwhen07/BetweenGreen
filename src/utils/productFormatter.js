import {
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  CATEGORY_SPECIES_MAP,
  PRODUCT_UNIT_MAP,
} from '@/constants/productConstants';

// 產品分類 code => 中文預覽
export const formatCategoryPreview = (categoryCode = '') => {
  const [theme, type, species] = categoryCode.split('-');

  return [
    CATEGORY_THEME_MAP[theme]?.label,
    CATEGORY_TYPE_MAP[type]?.label,
    CATEGORY_SPECIES_MAP[species]?.label,
  ]
    .filter(Boolean)
    .join(' - ');
};

// 產品單位 value => 中文label
export const getProductUnitLabel = (unitValue = '') => {
  return (
    Object.values(PRODUCT_UNIT_MAP).find((item) => item.value === unitValue)?.label || unitValue
  );
};
