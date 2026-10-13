const ToastPreview = ({ onShow, onClear, paused, queuedCount }) => (
  <details className="ui-toast-preview" open>
    <summary>Toast 外觀與互動 · 開發模式</summary>
    <div className="ui-toast-preview__content">
      <p>霧白 success；固定樣本可點 X 測離場。測試前先清除樣本，避免排隊。</p>
      <div className="ui-toast-preview__actions" role="group" aria-label="測試訊息">
        <button type="button" onClick={() => onShow('商品已加入購物車')}>短訊息</button>
        <button type="button" onClick={() => onShow('商品已加入購物車。晨霧多肉盆栽與櫻花記憶禮盒已為你保留，請前往購物車確認數量與配送資訊。')}>長訊息</button>
        <button type="button" onClick={() => onShow('訂單已建立\nBG-20261011-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')}>換行／長編號</button>
        <button type="button" onClick={() => {
          onShow('商品已加入購物車');
          onShow('優惠券已套用');
          onShow('訂單已建立，請確認付款資訊');
        }}>三則固定堆疊</button>
        <button type="button" onClick={() => onShow('商品已加入購物車', { autoDismiss: true })}>單則自動離場測試</button>
        <button type="button" onClick={() => {
          for (let i = 1; i <= 5; i += 1) onShow(`自動通知 ${i}／5`, { autoDismiss: true });
        }}>五則排隊測試</button>
        <button type="button" onClick={() => onShow('此為警告時間測試，外觀仍沿用舊版。', { autoDismiss: true, status: 'warning' })}>警告 7 秒測試</button>
        <button type="button" onClick={onClear}>清除測試通知</button>
      </div>
      <p>success／info 5 秒，warning／error 7 秒，從進場完成起算。hover／鍵盤焦點進入通知區會整組暫停；恢復至少保留 2 秒。</p>
      <p>切換分頁或視窗也會暫停；清除僅移除測試通知，不播放動畫。深綠配色仍註解保留。</p>
      <p aria-live="polite">通知區：{paused ? '已暫停' : '可倒數'}；排隊 {queuedCount} 則。</p>
    </div>
  </details>
);

export default ToastPreview;
