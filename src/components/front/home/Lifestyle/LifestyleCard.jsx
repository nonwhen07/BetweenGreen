import { useNavigate } from 'react-router-dom';

const LifestyleCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.link);
  };

  return (
    <>
      {/* <article
        className="ui-lifestyle-card"
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
        <div className="ui-lifestyle-card__image">
          <img src={item.image} alt={item.title} />
        </div>

        <div className="ui-lifestyle-card__content">
          <span className="ui-lifestyle-card__tag">{item.tag}</span>

          <h3 className="ui-lifestyle-card__title">{item.title}</h3>

          <p className="ui-lifestyle-card__subtitle">{item.subtitle}</p>

          <p className="ui-lifestyle-card__desc">{item.description}</p>

          <span className="ui-lifestyle-card__link">
            探索場景
            <span className="ui-lifestyle-card__arrow">→</span>
          </span>
        </div>
      </article> */}

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
          <img src={item.image} alt={item.title} />
        </div>

        <div className="lifestyle-card__overlay">
          <p className="lifestyle-card__eyebrow">{item.subtitle}</p>

          <h3 className="lifestyle-card__title">{item.title}</h3>

          <span className="lifestyle-card__link">Explore →</span>
        </div>
      </article>
    </>
  );
};

export default LifestyleCard;
