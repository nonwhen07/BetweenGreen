import LifestyleCard from '@/components/front/home/Lifestyle/LifestyleCard';
// import noImage from '@/assets/images/no-image.png';
import desk from '@/assets/images/lifestyle/desk.png';
import space from '@/assets/images/lifestyle/space.png';
import balcony from '@/assets/images/lifestyle/balcony.png';

const lifestyleItems = [
  {
    id: 'desk-companion',
    title: '書桌陪伴',
    subtitle: 'Desk Companion',
    description: '為工作、閱讀與獨處時光，留下一點安靜綠意。',
    image: desk,
    link: '/products?theme=DeskLiving',
    tag: '日常療癒',
  },
  {
    id: 'space-styling',
    title: '空間造景',
    subtitle: 'Space Styling',
    description: '從店內到戶外角落，讓植物成為空間氛圍的一部分。',
    image: space,
    link: '/products?theme=SpaceStyling',
    tag: '氛圍設計',
  },
  {
    id: 'balcony-living',
    title: '陽台生活',
    subtitle: 'Balcony Living',
    description: '在城市裡，保留一個能慢慢呼吸的自然角落。',
    image: balcony,
    link: '/products?theme=BalconyMood',
    tag: '都市植培',
  },
];

const LifestyleSection = () => {
  return (
    <section id="lifestyle" className="ui-section lifestyle-section">
      <div className="container ui-container">
        <div className="lifestyle-section__heading">
          <p className="lifestyle-section__eyebrow">Lifestyle</p>
          <h2 className="lifestyle-section__title">從一個角落開始，打造屬於你的植感生活</h2>
          <p className="lifestyle-section__intro">不同空間，不同節奏，都能找到剛剛好的綠意陪伴。</p>
        </div>

        <div className="lifestyle-section__grid">
          {lifestyleItems.map((item) => (
            <LifestyleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
