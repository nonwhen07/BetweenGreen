import noImage from '@/assets/images/no-image.png';

function ProductImage({ src, alt, size = 'medium' /*, showWatermark = true */ }) {
  const isFallback = !src;

  return (
    <div
      className={`product-image product-image--${size} ${
        isFallback ? 'product-image--fallback' : ''
      }`}
    >
      <img
        className="product-image__media"
        src={src || noImage}
        alt={alt || 'product'}
        onError={(e) => {
          e.target.src = noImage;
        }}
      />
    </div>
  );
}

export default ProductImage;
