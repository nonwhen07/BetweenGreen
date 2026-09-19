const ProductDetailTabs = ({ currentProduct }) => {
  return (
    <section className="product-detail-tabs">
      <div className="product-detail-tabs__grid">
        {/* 商品介紹 */}
        <article className="product-detail-tabs__section">
          <h2 className="product-detail-tabs__title">商品特色</h2>

          <div className="product-detail-tabs__content">
            {/* description 暫代商品特色；後台 API 增加 productStory 後再切換欄位。 */}
            <p>{currentProduct?.description}</p>
          </div>
        </article>

        {/* 養護指南 */}
        <article className="product-detail-tabs__section">
          <h2 className="product-detail-tabs__title">養護指南</h2>

          <div className="product-detail-tabs__content">
            <ul>
              <li>明亮散射光環境</li>
              <li>每週澆水一次</li>
              <li>避免長時間積水</li>
              <li>保持室內通風</li>
            </ul>
          </div>
        </article>

        {/* 配送說明 */}
        <article className="product-detail-tabs__section">
          <h2 className="product-detail-tabs__title">配送說明</h2>

          <div className="product-detail-tabs__content">
            <ul>
              <li>滿 NT$999 免運</li>
              <li>約 1-3 個工作天出貨</li>
              <li>專業防撞包裝</li>
              <li>到貨枯萎補寄保障</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProductDetailTabs;
