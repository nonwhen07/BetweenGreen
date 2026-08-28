import { getProductUnitShortLabel } from '@/utils/product/productFormatter';

const getSafeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

export const createOrderProductLookup = (products = []) => {
  return new Map(products.filter((product) => product?.id).map((product) => [product.id, product]));
};

// 將購物車商品與六角 API order.products 統一成 readonly item 格式
export const normalizeOrderItems = (products, productLookup = new Map()) => {
  if (!products) return [];

  const items = Array.isArray(products)
    ? products
    : Object.entries(products).map(([entryId, item]) => ({
        ...item,
        entryId,
      }));

  return items.map((item) => {
    const product = item.product || {};

    const productId = item.product_id || product.id || '';

    const catalogProduct = productLookup.get(productId);

    const orderImageUrl = item.imageUrl || product.imageUrl || '';

    const price = getSafeNumber(item.price ?? product.price);

    const qty = getSafeNumber(item.qty);

    const rawUnit = item.unit ?? product.unit ?? catalogProduct?.unit ?? '';

    return {
      ...item,

      productId,

      displayId: item.displayId || item.entryId || item.id || item.product_id || product.id || '',

      title: item.title || product.title || catalogProduct?.title || `商品 ID：${productId || '—'}`,

      imageUrl: orderImageUrl || catalogProduct?.imageUrl || '',

      usesCatalogImage: !orderImageUrl && Boolean(catalogProduct?.imageUrl),

      catalogStatus: catalogProduct
        ? Number(catalogProduct.is_enabled) === 1
          ? 'enabled'
          : 'disabled'
        : 'missing',

      price,

      qty,

      unit: getProductUnitShortLabel(rawUnit) || rawUnit || '未設定單位',

      total: getSafeNumber(item.final_total ?? item.total ?? price * qty),
    };
  });
};
