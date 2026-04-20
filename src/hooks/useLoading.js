import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@/features/ui/loadingSlice';

// 從toastSlice狀態中抽出
export const useLoading = () => {
  const dispatch = useDispatch();

  const start = () => dispatch(startLoading());
  const stop = () => dispatch(stopLoading());

  return {
    start,
    stop,
  };
};

// export const useLoading = () => {
//   const dispatch = useDispatch();

//   const withLoading = async (asyncFn) => {
//     dispatch(startLoading());
//     try {
//       return await asyncFn();
//     } finally {
//       dispatch(stopLoading());
//     }
//   };

//   return { withLoading };
// };

// 在XXXpage用法：

// const { withLoading } = useLoading();

// await withLoading(async () => {
//   await createOrder(data);
// });
