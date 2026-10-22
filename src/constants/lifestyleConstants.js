import { SITE_ASSETS } from '@/constants/siteAssets';

// 兩頁共用主題、圖片及目的地，保留各自的文案長度與卡片版型。
export const LIFESTYLE_ITEMS = [
  {
    id: 'desk-companion',
    number: '01',
    title: '書桌陪伴',
    subtitle: 'Desk Companion',
    description: '為工作、閱讀與獨處時光，留下一點安靜綠意。',
    aboutDescription: '讓日常多一點安靜與專注',
    imageAsset: SITE_ASSETS.lifestyleDesk,
    imageAlt: '書桌與植栽搭配的生活場景',
    link: '/products?theme=DeskLiving',
    tag: '日常療癒',
  },
  {
    id: 'space-styling',
    number: '02',
    title: '空間造景',
    subtitle: 'Space Styling',
    description: '從店內到戶外角落，讓植物成為空間氛圍的一部分。',
    aboutDescription: '為空間創造屬於你的氛圍',
    imageAsset: SITE_ASSETS.lifestyleSpace,
    imageAlt: '室內空間與植栽搭配的生活場景',
    link: '/products?theme=SpaceStyling',
    tag: '氛圍設計',
  },
  {
    id: 'balcony-living',
    number: '03',
    title: '陽台生活',
    subtitle: 'Balcony Living',
    description: '在城市裡，保留一個能慢慢呼吸的自然角落。',
    aboutDescription: '在城市裡保留一點自然',
    imageAsset: SITE_ASSETS.lifestyleBalcony,
    imageAlt: '陽台與植栽搭配的生活場景',
    link: '/products?theme=BalconyMood',
    tag: '都市植培',
  },
];
