# 前台功能與資料展示規則

整理日期：2026-10-16。記錄已建立的前台框架與資料規則，不保存待辦或舊 JSON 筆數結論。

## 功能範圍

| 範圍 | 現有實作 |
|---|---|
| 首頁 | Hero、品牌內容、商品精選、Garden Tips 與各區塊入口 |
| 簡單頁 | About 與 NotFound 頁面框架 |
| 商品 | 商品目錄、分類／篩選、商品卡與詳情 |
| 購物流程 | Cart、結帳付款、完成頁與 Customer Orders |
| 導覽 | Header active route、手機選單、Footer 與獨立 GoTop |
| 文章 | 公開列表、詳情、首頁入口與共用公開／排程選擇規則 |
| 通知 | 四種 Toast 狀態、霧白版型、計時／暫停與排隊 |

框架存在不代表任意正式資料或裝置均已驗收；驗證方法見 [UIUX 測試](UIUX-TESTING.md)。

## 精選商品

- 首頁精選以 Product `displayTags` 的 Featured 語意挑選，不直接改成一般最新商品。
- 候選池與 Seasonal 分離，避免兩區混用同一組展示資料。
- 首頁展示規則為 6–8 筆，超過上限依既定選擇邏輯取捨；不足時不以其他普通商品靜默補數。
- 使用首頁專用 featured variant，保留既有商品卡資料與 fallback 基線。
- 商品詳情忠實顯示現有 `content`，不自行將自由文字拆成未定義的結構化欄位。

實際啟用數量與資料品質以當次 API 為準，不把歷史匯出數量寫成固定保證。

## About 圖片與敘事整合

About頁保留既有獨立Hero、敘事文字與商品入口。兩張故事照片分別對應「替忙碌留一點呼吸」及「把自然帶回生活」，使用3:2固定版面比例；生活方式三張1:1圖片沿用Home的書桌／空間／陽台素材，維持同系列場景。

結尾以深色綠意照片取代占位背景，保留深色遮罩與中央白色文案；768px以下圖片採70%水平取景，讓窄視窗仍看得到右側植栽，768px起回到中央取景。背景圖為裝飾，使用空alt；有內容意義的故事及生活照片提供描述alt。圖片以lazy／async載入，故事與生活圖保留尺寸資訊，避免等圖片載入才形成版面。

故事與結尾素材及三種生活方式圖片，集中於 `src/assets/images/site-assets/branding/about` 與 `branding/lifestyle`；保留本地圖作備援，不刪除舊素材。Home與三頁共用短Hero的既有圖片尚未遷移。

### 網站素材優先來源與備援

`src/constants/siteAssets.js` 集中管理每張網站素材的ImageKit `src` 與Vite匯入的本地 `fallbackSrc`。CDN根路徑為 `https://ik.imagekit.io/linassets/between-green/site-assets`，其後路徑與本地site-assets內部目錄一致。

`SiteImage` 先將CDN網址設為img的src；收到載入錯誤時才切到本地圖，不預先下載兩張圖。若本地圖也失敗，不重設src，避免錯誤迴圈。來源組合變更時重新建立載入狀態，因此舊圖的失敗不會阻止新圖嘗試主要來源。既有class、alt、尺寸與lazy／async設定仍由各頁提供。

```jsx
<SiteImage
  asset={SITE_ASSETS.aboutStorySlowDown}
  alt="窗邊書桌上的盆栽、陶杯與筆記本"
  className="about-story__photo"
  loading="lazy"
/>
```

Home與About的三種生活方式改讀 `LIFESTYLE_ITEMS`，共用主題、圖片來源、分類入口與各頁文案；Home仍用LifestyleCard，About仍用原圖文分區卡片，不改成相同section模板。Product／Article真實圖片繼續讀取API的imageUrl／imagesUrl／image，不加入這份網站情境素材表。

SiteImage處理img元素；尚未遷移的Hero背景將依其結構另行接入，不代表所有CSS背景圖已具備相同備援。

## Article 公開資格

共用邏輯位於 `src/utils/publicArticleSelectors.js`，首頁、列表、詳情與後台提示應沿用一致規則。

1. id 為非空字串。
2. `isPublic` 為合法真值；兼容 `true`、`1`、`'1'`，不將字串 `'true'` 當作合法真值。
3. `viewerScope` 為 `public`。
4. 排程有效，且目前日期位於可公開區間。
5. Garden Tips 另外要求 `displayZone` 為 `garden-tips`。

`isFeatured` 不得繞過公開、閱覽範圍、區域或日期資格。

## Article 主圖／封面圖片

Article 使用既有 `image` 欄位存放公開 HTTP(S) 圖片網址，可沿用 Product 的 ImageKit 存放方式。後台新增／編輯標示「主圖／封面圖片」，貼上網址即顯示預覽；JSON 新增、更新及完整匯出皆保留 `image`，不改名為 `imageUrl`，也不新增第二個主圖欄位。

文章列表、首頁 Garden Tips 與詳情共用此圖；各版型以既有比例裁切，不另外保存首頁圖片。未填或載入失敗仍沿用既有預設圖。圖片網址欄位不是檔案上傳功能，需先將圖片放在可公開讀取的位置，再貼入網址。

## Garden Tips 三篇規則

