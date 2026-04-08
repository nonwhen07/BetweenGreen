import GardenTipCard from '@/components/front/home/GardenTips/GardenTipCard';

const tips = [
  {
    id: 1,
    title: '多肉植物如何澆水',
    description: '了解多肉植物的澆水頻率，避免過度澆水造成根部腐爛。',
    image: '/images/tips/succulent-water.jpg',
  },
  {
    id: 2,
    title: '盆栽換盆技巧',
    description: '什麼時候該換盆？如何讓植物在新盆中健康成長。',
    image: '/images/tips/repotting.jpg',
  },
  {
    id: 3,
    title: '室內植物光照指南',
    description: '不同植物需要不同光照條件，找到最適合的位置。',
    image: '/images/tips/light-guide.jpg',
  },
];

const GardenTipsSection = () => {
  return (
    <section className="ui-section garden-tips">
      <div className="ui-container">
        <div className="section-header text-center mb-5">
          <h2>Garden Tips</h2>
          <p className="text-muted">簡單的園藝技巧，讓你的植物更健康成長</p>
        </div>

        <div className="row g-4">
          {tips.map((tip) => (
            <div key={tip.id} className="col-md-6 col-lg-4">
              <GardenTipCard tip={tip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GardenTipsSection;
