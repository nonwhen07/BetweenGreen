export const DEFAULT_COUPON = {
  title: '',
  code: '',
  percent: 100,
  due_date: '',
  is_enabled: 1,
};

export const COUPON_PER_PAGE = 10;

// 到期日以「日」為單位判斷；到期當天仍列為有效。
export const COUPON_EXPIRING_SOON_DAYS = 7;
