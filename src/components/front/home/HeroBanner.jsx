import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import SiteImage from '@/components/shared/SiteImage';
import { SITE_ASSETS } from '@/constants/siteAssets';

const bannerData = [
  {
    id: 1,
    bannerName: '生活意境',
    eyebrow: 'Plant styling for your home',
    title: ['把綠意帶進日常', '讓空間慢慢呼吸'],
    desc: '從桌上盆栽到居家植栽搭配，找到適合你的植物日常。',
    imageAsset: SITE_ASSETS.homeHeroMain,
    alt: '陽光灑落的植栽生活空間',
  },
  {
    id: 2,
    bannerName: '書桌陪伴',
    eyebrow: 'Plant styling for your home',
    title: ['留一個安靜角落', '陪你專注每一天'],
    desc: '一盆綠意、一束光，讓工作的片刻也有自然陪伴。',
    imageAsset: SITE_ASSETS.homeHeroDesk,
    alt: '植物陪伴的書桌角落',
  },
  {
    id: 3,
    bannerName: '空間造景',
    eyebrow: 'Plant styling for your home',
    title: ['讓植物走進空間', '長出自己的風景'],
    desc: '從層架到窗邊，用植物搭配出舒服自在的生活空間。',
    imageAsset: SITE_ASSETS.homeHeroSpace,
    alt: '以綠意布置的室內空間',
  },
  {
    id: 4,
    bannerName: '陽台生活',
    eyebrow: 'Plant styling for your home',
    title: ['在城市的一隅', '留住日常的綠意'],
    desc: '讓光、微風與植物，把陽台變成喜歡停留的地方。',
    imageAsset: SITE_ASSETS.homeHeroBalcony,
    alt: '適合植物生長的陽台生活場景',
  },
];

const HeroBanner = () => {
  // 本地Scroll
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="ui-section ui-section--full hero-banner" aria-labelledby="home-title">
      <h1 id="home-title" className="hero-banner__page-title">
        Between Green 植感生活
      </h1>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 70000, disableOnInteraction: false }}
        className="swiper hero-banner__swiper"
        centeredSlides
        spaceBetween={24}
      >
        {bannerData.map((item) => (
          <SwiperSlide key={item.id}>
            {({ isActive }) => (
              <div className="hero-banner__slide" aria-hidden={isActive ? undefined : true}>
                <div className="hero-banner__bg">
                  <SiteImage asset={item.imageAsset} alt={item.alt} />
                </div>
                <div className="hero-banner__overlay" aria-hidden="true" />
                <div className="ui-container hero-banner__content">
                  <div className="hero-banner__text">
                    <p className="hero-banner__eyebrow">{item.eyebrow}</p>
                    <h2 className="hero-banner__title">{item.title.map((line) => <span key={line}>{line}</span>)}</h2>
                    <p className="hero-banner__desc">{item.desc}</p>
                    <div className="hero-banner__actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--primary"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleScroll('product')}
                      >
                        立即選購
                      </button>
                      <button
                        type="button"
                        className="ui-btn hero-banner__explore"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleScroll('lifestyle')}
                      >
                        探索分類
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;

