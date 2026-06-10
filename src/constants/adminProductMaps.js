import {
  CATEGORY_THEME_MAP,
  PRODUCT_PERSONALITY_MAP,
  PRODUCT_UNIT_MAP,
  PRODUCT_DISPLAY_TAGS_MAP,
} from '@/constants/productConstants';

export const ADMIN_THEME_MAP = Object.fromEntries(
  Object.entries(CATEGORY_THEME_MAP).map(([key, item]) => [
    key,
    {
      label: item.label,
      shortLabel: item.label,
      value: item.code,
      badge: 'green',
    },
  ]),
);

export const ADMIN_PERSONALITY_MAP = Object.fromEntries(
  Object.entries(PRODUCT_PERSONALITY_MAP).map(([key, item]) => [
    key,
    {
      label: item.label,
      shortLabel: item.label,
      value: key,
      badge: 'gray',
    },
  ]),
);

export const ADMIN_UNIT_MAP = Object.fromEntries(
  Object.entries(PRODUCT_UNIT_MAP).map(([key, item]) => [
    key,
    {
      label: item.label,
      shortLabel: item.label,
      value: item.value,
      badge: 'gray',
    },
  ]),
);

export const ADMIN_DISPLAY_TAG_MAP = Object.fromEntries(
  Object.entries(PRODUCT_DISPLAY_TAGS_MAP).map(([key, item]) => [
    key,
    {
      label: item.label,
      shortLabel: item.label,
      value: key,
      badge: 'gold',
    },
  ]),
);
