import { useEffect, useState } from 'react';
import { FaCartPlus, FaSearch } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
// import clsx from 'clsx';

// constants
import { CATEGORY_THEME_MAP } from '@/constants/productConstants';

// assets
import productsBanner from '@/assets/images/brand/hero/hero-desk.png';

// services
// import { getProducts } from '@/services/productService';
import { addsCartItem } from '@/services/cartService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useProducts } from '@/hooks/product/useProducts';
import { useCartActions } from '@/hooks/cart/useCartActions';
import { usePagination } from '@/hooks/usePagination';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import PageLoader from '@/components/shared/PageLoader';
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';
// import ProductCard from '@/components/front/home/Product/ProductCard';
import ProductCard from '@/components/shared/ProductCard';
import PageHero from '@/components/shared/PageHero';
import ProductsFilter from '@/components/front/product/ProductsFilter';
import ProductsGrid from '@/components/front/product/ProductsGrid';
import BrandPagination from '@/components/shared/BrandPagination';

const ProductsPage = () => {
  const PRODUCTS_PER_PAGE = 12;
  // const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  // api的category 格式是 DeskLiving-Plant-Succulent，split 分類： Theme-Type-Species， const { themeCategory, themeSubcategory, themeDetail } = searchParams.get('category').split('-');
  // 但是目前 home傳值：'/products?theme=DeskLiving'，直接使用即可
  const theme = searchParams.get('theme');
  // const currentTheme = theme ? CATEGORY_THEME_MAP[theme] : CATEGORY_THEME_MAP.AllProducts;
  // const [selectedTheme, setSelectedTheme] = useState('AllProducts');
  const initialTheme = theme && CATEGORY_THEME_MAP[theme] ? theme : 'AllProducts';
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);

  const { showError } = useToast();
  const { start, stop } = useLoading();

  const { products, fetchProducts } = useProducts({ isAdmin: false });
  const { refreshCart } = useCartActions();

  const [selectedType, setSelectedType] = useState('');

  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  // sort
  const [sortType, setSortType] = useState('latest');

  // theme filter
  // const filteredProducts = theme
  //   ? products.filter((product) => {
  //       return product.category?.startsWith(theme);
  //     })
  //   : products;

  const themeFilteredProducts =
    selectedTheme === 'AllProducts'
      ? products
      : products.filter((product) => product.category?.startsWith(selectedTheme));

  const filteredProducts = !selectedType
    ? themeFilteredProducts
    : themeFilteredProducts.filter((product) => {
        const [, type] = product.category.split('-');

        return type === selectedType;
      });

  // const fullyFilteredProducts = !selectedType
  //   ? themeFilteredProducts
  //   : themeFilteredProducts.filter((product) => {
  //       const [, type] = product.category.split('-');

  //       return type === selectedType;
  //     });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case 'highPrice':
        return b.price - a.price;

      case 'lowPrice':
        return a.price - b.price;

      case 'popular':
        return (b.rating || 0) - (a.rating || 0);

      case 'latest':
      default:
        return b.create_at - a.create_at;
    }
  });

  // const totalPages = Math.max(1, Math.ceil(fullyFilteredProducts.length / PRODUCTS_PER_PAGE));
  // const currentPageProducts = useMemo(() => {
  //   const start = (page - 1) * PRODUCTS_PER_PAGE;

  //   return fullyFilteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  // }, [fullyFilteredProducts, page]);
  const {
    page,
    totalPages,
    currentItems: currentPageProducts,
    goToPage,
    resetPage,
  } = usePagination({
    items: sortedProducts,
    perPage: PRODUCTS_PER_PAGE,
  });

  // 目前分類準備：flowers
  // const isEmpty = Array.isArray(filteredProducts) && filteredProducts.length === 0;

  // 取得商品列表
  const initProducts = async () => {
    // setErrorMessage('');
    start();

    try {
      await fetchProducts();
    } catch (error) {
      // const errorMessage = extractErrorMessage(
      //   error,
      //   setErrorMessage,
      //   '取得產品列表失敗，請稍後再試。',
      // );
      const errorMessage = extractErrorMessage(error, '', '取得產品列表失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      stop();
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
      // const errorMessage = extractErrorMessage(error, setErrorMessage, '加入購物車失敗');
      const errorMessage = extractErrorMessage(error, '', '加入購物車失敗');
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
      {/* <div className="container ui-container ui-container--product">
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
      </div> */}

      <div className="products-page">
        {/* <PageHero /> */}
        <PageHero
          eyebrow="Between Green Collection"
          title="探索植感生活選物"
          text="從書桌陪伴、陽台生活到空間造景，找到適合你日常節奏的植物與生活提案。"
          backgroundImage={productsBanner}
          tone=""
          align="left"
          size="md"
        />

        <section className="products-page__section ui-section mt-3">
          <div className="ui-container">
            {/* top filter area */}
            <div className="products-page__toolbar">
              <ProductsFilter
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                setSearchParams={setSearchParams}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                sortType={sortType}
                setSortType={setSortType}
                // setPage={setPage}
                resetPage={resetPage}
              />
            </div>

            {/* products grid & pagination */}
            <div className="products-page__content mt-4">
              <ProductsGrid products={currentPageProducts} />

              {/* {totalPages > 1 && (
                <nav className="brand-pagination" aria-label="Pagination">
                  <button
                    type="button"
                    className="brand-pagination__item"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={clsx('brand-pagination__item', page === pageNum && 'is-active')}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="brand-pagination__item"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    ›
                  </button>
                </nav>
              )} */}

              <BrandPagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductsPage;
