window.onload = function () {
    // ============================================================================
    // GSAP 插件註冊
    // ============================================================================
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

    // ============================================================================
    // 資源載入完成後的初始化
    // ============================================================================
    ucyCore.resourcesLoading(() => {
        // Banner 動畫
        ucyCore.pageBanner.bannerAni(".history-body");

        // 設置初始動畫狀態
        gsap.set(".history-summary .line", { scaleY: 0 });
        gsap.set(".history-summary .txt", { opacity: 0, y: 80 });
        gsap.set(".history-summary .title", { opacity: 0, y: 80 });
        gsap.set(".history-photo picture", { opacity: 0 });

        // 等待字體載入完成後執行動畫
        document.fonts.ready.then(() => {
            ucyCore.pageTitle.titleAni(".history-body", () => {
                // ================================================================
                // 照片區塊動畫
                // ================================================================
                const photoTl = gsap.timeline({
                    scrollTrigger: {
                        // markers: true,
                        trigger: ".history-photo",
                        start: "top 75%",
                        end: "bottom 75%",
                        toggleActions: "play none none reverse"
                    }
                });
                photoTl.to(".history-photo picture", {
                    opacity: 1,
                    duration: 1.5
                });

                // 照片視差滾動效果
                gsap.fromTo(
                    ".history-photo img",
                    {
                        scale: 1.2,
                        yPercent: -10
                    },
                    {
                        yPercent: 10, // 向下移動
                        scrollTrigger: {
                            // markers: true,
                            trigger: ".history-photo",
                            start: "top 100%",
                            end: "bottom 0%",
                            scrub: 0.5
                        }
                    }
                );

                // ================================================================
                // 文字區塊動畫
                // ================================================================
                const summaryTl = gsap.timeline({
                    scrollTrigger: {
                        // markers: true,
                        trigger: ".history-summary",
                        start: "-30% 75%",
                        end: "bottom 75%",
                        toggleActions: "play none none reverse"
                    }
                });
                summaryTl.to(".history-summary .title", {
                    opacity: 1,
                    y: 0,
                    duration: 1
                });
                summaryTl.to(
                    ".history-summary .line",
                    { scaleY: 1, opacity: 1, duration: 1 },
                    "<+=0.3"
                );
                summaryTl.to(
                    ".history-summary .txt",
                    { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
                    "<+=0.3"
                );
            });
        });

        // ================================================================
        // Swiper 區塊進場動畫
        // ================================================================
        const tl = gsap.timeline({
            defaults: { duration: 1.5 },
            scrollTrigger: {
                // markers: true,
                trigger: ".history-swiper",
                start: "top 75%",
                end: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(".history-swiper-pagination", {
            opacity: 0,
            x: 100,
            duration: 1.5
        });
        tl.from(".history-slide-img", { opacity: 0 }, "<+0.3");
        tl.from(".history-swiper .year-box", { opacity: 0 }, "<+0.3");
        tl.from(".history-slide-content", { opacity: 0 }, "<+0.3");
    });

    // ============================================================================
    // 年份數字滾動功能
    // ============================================================================
    const startYear = Number(
        document.querySelectorAll(".history-swiper .swiper-slide")[0].dataset
            .year
    );
    let currentYear = 2003;

    /**
     * 初始化年份數字容器
     * 為每個位數（千、百、十、個）創建 0-9 的數字元素
     */
    const initDigits = () => {
        for (let i = 0; i < 4; i++) {
            const container = document.getElementById(`digit-${i}`);
            const scroll = document.createElement("div");
            scroll.className = "digit-scroll";
            scroll.id = `scroll-${i}`;

            // 為每個位數創建0-9的數字
            for (let num = 0; num <= 9; num++) {
                const digit = document.createElement("div");
                digit.className = "digit";
                digit.textContent = num;
                scroll.appendChild(digit);
            }

            container.appendChild(scroll);
        }
    };

    /**
     * 滾動到指定年份
     * @param {number} year - 目標年份
     */
    const scrollToYear = (year) => {
        const yearStr = year.toString();

        // 對每個位數進行動畫
        for (let i = 0; i < 4; i++) {
            const targetDigit = parseInt(yearStr[i]);
            const scroll = document.getElementById(`scroll-${i}`);
            const getDigitHeight = scroll
                .querySelector(".digit")
                .getBoundingClientRect()
                .height.toFixed(2); // 取得數字的高度（通常為整數）

            // 計算目標位置
            const targetY = -targetDigit * getDigitHeight;

            // 使用GSAP動畫
            gsap.to(scroll, {
                y: targetY,
                duration: 0.3,
                ease: "power1.out",
                delay: i * 0.1 // 每個位數延遲0.1秒，產生波浪效果
            });
        }
    };

    // 初始化並設置初始年份
    initDigits();
    scrollToYear(currentYear);

    // 視窗大小改變時重新計算年份位置
    window.addEventListener("resize", () => {
        scrollToYear(currentYear);
    });

    // ============================================================================
    // Swiper 配置與自動滾動功能
    // ============================================================================
    // 保存上一次的組索引（手機版用於判斷是否需要滾動）
    let lastGroupIndex = -1;

    /**
     * 獲取 simple-scrollbar 的滾動元素
     * @param {HTMLElement} paginationContainer - pagination 容器元素
     * @returns {HTMLElement|null} 滾動元素
     */
    const getScrollElement = (paginationContainer) => {
        // 獲取 simple-scrollbar 實例（通過 ss 屬性）
        const scrollbar = paginationContainer.ss;

        // 獲取實際的滾動元素（simple-scrollbar 會在容器內創建滾動元素）
        if (scrollbar && scrollbar.contentEl) {
            return scrollbar.contentEl;
        } else {
            // 如果無法獲取 scrollbar 實例，嘗試直接查找滾動元素
            // simple-scrollbar 會創建 .ss-content 作為滾動內容
            return (
                paginationContainer.querySelector(".ss-content") ||
                paginationContainer
            );
        }
    };

    /**
     * 電腦版：自動滾動 pagination 容器，讓 active 元素置頂
     * @param {HTMLElement} scrollElement - 滾動元素
     * @param {HTMLElement} activeBullet - active 的 bullet 元素
     * @param {HTMLElement} paginationContainer - pagination 容器
     */
    const scrollPaginationDesktop = (
        scrollElement,
        activeBullet,
        paginationContainer
    ) => {
        // 計算 bullet 相對於滾動元素的位置
        const scrollElementRect = scrollElement.getBoundingClientRect();
        const bulletRect = activeBullet.getBoundingClientRect();

        // 計算 bullet 相對於滾動元素的偏移（考慮當前滾動位置）
        const bulletOffsetTop =
            bulletRect.top - scrollElementRect.top + scrollElement.scrollTop;

        // 獲取當前滾動位置和容器高度
        const currentScrollTop = scrollElement.scrollTop || 0;
        const containerHeight = paginationContainer.clientHeight;
        const scrollHeight =
            scrollElement.scrollHeight || paginationContainer.scrollHeight;

        // 計算目標滾動位置（讓 bullet 置頂）
        const targetScrollTop = bulletOffsetTop;

        // 計算最大可滾動距離
        const maxScrollTop = Math.max(0, scrollHeight - containerHeight);

        // 如果目標位置超過最大滾動距離，則滾動到最大位置
        const finalScrollTop = Math.min(targetScrollTop, maxScrollTop);

        // 只有在需要滾動且目標位置有效時才執行
        if (
            Math.abs(finalScrollTop - currentScrollTop) > 1 &&
            finalScrollTop >= 0
        ) {
            // 使用 smooth scroll
            gsap.to(scrollElement, {
                scrollTop: finalScrollTop,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    };

    /**
     * 手機版：水平滾動 pagination 容器
     * 每5個為一組，只有切換到下一組時才滾動
     * @param {HTMLElement} scrollElement - 滾動元素
     * @param {HTMLElement} activeBullet - active 的 bullet 元素
     * @param {HTMLElement} paginationContainer - pagination 容器
     */
    const scrollPaginationMobile = (
        scrollElement,
        activeBullet,
        paginationContainer
    ) => {
        const swiperPagination = paginationContainer.querySelector(
            ".swiper-pagination"
        );
        if (!swiperPagination) return;

        // 獲取所有 bullet
        const allBullets = Array.from(
            swiperPagination.querySelectorAll(".swiper-pagination-bullet")
        );

        // 找到 active bullet 的索引
        const activeIndex = allBullets.indexOf(activeBullet);

        if (activeIndex === -1) return;

        // 計算 active 屬於哪一組（每5個一組）
        const currentGroupIndex = Math.floor(activeIndex / 5);

        // 只有當組索引改變時才滾動
        if (currentGroupIndex !== lastGroupIndex) {
            // 更新上一次的組索引
            lastGroupIndex = currentGroupIndex;

            // 計算該組第一個元素的索引
            const groupStartIndex = currentGroupIndex * 5;

            // 找到該組第一個 bullet
            const groupStartBullet = allBullets[groupStartIndex];

            if (!groupStartBullet) return;

            // 計算該組第一個 bullet 相對於滾動元素的位置
            const scrollElementRect = scrollElement.getBoundingClientRect();
            const groupStartBulletRect = groupStartBullet.getBoundingClientRect();

            // 計算該組第一個 bullet 相對於滾動元素的偏移（考慮當前滾動位置）
            const groupStartOffsetLeft =
                groupStartBulletRect.left -
                scrollElementRect.left +
                scrollElement.scrollLeft;

            // 獲取當前滾動位置和容器寬度
            const currentScrollLeft = scrollElement.scrollLeft || 0;
            const containerWidth = paginationContainer.clientWidth;
            const scrollWidth =
                scrollElement.scrollWidth || paginationContainer.scrollWidth;

            // 計算目標滾動位置：讓該組第一個元素在最左邊
            const targetScrollLeft = groupStartOffsetLeft;

            // 計算最大可滾動距離
            const maxScrollLeft = Math.max(0, scrollWidth - containerWidth);

            // 如果目標位置超過最大滾動距離，則滾動到最大位置
            const finalScrollLeft = Math.min(targetScrollLeft, maxScrollLeft);

            // 只有在需要滾動且目標位置有效時才執行
            if (
                Math.abs(finalScrollLeft - currentScrollLeft) > 1 &&
                finalScrollLeft >= 0
            ) {
                // 使用 smooth scroll
                gsap.to(scrollElement, {
                    scrollLeft: finalScrollLeft,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    };

    // ============================================================================
    // Swiper 初始化
    // ============================================================================
    const swiper = new Swiper(".history-swiper", {
        mousewheel: false,
        allowTouchMove: ucyCore.isMobile() ? true : false,
        speed: 500,
        effect: "creative",
        creativeEffect: {
            prev: {
                translate: [ucyCore.isMobile() ? -100 : 0, 0, 0],
                opacity: 0
            },
            next: {
                translate: [ucyCore.isMobile() ? 100 : 0, 0, 0],
                opacity: 0
            }
        },
        navigation: {
            addIcons: false,
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}" data-year="${index + startYear}">${index + startYear}</span>`;
            }
        },
        on: {
            slideChange: function (swiper) {
                // 更新當前年份
                currentYear = Number(
                    swiper.slides[swiper.activeIndex].dataset.year
                );
                scrollToYear(currentYear);

                // 當前 active 的 slide
                const activeSlide = swiper.slides[swiper.activeIndex];

                // 圖片和內容淡入動畫
                gsap.fromTo(
                    [
                        activeSlide.querySelector(".history-slide-img"),
                        activeSlide.querySelector(".history-slide-content")
                    ],
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        duration: 1.5,
                        ease: "power0.inOut"
                    }
                );

                // ================================================================
                // 自動滾動 pagination 容器
                // ================================================================
                const paginationContainer = document.querySelector(
                    ".history-swiper-pagination[ss-container]"
                );
                if (!paginationContainer) return;

                // 找到 active 的 bullet
                const activeBullet = paginationContainer.querySelector(
                    ".swiper-pagination-bullet-active"
                );
                if (!activeBullet) return;

                // 使用 setTimeout 確保 simple-scrollbar 已經初始化完成
                setTimeout(() => {
                    const scrollElement = getScrollElement(paginationContainer);

                    if (scrollElement) {
                        if (!ucyCore.isMobile()) {
                            // 電腦版：垂直滾動，讓 active 元素置頂
                            scrollPaginationDesktop(
                                scrollElement,
                                activeBullet,
                                paginationContainer
                            );
                        } else {
                            // 手機版：水平滾動，每5個為一組，只有切換到下一組時才滾動
                            scrollPaginationMobile(
                                scrollElement,
                                activeBullet,
                                paginationContainer
                            );
                        }
                    }
                }, 50);
            }
        }
    });

    // ============================================================================
    // 電腦版：使用 GSAP ScrollTrigger 實現滾動切換年份
    // ============================================================================
    if (!ucyCore.isMobile()) {
        const swiperElement = document.querySelector(".history-content");
        const totalSlides = swiper.slides.length;

        // 創建一個進度對象來追蹤滾動進度
        const progressObj = { progress: 0 };
        let lastIndex = swiper.activeIndex;
        let scrollTriggerInstance = null; // 保存 ScrollTrigger 實例
        let isUserClicking = false; // 標記是否為用戶點擊操作
        let fixedStartPos = null; // 保存固定的基準位置（不會改變）
        let fixedScrollRange = null; // 保存固定的滾動範圍

        // 在創建 ScrollTrigger 之前，先獲取 trigger 元素的原始位置
        const triggerRect = swiperElement.getBoundingClientRect();
        const viewportOffset = window.innerHeight * 0.2;
        // 計算固定的 start 位置（trigger 元素距離頂部 20% 的位置）
        fixedStartPos = triggerRect.top + window.scrollY - viewportOffset;
        fixedScrollRange = (totalSlides - 1) * (window.innerHeight / 2);

        // 使用 timeline 配合 scrub 來實現流暢的滾動切換
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: swiperElement,
                start: "top 20%",
                end: () =>
                    `+=${(totalSlides - 1) * (window.innerHeight / 2)}`, // 每個 slide 對應一個視窗高度
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                scrub: 0.1, // scrub 值越小越緊跟滾動，越大越平滑（0-1 之間）
                onUpdate: (self) => {
                    // 如果是用戶點擊操作，不響應滾動更新
                    if (isUserClicking) {
                        return;
                    }

                    // 根據滾動進度計算應該顯示的 slide 索引
                    const progress = Math.max(0, Math.min(1, self.progress));
                    const targetIndex = Math.min(
                        Math.max(0, Math.round(progress * (totalSlides - 1))),
                        totalSlides - 1
                    );

                    // 只在索引改變時切換
                    if (targetIndex !== lastIndex) {
                        lastIndex = targetIndex;
                        swiper.slideTo(targetIndex, 0); // 即時切換，無動畫延遲
                    }
                }
            }
        });

        // 保存 ScrollTrigger 實例
        scrollTriggerInstance = scrollTl.scrollTrigger;

        // 動畫 progressObj 從 0 到 1，配合 scrub 使用
        scrollTl.to(progressObj, {
            progress: 1,
            duration: 1,
            ease: "none"
        });

        // 當 swiper 切換時更新 lastIndex，保持同步
        swiper.on("slideChange", function () {
            lastIndex = swiper.activeIndex;
        });

        /**
         * 計算目標滾動位置的函數（使用固定的基準位置，避免疊加）
         * @param {number} targetIndex - 目標 slide 索引
         * @returns {number|null} 目標滾動位置
         */
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

            const startPos = fixedStartPos;
            const scrollRange = fixedScrollRange;
            const endPos = startPos + scrollRange;

            // 計算目標進度和位置
            const targetProgress = targetIndex / (totalSlides - 1);
            const targetScroll = startPos + targetProgress * scrollRange;

            // 確保返回的是有效數字
            if (isNaN(targetScroll) || targetScroll < 0) {
                return null;
            }

            return Math.round(targetScroll); // 四捨五入到整數
        };

        /**
         * 使用 ScrollToPlugin 平滑滾動到目標位置
         * @param {number} targetIndex - 目標 slide 索引
         */
        let scrollAnimation = null; // 保存當前的滾動動畫
        const scrollToTarget = (targetIndex) => {
            // 如果正在滾動，先停止當前的動畫
            if (scrollAnimation) {
                scrollAnimation.kill();
                scrollAnimation = null;
            }

            const targetScroll = calculateTargetScroll(targetIndex);
            if (targetScroll === null) {
                return;
            }

            isUserClicking = true;

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

        // ================================================================
        // 監聽 pagination 點擊，使用 ScrollToPlugin 自動滾動到對應位置
        // ================================================================
        const paginationEl = document.querySelector(".swiper-pagination");
        if (paginationEl && scrollTriggerInstance) {
            paginationEl.addEventListener("click", (e) => {
                const bullet = e.target.closest(".swiper-pagination-bullet");
                if (bullet) {
                    const clickedIndex = Array.from(
                        paginationEl.querySelectorAll(
                            ".swiper-pagination-bullet"
                        )
                    ).indexOf(bullet);
                    if (clickedIndex !== -1) {
                        scrollToTarget(clickedIndex);
                    }
                }
            });
        }

        // ================================================================
        // 監聽導航按鈕點擊
        // ================================================================
        const prevBtn = document.querySelector(".swiper-button-prev");
        const nextBtn = document.querySelector(".swiper-button-next");

        const handleNavClick = (direction) => {
            if (!scrollTriggerInstance) return;
            const currentIndex = swiper.activeIndex;
            const targetIndex =
                direction === "next"
                    ? Math.min(currentIndex + 1, totalSlides - 1)
                    : Math.max(currentIndex - 1, 0);
            scrollToTarget(targetIndex);
        };

        if (prevBtn) {
            prevBtn.addEventListener("click", () => handleNavClick("prev"));
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", () => handleNavClick("next"));
        }
    }
};
