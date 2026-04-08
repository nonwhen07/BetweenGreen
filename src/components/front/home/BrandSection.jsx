import { Link } from 'react-router-dom';

const BrandSection = () => {
  return (
    <section className="ui-section brand-section">
      <div className="ui-container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <img
              src="/images/brand-plant.jpg"
              alt="Plant lifestyle"
              className="img-fluid rounded"
            />
          </div>

          <div className="col-lg-6">
            <h2>Bring Nature Into Your Life</h2>

            <p>我們相信植物能讓生活慢下來。 在忙碌的城市中，留下一個角落， 讓綠意陪伴你的日常。</p>

            <a className="btn btn-outline-dark">About Us</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
