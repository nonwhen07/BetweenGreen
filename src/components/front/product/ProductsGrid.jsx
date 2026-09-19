import ProductCard from '@/components/shared/ProductCard';

const ProductsGrid = ({ products = [], onAddCart, loadingItems = {} }) => {
  const isEmpty = Array.isArray(products) && products.length === 0;

  if (isEmpty) {
    return (
      <section className="products-grid">
        <div className="products-grid__empty">目前沒有符合條件的商品</div>
      </section>
    );
  }

  return (
    <section className="products-grid">
      <div className="products-grid__list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddCart={onAddCart}
            loading={loadingItems[product.id]}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsGrid;
