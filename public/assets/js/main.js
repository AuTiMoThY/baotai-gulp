(function () {
    'use strict';

    const pageBanner = {
        bannerAniRepeat(bodyClass) {
            const tl = gsap.timeline({
                yoyo: true,
                repeat: -1
            });
            tl.fromTo(
                `${bodyClass} .banner-box .img-box img`,
                { scale: 1 },
                { duration: 15, ease: "power1.inOut", scale: 1.25 }
            );
        },

        bannerAni(bodyClass) {
            const tl = gsap.timeline({
                onComplete: () => this.bannerAniRepeat(bodyClass)
            });
            tl.from(`${bodyClass} .banner-box .img-box img`, {
                scale: 1.3,
                opacity: 0,
                duration: 7,
                // ease: "power1.inOut"
            });
        }
    };

    const pageTitle = {
        titleAni(bodyClass, callback) {
            const zhSplit = SplitText.create(`${bodyClass} .title-box .top .zh`, {
                type: "chars,words,lines",
                linesClass: "clip-text"
            });

            const enSplit = SplitText.create(
                `${bodyClass} .title-box .bottom .en`,
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );
            let tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: `${bodyClass} .title-box`,
                    start: "top 75%",
                    once: true,
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(zhSplit.chars, {
                duration: 1,
                opacity: 0,
                stagger: 0.1,
                y: 80
            })
                .fromTo(
                    enSplit.chars,
                    {
                        opacity: 0,
                        rotationY: 180,
                        yPercent: 100
                    },
                    {
                        duration: 1,
                        opacity: 1,
                        rotationY: 0,
                        yPercent: 0,
                        stagger: 0.03
                    },
                    "<0.3"
                )

                .from(
                    `${bodyClass} .title-box .top .line`,
                    { duration: 1, width: "0", opacity: 0 },
                    "<0.45"
                )
                .call(
                    function () {
                        // 提前 1 秒觸發的 callback
                        // console.log("提前 1 秒觸發", this);
                        callback && callback();
                    },
                    null,
                    "-=1"
                );
        }
    };

    const isMobile = () => {
        return window.matchMedia("(max-width: 1024px)").matches;
    };

    const headerScroll = {
        init() {
            window.addEventListener("scroll", function () {
                const header = document.querySelector(".header");

                if (window.scrollY > 50) {
                    header.classList.add("transparent");
                } else {
                    header.classList.remove("transparent");
                }
            });
        }
    };

    // 用於除錯：保存 loading screen 的引用和控制方法

    const resourcesLoading = (callback) => {
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
        console.log(resources);
        console.log(totalResources);
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
        
        // 將控制器掛載到 window 上，方便在控制台除錯
        if (typeof window !== 'undefined') {
            window.loadingScreenController = controller;
            console.log('【除錯模式】Loading screen 控制器已掛載到 window.loadingScreenController');
            console.log('可用方法：');
            console.log('  - window.loadingScreenController.show() - 顯示 loading screen');
            console.log('  - window.loadingScreenController.hide() - 隱藏 loading screen');
            console.log('  - window.loadingScreenController.reset() - 重置進度');
            console.log('  - window.loadingScreenController.setProgress(50) - 設置進度百分比');
            console.log('  - window.loadingScreenController.getState() - 獲取當前狀態');
        }

        return controller;
    };

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

    /**
     * 主入口檔案
     * 模組化版本 - 方便開發維護
     */


    window.ucyCore = {
        isMobile,
        pageBanner,
        pageTitle,
        headerScroll,
        resourcesLoading,
        viewport,
    };


    // 防止瀏覽器記住滾動位置，重新整理時回到頂部
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.addEventListener("load", function () {
        // 確保頁面載入時回到頂部
        window.scrollTo(0, 0);
        ucyCore.headerScroll.init();

        const parallax = document.querySelectorAll(".ukiyo");
        new Ukiyo(parallax, {
            scale: 1.1,
            speed: 2,
            willChange: true,
            externalRAF: false
        });
    });

    $('.hamburger').click(function (e) { 
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('.header-box .link-box').toggleClass('active');
    });

})();
//# sourceMappingURL=main.js.map
