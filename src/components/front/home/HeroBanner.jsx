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

// todo
// ✅ Home Hero Banner 明日調整筆記（濃縮版）
// 目前問題
// 現在是傳統電商玻璃資訊盒，導購清楚但品牌感不足。
// 大毛玻璃框把背景圖壓成陪襯，Hero 圖優勢被吃掉。
// 四張 swiper 若都同位置同資訊盒，會像普通廣告輪播。
// 調整核心方向
// Home Hero ≠ About 海報

// Home Hero 要做成：

// 品牌導覽式生活電影感 Swiper

// 不是靜態品牌海報。

// 必改三點
// ① 拿掉大玻璃資訊框

// 改成：

// 漂浮文字群
// 無框 / 超淡局部玻璃底
// 圖片重新成主角
// ② 每張 Slide 文字位置略不同

// 建立：

// left
// upper-left
// right-lower
// lower-left

// 讓 swiper 有 lookbook 呼吸感。

// ③ 底部增加導覽暗示

// 加入：

// 01 / 04
// progress line
// scroll to explore

// 增加首頁探索感。

// Home vs About 分工
// Home = 動態導覽品牌入口
// About = 靜態品牌定錨海報

// 兩者互相呼應但不能同模板。

// 明天要做的施工

// 重做 HomeHero overlay JSX + SCSS 架構
// （不是換圖，是換文字層與導覽層設計）

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
