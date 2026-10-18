import clsx from 'clsx';

const PageHero = ({
  eyebrow = 'Between Green',
  title,
  text,
  backgroundImage,
  imagePosition,
  variant,
  className,
  tone = 'light',
  align = 'left',
  size = 'md',
  titleId = 'page-hero-title',
  children,
}) => {
  return (
    <section
      className={clsx(
        'page-hero',
        tone && `page-hero--${tone}`,
        `page-hero--${align}`,
        `page-hero--${size}`,
        variant && `page-hero--${variant}`,
        className,
      )}
      aria-labelledby={titleId}
    >
      {/* background image */}
      {backgroundImage && (
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: imagePosition,
          }}
          aria-hidden="true"
        />
      )}

      {/* overlay */}
      <div className="page-hero__overlay" aria-hidden="true" />

      {/* texture */}
      <div className="page-hero__noise" aria-hidden="true" />

      {/* content */}
      <div className="ui-container">
        <div className="page-hero__content">
          {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}

          {title && (
            <h1 className="page-hero__title" id={titleId}>
              {title}
            </h1>
          )}

          {text && <p className="page-hero__text">{text}</p>}

          {/* optional area */}
          {children && <div className="page-hero__extra">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
