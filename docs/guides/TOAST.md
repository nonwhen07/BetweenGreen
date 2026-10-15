# Toast 使用與實作

整理日期：2026-10-16。整合現有 v2.3 程式與先前已採用的通知規則，不按交付版本拆分。

## 呼叫與責任

頁面沿用既有 useToast／Redux 發送方式，訊息仍為 id、text、status；不需要在各 page 自行開關或倒數。

| 檔案 | 責任 |
|---|---|
| `src/features/ui/toastSlice.js` | 保存訊息，新增與移除 |
| `src/features/ui/toastLifecycle.js` | 純 JS 狀態機、倒數、暫停原因、排隊 |
| `src/hooks/useToastLifecycle.js` | 接入 React、分頁／視窗事件與清理 |
| `src/components/ToastList.jsx` | 顯示、圖示、hover／focus／關閉操作 |
| `src/components/ToastPreview.jsx` | 開發預覽，使用相同 store 與 controller |
| `src/styles/components/_toast.scss` | 霧白材質、狀態色、尺寸與動畫 |

React 控制生命週期，Sass 控制動畫；此元件不呼叫 Bootstrap JS 的 show、autohide 或 dispose。Bootstrap 樣式 class 仍可沿用。

## 四種狀態

| status | 標籤／圖示 | 識別 | 閱讀時間 |
|---|---|---|---|
| success | 操作成功／CircleCheck | 品牌綠 | 5 秒 |
| warning | 請留意／TriangleAlert | 明亮金黃邊框、深色圖示 | 7 秒 |
| error | 發生錯誤／CircleX | 紅色邊框、深紅圖示 | 7 秒 |
| info | 資訊提示／Info | 藍色邊框、深藍圖示 | 5 秒 |

error 使用 alert／assertive，其餘 status／polite。狀態同時以形狀、文字、顏色辨識；重要結果不能只存在短暫通知中。

## 材質與尺寸

- 共用霧白 surface alpha .78、22px blur、115% saturation，正文與 X 保持深色。
- 3px start border＋2px top border 與局部色霧形成狀態識別；邊框與背景屬於外卡片，不是內部 layout。
- 色霧為 120deg 漸層，至 72% 淡出。success alpha .24、warning .20、error .12、info .14。這些是單一色霧圖層強度，不是整張卡片透明度。
- warning signal `#f5bf00`／ink `#946200`；info signal `#0284c7`／ink `#0369a1`；error signal 沿用 `$color-danger`／ink `#b42318`。配色局部化於 Toast，不修改全域 warning／info。
- 最大寬 420px，左右至少 16px 並考量橫向安全區。
- 小於 576px：頂距 3rem＋safe-area-inset-top；576px 起：1.5rem＋安全區。預設根字級下為 48／24px，獨立於 Header。
- grid 為 32px 圖示、可縮文字欄、44px 關閉欄；間距 12px。
- mobile padding 14px、最小內容高度 80px；desktop padding 16px、最小內容高度 88px；高度可隨內容增加。
- 小標籤 12px，正文 mobile 14px／desktop 15px。長文字與長編號可換行，不靠省略號隱藏資訊。
- 深綠材質以註解保存參考配色，不是啟用中的夜間模式。

## 生命週期與暫停

`queued → entering → visible → exiting → 移除`。

1. 最多三則可見，包含離場中的卡片；其餘 FIFO 排隊。排隊未掛載、不倒數、不提前播報。
2. 閱讀時間從進場完成起算，進出場時間另計。
3. 滑鼠／筆進入整個通知區時整組暫停，卡片間距也在閱讀區內。
4. 鍵盤 focus-visible 進入通知區暫停；點擊或觸控 X 不額外把其他通知永久留住。
5. 分頁隱藏或視窗失焦暫停；返回時重新核對環境、hover 與焦點。
6. 各暫停原因分開記錄，全部解除才恢復。保存剩餘時間，恢復至少留 2 秒。
7. 暫停期間新增通知不重新啟動舊計時器。新通知進場後同樣等待恢復。
8. X 與自動到期共用離場程序；重複關閉不重啟離場，已離場通知不被 hover 復活。
9. 焦點位於被關閉通知時移至下一則關閉按鈕，否則返回先前焦點或通知區；一般通知不主動搶焦點。
10. 動畫事件與計時備援均可完成階段，但只移除一次。卸載清理計時器與事件。

四種狀態共用 A 動畫：220ms 從上方 10px 淡入，不縮放；180ms 上移 6px 淡出。減少動態時純淡入／淡出 100ms。

## 開發預覽

開發網址：`http://localhost:5173/?toastPreview=1#/`，port 與部署子目錄依環境調整。首頁是 `/`。

僅 `import.meta.env.DEV` 且 `toastPreview=1` 時啟用。正式 production build 不顯示面板；帶該 query 仍是原路由，不等同於 404 規則。對外部署使用 production build 產物。

- 狀態按鈕清除舊測試樣本，建立一則所選狀態的固定樣本。
- 短／長／換行／三則固定樣本沿用目前所選狀態，X 可測手動離場。
- 單則自動離場與五則排隊先清除舊測試樣本，再走相同正式 controller。
- 清除只移除面板建立的 id，不清掉正式頁面通知；清除工具不播放離場。
- 正式通知仍會占可見名額。固定樣本不自動消失，也會占名額。
- 面板顯示暫停狀態與排隊數。範例為開發假資料，不代表 API 或業務規則。

時間回歸腳本與瀏覽器操作步驟見 [UIUX 測試規範](UIUX-TESTING.md)。
