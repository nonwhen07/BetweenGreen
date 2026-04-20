import { useSelector } from 'react-redux';
import PageLoader from '@/components/shared/PageLoader';

// PageLoader應該純UI，不應該有商業邏輯，
// 所以抽出去GlobalLoader處理額外邏輯，未來可以額外擴充
const GlobalLoader = () => {
  const loadingCount = useSelector((state) => state.loading.count);

  return <PageLoader show={loadingCount > 0} zIndex={2000} />;
};

export default GlobalLoader;
