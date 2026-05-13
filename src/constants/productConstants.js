// productModal 資料狀態的預設值
// 六角API可彈性新增欄位（例如 rating）
// 確保即使 API 回傳產品物件中沒有某些欄位，tempProduct 也不會報錯
export const DEFAULT_PRODUCT = {
  imageUrl: '',
  title: '',
  // 商品種類
  category: '',
  // 商品人格
  content: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  is_enabled: 0,
  imagesUrl: [''],

  // 新增欄位
  // 星數
  rating: 0,
  // 商業展示資訊
  displayTags: '',
};

// ======================================================
// CATEGORY：THEME > TYPE > SPECIES
// category 格式：DeskLiving-Plant-Succulent
// icon 用 lucide-react 替換
// ======================================================
export const CATEGORY_THEME_MAP = {
  AllProducts: {
    code: 'AllProducts',
    label: '全部商品',
    title: 'All Products',
    intro: '探索 Between Green 所有植感選物與生活提案。',
    icon: 'Package2',
  },
  DeskLiving: {
    code: 'DeskLiving',
    label: '書桌陪伴',
    title: 'Desk Living',
    intro: '適合桌邊、工作角落與日常陪伴的小型植感選物',
    icon: 'LampDesk',
  },

  BalconyMood: {
    code: 'BalconyMood',
    label: '陽台生活',
    title: 'Balcony Mood',
    intro: '迎接晨光與微風的陽台季節植栽與花器',
    icon: 'SunMedium',
  },

  SpaceStyling: {
    code: 'SpaceStyling',
    label: '空間造景',
    title: 'Space Styling',
    intro: '讓室內角落更完整的空間型植景與展示選物',
    icon: 'Sofa',
  },

  PlantCare: {
    code: 'PlantCare',
    label: '植栽養護',
    title: 'Plant Care',
    intro: '從日常澆灌到養分補給的植栽照護用品',
    icon: 'Sprout',
  },

  SeasonGift: {
    code: 'SeasonGift',
    label: '季節限定',
    title: 'Season Gift',
    intro: '依照花季與時節推出的限定植物禮盒與季節花禮',
    icon: 'CalendarDays',
  },

  CelebrationGift: {
    code: 'CelebrationGift',
    label: '節慶花禮',
    title: 'Celebration Gift',
    intro: '適合畢業、謝師、母親節與節日贈禮的訂製花束',
    icon: 'Gift',
  },
};

export const CATEGORY_TYPE_MAP = {
  Plant: {
    code: 'Plant',
    label: '植物植栽',
    icon: 'Leaf',
  },

  Tool: {
    code: 'Tool',
    label: '園藝工具',
    icon: 'Scissors',
  },

  Pottery: {
    code: 'Pottery',
    label: '花器盆器',
    icon: 'GlassWater',
  },

  Compost: {
    code: 'Compost',
    label: '養護堆肥',
    icon: 'Package',
  },

  Lifestyle: {
    code: 'Lifestyle',
    label: '生活選物',
    icon: 'Coffee',
  },

  FlowerGift: {
    code: 'FlowerGift',
    label: '花禮禮盒',
    icon: 'Flower2',
  },
};

export const CATEGORY_SPECIES_MAP = {
  Succulent: { code: 'Succulent', label: '多肉植物' },
  Cactus: { code: 'Cactus', label: '仙人掌植栽' },
  Foliage: { code: 'Foliage', label: '觀葉植物' },
  Fern: { code: 'Fern', label: '蕨類植栽' },
  Orchid: { code: 'Orchid', label: '蘭科植栽' },
  Monstera: { code: 'Monstera', label: '龜背葉植栽' },
  Hoya: { code: 'Hoya', label: '球蘭吊植' },
  ZZPlant: { code: 'ZZPlant', label: '雪鐵芋植栽' },

  WateringCan: { code: 'WateringCan', label: '澆水器具' },
  Pruner: { code: 'Pruner', label: '修枝工具' },
  PlantLamp: { code: 'PlantLamp', label: '補光燈具' },

  CeramicPot: { code: 'CeramicPot', label: '陶瓷花器' },
  GlassVase: { code: 'GlassVase', label: '玻璃花器' },

  OrganicSoil: { code: 'OrganicSoil', label: '有機培養土' },
  SlowReleaseFeed: { code: 'SlowReleaseFeed', label: '緩釋肥料' },

  PlantMug: { code: 'PlantMug', label: '植感杯器' },
  AquariumCoupon: { code: 'AquariumCoupon', label: '合作優惠券' },

  TulipGiftBox: { code: 'TulipGiftBox', label: '鬱金香球根禮盒' },
  GraduationBouquet: { code: 'GraduationBouquet', label: '畢業花禮' },
  TeacherBouquet: { code: 'TeacherBouquet', label: '謝師花束' },
  MotherDayBouquet: { code: 'MotherDayBouquet', label: '母親節花盒' },
  HolidayGiftBox: { code: 'HolidayGiftBox', label: '冬季植感禮盒' },
};

