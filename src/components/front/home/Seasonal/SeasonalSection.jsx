import SeasonalProductCard from '@/components/front/home/Seasonal/SeasonalCard';
import noImage from '@/assets/images/no-image.png';
const seasonalProducts = [
  {
    id: 1,
    title: 'Valentine Rose Bouquet',
    price: 980,
    image: noImage,
  },
  {
    id: 2,
    title: 'Spring Tulip Gift',
    price: 720,
    image: noImage,
  },
  {
    id: 3,
    title: 'Lucky Bamboo Plant',
    price: 420,
    image: noImage,
  },
  {
    id: 4,
    title: 'Orchid Flower Set',
    price: 1280,
    image: noImage,
  },
];

const SeasonalSection = () => {
  return (
    <section className="seasonal-section">
      <div className="container ui-container">
        <div className="text-center mb-5">
          <h2 className="section-title">Seasonal Collection</h2>
          <p className="section-subtitle">為即將到來的節日準備好花禮</p>
        </div>
        <div className="row g-4">
          {seasonalProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <SeasonalProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonalSection;
