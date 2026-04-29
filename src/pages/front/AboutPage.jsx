import React from 'react';

// assets
import heroAbout from '@/assets/images/about/hero-about.png';

const AboutPage = () => {
  return (
    <div className="ui-about">
      {/* 1. About Hero */}
      <section className="ui-section ui-section--full ui-about-hero">
        <div className="ui-about-hero__overlay"></div>

        <div className="ui-about-hero__bg">
          <img
            src={heroAbout}
            alt="關於植間生活.png"
            title="讓空間長出生活感，讓日常慢慢被綠意填滿。"
          />
        </div>

        <div className="ui-container">
          <div className="ui-about-hero__inner">
            <div className="ui-about-hero__content">
              <p className="ui-about-hero__eyebrow">About Between Green</p>

              <h1 className="ui-about-hero__title">
                植間生活
                <span>Between Green</span>
              </h1>

              <p className="ui-about-hero__subtitle">讓空間長出生活感，讓日常慢慢被綠意填滿。</p>
            </div>

            <div className="ui-about-hero__aside">
              <span>Grow with your space.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Story Wrap */}
      <section className="ui-about-story">
        <div className="ui-container">
          {/* statement */}
          <div className="ui-about-story__statement">
            <p>
              我們相信，空間不只是被使用，
              <br />
              而是被感受。
            </p>

            <p>
              植物不是裝飾，
              <br />
              而是讓生活慢下來的方式。
            </p>
          </div>

          {/* scene 1 */}
          <div className="ui-about-story__scene">
            <div className="ui-about-story__image">
              <div className="placeholder-image">story image 01</div>
            </div>

            <div className="ui-about-story__text">
              <p>在忙碌的城市裡， 我們習慣用效率填滿生活， 卻很少留一點空間給自己。</p>

              <p>直到一盆小小的綠出現在書桌角落， 空間的呼吸感，開始慢慢回來。</p>
            </div>
          </div>

          {/* scene 2 */}
          <div className="ui-about-story__scene ui-about-story__scene--reverse">
            <div className="ui-about-story__image">
              <div className="placeholder-image">story image 02</div>
            </div>

            <div className="ui-about-story__text">
              <p>陽台的光、窗邊的影、桌面的安靜， 讓我們重新發現， 原來生活可以不用那麼匆忙。</p>

              <p>「植間生活」因此誕生， 希望把這份剛剛好的綠意， 帶進每個人的日常裡。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lifestyle Showcase */}
      <section className="ui-about-lifestyle">
        <div className="ui-container">
          <div className="ui-about-lifestyle__heading">
            <p className="ui-about-lifestyle__eyebrow">Lifestyle with Plants</p>
            <h2 className="ui-about-lifestyle__title">三種生活方式，三種與植物相處的距離</h2>
          </div>

          <div className="ui-about-lifestyle__grid">
            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">desk</div>
              <div className="ui-about-lifestyle__body">
                <h3>書桌陪伴</h3>
                <p>讓日常多一點安靜與專注</p>
              </div>
            </div>

            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">space</div>
              <div className="ui-about-lifestyle__body">
                <h3>空間造景</h3>
                <p>為空間創造屬於你的氛圍</p>
              </div>
            </div>

            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">balcony</div>
              <div className="ui-about-lifestyle__body">
                <h3>陽台生活</h3>
                <p>在城市裡保留一點自然</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ending Philosophy + CTA */}
      <section className="ui-about-ending">
        <div className="ui-about-ending__overlay"></div>

        <div className="ui-about-ending__bg">{/* TODO: ending bg */}</div>

        <div className="ui-container">
          <div className="ui-about-ending__content">
            <p className="ui-about-ending__quote">
              我們不追求大量，
              <br />
              而是剛剛好的存在。
            </p>

            <p className="ui-about-ending__quote">
              不需要改變全部，
              <br />
              只需要改變一個角落。
            </p>

            <button className="btn ui-btn-primary">探索商品</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
