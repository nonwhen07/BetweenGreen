import clsx from 'clsx';

const PageHero = ({
  eyebrow = 'Between Green',
  title,
  text,
  backgroundImage,
  tone = 'light',
  align = 'left',
  size = 'md',
  children,
}) => {
  return (
    <section
      className={clsx(
        'page-hero',
        tone && `page-hero--${tone}`,
        `page-hero--${align}`,
        `page-hero--${size}`,
      )}
    >
      {/* background image */}
      {backgroundImage && (
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* overlay */}
      <div className="page-hero__overlay" />

      {/* texture */}
      <div className="page-hero__noise" />

      {/* content */}
      <div className="ui-container">
        <div className="page-hero__content">
          {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}

          {title && <h1 className="page-hero__title">{title}</h1>}

          {text && <p className="page-hero__text">{text}</p>}

          {/* optional area */}
          {children && <div className="page-hero__extra">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
