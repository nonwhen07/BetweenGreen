import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DESKTOP_MEDIA_QUERY = '(min-width: 1280px)';

const getIsDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_MEDIA_QUERY).matches;

const AdminCollapsibleSection = ({ sectionId, title, summary, children }) => {
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = `${sectionId}-content`;
  const isContentVisible = isDesktop || isExpanded;

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleViewportChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  return (
    <section className="admin-collapsible-section">
      <button
        type="button"
        className="admin-collapsible-section__toggle"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((currentValue) => !currentValue)}
      >
        <span className="admin-collapsible-section__heading">
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
        <span className="admin-collapsible-section__action" aria-hidden="true">
          <span>{isExpanded ? '收合' : '展開'}</span>
          <span
            className={`admin-collapsible-section__chevron ${isExpanded ? 'is-expanded' : ''}`}
          />
        </span>
      </button>

      <div id={contentId} className="admin-collapsible-section__content" hidden={!isContentVisible}>
        {children}
      </div>
    </section>
  );
};

AdminCollapsibleSection.propTypes = {
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AdminCollapsibleSection;
