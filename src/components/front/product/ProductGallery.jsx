import { useState, useMemo } from 'react';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// assets
import NO_IMAGE from '@/assets/images/no-image.png';

// utils
import { buildProductGalleryImages } from '@/utils/productGallery';

const ProductGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const allImages = useMemo(() => {
    // const images = [];
    // if (product?.imageUrl?.trim()) {
    //   images.push(product.imageUrl.trim());
    // }

    // if (Array.isArray(product?.imagesUrl)) {
    //   product.imagesUrl.forEach((url) => {
    //     if (url?.trim() && !images.includes(url.trim())) {
    //       images.push(url.trim());
    //     }
    //   });
    // }

    // if (images.length === 0) {
    //   images.push(NO_IMAGE);
    // }

    // return images;

    const galleryImages = buildProductGalleryImages(product);
    if (galleryImages.length === 0) {
      galleryImages.push(NO_IMAGE);
    }
    return galleryImages;
  }, [product]);

  return (
    <div className="product-gallery">
      {/* 主圖 */}
      <div className="product-gallery__main">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          spaceBetween={12}
          thumbs={{ swiper: thumbsSwiper }}
          className="product-gallery__main-swiper"
        >
          {allImages.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div className="product-gallery__image">
                <img
                  src={imgUrl}
                  alt={`${product?.title} - ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = NO_IMAGE;
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 縮圖 */}
      {allImages.length > 1 && (
        <div className="product-gallery__thumbs">
          <Swiper
            onSwiper={setThumbsSwiper}
            watchSlidesProgress
            slidesPerView={5}
            spaceBetween={12}
            className="product-gallery__thumb-swiper"
          >
            {allImages.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <div className="product-gallery__thumb">
                  <img
                    src={imgUrl}
                    alt={`thumb-${index + 1}`}
                    onError={(e) => {
                      e.target.src = NO_IMAGE;
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
