import { useState, useCallback } from 'react';
import { getAdminProducts } from '@/services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  // const fn = useCallback(() => {
  //   // function內容
  // }, [依賴]);
  // 👉 跟 useEffect 很像對吧？ ✔ 沒錯，本質一樣（都是 dependency 控制）
  // useEffect =>	控制「副作用什麼時候執行」；useCallback => 控制「function 什麼時候更新」

  // 改用 useCallback 包裹 getProducts 函式，確保在依賴項不變的情況下不會重新生成函式，提升效能。
  // useCallback = 用 dependency 陣列控制 function 什麼時候要「重新生成」，如果依賴的值沒變，
  // 就會回傳之前生成的 function，避免不必要的重新生成，提升效能。
  // 情況1：空依賴
  // const getProducts = useCallback(() => {
  //   console.log('run');
  // }, []);
  // 👉 結果： ✔ 只建立一次 ✔ 永遠同一個 function ✔ 不會變

  // 情況2：有依賴
  // const getProducts = useCallback(() => {
  //   console.log(page);
  // }, [page]);
  // 👉 結果： ✔ page 變 → function 重新建立  ✔ page 不變 → function 不變

  //===========================================================================
  const getProducts = useCallback(async (page = 1) => {
    const { products, pagination } = await getAdminProducts(page);
    setProducts(products);
    setPageInfo(pagination);
  }, []);

  return {
    products,
    pageInfo,
    getProducts,
  };
};
