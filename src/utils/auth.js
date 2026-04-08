export const getToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)hexToken_week7\s*=\s*([^;]*).*$)|^.*$/, '$1');
};

export const clearToken = () => {
  document.cookie = 'hexToken_week7=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};
