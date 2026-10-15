import { useState } from 'react';

const SAMPLES = {
  success: { name: '成功', short: '商品已加入購物車', long: '商品已加入購物車。請前往購物車確認商品數量與配送資訊，完成後再繼續結帳。' },
  warning: { name: '警告', short: '請確認商品數量', long: '商品數量已達可購買上限，請調整數量後再試。若購物車有其他商品，也請一併確認數量。' },
  error: { name: '錯誤', short: '操作未完成，請稍後再試', long: '目前無法完成操作，請稍後重新嘗試；若問題持續，請確認連線狀態。' },
  info: { name: '資訊', short: '商品資料已更新', long: '商品資料已更新。瀏覽不同分類時，可使用篩選條件調整目前顯示的商品。' },
};

const ToastPreview = ({ onShow, onClear, paused, queuedCount }) => {
  const [status, setStatus] = useState('success');
  const sample = SAMPLES[status];
  const show = (text, autoDismiss = false) => onShow(text, { status, autoDismiss });
  return (
  <details className="ui-toast-preview" open>
    <summary>Toast 四種狀態與互動 · 開發模式</summary>
    <div className="ui-toast-preview__content">
      <p>選擇狀態會清除測試樣本並顯示一則固定預覽，不影響正式通知。</p>
      <div className="ui-toast-preview__actions" role="group" aria-label="預覽狀態">
        {Object.entries(SAMPLES).map(([value, item]) => (
          <button key={value} type="button" className={status === value ? 'is-active' : ''}
            aria-pressed={status === value} onClick={() => {
              setStatus(value); onClear(); onShow(item.short, { status: value });
            }}>{item.name}</button>
        ))}
      </div>
      <div className="ui-toast-preview__actions" role="group" aria-label="測試訊息">
        <button type="button" onClick={() => show(sample.short)}>短訊息</button>
        <button type="button" onClick={() => show(sample.long)}>長訊息</button>
        <button type="button" onClick={() => show(`${sample.short}\nTEST-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`)}>換行／長編號</button>
        <button type="button" onClick={() => {
          show(sample.short); show(sample.long); show(`${sample.short}\n測試編號 TEST-20261014`);
        }}>三則固定堆疊</button>
        <button type="button" onClick={() => { onClear(); show(sample.short, true); }}>單則自動離場測試</button>
        <button type="button" onClick={() => {
          onClear();
          for (let i = 1; i <= 5; i += 1) show(`${sample.short}（測試 ${i}／5）`, true);
        }}>五則排隊測試</button>
        <button type="button" onClick={onClear}>清除測試通知</button>
      </div>
      <p>固定樣本可點 X 測離場。自動測試先清除舊測試樣本；正式通知仍可能占用可見名額。</p>
      <p>success／info 5 秒，warning／error 7 秒，從進場完成起算。hover／鍵盤焦點與切換分頁／視窗會暫停，恢復至少保留 2 秒。</p>
      <p>清除直接移除測試通知；深綠參考仍註解保留，本版不加倒數條。</p>
      <p aria-live="polite">通知區：{paused ? '已暫停' : '可倒數'}；排隊 {queuedCount} 則。</p>
    </div>
  </details>
  );
};

export default ToastPreview;
