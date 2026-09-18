import { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';
import PropTypes from 'prop-types';

// constants
import { BREAKPOINTS } from '@/constants/breakpoints';

// constants
const MIN_SHOW_THRESHOLD = 240;
const MAX_SHOW_THRESHOLD = 480;
const VIEWPORT_SHOW_RATIO = 0.6;

function getViewportShowThreshold() {
  const viewportThreshold = Math.round(window.innerHeight * VIEWPORT_SHOW_RATIO);

  return Math.min(MAX_SHOW_THRESHOLD, Math.max(MIN_SHOW_THRESHOLD, viewportThreshold));
}

function getDefaultShowThreshold() {
  if (window.innerWidth < BREAKPOINTS.pad) return 160;
  if (window.innerWidth < BREAKPOINTS.desktop) return 200;
  if (window.innerWidth < BREAKPOINTS.desktopXL) return 250;

  return 400;
}

const GoTop = ({ variant = 'default' }) => {
  const [visible, setVisible] = useState(false);
  // accessibility（無障礙）設定，問問瀏覽器：使用者有沒有開「減少動態效果」？
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      const threshold =
        variant === 'front' ? getViewportShowThreshold() : getDefaultShowThreshold();
      setVisible(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [variant]);

  // 點擊回到頂部
  const scrollToTop = () => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // 可自訂樣式
  return (
    <button
      type="button"
      className={`ui-btn-gotop ui-btn-gotop--${variant}${visible ? ' is-visible is-active' : ''}`}
      onClick={scrollToTop}
      aria-label="回到頂部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <FaAngleUp size={20} />
    </button>
  );
};

GoTop.propTypes = {
  variant: PropTypes.oneOf(['default', 'front']),
};

export default GoTop;
