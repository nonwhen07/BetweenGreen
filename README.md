# React Admin Dashboard & E-Commerce Frontend Practice

一個使用 React + Vite 製作的電商練習專案，
包含後台商品管理系統與前台商品頁功能。
本專案模擬真實後台管理流程，實作完整的：

- 後台管理系統（Admin Dashboard）
- 前台商品頁與購物車流程
- API 串接與資料流設計
- 前端架構分層（Page / Service / Utility）

🔗 Live Demo  
https://nonwhen07.github.io/react_week7_2026

---

## 🎯 專案目標

### Week 3 - 登入驗證流程

- 建立 Token-based Auth 流程
- 使用 Cookie 儲存 Token
- App 初始化驗證登入狀態
- 驗證成功後載入商品資料

### Week 4 – 商品 CRUD 與架構優化

- 實作完整商品 CRUD
- 拆分 ProductModal / DeleteModal
- 統一資料轉換與驗證流程
- 優化元件責任分離與資料流設計

### Week 5 – 前台商品頁與購物車流程

- 建立 ProductsPage 商品列表頁
- 串接商品 API 並渲染商品資料
- 實作加入購物車（Add to Cart）流程
- 設計 Loading 狀態管理（Screen / Button）
- 建立商品圖片 fallback 機制

### Week 6 –

為了提升程式可維護性與專案可擴展性，
本週將 資料邏輯與畫面邏輯進行分離。
主要優化內容：

- 將 API 請求抽離至 Service Layer
- 將重複邏輯抽離至 Utility Functions
- 將錯誤處理與成功回應進行統一封裝
- 優化資料流設計，使 Page 僅負責 UI 與狀態管理

---

## 🧰 技術棧

- React 19
- Vite 7
- Axios
- Bootstrap 5
- React-icons
- Sass
- gh-pages

### 📦 核心依賴說明

本專案主要使用以下核心套件：

- axios：API 請求
- bootstrap：UI 框架
- react-router-dom：路由管理
- react-hook-form：處理表格輸入跟驗證
- react-redux
- gh-pages：部署工具
- sass：樣式預處理器

所有依賴已於 package.json 中定義，請使用 npm install 安裝。

```bash
npm install
```

<details> 
<summary>📌 手動安裝依賴（快速小抄）</summary>

```bash
npm install axios react-router-dom react-icons react-hook-form @reduxjs/toolkit react-redux bootstrap sass prop-types gh-pages

```

</details>

---

## 🧠 架構設計思維

### 1️⃣ Page 層：負責 UI 與狀態管理

Page Component 專注於：

- 畫面呈現
- 使用者互動
- state 管理

例如：

```bash
services/
 ├─ cartService.js
 ├─ productService.js
```

Page 不直接呼叫 API，而是透過 Service Layer。
範例：

```JS
services/
 ├─ cartService.js
 ├─ productService.js
```

這樣 Page 就不需要知道 API URL 或 Axios 設定。

### 2️⃣ Service Layer：集中管理 API 請求

所有 API 呼叫集中在 services/ 資料夾中。
例如：

```bash
services/
 ├─ cartService.js
 ├─ productService.js
```

```JS
export const getCartItems = async () => {
  const res = await axiosInstance.get('/cart');
  return res.data.data;
};
```

這樣可以：

- 統一 API URL
- 集中錯誤處理
- 降低 Page 複雜度

### 3️⃣ Utility Layer：處理純邏輯計算

將與 UI 無關的邏輯抽離到 utils/。

例如：

```bash
utils/
 ├─ cartUtils.js
 └─ handleApiError.js
```

```JS
export const calculateCartTotal = (carts) => {
  return carts.reduce((sum, item) => sum + item.total, 0);
};
```

這樣可以：

- 重複使用邏輯
- 減少 Page 複雜度
- 提高測試性

### 4️⃣ Loading 狀態分離設計

為了提升使用體驗，專案採用 兩種 Loading 設計：

Screen Loading

整頁資料載入時顯示：

```bash
<PageLoader />
```

適用情境：

- 初次載入資料
- 大量資料刷新

Button Loading

針對單一操作顯示 loading，例如：

```bash
加入購物車
更新數量
刪除商品
```

透過物件方式管理：

```bash
loadingItems[cart.id] === "qty"
loadingItems[cart.id] === "delete"
```

優點：

- 不會阻塞整頁 UI
- 提升使用者操作體驗

### 5️⃣ Error / Success 處理統一化

為了避免每個 API 都重複寫錯誤處理，
專案將錯誤與成功訊息抽離成共用方法：

```bash
utils/
└─ handleApiError.js
```

範例：

```JS
catch (error) {
handleApiError(error, setErrorMessage);
}
```

好處：

- 錯誤處理集中管理
- 提升可讀性
- 避免重複程式碼

---

## ⚙ 本地開發

```bash
npm install      # 安裝依賴
npm run dev      # 開發模式
npm run build    # 產生 production build
```

### 預設啟動：

```http
http://localhost:5173
```

---

## 📂 專案結構（簡化）

```bash
src/
├─ pages/
│   ├─ LoginPage.jsx
│   ├─ ProductsPage.jsx
│   └─ CartPage.jsx
├─ components/
│   ├─ ProductModal.jsx
│   ├─ DeleteModal.jsx
│   ├─ PageLoader.jsx
│   └─ BtnLoader.jsx
├─ services/
│   ├─ productService.js
│   └─ cartService.js
├─ utils/
│   ├─ cartUtils.js
│   └─ handleApiError.js
```

---

## 📘 API 文件來源與設計（Week 3 未補充）

Swagger 文件：
https://hexschool.github.io/ec-courses-api-swaggerDoc/

測試平台：
https://ec-course-api.hexschool.io/

### 登入

```http
POST /v2/admin/signin
```

### 驗證

```http
POST /v2/api/user/check
```

### 商品 CRUD

```http
GET    /v2/api/{apiPath}/admin/products
POST   /v2/api/{apiPath}/admin/product
PUT    /v2/api/{apiPath}/admin/product/{id}
DELETE /v2/api/{apiPath}/admin/product/{id}
```

---

## 🚀 部署流程

### 使用 gh-pages：

```bash
npm run build
npm run deploy
```

dist 目錄會推送至 gh-pages 分支。
並透過 GitHub Pages 進行靜態頁面部署。

---

## 🧩 開發規範與格式化設定

本專案使用 Prettier 統一排版規範，並搭配 VSCode 自動格式化設定。
此設定確保團隊開發時排版一致，
並減少 Git diff 因格式差異造成的噪音。

### 📄 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

### 📄 .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🔮 未來優化方向、已知限制

### 已知限制

- Token 使用 cookie 儲存（非 HttpOnly）
- ESLint 依賴存在 dev-only audit 警告（不影響 production）

### 未來優化方向

- 抽離 axios instance
- 導入 React Router
- 使用 Context API / Redux 管理 Auth
- 表單改用 useReducer
- 升級為 TypeScript 專案
