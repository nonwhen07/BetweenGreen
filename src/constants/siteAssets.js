import storySlowDown from '@/assets/images/site-assets/branding/about/story-slow-down.png';
import storyGrowTogether from '@/assets/images/site-assets/branding/about/story-grow-together.png';
import endingGreenCorner from '@/assets/images/site-assets/branding/about/ending-green-corner.png';
import lifestyleDesk from '@/assets/images/site-assets/branding/lifestyle/desk.png';
import lifestyleSpace from '@/assets/images/site-assets/branding/lifestyle/space.png';
import lifestyleBalcony from '@/assets/images/site-assets/branding/lifestyle/balcony.png';

export const SITE_ASSET_BASE_URL =
  'https://ik.imagekit.io/linassets/between-green/site-assets';

const siteAsset = (relativePath, fallbackSrc) => Object.freeze({
  src: `${SITE_ASSET_BASE_URL}/${relativePath}`,
  fallbackSrc,
});

// 網站情境素材使用 CDN＋本地備援；Product／Article 圖片仍由 API 欄位提供。
export const SITE_ASSETS = Object.freeze({
  aboutStorySlowDown: siteAsset('branding/about/story-slow-down.png', storySlowDown),
  aboutStoryGrowTogether: siteAsset('branding/about/story-grow-together.png', storyGrowTogether),
  aboutEndingGreenCorner: siteAsset('branding/about/ending-green-corner.png', endingGreenCorner),
  lifestyleDesk: siteAsset('branding/lifestyle/desk.png', lifestyleDesk),
  lifestyleSpace: siteAsset('branding/lifestyle/space.png', lifestyleSpace),
  lifestyleBalcony: siteAsset('branding/lifestyle/balcony.png', lifestyleBalcony),
});
