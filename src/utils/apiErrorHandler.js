export const handleApiError = (error, setError = null, defaultMessage = '系統發生錯誤') => {
  const message = error?.response?.data?.message || defaultMessage;

  // typeof setError === 'function' ， 只要不是 function 都會跳過。
  if (typeof setError === 'function') {
    setError(message);
  }

  console.error('API Error:', error);

  return message;
};
