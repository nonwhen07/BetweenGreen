import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Toast as BSToast } from 'bootstrap'; //由於bootstrap的Toast與套件名稱衝突，所以把bootstrap的Toast取個別名為 'BSToast'
import { CircleCheck, X } from 'lucide-react';

import { pushMessage, removeMessage } from '@/features/ui/toastSlice';

// Toast 原始流程
// 1. Component 呼叫 useToast()任何(success, showError, warning, info)
//    ↓
// 2. dispatch(pushMessage)
//    ↓
// 3. Redux state.messages 改變
//    ↓
// 4. useSelector 偵測變化 → ToastList re-render
//    ↓
// 5. React 重新 map messages → 產生 DOM
//    ↓
// 6. useEffect 執行
//    ↓
// 7. Bootstrap Toast.show() → 顯示動畫
//    ↓
// 8. setTimeout 啟動
//    ↓
// 9. dispatch(removeMessage)
//    ↓
// 10. state 改變 → re-render → DOM 移除
//========================================
// 簡化理解 Toast 流程
// 1. pushMessage → 改變 store（新增 toast）
// 2. ToastList 用 useSelector 訂閱 store
// 3. store 改變 → ToastList re-render
// 4. ToastList 負責顯示 toast + 控制生命週期
// 5. Timer / click → dispatch(removeMessage)
// 6. store 再改變 → UI 更新

// const TOAST_DURATION = 2000;
const durationMap = {
  success: 1500,
  warning: 3000,
  error: 4000,
  info: 2000,
};
const statusClass = {
  success: 'toast-success',
  warning: 'toast-warning',
  error: 'toast-danger',
  info: 'toast-info',
};
const statusText = {
  success: '成功',
  warning: '警告',
  error: '錯誤',
  info: '資訊',
};

// 只在開發模式、網址明確開啟預覽時出現；正式頁面的通知仍使用原有時間。
const isToastPreviewEnabled = import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('toastPreview') === '1';
const DEFAULT_SUCCESS_STYLE = 'mist';

