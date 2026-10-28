import productsHero from '@/assets/images/site-assets/banners/products/products-hero.png';
import articlesHero from '@/assets/images/site-assets/banners/articles/articles-hero.png';
import ordersHero from '@/assets/images/site-assets/banners/customer-orders/customer-orders-hero.png';
import homeHeroMain from '@/assets/images/site-assets/banners/home/hero-main.png';
import homeHeroDesk from '@/assets/images/site-assets/banners/home/hero-desk.png';
import homeHeroSpace from '@/assets/images/site-assets/banners/home/hero-space.png';
import homeHeroBalcony from '@/assets/images/site-assets/banners/home/hero-balcony.png';
import aboutHero from '@/assets/images/site-assets/banners/about/hero-about.png';
import homeBrandStory from '@/assets/images/site-assets/branding/home/story-desk.png';
import storySlowDown from '@/assets/images/site-assets/branding/about/story-slow-down.png';
import storyGrowTogether from '@/assets/images/site-assets/branding/about/story-grow-together.png';
import endingGreenCorner from '@/assets/images/site-assets/branding/about/ending-green-corner.png';
import lifestyleDesk from '@/assets/images/site-assets/branding/lifestyle/desk.png';
import lifestyleSpace from '@/assets/images/site-assets/branding/lifestyle/space.png';
import lifestyleBalcony from '@/assets/images/site-assets/branding/lifestyle/balcony.png';

// 未設定時沿用現有 ImageKit；移除結尾斜線，避免拼接出雙斜線。
const primaryOrigin = (
  import.meta.env.VITE_SITE_ASSET_PRIMARY_ORIGIN?.trim() || 'https://ik.imagekit.io/linassets'
).replace(/\/+$/, '');

export const SITE_ASSET_BASE_URL = `${primaryOrigin}/between-green/site-assets`;

// 同路徑更新圖片時只改這個版本號，讓瀏覽器重新取得整批網站素材。
// 同一天再次更新可遞增尾碼；Product／Article 的 API 圖片不受影響。
export const SITE_ASSET_VERSION = '20261028-01';

const siteAsset = (relativePath, fallbackSrc) =>
  Object.freeze({
    src: `${SITE_ASSET_BASE_URL}/${relativePath}?v=${encodeURIComponent(SITE_ASSET_VERSION)}`,
    fallbackSrc,
  });

// 網站情境素材使用 CDN＋本地備援；Product／Article 圖片仍由 API 欄位提供。
export const SITE_ASSETS = Object.freeze({
  productsHero: siteAsset('banners/products/products-hero.png', productsHero),
  articlesHero: siteAsset('banners/articles/articles-hero.png', articlesHero),
  ordersHero: siteAsset('banners/customer-orders/customer-orders-hero.png', ordersHero),
  homeHeroMain: siteAsset('banners/home/hero-main.png', homeHeroMain),
  homeHeroDesk: siteAsset('banners/home/hero-desk.png', homeHeroDesk),
  homeHeroSpace: siteAsset('banners/home/hero-space.png', homeHeroSpace),
  homeHeroBalcony: siteAsset('banners/home/hero-balcony.png', homeHeroBalcony),
  aboutHero: siteAsset('banners/about/hero-about.png', aboutHero),
  homeBrandStory: siteAsset('branding/home/story-desk.png', homeBrandStory),
  aboutStorySlowDown: siteAsset('branding/about/story-slow-down.png', storySlowDown),
  aboutStoryGrowTogether: siteAsset('branding/about/story-grow-together.png', storyGrowTogether),
  aboutEndingGreenCorner: siteAsset('branding/about/ending-green-corner.png', endingGreenCorner),
  lifestyleDesk: siteAsset('branding/lifestyle/desk.png', lifestyleDesk),
  lifestyleSpace: siteAsset('branding/lifestyle/space.png', lifestyleSpace),
  lifestyleBalcony: siteAsset('branding/lifestyle/balcony.png', lifestyleBalcony),
});
