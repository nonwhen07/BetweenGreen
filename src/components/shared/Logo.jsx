import { NavLink } from 'react-router-dom';
import logo from '@/assets/images/brand/logo/logoBG.png';

//{ variant = 'logo--light、logo--muted' }
const Logo = () => {
  return (
    <NavLink to="/" className={`logo`} title="回到首頁">
      <img src={logo} alt="Between Green.png" className="logo__img" />
    </NavLink>
  );
};

export default Logo;
