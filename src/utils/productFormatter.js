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
    CATEGORY_THEME_MAP[theme]?.label, // 第一段 主題theme
    CATEGORY_TYPE_MAP[type]?.label, // 第二段 theme內部分類
    CATEGORY_SPECIES_MAP[species]?.label, // 第三段 產品細項
  ]
    .filter(Boolean)
    .join(' - ');
};

export const formatCategoryPreview2 = (categoryCode = '') => {
  const parts = categoryCode.split('-');
  const theme = parts[0]; // 第一段 主題theme
  const species = parts[2]; // 第三段 產品細項

  return [CATEGORY_THEME_MAP[theme]?.label, CATEGORY_SPECIES_MAP[species]?.label]
    .filter(Boolean)
    .join(' - ');
};

// 產品單位 value => 中文label
export const getProductUnitLabel = (unitValue = '') => {
  return (
    Object.values(PRODUCT_UNIT_MAP).find((item) => item.value === unitValue)?.label || unitValue
  );
};
