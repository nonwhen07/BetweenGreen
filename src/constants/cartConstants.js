import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

export const CART_STEPS = [
  {
    id: 1,
    label: '購物車內容',
    hash: '#step1',
    path: 'step1',
    icon: ShoppingCart, // 直接傳遞組件參考
  },
  {
    id: 2,
    label: '填寫資料及付款方式',
    hash: '#step2',
    path: 'step2',
    icon: CreditCard,
  },
  {
    id: 3,
    label: '訂購完成',
    hash: '#step3',
    path: 'step3',
    icon: CheckCircle,
  },
];

// 運費、免運規則統一這邊處理，以後有後端直接從sql-table撈就好
export const shippingFee = 60;
export const minfreeShippingFee = 799;
