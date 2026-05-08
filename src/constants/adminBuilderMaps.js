// src/constants/adminBuilderMaps.js

/* =========================================
  共用欄位格式說明
  label      : 中文顯示
  shortLabel : 預覽摘要可用短字
  value      : 實際存值
  encodeKey  : 若未來需藏進 title/code/tag 可用
  badge      : UI badge 樣式用途
========================================= */

/* =========================================================
  PRODUCT BUILDER MAPS
========================================================= */

export const PRODUCT_CATEGORY_MAP = {
  desk_green: {
    label: '書桌陪伴',
    shortLabel: '書桌',
    value: 'desk-green',
    encodeKey: 'PC_DESK',
    badge: 'green',
  },

  space_style: {
    label: '空間造景',
    shortLabel: '空間',
    value: 'space-style',
    encodeKey: 'PC_SPACE',
    badge: 'olive',
  },

  balcony_life: {
    label: '陽台日常',
    shortLabel: '陽台',
    value: 'balcony-life',
    encodeKey: 'PC_BALCONY',
    badge: 'teal',
  },

  flower_gift: {
    label: '季節花禮',
    shortLabel: '花禮',
    value: 'flower-gift',
    encodeKey: 'PC_FLOWER',
    badge: 'rose',
  },
};

export const PRODUCT_CONTENT_MAP = {
  japanese_style: {
    label: '日系簡約',
    shortLabel: '日系',
    value: 'japanese-style',
    encodeKey: 'PT_JP',
    badge: 'gray',
  },

  healing_green: {
    label: '療癒綠植',
    shortLabel: '療癒',
    value: 'healing-green',
    encodeKey: 'PT_HEAL',
    badge: 'mint',
  },

  low_maintenance: {
    label: '低維護',
    shortLabel: '低維護',
    value: 'low-maintenance',
    encodeKey: 'PT_LOW',
    badge: 'blue',
  },

  gift_recommend: {
    label: '送禮推薦',
    shortLabel: '送禮',
    value: 'gift-recommend',
    encodeKey: 'PT_GIFT',
    badge: 'gold',
  },

  beginner_friendly: {
    label: '新手友善',
    shortLabel: '新手',
    value: 'beginner-friendly',
    encodeKey: 'PT_BEGINNER',
    badge: 'purple',
  },
};

export const PRODUCT_UNIT_MAP = {
  pot_set: {
    label: '單盆植栽',
    shortLabel: '單盆',
    value: '1 pot set',
    encodeKey: 'UNIT_POT',
    badge: 'green',
  },

  double_pot: {
    label: '雙盆組合',
    shortLabel: '雙盆',
    value: '2 pot set',
    encodeKey: 'UNIT_DOUBLE',
    badge: 'green',
  },

  glass_terrarium: {
    label: '玻璃植景',
    shortLabel: '玻璃植景',
    value: '1 glass terrarium',
    encodeKey: 'UNIT_GLASS',
    badge: 'blue',
  },

  hanging_set: {
    label: '吊掛植組',
    shortLabel: '吊掛',
    value: '1 hanging set',
    encodeKey: 'UNIT_HANG',
    badge: 'olive',
  },

  bloom_pot: {
    label: '開花盆栽',
    shortLabel: '花盆',
    value: '1 bloom pot',
    encodeKey: 'UNIT_BLOOM',
    badge: 'rose',
  },

  large_pot: {
    label: '大型盆栽',
    shortLabel: '大型',
    value: '1 large pot',
    encodeKey: 'UNIT_LARGE',
    badge: 'brown',
  },

  piece: {
    label: '單件商品',
    shortLabel: '單件',
    value: '1 piece',
    encodeKey: 'UNIT_ONE',
    badge: 'gray',
  },
};

/* =========================================================
  ARTICLE BUILDER MAPS
========================================================= */

export const ARTICLE_CATEGORY_MAP = {
  notice: {
    label: '網站公告',
    shortLabel: '公告',
    value: 'notice',
    encodeKey: 'AC_NOTICE',
    badge: 'blue',
  },

  care_guide: {
    label: '植栽照護',
    shortLabel: '照護',
    value: 'care-guide',
    encodeKey: 'AC_CARE',
    badge: 'green',
  },

  alert: {
    label: '警訊通知',
    shortLabel: '警訊',
    value: 'alert',
    encodeKey: 'AC_ALERT',
    badge: 'red',
  },

  general_info: {
    label: '通用資訊',
    shortLabel: '資訊',
    value: 'general-info',
    encodeKey: 'AC_INFO',
    badge: 'gray',
  },

  event: {
    label: '活動消息',
    shortLabel: '活動',
    value: 'event',
    encodeKey: 'AC_EVENT',
    badge: 'gold',
  },

  brand_story: {
    label: '品牌故事',
    shortLabel: '品牌',
    value: 'brand-story',
    encodeKey: 'AC_BRAND',
    badge: 'olive',
  },

  seasonal: {
    label: '季節企劃',
    shortLabel: '季節',
    value: 'seasonal-event',
    encodeKey: 'AT_SEASON',
    badge: 'gold',
  },
};

