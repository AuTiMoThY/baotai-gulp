/**
 * CLS (Cumulative Layout Shift) 監聽器
 * 等待頁面佈局穩定後執行回調
 */

export const waitForCLSStable = (callback) => {
    let clsStableTimer = null;
    let maxWaitTimer = null;
    let hasLayoutShift = false;
    let hasExecuted = false;
    const STABLE_TIME = 1000; // 1000ms 內沒有 layout shift 則視為穩定
    const MAX_WAIT_TIME = 3000; // 最長等待 3 秒
    const startTime = Date.now();

    // 檢查瀏覽器是否支援 PerformanceObserver
    if (!window.PerformanceObserver) {
        console.log("瀏覽器不支援 PerformanceObserver，直接執行動畫");
        setTimeout(callback, 1000);
        return;
    }

    const executeCallback = () => {
        if (hasExecuted) return;
        hasExecuted = true;

        clearTimeout(clsStableTimer);
        clearTimeout(maxWaitTimer);

        if (observer) {
            observer.disconnect();
        }

        callback();
    };

    let observer;
    try {
        observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    hasLayoutShift = true;
                    console.log("檢測到 Layout Shift:", entry.value);

                    clearTimeout(clsStableTimer);

                    if (Date.now() - startTime > MAX_WAIT_TIME) {
                        console.log("已達到最長等待時間，強制執行動畫");
                        executeCallback();
                        return;
                    }

                    clsStableTimer = setTimeout(() => {
                        console.log("CLS 已穩定 " + STABLE_TIME + "ms");
                        executeCallback();
                    }, STABLE_TIME);
                }
            }
        });

        observer.observe({ type: "layout-shift", buffered: true });

        clsStableTimer = setTimeout(() => {
            if (!hasLayoutShift) {
                console.log("未檢測到 Layout Shift，直接執行動畫");
            }
            executeCallback();
        }, STABLE_TIME);

        maxWaitTimer = setTimeout(() => {
            console.log("達到最長等待時間，強制執行動畫");
            executeCallback();
        }, MAX_WAIT_TIME);
    } catch (error) {
        console.error("PerformanceObserver 初始化失敗:", error);
        setTimeout(callback, 1000);
    }
};

