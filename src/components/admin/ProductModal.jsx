import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

// constants
import {
  DEFAULT_PRODUCT,
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  CATEGORY_SPECIES_MAP,
  PRIMARY_CONTENT_TAGS,
  SECONDARY_CONTENT_TAGS,
  PRODUCT_CONTENT_MAP,
  PRODUCT_UNIT_MAP,
  TYPE_SPECIES_RELATION_MAP,
  THEME_TYPE_RELATION_MAP,
} from '@/constants/productConstants';

const ProductModal = ({
  isOpen,
  onClose,
  modalMode,
  tempProduct,
  onModalChange,
  onImageChange,
  addImage,
  deleteImage,
  modalError,
  onConfirm,

  categoryBuilder,
  selectedTags,
  handleCategoryBuilderChange,
  handleTagToggle,

  register,
  handleSubmit,
  setValue,
  watch,
  errors,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [showMoreTags, setShowMoreTags] = useState(false);

  // const images = tempProduct.imagesUrl ?? [''];

  // 商品分類組合
  const typeOptions =
    THEME_TYPE_RELATION_MAP[categoryBuilder.theme]?.map((key) => CATEGORY_TYPE_MAP[key]) || [];

  const speciesOptions =
    TYPE_SPECIES_RELATION_MAP[categoryBuilder.type]?.map((key) => CATEGORY_SPECIES_MAP[key]) || [];

  const categoryPreviewText = [
    CATEGORY_THEME_MAP[categoryBuilder.theme]?.label,
    CATEGORY_TYPE_MAP[categoryBuilder.type]?.label,
    CATEGORY_SPECIES_MAP[categoryBuilder.species]?.label,
  ]
    .filter(Boolean)
    .join(' - ');

  // 商品屬性標籤摘要

  const selectedSecondaryTags = selectedTags.filter((tag) => SECONDARY_CONTENT_TAGS.includes(tag));
  const secondaryTagPreviewText = selectedSecondaryTags
    .map((key) => PRODUCT_CONTENT_MAP[key]?.label)
    .filter(Boolean)
    .join('、');

  // watch
  const watchImageUrl = watch('imageUrl');
  const watchImages = watch('imagesUrl') || [''];
  const watchTitle = watch('title');
  const watchRating = watch('rating');
  const watchCategory = watch('category');
  const watchContent = watch('content');
  const watchUnit = watch('unit');

  const images = watchImages;

  // 單位摘要
  // const unitPreviewText =
  //   Object.values(PRODUCT_UNIT_MAP).find((item) => item.value === tempProduct.unit)?.label || '';
  const unitPreviewText =
    Object.values(PRODUCT_UNIT_MAP).find((item) => item.value === watchUnit)?.label || '';

  if (!isOpen) return null;

  return (
    <div
      id="productModal"
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary border-bottom">
            <h5 className="modal-title text-light fs-4">
              {/* {modalMode === 'create' ? '新增產品' : '編輯 - ' + tempProduct.title} */}
              {modalMode === 'create' ? '新增產品' : '編輯 - ' + (watchTitle || '')}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            {modalError && <div className="alert alert-danger">{modalError}</div>}
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      {...register('imageUrl')}
                      // defaultValue={tempProduct.imageUrl}
                      // value={tempProduct.imageUrl || ''}
                      // onChange={onModalChange}
                      // name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  {/* {tempProduct.imageUrl && (
                    <img src={tempProduct.imageUrl} alt="" className="img-fluid" />
                  )} */}
                  {watchImageUrl && <img src={watchImageUrl} alt="" className="img-fluid" />}
                </div>
                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {images?.length > 0 &&
                    images.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => {
                            onImageChange(e, index);
                          }}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />
                        )}
                      </div>
                    ))}
                </div>
                <div className="btn-group w-100">
                  {images.length < 5 && images[images.length - 1] !== '' && (
                    <button onClick={addImage} className="btn btn-outline-primary btn-sm w-100">
                      新增圖片
                    </button>
                  )}
                  {images.length > 1 && (
                    <button onClick={deleteImage} className="btn btn-outline-danger btn-sm w-100">
                      刪除圖片
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-8">
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      {...register('title')}
                      // defaultValue={tempProduct.title}
                      // value={tempProduct.title}
                      // onChange={onModalChange}
                      // name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">商品評價</label>
                    <div className="d-flex " style={{ fontSize: '24px', cursor: 'pointer' }}>
                      {Array.from({ length: 5 }, (_, i) => {
                        const ratingValue = i + 1;

                        return (
                          <FaStar
                            className="me-1"
                            key={i}
                            size={24}
                            style={{
                              color:
                                // ratingValue <= (hoverRating || tempProduct.rating)
                                ratingValue <= (hoverRating || watchRating) ? '#ffc107' : '#e4e5e9',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={() => setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() =>
                              onModalChange({
                                target: {
                                  name: 'rating',
                                  value: ratingValue,
                                  type: 'number',
                                },
                              })
                            }
                          />
                        );
                      })}
                    </div>

                    {/* <small className="text-muted">已選擇 {tempProduct.rating || 0} 顆星</small> */}
                    <small className="text-muted">已選擇 {watchRating || 0} 顆星</small>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">商品分類組合</label>

                  <div className="row g-3 mb-1">
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={categoryBuilder.theme}
                        onChange={(e) => handleCategoryBuilderChange('theme', e.target.value)}
                      >
                        <option value="">選擇主題分類</option>
                        {Object.values(CATEGORY_THEME_MAP).map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={categoryBuilder.type}
                        onChange={(e) => handleCategoryBuilderChange('type', e.target.value)}
                      >
                        <option value="">選擇商品大類</option>
                        {typeOptions.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={categoryBuilder.species}
                        onChange={(e) => handleCategoryBuilderChange('species', e.target.value)}
                      >
                        <option value="">選擇商品細項</option>
                        {speciesOptions.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-7">
                      <div className="form-control bg-light small text-muted">
                        {/* {tempProduct.category || '尚未生成 category code'} */}
                        {watchCategory || '尚未生成 category code'}
                      </div>
                    </div>
                    <div className="col-md-5 d-flex justify-content-start align-items-center">
                      <div className="small text-secondary">
                        {categoryPreviewText || '尚未生成分類摘要'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">商品屬性標籤</label>

                  {/* 常用標籤 */}
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {PRIMARY_CONTENT_TAGS.map((key) => {
                      const isActive = selectedTags.includes(key);
                      const item = PRODUCT_CONTENT_MAP[key];

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTagToggle(key)}
                          className={`btn btn-sm ${
                            isActive ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 展開更多 */}
                  <div className="row g-3 d-flex align-items-center mb-2">
                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary  text-decoration-none"
                        onClick={() => setShowMoreTags(!showMoreTags)}
                      >
                        {showMoreTags ? '收起更多標籤 ▲' : '展開更多標籤 ▼'}
                      </button>
                    </div>
                    <div className="col-md-9">
                      {!showMoreTags && selectedSecondaryTags.length > 0 && (
                        <div className="px-3 py-2 rounded-3 bg-light border small text-secondary">
                          <span className="fw-semibold text-primary">⚑ 已選進階標籤：</span>
                          {secondaryTagPreviewText}
                          <span className="ms-2 text-muted">（展開更多標籤可修改）</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {showMoreTags && (
                    <div className="d-flex flex-wrap gap-2 mb-2 border rounded-3 p-2 bg-light">
                      {SECONDARY_CONTENT_TAGS.map((key) => {
                        const isActive = selectedTags.includes(key);
                        const item = PRODUCT_CONTENT_MAP[key];

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleTagToggle(key)}
                            className={`btn btn-sm ${
                              isActive ? 'btn-primary' : 'btn-outline-secondary'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="form-control bg-light small text-muted">
                      {/* {tempProduct.content
                        ? tempProduct.content.split('|').join(' | ')
                        : '尚未生成 content tags'} */}
                      {watchContent ? watchContent.split('|').join(' | ') : '尚未生成 content tags'}
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <select
                      {...register('unit')}
                      // defaultValue={tempProduct.unit}
                      // value={tempProduct.unit}
                      // onChange={onModalChange}
                      name="unit"
                      id="unit"
                      className="form-select"
                    >
                      <option value="">選擇單位</option>
                      {Object.entries(PRODUCT_UNIT_MAP).map(([key, item]) => (
                        <option key={key} value={item.value}>
                          {item.value}（{item.label}）
                        </option>
                      ))}
                    </select>
                    <div className="d-flex justify-content-start align-items-center mt-1">
                      <div className="small text-secondary">
                        {unitPreviewText || '尚未選擇單位摘要'}
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      {...register('origin_price')}
                      // defaultValue={tempProduct.origin_price}
                      // value={tempProduct.origin_price}
                      // onChange={onModalChange}
                      // name="origin_price"
                      id="origin_price"
                      type="number"
                      min={0}
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-4">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      {...register('price')}
                      // defaultValue={tempProduct.price}
                      // value={tempProduct.price}
                      // onChange={onModalChange}
                      // name="price"
                      id="price"
                      type="number"
                      min={0}
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    商品敘事文案
                  </label>
                  <textarea
                    {...register('description')}
                    // defaultValue={tempProduct.description}
                    // value={tempProduct.description}
                    // onChange={onModalChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入商品簡短介紹文案"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    {...register('is_enabled')}
                    // defaultChecked={Boolean(tempProduct.is_enabled)}
                    // checked={Boolean(tempProduct.is_enabled)}
                    // onChange={onModalChange}
                    // name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top bg-light">
            <button type="button" onClick={onConfirm} className="btn btn-primary">
              確認
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// === 新增 `propTypes` 驗證 ===
ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalMode: PropTypes.oneOf(['create', 'edit']).isRequired,

  tempProduct: PropTypes.shape({
    // 確保 `tempProduct` 是物件，且內部特定屬性為必填
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    origin_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    description: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  onModalChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  modalError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,

  categoryBuilder: PropTypes.shape({
    theme: PropTypes.string,
    type: PropTypes.string,
    species: PropTypes.string,
  }).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCategoryBuilderChange: PropTypes.func.isRequired,
  handleTagToggle: PropTypes.func.isRequired,
};

ProductModal.defaultProps = {
  tempProduct: {
    ...DEFAULT_PRODUCT,
    is_enabled: 0, // 確保未設定時預設為 0（未啟用）
  },
};

export default ProductModal;