export const ARTICLE_VIEWER_SCOPE_MAP = {
  public: {
    label: '前台訪客',
    shortLabel: '公開',
    value: 'public',
    encodeKey: 'AV_PUBLIC',
    badge: 'green',
  },

  member: {
    label: '會員可見',
    shortLabel: '會員',
    value: 'member',
    encodeKey: 'AV_MEMBER',
    badge: 'blue',
  },

  admin: {
    label: '內部管理',
    shortLabel: '內部',
    value: 'admin',
    encodeKey: 'AV_ADMIN',
    badge: 'red',
  },
};

export const ARTICLE_TAG_MAP = {
  shipping: {
    label: '配送說明',
    shortLabel: '配送',
    value: 'shipping',
    encodeKey: 'AT_SHIP',
    badge: 'blue',
  },

  fraud_alert: {
    label: '防詐提醒',
    shortLabel: '防詐',
    value: 'fraud-alert',
    encodeKey: 'AT_FRAUD',
    badge: 'red',
  },

  plant_care: {
    label: '植物養護',
    shortLabel: '養護',
    value: 'plant-care',
    encodeKey: 'AT_CARE',
    badge: 'green',
  },

  watering: {
    label: '澆水指南',
    shortLabel: '澆水',
    value: 'watering',
    encodeKey: 'AT_WATER',
    badge: 'teal',
  },

  seasonal: {
    label: '季節企劃',
    shortLabel: '季節',
    value: 'seasonal',
    encodeKey: 'AT_SEASON',
    badge: 'gold',
  },

  member: {
    label: '會員權益',
    shortLabel: '會員',
    value: 'member',
    encodeKey: 'AT_MEMBER',
    badge: 'purple',
  },

  site_update: {
    label: '網站更新',
    shortLabel: '更新',
    value: 'site-update',
    encodeKey: 'AT_UPDATE',
    badge: 'gray',
  },

  promo: {
    label: '優惠活動',
    shortLabel: '優惠',
    value: 'promo',
    encodeKey: 'AT_PROMO',
    badge: 'rose',
  },
};

export const ARTICLE_DISPLAY_MAP = {
  normal: {
    label: '一般文章',
    shortLabel: '一般',
    value: 'normal',
    encodeKey: 'AD_NORMAL',
    badge: 'gray',
  },

  pinned: {
    label: '置頂公告',
    shortLabel: '置頂',
    value: 'pinned',
    encodeKey: 'AD_PIN',
    badge: 'blue',
  },

  marquee: {
    label: '跑馬燈',
    shortLabel: '跑馬燈',
    value: 'marquee',
    encodeKey: 'AD_MARQUEE',
    badge: 'red',
  },

  popup: {
    label: '首頁彈窗',
    shortLabel: '彈窗',
    value: 'popup',
    encodeKey: 'AD_POPUP',
    badge: 'gold',
  },

  hero: {
    label: '首頁主視覺',
    shortLabel: 'Hero',
    value: 'hero',
    encodeKey: 'AD_HERO',
    badge: 'olive',
  },
};

export const ARTICLE_PRIORITY_MAP = {
  low: {
    label: '一般',
    shortLabel: 'P1',
    value: '1',
    encodeKey: 'AP_1',
    badge: 'gray',
  },

  medium: {
    label: '重要',
    shortLabel: 'P2',
    value: '2',
    encodeKey: 'AP_2',
    badge: 'blue',
  },

  high: {
    label: '高優先',
    shortLabel: 'P3',
    value: '3',
    encodeKey: 'AP_3',
    badge: 'red',
  },
};

export const ARTICLE_FORM_FIELDS = [
  {
    name: 'title',
    label: '文章標題',
    type: 'text',
    placeholder: '請輸入文章標題',
  },
  {
    name: 'author',
    label: '作者',
    type: 'text',
    placeholder: '請輸入作者名稱',
  },
  {
    name: 'description',
    label: '文章摘要',
    type: 'textarea',
    rows: 3,
  },
  {
    name: 'content',
    label: '文章內容',
    type: 'textarea',
    rows: 6,
  },
  {
    name: 'image',
    label: '封面圖片',
    type: 'text',
    placeholder: '請輸入圖片網址',
  },
  {
    name: 'tag',
    label: '文章標籤',
    type: 'tags',
  },
  {
    name: 'create_at',
    label: '建立日期',
    type: 'date',
  },
  {
    name: 'isPublic',
    label: '是否公開',
    type: 'switch',
  },

  // 客製化欄位
  {
    name: 'articleCategory',
    label: '文章分類',
    type: 'select',
  },
  {
    name: 'viewerScope',
    label: '顯示對象',
    type: 'select',
  },
  {
    name: 'priorityLevel',
    label: '排序權重',
    type: 'select',
  },
  {
    name: 'publishStart',
    label: '上架開始',
    type: 'date',
  },
  {
    name: 'publishEnd',
    label: '上架結束',
    type: 'date',
  },
];

