import { useEffect, useState } from 'react';

// services
import { getProducts } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';

// components
import HeroBanner from '@/components/front/home/HeroBanner';
import CategorySection from '@/components/front/home/Category/CategorySection';
import LifestyleSection from '@/components/front/home/Lifestyle/LifestyleSection';
import SceneShowcase from '@/components/front/home/SceneShowcase';
import SeasonalCollection from '@/components/front/home/Seasonal/SeasonalSection';
import ProductSection from '@/components/front/home/Product/ProductSection';
import GardenTipsSection from '@/components/front/home/GardenTips/GardenTipsSection';
import ReviewSection from '@/components/front/home/ReviewSection';
import NewsletterSection from '@/components/front/home/NewsletterSection';
import PageLoader from '@/components/PageLoader';
import BrandStory from '@/components/front/home/BrandStory';

// utils
import { handleApiError } from '@/utils/apiErrorHandler';

const HomePage = () => {
  const { showError } = useToast();
  const [topProducts, setTpProducts] = useState([]);
  // const [ProductCategory, setProductCategory] = useState([]);

  // 節慶前顯示
  const isSeasonActive = true; // 之後可以改 API

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // 取得商品列表
  const fetchProducts = async () => {
    setIsScreenLoading(true);
    try {
      const productData = await getProducts();

      // 取 top7 給ProductSection當作隨機熱銷商品
      const hotItems = productData
        .filter((item) => Number(item.is_enabled) === 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7);
      setTpProducts(hotItems);

      // 取 productData的 Category(必須 Number(item.is_enabled) === 1) 種類 給CategorySection使用(todo)
    } catch (error) {
      console.error(error);
      const errorMessage = handleApiError(error, null, '取得產品細項失敗');
      showError(errorMessage);
    } finally {
      setIsScreenLoading(false);
    }
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* 保留bootstarp-container，原因是我要用bootstarp他的排版 */}
      <HeroBanner />

      <CategorySection />
      <LifestyleSection />

      <SceneShowcase />

      {isSeasonActive && <SeasonalCollection />}

      <ProductSection topProducts={topProducts} />

      <BrandStory />

      <GardenTipsSection />

      <ReviewSection />

      <NewsletterSection />

      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default HomePage;
