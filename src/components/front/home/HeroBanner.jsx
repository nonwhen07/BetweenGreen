import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    <section className=" ui-section ui-section--full hero-banner">
      {/* <div className="hero-banner__bg">
        <img src={heroImg1} alt={'heroImg'} />
      </div>
      <div className="hero-banner__overlay" />
      <div className="container ui-container hero-banner__content">
        <div className="hero-banner__text">
          <p className="hero-banner__eyebrow">Plant styling for your home</p>
          <h1 className="hero-banner__title">把綠意帶進日常，讓空間慢慢呼吸</h1>
          <p className="hero-banner__desc">從桌上盆栽到居家植栽搭配，找到適合你的植物日常。</p>

          <div className="hero-banner__actions">
            <button className="btn ui-btn ui-btn--primary" onClick={() => handleScroll('product')}>
              立即選購
            </button>
            <button
              className="btn ui-btn ui-btn--outline-primary"
              onClick={() => handleScroll('category')}
            >
              探索分類
            </button>
          </div>
        </div>
      </div> */}

      <Swiper
        // 綁定模組
        modules={[Navigation, Autoplay, Pagination]}
        slidesPerView={1} // 先用1，最穩
        loop={true}
        // autoplay={{ delay: 7000, disableOnInteraction: false }}
        autoplay={{ delay: 70000, disableOnInteraction: false }}
        className="swiper hero-banner__swiper"
        // 你的參數設定
        centeredSlides={true}
        spaceBetween={24}

        // 下面的小黑點(分頁註記)
        // pagination={{ clickable: true }}
        // // 導航按鈕 (綁定下方的 class)
        // navigation={{
        //   nextEl: '.custom-next',
        //   prevEl: '.custom-prev',
        // }}
        // // RWD
        // breakpoints={{
        //   768: {
        //     centeredSlides: false,
        //     slidesPerView: 2,
        //     spaceBetween: 20,
        //   },
        //   1000: {
        //     centeredSlides: false,
        //     slidesPerView: 3,
        //     spaceBetween: 20,
        //   },
        //   1400: {
        //     centeredSlides: false,
        //     slidesPerView: 4,
        //     spaceBetween: 24,
        //   },
        // }}
      >
        {bannerData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="hero-banner__slide">
              <div className="hero-banner__bg">
                <img src={item.img} alt={item.alt} />
              </div>
              <div className="hero-banner__overlay" />
              <div className="container ui-container hero-banner__content">
                <div className="hero-banner__text">
                  <p className="hero-banner__eyebrow mb-1">{item.eyebrow}</p>
                  <h1 className="hero-banner__title mb-1">{item.title}</h1>
                  <p className="hero-banner__desc mb-1">{item.desc}</p>
                  <div className="hero-banner__actions">
                    <button
                      className="ui-btn ui-btn--primary"
                      onClick={() => handleScroll('product')}
                    >
                      立即選購
                    </button>
                    <button
                      className="ui-btn ui-btn--outline-primary"
                      onClick={() => handleScroll('lifestyle')}
                    >
                      探索分類
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;
