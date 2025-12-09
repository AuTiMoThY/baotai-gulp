window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    const isMobile = ucyCore.isMobile();
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

    // 共用：建立 SplitText 實例
    const createSplitText = (selector, type = "chars,words,lines") =>
        SplitText.create(selector, {
            type,
            linesClass: "clip-text"
        });

    // 共用：限制百分比數值
    const clampPercent = (value, min = 0, max = 100) =>
        Math.min(max, Math.max(min, value));

    // 卡片1：標題與首屏進場動畫
    const c1Ani = () => {
        const enSplit1 = createSplitText(
            ".index-body .scroll-box .card1 .main-box .title-box .en"
        );

        const bigzhSplit1 = createSplitText(
            ".index-body .scroll-box .card1 .main-box .title-box .zh"
        );

        const content = createSplitText(
            ".index-body .scroll-box .card1 .main-box .title-box .content"
        );

        let tl = gsap.timeline({ delay: 0.85 });
        tl.fromTo(
            enSplit1.chars,
            {
                opacity: 0,
                rotationY: 180,
                yPercent: 100
            },
            {
                duration: 0.9,
                opacity: 1,
                rotationY: 0,
                yPercent: 0,
                stagger: 0.03
            }
        )
            .from(
                bigzhSplit1.chars,
                { duration: 1, yPercent: 100, opacity: 0, stagger: 0.04 },
                "<0.3"
            )
            .from(content.lines, { duration: 1, y: "80", opacity: 0 }, "<0.3")
            .from(
                ".index-body .scroll-box .card1 .main-box .p-fv-img-wrapper .img-box",
                {
                    duration: 1,
                    ease: "power2.in",
                    opacity: 0
                },
                "<0.2"
            )
            .from(
                ".index-body .c-bg-black-s",
                {
                    duration: 1,
                    ease: "power2.in",
                    opacity: 0
                },
                "<0.35"
            );
    };
    // 卡片1：滾動縮放與 pin 動畫
    const c1Scroll = () => {
        //-- 第一卡(電腦) --
        // 桌面版：首屏圖片放大與 pin
        const c1ScrollAni = () => {
            // 計算 21vw 對應的 vh 值，解決 Safari 混合單位動畫問題
            const imgBox = document.querySelector(
                ".index-body .card1 .main-box .p-fv-img-wrapper .img-box"
            );
            const imgBoxHeight = imgBox.offsetHeight; // 取得元素高度（像素）
            const viewportHeight = window.innerHeight; // 取得視窗高度（像素）
            const initialHeightVh =
                (imgBoxHeight / viewportHeight) * 100 + "dvh"; // 轉換成 dvh
            // console.log(initialHeightVh);
            gsap.set(
                ".index-body .card1 .main-box .p-fv-img-wrapper .img-box",
                {
                    height: initialHeightVh
                }
            );
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".card1",
                    start: "top top",
                    end: "+=150%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true
                    // markers: true,
                }
            });

            tl.fromTo(
                ".index-body .card1 .main-box .p-fv-img-wrapper .img-box",
                {
                    width: "40vw",
                    height: initialHeightVh,
                    right: "7vw",
                    top: "10vw"
                },
                {
                    duration: 1,
                    width: "100vw",
                    height: "100dvh",
                    right: "0vw",
                    top: "0vw"
                }
            )
                .to(".card1 .title-box", { duration: 1, top: "-40vw" }, "<")
                .to(
                    ".c-maskText-wrapper .c-maskText-inner",
                    { duration: 1, x: -150 },
                    "<"
                );
            // .fromTo('.index-body .card1 .main-box .p-fv-img-wrapper .img-box img', { width: '100%', }, { duration: 0.5, width: '100vw', })
        };
        //-- 第一卡(手機) --
        // 手機版：首屏圖片與標題淡入
        const c1ScrollAni_mobile = () => {
            const enSplit1 = createSplitText(
                ".hot-project .title-box .pad .en",
                "chars"
            );

            let tl = gsap.timeline({ delay: 1 });
            tl.from(".card1 .p-fv-img-wrapper .img-box", {
                duration: 1.5,
                scale: 1.5,
                ease: "power2.inOut"
            })
                .from(
                    ".marquee-box",
                    { duration: 1.5, y: -100, ease: "power2.out" },
                    "<0.8"
                )
                .from(
                    ".hot-project .title-box .pad .zh",
                    {
                        duration: 1,
                        y: 20,
                        scale: 1.2,
                        opacity: 0,
                        ease: "power1.out"
                    },
                    "<0.5"
                )
                .fromTo(
                    enSplit1.chars,
                    { opacity: 0, rotationY: 180, yPercent: 100 },
                    {
                        duration: 1,
                        opacity: 1,
                        rotationY: 0,
                        yPercent: 0,
                        stagger: 0.1
                    },
                    "<0.3"
                )
                .from(
                    ".hot-project .swiper-box",
                    {
                        duration: 1.5,
                        y: 10,
                        scale: 0.9,
                        filter: "blur(10px)",
                        opacity: 0,
                        ease: "power1.out"
                    },
                    "<0.5"
                )
                .from(
                    ".hot-project .swiper-controller",
                    { duration: 1, x: -30, opacity: 0, ease: "power1.out" },
                    "<0.3"
                );
        };

        if (!isMobile) {
            c1ScrollAni();
        } else {
            // c1ScrollAni_mobile();
        }
    };
    // 跑馬燈區塊的透明度控制
    const marqueeScroll = () => {
        //-- 跑馬燈動態 --
        // 滾動觸發背景定位
        const marqueeAni = () => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    toggleActions: "play none none reverse",
                    trigger: ".marquee-box",
                    start: "top 70%",
                    end: "top 70%"
                }
            });

            tl.to(".c-bg-black-s", {
                duration: 0.01,
                position: "absolute",
                top: 0
            });
        };

        if (!isMobile) {
            marqueeAni();
        }
    };
    // 更新頁碼顯示
    const updateFraction = (swiper, currentIndex) => {
        const fractionEl = document.querySelector(".swiper-pagination");

        const current = currentIndex || swiper.realIndex;
        const originalTotal =
            swiper.originalSlideCount ||
            (() => {
                // 如果沒有儲存，計算原始數量（排除複製的）
                const wrapper = swiper.el.querySelector(".swiper-wrapper");
                if (wrapper) {
                    const originalSlides = wrapper.querySelectorAll(
                        ".swiper-slide:not(.swiper-slide-duplicate)"
                    );
                    return originalSlides.length;
                }
                return swiper.slides.length;
            })();

        // 個位數補0
        const currentStr = String(current).padStart(2, "0");
        const totalStr = String(originalTotal).padStart(2, "0");

        fractionEl.textContent = `${currentStr} / ${totalStr}`;
    };
    // 熱銷建案： swiper 與滾動切換
    const hotProjectScroll = () => {
        let swiperMiddle = null;
        let total = 0;
        let initialSlideIndex = 1;
        let currentIndex = 0;
        let totalSlides = 0;
        let targetIndex = 0;

        const initHotProjectSwiper = () => {
            // 先取得原始 slide 數量（複製之前）
            const swiperWrapper = document.querySelector(
                ".swiper-middle.show-desktop .swiper-wrapper"
            );
            let originalSlideCount = 0;
            if (swiperWrapper) {
                const originalSlides =
                    swiperWrapper.querySelectorAll(".swiper-slide");
                originalSlideCount = originalSlides.length;
            }

            console.log(isMobile);

            swiperMiddle = new Swiper(".swiper-middle.show-desktop", {
                loop: false,
                speed: 1200,
                allowTouchMove: isMobile ? true : false,
                slidesPerView: isMobile ? 1 : "auto",
                initialSlide: initialSlideIndex,
                autoplay: isMobile
                    ? {
                          delay: 1500
                      }
                    : false,
                // navigation: isMobile
                //     ? { prevEl: ".prev", nextEl: ".next" }
                //     : false,
                on: {
                    init: function () {
                        // Swiper 初始化完成後，複製 slides 以實現無縫 loop
                        const swiperWrapper =
                            this.el.querySelector(".swiper-wrapper");
                        if (swiperWrapper) {
                            const slides = swiperWrapper.querySelectorAll(
                                ".swiper-slide:not(.swiper-slide-duplicate)"
                            );
                            if (slides.length > 0) {
                                // 複製最後一個 slide 到第一個之前
                                const lastSlide = slides[slides.length - 1];
                                const clonedLastSlide =
                                    lastSlide.cloneNode(true);
                                clonedLastSlide.classList.add(
                                    "swiper-slide-duplicate",
                                    "swiper-slide-duplicate-prev"
                                );
                                swiperWrapper.insertBefore(
                                    clonedLastSlide,
                                    slides[0]
                                );

                                // 複製第一個 slide 到最後一個之後
                                const firstSlide = slides[0];
                                const clonedFirstSlide =
                                    firstSlide.cloneNode(true);
                                clonedFirstSlide.classList.add(
                                    "swiper-slide-duplicate",
                                    "swiper-slide-duplicate-next"
                                );
                                swiperWrapper.appendChild(clonedFirstSlide);
                            }
                        }

                        // 儲存原始數量到 swiper 實例，供後續使用
                        this.originalSlideCount = originalSlideCount;

                        updateFraction(this);
                        // Swiper 初始化完成後，設置滾動切換功能
                        if (!isMobile) {
                            initScrollTrigger(this);
                        }
                    },
                    slideChange: function () {
                        updateFraction(this);
                    }
                }
            });

            // 初始設定偏移 - 使用原始數量
            total =
                swiperMiddle.originalSlideCount || swiperMiddle.slides.length;
            // 如果 originalSlideCount 還沒設定，計算原始數量（排除複製的）
            if (!swiperMiddle.originalSlideCount) {
                const wrapper = document.querySelector(
                    ".swiper-middle.show-desktop .swiper-wrapper"
                );
                if (wrapper) {
                    const originalSlides = wrapper.querySelectorAll(
                        ".swiper-slide:not(.swiper-slide-duplicate)"
                    );
                    total = originalSlides.length;
                    swiperMiddle.originalSlideCount = total;
                }
            }
        };

        // 滾動切換 swiper 功能（僅桌面版）
        // 桌面版：使用 ScrollTrigger 控制 swiper 進度
        function initScrollTrigger(swiperInstance = swiperMiddle) {
            if (!swiperInstance) {
                return;
            }

            const hotProjectElement = document.querySelector(".hot-project");
            if (!hotProjectElement) return;

            // 簡化：獲取原始 slide 數量（排除複製的）
            totalSlides =
                swiperInstance.originalSlideCount ||
                (() => {
                    const wrapper =
                        swiperInstance.el.querySelector(".swiper-wrapper");
                    if (wrapper) {
                        const originalSlides = wrapper.querySelectorAll(
                            ".swiper-slide:not(.swiper-slide-duplicate)"
                        );
                        return originalSlides.length;
                    }
                    return swiperInstance.slides.length;
                })();

            // 獲取初始 slide 的索引（排除複製的）
            const initialSlideIndex = swiperInstance.realIndex;

            // 調試：確認初始值
            console.log("初始化:", {
                totalSlides,
                initialSlideIndex,
                realIndex: swiperInstance.realIndex,
                activeIndex: swiperInstance.activeIndex
            });
            // 創建一個進度對象來追蹤滾動進度
            const progressObj = { progress: 0 };
            let lastIndex = swiperInstance.realIndex;
            let scrollTriggerInstance = null;
            let isUserClicking = false;
            let isScrolling = false; // 追蹤是否正在滾動
            let scrollTimeout = null; // 滾動停止的計時器
            let fixedStartPos = null;
            let fixedScrollRange = null;

            // 獲取 slide 的實際顯示高度
            // 因為 Swiper 使用 slidesPerView，需要獲取實際顯示的高度
            let slideHeight = 0;

            // 使用 Swiper 容器高度除以 slidesPerView（最準確）
            const swiperHeight =
                swiperInstance.height || swiperInstance.el.offsetHeight;
            console.log(swiperHeight);
            const slidesPerView = swiperInstance.params.slidesPerView || 1;
            // 當 slidesPerView 為 'auto' 時，使用實際的 slide 高度
            if (slidesPerView === "auto" && swiperInstance.slides.length > 0) {
                slideHeight =
                    swiperInstance.slides[0].offsetHeight || swiperHeight;
            } else {
                slideHeight =
                    swiperHeight /
                    (typeof slidesPerView === "number" ? slidesPerView : 1);
            }
            console.log(swiperHeight);

            // 定義滾動範圍的起始和結束索引（統一使用，避免重複）
            const startIndex = initialSlideIndex;
            const endIndex = totalSlides; // 結束索引（totalSlides，不減 1）

            // 計算滾動範圍
            const scrollPerSlide = slideHeight;
            const slidesToScroll = endIndex - startIndex; // 需要滾動的 slide 數量
            fixedScrollRange = slidesToScroll * scrollPerSlide + 200;

            // 調試信息
            console.log("滾動範圍計算:", {
                totalSlides,
                startIndex,
                endIndex,
                slidesToScroll,
                fixedScrollRange
            });

            // 使用 timeline 配合 scrub 來實現流暢的滾動切換
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: hotProjectElement,
                    start: "-10% top",
                    end: () => `+=${fixedScrollRange}`, // 使用計算出的滾動範圍
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    scrub: 0.1, // 減小 scrub 值，讓切換更緊跟滾動（值越小越緊跟）
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // console.log(self);
                        // 如果是用戶點擊操作，不響應滾動更新
                        if (isUserClicking) {
                            return;
                        }

                        // 標記正在滾動
                        isScrolling = true;
                        // 清除之前的計時器
                        if (scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }
                        // 設置新的計時器，在滾動停止後重置標記
                        scrollTimeout = setTimeout(() => {
                            isScrolling = false;
                        }, 150); // 150ms 無滾動更新後視為滾動停止

                        // 簡化計算：將 progress (0-1) 映射到從初始位置到最後一個 slide
                        const progress = Math.max(
                            0,
                            Math.min(1, self.progress)
                        );

                        // 使用外部定義的 startIndex 和 endIndex 計算目標索引
                        // progress 0 -> startIndex, progress 1 -> endIndex
                        targetIndex = Math.round(
                            startIndex + progress * (endIndex - startIndex)
                        );

                        // 確保索引在有效範圍內（0 到 totalSlides）
                        const clampedTargetIndex = Math.max(
                            0,
                            Math.min(targetIndex, totalSlides)
                        );

                        // 監控 swiper 當前的 index
                        const currentRealIndex = swiperInstance.realIndex;
                        const currentActiveIndex = swiperInstance.activeIndex;
                        // console.log('滾動監控:', {
                        //     progress: progress.toFixed(3),
                        //     targetIndex: clampedTargetIndex,
                        //     calculatedTarget: targetIndex,
                        //     realIndex: currentRealIndex,
                        //     activeIndex: currentActiveIndex,
                        //     totalSlides,
                        //     startIndex,
                        //     endIndex
                        // });

                        // 只在索引改變時切換
                        if (clampedTargetIndex !== lastIndex) {
                            // 使用 slideTo 直接切換到目標索引（使用 realIndex，排除複製的 slides）
                            swiperInstance.slideTo(
                                clampedTargetIndex,
                                300,
                                false
                            );
                            lastIndex = clampedTargetIndex;
                        }
                    },
                    onRefresh: function () {
                        // 當 ScrollTrigger 刷新時，更新固定的 start 位置
                        if (typeof this.start === "number") {
                            fixedStartPos = this.start;
                        }
                    }
                }
            });

            // 保存 ScrollTrigger 實例
            scrollTriggerInstance = scrollTl.scrollTrigger;

            // 等待 ScrollTrigger 初始化完成後，獲取實際的 start 位置
            // ScrollTrigger.refresh();
            const updateFixedStartPos = () => {
                if (
                    typeof scrollTriggerInstance.start === "number" &&
                    scrollTriggerInstance.start > 0
                ) {
                    fixedStartPos = scrollTriggerInstance.start;
                } else {
                    // 如果 ScrollTrigger 還沒計算好，使用手動計算
                    const triggerRect =
                        hotProjectElement.getBoundingClientRect();
                    fixedStartPos = triggerRect.top + window.scrollY;
                }
                // 確保 fixedStartPos 不為 0
                if (fixedStartPos === 0 || fixedStartPos === null) {
                    const triggerRect =
                        hotProjectElement.getBoundingClientRect();
                    fixedStartPos = triggerRect.top + window.scrollY;
                }
            };

            updateFixedStartPos();

            // 動畫 progressObj 從 0 到 1，配合 scrub 使用
            scrollTl.to(progressObj, {
                progress: 1,
                duration: 1,
                ease: "none"
            });

            // 當 swiper 切換時更新 lastIndex，保持同步
            swiperInstance.on("slideChange", function () {
                lastIndex = swiperInstance.realIndex;
            });

            // 計算目標滾動位置的函數（使用固定的基準位置，避免疊加）
            const calculateTargetScroll = (targetIndex) => {
                if (!scrollTriggerInstance) {
                    return null;
                }

                // 確保 targetIndex 在有效範圍內（索引從 1 開始）
                targetIndex = Math.max(1, Math.min(targetIndex, totalSlides));

                // 使用固定的基準位置，避免位置疊加
                if (fixedStartPos === null || fixedScrollRange === null) {
                    return null;
                }

                // 每次計算時都使用固定的基準位置，確保不會疊加
                const startPos = fixedStartPos;
                const scrollRange = fixedScrollRange;

                // 計算目標進度和位置（與 onUpdate 中的計算方式保持一致）
                // progress = (targetIndex - startIndex) / (endIndex - startIndex)
                // 這樣當 targetIndex = startIndex 時，progress = 0（滾動到起始位置）
                // 當 targetIndex = endIndex 時，progress = 1（滾動到結束位置）
                const targetProgress =
                    endIndex - startIndex > 0
                        ? (targetIndex - startIndex) / (endIndex - startIndex)
                        : 0;
                const targetScroll = startPos + targetProgress * scrollRange;

                // 確保返回的是有效數字
                if (isNaN(targetScroll) || targetScroll < 0) {
                    return null;
                }

                return Math.round(targetScroll);
            };

            // 使用 ScrollToPlugin 平滑滾動到目標位置
            let scrollAnimation = null;
            let scrollMonitorInterval = null; // 滾動監控計時器

            const scrollToTarget = (
                targetIndex,
                onCompleteCallback,
                customTargetScroll = null
            ) => {
                // 如果正在滾動，先停止當前的動畫
                if (scrollAnimation) {
                    scrollAnimation.kill();
                    scrollAnimation = null;
                }

                // 停止之前的滾動監控
                if (scrollMonitorInterval) {
                    clearInterval(scrollMonitorInterval);
                    scrollMonitorInterval = null;
                }

                // 確保 targetIndex 在有效範圍內（索引從 1 開始）
                const validTargetIndex = Math.max(
                    1,
                    Math.min(targetIndex, totalSlides)
                );

                // 如果提供了自定義目標滾動位置，使用它；否則計算
                let targetScroll = customTargetScroll;
                if (targetScroll === null) {
                    targetScroll = calculateTargetScroll(validTargetIndex);
                }

                // 確保目標滾動位置不小於 fixedStartPos（避免滾動到頁面頂部）
                if (targetScroll !== null && fixedStartPos !== null) {
                    targetScroll = Math.max(targetScroll, fixedStartPos);
                }

                if (targetScroll === null) {
                    isNavigating = false;
                    if (onCompleteCallback) onCompleteCallback();
                    return;
                }

                isUserClicking = true;

                // 先切換 swiper 到目標索引 - 在 loop mode 下使用 slideToLoop
                if (swiperInstance.params.loop) {
                    swiperInstance.slideToLoop(validTargetIndex, 300);
                } else {
                    swiperInstance.slideTo(validTargetIndex, 300);
                }
                // 更新 lastIndex 以保持同步
                lastIndex = validTargetIndex;

                // 使用 ScrollToPlugin 平滑滾動
                scrollAnimation = gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetScroll,
                        autoKill: false
                    },
                    ease: "power2.inOut",
                    onComplete: () => {
                        scrollAnimation = null;
                        // 停止滾動監控
                        if (scrollMonitorInterval) {
                            clearInterval(scrollMonitorInterval);
                            scrollMonitorInterval = null;
                        }
                        // 滾動完成後重置標記
                        setTimeout(() => {
                            isUserClicking = false;
                        }, 100);
                        // 執行回調
                        if (onCompleteCallback) onCompleteCallback();
                    }
                });
            };

            // 監聽導航按鈕點擊
            const prevBtn = document.querySelector(".hot-project .prev");
            const nextBtn = document.querySelector(".hot-project .next");

            let isNavigating = false; // 防止重複點擊
            const handleNavClick = (direction) => {
                // 如果正在滾動，禁止點擊
                if (isScrolling) return;
                if (!scrollTriggerInstance || isNavigating) return;

                // 記錄當前滾動位置和 hot-project 位置
                const currentScrollY = window.scrollY || window.pageYOffset;
                const hotProjectRect =
                    hotProjectElement.getBoundingClientRect();
                const hotProjectTop = hotProjectRect.top + currentScrollY;

                // 重新計算 fixedStartPos（確保它是正確的）
                // 優先使用 ScrollTrigger 的 start 位置，如果無效則使用 hot-project 的實際位置
                if (
                    typeof scrollTriggerInstance.start === "number" &&
                    scrollTriggerInstance.start > 0
                ) {
                    fixedStartPos = scrollTriggerInstance.start;
                } else if (
                    fixedStartPos === 0 ||
                    fixedStartPos === null ||
                    fixedStartPos < hotProjectTop - 100
                ) {
                    // 如果 fixedStartPos 無效或明顯不對，使用 hot-project 的實際位置
                    fixedStartPos = hotProjectTop;
                }

                // 獲取當前索引
                currentIndex = swiperInstance.realIndex;

                console.log("點擊導航:", {
                    direction,
                    totalSlides,
                    currentIndex,
                    currentScrollY,
                    hotProjectTop,
                    fixedStartPos
                });

                // 根據方向檢查是否到達邊界
                if (direction === "next" && totalSlides === currentIndex)
                    return;
                if (direction === "prev" && currentIndex === 1) return;

                isNavigating = true;

                // 計算目標索引
                targetIndex =
                    direction === "next" ? currentIndex + 1 : currentIndex - 1;

                // 確保目標索引在有效範圍內
                targetIndex = Math.max(1, Math.min(targetIndex, totalSlides));

                // 如果目標索引和當前索引相同，不執行滾動
                if (targetIndex === currentIndex) {
                    isNavigating = false;
                    return;
                }

                // 計算目標滾動位置
                const targetScroll = calculateTargetScroll(targetIndex);

                // 檢查當前是否在 hot-project 區域內
                const isInHotProjectRange =
                    currentScrollY >= fixedStartPos &&
                    currentScrollY <= fixedStartPos + fixedScrollRange;

                // 如果當前在 hot-project 區域內，直接使用計算出的目標位置
                // 如果不在區域內，需要先滾動到區域內
                let finalTargetScroll = targetScroll;

                // 確保目標滾動位置在 hot-project 區域範圍內
                finalTargetScroll = Math.max(
                    fixedStartPos,
                    Math.min(targetScroll, fixedStartPos + fixedScrollRange)
                );

                // 如果當前在區域內，且目標位置與當前位置相同或非常接近，不執行滾動
                if (
                    isInHotProjectRange &&
                    Math.abs(finalTargetScroll - currentScrollY) < 10
                ) {
                    console.log(
                        "當前已在目標位置附近，只切換 swiper，不滾動頁面"
                    );
                    // 只切換 swiper，不滾動頁面
                    if (swiperInstance.params.loop) {
                        swiperInstance.slideToLoop(targetIndex, 300);
                    } else {
                        swiperInstance.slideTo(targetIndex, 300);
                    }
                    lastIndex = targetIndex;
                    isNavigating = false;
                    return;
                }

                console.log("滾動計算:", {
                    targetIndex,
                    targetScroll,
                    finalTargetScroll,
                    fixedStartPos,
                    currentScrollY,
                    isInHotProjectRange,
                    hotProjectRange: `[${fixedStartPos}, ${fixedStartPos + fixedScrollRange}]`,
                    direction:
                        finalTargetScroll > currentScrollY ? "向下" : "向上",
                    scrollDistance: Math.abs(finalTargetScroll - currentScrollY)
                });

                // 開始滾動監控
                const startScrollMonitor = (targetScrollPos) => {
                    // 先停止之前的監控
                    if (scrollMonitorInterval) {
                        clearInterval(scrollMonitorInterval);
                        scrollMonitorInterval = null;
                    }

                    let lastScrollY = window.scrollY || window.pageYOffset;
                    scrollMonitorInterval = setInterval(() => {
                        const currentY = window.scrollY || window.pageYOffset;
                        const scrollDiff = currentY - lastScrollY;
                        const distanceToTarget = Math.abs(
                            currentY - targetScrollPos
                        );
                        const progressInRange =
                            fixedScrollRange > 0
                                ? Math.max(
                                      0,
                                      Math.min(
                                          100,
                                          ((currentY - fixedStartPos) /
                                              fixedScrollRange) *
                                              100
                                      )
                                  ).toFixed(2)
                                : 0;

                        console.log("滾動監控:", {
                            currentY,
                            targetScroll: targetScrollPos,
                            fixedStartPos,
                            scrollDiff:
                                scrollDiff > 0
                                    ? "向下"
                                    : scrollDiff < 0
                                      ? "向上"
                                      : "停止",
                            distanceToTarget:
                                distanceToTarget.toFixed(2) + "px",
                            progress: progressInRange + "%"
                        });

                        // 如果接近目標位置（誤差小於 5px），停止監控
                        if (distanceToTarget < 5) {
                            clearInterval(scrollMonitorInterval);
                            scrollMonitorInterval = null;
                            console.log("滾動完成，到達目標位置");
                        }

                        lastScrollY = currentY;
                    }, 50); // 每 50ms 檢查一次
                };

                if (!isMobile) {
                    // 直接從當前位置滾動到目標位置（不先回到起始位置）
                    startScrollMonitor(finalTargetScroll);
                    scrollToTarget(
                        targetIndex,
                        () => {
                            isNavigating = false;
                        },
                        finalTargetScroll
                    );
                }
            };

            if (prevBtn) {
                prevBtn.addEventListener(
                    "click",
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavClick("prev");
                    },
                    { once: false, passive: false }
                );
            }
            if (nextBtn) {
                nextBtn.addEventListener(
                    "click",
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavClick("next");
                    },
                    { once: false, passive: false }
                );
            }
        }

        initHotProjectSwiper();
    };
    const hotProjectSwiper = () => {
        const swiperMiddle = new Swiper(".swiper-middle.show-mobile", {
            loop: true,
            speed: 1200,
            allowTouchMove: true,
            slidesPerView: 1,
            initialSlide: 0,
            autoplay: {
                delay: 1500
            },
            navigation: { prevEl: ".prev", nextEl: ".next" },
            on: {
                init: function () {
                    updateFraction(this, this.realIndex + 1);
                },
                slideChange: function () {
                    updateFraction(this, this.realIndex + 1);
                }
            }
        });
    };
    // 品牌願景：滑動 pin 與深度堆疊
    const ourVisionScrollAni = () => {
        //-- 品牌願景(PC) --
        const ourVisionAni = () => {
            let is2K = window_width >= 2560;

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".our-vision",
                    start: "top top",
                    end: "+=180%",
                    scrub: 1,
                    pin: ".our-vision",
                    pinSpacing: true,
                    invalidateOnRefresh: true
                }
            });

            tl.to("#slide-4", { duration: 1, opacity: 1 }, "<0.2")
                .to(
                    "#slide-4",
                    {
                        duration: 2,
                        xPercent: -50,
                        yPercent: -50,
                        z: 550
                    },
                    "<0.25"
                )

                .to("#slide-5", { duration: 1, opacity: 1 }, "<0.3")
                .to(
                    "#slide-5",
                    {
                        duration: 2,
                        xPercent: -50,
                        yPercent: -50,
                        z: 700
                    },
                    "<0.15"
                )

                .to("#slide-6", { duration: 1, opacity: 1 }, "<0.15")
                .to(
                    "#slide-6",
                    {
                        duration: 1,
                        xPercent: -50,
                        yPercent: -50,
                        z: 700
                    },
                    "<0.05"
                )

                .to("#slide-1", { duration: 1, opacity: 1 }, "<0.2")
                .to(
                    "#slide-1",
                    {
                        duration: 2,
                        xPercent: is2K ? -85 : -50,
                        yPercent: -50,
                        z: is2K ? -600 : -735
                    },
                    "<0.1"
                )

                .to("#slide-3", { duration: 1, opacity: 1 }, "<0.3")
                .to(
                    "#slide-3",
                    {
                        duration: 2,
                        xPercent: 20,
                        yPercent: -150,
                        z: -450
                    },
                    "<0.2"
                )

                .to("#slide-2", { duration: 1, opacity: 1 }, "<0.1")
                .to(
                    "#slide-2",
                    {
                        duration: 2,
                        xPercent: -120,
                        yPercent: is2K ? 32 : -40,
                        z: is2K ? -1300 : -1333
                    },
                    "<0.2"
                )
                .to(".our-vision .slider", { duration: 2, y: -50 }, "<1");
        };

        //-- 品牌願景(mobile) --
        const ourVisionAni_mobile = () => {
            const enSplit1 = SplitText.create(
                ".our-vision .title-box .pad .en",
                {
                    type: "chars",
                    linesClass: "clip-text"
                }
            );

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".our-vision",
                    start: "top 70%",
                    end: "top 70%",
                    toggleActions: "play none none reverse"
                    // markers: true
                }
            });

            tl.from(".our-vision .title-box .pad .zh", {
                duration: 1,
                y: 20,
                scale: 1.2,
                opacity: 0,
                ease: "power1.inOut"
            })
                .fromTo(
                    enSplit1.chars,
                    { opacity: 0, rotationY: 180, yPercent: 100 },
                    {
                        duration: 1,
                        opacity: 1,
                        rotationY: 0,
                        yPercent: 0,
                        stagger: 0.1
                    },
                    "<0.3"
                )
                .from(
                    ".our-vision .our-img-box img",
                    {
                        duration: 1.5,
                        y: 10,
                        scale: 0.9,
                        filter: "blur(10px)",
                        opacity: 0,
                        ease: "power1.inOut"
                    },
                    "<0.5"
                );
        };

        if (!isMobile) {
            ourVisionAni();
        } else {
            ourVisionAni_mobile();
        }
    };
    //-- 熱銷建案 --
    const hotProjectAni = () => {
        if (isMobile) {
            const enSplit1 = SplitText.create(
                ".hot-project .title-box .pad .en",
                {
                    type: "chars",
                    linesClass: "clip-text"
                }
            );

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".hot-project",
                    start: "top 70%",
                    end: "top 70%",
                    toggleActions: "play none none reverse"
                    // markers: true
                }
            });

            tl.from(".hot-project .title-box .pad .zh", {
                duration: 1,
                y: 20,
                scale: 1.2,
                opacity: 0,
                ease: "power1.inOut"
            })
                .fromTo(
                    enSplit1.chars,
                    { opacity: 0, rotationY: 180, yPercent: 100 },
                    {
                        duration: 1,
                        opacity: 1,
                        rotationY: 0,
                        yPercent: 0,
                        stagger: 0.1
                    },
                    "<0.3"
                )
                .from(
                    ".hot-project .our-img-box img",
                    {
                        duration: 1.5,
                        y: 10,
                        scale: 0.9,
                        filter: "blur(10px)",
                        opacity: 0,
                        ease: "power1.inOut"
                    },
                    "<0.5"
                );
        } else {
            const enSplit1 = SplitText.create(
                ".index-body .hot-project .title-box .top .en",
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );

            const enSplit2 = SplitText.create(
                ".index-body .hot-project .title-box .bottom .en",
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );

            let tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: ".hot-project",
                    start: "-10% center",
                    end: "bottom bottom",
                    scrub: 4
                }
            });

            tl.fromTo(
                enSplit1.chars,
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
                }
            )
                .fromTo(
                    enSplit2.chars,
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
                    "<0.25"
                )
                .from(
                    ".index-body .hot-project .title-box .top .zh",
                    { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                    "<0.15"
                )
                .from(
                    ".index-body .hot-project .title-box .bottom .zh",
                    { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                    "<0.3"
                )
                .from(
                    ".index-body .hot-project .title-box .top .line",
                    { duration: 0.8, width: "0", opacity: 0 },
                    "<0.3"
                );
            tl.from(
                ".swiper-left,.swiper-middle,.swiper-right",
                { duration: 1, opacity: 0, yPercent: 30, stagger: 0.1 },
                "<0.3"
            );
        }
    };
    // 品牌願景：標題與內文進場
    const ourVisionTextAni = () => {
        const enSplit1 = SplitText.create(
            ".index-body .our-vision .title-box .top .en",
            {
                type: "chars,words,lines",
                linesClass: "clip-text"
            }
        );

        const enSplit2 = SplitText.create(
            ".index-body .our-vision .title-box .bottom .en",
            {
                type: "chars,words,lines",
                linesClass: "clip-text"
            }
        );

        const bigzhSplit1 = SplitText.create(
            ".index-body .our-vision .big-title",
            {
                type: "chars,words,lines",
                linesClass: "clip-text"
            }
        );
        const zhSplitContent = SplitText.create(
            ".index-body .our-vision .content",
            {
                type: "lines",
                linesClass: "clip-text"
            }
        );

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".our-vision",
                start: "top center",
                end: "bottom bottom",
                scrub: 4
            }
        });

        tl.fromTo(
            enSplit1.chars,
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
            }
        )
            .fromTo(
                enSplit2.chars,
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
                "<0.25"
            )
            .from(
                ".index-body .our-vision .title-box .top .zh",
                { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                "<0.15"
            )
            .from(
                ".index-body .our-vision .title-box .bottom .zh",
                { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                "<0.3"
            )
            .from(
                ".index-body .our-vision .title-box .top .line",
                { duration: 0.8, width: "0", opacity: 0 },
                "<0.3"
            )
            .from(
                bigzhSplit1.chars,
                { duration: 1.2, yPercent: 100, opacity: 0, stagger: 0.03 },
                "<0.1"
            )
            .from(
                ".index-body .our-vision .content-line",
                { duration: 1, opacity: 0 },
                "<0.35"
            )
            .from(
                zhSplitContent.lines,
                {
                    y: 70,
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    stagger: 0.15
                },
                "<0.3"
            )
            .from(
                ".index-body .our-vision .more-box ",
                { duration: 1, y: 70, autoAlpha: 0 },
                "<0.35"
            );
    };
    // 最新消息：標題與列表滾動動畫
    const newsAni = () => {
        // 動態換算滾動距離
        const calcEndPercent = () => {
            const vh = window.innerHeight;
            const percent = (400 / vh) * 100;
            return `+=${percent}%`;
        };

        // 共用：resize 時更新 timeline end
        const updateEndOnResize = (...timelines) => {
            window.addEventListener("resize", () => {
                const newEnd = calcEndPercent();
                timelines.forEach((tl) => {
                    if (tl.scrollTrigger) {
                        tl.scrollTrigger.end = newEnd;
                        tl.scrollTrigger.refresh();
                    }
                });
            });
        };

        // 最新消息：標題動態
        const newsLatestTitleAni = () => {
            if (isMobile) {
                const enSplit1 = SplitText.create(
                    ".news-latest .title-box .pad .en",
                    {
                        type: "chars",
                        linesClass: "clip-text"
                    }
                );

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".news-latest",
                        start: "top 70%",
                        end: "top 70%",
                        toggleActions: "play none none reverse"
                        // markers: true
                    }
                });

                tl.from(".news-latest .title-box .pad .zh", {
                    duration: 1,
                    y: 20,
                    scale: 1.2,
                    opacity: 0,
                    ease: "power1.inOut"
                })
                    .fromTo(
                        enSplit1.chars,
                        { opacity: 0, rotationY: 180, yPercent: 100 },
                        {
                            duration: 1,
                            opacity: 1,
                            rotationY: 0,
                            yPercent: 0,
                            stagger: 0.1
                        },
                        "<0.3"
                    )
                    .from(
                        ".news-latest .our-img-box img",
                        {
                            duration: 1.5,
                            y: 10,
                            scale: 0.9,
                            filter: "blur(10px)",
                            opacity: 0,
                            ease: "power1.inOut"
                        },
                        "<0.5"
                    );
            } else {
                const enSplit1 = SplitText.create(
                    ".index-body .news-latest .title-box .top .en",
                    {
                        type: "chars,words,lines",
                        linesClass: "clip-text"
                    }
                );

                const enSplit2 = SplitText.create(
                    ".index-body .news-latest .title-box .bottom .en",
                    {
                        type: "chars,words,lines",
                        linesClass: "clip-text"
                    }
                );

                let tl = gsap.timeline({
                    scrollTrigger: {
                        // markers: true,
                        trigger: ".news-latest",
                        start: "top 65%",
                        end: calcEndPercent(), // 動態換算
                        scrub: 5
                    }
                });

                tl.fromTo(
                    enSplit1.chars,
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
                    }
                )
                    .fromTo(
                        enSplit2.chars,
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
                        "<0.25"
                    )
                    .from(
                        ".index-body .news-latest .title-box .top .zh",
                        { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                        "<0.15"
                    )
                    .from(
                        ".index-body .news-latest .title-box .bottom .zh",
                        { duration: 0.8, opacity: 0, ease: "power1.inOut" },
                        "<0.3"
                    )
                    .from(
                        ".index-body .news-latest .title-box .top .line",
                        { duration: 0.8, width: "0", opacity: 0 },
                        "<0.3"
                    );

                return tl;
            }
        };
        // newsLatestTitleAni()

        // 最新消息：列表滑入
        const newsLatestAni = () => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: ".news-latest",
                    // start: "-10% center",
                    // end: '+=400px',
                    start: "top 80%",
                    end: calcEndPercent(), // 動態換算
                    scrub: 5
                }
            });
            tl.from(".index-body .news-latest .news-box .item", {
                duration: 1.5,
                xPercent: "-40",
                opacity: 0,
                stagger: 0.3
            });

            return tl;
        };

        // 初始化 & 綁定共用 resize
        const tlTitle = newsLatestTitleAni();
        const tlNews = newsLatestAni();
        updateEndOnResize(tlTitle, tlNews);
    };
    ucyCore.resourcesLoading(() => {
        if (!isMobile) {
            c1Ani();
            c1Scroll();
            marqueeScroll();
            hotProjectScroll();
            ourVisionScrollAni();
            // 所有 pin/scrollTrigger 建立後再統一 refresh，避免 start 錯位
            ScrollTrigger.refresh();

            hotProjectAni();
            ourVisionTextAni();
            newsAni();
        } else {
            hotProjectSwiper();
            hotProjectAni();
            ourVisionScrollAni();
            ourVisionTextAni();
            newsAni();
        }
    });

    const maskWrapper = document.querySelector(".c-bg-black-s");

    // 全域 spotlight 跟隨滑鼠
    document.body.addEventListener("mousemove", (e) => {
        const rect = maskWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;
        const percent = clampPercent((mouseX / width) * 100);

        maskWrapper.style.setProperty("--spotlight", `${percent}%`);
    });
};
