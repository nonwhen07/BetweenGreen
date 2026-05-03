import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import { DEFAULT_PRODUCT } from '@/constants/productConstants';
// services
import { createProduct, updateProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProductModal = () => {
  // hook 初始化 useForm
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_PRODUCT,
    mode: 'onBlur', // 使用者離開欄位就能先看到錯誤，不會等按確認才全部炸。
  });

  // hook
  const { warning } = useToast();
  // state
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

  // imagesUrl雙重確認函式 - 避免api回傳imagesUrl為空陣列或非陣列，避免後續操作出錯
  const normalizeProduct = (p = {}) => ({
    ...DEFAULT_PRODUCT,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });

  // Modal 控制
  const openProductModal = (mode, product = null) => {
    setModalMode(mode);

    // 更換成 Category、Tags(content)
    if (mode === 'create') {
      setTempProduct({ ...DEFAULT_PRODUCT });
      reset({ ...DEFAULT_PRODUCT }); // modal 開啟時讓 RHF 一起知道現在表單值。
      setCategoryBuilder({
        theme: '',
        type: '',
        species: '',
      });
      setSelectedTags([]);
    } else {
      const normalized = normalizeProduct(product);
      setTempProduct(normalized);
      reset(normalized); // modal 開啟時讓 RHF 一起知道現在表單值。

      setValue('category', normalized.category || '');
      setValue('content', normalized.content || '');
      setValue('imagesUrl', normalized.imagesUrl || ['']);
      setValue('rating', normalized.rating || 0);

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
    reset({ ...DEFAULT_PRODUCT }); // modal 開啟時讓 RHF 一起知道現在表單值。

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

      setValue('category', categoryCode);

      // if (updated.theme && updated.type && updated.species) {
      //   clearErrors('category');
      // } else {
      //   setError('category', {
      //     type: 'manual',
      //     message: '請完整選擇商品分類',
      //   });
      // }
      if (updated.theme && updated.type && updated.species) {
        clearErrors('category');
      }

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

    const contentCode = updatedTags.join('|');
    setTempProduct((prev) => ({
      ...prev,
      // content: updatedTags.join('|'),
      content: contentCode,
    }));

    setValue('content', contentCode);
  };

  // Modal表單
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'rating' ? Number(value) : value,
    }));
    setValue(name, type === 'checkbox' ? checked : name === 'rating' ? Number(value) : value);
  };

  // Modal表單 - Image
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setTempProduct((prev) => {
      const images = [...prev.imagesUrl];
      images[index] = value;
      setValue('imagesUrl', images);

      return {
        ...prev,
        imagesUrl: images,
      };
    });
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    setTempProduct((prev) => {
      const images = [...prev.imagesUrl, ''];
      setValue('imagesUrl', images);

      return {
        ...prev,
        imagesUrl: images,
      };
    });
  };
  const handleDeleteImage = () => {
    setTempProduct((prev) => {
      const images = prev.imagesUrl.slice(0, -1);
      setValue('imagesUrl', images);

      return {
        ...prev,
        imagesUrl: images,
      };
    });
  };

  // form Data
  const formatProductData = (product) => ({
    ...product,
    origin_price: Number(product.origin_price),
    price: Number(product.price),
    is_enabled: product.is_enabled ? 1 : 0,
  });
  // form validate
  const validateProduct = (product) => {
    if (!product.title?.trim()) return '請輸入產品標題';
    // if (!product.category?.trim()) return '請輸入產品分類';
    if (!product.unit?.trim()) return '請輸入產品單位';
    if (product.origin_price === '' || Number(product.origin_price) <= 0) return '請輸入原價';
    if (product.price === '' || Number(product.price) <= 0) return '請輸入售價';

    return null;
  };
  // form Submit
  const handleSubmitProduct = async (formData, onSuccess, onError) => {
    // const submitData = {
    //   ...tempProduct,
    //   ...formData,
    // };
    const submitData = {
      ...formData,
      id: tempProduct.id, //RHF 沒有 register id 欄位，但 update API 需要產品 id。
    };
    setModalError('');

    // const validationError = validateProduct(tempProduct);
    const validationError = validateProduct(submitData);

    if (validationError) {
      setModalError(validationError);
      return false;
    }

    try {
      if (modalMode === 'create') {
        // await createProduct(formatProductData(tempProduct));
        await createProduct(formatProductData(submitData));
      } else {
        // await updateProduct(tempProduct.id, formatProductData(tempProduct));
        await updateProduct(submitData.id, formatProductData(submitData));
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
    // setModalError,

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

    // RHF 工具
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
  };
};