// ======================================================
// THEME_TYPE_RELATION_MAP
//
// ======================================================
export const THEME_TYPE_RELATION_MAP = {
  DeskLiving: ['Plant', 'Pottery', 'Lifestyle'],

  BalconyMood: ['Plant', 'Pottery'],

  SpaceStyling: ['Plant', 'Pottery', 'Lifestyle'],

  PlantCare: ['Tool', 'Compost', 'Pottery'],

  SeasonGift: ['FlowerGift'],

  CelebrationGift: ['FlowerGift'],
};

// ======================================================
// TYPE_SPECIES_RELATION_MAP
//
// ======================================================
export const TYPE_SPECIES_RELATION_MAP = {
  Plant: ['Succulent', 'Cactus', 'Foliage', 'Fern', 'Orchid', 'Monstera', 'Hoya', 'ZZPlant'],

  Tool: ['WateringCan', 'Pruner', 'PlantLamp'],

  Pottery: ['CeramicPot', 'GlassVase'],

  Compost: ['OrganicSoil', 'SlowReleaseFeed'],

  Lifestyle: ['PlantMug', 'AquariumCoupon'],

  FlowerGift: [
    'TulipGiftBox',
    'GraduationBouquet',
    'TeacherBouquet',
    'MotherDayBouquet',
    'HolidayGiftBox',
  ],
};

// ======================================================
// PRODUCT CONTENT TAGS：badge / filter / product highlights
// content 格式：Minimal|BeginnerFriendly|DeskCompanion
// ======================================================
export const PRIMARY_CONTENT_TAGS = [
  'Minimal',
  'BeginnerFriendly',
  'DeskCompanion',
  'WarmLight',
  'GiftChoice',
  'Nordic',
  'IndoorPlant',
  'Modern',
  'EasyCare',
  'Elegant',
  'Blooming',
  'Luxury',
];

// ======================================================
// PRODUCT CONTENT TAGS：badge / filter / product highlights
// content 格式：Minimal|BeginnerFriendly|DeskCompanion
// ======================================================
export const PRODUCT_CONTENT_MAP = {
  Minimal: { label: '極簡選品', badge: 'Minimal' },
  BeginnerFriendly: { label: '新手友善', badge: 'Easy Care' },
  DeskCompanion: { label: '桌邊陪伴', badge: 'Desk Pick' },
  WarmLight: { label: '暖調氛圍', badge: 'Warm Mood' },
  PetiteSize: { label: '小巧尺寸', badge: 'Petite' },
  GiftChoice: { label: '送禮推薦', badge: 'Gift Choice' },
  Nordic: { label: '北歐風格', badge: 'Nordic' },
  IndoorPlant: { label: '室內適合', badge: 'Indoor' },
  Modern: { label: '現代空間', badge: 'Modern' },
  LowLight: { label: '低光耐陰', badge: 'Low Light' },
  StatementPlant: { label: '空間主植', badge: 'Statement' },
  JapaneseStyle: { label: '日系侘寂', badge: 'Japanese' },
  WallDecor: { label: '牆面裝飾', badge: 'Wall Decor' },
  Elegant: { label: '優雅花型', badge: 'Elegant' },
  CalmTone: { label: '靜謐氛圍', badge: 'Calm Mood' },
  EasyCare: { label: '低維護', badge: 'Easy Care' },
  Blooming: { label: '開花觀賞', badge: 'Blooming' },
  SunLoving: { label: '喜陽植栽', badge: 'Sunny Spot' },
  Romantic: { label: '浪漫系', badge: 'Romantic' },
  OutdoorPlant: { label: '戶外適合', badge: 'Outdoor' },
  Seasonal: { label: '季節限定花期', badge: 'Seasonal' },
  AirPurify: { label: '空氣淨化', badge: 'Fresh Air' },
  Luxury: { label: '高級選物', badge: 'Luxury' },
  Handmade: { label: '手作質感', badge: 'Handmade' },
  IndoorUse: { label: '室內使用', badge: 'Indoor Use' },
  Practical: { label: '實用工具', badge: 'Practical' },
  GardenTool: { label: '園藝用品', badge: 'Garden Tool' },
  OrganicMix: { label: '天然有機', badge: 'Organic' },
  GrowthSupport: { label: '成長補給', badge: 'Growth Care' },
  LongLasting: { label: '長效養護', badge: 'Long Lasting' },
  CollabItem: { label: '聯名合作', badge: 'Collab' },
  LimitedEdition: { label: '限定款', badge: 'Limited' },
  Imported: { label: '海外引進', badge: 'Imported' },
  SpringOnly: { label: '春季限定', badge: 'Spring Only' },
  CustomOrder: { label: '客製預購', badge: 'Custom Order' },
  GraduationSeason: { label: '畢業季', badge: 'Graduation' },
  TeacherGift: { label: '謝師禮', badge: 'Teacher Gift' },
  MotherDay: { label: '母親節', badge: 'Mother Day' },
  HolidaySpecial: { label: '節慶限定', badge: 'Holiday' },
  PreOrder: { label: '預購商品', badge: 'Pre Order' },
};

