import { NavLink } from 'react-router-dom';
import logo from '@/assets/logoBG.png';

//{ variant = 'light' }
const Logo = () => {
  return (
    <NavLink to="/" className={`logo`}>
      <img src={logo} alt="Between Green" className="logo__img" />
    </NavLink>
  );
};

export default Logo;