- 先建立合格候選，再優先選人工入選，最多三篇。
- 入選與補位各按 `priorityLevel` 高至低、`create_at` 新至舊排列。
- 不足三篇以其他合格候選穩定補位，不隨機；被排除的文章不占名額。
- 首頁版型為一大兩小，不是只有一篇入選，也不是每篇入選都稱為主卡。
- 文章詳情 API 缺 id 時，沿用路由 id 補上，避免與列表資格判定不一致。

## 排程與資料邊界

- 上架日台灣時間 00:00 生效；下架日當天完整有效，隔日台灣時間 00:00 起排除。
- 沿用現有 UTC 日期欄位存法，與台灣當日日期比較，不隨訪客時區改變。
- 空日期不限制該端；無效、非正數、小數、超出 Date 範圍或結束早於開始的排程排除。
- 判定在刷新／重新取得資料時重算，現有流程沒有午夜輪詢 timer。
- 列表未提供 `content` 不代表單篇正文空白；缺少 `isFeatured` 也不直接等同後台設定遺失。
- 不以可能省略欄位的列表匯出作為完整資料更新來源；缺檔或缺欄位先核對 API 邊界，不在前台猜資料。

## 後台 Article 完整匯出

「匯出全部 JSON」以目前載入的完整文章列表 ID 作為快照，再逐篇呼叫既有 `getAdminArticle` 取得單篇資料；同時最多三個請求，完成全部讀取後才下載。保留原本 `{ meta, articles: { id: fields } }` update 格式與檔名，欄位仍由既有 schema 決定。

不以列表摘要或預設空字串補正文。單篇 API 必須回傳文章物件與字串 `content`；單篇省略 id 時沿用請求 id，回傳不同 id 則取消。任一筆失敗時不產生部分 JSON，停止排入新請求，等待已發出的請求結束後回報。匯出期間按鈕顯示「準備匯出中…」並停用，另以 ref 防止同一輪渲染前的連點。

若單篇實際 `content` 為空字串，匯出忠實保留空字串，不捏造正文；是否符合更新必填由既有匯入驗證判斷。這是讀取與下載，不寫入 API、不修改文章資料、不放寬匯入 schema。

## Article 匯入預覽巡檢

批次新增的健康巡檢使用「既有文章＋整批有效新增」，批次更新使用「既有文章＋整批有效更新覆蓋後的集合」。更新不重複加入舊版本；無效資料不納入可套用的健康預覽。

Garden Tips 的入選不足／過多依全集公開資格與排程計算，同類集合提醒只在第一筆有效預覽顯示一次，標示為「整批預覽提醒」。即使被標記的既有文章不在匯入範圍，真實的集合問題仍會顯示。單篇的封面、標籤、草稿、日期等提醒仍依各自資料保留；標題重複、正文必填等原驗證不放寬。

新增預覽使用不與既有文章衝突的暫時 id，僅供本地巡檢，不寫入匯入 payload 或 API。預覽分析不修改原始 JSON 或既有集合。

## 實作與視覺文件

[版面規範](../specs/FRONT-LAYOUT-INTERACTION-RULES.md) 保存跨頁規則；[版面實作](FRONT-LAYOUT.md) 保存修補原因；[Toast](TOAST.md) 保存通知的完整使用方式。新的局部修改應整合進對應功能文件，不再新增逐版補丁指南。

### About共用LifestyleCard（2026-10-20）
About的三種生活方式直接以LIFESTYLE_ITEMS.map渲染LifestyleCard，沿用Home的滿版情境圖片、漸層疊字與探索連結；移除About原有白底資訊卡樣板及對應樣式。保留About區塊標題、背景、間距與響應式網格。SiteImage仍在LifestyleCard內負責ImageKit優先／本地備援，不負責卡片版型。

### About V3｜單次淡入與生活卡片變體
About沿用既有AOS，加入about-reveal，550ms、向上12px、每組只播放一次：Hero小標／標題／副標依序進場；理念與兩段故事圖文分組；Lifestyle標題與三卡依序進場；結尾理念與CTA輕量收尾。不改全站AOS初始化。
LifestyleCard新增variant="about"及revealDelay；預設仍為Home版。About使用暖白標題、淡米白英文與生活短句、綠黑漸層，描述與探索入口直接顯示，hover沿用輕量圖片縮放。沒有更改LIFESTYLE_ITEMS資料，直接使用既有aboutDescription。About卡片保留最小高度且可隨內容長高，避免大字級被絕對定位內容裁切。平板第三卡置中，桌面三欄。
減少動態效果模式停用About淡入、Hero既有呼吸動畫與生活卡片縮放／transition，所有文字直接可見；鍵盤聚焦卡片也直接顯示。來源路徑及ImageKit／本地備援沿用V2。

### About V3.1｜整卡縮放與薄幕亮起
About卡片的AOS移到about-lifestyle__item外層，LifestyleCard只接收variant；進場transform與內層整卡hover縮放分開。細指標hover及鍵盤focus-visible時，整卡scale(1.018)加柔和陰影，移開後恢復；圖片不再單獨放大。綠色薄幕改成圖片偽元素rgba(145,167,113,.12)，互動時opacity歸零，底部中性閱讀漸層維持。減少動態效果時保留陰影／薄幕狀態但停用縮放與過渡。Home預設不變。此節更新前述V3卡片hover及revealDelay說明。