export const ARTICLE_DISPLAY_ZONE_MAP = {
  gardenTips: {
    label: 'GardenTips 輪播',
    value: 'garden-tips',
  },

  heroNotice: {
    label: 'Hero 公告條',
    value: 'hero-notice',
  },

  seasonalBanner: {
    label: '季節活動區',
    value: 'seasonal-banner',
  },

  memberCenter: {
    label: '會員中心',
    value: 'member-center',
  },

  dashboardAlert: {
    label: '後台提醒區',
    value: 'dashboard-alert',
  },
};

/* =========================================================
  COUPON BUILDER MAPS
========================================================= */

export const COUPON_TYPE_MAP = {
  seasonal: {
    label: '季節活動',
    shortLabel: '季節',
    value: 'seasonal',
    encodeKey: 'CT_SEASON',
    badge: 'green',
  },

  new_member: {
    label: '新會員禮',
    shortLabel: '新客',
    value: 'new-member',
    encodeKey: 'CT_NEW',
    badge: 'blue',
  },

  full_discount: {
    label: '滿額折扣',
    shortLabel: '滿額',
    value: 'full-discount',
    encodeKey: 'CT_FULL',
    badge: 'gold',
  },

  clearance: {
    label: '清倉優惠',
    shortLabel: '清倉',
    value: 'clearance',
    encodeKey: 'CT_CLEAR',
    badge: 'red',
  },

  holiday: {
    label: '節慶限定',
    shortLabel: '節慶',
    value: 'holiday',
    encodeKey: 'CT_HOLIDAY',
    badge: 'rose',
  },
};

export const COUPON_TARGET_MAP = {
  desk_green: {
    label: '書桌陪伴',
    shortLabel: '書桌',
    value: 'desk-green',
    encodeKey: 'CG_DESK',
    badge: 'green',
  },

  space_style: {
    label: '空間造景',
    shortLabel: '空間',
    value: 'space-style',
    encodeKey: 'CG_SPACE',
    badge: 'olive',
  },

  balcony_life: {
    label: '陽台日常',
    shortLabel: '陽台',
    value: 'balcony-life',
    encodeKey: 'CG_BALCONY',
    badge: 'teal',
  },

  flower_gift: {
    label: '季節花禮',
    shortLabel: '花禮',
    value: 'flower-gift',
    encodeKey: 'CG_FLOWER',
    badge: 'rose',
  },

  all_products: {
    label: '全館適用',
    shortLabel: '全館',
    value: 'all-products',
    encodeKey: 'CG_ALL',
    badge: 'gray',
  },
};

export const COUPON_DISPLAY_TAG_MAP = {
  hot: {
    label: '熱門優惠',
    shortLabel: '熱門',
    value: 'hot',
    encodeKey: 'CD_HOT',
    badge: 'red',
  },

  limited: {
    label: '限時優惠',
    shortLabel: '限時',
    value: 'limited',
    encodeKey: 'CD_LIMIT',
    badge: 'gold',
  },

  new: {
    label: '新客專屬',
    shortLabel: '新客',
    value: 'new',
    encodeKey: 'CD_NEW',
    badge: 'blue',
  },

  gift: {
    label: '贈禮活動',
    shortLabel: '贈禮',
    value: 'gift',
    encodeKey: 'CD_GIFT',
    badge: 'rose',
  },
};

export const COUPON_THEME_MAP = {
  green: {
    label: '植感綠',
    shortLabel: '綠',
    value: 'green',
    encodeKey: 'CM_GREEN',
    badge: 'green',
  },

  brown: {
    label: '木質棕',
    shortLabel: '棕',
    value: 'brown',
    encodeKey: 'CM_BROWN',
    badge: 'brown',
  },

  red: {
    label: '節慶紅',
    shortLabel: '紅',
    value: 'red',
    encodeKey: 'CM_RED',
    badge: 'red',
  },

  gold: {
    label: '限定金',
    shortLabel: '金',
    value: 'gold',
    encodeKey: 'CM_GOLD',
    badge: 'gold',
  },
};
