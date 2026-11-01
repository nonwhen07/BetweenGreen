import { NavLink } from 'react-router-dom';
import brandMark from '@/assets/images/brand/logo/brand-mark.svg';

const Logo = () => {
  return (
    <NavLink to="/" className="logo" title="回到首頁" aria-label="BetweenGreen，回到首頁">
      <img src={brandMark} alt="" className="logo__img" width="56" height="56" />
      <span className="logo__wordmark" aria-hidden="true">BetweenGreen</span>
    </NavLink>
  );
};

export default Logo;
