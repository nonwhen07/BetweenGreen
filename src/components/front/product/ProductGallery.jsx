import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// assets
import NO_IMAGE from '@/assets/images/no-image.png';

// utils
import { buildProductGalleryImages } from '@/utils/product/productGallery';

const ProductGallery = ({ currentProduct }) => {
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const allImages = useMemo(() => {
    const galleryImages = buildProductGalleryImages(currentProduct);

    if (galleryImages.length === 0) {
      galleryImages.push(NO_IMAGE);
    }

    return galleryImages;
  }, [currentProduct]);

  return (
    <div className="product-gallery">
      {/* 主圖 */}
      <div className="product-gallery__main">
        <Swiper
          modules={[A11y, Navigation, Thumbs]}
          navigation={{
            prevEl: '.product-gallery__prev',
            nextEl: '.product-gallery__next',
          }}
          spaceBetween={12}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSwiper={setMainSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="product-gallery__main-swiper"
        >
          {allImages.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div className="product-gallery__image">
                <img
                  src={imgUrl && imgUrl.trim() !== '' ? imgUrl : NO_IMAGE}
                  alt={`${currentProduct?.title} - ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = NO_IMAGE;
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery__nav product-gallery__prev"
              aria-label="上一張商品圖片"
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </button>

            <button
              type="button"
              className="product-gallery__nav product-gallery__next"
              aria-label="下一張商品圖片"
            >
              <ChevronRight size={24} strokeWidth={2} />
            </button>

            <span className="product-gallery__counter" aria-live="polite">
              {activeIndex + 1} / {allImages.length}
            </span>
          </>
        )}
      </div>

      {/* 縮圖 */}
      {allImages.length > 1 && <div className="product-gallery__thumbs">
        <Swiper
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          slidesPerView={4}
          spaceBetween={12}
          className="product-gallery__thumb-swiper"
        >
          {allImages.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <button
                type="button"
                className={`product-gallery__thumb ${activeIndex === index ? 'is-active' : ''}`}
                aria-label={`查看第 ${index + 1} 張商品圖片`}
                aria-pressed={activeIndex === index}
                onClick={() => mainSwiper?.slideTo(index)}
              >
                <img
                  src={imgUrl && imgUrl.trim() !== '' ? imgUrl : NO_IMAGE}
                  alt={`${currentProduct?.title || '商品'}縮圖 ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = NO_IMAGE;
                  }}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>}
    </div>
  );
};

export default ProductGallery;
