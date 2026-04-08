// productModal 資料狀態的預設值，由於六角API可以彈性新增欄位(rating: 0,)，
// 因此在這裡也要確保即使API回傳的產品物件中沒有rating欄位，
// tempProduct的初始狀態仍然包含rating: 0，避免後續操作出錯
export const DEFAULT_PRODUCT = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
  rating: 0, // ⭐新增
};
