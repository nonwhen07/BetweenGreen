import { Link } from 'react-router-dom';

const AdminNotFound = () => {
  return (
    <div className="container">
      <h1>404 - Admin Not Found</h1>
      <Link to="/">回首頁</Link>
    </div>
  );
};

export default AdminNotFound;
