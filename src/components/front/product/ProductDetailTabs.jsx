const ProductDetailTabs = ({ product }) => {
  return (
    <section className="product-detail-tabs">
      <div className="row g-4">
        {/* 商品介紹 */}
        <div className="col-12 col-md-6 col-lg-4">
          <article className="product-detail-tabs__section">
            <h2 className="product-detail-tabs__title">商品特色</h2>

            <div className="product-detail-tabs__content">
              {/* <p>{product?.productStory}</p>description先替代商品特色，等之後的後台api多開新欄位 product?.productStory 去顯示商品特色 */}
              <p>{product?.description}</p>
            </div>
          </article>
        </div>

        {/* 養護指南 */}
        <div className="col-12 col-md-6 col-lg-4">
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
        </div>

        {/* 配送說明 */}
        <div className="col-12 col-md-6 col-lg-4">
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
      </div>
    </section>
  );
};

export default ProductDetailTabs;
