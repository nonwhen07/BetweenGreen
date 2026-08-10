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

      {/* {isFallback && showWatermark && <span className="product-image__watermark">No Image</span>} */}
    </div>
  );
}

export default ProductImage;
