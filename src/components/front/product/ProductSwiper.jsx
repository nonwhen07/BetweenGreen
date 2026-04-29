import { useState, useMemo } from 'react';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// assets
import NO_IMAGE from '@/assets/images/no-image.png';

const ProductSwiper = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // === 防呆 + 組合所有圖片陣列（重點）===
  const allImages = useMemo(() => {
    const images = [];

    // 1. 先加入主圖 imageUrl（如果存在）
    if (product?.imageUrl?.trim()) {
      images.push(product.imageUrl.trim());
    }

    // 2. 再加入 imagesUrl 陣列（過濾無效值）
    if (Array.isArray(product?.imagesUrl)) {
      product.imagesUrl.forEach((url) => {
        if (url && typeof url === 'string' && url.trim()) {
          const trimmedUrl = url.trim();
          // 避免和主圖重複
          if (!images.includes(trimmedUrl)) {
            images.push(trimmedUrl);
          }
        }
      });
    }

    // 3. 如果完全沒有圖片，就塞入預設 noimg
    if (images.length === 0) {
      images.push(NO_IMAGE);
    }

    return images;
  }, [product]);

  // 如果 product 還沒載入完成
  if (!product) {
    return <div className="text-center py-10">載入中...</div>;
  }

  return (
    <>
      <div className="row g-5">
        {/* 左欄：圖片區 */}
        <div className="col-12 col-lg-7 col-xl-6">
          <div className="main-swiper-wrapper">
            <Swiper
              modules={[Navigation, Thumbs, Autoplay]}
              spaceBetween={10}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              autoplay={{
                delay: 4500,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
              }}
              className="main-swiper"
            >
              {allImages.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgUrl}
                    alt={`${product.title} - 圖片 ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = NO_IMAGE;
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {allImages.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              slidesPerView={5}
              spaceBetween={8}
              watchSlidesProgress
              className="thumb-swiper mt-4"
            >
              {allImages.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgUrl}
                    alt={`縮圖 ${index + 1}`}
                    onError={(e) => (e.target.src = NO_IMAGE)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {/* 右欄：商品資訊 */}
        <div className="col-12 col-lg-5 col-xl-6">
          <div className="product-info">
            <h1 className="h2 fw-bold mb-2">{product.title}</h1>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="text-warning">★★★★☆</div>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-4">
              <span className="fs-1 fw-bold text-danger">${product.price}</span>
              {product.origin_price > product.price && (
                <>
                  <span className="text-decoration-line-through text-muted">
                    ${product.origin_price}
                  </span>
                  <span className="badge bg-danger">
                    -
                    {Math.round(
                      ((product.origin_price - product.price) / product.origin_price) * 100,
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            <p className="text-muted mb-4">{product.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSwiper;
