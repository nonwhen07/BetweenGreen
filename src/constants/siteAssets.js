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

const siteAsset = (relativePath, fallbackSrc) =>
  Object.freeze({
    src: `${SITE_ASSET_BASE_URL}/${relativePath}`,
    fallbackSrc,
  });

// 網站情境素材使用 CDN＋本地備援；Product／Article 圖片仍由 API 欄位提供。
export const SITE_ASSETS = Object.freeze({
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
