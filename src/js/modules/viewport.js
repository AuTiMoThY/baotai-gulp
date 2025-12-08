/**
 * Viewport 管理模組
 * 處理視窗尺寸計算、響應式斷點切換
 */

class Viewport {
    constructor() {
        this.vw = 0;
        this.dvh = 0;
        this.currentContext = null;
        this.breakpoint = 1024; // 手機版/桌面版斷點

        // 設計稿基準寬度
        this.baseWidth = {
            pc: 1920,
            sp: 768
        };

        this.contextChangeEvent = null;

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // 計算初始視窗尺寸
        this.updateViewportSize();

        // 設置初始 context
        this.setCurrentContext();

        // 創建 contextChange 事件
        this.createContextChangeEvent();

        // 監聽視窗大小改變
        this.bindResizeEvent();

        // 將 rpx 函數掛載到 window
        window.rpx = this.rpx.bind(this);

        // 標記為已準備
        document.documentElement.classList.add("vwready");

        console.log("✅ Viewport initialized:", {
            vw: this.vw,
            dvh: this.dvh,
            context: this.currentContext
        });
    }

    /**
     * 更新視窗尺寸
     */
    updateViewportSize() {
        // 1. 計算並儲存視窗寬度
        this.vw = document.body.clientWidth;
        window.vw = this.vw;

        // 設置 CSS 自定義屬性，可在 CSS 中使用 var(--vw)
        document.documentElement.style.setProperty("--vw", `${this.vw}px`);

        // 2. 計算 Large Viewport Height (移動端大視窗高度)
        const tempDiv = document.createElement("div");
        tempDiv.style.height = "100dvh";
        tempDiv.style.position = "fixed";
        document.body.append(tempDiv);

        this.dvh = tempDiv.offsetHeight;
        window.dvh = this.dvh;

        tempDiv.remove();

        // 設置 CSS 自定義屬性
        document.documentElement.style.setProperty("--dvh", `${this.dvh}px`);
    }

    /**
     * 設置當前環境 (pc/sp)
     */
    setCurrentContext() {
        const newContext =
            document.body.clientWidth < this.breakpoint ? "sp" : "pc";
        const isContextChanged =
            this.currentContext && this.currentContext !== newContext;

        this.currentContext = newContext;
        window.currentContext = newContext;

        // 如果環境改變，觸發事件並重新載入頁面
        if (isContextChanged) {
            window.dispatchEvent(this.contextChangeEvent);
            console.log("🔄 Context changed to:", newContext);
            location.reload();
        }
    }

    /**
     * 創建 contextChange 事件
     */
    createContextChangeEvent() {
        // 兼容 IE 的寫法
        if (document.documentMode) {
            this.contextChangeEvent = document.createEvent("Event");
            this.contextChangeEvent.initEvent("contextChange", true, true);
        } else {
            this.contextChangeEvent = new Event("contextChange");
        }
    }

    /**
     * 綁定 resize 事件
     */
    bindResizeEvent() {
        let resizeTimer = null;

        window.addEventListener(
            "resize",
            () => {
                // 防抖處理
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(() => {
                    this.updateViewportSize();
                    this.setCurrentContext();
                    resizeTimer = null;
                }, 100);
            },
            false
        );
    }

    /**
     * 響應式像素轉換函數
     * 將設計稿像素值轉換為實際響應式像素
     *
     * @param {number} designPx - 設計稿上的像素值
     * @param {string} context - 'pc' 或 'sp'，不提供則使用當前 context
     * @returns {number} 轉換後的實際像素值
     *
     * @example
     * rpx(100) // 在 1920px 寬的 PC 上 → 133.33px
     * rpx(100, 'sp') // 強制使用手機版基準 → 110.4px
     */
    rpx(designPx, context) {
        const targetContext = context || this.currentContext;
        const baseWidth = this.baseWidth[targetContext];
        return (designPx * this.vw) / baseWidth;
    }

    /**
     * 獲取當前視窗資訊
     */
    getViewportInfo() {
        return {
            width: this.vw,
            height: this.dvh,
            context: this.currentContext,
            isMobile: this.currentContext === "sp"
        };
    }
}

// 創建單例
const viewport = new Viewport();

export { viewport };
