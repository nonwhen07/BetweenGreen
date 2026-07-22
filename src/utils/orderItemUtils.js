import { getProductUnitShortLabel } from '@/utils/productFormatter';

const getSafeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// 將六角 API 的 order.products 統一轉成陣列
export const normalizeOrderItems = (products) => {
  if (!products) return [];

  const items = Array.isArray(products)
    ? products
    : Object.entries(products).map(([id, item]) => ({
        id,
        ...item,
      }));

  return items.map((item) => {
    const price = getSafeNumber(item.price ?? item.product?.price);
    const qty = getSafeNumber(item.qty);

    return {
      ...item,
      displayId: item.displayId || item.id || item.product_id || '',
      title: item.title || item.product?.title || `商品 ID：${item.product_id || '—'}`,
      imageUrl: item.imageUrl || item.product?.imageUrl || '',
      price,
      qty,
      unit: item.unit || getProductUnitShortLabel(item.product?.unit) || '未設定單位',
      total: getSafeNumber(item.final_total ?? item.total ?? price * qty),
    };
  });
};
