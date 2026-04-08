import CategoryCard from '@/components/front/home/Category/CategoryCard';
import noImage from '@/assets/images/no-image.png';

const CategorySection = () => {
  const categories = [
    // { id: 1, title: 'Plants', key: 'plants', image: '/img/plant.jpg' },
    // { id: 2, title: 'Flowers', key: 'Flowers', image: '/img/flower.jpg' },
    // { id: 3, title: 'Tools', key: 'Tools', image: '/img/tools.jpg' },
    // { id: 4, title: 'Pots', key: 'Pots', image: '/img/pots.jpg' },
    { id: 1, title: 'Plants', key: 'plants', image: noImage },
    { id: 2, title: 'Flowers', key: 'Flowers', image: noImage },
    { id: 3, title: 'Tools', key: 'Tools', image: noImage },
    { id: 4, title: 'Pots', key: 'Pots', image: noImage },
  ];
  return (
    <section id="category" className="category-section ui-section">
      <div className="container ui-container">
        <div className="text-center mb-5">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">探索不同風格的植物與花藝</p>
        </div>
        <div className="row d-flex g-3 g-lg-4">
          {categories.map((category) => (
            <div key={category.id} className=" col-lg-3 col-md-6 col-6">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
