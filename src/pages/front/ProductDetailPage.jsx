import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, SearchX } from 'lucide-react';

// services
import { getProductDetail } from '@/services/productService';
import { addCartItem } from '@/services/cartService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useProducts } from '@/hooks/product/useProducts';
import { useCartActions } from '@/hooks/cart/useCartActions';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import ProductGallery from '@/components/front/product/ProductGallery';
import ProductDetailTabs from '@/components/front/product/ProductDetailTabs';
import RelatedProducts from '@/components/front/product/RelatedProducts';
import ProductInfo from '@/components/front/product/ProductInfo';

const ProductDetailPage = () => {
  const { products, fetchProducts } = useProducts();
  const { product_id } = useParams();
  const { success, showError } = useToast();
  const { refreshCart } = useCartActions();

  const [product, setProduct] = useState(null);
  const [detailStatus, setDetailStatus] = useState('loading');
  const [detailError, setDetailError] = useState('');
  const [qtySelect, setQtySelect] = useState(1);
  const [isCartLoading, setCartIsLoading] = useState(false);
  const [cartError, setCartError] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const detailRequestId = useRef(0);
  const addedTimerRef = useRef(null);

  const loadProductDetail = useCallback(async () => {
    const requestId = detailRequestId.current + 1;

    detailRequestId.current = requestId;
    setDetailStatus('loading');
    setDetailError('');
    setCartError('');

    try {
      const res = await getProductDetail(product_id);
      const nextProduct = res.data;

      if (detailRequestId.current !== requestId) return;

      if (!nextProduct?.id || Number(nextProduct.is_enabled) !== 1) {
        setProduct(null);
        setDetailStatus('not-found');
        return;
      }

      setProduct(nextProduct);
      setQtySelect(1);
      setDetailStatus('success');
    } catch (error) {
      if (detailRequestId.current !== requestId) return;

      setProduct(null);

      if (error?.response?.status === 404) {
        setDetailStatus('not-found');
        return;
      }

      setDetailError(extractErrorMessage(error, null, '商品資料暫時無法載入，請稍後再試。'));
      setDetailStatus('error');
    }
  }, [product_id]);

  useEffect(() => {
    loadProductDetail();

    return () => {
      detailRequestId.current += 1;
    };
  }, [loadProductDetail]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    return () => window.clearTimeout(addedTimerRef.current);
  }, []);

  const handleAddCartItem = async (productId, qty = 1) => {
    if (isCartLoading) return;
    if (!productId || qty < 1 || Number(product?.is_enabled) !== 1) return;

    setCartError('');
    setCartIsLoading(true);

    try {
      await addCartItem(productId, qty);
      await refreshCart();

      success('✓ 已加入購物車');
      setIsAdded(true);
      window.clearTimeout(addedTimerRef.current);
      addedTimerRef.current = window.setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setCartError, '加入購物車失敗');

      showError(errorMessage);
    } finally {
      setCartIsLoading(false);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="ui-container">
        <Link className="product-detail-page__back" to="/products">
          <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
          返回商品目錄
        </Link>

        {detailStatus === 'loading' && (
          <div className="product-detail-skeleton" aria-busy="true" aria-label="商品資料載入中">
            <div className="product-detail-skeleton__gallery" aria-hidden="true" />
            <div className="product-detail-skeleton__info" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="sr-only" role="status">
              商品資料載入中
            </span>
          </div>
        )}

        {detailStatus === 'error' && (
          <div className="product-detail-page__state" role="alert">
            <span className="product-detail-page__state-icon" aria-hidden="true">
              <RefreshCw size={26} strokeWidth={1.6} />
            </span>
            <div>
              <h1>商品資料暫時無法載入</h1>
              <p>{detailError}</p>
            </div>
            <button
              className="ui-btn ui-btn--outline-primary"
              type="button"
              onClick={loadProductDetail}
            >
              再試一次
            </button>
          </div>
        )}

        {detailStatus === 'not-found' && (
          <div className="product-detail-page__state" role="status">
            <span className="product-detail-page__state-icon" aria-hidden="true">
              <SearchX size={26} strokeWidth={1.6} />
            </span>
            <div>
              <h1>找不到這項商品</h1>
              <p>商品可能已下架、網址已更新，或目前暫停公開。</p>
            </div>
            <Link className="ui-btn ui-btn--outline-primary" to="/products">
              瀏覽其他商品
            </Link>
          </div>
        )}

        {detailStatus === 'success' && product && (
          <div className="product-detail">
            {cartError && (
              <div className="product-detail-page__error" role="alert">
                {cartError}
              </div>
            )}

            <div className="product-detail__layout">
              <div className="product-detail__gallery">
                <ProductGallery key={product.id} currentProduct={product} />
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
              <RelatedProducts currentProduct={product} products={products} limit={4} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
