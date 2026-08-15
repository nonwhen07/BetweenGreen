// productModal 資料狀態的預設值
// 六角API可彈性新增欄位（例如 rating）
// 確保即使 API 回傳產品物件中沒有某些欄位，tempProduct 也不會報錯
export const DEFAULT_PRODUCT = {
  imageUrl: '',
  title: '',
  titleEn: '', // 商品英文標題
  // slug: '', // 商品轉址slug(替代id查詢)
  category: '', // 商品種類
  content: '', // 商品詳細內容（規格、材質、尺寸）
  unit: '',
  origin_price: '',
  price: '',
  description: '', // 商品敘事文案
  is_enabled: 0,
  imagesUrl: [''],

  // 新增欄位
  // 星數
  rating: 0,
  personalityTags: '', // 商品人格標籤
  // 商業展示資訊  {/* display tag (負責處理熱銷、促銷庫存...商業處理標籤，後台欄位+實際運作邏輯 尚未開工) */}
  displayTags: '',
};

// ======================================================
// CATEGORY： THEME > TYPE > SPECIES
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

  GiftBox: {
    code: 'GiftBox',
    label: '品牌禮盒',
    icon: 'Gift',
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
  AirPlant: { code: 'AirPlant', label: '空氣鳳梨' },
  Herb: { code: 'Herb', label: '香草植栽' },

  // =========================
  // Tool
  // =========================
  WateringCan: { code: 'WateringCan', label: '澆水器具' },
  Pruner: { code: 'Pruner', label: '修枝工具' },
  PlantLamp: { code: 'PlantLamp', label: '補光燈具' },
  Mister: {
    code: 'Mister',
    label: '植栽噴霧器',
  },

  MoistureMeter: {
    code: 'MoistureMeter',
    label: '土壤濕度計',
  },

  PlantBrush: {
    code: 'PlantBrush',
    label: '葉片清潔刷',
  },

  // =========================
  // Pottery
  // =========================
  CeramicPot: { code: 'CeramicPot', label: '陶瓷花器' },
  GlassVase: { code: 'GlassVase', label: '玻璃花器' },
  HangingPlanter: {
    code: 'HangingPlanter',
    label: '吊掛盆器',
  },

  StonePlanter: {
    code: 'StonePlanter',
    label: '石紋花器',
  },

  SelfWateringPot: {
    code: 'SelfWateringPot',
    label: '自動吸水盆',
  },

  // =========================
  // Compost
  // =========================
  OrganicSoil: { code: 'OrganicSoil', label: '有機培養土' },
  SlowReleaseFeed: { code: 'SlowReleaseFeed', label: '緩釋肥料' },
  SoilMix: {
    code: 'SoilMix',
    label: '植栽介質土',
  },

  LiquidFeed: {
    code: 'LiquidFeed',
    label: '液態肥料',
  },

  // =========================
  // Lifestyle
  // =========================
  PlantMug: { code: 'PlantMug', label: '植感杯器' },
  AquariumCoupon: { code: 'AquariumCoupon', label: '合作優惠券' },
  DisplayTray: {
    code: 'DisplayTray',
    label: '植景展示托盤',
  },

  ScentCandle: {
    code: 'ScentCandle',
    label: '植感香氛蠟燭',
  },

  TableLamp: {
    code: 'TableLamp',
    label: '植感桌燈',
  },

  PlantShelf: {
    code: 'PlantShelf',
    label: '植栽展示層架',
  },

  PlantJournal: {
    code: 'PlantJournal',
    label: '植栽成長日誌',
  },

  CareCard: {
    code: 'CareCard',
    label: '新手照護指南卡',
  },

  PlantMarker: {
    code: 'PlantMarker',
    label: '植物識別標籤',
  },

  // =========================
  // FlowerGift
  // =========================
  GraduationBouquet: { code: 'GraduationBouquet', label: '畢業花禮' },
  TeacherBouquet: { code: 'TeacherBouquet', label: '謝師花束' },
  MotherDayFlowerBox: { code: 'MotherDayFlowerBox', label: '母親節花盒' },
  // HolidayGiftBox: { code: 'HolidayGiftBox', label: '冬季植感禮盒' },
  OpeningFlower: {
    code: 'OpeningFlower',
    label: '開幕誌慶花禮',
  },

  NewHomeGift: {
    code: 'NewHomeGift',
    label: '新居祝賀植禮',
  },

  // =========================
  // GiftBox (之後再把剩餘精品禮盒補進去)
  // =========================
  // TulipGiftBox: { code: 'TulipGiftBox', label: '鬱金香球根禮盒' },
  SpringGiftBox: {
    code: 'SpringGiftBox',
    label: '春日植感禮盒',
  },

  SummerGiftBox: {
    code: 'SummerGiftBox',
    label: '夏日綠境禮盒',
  },

  AutumnGiftBox: {
    code: 'AutumnGiftBox',
    label: '秋光植語禮盒',
  },

  WinterGiftBox: {
    code: 'WinterGiftBox',
    label: '冬暮植感禮盒',
  },

  SignatureGiftBox: {
    code: 'SignatureGiftBox',
    label: '品牌經典禮盒',
  },

  MemoryKit: {
    code: 'MemoryKit',
    label: '紀念植栽禮盒',
  },
};

