import { useState } from 'react';

// constants
import { DEFAULT_PRODUCT } from '@/constants/productConstants';
// services
import { createProduct, updateProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProductModal = () => {
  const { warning } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [tempProduct, setTempProduct] = useState(DEFAULT_PRODUCT);
  const [modalError, setModalError] = useState('');

  const [categoryBuilder, setCategoryBuilder] = useState({
    theme: '',
    type: '',
    species: '',
  });

  const [selectedTags, setSelectedTags] = useState([]);

  // imagesUrl雙重確認函式 - 確保即使api回傳的product物件中imagesUrl為空陣列或非陣列，
  // 也能正確設定tempProduct的imagesUrl為至少包含一個空字串的陣列，避免後續操作出錯
  const normalizeProduct = (p = {}) => ({
    ...DEFAULT_PRODUCT,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });

  // Modal 控制
  const openProductModal = (mode, product = null) => {
    setModalMode(mode);

    // if (mode === 'create') {
    //   setTempProduct({ ...DEFAULT_PRODUCT });
    // } else {
    //   setTempProduct(normalizeProduct(product));
    // }
    if (mode === 'create') {
      setTempProduct({ ...DEFAULT_PRODUCT });
      setCategoryBuilder({
        theme: '',
        type: '',
        species: '',
      });
      setSelectedTags([]);
    } else {
      const normalized = normalizeProduct(product);
      setTempProduct(normalized);

      const [theme = '', type = '', species = ''] = normalized.category?.split('-') || [];

      setCategoryBuilder({
        theme,
        type,
        species,
      });

      setSelectedTags(normalized.content ? normalized.content.split('|') : []);
    }

    setModalError('');
    setIsModalOpen(true);
  };

  // 關閉 modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    setModalError('');
    setTempProduct({ ...DEFAULT_PRODUCT });

    // 清除 category、 tag 的資料
    setCategoryBuilder({
      theme: '',
      type: '',
      species: '',
    });

    setSelectedTags([]);
  };

  // category 控制函式
  const handleCategoryBuilderChange = (field, value) => {
    setCategoryBuilder((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === 'theme') {
        updated.type = '';
        updated.species = '';
      }

      if (field === 'type') {
        updated.species = '';
      }

      const categoryCode = [updated.theme, updated.type, updated.species].filter(Boolean).join('-');

      setTempProduct((prevProduct) => ({
        ...prevProduct,
        category: categoryCode,
      }));

      return updated;
    });
  };

  // tag 控制函式
  const handleTagToggle = (tagKey) => {
    let updatedTags = [];

    if (selectedTags.includes(tagKey)) {
      updatedTags = selectedTags.filter((tag) => tag !== tagKey);
    } else {
      if (selectedTags.length >= 4) {
        warning('商品屬性標籤最多選擇 4 個');
        return;
      }
      updatedTags = [...selectedTags, tagKey];
    }

    setSelectedTags(updatedTags);

    setTempProduct((prev) => ({
      ...prev,
      content: updatedTags.join('|'),
    }));
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

  //
  const formatProductData = (product) => ({
    ...product,
    origin_price: Number(product.origin_price),
    price: Number(product.price),
    is_enabled: product.is_enabled ? 1 : 0,
  });

  const validateProduct = (product) => {
    if (!product.title?.trim()) return '請輸入產品標題';
    if (!product.category?.trim()) return '請輸入產品分類';
    if (!product.unit?.trim()) return '請輸入產品單位';
    if (product.origin_price === '' || Number(product.origin_price) <= 0) return '請輸入原價';
    if (product.price === '' || Number(product.price) <= 0) return '請輸入售價';

    return null;
  };

  const handleSubmitProduct = async (onSuccess, onError) => {
    setModalError('');

    const validationError = validateProduct(tempProduct);

    if (validationError) {
      setModalError(validationError);
      return false;
    }

    try {
      if (modalMode === 'create') {
        await createProduct(formatProductData(tempProduct));
      } else {
        await updateProduct(tempProduct.id, formatProductData(tempProduct));
      }

      closeProductModal();
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '更新產品失敗，請稍後再試。');
      onError?.(errorMessage);
      return false;
    }
  };

  return {
    modalMode,
    tempProduct,
    setTempProduct,
    modalError,
    setModalError,

    isModalOpen,
    openProductModal,
    closeProductModal,

    handleModalInputChange,
    handleImageChange,
    handleAddImage,
    handleDeleteImage,

    categoryBuilder,
    selectedTags,
    handleCategoryBuilderChange,
    handleTagToggle,

    handleSubmitProduct,
  };
};
