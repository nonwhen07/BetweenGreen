import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  // const category = {
  //   title: 'Plants',
  //   image: '/img/category-plants.jpg',
  // };

  const handleClick = () => {
    navigate(`/products?category=${category.title.toLowerCase()}`);
  };

  return (
    <div className="card-category" onClick={handleClick}>
      <div className="card-category__image">
        <img src={category.image} alt={category.title} />
        {/* 未來可以補上loading */}
        {/* <img src={category.image} alt={category.title} loading="lazy" /> */}
      </div>

      <h3 className="card-category__title">{category.title}</h3>
      {/* <div className="card-category__overlay">
        <span>{category.title}</span>
      </div> */}
    </div>
  );
};

export default CategoryCard;