// ======================================================
// THEME_TYPE_RELATION_MAP
//
// ======================================================
export const THEME_TYPE_RELATION_MAP = {
  DeskLiving: ['Plant', 'Pottery', 'Lifestyle'],

  BalconyMood: ['Plant', 'Pottery'],

  SpaceStyling: ['Plant', 'Pottery', 'Lifestyle'],

  PlantCare: ['Tool', 'Compost', 'Pottery', 'Lifestyle'],

  SeasonGift: ['GiftBox'],

  CelebrationGift: ['FlowerGift'],
};

// ======================================================
// TYPE_SPECIES_RELATION_MAP
//
// ======================================================
export const TYPE_SPECIES_RELATION_MAP = {
  Plant: [
    'Succulent',
    'Cactus',
    'Foliage',
    'Fern',
    'Orchid',
    'Monstera',
    'Hoya',
    'ZZPlant',
    'AirPlant',
    'Herb',
  ],

  Tool: ['WateringCan', 'Mister', 'MoistureMeter', 'Pruner', 'PlantBrush', 'PlantLamp'],

  Pottery: ['CeramicPot', 'GlassVase', 'HangingPlanter', 'StonePlanter', 'SelfWateringPot'],

  Compost: ['OrganicSoil', 'SoilMix', 'SlowReleaseFeed', 'LiquidFeed'],

  Lifestyle: [
    'PlantMug',
    'DisplayTray',
    'ScentCandle',
    'TableLamp',
    'PlantShelf',
    'AquariumCoupon',
    'PlantJournal',
    'CareCard',
    'PlantMarker',
  ],

  FlowerGift: [
    'GraduationBouquet',
    'TeacherBouquet',
    'MotherDayFlowerBox',
    'OpeningFlower',
    'NewHomeGift',
  ],

  // GiftBox: ['TulipGiftBox'],
  GiftBox: [
    'SpringGiftBox',
    'SummerGiftBox',
    'AutumnGiftBox',
    'WinterGiftBox',
    'SignatureGiftBox',
    'MemoryKit',
  ],
};

