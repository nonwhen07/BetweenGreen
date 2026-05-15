import { useNavigate } from 'react-router-dom';
import noImage from '@/assets/images/no-image.png';

const LifestyleCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.link);
  };

  return (
    <>
      <article
        className="ui-card lifestyle-card"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="lifestyle-card__image">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = noImage;
            }}
          />
        </div>

        <div className="lifestyle-card__overlay">
          <p className="lifestyle-card__eyebrow">{item.subtitle}</p>

          <h3 className="lifestyle-card__title">{item.title}</h3>

          <span className="lifestyle-card__link">
            Explore <span className="lifestyle-card__arrow">→</span>
          </span>
        </div>
      </article>
    </>
  );
};

export default LifestyleCard;
