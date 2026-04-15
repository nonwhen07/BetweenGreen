import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router/index';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // 動畫持續時間
      once: true, // 是否只跑一次
    });
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
