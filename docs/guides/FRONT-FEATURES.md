# 前台功能目標與現行實作

本文件只記錄功能目標、已完成的實作與現行資料規則。實作或目標改變時，直接更新對應章節，不追加逐版補丁、討論經過、交付檔名或私人待辦。

驗證方法與結果範圍見 [UIUX 測試](UIUX-TESTING.md)；功能存在不等於所有正式資料、裝置與流程均已驗收。

## 功能範圍

| 範圍 | 目標 | 現行實作 |
|---|---|---|
| 首頁 | 引導認識品牌與探索選物 | Hero、品牌故事、生活主題、精選商品、Garden Tips 與區塊入口 |
| About | 以生活情境說明品牌理念 | 獨立 Hero、雙段故事、三種生活方式、結尾理念與商品入口 |
| 商品 | 依主題與類型探索商品 | 商品目錄、分類／篩選、排序、分頁、商品卡與詳情 |
| 購物流程 | 呈現購物與訂單狀態 | Cart、結帳付款、完成頁與歷次訂單 |
| 文章 | 提供一致的公開閱讀與返回流程 | 公開列表、每頁六篇、主題標籤、詳情與返回列表入口 |
| 導覽與骨架 | 維持跨頁操作一致 | Header active route、手機選單、Footer、獨立 GoTop 與 NotFound |
| 通知 | 提供可閱讀、可暫停的操作回饋 | 四種 Toast 狀態、計時／暫停、排隊與關閉 |

## 網站情境圖片

目標：統一素材分類與引用，遠端圖片失敗時仍有同站備援。

- `src/constants/siteAssets.js` 的 `SITE_ASSETS` 集中提供主要圖片 `src` 與 Vite 匯入的本地 `fallbackSrc`。
- 主要站由 `VITE_SITE_ASSET_PRIMARY_ORIGIN` 取得，未設定時使用 `https://ik.imagekit.io/linassets`；去除結尾斜線後接 `/between-green/site-assets`。
- 本地 `src/assets/images/site-assets/` 與遠端 `between-green/site-assets/` 根目錄以下採相同相對路徑。
- `SiteImage` 先讀主要來源；收到圖片載入錯誤後切換本地備援。本地也失敗時不反覆重試；來源組合改變會重設載入狀態。這不是自訂逾時或整站故障切換。
- 各頁負責圖片 alt、尺寸、載入方式與樣式；有意義的圖片提供描述，裝飾圖使用空 alt。
- Product／Article 的真實圖片仍讀 API `imageUrl`／`imagesUrl`／`image`，不納入網站情境素材表。

| 用途 | 現行素材位置（相對於 site-assets） |
|---|---|
| Home 四張輪播 | `banners/home/hero-{main,desk,space,balcony}.png` |
| About Hero | `banners/about/hero-about.png` |
| 商品短 Hero | `banners/products/products-hero.png` |
| 文章短 Hero | `banners/articles/articles-hero.png` |
| 歷次訂單短 Hero | `banners/customer-orders/customer-orders-hero.png` |
| Home 品牌故事 | `branding/home/story-desk.png` |
| About 故事與結尾 | `branding/about/story-slow-down.png`、`story-grow-together.png`、`ending-green-corner.png` |
| 共用生活主題 | `branding/lifestyle/desk.png`、`space.png`、`balcony.png` |

## Hero 與生活情境

目標：以共用版型維持一致性，透過圖片及局部變體表達頁面用途。

- Home 保留四張情境輪播與選購／分類入口；About 使用獨立的大幅敘事 Hero。
- 商品、文章及歷次訂單共用 `PageHero variant="subpage"`，各自使用獨立主題圖片。背景全寬、文字與 main 共用容器，底部淡化銜接內容。
- 短 Hero 最小高度為 767px 以下 320px、768–991px 336px、992px 起 360px；文字放大時可自然長高，不套用背景 hover 放大。
- `PageHero` 接受 `backgroundAsset` 以使用圖片備援，並保留 `backgroundImage` 字串介面；同時提供時以 `backgroundAsset` 優先。
- Home／About 以 `LIFESTYLE_ITEMS` 共用三個主題、圖片與分類目的地，並使用同一個 `LifestyleCard`。Home 採預設版，About 採 `variant="about"`。

### About 敘事與互動

- 兩段故事照片採 3:2，對應「替忙碌留一點呼吸」與「把自然帶回生活」。結尾以深綠照片、遮罩與中央文案銜接商品入口。
- About 生活卡使用暖白標題、生活短句與探索入口；必要資訊直接顯示。平板第三卡置中，桌機三欄，文字可撐高卡片。
- Hero、理念、故事圖文、生活卡與結尾沿用 AOS，採 550ms、向上 12px 的單次分組進場。
- 生活卡進場動畫放在外層 `about-lifestyle__item`；內層卡片在細指標 hover 或鍵盤聚焦時整卡放大 1.8% 並加陰影，離開後恢復。
- 圖片上有淡草綠薄幕，互動時移除；底部閱讀漸層保留。Home 不套用 About 的卡片變體。
- 減少動態效果時直接顯示內容，停用 About 淡入、呼吸與卡片縮放／過渡，保留陰影及薄幕的互動狀態。

