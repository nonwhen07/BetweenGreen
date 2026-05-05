/* =========================================================
  取得 map 內指定 value 對應資料
========================================================= */
export const findMapItemByValue = (mapObject, targetValue) => {
  return Object.values(mapObject).find((item) => item.value === targetValue);
};

/* =========================================================
  取得 label
========================================================= */
export const getLabelByValue = (mapObject, targetValue, fallback = '未設定') => {
  const item = findMapItemByValue(mapObject, targetValue);
  return item ? item.label : fallback;
};

/* =========================================================
  取得 shortLabel
========================================================= */
export const getShortLabelByValue = (mapObject, targetValue, fallback = '未設定') => {
  const item = findMapItemByValue(mapObject, targetValue);
  return item ? item.shortLabel : fallback;
};

/* =========================================================
  取得 encodeKey
========================================================= */
export const getEncodeKeyByValue = (mapObject, targetValue) => {
  const item = findMapItemByValue(mapObject, targetValue);
  return item ? item.encodeKey : '';
};

/* =========================================================
  selectedTags 切換器（共用）
========================================================= */
export const toggleSelectedValue = (currentArray, value) => {
  if (currentArray.includes(value)) {
    return currentArray.filter((item) => item !== value);
  }

  return [...currentArray, value];
};

/* =========================================================
  selectedTags 多組 map 轉預覽摘要
========================================================= */
export const buildPreviewLabels = (values = [], mapObject) => {
  return values
    .map((value) => getShortLabelByValue(mapObject, value, ''))
    .filter(Boolean)
    .join(' / ');
};

/* =========================================================
  單值 + 多值混合預覽摘要（後台摘要卡很好用）
========================================================= */
export const buildAdminSummary = ({
  categoryValue = '',
  categoryMap = null,
  tagValues = [],
  tagMap = null,
  extraValue = '',
  extraMap = null,
  priorityValue = '',
  priorityMap = null,
}) => {
  const summary = [];

  if (categoryMap && categoryValue) {
    summary.push(getShortLabelByValue(categoryMap, categoryValue));
  }

  if (tagMap && tagValues.length > 0) {
    const tagsText = buildPreviewLabels(tagValues, tagMap);
    if (tagsText) summary.push(tagsText);
  }

  if (extraMap && extraValue) {
    summary.push(getShortLabelByValue(extraMap, extraValue));
  }

  if (priorityMap && priorityValue) {
    summary.push(getShortLabelByValue(priorityMap, priorityValue));
  }

  return summary.join(' ｜ ');
};

/* =========================================================
  encode meta 字串（若未來要藏進 title/code/tag）
========================================================= */
export const buildEncodeMetaString = (valueGroups = []) => {
  const encodeArray = valueGroups.flat().filter(Boolean);
  return encodeArray.join('|');
};

/* =========================================================
  decode meta 字串
========================================================= */
export const parseEncodeMetaString = (metaString = '') => {
  if (!metaString) return [];
  return metaString.split('|').filter(Boolean);
};

/* =========================================================
  DEFAULT 預設資料
========================================================= */
export const DEFAULT_ARTICLE = {
  title: '',
  author: '',
  description: '',
  content: '',
  image: '',
  tag: [],
  create_at: Math.floor(Date.now() / 1000),
  isPublic: false,
};

/* =========================================================
  通用型工具(晚點集中抽出去管理，這不一定後台專用)
========================================================= */
// 日期轉 input 的小工具
export const formatUnixToDateInput = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toISOString().split('T')[0];
};

export const formatDateInputToUnix = (dateString) => {
  if (!dateString) return Math.floor(Date.now() / 1000);
  return Math.floor(new Date(dateString).getTime() / 1000);
};
