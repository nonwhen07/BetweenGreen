import { Link } from 'react-router-dom';
import SiteImage from '@/components/shared/SiteImage';

const LifestyleCard = ({ item, variant = 'home' }) => {
  const isAbout = variant === 'about';

  return (
    <article
      className={`ui-card lifestyle-card${isAbout ? ' lifestyle-card--about' : ''}`}
    >
      <Link to={item.link} className="lifestyle-card__anchor" aria-label={`探索${item.title}`}>
        <div className="lifestyle-card__image">
          <SiteImage
            asset={item.imageAsset}
            alt={item.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="lifestyle-card__overlay">
          <p className="lifestyle-card__eyebrow">{item.subtitle}</p>

          <h3 className="lifestyle-card__title">{item.title}</h3>

          {isAbout && <p className="lifestyle-card__description">{item.aboutDescription}</p>}

          <span className="lifestyle-card__link">
            {isAbout ? '探索這種生活' : 'Explore'} <span className="lifestyle-card__arrow">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
};

export default LifestyleCard;

