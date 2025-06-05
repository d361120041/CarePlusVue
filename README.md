# Care+ 照護服務平台

Care+ 是一個現代化的照護服務平台，致力於提供專業的照護服務媒合，讓照護更簡單，陪伴更長久。

## 📋 專案簡介

**Care+ 用心守護每一刻，讓愛與關懷更貼近**

本平台整合了照護服務、課程資訊、社群互動等功能，為需要照護服務的家庭與專業照護人員提供便利的媒合平台。

### 主要功能

- 🏥 **照護服務** - 專業照護人員媒合與預約
- 📚 **課程資訊** - 照護相關課程與培訓資源
- 📰 **新聞資訊** - 最新照護相關新聞與資訊
- 💬 **社群互動** - 用戶間經驗分享與交流
- 👤 **多重身份** - 支援一般用戶、照護人員、管理員登入

## 🚀 技術架構

### 前端技術棧

- **Vue 3** - 漸進式 JavaScript 框架
- **Vue Router** - 單頁面應用路由管理
- **Pinia** - 狀態管理
- **Bootstrap 5** - CSS 框架
- **Swiper.js** - 輪播組件
- **FontAwesome** - 圖示庫
- **SweetAlert2** - 彈窗提示
- **Animate.css** - CSS 動畫庫

### 主要依賴

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "pinia": "^2.x",
  "pinia-plugin-persistedstate": "^3.x",
  "bootstrap": "^5.x",
  "swiper": "^10.x",
  "@fortawesome/fontawesome-free": "^6.x",
  "vue-sweetalert2": "^5.x",
  "animate.css": "^4.x"
}
```

## 📁 專案主要結構

```
src/
├── assets/              # 靜態資源
│   ├── images/         # 圖片資源
│   ├── logo/           # Logo 圖片
│   └── main.css        # 全域樣式
├── components/          # 可重用組件
│   ├── GlobalBanner.vue
│   └── BackToTop.vue
├── views/              # 頁面組件
│   ├── HomeHero.vue    # 首頁輪播
│   ├── Navigationbar.vue # 導覽列
│   └── Footer.vue      # 頁尾
├── stores/             # Pinia 狀態管理
│   ├── auth.js         # 用戶認證
│   └── useCaregiverAuth.js # 照護人員認證
├── router/             # 路由配置
│   └── router.js
├── plugins/            # 插件配置
│   └── axios.js
├── App.vue             # 根組件
└── main.js             # 應用入口
```

## 🛠️ 開發環境設置

### 環境需求

- Node.js 16.x 或更高版本
- npm 套件管理工具

### 安裝與啟動

1. **clone專案**
```bash
git clone https://github.com/d361120041/CarePlusVue.git
cd care-plus
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發服務器**
```bash
npm run dev

```

4. **構建生產版本**
```bash
npm run build
```

## 🎨 功能特色

### 動態導覽列
- 懸停動畫效果
- 多重登入狀態管理（用戶、照護人員、管理員）
- 個人資料快速訪問

### 首頁輪播
- 使用 Swiper.js 實現平滑輪播
- 自動播放與手動控制

### 新聞預覽
- 最新新聞即時載入
- 圖片錯誤處理
- 點擊查看詳情
- 響應式卡片佈局

### 多重認證系統
- **Session-based 認證**（一般用戶）
- **JWT-based 認證**（照護人員）
- 自動登入狀態恢復
- 安全登出機制

## 🔧 配置說明

### 路由配置
專案使用條件式渲染來控制不同頁面的佈局：

```javascript
// 管理員頁面隱藏導覽列和頁尾
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
```

### 狀態持久化
使用 `pinia-plugin-persistedstate` 實現狀態持久化：

```javascript
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

### 全域樣式
整合 Bootstrap 5 和 FontAwesome：

```javascript
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
```

## 🎯 開發指南

### 組件開發規範
- 使用 Composition API
- 遵循 Vue 3 最佳實踐
- 組件名稱使用 PascalCase
- 樣式使用 scoped 避免污染

### 狀態管理
- 使用 Pinia 進行狀態管理
- 區分不同用戶類型的認證狀態
- 實現狀態持久化避免重新整理丟失

### API 整合
- 使用 Axios 進行 HTTP 請求
- 實現錯誤處理和載入狀態
- 支援檔案上傳和圖片預覽

## 🔐 安全性
- 實現多重認證機制
- JWT Token 自動刷新
- 路由守衛保護敏感頁面
- XSS 防護和輸入驗證

**Care+ 讓照護更簡單，讓愛更貼近 💙**
