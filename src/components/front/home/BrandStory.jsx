import { Link } from 'react-router-dom';

import brandStoryImg from '@/assets/images/about/story-desk.png';

const BrandStory = () => {
  return (
    <>
      <section className="brand-story ui-section">
        <div className="ui-container">
          <div className="brand-story__layout">
            {/* 左：圖片 */}
            <div className="brand-story__media">
              <img src={brandStoryImg} alt="brand story" />
            </div>

            {/* 右：內容 */}
            <div className="brand-story__content">
              <p className="brand-story__eyebrow">Our Philosophy</p>

              <h2 className="brand-story__title">讓空間長出生活感</h2>

              <p className="brand-story__desc">我們相信植物不只是裝飾， 而是讓生活慢下來的方式。</p>

              <p className="brand-story__desc">從一盆小小的綠開始， 空間與時間都會慢慢改變。</p>

              <div className="brand-story__actions">
                <Link to="/about-us" className="ui-btn ui-btn--primary">
                  認識品牌
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandStory;
