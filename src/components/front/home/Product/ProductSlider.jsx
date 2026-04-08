import ProductCard from '@/components/front/home/Product/ProductCard';

// 日後可以改成 Swiper
// const ProductGrid = ({ products }) => {
//   return (
//     <div className="product-scroll">
//       {products.map((product) => (
//         <div className="product-scroll-item" key={product.id}>
//           <ProductCard productItem={product} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductGrid;

const ProductSlider = ({ products }) => {
  return (
    <div className="product-slider">
      {products.map((product) => (
        <div key={product.id} className="product-slider-item">
          <ProductCard productItem={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
