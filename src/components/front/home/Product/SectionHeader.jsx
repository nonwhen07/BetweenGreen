import { Link } from 'react-router-dom';

const SectionHeader = ({ title, link }) => {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>

      <Link to={link} className="ui-btn ui-btn-outline">
        View More
      </Link>
    </div>
  );
};

export default SectionHeader;
