import { Link } from 'react-router-dom';

import brandStoryImg from '@/assets/images/about/story-desk.png';

const BrandStory = () => {
  return (
    <section className="ui-section ui-section--loose brand-story-section">
      <div className="ui-container">
        <div className="brand-story-section__layout">
          <div className="brand-story-section__media" data-aos="fade-up" data-aos-duration="1000">
            <div className="brand-story-section__media-inner">
              <img src={brandStoryImg} alt="Between Green 品牌植感生活空間" />
            </div>
          </div>

          <div
            className="brand-story-section__content"
            data-aos="fade-up-left"
            data-aos-delay="120"
            data-aos-duration="1000"
          >
            <p className="brand-story-section__eyebrow">Our Philosophy</p>

            <h2 className="brand-story-section__title">讓空間長出生活感</h2>

            <p className="brand-story-section__desc">
              我們相信植物不只是裝飾，而是讓生活慢下來的方式。
            </p>

            <p className="brand-story-section__desc">
              從一盆小小的綠開始，空間與時間都會慢慢改變。
            </p>

            <div className="brand-story-section__actions">
              <Link to="/about-us" className="ui-btn ui-btn--primary">
                認識品牌
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
