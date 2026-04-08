import { useEffect, useState } from 'react';
// import { ChevronUp } from 'react-feather';
import { FaAngleUp } from 'react-icons/fa';

function getShowThreshold() {
  // 可自訂各裝置下的滾動距離
  if (window.innerWidth <= 575.98) return 200;
  if (window.innerWidth <= 991.98) return 250;
  return 400; // desktop
}

const GoTop = () => {
  const [visible, setVisible] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

export default GoTop;
