import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// assets
// import NO_IMAGE from '@/assets/images/no-image.png';

// services
import { getProductDetail } from '@/services/productService';
import { addCartItem } from '@/services/cartService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useProducts } from '@/hooks/product/useProducts';
import { useCartActions } from '@/hooks/cart/useCartActions';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
// import ProductSwiper from '@/components/front/product/ProductSwiper'; // 已由 ProductGallery 取代；保留一版遷移原因，下一版移除註解。
import ProductGallery from '@/components/front/product/ProductGallery';
import ProductDetailTabs from '@/components/front/product/ProductDetailTabs';
import RelatedProducts from '@/components/front/product/RelatedProducts';
import ProductInfo from '@/components/front/product/ProductInfo';

const ProductDetailPage = () => {
  const { products, fetchProducts } = useProducts({ isAdmin: false });
  const { start, stop } = useLoading();

  // 根據路由的參數命名來取得該命名參數，ex path: 'product/:product_id'
  // 如果是多個參數ex path: 'product/:product_id/:typemode'，則取得方式為 const { product_id, typemode } = useParams();
  const { product_id } = useParams(); // 根據路由參數名稱取得對應值，ex path: 'product/:product_id',
  const { success, showError } = useToast();
  const { refreshCart } = useCartActions();

  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);

  // const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isCartLoading, setCartIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  // const [cartMessage, setCartMessage] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  // const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // 畫面渲染後初步載入產品細項
  useEffect(() => {
    const initDetail = async () => {
      start();
      try {
        const res = await getProductDetail(product_id);

        setProduct(res.data);
        setQtySelect(1);
      } catch (error) {
        const errorMessage = extractErrorMessage(error, setErrorMessage, '取得產品細項失敗');
        showError(errorMessage);
      } finally {
        stop();
      }
    };

    initDetail();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [product_id]);

  //加入購物車
  const handleAddCartItem = async (productId, qty = 1) => {
    if (isCartLoading) return; // 防止重複點擊
    if (!productId || qty < 1) return;
    setCartIsLoading(true);

    try {
      await addCartItem(productId, qty);
      await refreshCart();

      // setCartMessage('✓ 已加入購物車');
      success('✓ 已加入購物車');

      setIsAdded(true); // 成功加入購物車後，設定isAdded為true
      setTimeout(() => {
        // setCartMessage('');
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setErrorMessage, '加入購物車失敗');
      showError(errorMessage);
    } finally {
      setCartIsLoading(false);
    }
  };

  // 取得商品列表
  const initProducts = async () => {
    start();

    try {
      await fetchProducts({});
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '取得產品列表失敗，請稍後再試。');

      showError(errorMessage);
    } finally {
      stop();
    }
  };
  useEffect(() => {
    initProducts();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <main className="product-detail-page">
      <div className="ui-container">
        {errorMessage && (
          <div className="product-detail-page__error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="product-detail">
          <div className="product-detail__layout">
            <div className="product-detail__gallery">
              <ProductGallery currentProduct={product} />
            </div>

            <div className="product-detail__info">
              <ProductInfo
                currentProduct={product}
                qtySelect={qtySelect}
                setQtySelect={setQtySelect}
                addCartItem={handleAddCartItem}
                isLoading={isCartLoading}
                isAdded={isAdded}
              />
            </div>
          </div>

          <div className="product-detail__details">
            <ProductDetailTabs currentProduct={product} />
          </div>

          <div className="product-detail__related">
            <RelatedProducts currentProduct={product} products={products} limit={5} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
