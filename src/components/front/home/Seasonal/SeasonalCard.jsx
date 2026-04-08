const SeasonalProductCard = ({ product }) => {
  return (
    <div className="card border-0 h-100 shadow-sm">
      <img src={product.image} alt={product.title} className="card-img-top" loading="lazy" />

      <div className="card-body text-center">
        <h6 className="card-title">{product.title}</h6>

        <p className="text-success fw-bold mb-3">${product.price}</p>

        <button className="btn btn-outline-success btn-sm">View Product</button>
      </div>
    </div>
  );
};

export default SeasonalProductCard;
