import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

// constants
import { DEFAULT_PRODUCT } from '@/constants/productConstants';
// services
import { createProduct, updateProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';

export const useProductModal = () => {
  // hook 初始化 useForm、useToast
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_PRODUCT,
    mode: 'onBlur', // 使用者離開欄位就能先看到錯誤，不會等按確認才全部炸。
  });
  const { warning } = useToast();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editProductId, setEditProductId] = useState(null);
  const [editProductCreatedAt, setEditProductCreatedAt] = useState(null);
  const [categoryBuilder, setCategoryBuilder] = useState({
    theme: '',
    type: '',
    species: '',
  });
  const [selectedTags, setSelectedTags] = useState([]);

  // derived values（RHF 表單衍生值）
  // 這裡改用 useWatch 監聽副圖陣列，直接 watch 容易跳 IDE 黃提示
  const watchImages = useWatch({
    control,
    name: 'imagesUrl',
  }) || [''];

  // helper functions（資料正規化 / API格式化）
  // 正規化產品資料，順便保底 imagesUrl 一定是可操作的陣列
  const normalizeProduct = (p = {}) => ({
    ...DEFAULT_PRODUCT,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });
  // API submit 前格式整理
  const formatProductData = (product, mode) => ({
    ...product,
    createdAt:
      mode === 'create'
        ? new Date().toISOString()
        : editProductCreatedAt,
    updatedAt: mode === 'create' ? null : new Date().toISOString(),
    origin_price: Number(product.origin_price),
    price: Number(product.price),
    is_enabled: product.is_enabled ? 1 : 0,
  });

  // Modal lifecycle
  const openProductModal = (mode, product = null) => {
    setModalMode(mode);

    // 更換成 Category、Tags(content)
    if (mode === 'create') {
      setEditProductId(null);
      setEditProductCreatedAt(null);
      reset({ ...DEFAULT_PRODUCT }); // modal 開啟時讓 RHF 一起知道現在表單值。
      setCategoryBuilder({
        theme: '',
        type: '',
        species: '',
      });
      setSelectedTags([]);
    } else {
      setEditProductId(product.id);
      setEditProductCreatedAt(product.createdAt ?? null);
      const normalized = normalizeProduct(product);
      reset(normalized); // modal 開啟時讓 RHF 一起知道現在表單值。

      setValue('category', normalized.category || '');
      // setValue('content', normalized.content || '');
      setValue('personalityTags', normalized.personalityTags || '');
      setValue('imagesUrl', normalized.imagesUrl || ['']);
      setValue('rating', normalized.rating || 0);

      const [theme = '', type = '', species = ''] = normalized.category?.split('-') || [];

      setCategoryBuilder({
        theme,
        type,
        species,
      });

      // setSelectedTags(normalized.content ? normalized.content.split('|') : []);
      setSelectedTags(normalized.personalityTags ? normalized.personalityTags.split('|') : []);
    }

    setIsModalOpen(true);
  };
  const closeProductModal = () => {
    setIsModalOpen(false);
    setEditProductId(null);
    setEditProductCreatedAt(null);
    // modal 關閉時重置 RHF 表單
    reset({ ...DEFAULT_PRODUCT });

    // 清除 category、 tag 的資料
    setCategoryBuilder({
      theme: '',
      type: '',
      species: '',
    });

    setSelectedTags([]);
  };

  // Field handlers
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

      setValue('category', categoryCode);

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

    // const contentCode = updatedTags.join('|');
    // setValue('content', contentCode);
    const tagsCode = updatedTags.join('|');
    setValue('personalityTags', tagsCode);
  };
  // Modal表單- 客製欄位(原handleModalInputChange)
  const handleCustomFieldChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValue(name, type === 'checkbox' ? checked : name === 'rating' ? Number(value) : value);
  };
  // Modal表單 - ImageChange
  const handleImageChange = (e, index) => {
    const { value } = e.target;

    const newImages = [...watchImages];
    newImages[index] = value;
    setValue('imagesUrl', newImages);
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    const newImages = [...watchImages, ''];
    setValue('imagesUrl', newImages);
  };
  const handleDeleteImage = () => {
    if (watchImages.length <= 1) return;
    const newImages = watchImages.slice(0, -1);
    setValue('imagesUrl', newImages);
  };
  // form Submit action
  const handleSubmitProduct = async (formData) => {
    // RHF 已接管全部表單資料，僅 edit 模式需額外補上從api資料讀取的產品 id
    const submitData = {
      ...formData,
      id: editProductId,
    };

    const completedMode = modalMode;
    const response =
      completedMode === 'create'
        ? await createProduct(formatProductData(submitData, 'create'))
        : await updateProduct(submitData.id, formatProductData(submitData, 'update'));

    closeProductModal();

    return {
      mode: completedMode,
      response,
    };
  };

  return {
    // Modal lifecycle
    isModalOpen,
    modalMode,
    openProductModal,
    closeProductModal,

    // Field states + handlers
    categoryBuilder,
    selectedTags,
    handleCategoryBuilderChange,
    handleTagToggle,

    handleCustomFieldChange,
    handleImageChange,
    handleAddImage,
    handleDeleteImage,

    // submit action
    handleSubmitProduct,

    // RHF tools
    register,
    handleSubmit,
    watch,
    errors,
  };
};
