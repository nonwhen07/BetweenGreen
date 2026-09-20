import { Link } from 'react-router-dom';
import noImage from '@/assets/images/no-image.png';

const LifestyleCard = ({ item }) => {
  return (
    <article className="ui-card lifestyle-card">
      <Link to={item.link} className="lifestyle-card__anchor" aria-label={`探索${item.title}`}>
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
      </Link>
    </article>
  );
};

export default LifestyleCard;
