# 前台版面與互動規範

整理日期：2026-10-16。搭配 [版面實作](../guides/FRONT-LAYOUT.md) 與 [UIUX 測試](../guides/UIUX-TESTING.md) 使用。

## Header

Header 為 fixed，不占一般文件流。有 Hero 的頁面由內容延伸到畫面頂端，Header 疊在其上。

| Hero 頁情境 | 行為 |
|---|---|
| 首次進入、F5 或切頁返回，位於頂部區域 | 背景透明 |
| hover Header | 顯示品牌背景；hover 不改變捲動所決定的位移 |
| 超過 150px 並向下捲動 | 隱藏 Header |
| 超過 150px 並向上捲動 | 顯示實色 Header |
| 回到頂部區域 | 恢復透明，hover 規則仍有效 |

保留互動元件的 `:focus-visible`。不得用整塊 `:focus-within` 強制 Header 顯色或取消向下隱藏，避免滑鼠點擊連結後留下錯誤實色狀態。

非 Hero 頁保持實色 Header，main 預留遮擋空間，不套用 Hero 頁的捲動隱藏策略。

## 頁首留白與路徑

- 非 Hero main：mobile 100px；desktop（992px 起）116px。
- 以上是內容遮擋參考，不是固定 Header height。
- Hero main 不追加這份頂部留白。
- 參考值以 `src/styles/helpers/_front-layout-tokens.scss` 為來源，不能漏掉此 helper 或任意重複一份數字。

目前兩份配置的責任不同，保留以下程式現況：

| 配置 | 路徑 |
|---|---|
| FrontHeader 的 Hero 行為 | `/`、`/home`、`/about-us`、`/products`、`/articles` |
| FrontLayout 的 Hero main | `/`、`/home`、`/about-us`、`/products` |

`/articles` 的差異不應在一般整理時自動合併。`/home` 是上述判定陣列中的值；Router 的實際首頁為 `/`，不要據此建立或使用不存在的首頁路由。

商品詳情維持產品目錄 active、文章詳情維持植栽筆記 active；購物流程歸屬購物車入口。active 不代表詳情頁屬於 Hero。

## 手機選單與 Footer

- `aria-expanded` 反映真實開關狀態，關閉抽屜使用 inert，隱藏入口不能被點擊或 Tab 聚焦。
- 選單開啟鎖住背景捲動；關閉、切頁、切換桌機或卸載必須清理。
- 支援 Escape、Tab 循環與適當焦點返回，且不能留下錯誤 Header 背景。
- Footer 保留版權、登入／回後台／登出、社群入口等既有功能。
- GoTop 是 FrontLayout 的獨立元件，不把責任移入 Footer。
- 社群連結保留已提供的目的地、可讀標籤及另開分頁安全設定。

## RWD 與動畫

頁面不得出現非預期 X 軸捲動。測量超界元素與動畫前後狀態，不以全頁 `overflow-x:hidden` 隱藏問題。Swiper 的內部位移限制在自身容器。

BrandStory 採 `fade-up`；斜向 `fade-up-left` 曾造成水平位移超界。修正來源是動畫，不是加寬 Header 或移除其 border。

減少動態偏好下，內容仍應可見，不能停在 opacity:0 或依賴動畫事件才出現。視覺補強不得破壞原路由、焦點與捲動行為。

## 程式與樣式慣例

- 沿用 React／Router／Redux 分層，頁面發送通知與通知生命週期分開。
- Header／Footer 使用 `front-header`／`front-footer` BEM，選取狀態沿用 `.is-active`。
- Sass 尺寸使用 `$breakpoints`／`respond`；JS 響應式判斷使用既有 `BREAKPOINTS`。
- 前台斷點：mobile 0、pad 576px、tablet 768px、desktop 992px、desktop-xl 1296px。
- Sass helpers 使用 `@/styles/helpers/...` 別名；spacing、字型與品牌色沿用 helpers。
- 元件變數局部化，避免任意覆寫 `:root` 或全域高度值。
- 視覺與行為修改須同步更新功能文件及測試方式，不能把現有 bug 直接寫成規格。
