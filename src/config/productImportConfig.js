// utils
import { formatCategoryPreview } from '@/utils/product/productFormatter';

import { createProduct } from '@/services/productService';

export const productImportConfig = {
  itemType: '商品',

  requiredFields: ['title', 'category', 'price'],

  createService: createProduct,

  previewColumns: [
    {
      key: 'title',
      label: '商品名稱',
    },

    {
      key: 'category',
      label: '商品分類',
      // map: PRODUCT_CATEGORY_MAP,
      formatter: formatCategoryPreview,
    },

    {
      key: 'price',
      label: '售價',
    },
  ],
};
