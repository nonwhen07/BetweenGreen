import { useEffect, useMemo } from 'react';

import { useProducts } from '@/hooks/product/useProducts';

// components
import HeroBanner from '@/components/front/home/HeroBanner';
// import CategorySection from '@/components/front/home/Category/CategorySection';
import LifestyleSection from '@/components/front/home/Lifestyle/LifestyleSection';
import SeasonalCollection from '@/components/front/home/Seasonal/SeasonalSection';
import ProductSection from '@/components/front/home/Product/ProductSection';
import GardenTipsSection from '@/components/front/home/GardenTips/GardenTipsSection';
import BrandStory from '@/components/front/home/BrandStory';

const HomePage = () => {
  const { products, fetchProducts } = useProducts({ isAdmin: false });

  // 節慶前顯示
  const isSeasonActive = true; // 之後可以改 API

  const topProducts = useMemo(
    () => products.filter((item) => Number(item.is_enabled) === 1).slice(0, 7),
    [products],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="home-page">
      <HeroBanner />
      <LifestyleSection />
      <BrandStory />
      <ProductSection topProducts={topProducts} />
      {isSeasonActive && <SeasonalCollection products={products} />}
      <GardenTipsSection />
    </div>
  );
};

export default HomePage;
