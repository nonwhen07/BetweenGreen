export const getToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)bg-user-data\s*=\s*([^;]*).*$)|^.*$/, '$1');
};

export const clearToken = () => {
  document.cookie = 'bg-user-data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};
