import { PRODUCT_ADMIN_FIELD_KEYS } from '@/schemas/productAdminSchema';

const pickExportableProductFields = (product) => {
  return PRODUCT_ADMIN_FIELD_KEYS.reduce((result, field) => {
    if (product[field] !== undefined) {
      result[field] = product[field];
    }

    return result;
  }, {});
};

export const buildProductUpdateExport = (products, exportedAt) => {
  const productMap = products.reduce((result, product) => {
    if (!product?.id) return result;

    result[product.id] = pickExportableProductFields(product);
    return result;
  }, {});

  return {
    meta: {
      type: 'product',
      mode: 'update',
      exportedAt,
      total: Object.keys(productMap).length,
    },
    products: productMap,
  };
};

export const buildProductExportFilename = (date = new Date()) => {
  const localDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  return `between-green-products-${localDate}.json`;
};
