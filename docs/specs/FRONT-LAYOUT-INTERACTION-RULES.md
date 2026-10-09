# BetweenGreen 前台版面與互動規則

版本：v1.1  
更新日期：2026-10-08（Asia/Taipei）  
用途：保留已定案的版面行為，供開發、重構、驗收及跨工作交接使用。  
狀態：規則初版補上 v1.1 修正紀錄；Header 透明樣式已修補，切頁與畫面仍待使用者驗收。

## 1. 使用原則

- 結構整理只調整 class、DOM 責任、Sass 分層及必要的程式結構，不自行改變已驗收的視覺或互動。
- 新增無障礙支援時，必須比對原本的 hover、focus、scroll 與路由行為；不能讓一般焦點殘留改變整條 Header 的背景或顯示狀態。
- 需求與現有程式不一致時，先列出差異、確認規則，再修改；不能直接把現有 bug 寫成規格。
- 未確認的項目標為「待討論」，不能因文件存在就視為已定案。
- 變更行為時，同步更新本文件與驗收清單；不能只更新程式或更新包 README。
- 本文件不包含密鑰、登入資訊或個人資料，可作為版本控制中的專案規格。

## 2. Hero 頁的 Header 規則（已定案）

目標：讓 Hero 圖片完整呈現到頁面頂端，不被常駐的實色導覽帶遮住。

| 情境 | 預期行為 |
| --- | --- |
| 首次進入或 F5，頁面位於頂部 | Header 疊在 Hero 上，背景透明 |
| 頂部，滑鼠 hover Header | 顯示原本的品牌背景；離開後恢復該捲動狀態的背景 |
| 向下捲動、超過既有隱藏門檻 | Header 向上隱藏，不常駐實色背景 |
| 向上捲動、仍超過既有門檻 | Header 顯示，以原本背景提升導覽可讀性 |
| 回到頂部區域 | 回到透明狀態；hover 仍可顯示背景 |
| 點導覽或 Logo 切頁，再回首頁 | 與首次進入／F5 的規則一致，不因舊連結保留焦點而維持實色 |

### 技術基線與限制

- Header 使用 fixed 疊在畫面上，不佔據一般文件流。
- Hero 頁 main 不追加 Header 高度的頂部留白；Hero 背景從頁面頂端開始。
- 舊版程式以 `scrollY <= 150` 作為頂部區域；v1 記錄此既有門檻，不在結構整理時擅自調整。
- `:hover` 與 `:focus-within` 不是同一個條件。一般滑鼠點擊留下的焦點，不應讓頂部 Header 持續實色，也不應強制把向下隱藏的 Header 拉回。
- 保留連結／按鈕的 `:focus-visible` 提示。若需要鍵盤操作期間暫時顯示 Header，須另外討論精確條件，不能直接以所有 `:focus-within` 套用。
- 不以修改 Hero 高度、圖片裁切或 main padding 掩蓋 Header 狀態問題。

## 3. 非 Hero 頁的 Header 規則（已定案）

- 頁首維持實色 Header，讓導覽與一般文字內容有清楚分界。
- main 保留既有 Header 頂部留白，避免內容被 fixed Header 覆蓋。
- 不套用 Hero 頁的透明／向下隱藏策略。
- 各尺寸的實際 Header 高度與留白值仍需在後續全站高度 audit 檢查，不能把目前近似變數視為最終尺寸規格。

## 4. 路由分類現況（已知特例，先保留）

目前 current 中，Header 與 FrontLayout 有兩份不同的配置：

| 配置責任 | 路徑 |
| --- | --- |
| FrontHeader：採用 Hero Header 行為 | `/`、`/home`、`/about-us`、`/products`、`/articles` |
| FrontLayout：main 不保留頂部留白 | `/`、`/home`、`/about-us`、`/products` |

- `/articles` 是目前保留的已知特例，兩份配置不同，不是本文件要求所有路由都必須不同。
- 子頁是否補 Hero、使用文字頁首或維持一般頁，將另開專題決定。
- 在該專題定案前，不因重構而自行增刪 `/articles` 或統一路由陣列。
- 商品詳情亮「產品目錄」，文章詳情亮「植栽筆記」；入口亮燈不代表詳情頁被分類為 Hero 頁。
- 購物車三個步驟歸屬同一購物車入口。

## 5. 手機選單與 Footer

### 手機選單：v1 結構整理加入的支援，待畫面驗收

- 開關的 `aria-expanded` 應反映真實開啟狀態。
- 關閉選單時，隱藏入口不能被 Tab 聚焦或點擊。
- 開啟選單可鎖住背景捲動；關閉、路由切換、切到桌機及卸載時必須清理鎖定。
- 支援 Escape 關閉與適當的焦點管理；不可因返回開關而留下整條 Header 的錯誤實色狀態。
- 手機選單開啟時 Header 是否使用實色、抽屜進場形式及焦點返回時機，需另確認。新版目前的做法不自動成為正式視覺規格。

### Footer：本階段的範圍

- 保留目前版權、後台登入／回後台／登出與社群入口，不新增大型頁尾或 sitemap。
- GoTop 仍是 FrontLayout 中的獨立共用元件，不因 Footer 結構整理而搬入 Footer。
- 社群連結的無障礙標籤、另開分頁安全設定可補強；不擅自替換成未提供的品牌社群網址。
- 間距、點擊範圍或換行等視覺微調，必須列在更新说明並等待畫面驗收，不宣稱完全沒有視覺變更。

