import SectionHeader from '@/components/front/home/Product/SectionHeader';
import ProductSlider from '@/components/front/home/Product/ProductSlider';

const ProductSection = ({ topProducts }) => {
  return (
    <section id="product" className="product-section ui-section">
      <div className=" ui-container">
        {/* <div className="text-center mb-5">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">探索不同風格的植物與花藝</p>
        </div> */}

        <SectionHeader title="Featured Products" link="/products" />
        <p className="section-subtitle">探索不同風格的植物與花藝</p>
        <ProductSlider products={topProducts} />
      </div>
    </section>
  );
};

export default ProductSection;
