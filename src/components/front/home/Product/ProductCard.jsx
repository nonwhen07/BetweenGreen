const ProductCard = ({ productItem }) => {
  // const productItem = {
  //   title: 'Monstera Deliciosa',
  //   price: 35,
  //   image: '/img/product-plant.jpg',
  // };

  return (
    <div className="card-product">
      <div className="card-product__image">
        <img src={productItem.imageUrl} alt={productItem.title} loading="lazy" />
      </div>

      <div className="card-product__body">
        <h3 className="card-product__title">{productItem.title}</h3>

        <p className="card-product__price">${productItem.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
