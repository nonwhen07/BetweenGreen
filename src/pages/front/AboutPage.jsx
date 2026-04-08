// const AboutPage = () => {
//   return (
//     <>
//       <div className="">
//         1️⃣ 品牌理念 我們相信 空間不只是用來生活 而是用來感受 你的故事（可以簡單）
//       </div>
//       <div className="">2️⃣ 為什麼做這個品牌 👉 你的故事（可以簡單）</div>
//       <div className="">3️⃣ 我們做什麼 👉 三大主軸： 書桌陪伴 空間造景 日常植培</div>
//       <div className="">4️⃣ 我們希望帶來什麼 👉 情緒 / 氛圍 / 改變</div>
//     </>
//   );
// };

import React from 'react';

const AboutPage = () => {
  return (
    <div className="ui-about">
      {/* 🟢 1. About Hero */}
      <section className="ui-about-hero">
        <div className="ui-about-hero__overlay"></div>

        {/* 背景圖 */}
        {/* TODO: 放 image */}
        <div className="ui-about-hero__bg">
          {/* <img src="/images/about-hero.jpg" alt="about hero" /> */}
        </div>

        <div className="ui-about-hero__content">
          <h1 className="ui-about-hero__title">
            植間生活
            <span>Between Green</span>
          </h1>

          <p className="ui-about-hero__subtitle">讓空間長出生活感</p>
        </div>
      </section>

      {/* 🟢 2. Brand Statement */}
      <section className="ui-about-section ui-about-statement">
        <div className="ui-container">
          <div className="ui-about-statement__content">
            <p>
              我們相信，
              <br />
              空間不只是被使用，
              <br />
              而是被感受。
            </p>

            <p>
              植物不是裝飾，
              <br />
              而是讓生活慢下來的方式。
            </p>
          </div>
        </div>
      </section>

      {/* 🟢 3. Brand Story */}
      <section className="ui-about-section ui-about-story">
        <div className="ui-container">
          <div className="ui-about-story__block">
            <div className="ui-about-story__image">
              {/* TODO: 書桌植物 */}
              <div className="placeholder-image">image</div>
            </div>

            <div className="ui-about-story__text">
              <p>在忙碌的城市裡， 我們習慣用效率填滿生活， 卻很少留一點空間給自己。</p>

              <p>我們開始在書桌上放一盆小植物， 在陽台種下一點綠意， 慢慢地，空間變得不一樣了。</p>
            </div>
          </div>

          <div className="ui-about-story__block reverse">
            <div className="ui-about-story__image">
              {/* TODO: 陽台植物 */}
              <div className="placeholder-image">image</div>
            </div>

            <div className="ui-about-story__text">
              <p>光線變柔了， 時間也變慢了。</p>

              <p>「植間生活」因此誕生， 希望讓每個人都能擁有一個 屬於自己的綠意角落。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 4. Lifestyle Concept */}
      <section className="ui-about-section ui-about-lifestyle">
        <div className="ui-container">
          <h2 className="ui-about-section__title">三種生活方式， 三種與植物相處的距離</h2>

          <div className="ui-about-lifestyle__grid">
            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">image</div>
              <h3>書桌陪伴</h3>
              <p>讓日常多一點安靜與專注</p>
            </div>

            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">image</div>
              <h3>空間造景</h3>
              <p>為空間創造屬於你的氛圍</p>
            </div>

            <div className="ui-about-lifestyle__card">
              <div className="placeholder-image">image</div>
              <h3>陽台生活</h3>
              <p>在城市裡保留一點自然</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 5. Scene Transformation */}
      <section className="ui-about-section ui-about-transform">
        <div className="ui-container">
          <h2 className="ui-about-section__title">空間的改變， 從一點綠開始</h2>

          <div className="ui-about-transform__compare">
            <div className="ui-about-transform__item">
              <div className="placeholder-image">Before</div>
              <span>Before</span>
            </div>

            <div className="ui-about-transform__item">
              <div className="placeholder-image">After</div>
              <span>After</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 6. Philosophy */}
      <section className="ui-about-section ui-about-philosophy">
        <div className="ui-container">
          <div className="ui-about-philosophy__content">
            <p>我們不追求大量， 而是剛剛好的存在。</p>

            <p>不需要改變全部， 只需要改變一個角落。</p>

            <p>植物會慢慢長， 生活也會慢慢變好。</p>
          </div>
        </div>
      </section>

      {/* 🟢 7. CTA */}
      <section className="ui-about-section ui-about-cta">
        <div className="ui-container">
          <h2>開始你的植感生活</h2>

          <button className="btn ui-btn-primary">探索商品</button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