const ToastList = () => {
  // dispatch 是用來發送 actions 到 Redux store 的，讓我們可以修改 store 的狀態。
  const dispatch = useDispatch();
  const store = useStore();
  const previewIds = useRef(new Set());
  const messages = useSelector((state) => state.toast.messages);
  const toastRef = useRef({});
  // 如果你用 state 存 timer => setTimers → re-render → function 重建 → timer 爆炸
  // 用 useRef 的原因： 1. 改值不會觸發 render 2. 可以跨 render 保存資料 3. 永遠拿到最新值（不會 closure 錯亂）
  // useRef 是 React 裡的「非 UI 狀態儲存區」
  // Toast Timer 控制邏輯
  // 1. timersRef 用來儲存每個 toast 的 timer（key: id）
  // 2. startTimer 建立 setTimeout 並存入 timersRef
  // 3. pauseTimer 使用 clearTimeout 停止 timer 並刪除記錄
  // 4. resumeTimer 重新呼叫 startTimer 建立新的 timer
  // 5. timersRef 使用 useRef 儲存，避免 re-render 與 closure 問題
  const timersRef = useRef({});

  // useCallback 的目的不是效能，而是讓 function reference 穩定。
  // 當 function 被放進 useEffect dependency 時，
  // 如果沒有 useCallback，每次 render 都會產生新 function，
  // 導致 useEffect 被重新觸發，進而重複建立 timer。
  // 使用 useCallback 後，function reference 不變，
  // useEffect 只會在真正需要時執行，
  // 避免 timer 重複建立與邏輯錯亂。
  // useEffect的 dependency 比較的是「記憶體位置（reference）」，不是內容
  // useCallback = 讓 function 在 React 世界中「不要被當成不同東西」
  const startTimer = useCallback(
    (id, duration) => {
      if (!duration) return; // null → 不自動消失

      // 已存在 → 不重建
      if (timersRef.current[id]) return;

      timersRef.current[id] = setTimeout(() => {
        dispatch(removeMessage(id));
        delete timersRef.current[id];
      }, duration);
    },
    [dispatch],
  );
  // 單一Toast讓他暫停時間去瀏覽
  // 為什麼 pauseTimer 不用 dependency？ => timersRef.current 是 mutable（可變的）
  // const pauseTimer = useCallback((id) => {
  //   clearTimeout(timersRef.current[id]);
  //   delete timersRef.current[id];
  // }, []);
  // const resumeTimer = useCallback(
  //   (id, duration) => {
  //     startTimer(id, duration);
  //   },
  //   [startTimer],
  // );

  // 手動移除
  const handleDismiss = (message_id) => {
    const el = toastRef.current[message_id];
    if (!el) return;

    el.classList.add('toast-exit');

    setTimeout(() => {
      dispatch(removeMessage(message_id));
      previewIds.current.delete(message_id);
    }, 300);
  };

  // useEffect 要避免覆蓋 paused
  useEffect(() => {
    if (!messages.length) return;

    messages.forEach((message) => {
      const messageElement = toastRef.current[message.id];
      if (!messageElement) return;

      const isPreviewMessage = isToastPreviewEnabled && previewIds.current.has(message.id);
      // 預覽固定留在畫面，方便比較外觀；只有這些測試 id 會停用自動消失。
      const toastInstance = isPreviewMessage
        ? BSToast.getOrCreateInstance(messageElement, { autohide: false })
        : BSToast.getOrCreateInstance(messageElement);
      toastInstance.show();

      const duration = durationMap[message.status];

      if (!isPreviewMessage) startTimer(message.id, duration);
    });

    // return () => {
    //   const timers = timersRef.current;
    //   Object.values(timers).forEach(clearTimeout);
    // };
  }, [messages, startTimer]); // 將 dispatch 加入依賴陣列

  const showPreview = (text) => {
    if (!isToastPreviewEnabled) return;
    dispatch(pushMessage({ text, status: 'success' }));
    const message = store.getState().toast.messages.at(-1);
    if (message) previewIds.current.add(message.id);
  };

  const clearPreviews = () => {
    previewIds.current.forEach((id) => {
      const element = toastRef.current[id];
      if (element) BSToast.getInstance(element)?.dispose();
      dispatch(removeMessage(id));
    });
    previewIds.current.clear();
  };

  return (
    <>
      {isToastPreviewEnabled && (
        <details className="ui-toast-preview" open>
          <summary>Toast 外觀比較 · 開發模式</summary>
          <div className="ui-toast-preview__content">
            <p>目前預覽：霧白玻璃。測試通知會暫留畫面。</p>
            <p>深綠配色已註解保留，供未來深色版面參考，目前不啟用切換。</p>
            <div className="ui-toast-preview__actions" role="group" aria-label="測試訊息">
              <button type="button" onClick={() => showPreview('商品已加入購物車')}>短訊息</button>
              <button type="button" onClick={() => showPreview('商品已加入購物車。晨霧多肉盆栽與櫻花記憶禮盒已為你保留，請前往購物車確認數量與配送資訊。')}>長訊息</button>
              <button type="button" onClick={() => showPreview('訂單已建立\nBG-20261011-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')}>換行／長編號</button>
              <button type="button" onClick={() => {
                showPreview('商品已加入購物車');
                showPreview('優惠券已套用');
                showPreview('訂單已建立，請確認付款資訊');
              }}>三則堆疊</button>
              <button type="button" onClick={clearPreviews}>清除測試通知</button>
            </div>
            <p>正式通知仍依原本時間消失；刷新即可恢復套用包的預設樣式。</p>
          </div>
        </details>
      )}
      <div
        className="toast-container ui-toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1056 }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            ref={(el) => (toastRef.current[message.id] = el)}
            className={`toast ui-toast show ${statusClass[message.status]}${message.status === 'success' ? ` ui-toast--success ui-toast--${DEFAULT_SUCCESS_STYLE}` : ''}`}
            // onMouseEnter={() => pauseTimer(message.id)}
            // onMouseLeave={() => resumeTimer(message.id, durationMap[message.status])}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {message.status === 'success' ? (
              <div className="ui-toast__success-layout">
                <span className="ui-toast__status-icon" aria-hidden="true"><CircleCheck size={22} strokeWidth={2} /></span>
                <div className="ui-toast__copy">
                  <span className="ui-toast__label">操作成功</span>
                  <div className="ui-toast__message">{message.text}</div>
                </div>
                <button type="button" className="ui-toast__close" aria-label="關閉成功通知"
                  onClick={() => handleDismiss(message.id)}><X size={18} strokeWidth={2} aria-hidden="true" /></button>
              </div>
            ) : (
              <>
            <div className="toast-header ui-toast-header text-white">
              <span className="ui-toast-title">{statusText[message.status]}</span>
              <button
                onClick={() => handleDismiss(message.id)}
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body ui-toast-message text-white text-center">{message.text}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastList;
