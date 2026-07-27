const BtnLoader = ({ size = '' }) => {
  const sizeClass = size ? `ui-spinner--${size}` : '';

  return <span className={`ui-spinner ui-spinner--btn ${sizeClass}`.trim()} aria-hidden="true" />;
};

export default BtnLoader;