// ======================================================
// PRODUCT CONTENT TAGS：badge / filter / product highlights
// content 格式：Minimal|BeginnerFriendly|DeskCompanion
// ======================================================
export const PRIMARY_PERSONALITY_TAGS = [
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
// PRODUCT PERSONALITY TAGS：badge / filter / product highlights
// content 格式：Minimal|BeginnerFriendly|DeskCompanion
// ======================================================
export const PRODUCT_PERSONALITY_MAP = {
  // ======================================================
  // STYLE
  // ======================================================
  Minimal: {
    label: '極簡選品',
    badge: 'Minimal',
    group: 'style',
  },

  Nordic: {
    label: '北歐風格',
    badge: 'Nordic',
    group: 'style',
  },

  Modern: {
    label: '現代空間',
    badge: 'Modern',
    group: 'style',
  },

  JapaneseStyle: {
    label: '日系侘寂',
    badge: 'Japanese',
    group: 'style',
  },

  Elegant: {
    label: '優雅花型',
    badge: 'Elegant',
    group: 'style',
  },

  Romantic: {
    label: '浪漫系',
    badge: 'Romantic',
    group: 'style',
  },

  CalmTone: {
    label: '靜謐氛圍',
    badge: 'Calm Mood',
    group: 'style',
  },

  Luxury: {
    label: '高級選物',
    badge: 'Luxury',
    group: 'style',
  },

  Cozy: {
    label: '溫暖居家',
    badge: 'Cozy',
    group: 'style',
  },

  Creative: {
    label: '創意靈感',
    badge: 'Creative',
    group: 'style',
  },

  Mindful: {
    label: '療癒放鬆',
    badge: 'Mindful',
    group: 'style',
  },

  // ======================================================
  // CARE
  // ======================================================
  BeginnerFriendly: {
    label: '新手友善',
    badge: 'Easy Care',
    group: 'care',
  },

  EasyCare: {
    label: '低維護',
    badge: 'Easy Care',
    group: 'care',
  },

  LowLight: {
    label: '低光耐陰',
    badge: 'Low Light',
    group: 'care',
  },

  AirPurify: {
    label: '空氣淨化',
    badge: 'Fresh Air',
    group: 'care',
  },

  GrowthSupport: {
    label: '成長補給',
    badge: 'Growth Care',
    group: 'care',
  },

  LongLasting: {
    label: '長效養護',
    badge: 'Long Lasting',
    group: 'care',
  },

  SunLoving: {
    label: '喜陽植栽',
    badge: 'Sunny Spot',
    group: 'care',
  },

  Blooming: {
    label: '開花觀賞',
    badge: 'Blooming',
    group: 'care',
  },

  // ======================================================
  // SCENE
  // ======================================================
  DeskCompanion: {
    label: '桌邊陪伴',
    badge: 'Desk Pick',
    group: 'scene',
  },

  StatementPlant: {
    label: '空間主植',
    badge: 'Statement',
    group: 'scene',
  },

  WallDecor: {
    label: '牆面裝飾',
    badge: 'Wall Decor',
    group: 'scene',
  },

  IndoorPlant: {
    label: '室內適合',
    badge: 'Indoor',
    group: 'scene',
  },

  OutdoorPlant: {
    label: '戶外適合',
    badge: 'Outdoor',
    group: 'scene',
  },

  WarmLight: {
    label: '暖調氛圍',
    badge: 'Warm Mood',
    group: 'scene',
  },

  IndoorUse: {
    label: '室內使用',
    badge: 'Indoor Use',
    group: 'scene',
  },

  // ======================================================
  // GIFT
  // ======================================================
  GiftChoice: {
    label: '送禮推薦',
    badge: 'Gift Choice',
    group: 'gift',
  },

  // ======================================================
  // ATTRIBUTE
  // ======================================================
  Practical: {
    label: '實用工具',
    badge: 'Practical',
    group: 'attribute',
  },

  Handmade: {
    label: '手作質感',
    badge: 'Handmade',
    group: 'attribute',
  },

  PetiteSize: {
    label: '小巧尺寸',
    badge: 'Petite',
    group: 'attribute',
  },
};

// ======================================================
// PRODUCT DISPLAY TAGS MAP：
// 顯示該商品的亮相、販售狀態，用法(同時上首頁的熱銷商品、精選推薦的品項) displayTags: 'TopSeller|Featured'
// ======================================================
export const PRODUCT_DISPLAY_TAGS_MAP = {
  TopSeller: {
    label: '熱銷商品',
    badge: '熱銷',
    type: 'commerce',
  },

  Featured: {
    label: '精選推薦',
    badge: '精選',
    type: 'curation',
  },

  NewArrival: {
    label: '新品上市',
    badge: '新品',
    type: 'commerce',
  },

  Limited: {
    label: '限定推薦',
    badge: '限定',
    type: 'commerce',
  },

  SeasonalHot: {
    label: '當季熱門',
    badge: '當季',
    type: 'seasonal',
  },

  EditorPick: {
    label: '品牌選品',
    badge: '選品',
    type: 'curation',
  },

  OnSale: {
    label: '優惠販售',
    badge: '優惠',
    type: 'promotion',
  },

  PreOrder: {
    label: '預購商品',
    badge: '預購',
    type: 'status',
  },

  CustomOrder: {
    label: '客製訂購',
    badge: '客製',
    type: 'service',
  },
};

// ======================================================
// PRODUCT UNIT TAGS：
// ======================================================
export const PRODUCT_UNIT_MAP = {
  // =========================
  // 植栽與植栽組合
  // =========================

  PotSet: {
    label: '單盆植栽',
    shortLabel: '盆',
    value: '1 pot set',
  },

  DoublePot: {
    label: '雙盆組合',
    shortLabel: '組',
    value: '2 pot set',
  },

  BloomPot: {
    label: '開花盆栽',
    shortLabel: '盆',
    value: '1 bloom pot',
  },

  LargePot: {
    label: '大型盆栽',
    shortLabel: '盆',
    value: '1 large pot',
  },

  HangingSet: {
    label: '吊掛植組',
    shortLabel: '組',
    value: '1 hanging set',
  },

  DisplayStandSet: {
    label: '桌上展示植組',
    shortLabel: '組',
    value: '1 display stand set',
  },

  GlassTerrarium: {
    label: '玻璃植景',
    shortLabel: '座',
    value: '1 glass terrarium',
  },

  // =========================
  // 花器與容器
  // =========================

  CeramicPot: {
    label: '陶瓷花器',
    shortLabel: '個',
    value: '1 ceramic pot',
  },

  GlassVase: {
    label: '玻璃花器',
    shortLabel: '個',
    value: '1 glass vase',
  },

  // =========================
  // 植物照護與消耗用品
  // =========================

  ToolSet: {
    label: '工具組',
    shortLabel: '組',
    value: '1 set',
  },

  Bag: {
    label: '袋裝',
    shortLabel: '袋',
    value: '1 bag',
  },

  Pack: {
    label: '包裝',
    shortLabel: '包',
    value: '1 pack',
  },

  Bottle: {
    label: '瓶裝商品',
    shortLabel: '瓶',
    value: '1 bottle',
  },

  PlantLabelSet: {
    label: '植物標籤組',
    shortLabel: '組',
    value: '1 plant label set',
  },

  CardSet: {
    label: '卡片組',
    shortLabel: '組',
    value: '1 card set',
  },

  // =========================
  // 日常生活選物
  // =========================

  Mug: {
    label: '杯器',
    shortLabel: '個',
    value: '1 mug',
  },

  Voucher: {
    label: '優惠券',
    shortLabel: '張',
    value: '1 voucher',
  },

  Piece: {
    label: '單件商品',
    shortLabel: '件',
    value: '1 piece',
  },

  // =========================
  // 花禮與禮品
  // =========================

  Bouquet: {
    label: '花束',
    shortLabel: '束',
    value: '1 bouquet',
  },

  FlowerBox: {
    label: '花盒',
    shortLabel: '盒',
    value: '1 flower box',
  },

  FloralGift: {
    label: '客製花禮',
    shortLabel: '份',
    value: '1 floral gift',
  },

  GiftBox: {
    label: '禮盒',
    shortLabel: '盒',
    value: '1 gift box',
  },

  GiftSet: {
    label: '禮品組',
    shortLabel: '組',
    value: '1 gift set',
  },
};

// ======================================================
// SECONDARY_PERSONALITY_TAGS
// ======================================================
export const SECONDARY_PERSONALITY_TAGS = Object.keys(PRODUCT_PERSONALITY_MAP).filter(
  (key) => !PRIMARY_PERSONALITY_TAGS.includes(key),
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
export const parsePersonalityTags = (content = '') => {
  return content
    .split('|')
    .map((tag) => PRODUCT_PERSONALITY_MAP[tag])
    .filter(Boolean);
};
