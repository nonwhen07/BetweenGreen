import { Link } from 'react-router-dom';

// assets
import heroAbout from '@/assets/images/about/hero-about.png';
import SiteImage from '@/components/shared/SiteImage';
import LifestyleCard from '@/components/front/home/Lifestyle/LifestyleCard';
import { SITE_ASSETS } from '@/constants/siteAssets';
import { LIFESTYLE_ITEMS } from '@/constants/lifestyleConstants';

// 沿用既有AOS；短距離、單次進場，樣式只作用於About。
const reveal = (delay = 0) => ({
  'data-aos': 'about-reveal',
  'data-aos-delay': delay,
  'data-aos-duration': '550',
  'data-aos-once': 'true',
});

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* 1. About Hero */}
      <section
        className="ui-section ui-section--full about-hero"
        aria-labelledby="about-page-title"
      >
        <div className="about-hero__overlay" aria-hidden="true" />

        <div className="about-hero__bg" aria-hidden="true">
          <img
            src={heroAbout}
            alt=""
          />
        </div>

        <div className="ui-container">
          <div className="about-hero__inner">
            <div className="about-hero__content">
              <p className="about-hero__eyebrow" {...reveal()}>About Between Green</p>

              <h1 className="about-hero__title" id="about-page-title" {...reveal(100)}>
                植間生活
                <span>Between Green</span>
              </h1>

              <p className="about-hero__subtitle" {...reveal(200)}>
                讓空間長出生活感，
                <br />
                讓日常慢慢被綠意填滿。
              </p>
            </div>

            <div className="about-hero__aside" aria-hidden="true">
              <span>Grow with your space.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Story Wrap */}
      <section
        className="ui-section ui-section--full about-story"
        aria-labelledby="about-story-title"
      >
        <div className="ui-container">
          {/* statement */}
          <div className="about-story__statement" {...reveal()}>
            <h2 id="about-story-title">
              我們相信，空間不只是被使用，
              <br />
              而是被感受。
            </h2>

            <p>
              植物不是裝飾，
              <br />
              而是讓生活慢下來的方式。
            </p>
          </div>

          {/* scene 1 */}
          <div className="about-story__scene">
            <div className="about-story__image" {...reveal()}>
              <SiteImage
                asset={SITE_ASSETS.aboutStorySlowDown}
                alt="窗邊書桌上的盆栽、陶杯與筆記本"
                className="about-story__photo"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="about-story__text" {...reveal(100)}>
              <p className="about-story__index">01 / Slow down</p>
              <h3>替忙碌，留一點呼吸</h3>

              <p>在忙碌的城市裡，我們習慣用效率填滿生活，卻很少留一點空間給自己。</p>

              <p>直到一盆小小的綠出現在書桌角落，空間的呼吸感，才開始慢慢回來。</p>
            </div>
          </div>

          {/* scene 2 */}
          <div className="about-story__scene about-story__scene--reverse">
            <div className="about-story__image" {...reveal()}>
              <SiteImage
                asset={SITE_ASSETS.aboutStoryGrowTogether}
                alt="公寓陽台門邊的植栽，連接室內與戶外光線"
                className="about-story__photo"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="about-story__text" {...reveal(100)}>
              <p className="about-story__index">02 / Grow together</p>
              <h3>把自然，帶回生活裡</h3>

              <p>陽台的光、窗邊的影、桌面的安靜，讓我們重新發現，原來生活可以不用那麼匆忙。</p>

              <p>「植間生活」因此誕生，希望把這份剛剛好的綠意，帶進每個人的日常裡。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lifestyle Showcase */}
      <section
        className="ui-section ui-section--full about-lifestyle"
        aria-labelledby="about-lifestyle-title"
      >
        <div className="ui-container">
          <div className="about-lifestyle__heading" {...reveal()}>
            <p className="about-lifestyle__eyebrow">Lifestyle with Plants</p>
            <h2 className="about-lifestyle__title" id="about-lifestyle-title">
              三種生活方式，三種與植物相處的距離
            </h2>
          </div>

          <div className="about-lifestyle__grid">
            {LIFESTYLE_ITEMS.map((item, index) => (
              <div key={item.id} className="about-lifestyle__item" {...reveal(index * 100)}>
                <LifestyleCard item={item} variant="about" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ending Philosophy + CTA */}
      <section
        className="ui-section ui-section--full about-ending"
        aria-labelledby="about-ending-title"
      >
        <div className="about-ending__overlay" aria-hidden="true" />

        <div className="about-ending__bg" aria-hidden="true">
          <SiteImage asset={SITE_ASSETS.aboutEndingGreenCorner} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="ui-container">
          <div className="about-ending__content">
            <h2 className="about-ending__quote" id="about-ending-title" {...reveal()}>
              我們不追求大量，
              <br />
              而是剛剛好的存在。
            </h2>

            <p className="about-ending__quote" {...reveal(100)}>
              不需要改變全部，
              <br />
              只需要改變一個角落。
            </p>

            <p className="about-ending__note" {...reveal(150)}>Find your green corner.</p>

            <Link className="ui-btn ui-btn--primary" to="/products" {...reveal(200)}>
              探索商品
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;



