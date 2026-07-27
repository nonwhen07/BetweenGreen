import { getProductUnitShortLabel } from '@/utils/productFormatter';

const getSafeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// 將購物車商品與六角 API order.products 統一成 readonly item 格式
export const normalizeOrderItems = (products) => {
  if (!products) return [];

  const items = Array.isArray(products)
    ? products
    : Object.entries(products).map(([entryId, item]) => ({
        ...item,
        entryId,
      }));

  return items.map((item) => {
    const product = item.product || {};

    const price = getSafeNumber(item.price ?? product.price);

    const qty = getSafeNumber(item.qty);

    const rawUnit = item.unit ?? product.unit ?? '';

    return {
      ...item,

      displayId: item.displayId || item.entryId || item.id || item.product_id || product.id || '',

      title: item.title || product.title || `商品 ID：${item.product_id || product.id || '—'}`,

      imageUrl: item.imageUrl || product.imageUrl || '',

      price,

      qty,

      unit: getProductUnitShortLabel(rawUnit) || rawUnit || '未設定單位',

      total: getSafeNumber(item.final_total ?? item.total ?? price * qty),
    };
  });
};
