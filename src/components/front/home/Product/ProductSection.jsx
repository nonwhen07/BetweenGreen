import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// hooks
import { useAddToCart } from '@/hooks/cart/useAddToCart';
// components
import ProductCard from '@/components/shared/ProductCard';

const ProductSection = ({ topProducts }) => {
  const { loadingItems, handleAddCartItem } = useAddToCart();
  const [progress, setProgress] = useState(0.2);

  return (
    <>
      <section id="product" className="ui-section product-section">
        <div className="container ui-container">
          <div className="product-section__header">
            <div className="product-section__intro">
              <p className="product-section__eyebrow">Between Green Selection</p>

              <h2 className="product-section__title">精選植感選物</h2>
            </div>

            <Link to="/products" className="product-section__more">
              View All
            </Link>
          </div>

          <Swiper
            className="product-section__swiper"
            onSlideChange={(swiper) => {
              const totalSlides = swiper.slides.length;
              const slidesPerView = Number(swiper.params.slidesPerView);
              const currentIndex = swiper.realIndex;
              const maxScrollableIndex = totalSlides - slidesPerView;
              // progress track 可移動距離
              const maxTranslate = 240 - 72;

              const progress = (currentIndex / maxScrollableIndex) * maxTranslate;

              setProgress(progress);
            }}
            modules={[Pagination, Navigation, Autoplay]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            slidesPerView={1.15}
            breakpoints={{
              576: {
                slidesPerView: 1.15,
              },
              768: {
                slidesPerView: 2.4,
              },
              1200: {
                slidesPerView: 3.4,
              },
            }}
          >
            {topProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={product}
                  variant="compact"
                  onAddCart={handleAddCartItem}
                  loading={loadingItems[product.id]}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="product-section__progress">
            <div
              className="product-section__progress-bar"
              style={{
                // transform: `scaleX(${progress / 100})`,
                transform: `translateX(${progress}px)`,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductSection;
