import heroImg from '@/assets/images/heroImg.png';

const HeroBanner = () => {
  // 本地Scroll
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <section className="hero-banner ui-section ui-section--full">
      <div className="hero-banner__bg">
        <img src={heroImg} alt={'heroImg'} />
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
      </div>
    </section>
  );
};

export default HeroBanner;
