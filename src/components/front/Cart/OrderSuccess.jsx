const OrderSuccess = () => {
  return (
    <div className="order-success text-center">
      <h2>🎉 訂單已完成</h2>
      <p>感謝您的購買！</p>

      <Link to="/customer-orders" className="btn btn-outline-primary">
        查看訂單
      </Link>
    </div>
  );
};

export default OrderSuccess;
