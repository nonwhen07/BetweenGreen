const NewsletterSection = () => {
  return (
    <section className="ui-section newsletter-section">
      <div className="ui-container">
        <div className="text-center">
          <h2 className="mb-3">Stay Updated</h2>

          <p className="text-muted mb-4">訂閱電子報，獲得最新植物與園藝生活資訊</p>

          <div className="d-flex justify-content-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control w-auto me-2"
            />

            <button className="btn btn-success">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
