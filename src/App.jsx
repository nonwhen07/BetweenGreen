import { RouterProvider } from 'react-router-dom';
import router from '@/router/index'; //@有問題晚點處理

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
