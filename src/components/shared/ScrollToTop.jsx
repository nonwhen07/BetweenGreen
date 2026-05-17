import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.scrollY !== 0) {
      // 避免超長 smooth scroll
      const behaviorType = window.scrollY >= 1200 ? 'auto' : 'smooth';
      // accessibility（無障礙）設定，問問瀏覽器：使用者有沒有開「減少動態效果」？
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : behaviorType,
      });
    }
  }, [location]);

  return null;
};

export default ScrollToTop;