// ======================================================
// PRODUCT DISPLAY TAGS MAP：
// 顯示該商品的亮相、販售狀態，用法(同時上首頁的熱銷商品、精選推薦的品項) displayTags: 'TopSeller|Featured'
// ======================================================
export const PRODUCT_DISPLAY_TAGS_MAP = {
  TopSeller: {
    label: '熱銷商品',
  },

  Featured: {
    label: '精選推薦',
  },

  SeasonalHot: {
    label: '當季熱門',
  },

  EditorPick: {
    label: '品牌選品',
  },

  Limited: {
    label: '限定推薦',
  },
};

// ======================================================
// PRODUCT UNIT TAGS：
// ======================================================
export const PRODUCT_UNIT_MAP = {
  PotSet: {
    label: '單盆植栽',
    value: '1 pot set',
  },

  DoublePot: {
    label: '雙盆組合',
    value: '2 pot set',
  },

  GlassTerrarium: {
    label: '玻璃植景',
    value: '1 glass terrarium',
  },

  HangingSet: {
    label: '吊掛植組',
    value: '1 hanging set',
  },

  BloomPot: {
    label: '開花盆栽',
    value: '1 bloom pot',
  },

  LargePot: {
    label: '大型盆栽',
    value: '1 large pot',
  },

  Piece: {
    label: '單件商品',
    value: '1 piece',
  },

  ToolSet: {
    label: '工具組',
    value: '1 set',
  },

  CeramicPot: {
    label: '陶瓷花器',
    value: '1 ceramic pot',
  },

  GlassVase: {
    label: '玻璃花器',
    value: '1 glass vase',
  },

  Bag: {
    label: '袋裝',
    value: '1 bag',
  },

  Pack: {
    label: '包裝',
    value: '1 pack',
  },

  Mug: {
    label: '杯器',
    value: '1 mug',
  },

  Voucher: {
    label: '優惠券',
    value: '1 voucher',
  },

  Bouquet: {
    label: '花束',
    value: '1 bouquet',
  },

  FlowerBox: {
    label: '花盒',
    value: '1 flower box',
  },

  GiftBox: {
    label: '禮盒',
    value: '1 gift box',
  },

  GiftSet: {
    label: '禮品組',
    value: '1 gift set',
  },
};

// ======================================================
// SECONDARY_CONTENT_TAGS
// ======================================================
export const SECONDARY_CONTENT_TAGS = Object.keys(PRODUCT_CONTENT_MAP).filter(
  (key) => !PRIMARY_CONTENT_TAGS.includes(key),
);

// ======================================================
// HELPERS
// ======================================================

// category => DeskLiving-Plant-Succulent
export const parseCategoryParts = (category = '') => {
  const [theme, type, species] = category.split('-');

  return {
    themeKey: theme,
    typeKey: type,
    speciesKey: species,
    theme: CATEGORY_THEME_MAP[theme] || null,
    type: CATEGORY_TYPE_MAP[type] || null,
    species: CATEGORY_SPECIES_MAP[species] || null,
  };
};

// content => Minimal|BeginnerFriendly|DeskCompanion
export const parseContentTags = (content = '') => {
  return content
    .split('|')
    .map((tag) => PRODUCT_CONTENT_MAP[tag])
    .filter(Boolean);
};
