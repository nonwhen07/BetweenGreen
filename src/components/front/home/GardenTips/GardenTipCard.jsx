const GardenTipCard = ({ tip }) => {
  return (
    <div className="garden-tip-card card border-0 h-100 shadow-sm">
      <img
        src={tip.image}
        alt={tip.title}
        className="card-img-top"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = tip.fallbackImage;
        }}
      />

      <div className="card-body">
        <h5 className="card-title">{tip.title}</h5>

        <p className="card-text text-muted">{tip.description}</p>

        {/* TODO(Article detail)：建立前台文章詳情路由後改用 Link。 */}
        {/* <Link to={`/tips/${tip.id}`}> */}
        <a href="#" className="btn btn-outline-success btn-sm">
          閱讀更多
        </a>
      </div>
    </div>
  );
};

export default GardenTipCard;
