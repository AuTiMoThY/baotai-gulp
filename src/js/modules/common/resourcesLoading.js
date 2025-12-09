// 用於除錯：保存 loading screen 的引用和控制方法
let loadingScreenInstance = null;

export const resourcesLoading = (callback) => {
    const loadingScreen = document.querySelector(".loading-screen");
    const loadingText = document.getElementById("loading-text");

    if (!loadingScreen) {
        gsap.delayedCall(0.5, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
        return null;
    }

    const images = Array.from(document.images);
    const videos = Array.from(document.querySelectorAll("video"));
    const resources = [...images, ...videos]; // 統一資源陣列
    const totalResources = resources.length;
    // console.log(resources);
    // console.log(totalResources);
    let loadedResources = 0;
    let currentDisplayPercent = 0; // 追蹤當前顯示的百分比
    let progressTween = null; // 追蹤當前的動畫實例

    // 更新百分比函數
    function updateProgress() {
        let targetPercent =
            totalResources === 0
                ? 100
                : Math.floor((loadedResources / totalResources) * 100);
        // console.log(targetPercent);

        // 如果已經有動畫在運行，先停止它
        if (progressTween) {
            progressTween.kill();
        }

        // 創建動畫對象
        const progressObj = { value: currentDisplayPercent };

        // 使用 GSAP 動畫從當前值到目標值
        progressTween = gsap.to(progressObj, {
            value: targetPercent,
            duration: 0.5,
            ease: "power1.out",
            onUpdate: function () {
                const displayValue = Math.floor(progressObj.value);
                if (loadingText) {
                    loadingText.textContent = displayValue;
                }
                currentDisplayPercent = displayValue;
            },
            onComplete: function () {
                progressTween = null;
            }
        });

        if (targetPercent >= 100) {
            // 【除錯模式】讀取完不消失 - 註解掉隱藏動畫
            // 等待動畫完成後再執行隱藏動畫
            gsap.delayedCall(0.5, () => {
                gsap.timeline()
                    .to(loadingScreen, {
                        duration: 1,
                        opacity: 0,
                        ease: "power3.in"
                    })
                    .to(
                        loadingScreen,
                        { duration: 1, display: "none", ease: "power1.inOut" },
                        "<0.5"
                    );

                if (typeof callback === 'function') {
                    callback();
                }

            });

            // 【除錯模式】讀取完成後只執行 callback，不隱藏 loading screen
            // gsap.delayedCall(0.5, () => {
            //     if (typeof callback === 'function') {
            //         callback();
            //     }
            // });
        }
    }

    // 統一監聽函數
    function listenResourceLoad(res) {
        // 已經加載完成或可播放
        if (
            (res.tagName === "IMG" && res.complete) ||
            (res.tagName === "VIDEO" && res.readyState >= 3)
        ) {
            loadedResources++;
            updateProgress();
        } else {
            res.addEventListener("load", () => {
                loadedResources++;
                updateProgress();
            });
            res.addEventListener("loadeddata", () => {
                loadedResources++;
                updateProgress();
            });
            res.addEventListener("error", () => {
                loadedResources++;
                updateProgress();
            });
        }
    }

    // 監聽所有資源
    resources.forEach((res) => listenResourceLoad(res));

    // 如果沒有資源，也直接跳到 100%
    if (totalResources === 0) updateProgress();

    // 【除錯模式】返回控制方法，方便回溯和除錯
    const controller = {
        // 顯示 loading screen
        show: () => {
            if (loadingScreen) {
                gsap.set(loadingScreen, { display: "flex", opacity: 1 });
            }
        },
        // 隱藏 loading screen
        hide: () => {
            if (loadingScreen) {
                gsap.timeline()
                    .to(loadingScreen, {
                        duration: 1,
                        opacity: 0,
                        ease: "power3.in"
                    })
                    .to(
                        loadingScreen,
                        { duration: 1, display: "none", ease: "power1.inOut" },
                        "<0.5"
                    );
            }
        },
        // 重置進度
        reset: () => {
            loadedResources = 0;
            currentDisplayPercent = 0;
            if (loadingText) {
                loadingText.textContent = 0;
            }
            if (progressTween) {
                progressTween.kill();
                progressTween = null;
            }
        },
        // 設置進度百分比（用於測試）
        setProgress: (percent) => {
            if (loadingText) {
                loadingText.textContent = Math.floor(percent);
            }
            currentDisplayPercent = percent;
        },
        // 獲取當前狀態
        getState: () => {
            return {
                loadedResources,
                totalResources,
                currentPercent: currentDisplayPercent,
                targetPercent: totalResources === 0 ? 100 : Math.floor((loadedResources / totalResources) * 100)
            };
        },
        // 獲取 loading screen 元素
        element: loadingScreen
    };

    // 保存實例到全局變數，方便在控制台調用
    loadingScreenInstance = controller;
    
    // 將控制器掛載到 window 上，方便在控制台除錯
    if (typeof window !== 'undefined') {
        window.loadingScreenController = controller;
        // console.log('【除錯模式】Loading screen 控制器已掛載到 window.loadingScreenController');
        // console.log('可用方法：');
        // console.log('  - window.loadingScreenController.show() - 顯示 loading screen');
        // console.log('  - window.loadingScreenController.hide() - 隱藏 loading screen');
        // console.log('  - window.loadingScreenController.reset() - 重置進度');
        // console.log('  - window.loadingScreenController.setProgress(50) - 設置進度百分比');
        // console.log('  - window.loadingScreenController.getState() - 獲取當前狀態');
    }

    return controller;
};
