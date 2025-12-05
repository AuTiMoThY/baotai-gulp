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

    const resourcesLoading = (callback) => {
        const loadingScreen = document.querySelector(".loading-screen");
        const loadingText = document.getElementById("loading-text");

        if (!loadingScreen) {
            gsap.delayedCall(0.5, () => {
                if (typeof callback === 'function') {
                    callback();
                }
            });
            return;
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
                    loadingText.textContent = displayValue;
                    currentDisplayPercent = displayValue;
                },
                onComplete: function () {
                    progressTween = null;
                }
            });

            if (targetPercent >= 100) {
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
    };

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
    };

    window.addEventListener("load", function () {
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
