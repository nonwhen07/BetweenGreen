import LifestyleCard from '@/components/front/home/Lifestyle/LifestyleCard';
import { LIFESTYLE_ITEMS } from '@/constants/lifestyleConstants';

const LifestyleSection = () => {
  return (
    <section
      id="lifestyle"
      className="ui-section lifestyle-section"
      aria-labelledby="lifestyle-title"
    >
      <div className="ui-container">
        <div className="lifestyle-section__heading">
          <p className="lifestyle-section__eyebrow">Lifestyle</p>
          <h2 id="lifestyle-title" className="lifestyle-section__title">
            從一個角落開始，打造屬於你的植感生活
          </h2>
          <p className="lifestyle-section__intro">不同空間，不同節奏，都能找到剛剛好的綠意陪伴。</p>
        </div>

        <div className="lifestyle-section__grid">
          {LIFESTYLE_ITEMS.map((item) => (
            <LifestyleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
