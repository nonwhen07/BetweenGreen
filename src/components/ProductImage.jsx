import noImage from '@/assets/images/no-image.png';

function ProductImage({ src, alt, size = 'medium', showWatermark = true }) {
  return (
    <div className={`product-img product-img-${size}`}>
      <img
        src={src || noImage}
        alt={alt || 'product'}
        onError={(e) => {
          e.target.src = noImage;
        }}
      />

      {!src && showWatermark && <span className="img-watermark">📦 No Image</span>}
    </div>
  );
}

export default ProductImage;
