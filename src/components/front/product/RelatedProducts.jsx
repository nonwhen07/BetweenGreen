// components
import ProductCard from '@/components/shared/ProductCard';
import { parseCategoryParts } from '@/constants/productConstants';

const RelatedProducts = ({ currentProduct, products = [], limit = 4 }) => {
  const { theme } = parseCategoryParts(currentProduct?.category);
  const currentThemeKey = theme?.key;

  // console.warn('products:', products);
  const relatedProducts = products
    .filter((item) => {
      const { theme: itemTheme } = parseCategoryParts(item.category);

      return (
        item.id !== currentProduct?.id &&
        itemTheme?.key === currentThemeKey &&
        Number(item.is_enabled) === 1
      );
    })
    .slice(0, limit);

  if (!relatedProducts.length) {
    // console.warn('No related products found for product ID:', currentProduct?.id);
    return null;
  }

  return (
    <section className="related-products mb-5">
      <div className="related-products__header">
        <h2 className="related-products__title">為您推薦 ・ 搭配建議</h2>
        <p className="related-products__subtitle">探索更多相似風格植栽與空間搭配靈感</p>
      </div>

      <div className="row g-4">
        {relatedProducts.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-3">
            <ProductCard product={product} variant="minimal" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
