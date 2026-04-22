import { useEffect, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { useProducts } from '@/hooks/product/useProducts';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// components
import HeroBanner from '@/components/front/home/HeroBanner';
// import CategorySection from '@/components/front/home/Category/CategorySection';
import LifestyleSection from '@/components/front/home/Lifestyle/LifestyleSection';
import SceneShowcase from '@/components/front/home/SceneShowcase';
import SeasonalCollection from '@/components/front/home/Seasonal/SeasonalSection';
import ProductSection from '@/components/front/home/Product/ProductSection';
import GardenTipsSection from '@/components/front/home/GardenTips/GardenTipsSection';
import ReviewSection from '@/components/front/home/ReviewSection';
import NewsletterSection from '@/components/front/home/NewsletterSection';
import PageLoader from '@/components/shared/PageLoader';
import BrandStory from '@/components/front/home/BrandStory';

const HomePage = () => {
  const { products, isLoading, fetchProducts } = useProducts({ isAdmin: false });
  const { showError } = useToast();
  const [topProducts, setTpProducts] = useState([]);
  // const [ProductCategory, setProductCategory] = useState([]);

  // 節慶前顯示
  const isSeasonActive = true; // 之後可以改 API

  // const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 取得商品列表
  const initProducts = async () => {
    try {
      // const productData = await getProducts();
      // 取 top7 給ProductSection當作隨機熱銷商品
      // const hotItems = productData
      //   .filter((item) => Number(item.is_enabled) === 1)
      //   .sort(() => Math.random() - 0.5)
      //   .slice(0, 7);
      // setTpProducts(hotItems);

      // 可視情況帶入參數
      await fetchProducts({});

      // 取 top7 給ProductSection當作隨機熱銷商品
      const hotItems = products
        .filter((item) => Number(item.is_enabled) === 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7);

      setTpProducts(hotItems);

      // 取 productData的 Category(必須 Number(item.is_enabled) === 1) 種類 給CategorySection使用(todo)
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '取得產品列表失敗，請稍後再試。');
      showError(errorMessage);
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
      {/* 保留bootstarp-container，原因是我要用bootstarp他的排版 */}
      <HeroBanner />

      {/* <CategorySection /> */}
      <LifestyleSection />

      <SceneShowcase />

      {isSeasonActive && <SeasonalCollection />}

      <ProductSection topProducts={topProducts} />

      <BrandStory />

      <GardenTipsSection />

      <ReviewSection />

      <NewsletterSection />

      {/* ScreenLoading */}
      <PageLoader show={isLoading} zIndex={2000} />
    </>
  );
};

export default HomePage;
