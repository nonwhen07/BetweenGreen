import { useEffect, useMemo } from 'react';

import { useProducts } from '@/hooks/product/useProducts';
import {
  HOME_FEATURED_MIN,
  selectHomepageFeaturedProducts,
} from '@/utils/product/homeProductSelectors';

// components
import HeroBanner from '@/components/front/home/HeroBanner';
import LifestyleSection from '@/components/front/home/Lifestyle/LifestyleSection';
import SeasonalCollection from '@/components/front/home/Seasonal/SeasonalSection';
import ProductSection from '@/components/front/home/Product/ProductSection';
import GardenTipsSection from '@/components/front/home/GardenTips/GardenTipsSection';
import BrandStory from '@/components/front/home/BrandStory';
import TrustSection from '@/components/front/home/Trust/TrustSection';
import NewsletterSection from '@/components/front/home/Newsletter/NewsletterSection';

const HomePage = () => {
  const { products, fetchProducts } = useProducts();

  const featuredProducts = useMemo(() => selectHomepageFeaturedProducts(products), [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (
      import.meta.env.DEV &&
      products.length > 0 &&
      featuredProducts.length < HOME_FEATURED_MIN
    ) {
      console.warn(
        `[Homepage Featured] 啟用中的 Featured 商品只有 ${featuredProducts.length} 筆，建議至少補到 ${HOME_FEATURED_MIN} 筆。`,
      );
    }
  }, [featuredProducts.length, products.length]);

  return (
    <div className="home-page">
      <HeroBanner />
      <LifestyleSection />
      <BrandStory />
      <ProductSection featuredProducts={featuredProducts} />
      <SeasonalCollection products={products} />
      <GardenTipsSection />
      <TrustSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
