import { Link } from 'react-router-dom';
import { ArrowRight, Home, Leaf } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <section
      className="ui-section ui-section--full not-found-page"
      aria-labelledby="not-found-title"
    >
      <div className="ui-container not-found-page__container">
        <div className="not-found-page__visual" aria-hidden="true">
          <span className="not-found-page__code">404</span>
          <span className="not-found-page__leaf not-found-page__leaf--one">
            <Leaf />
          </span>
          <span className="not-found-page__leaf not-found-page__leaf--two">
            <Leaf />
          </span>
        </div>

        <div className="not-found-page__content">
          <p className="not-found-page__eyebrow">Lost in the green</p>
          <h1 className="not-found-page__title" id="not-found-title">
            這個角落還沒長出來
          </h1>
          <p className="not-found-page__description">
            你尋找的頁面可能已經移動、暫時休息，或從來沒有存在過。
            <br />
            沒關係，讓我們帶你回到熟悉的綠意裡。
          </p>

          <nav className="not-found-page__actions" aria-label="找不到頁面的後續選項">
            <Link className="ui-btn ui-btn--primary ui-btn--lg" to="/">
              <Home size={18} aria-hidden="true" />
              回到首頁
            </Link>
            <Link className="ui-btn ui-btn--outline-primary ui-btn--lg" to="/products">
              逛逛植感選物
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
