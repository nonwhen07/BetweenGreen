import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// assets
import heroMain from '@/assets/images/brand/hero/hero-main.png';
import heroDesk from '@/assets/images/brand/hero/hero-desk.png';
import heroSpace from '@/assets/images/brand/hero/hero-space.png';
import heroBalcony from '@/assets/images/brand/hero/hero-balcony.png';

const bannerData = [
  {
    id: 1,
    bannerName: '生活意境',
    eyebrow: 'Plant styling for your home',
    title: '把綠意帶進日常，讓空間慢慢呼吸',
    desc: '從桌上盆栽到居家植栽搭配，找到適合你的植物日常。',
    img: heroMain,
    alt: '生活意境.png',
  },
  {
    id: 2,
    bannerName: '書桌陪伴',
    eyebrow: 'Plant styling for your home',
    title: '把綠意帶進日常，讓空間慢慢呼吸2',
    desc: '從桌上盆栽到居家植栽搭配，找到適合你的植物日常2。',
    img: heroDesk,
    alt: '書桌陪伴.png',
  },
  {
    id: 3,
    bannerName: '空間造景',
    eyebrow: 'Plant styling for your home',
    title: '把綠意帶進日常，讓空間慢慢呼吸3',
    desc: '從桌上盆栽到居家植栽搭配，找到適合你的植物日常3。',
    img: heroSpace,
    alt: '空間造景.png',
  },
  {
    id: 4,
    bannerName: '陽台生活',
    eyebrow: 'Plant styling for your home',
    title: '把綠意帶進日常，讓空間慢慢呼吸4',
    desc: '從桌上盆栽到居家植栽搭配，找到適合你的植物日常4。',
    img: heroBalcony,
    alt: '陽台生活.png',
  },
];

const HeroBanner = () => {
  // 本地Scroll
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
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
                  <img src={item.img} alt={item.alt} />
                </div>
                <div className="hero-banner__overlay" />
                <div className="ui-container hero-banner__content">
                  <div className="hero-banner__text">
                    <p className="hero-banner__eyebrow">{item.eyebrow}</p>
                    <h2 className="hero-banner__title">{item.title}</h2>
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
                        className="ui-btn ui-btn--outline-primary"
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
