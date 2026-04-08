// src/layouts/FooterLayout.jsx

import { Link } from 'react-router-dom';

const FrontFooter = () => {
  return (
    <>
      <footer className="footer border-top border-body py-4">
        <div className="container text-center">
          <div className="">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} 本網站僅供個人作品使用，不提供商業用途
              <span> | </span>
              <Link className="text-light text-decoration-none" to={'/login'}>
                登入後台
              </Link>
            </p>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <a href="https://facebook.com" target="_blank" className="text-light">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" className="text-light">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" className="text-light">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FrontFooter;
