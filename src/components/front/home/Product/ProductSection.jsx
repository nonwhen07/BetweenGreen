import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// hooks
import { useAddToCart } from '@/hooks/cart/useAddToCart';
// components
import ProductCard from '@/components/shared/ProductCard';

const ProductSection = ({ topProducts }) => {
  const { loadingItems, handleAddCartItem } = useAddToCart();
  const [progress, setProgress] = useState(0);

  const updateProgress = (swiper) => {
    const totalSlides = swiper.slides.length;
    const slidesPerView = Math.ceil(Number(swiper.params.slidesPerView) || 1);

    if (!totalSlides) {
      setProgress(0);
      return;
    }

    setProgress(Math.min((swiper.realIndex + slidesPerView) / totalSlides, 1));
  };

  if (topProducts.length === 0) return null;

  return (
    <section
      id="product"
      className="ui-section product-section"
      aria-labelledby="product-section-title"
    >
      <div className="ui-container">
        <div className="product-section__header">
          <div className="product-section__intro">
            <p className="product-section__eyebrow">Between Green Selection</p>

            <h2 id="product-section-title" className="product-section__title">
              精選植感選物
            </h2>
          </div>

          <Link to="/products" className="product-section__more">
            View All
          </Link>
        </div>

        <Swiper
          className="product-section__swiper"
          onSwiper={updateProgress}
          onSlideChange={updateProgress}
          onResize={updateProgress}
          modules={[Autoplay]}
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
            1296: {
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
              transform: `scaleX(${progress})`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