## 6. 命名與 Sass 慣例

- 前台 Header／Footer 結構整理版採用 `front-header`／`front-footer` BEM；替換舊 `header__`／`footer__` 時須檢查使用者自行添加的選擇器。
- active 狀態使用 `.is-active`；選單開啟狀態使用 `.is-open`。
- 尺寸斷點使用 helpers 中的 `$breakpoints` 與 `respond`，不另寫重複數字斷點。
- JavaScript 響應式判定使用既有 `BREAKPOINTS`，並與 Sass 對照。
- 沿用 helpers 的品牌色、spacing 與字型規則；新增配色或整體 UI／UX 重設須先討論。
- 元件專用變數盡量局部化，不能任意新增／覆蓋 `:root` 影響其他頁面。
- `--header-height` 在 `_layout`、`_hero`、`_home` 的多處設定仍待整合；不得將 Header 品牌高度局部化當作整個問題已解決。
- 刪除／替代內容時保留一版原因註解，下次相關更新再清理。

## 7. 驗收清單

畫面尺寸：375、414、768、1024、1440px；Hero 後續 audit 另檢查 1024～1440 區間的流動尺寸。

- [ ] 首次開首頁：頂部透明，hover 顯示背景，離開恢復透明。
- [ ] 首頁 F5：與首次開啟相同。
- [ ] 首頁 → 產品目錄 → 點 Logo 回首頁：移開滑鼠後恢復透明。
- [ ] 以鍵盤操作相同切頁流程：焦點提示可辨識，不殘留整條實色背景。
- [ ] 瀏覽器上一頁／下一頁：到達頂部後狀態正確。
- [ ] 超過門檻向下捲動：Header 隱藏；向上捲動：Header 顯示。
- [ ] 回到頂部：Header 恢復透明，Hero 不被常駐實色帶遮住。
- [ ] 無 Hero 頁：實色 Header，正文不被覆蓋。
- [ ] 手機開關選單、切頁、切成桌機：沒有殘留背景捲動鎖或隱藏入口焦點。
- [ ] 全尺寸無額外水平捲軸；圖中疑似額外垂直捲軸需確認實際捲動容器，不靠截圖推定原因。
- [ ] lint／build 通過。

注意：lint／build 和 Article 規則腳本不會驗證 Header 的 CSS 焦點、hover 與切頁畫面。這些檢查通過，不代表上方畫面案例通過。

## 8. 目前問題與後續項目

### Header Footer Structure v1 回報

- 使用者回報：首次載入／F5 首頁正常；首頁 → 產品頁 → 回首頁後，Header 變成常駐實色。
- 舊版 Sass 只使用 `.header:hover`；新版新增整塊 `:focus-within` 的實色與 `translateY(0)`，這是已確認的程式差異。
- 焦點殘留是與回報吻合的主要原因假設，尚未在瀏覽器重現確認；不要記錄成已完成修補。
- 圖片中的捲軸是否另有問題仍待確認，不能與透明狀態問題混為同一個結論。
- v1 文件交付時只有規則紀錄，未修改程式；v1.1 另附下方 Sass 補丁。

### v1.1 Header Transparency Fix

- 更新 `_header.scss`：移除整塊 `:focus-within` 的背景與顯示覆蓋，保留連結／按鈕的 `:focus-visible` 焦點框。
- hover 只調整背景與陰影，不再以 `translateY(0)` 改變捲動狀態。
- 向下隱藏狀態恢復 `pointer-events: none`，明確使用透明背景、無 backdrop-filter／陰影，避免隱藏中的 Header 仍被 hover 改變狀態。
- 未修改 FrontHeader JSX、FrontLayout、Hero 路由配置、main 留白或 Hero 圖片尺寸。
- 程式檢查與瀏覽器驗收分開記錄；切頁焦點案例及截圖中的疑似額外捲軸仍需人工確認，不宣稱已在瀏覽器驗證。

### 仍保留在集中回收的項目

- Home Hero 1024～1440px 響應式問題與其他尺寸檢查。
- Header／main 高度與全站 breakpoint audit。
- 子頁 Hero 規劃、About 與 Home 圖片世界觀及集中產圖。
- Toast UI／UX 與其他完整待辦以 `FOLLOW-UP-FRONT-DATA-AND-INTEGRATION.md` 為準。

## 9. 保存位置與交接

- 建議保存於專案根目錄下的 `docs/specs/FRONT-LAYOUT-INTERACTION-RULES.md`，不是 `src` 或 `public`。
- 此檔是行為規格；current 基準版本看 `CURRENT-BASELINE-AND-HANDOFF.md`，進度／待辦看集中回收備忘錄，圖片尺寸看 `ABOUT-IMAGE-SPECS.md`。
- 新工作開始、換模型或重構相關元件時，先閱讀此檔與最新 current；更換工具不構成改變規則的理由。
- 更新共用區 current 時，把本文件一起帶入；避免只有程式、沒有驗收規則。
- 本文件可提交到 dev，也建議隨對應程式合併到 prod 保存版本一致性。原始碼分支包含文件，不等於文件會被部署成網站頁面。
- 如政策要求 prod 原始碼分支也不能有規格文件，需另定文件儲存／發布策略，不能依靠 prod 的 `.gitignore` 阻止已追蹤文件合併。

文件單獨提交建議：`docs(front): record layout and header interaction rules`  
本次修正與文件合併提交建議：`fix(front): preserve hero header transparency after navigation`
