import { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';

// constants
import { BREAKPOINTS } from '@/constants/breakpoints';

function getShowThreshold() {
  // 可自訂各裝置下的滾動距離
  // if (window.innerWidth <= 575.98) return 200;
  // if (window.innerWidth <= 991.98) return 250;
  if (window.innerWidth < BREAKPOINTS.pad) {
    return 200;
  }

  if (window.innerWidth < BREAKPOINTS.desktop) {
    return 250;
  }
  return 400; // desktop
}

const GoTop = () => {
  const [visible, setVisible] = useState(false);
  // accessibility（無障礙）設定，問問瀏覽器：使用者有沒有開「減少動態效果」？
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      const threshold = getShowThreshold();
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`ui-btn-gotop${visible ? ' show' : ''}`}
      onClick={scrollToTop}
      aria-label="回到頂部"
    >
      <FaAngleUp size={20} />
    </button>
  );
};

// TODO:
// 未來考慮建立 SCSS / JS 共用 breakpoint token system
// 避免 layout breakpoint 與 JS breakpoint 不同步
export default GoTop;
