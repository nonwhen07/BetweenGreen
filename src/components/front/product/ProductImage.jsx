const ProductImage = ({ product }) => {
  return (
    <div className="border rounded overflow-hidden">
      <img
        src={product?.imageUrl || ''}
        alt={product?.title || 'product'}
        className="img-fluid w-100"
      />
    </div>
  );
};

export default ProductImage;
