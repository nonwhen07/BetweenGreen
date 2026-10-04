export const ARTICLE_CATEGORY_MAP = {
  notice: {
    label: '網站公告',
    shortLabel: '公告',
    value: 'notice',
  },
  careGuide: {
    label: '植栽照護',
    shortLabel: '照護',
    value: 'care-guide',
  },
  alert: {
    label: '警訊通知',
    shortLabel: '警訊',
    value: 'alert',
  },
  generalInfo: {
    label: '通用資訊',
    shortLabel: '資訊',
    value: 'general-info',
  },
  event: {
    label: '活動消息',
    shortLabel: '活動',
    value: 'event',
  },
  brandStory: {
    label: '品牌故事',
    shortLabel: '品牌',
    value: 'brand-story',
  },
  seasonal: {
    label: '季節企劃',
    shortLabel: '季節',
    value: 'seasonal-event',
  },
};

export const ARTICLE_VIEWER_SCOPE_MAP = {
  public: {
    label: '前台訪客',
    shortLabel: '公開',
    value: 'public',
  },
  member: {
    label: '會員可見',
    shortLabel: '會員',
    value: 'member',
  },
  admin: {
    label: '內部管理',
    shortLabel: '內部',
    value: 'admin',
  },
};

export const ARTICLE_TAG_MAP = {
  shipping: {
    label: '配送說明',
    shortLabel: '配送',
    value: 'shipping',
  },
  fraudAlert: {
    label: '防詐提醒',
    shortLabel: '防詐',
    value: 'fraud-alert',
  },
  plantCare: {
    label: '植物養護',
    shortLabel: '養護',
    value: 'plant-care',
  },
  watering: {
    label: '澆水指南',
    shortLabel: '澆水',
    value: 'watering',
  },
  repotting: {
    label: '換盆技巧',
    shortLabel: '換盆',
    value: 'repotting',
  },
  lighting: {
    label: '光照管理',
    shortLabel: '光照',
    value: 'lighting',
  },
  fertilizing: {
    label: '施肥指南',
    shortLabel: '施肥',
    value: 'fertilizing',
  },
  beginner: {
    label: '新手入門',
    shortLabel: '新手',
    value: 'beginner',
  },
  indoor: {
    label: '室內植栽',
    shortLabel: '室內',
    value: 'indoor',
  },
  seasonal: {
    label: '季節企劃',
    shortLabel: '季節',
    value: 'seasonal',
  },
  member: {
    label: '會員權益',
    shortLabel: '會員',
    value: 'member',
  },
  siteUpdate: {
    label: '網站更新',
    shortLabel: '更新',
    value: 'site-update',
  },
  promo: {
    label: '優惠活動',
    shortLabel: '優惠',
    value: 'promo',
  },
};

export const ARTICLE_PRIORITY_MAP = {
  low: {
    label: '一般',
    shortLabel: 'P1',
    value: '1',
  },
  medium: {
    label: '重要',
    shortLabel: 'P2',
    value: '2',
  },
  high: {
    label: '高優先',
    shortLabel: 'P3',
    value: '3',
  },
};

export const ARTICLE_DISPLAY_ZONE_MAP = {
  gardenTips: {
    label: 'Garden Tips',
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

export const DEFAULT_ARTICLE = {
  title: '',
  author: 'Between Green 編輯部',
  description: '',
  content: '',
  image: '',
  tag: [],
  create_at: Math.floor(Date.now() / 1000),
  isPublic: false,
  isFeatured: false,
  articleCategory: 'care-guide',
  publishStart: '',
  publishEnd: '',
  viewerScope: 'public',
  priorityLevel: '1',
  bannerText: '',
  displayZone: 'garden-tips',
};

export const ARTICLE_PER_PAGE = 10;
export const ARTICLE_MAX_TAGS = 4;

export const ARTICLE_GARDEN_TIPS_LIMIT = 3;
