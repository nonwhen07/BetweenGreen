import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// components
import ProductCard from '@/components/shared/ProductCard';
// constants
import { parseCategoryParts } from '@/constants/productConstants';

const RelatedProducts = ({ currentProduct, products = [], limit = 4 }) => {
  const { theme, type } = parseCategoryParts(currentProduct?.category);
  const currentThemeCode = theme?.code;
  const currentTypeCode = type?.code;

  const relatedProducts = products
    .filter((item) => item.id !== currentProduct?.id && Number(item.is_enabled) === 1)
    .map((item, index) => {
      const itemCategory = parseCategoryParts(item.category);
      const sameTheme = itemCategory.theme?.code === currentThemeCode;
      const sameType = itemCategory.type?.code === currentTypeCode;

      return {
        item,
        index,
        score: (sameTheme ? 2 : 0) + (sameType ? 1 : 0),
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);

  if (!relatedProducts.length) {
    return null;
  }

  const viewMoreUrl = currentThemeCode
    ? `/products?theme=${encodeURIComponent(currentThemeCode)}`
    : '/products';

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <div className="related-products__header">
        <div>
          <p className="related-products__eyebrow">More to Explore</p>
          <h2 className="related-products__title" id="related-products-title">
            延伸你的植感選擇
          </h2>
          <p className="related-products__subtitle">依照相同主題與商品類型，挑選更多搭配靈感。</p>
        </div>

        <Link className="related-products__link" to={viewMoreUrl}>
          瀏覽同主題
          <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>

      <div className="related-products__grid">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} variant="related" />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
