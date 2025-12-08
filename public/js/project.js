window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

    gsap.set(".swiper-controller .prev-next-box", { opacity: 0 });
    gsap.set(".swiper-controller .swiper-pagination", { opacity: 0 });

    ucyCore.resourcesLoading(() => {
        ucyCore.pageBanner.bannerAni(".project-body");
        document.fonts.ready.then(() => {
            ucyCore.pageTitle.titleAni(".project-body", () => {
                const tl = gsap.timeline({
                    defaults: {
                        duration: 1,
                        ease: "power1.out"
                    },
                    scrollTrigger: {
                        // markers: true,
                        trigger: ".project-body .page-title",
                        start: "top 30%",
                        end: "bottom",
                        toggleActions: "play none none reverse"
                    }
                });
                tl.fromTo(
                    ".swiper-controller .prev-next-box",
                    { opacity: 0, height: 0 },
                    { opacity: 1, height: "auto" }
                );
                tl.fromTo(
                    ".swiper-controller .swiper-pagination",
                    { opacity: 0 },
                    { opacity: 1 },
                    ">-0.5"
                );
            });
        });
    });

    let swiper = null;

    // 初始化或銷毀 Swiper 的函數
    function initSwiper() {
        const swiperEl = document.querySelector(".mySwiper");
        if (!swiperEl) return;

        let slidesView = window.innerWidth <= 1440 ? 2.5 : 2;

        swiper = new Swiper(".mySwiper", {
            direction: "vertical",
            slidesPerView: slidesView,
            mousewheel: false,
            centeredSlides: true,
            speed: 1000,
            // 移除 navigation 配置，使用自定義的滾動處理
            // navigation: { prevEl: ".prev", nextEl: ".next" },
            // initialSlide: 1, // 初始顯示第二個
            pagination: {
                el: ".swiper-pagination-progressbar",
                type: "progressbar"
            },
            on: {
                init: function () {
                    updateFraction(this);
                    // Swiper 初始化完成後，設置滾動切換功能
                    if (!ucyCore.isMobile()) {
                        initScrollTrigger();
                    }
                },
                slideChange: function () {
                    updateFraction(this);
                }
            }
        });
    }

    function destroySwiper() {
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
        const swiperEl = document.querySelector(".mySwiper");
        if (swiperEl) {
            swiperEl.classList.add("swiper-disabled");
        }
    }

    function handleResize() {
        const isMobileNow = window.innerWidth <= 1024;

        // 如果切換到手機版，銷毀 Swiper
        if (isMobileNow && swiper) {
            destroySwiper();
            return;
        }

        // 如果從手機版切換回桌面版，重新初始化 Swiper
        if (!isMobileNow && !swiper) {
            const swiperEl = document.querySelector(".mySwiper");
            if (swiperEl) {
                swiperEl.classList.remove("swiper-disabled");
            }
            // 使用 setTimeout 確保 DOM 更新完成後再初始化
            setTimeout(() => {
                initSwiper();
            }, 100);
            return;
        }

        // 更新 Swiper 設定
        if (swiper) {
            swiper.params.slidesPerView = window.innerWidth <= 1440 ? 2.5 : 2;
            swiper.update();
        }
    }

    if (!ucyCore.isMobile()) {
        // 桌面版：初始化 Swiper
        initSwiper();
    } else {
        // 手機版：添加類別以應用列表樣式
        const swiperEl = document.querySelector(".mySwiper");
        if (swiperEl) {
            swiperEl.classList.add("swiper-disabled");
        }
    }

    // 無論初始狀態如何，都註冊 resize 監聽器
    window.addEventListener("resize", handleResize);

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

    // 滾動切換 swiper 功能（僅桌面版）
    function initScrollTrigger() {
        if (!swiper) return;

        const galleryElement = document.querySelector(".project-body .gallery");
        if (!galleryElement) return;

        const totalSlides = swiper.slides.length;

        // 創建一個進度對象來追蹤滾動進度
        const progressObj = { progress: 0 };
        let lastIndex = swiper.realIndex;
        console.log(lastIndex);
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
        const swiperHeight = swiper.height || swiper.el.offsetHeight;
        const slidesPerView = swiper.params.slidesPerView || 2;
        slideHeight = swiperHeight / slidesPerView;
        console.log(slideHeight);

        // 每個 slide 對應 slide 高度 的滾動距離
        const scrollPerSlide = slideHeight;
        fixedScrollRange = (totalSlides - 1) * scrollPerSlide;

        // 使用 timeline 配合 scrub 來實現流暢的滾動切換
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: galleryElement,
                start: "top top",
                end: () => `+=${fixedScrollRange}`, // 使用計算出的滾動範圍
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                scrub: 0.1, // 減小 scrub 值，讓切換更緊跟滾動（值越小越緊跟）
                onUpdate: (self) => {
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
                    const progress = Math.max(0, Math.min(1, self.progress));
                    // console.log(progress);
                    // 使用更精確的計算，不四捨五入，讓切換更平滑
                    const targetIndexFloat = progress * (totalSlides - 1);
                    // console.log(targetIndexFloat);
                    const targetIndex = Math.round(targetIndexFloat);
                    // console.log(targetIndex);

                    // 只在索引改變時切換，使用較短的動畫時間讓切換更平滑
                    if (targetIndex !== lastIndex) {
                        lastIndex = targetIndex;
                        // 使用較短的動畫時間（300ms），讓切換更平滑但不會太慢
                        swiper.slideTo(targetIndex, 300);
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
        ScrollTrigger.refresh();
        if (typeof scrollTriggerInstance.start === "number") {
            fixedStartPos = scrollTriggerInstance.start;
        } else {
            // 如果 ScrollTrigger 還沒計算好，使用手動計算
            const triggerRect = galleryElement.getBoundingClientRect();
            fixedStartPos = triggerRect.top + window.scrollY;
        }

        // 動畫 progressObj 從 0 到 1，配合 scrub 使用
        scrollTl.to(progressObj, {
            progress: 1,
            duration: 1,
            ease: "none"
        });

        // 當 swiper 切換時更新 lastIndex，保持同步
        swiper.on("slideChange", function () {
            lastIndex = swiper.realIndex;
        });

        // 計算目標滾動位置的函數（使用固定的基準位置，避免疊加）
        const calculateTargetScroll = (targetIndex) => {
            if (!scrollTriggerInstance) {
                return null;
            }

            // 確保 targetIndex 在有效範圍內
            targetIndex = Math.max(0, Math.min(targetIndex, totalSlides - 1));

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
            swiper.slideTo(validTargetIndex, 300);
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
        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");

        let isNavigating = false; // 防止重複點擊
        const handleNavClick = (direction) => {
            // 如果正在滾動，禁止點擊
            if (isScrolling) return;
            if (!scrollTriggerInstance || isNavigating) return;

            isNavigating = true;

            // 使用 swiper 的當前 realIndex，確保獲取最新的索引
            const currentIndex = swiper.realIndex;
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

    // 如果 swiper 已經初始化，立即設置滾動功能
    if (!ucyCore.isMobile() && swiper) {
        initScrollTrigger();
    }
};
