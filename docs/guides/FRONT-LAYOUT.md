# Header、Hero 與版面實作

整理日期：2026-10-16。本文件整合現有版面修補的原因與責任，行為基準見 [版面規範](../specs/FRONT-LAYOUT-INTERACTION-RULES.md)。

## 共用短版子頁 Hero（2026-10-18）

Articles、產品目錄與歷次訂單使用 `PageHero variant="subpage"`，以短幅圖片銜接 main。背景全寬，文字與內容共用 `ui-container`；最小高度為 767px 以下 320px、768–991px 336px、992px 起 360px，放大文字時依內容長高。背景採左側可讀性遮罩、底部淡入 main 底色，停用 hover 放大。

元件新增可選的 `variant`、`className`、`imagePosition`。子頁局部變數為 `--page-hero-min-height`、`--page-hero-surface`，頁面差異可放在 BEM modifier；不變更原有 sm／md／lg 預設樣式。三頁暫用既有 `hero-desk.png`，圖片位置為 `center 58%`；各頁分別保留 articles／products／orders modifier。

Header 與 FrontLayout 都使用 `frontPageConfig.js` 的 Hero 路徑判定。三頁 main 為零頂部 padding，遮擋參考由 Hero 內部 `calc(var(--header-height) + spacing)` 承擔，避免兩份留白疊加。歷次訂單移除原容器內的重複文字頁首，Hero 放在全寬層；下方訂單容器保留原來的內容寬度、卡片與分頁。Home／About 的獨立 Hero 與非 Hero 頁面的留白維持既有行為。

### 使用範例

```jsx
<PageHero
  variant="subpage"
  className="page-hero--articles"
  title="植栽生活筆記"
  backgroundImage={articlesBanner}
  imagePosition="center 58%"
/>
```

## Header token 與遮擋參考

`src/styles/helpers/_front-layout-tokens.scss` 保存：

| token | 值 |
|---|---|
| `$front-header-brand-mobile` | 60px |
| `$front-header-brand-desktop` | 80px |
| `$front-header-padding` | `$space-2`，預設 8px |
| `$front-header-solid-padding-desktop` | 18px |
| `$front-header-clearance-mobile` | 100px |
| `$front-header-clearance-desktop` | 品牌高度＋實色上下 padding，現值 116px |

Header 沒有固定 height。desktop 116px 對應目前一列導覽的最大實色狀態；不是文字換行後高度的動態量測結果。ProductDetail sticky 使用遮擋參考再加 16px，現值 132px。首頁商品錨點的 scroll-margin-top 使用同一參考。

Hero main 保持 padding-top:0，背景不被額外實色佔位往下推。NotFound 可用高度公式亦使用 Header 參考；Footer 既有 80px 估值只是該公式的實作假設，不是全站 Footer 實際高度量測值。

## 透明與捲動修正

FrontHeader 依目前路由及捲動方向選擇 top／active／down。切頁後重新計算狀態，避免沿用上一頁捲動結果。

Sass 已移除整塊 `:focus-within` 的顯色及強制顯示；hover 只處理背景與陰影，不修改捲動 transform。down 狀態透明、無陰影／backdrop-filter，並以 pointer-events:none 避免隱藏中的導覽仍被 hover 改變。

手機抽屜使用共用捲動鎖、aria-expanded、inert、Escape 與 Tab 管理；路由切換及轉桌機會關閉選單。

## BrandStory 水平溢出修正

AOS `fade-up-left` 會在尚未進場時造成水平位移，右側空間不足就可能撐寬整頁。已改成 `fade-up`，保留垂直進場與既有時序，不以全頁裁切掩蓋。

原修補紀錄在 375、393、414、575、576、768、991、992、1024、1032、1280、1296、1440px 檢查首頁動畫前的 scrollWidth／clientWidth 一致；此為該修補當時的本機量測範圍，不等同於目前全站與正式資料的重新驗收。

## Home Hero 定位修補

`_hero.scss` 將文字卡從 absolute left:27% 與固定 translateX(-50%) 的衝突，改為內容容器內正常排版：

- slide 建立自身定位與層級邊界，背景／遮罩不依賴其他 Swiper 樣式偶然定位。
- content 控制頂部留白，採 `clamp(132px, 24svh, 228px)`，保留 vh fallback。
- text 在手機最大 350px 且置中，desktop 最大 720px 並靠內容容器左側。
- 水平定位與動畫分開；動畫只控制垂直位移與 opacity。
- Hero 保留既有約 92% 視窗高度及最小高度，增加 svh 支援。
- 移除重複高度規則與 `_hero` 對全域 `--header-height` 的覆寫。
- 減少動態時文字顯式可見，避免套錯 selector 後內容消失。

這裡記錄已套用的定位實作，不宣告整體 Hero 視覺已完成全尺寸驗收。測試方式統一見 [UIUX 測試規範](UIUX-TESTING.md)。
