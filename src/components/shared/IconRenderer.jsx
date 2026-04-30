// import PropTypes from 'prop-types';
import { ICON_COMPONENT_MAP } from '@/constants/iconMap';

// Page裡面要用到的Icon，會透過這個Component來渲染，引用方式：
// xxxpage.jsx
// import IconRenderer from '@/components/common/IconRenderer';
// <IconRenderer name={theme.icon} size={26} className="category-icon" />

const IconRenderer = ({ name, size = 20, strokeWidth = 1.8, className = '' }) => {
  const IconComponent = ICON_COMPONENT_MAP[name];

  if (!IconComponent) return null;

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} />;
};

// IconRenderer.propTypes = {
//   name: PropTypes.string,
//   size: PropTypes.number,
//   strokeWidth: PropTypes.number,
//   className: PropTypes.string,
// };

export default IconRenderer;
