import { ClipboardList, PackageCheck, Sprout } from 'lucide-react';

const ProductDetailTabs = ({ currentProduct }) => {
  return (
    <section className="product-detail-tabs" aria-labelledby="product-details-title">
      <div className="product-detail-tabs__header">
        <p className="product-detail-tabs__eyebrow">Product Notes</p>
        <h2 className="product-detail-tabs__heading" id="product-details-title">
          關於這項選物
        </h2>
      </div>

      <div className="product-detail-tabs__grid">
        <article className="product-detail-tabs__section">
          <span className="product-detail-tabs__icon" aria-hidden="true">
            <Sprout size={21} strokeWidth={1.7} />
          </span>
          <h3 className="product-detail-tabs__title">商品故事</h3>
          <div className="product-detail-tabs__content">
            <p>{currentProduct?.description || '商品故事正在整理中。'}</p>
          </div>
        </article>

        <article className="product-detail-tabs__section">
          <span className="product-detail-tabs__icon" aria-hidden="true">
            <ClipboardList size={21} strokeWidth={1.7} />
          </span>
          <h3 className="product-detail-tabs__title">內容與照護</h3>
          <div className="product-detail-tabs__content">
            <p>{currentProduct?.content || '商品內容與使用資訊正在整理中。'}</p>
          </div>
        </article>

        <article className="product-detail-tabs__section">
          <span className="product-detail-tabs__icon" aria-hidden="true">
            <PackageCheck size={21} strokeWidth={1.7} />
          </span>
          <h3 className="product-detail-tabs__title">配送與服務</h3>
          <div className="product-detail-tabs__content">
            <ul>
              <li>訂單成立後約 1–3 個工作天安排出貨。</li>
              <li>植物與易碎選物採用防撞包裝。</li>
              <li>收到商品後請儘早拆箱並確認狀況。</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProductDetailTabs;
