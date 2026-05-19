import { useEffect, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { useProducts } from '@/hooks/product/useProducts';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// components
import HeroBanner from '@/components/front/home/HeroBanner';
// import CategorySection from '@/components/front/home/Category/CategorySection';
import LifestyleSection from '@/components/front/home/Lifestyle/LifestyleSection';
import SeasonalCollection from '@/components/front/home/Seasonal/SeasonalSection';
import ProductSection from '@/components/front/home/Product/ProductSection';
import GardenTipsSection from '@/components/front/home/GardenTips/GardenTipsSection';
import ReviewSection from '@/components/front/home/ReviewSection';
import NewsletterSection from '@/components/front/home/NewsletterSection';
// import PageLoader from '@/components/shared/PageLoader';
import BrandStory from '@/components/front/home/BrandStory';

const HomePage = () => {
  const { products, fetchProducts } = useProducts({ isAdmin: false });
  const { showError } = useToast();
  const { start, stop } = useLoading();
  const [topProducts, setTpProducts] = useState([]);
  // const [ProductCategory, setProductCategory] = useState([]);

  // 節慶前顯示
  const isSeasonActive = true; // 之後可以改 API

  // const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 取得商品列表
  const initProducts = async () => {
    start();

    try {
      await fetchProducts({});
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '取得產品列表失敗，請稍後再試。');

      showError(errorMessage);
    } finally {
      stop();
    }
  };

  // 用 useEffect 監聽 products，避免fetchProducts 更新 state，但 state 不會立刻變
  useEffect(() => {
    if (!products.length) return;
    const hotItems = products
      .filter((item) => Number(item.is_enabled) === 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, 7);
    setTpProducts(hotItems);
  }, [products]);

  useEffect(() => {
    initProducts();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      {/* --- 品牌敘事 --- */}
      <HeroBanner />
      {/* lifestyle: [ 'DeskLiving', 'BalconyMood', 'SpaceStyling', ], */}
      <LifestyleSection />
      <BrandStory />
      {/* --- 商品 --- */}
      {/* ProductSection: [ 'CelebrationGift', 'Top20' ], */}
      <ProductSection topProducts={topProducts} />
      {/* --- 季節限定/季節活動 --- */}
      {/* seasonal: [ 'SeasonGift', 'CelebrationGift', ], */}
      {isSeasonActive && <SeasonalCollection />}
      {/* --- 互動信任 --- */}
      <GardenTipsSection />
      {/* 
      <ReviewSection />
      <NewsletterSection /> */}
      {/* ScreenLoading */}
      {/* <PageLoader show={isLoading} zIndex={2000} /> */}
    </>
  );
};

export default HomePage;
