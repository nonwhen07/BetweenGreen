import { useCallback } from 'react';

import { useAdminArticles } from '@/hooks/article/useAdminArticles';
import { useArticleHealth } from '@/hooks/article/useArticleHealth';
import { useAdminCoupons } from '@/hooks/coupon/useAdminCoupons';
import { useCouponHealth } from '@/hooks/coupon/useCouponHealth';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { useOrderHealth } from '@/hooks/order/useOrderHealth';
import { useAdminProducts } from '@/hooks/product/useAdminProducts';
import { useProductHealth } from '@/hooks/product/useProductHealth';

const DASHBOARD_MODULES = [
  { key: 'product', label: '商品' },
  { key: 'coupon', label: '優惠券' },
  { key: 'article', label: '文章' },
  { key: 'order', label: '訂單' },
];

export const useAdminDashboardData = () => {
  const productData = useAdminProducts();
  const couponData = useAdminCoupons();
  const articleData = useAdminArticles();
  const orderData = useAdminOrders();

  const productHealth = useProductHealth(productData.products);
  const couponHealth = useCouponHealth(couponData.coupons);
  const articleHealth = useArticleHealth(articleData.articles);
  const orderHealth = useOrderHealth(orderData.orders);

  const loadDashboard = useCallback(async () => {
    const loaders = [
      productData.fetchProducts,
      couponData.fetchCoupons,
      articleData.fetchArticles,
      orderData.fetchOrders,
    ];
    const results = await Promise.allSettled(loaders.map((load) => load()));

    return results.reduce((failures, result, index) => {
      if (result.status === 'rejected') {
        failures.push({
          ...DASHBOARD_MODULES[index],
          reason: result.reason,
        });
      }

      return failures;
    }, []);
  }, [
    articleData.fetchArticles,
    couponData.fetchCoupons,
    orderData.fetchOrders,
    productData.fetchProducts,
  ]);

  return {
    loadDashboard,
    modules: {
      product: { ...productData, health: productHealth },
      coupon: { ...couponData, health: couponHealth },
      article: { ...articleData, health: articleHealth },
      order: { ...orderData, health: orderHealth },
    },
  };
};
