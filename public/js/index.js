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
    // 熱銷建案：三層 swiper 與滾動切換
    const hotProjectScroll = () => {
        let swiperLeft = null;
        let swiperMiddle = null;
        let swiperRight = null;
        let total = 0;
        let middleIndex = 0;
        let leftIndex = 0;
        let rightIndex = 0;
        let lastMiddleIndex = 0;

        // 建立三個 swiper 並設定同步
        const initHotProjectSwiper = () => {
            let isSyncing = false;

            swiperLeft = new Swiper(".swiper-left", {
                loop: true,
                speed: 1200,
                allowTouchMove: false
            });
            swiperMiddle = new Swiper(".swiper-middle", {
                loop: true,
                speed: 1200,
                allowTouchMove: isMobile ? true : false,
                autoplay: isMobile
                    ? {
                          delay: 1500
                      }
                    : false,
                navigation: { prevEl: ".prev", nextEl: ".next" },
                // pagination: { el: '.swiper-pagination', type: 'fraction' },
                on: {
                    init: function () {
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
            swiperRight = new Swiper(".swiper-right", {
                loop: true,
                allowTouchMove: false,
                speed: 1200
            });

            // 初始設定偏移
            total = swiperMiddle.slides.length;

            middleIndex = 0;
            leftIndex = (middleIndex - 1 + total) % total;
            rightIndex = (middleIndex + 1) % total;
            lastMiddleIndex = middleIndex;

            // 更新頁碼顯示
            function updateFraction(swiper) {
                const fractionEl = document.querySelector(".swiper-pagination");

                // 取得目前索引和總數
                const current = swiper.realIndex + 1;
                const total = swiper.slides.length;

                // 個位數補0
                const currentStr = String(current).padStart(2, "0");
                const totalStr = String(total).padStart(2, "0");

                fractionEl.textContent = `${currentStr} / ${totalStr}`;
            }

            swiperLeft.slideToLoop(leftIndex, 0, false);
            swiperMiddle.slideToLoop(middleIndex, 0, false);
            swiperRight.slideToLoop(rightIndex, 0, false);

            // 依方向同步左右 swiper（保持滑動效果）
            function syncSwipers(direction) {
                if (isSyncing) return;
                isSyncing = true;

                if (direction === "next") {
                    swiperLeft.slideNext();
                    swiperRight.slideNext();
                } else if (direction === "prev") {
                    swiperLeft.slidePrev();
                    swiperRight.slidePrev();
                }
            }


            // 監聽中間 Swiper 滑動方向（觸控/導航）
            swiperMiddle.on("slideNextTransitionStart", () =>
                syncSwipers("next")
            );
            swiperMiddle.on("slidePrevTransitionStart", () =>
                syncSwipers("prev")
            );

            // 當中間 swiper 動畫結束後，解除同步鎖
            swiperMiddle.on("slideChangeTransitionEnd", () => {
                isSyncing = false;
            });
        };

        // 滾動切換 swiper 功能（僅桌面版）
        // 桌面版：使用 ScrollTrigger 控制 swiper 進度
        function initScrollTrigger(swiperInstance = swiperMiddle) {
            if (!swiperInstance) {
                return;
            }
            let isSyncingScroll = false;

            const hotProjectElement = document.querySelector(".hot-project");
            if (!hotProjectElement) return;

            const totalSlides = swiperInstance.slides.length;
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
            const slidesPerView = swiperInstance.params.slidesPerView || 1;
            slideHeight = swiperHeight / slidesPerView;

            // 每個 slide 對應 slide 高度 的滾動距離
            const scrollPerSlide = slideHeight;
            fixedScrollRange = (totalSlides - 1) * scrollPerSlide + 200;
            // console.log(fixedScrollRange);

            // 同步三個 swiper 至指定索引（中間直接 target，左右取前後一張）
            const slideAllTo = (targetIndex) => {
                if (isSyncingScroll) return;
                isSyncingScroll = true;
                const speed = swiperInstance.params.speed || 300;

                // 判斷方向與步數（loop 模式）
                const diff = (targetIndex - lastIndex + totalSlides) % totalSlides;
                const steps =
                    diff === 0
                        ? 0
                        : diff <= totalSlides / 2
                        ? diff
                        : totalSlides - diff;
                const direction =
                    diff === 0
                        ? null
                        : diff <= totalSlides / 2
                        ? "next"
                        : "prev";

                // 中間直接到 target
                swiperInstance.slideTo(targetIndex, speed);

                // 左右用 slideNext/slidePrev 以動畫方式跟進
                const slideLR = (dir) => {
                    if (dir === "next") {
                        swiperLeft.slideNext();
                        swiperRight.slideNext();
                    } else if (dir === "prev") {
                        swiperLeft.slidePrev();
                        swiperRight.slidePrev();
                    }
                };

                if (direction) {
                    for (let i = 0; i < steps; i++) {
                        slideLR(direction);
                    }
                }

                lastIndex = targetIndex;
                isSyncingScroll = false;
            };

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
                        console.log(self);
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

                        // 根據滾動進度計算應該顯示的 slide 索引
                        const progress = Math.max(
                            0,
                            Math.min(1, self.progress)
                        );
                        // 使用更精確的計算，不四捨五入，讓切換更平滑
                        const targetIndexFloat = progress * (totalSlides - 1);
                        const targetIndex = Math.round(targetIndexFloat);

                        // 只在索引改變時切換，使用較短的動畫時間讓切換更平滑
                        if (targetIndex !== lastIndex) {
                            slideAllTo(targetIndex);
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
            if (typeof scrollTriggerInstance.start === "number") {
                fixedStartPos = scrollTriggerInstance.start;
            } else {
                // 如果 ScrollTrigger 還沒計算好，使用手動計算
                const triggerRect = hotProjectElement.getBoundingClientRect();
                fixedStartPos = triggerRect.top + window.scrollY;
            }

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

                // 確保 targetIndex 在有效範圍內
                targetIndex = Math.max(
                    0,
                    Math.min(targetIndex, totalSlides - 1)
                );

                // 使用固定的基準位置，避免位置疊加
                if (fixedStartPos === null || fixedScrollRange === null) {
                    return null;
                }

                // 每次計算時都使用固定的基準位置，確保不會疊加
                const startPos = fixedStartPos;
                const scrollRange = fixedScrollRange;

                // 計算目標進度和位置
                const targetProgress =
                    totalSlides > 1 ? targetIndex / (totalSlides - 1) : 0;
                const targetScroll = startPos + targetProgress * scrollRange;

                // 確保返回的是有效數字
                if (isNaN(targetScroll) || targetScroll < 0) {
                    return null;
                }

                return Math.round(targetScroll);
            };

            // 使用 ScrollToPlugin 平滑滾動到目標位置
            let scrollAnimation = null;
            const scrollToTarget = (targetIndex) => {
                // 如果正在滾動，先停止當前的動畫
                if (scrollAnimation) {
                    scrollAnimation.kill();
                    scrollAnimation = null;
                }

                // 確保 targetIndex 在有效範圍內
                const validTargetIndex = Math.max(
                    0,
                    Math.min(targetIndex, totalSlides - 1)
                );

                const targetScroll = calculateTargetScroll(validTargetIndex);
                if (targetScroll === null) {
                    isNavigating = false;
                    return;
                }

                isUserClicking = true;

                // 先切換 swiper 到目標索引
                swiperInstance.slideTo(validTargetIndex, 300);
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
                        // 滾動完成後重置標記
                        setTimeout(() => {
                            isUserClicking = false;
                        }, 100);
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

                isNavigating = true;

                // 使用 swiper 的當前 realIndex，確保獲取最新的索引
                const currentIndex = swiperInstance.realIndex;
                const targetIndex =
                    direction === "next"
                        ? Math.min(currentIndex + 1, totalSlides - 1)
                        : Math.max(currentIndex - 1, 0);

                // 如果目標索引和當前索引相同，不執行滾動
                if (targetIndex === currentIndex) {
                    isNavigating = false;
                    return;
                }

                scrollToTarget(targetIndex);

                // 短暫延遲後重置標記，防止快速連續點擊
                setTimeout(() => {
                    isNavigating = false;
                }, 500);
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
