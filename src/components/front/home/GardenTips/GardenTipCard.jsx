const GardenTipCard = ({ tip }) => {
  // TODO: GardenTipsSection 未來升級
  // - 目前使用 static tips data (UI demo)
  // - 可改為 src/data/gardenTipsData.js 或 gardenTips.json
  // - 或接 API (json-server / Hexschool articles)
  // - 未來可延伸 TipsPage / TipsDetailPage
  return (
    <div className="garden-tip-card card border-0 h-100 shadow-sm">
      <img src={tip.image} alt={tip.title} className="card-img-top" loading="lazy" />

      <div className="card-body">
        <h5 className="card-title">{tip.title}</h5>

        <p className="card-text text-muted">{tip.description}</p>

        {/* TODO: 未來改成 React Router */}
        {/* <Link to={`/tips/${tip.id}`}> */}
        <a href="#" className="btn btn-outline-success btn-sm">
          閱讀更多
        </a>
      </div>
    </div>
  );
};

export default GardenTipCard;
