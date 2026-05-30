export const buildProductGalleryImages = (product) => {
  const images = [];

  if (product?.imageUrl?.trim()) {
    images.push(product.imageUrl.trim());
  }

  if (Array.isArray(product?.imagesUrl)) {
    product.imagesUrl.forEach((url) => {
      if (url?.trim() && !images.includes(url.trim())) {
        images.push(url.trim());
      }
    });
  }

  return images;
};
