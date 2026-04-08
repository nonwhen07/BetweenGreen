const reviews = [
  {
    id: 1,
    name: 'Amy',
    comment: '植物品質很好，包裝也很仔細。',
  },
  {
    id: 2,
    name: 'Jason',
    comment: '第一次買盆栽，附的照護說明很清楚。',
  },
  {
    id: 3,
    name: 'Linda',
    comment: '送朋友當生日禮物很適合。',
  },
];

const ReviewSection = () => {
  return (
    <section className="ui-section review-section">
      <div className="ui-container">
        <div className="text-center mb-5">
          <h2>Customer Reviews</h2>
        </div>

        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <p className="mb-3">⭐ ⭐ ⭐ ⭐ ⭐</p>

                  <p className="text-muted">{review.comment}</p>

                  <p className="fw-bold mb-0">— {review.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
