// 主分類單選
export const ARTICLE_CATEGORY_MAP = {
  Notice: {
    label: '網站公告',
    value: 'notice',
  },

  CareGuide: {
    label: '植栽照護',
    value: 'care-guide',
  },

  Alert: {
    label: '警訊通知',
    value: 'alert',
  },

  GeneralInfo: {
    label: '通用資訊',
    value: 'general-info',
  },

  Event: {
    label: '活動消息',
    value: 'event',
  },

  BrandStory: {
    label: '品牌故事',
    value: 'brand-story',
  },
};

// 第二層多選標籤
export const ARTICLE_TAG_MAP = {
  Shipping: {
    label: '配送說明',
    value: 'shipping',
  },

  Fraud: {
    label: '防詐提醒',
    value: 'fraud-alert',
  },

  PlantCare: {
    label: '植物養護',
    value: 'plant-care',
  },

  Watering: {
    label: '澆水指南',
    value: 'watering',
  },

  Seasonal: {
    label: '季節企劃',
    value: 'seasonal',
  },

  Member: {
    label: '會員權益',
    value: 'member',
  },

  Update: {
    label: '網站更新',
    value: 'site-update',
  },

  Promo: {
    label: '優惠活動',
    value: 'promo',
  },
};

// 第三層：前台展示型態
export const ARTICLE_DISPLAY_MAP = {
  Normal: {
    label: '一般文章',
    value: 'normal',
  },

  Pinned: {
    label: '置頂公告',
    value: 'pinned',
  },

  Marquee: {
    label: '跑馬燈',
    value: 'marquee',
  },

  Popup: {
    label: '首頁彈窗',
    value: 'popup',
  },

  Hero: {
    label: '首頁主視覺公告',
    value: 'hero',
  },
};

// 第四層：權重
export const ARTICLE_PRIORITY_MAP = {
  Low: {
    label: '一般',
    value: 1,
  },

  Medium: {
    label: '重要',
    value: 2,
  },

  High: {
    label: '高優先',
    value: 3,
  },
};
