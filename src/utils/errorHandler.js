export const extractErrorMessage = (
  error,
  setError = null,
  defaultMessage = '系統發生錯誤'
) => {
  const message = error?.response?.data?.message || defaultMessage;

  // setError = null，如果使用的頁面有類似const [errorMessage, setErrorMessage] = useState('');去紀錄錯誤資訊並顯示，
  // 就可以使用，使用方法 ex: const errMessage= extractErrorMessage(res.error, setErrorMessage, '你需要的預設錯誤資訊');

  // typeof setError === 'function' ， 只要不是 function 都會跳過。
  if (typeof setError === 'function') {
    setError(message);
  }

  console.error('API Error:', error);

  return message;
};
