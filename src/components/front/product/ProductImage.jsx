import noImage from '@/assets/images/no-image.png';

const ProductImage = ({ product }) => {
  const isEmptySrc = !product.imageUrl || product.imageUrl.trim() === '';

  return (
    <div className="border rounded overflow-hidden">
      <img
        // src={product?.imageUrl || ''}
        src={!isEmptySrc ? product.imageUrl : noImage}
        alt={product?.title || 'product'}
        className="img-fluid w-100"
      />
    </div>
  );
};

export default ProductImage;