## 精選商品

目標：保留人工策展語意，避免首頁展示區互相混用。

- 精選以 Product `displayTags` 的 Featured 語意挑選，候選池與 Seasonal 分離。
- 首頁展示規則為 6–8 筆，超過上限依既定邏輯取捨；不足時不以普通商品靜默補數。
- 首頁使用 featured variant，保留商品卡資料與預設圖處理。
- 商品詳情忠實顯示 `content`，不將自由文字拆成未定義的結構化欄位。數量與品質以當次 API 為準。

## 文章列表與圖片

目標：讓文章可依主題辨識，並保留清楚的閱讀與返回路徑。

- 公開文章每頁六篇，使用 `BrandPagination` 與網址 `page` 參數；無效或越界頁碼依可用資料正規化。
- 卡片展示具體主題標籤；詳情提供返回入口，列表導入的閱讀保留來源頁資訊。換頁回到列表標題，不還原精確卡片捲動位置。
- Article 使用 `image` 儲存公開 HTTP(S) 主圖／封面網址，列表、Garden Tips 與詳情共用，各版型依自身比例裁切。
- 後台新增／編輯提供網址輸入與預覽；JSON 匯入／完整匯出保留 `image`，不新增 `imageUrl` 或第二個主圖欄位。
- 網址欄位不負責上傳檔案；未填或載入失敗時沿用既有預設圖。

## Article 公開資格與排程

目標：首頁、列表、詳情與後台提示使用相同公開判斷。

共用邏輯位於 `src/utils/publicArticleSelectors.js`。合格文章須同時符合：

1. id 為非空字串。
2. `isPublic` 為合法真值：兼容 `true`、`1`、`'1'`，不將字串 `'true'` 當作合法真值。
3. `viewerScope` 為 `public`。
4. 排程有效，且目前日期位於公開區間。

上架日以台灣時間 00:00 生效；下架日當天完整有效，隔日排除。沿用現有 UTC 日期欄位與台灣當日比較，不隨訪客時區改變。空日期不限制該端；無效、非正數、小數、超出 Date 範圍或結束早於開始的排程排除。資格在刷新／重新取得資料時重算。

`isFeatured` 不得繞過公開、閱覽範圍、區域或日期資格。列表省略 `content` 不代表單篇正文空白，省略 `isFeatured` 也不代表後台設定遺失。

## Garden Tips 選取

目標：在符合公開條件的文章中穩定選出三篇，維持首頁與文章資料一致。

- 候選須額外符合 `displayZone="garden-tips"`。
- 優先選人工入選，最多三篇；不足時以其他合格候選穩定補位，不隨機。
- 入選與補位各按 `priorityLevel` 高至低、`create_at` 新至舊排序；被排除文章不占名額。
- 圖片沿用對應 Article `image`，不另存首頁版本。詳情 API 缺 id 時沿用路由 id，維持資格判定一致。

## 後台 Article 匯出與匯入預覽

目標：完整保存文章內容，並以整批套用後的集合提供健康提醒。

### 完整匯出

- 以完整列表 ID 為快照，逐篇呼叫 `getAdminArticle` 取得正文，同時最多三個請求。
- 全部成功後才下載 `{ meta, articles: { id: fields } }` update 格式；欄位沿用既有 schema。
- 單篇須回傳文章物件與字串 `content`；缺 id 時沿用請求 id，不同 id 或任一請求失敗則取消整批，不產生部分 JSON。
- 空正文忠實保留，不用列表摘要或預設文字補齊。準備期間停用匯出按鈕並防止連點。
- 匯出只讀取與下載，不寫入 API 或放寬匯入驗證。

### 匯入預覽

- 新增巡檢以「既有文章＋整批有效新增」分析；更新以「有效更新覆蓋既有集合」分析，不重複加入舊版本。
- Garden Tips 入選不足／過多依全集公開資格與排程判斷，同類集合提醒只在第一筆有效預覽顯示一次，標示「整批預覽提醒」。
- 單篇封面、標籤、草稿與日期等提醒依各筆保留；標題重複、正文必填等原驗證不放寬。
- 新增預覽的暫時 id 只供本地巡檢，不寫入 payload 或 API；分析不修改原 JSON 或既有集合。

## 文件分工

- [版面規範](../specs/FRONT-LAYOUT-INTERACTION-RULES.md)：跨頁視覺、導覽與互動規則。
- [版面實作](FRONT-LAYOUT.md)：版面責任與技術實作。
- [Toast](TOAST.md)：通知使用方式與生命週期。
- [UIUX 測試](UIUX-TESTING.md)：測試方法、結果與驗證邊界。

私人目標、方案討論、過程筆記與交接保存在版本庫外的工作備忘，不納入本文件。
