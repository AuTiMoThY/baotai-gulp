# JS 模組化結構說明

## 📁 目錄結構

```
src/js/
├── modules/
│   ├── common/              # 共用模組
│   │   ├── helpers.js       # 輔助函數（getSingleElements）
│   │   ├── animations.js    # 共用動畫（commonBgAni, commonHdAni, commonBdAni）
│   │   └── scroll-trigger.js # ScrollTrigger 設定
│   │
│   ├── screens/             # 各個畫面的動畫模組
│   │   ├── screen0.js       # 首屏動畫
│   │   ├── screen1.js
│   │   ├── screen2.js
│   │   ├── screen3.js
│   │   ├── screen4.js
│   │   ├── screen5.js
│   │   └── screen6.js
│   │
│   └── swipers/
│       └── swipers.js       # 所有 Swiper 初始化
│
├── utils/
│   └── cls-observer.js      # CLS 監聽工具
│
└── main.js                  # 主入口檔案
```

## 🚀 如何使用

### 開發模式

1. **安裝依賴**（首次使用或更新 package.json 後）
```bash
npm install
```

2. **啟動開發伺服器**
```bash
npm run dev
```

這會：
- 自動監聽 `src/js/**/*.js` 的所有檔案變更
- 使用 Rollup 自動打包模組到 `public/assets/js/main.js`
- 瀏覽器自動重新載入

### 生產模式

```bash
npm run generate
```

會自動打包並壓縮 JS 檔案。

## ✏️ 如何修改

### 修改現有 Screen 動畫

只需要編輯對應的 screen 檔案即可：

```javascript
// 範例：修改 screen1 的房子動畫
// 編輯：src/js/modules/screens/screen1.js

houseAni() {
    const { house } = this.elements;
    this.tl().delay(0.3).fromTo(
        house,
        {
            opacity: 0,
            y: 100,
            scale: 0.5  // 新增：縮放效果
        },
        {
            opacity: 1,
            y: 0,
            scale: 1    // 新增：縮放效果
        }
    );
}
```

### 新增 Screen

1. 在 `src/js/modules/screens/` 建立新檔案（例如：`screen7.js`）
2. 參考其他 screen 的結構編寫
3. 在 `src/js/main.js` 中導入並初始化：

```javascript
// 1. 導入模組
import { screen7 } from './modules/screens/screen7.js';

// 2. 加入 motion 物件
window.motion = {
    // ... 其他 screens
    screen7
};

// 3. 初始化
motion.screen7.init();

// 4. 執行動畫
motion.screen7.hdAni();
// ...
```

### 修改共用動畫

編輯 `src/js/modules/common/animations.js` 中的函數：

```javascript
// 範例：修改共用的背景動畫
export const commonBgAni = (_this) => {
    const { bg } = _this.elements;
    _this.tl().fromTo(
        bg,
        {
            opacity: 0,
            scale: 1.1  // 新增：初始放大
        },
        {
            opacity: 1,
            scale: 1,   // 新增：回到正常大小
            duration: 0.8,
            ease: "power2.out"
        }
    );
};
```

所有使用 `commonBgAni` 的 screen 都會自動套用新效果。

## 📝 開發優勢

### ✅ 優點

1. **清晰的結構** - 每個功能都在獨立的檔案中
2. **容易維護** - 修改某個 screen 不會影響其他部分
3. **程式碼重用** - 共用的動畫函數集中管理
4. **開發效率** - 只需修改對應的模組檔案
5. **自動打包** - Gulp 會自動處理模組打包

### 📦 打包說明

- **開發環境**：產生 sourcemap，方便除錯
- **生產環境**：自動壓縮，最佳化檔案大小
- 最終輸出：`public/assets/js/main.js`

## 🔧 技術細節

- **模組系統**：ES6 Modules (`import/export`)
- **打包工具**：Rollup
- **構建工具**：Gulp
- **輸出格式**：IIFE（立即執行函數，相容舊版瀏覽器）

## 💡 常見問題

### Q: 為什麼要模組化？
A: 原本的 `main.js` 有 782 行，修改時很難定位。模組化後每個檔案只負責一個功能，開發更容易。

### Q: 需要手動打包嗎？
A: 不需要！執行 `npm run dev` 後，修改任何 `src/js/` 下的檔案都會自動打包。

### Q: 可以直接修改 public/assets/js/main.js 嗎？
A: ❌ 不建議！該檔案是自動生成的。請修改 `src/js/` 下的原始檔案。

### Q: 舊的 main.js 還可以用嗎？
A: 可以！如果想切回舊版本，只需把 `public/assets/js/main.js` 改回原本的內容即可。

