import { useEffect, useState } from 'react';
import { FaCartPlus, FaSearch } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';

// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

// services
// import { getProducts } from '@/services/productService';
import { addsCartItem } from '@/services/cartService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useProducts } from '@/hooks/product/useProducts';
import { useCartActions } from '@/hooks/cart/useCartActions';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import PageLoader from '@/components/shared/PageLoader';
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  // api的category 格式是 DeskLiving-Plant-Succulent，split 分類： Theme-Type-Species， const { themeCategory, themeSubcategory, themeDetail } = searchParams.get('category').split('-');
  // 但是目前 home傳值：'/products?theme=DeskLiving'，直接使用即可
  const theme = searchParams.get('theme');
  const currentTheme = theme ? CATEGORY_THEME_MAP[theme] : CATEGORY_THEME_MAP.AllProducts;

  const { showError } = useToast();
  const { products, isLoading, fetchProducts } = useProducts({ isAdmin: false });
  const { refreshCart } = useCartActions();

  // show 錯誤訊息狀態
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  // theme filter
  const filteredProducts = theme
    ? products.filter((product) => {
        return product.category?.startsWith(theme);
      })
    : products;

  // 目前分類準備：flowers
  const isEmpty = Array.isArray(filteredProducts) && filteredProducts.length === 0;

  // 取得商品列表
  const initProducts = async () => {
    setErrorMessage('');

    try {
      // if (category) {
      //   // api的 category 格式是 DeskLiving-Plant-Succulent，所以完整category字串查詢
      //   await fetchProducts({ category: 'DeskLiving-Plant-Succulent' });
      // } else {
      //   await fetchProducts();
      // }
      await fetchProducts();
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        setErrorMessage,
        '取得產品列表失敗，請稍後再試。',
      );
      showError(errorMessage);
    }
  };

  useEffect(() => {
    initProducts();
    // 由於前端 filter，所以theme 改變 不需要重新 fetchProducts()

    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  // 加入購物車
  const handleAddCartItem = async (product_id, qty = 1) => {
    // setIsScreenLoading(true); // 加入購物車不需要整個畫面都 loading，改為按鈕局部 loading
    if (loadingItems[product_id]) return; // 防止重複點擊
    if (!product_id || qty < 1) return;

    setLoadingItems((prev) => ({
      ...prev,
      [product_id]: true,
    }));

    try {
      await addsCartItem(product_id, qty);
      await refreshCart();
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setErrorMessage, '加入購物車失敗');
      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [product_id]: false,
      }));
    }
  };

  return (
    <>
      {/* Hero-Section、ui-container--product、product-hero、product-main...尚未切板完成(可參考cart切版)，請home切板後接續 */}
      <div className="container ui-container ui-container--product">
        {/* Hero-Section */}
        {currentTheme && (
          <div className="product-hero">
            <h1
              className="page-title"
              key={currentTheme.code}
              data-aos="flip-left"
              data-aos-delay="300"
            >
              {currentTheme.label} - {currentTheme.intro}
            </h1>
          </div>
        )}
        <div className="product-main mt-4">
          {errorMessage && (
            <div className="mx-auto alert alert-danger w-50 text-center">{errorMessage}</div>
          )}
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th style={{ minWidth: '200px', width: 'auto', maxWidth: '280px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {isEmpty ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    目前沒有商品，請更換分類
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td style={{ width: '200px' }}>
                      <ProductImage src={product.imageUrl} alt={product.title} size="medium" />
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <del className="h6">原價 {product.origin_price} 元</del>
                      <div className="h5">特價 {product.price}元</div>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/product/${product.id}`}
                          type="button"
                          className="btn btn-outline-secondary d-flex align-items-center gap-1"
                        >
                          <FaSearch size={16} />
                          查看更多
                        </Link>
                        {/* BtnLoader 参考範例 */}
                        <button
                          disabled={loadingItems[product.id]}
                          onClick={() => handleAddCartItem(product.id)}
                          type="button"
                          className="btn btn-outline-danger d-flex align-items-center gap-1"
                        >
                          {loadingItems[product.id] ? (
                            <>
                              <BtnLoader aria-hidden="true" size="sm" />
                              加入中...
                            </>
                          ) : (
                            <>
                              <FaCartPlus size={16} />
                              加入購物車
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PageLoader show={isLoading} zIndex={2000} />
    </>
  );
};

export default ProductsPage;
