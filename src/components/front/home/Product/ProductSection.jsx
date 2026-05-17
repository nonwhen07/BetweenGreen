import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// // components
// import SectionHeader from '@/components/front/home/Product/SectionHeader';
// import ProductSlider from '@/components/front/home/Product/ProductSlider';

import ProductCard from '@/components/front/home/Product/ProductCard';

const ProductSection = ({ topProducts }) => {
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
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default ProductSection;
