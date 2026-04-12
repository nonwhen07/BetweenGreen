import { useState } from 'react';
// import { createProduct, updateProduct } from '@/services/productService';

// hooks
// import { useToast } from '@/hooks/useToast';
// utils
// import { extractErrorMessage } from '@/utils/errorHandler';

// Modal 資料狀態的預設值，由於六角API可以彈性新增欄位(rating: 0,)，
// 因此在這裡也要確保即使API回傳的產品物件中沒有rating欄位，
// tempProduct的初始狀態仍然包含rating: 0，避免後續操作出錯
// const DEFAULT_PRODUCT = {
//   imageUrl: '',
//   title: '',
//   category: '',
//   unit: '',
//   origin_price: '',
//   price: '',
//   description: '',
//   content: '',
//   is_enabled: 0,
//   imagesUrl: [''],
//   rating: 0, // ⭐新增
// };
// 為了避免在多個地方重複定義 DEFAULT_PRODUCT，將其抽離到 constants/productConstants.js 中，
import { DEFAULT_PRODUCT } from '@/constants/productConstants';

export const useProductModal = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [tempProduct, setTempProduct] = useState(DEFAULT_PRODUCT);
  const [modalError, setModalError] = useState('');

  // Modal 控制
  // imagesUrl雙重確認函式 - 確保即使api回傳的product物件中imagesUrl為空陣列或非陣列，
  // 也能正確設定tempProduct的imagesUrl為至少包含一個空字串的陣列，避免後續操作出錯
  const normalizeProduct = (p = {}) => ({
    ...DEFAULT_PRODUCT,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });

  // ProductModal
  // const handleOpenProductModal = (mode, product = DEFAULT_PRODUCT) => {
  //   setModalMode(mode);

  //   if (mode === 'create') {
  //     setTempProduct({ ...DEFAULT_PRODUCT });
  //   } else {
  //     setTempProduct(normalizeProduct(product));
  //   }
  //   setIsProductModalOpen(true);
  // };
  const openModal = (mode, product = null) => {
    setModalMode(mode);

    if (mode === 'create') {
      setTempProduct({ ...DEFAULT_PRODUCT });
    } else {
      setTempProduct(normalizeProduct(product));
    }
    setModalError('');
    setIsProductModalOpen(true);
  };

  // Modal表單
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'rating' ? Number(value) : value,
    }));
  };
  const handleImageChange = (e, index) => {
    const { value } = e.target;

    setTempProduct((prev) => {
      const images = [...prev.imagesUrl];
      images[index] = value;

      return {
        ...prev,
        imagesUrl: images,
      };
    });
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ''],
    }));
  };
  const handleDeleteImage = () => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.slice(0, -1),
    }));
  };

  return {
    modalMode,
    openModal,
    tempProduct,
    setTempProduct,
    modalError,
    setModalError,
    isProductModalOpen,
    setIsProductModalOpen,

    handleModalInputChange,
    handleImageChange,
    handleAddImage,
    handleDeleteImage,
  };
};
