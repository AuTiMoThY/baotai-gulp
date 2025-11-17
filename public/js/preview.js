window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    ucyCore.headerScroll.init();
    ucyCore.pageBanner.bannerAni(".preview-body");
    document.fonts.ready.then(() => {
        ucyCore.pageTitle.titleAni(".preview-body");
    });

    // 檢查是否為手機版（寬度小於等於 500px）
    const isMobile = window.innerWidth <= 1024;
    let swiper = null;

    // 只在非手機版時初始化 Swiper
    if (!isMobile) {
        let slidesView = window.innerWidth <= 1440 ? 2.5 : 2;

        swiper = new Swiper(".mySwiper", {
            direction: "vertical",
            slidesPerView: slidesView,
            mousewheel: true,
            centeredSlides: true,
            speed: 1000,
            navigation: { prevEl: ".prev", nextEl: ".next" },
            initialSlide: 1, // 初始顯示第二個
            pagination: {
                el: ".swiper-pagination-progressbar",
                type: "progressbar",
            },
            

            on: {
                init: function () {
                    updateFraction(this);
                },
                slideChange: function () {
                    updateFraction(this);
                },
            },
        });

        window.addEventListener("resize", () => {
            const isMobileNow = window.innerWidth <= 1024;
            
            // 如果切換到手機版，銷毀 Swiper
            if (isMobileNow && swiper) {
                swiper.destroy(true, true);
                swiper = null;
                // 移除 Swiper 相關類別，恢復列表樣式
                const swiperEl = document.querySelector(".mySwiper");
                if (swiperEl) {
                    swiperEl.classList.add("swiper-disabled");
                }
                return;
            }
            
            // 如果從手機版切換回桌面版，重新初始化 Swiper
            if (!isMobileNow && !swiper) {
                const swiperEl = document.querySelector(".mySwiper");
                if (swiperEl) {
                    swiperEl.classList.remove("swiper-disabled");
                }
                let slidesView = window.innerWidth <= 1440 ? 2.5 : 2;
                swiper = new Swiper(".mySwiper", {
                    direction: "vertical",
                    slidesPerView: slidesView,
                    mousewheel: true,
                    centeredSlides: true,
                    speed: 1000,
                    navigation: { prevEl: ".prev", nextEl: ".next" },
                    initialSlide: 1,
                    pagination: {
                        el: ".swiper-pagination-progressbar",
                        type: "progressbar",
                    },
                    on: {
                        init: function () {
                            updateFraction(this);
                        },
                        slideChange: function () {
                            updateFraction(this);
                        },
                    },
                });
                return;
            }
            
            // 更新 Swiper 設定
            if (swiper) {
                swiper.params.slidesPerView = window.innerWidth <= 1440 ? 2.5 : 2;
                swiper.update();
            }
        });
    } else {
        // 手機版：添加類別以應用列表樣式
        const swiperEl = document.querySelector(".mySwiper");
        if (swiperEl) {
            swiperEl.classList.add("swiper-disabled");
        }
    }

    function updateFraction(swiper) {
        const fractionEl = document.querySelector(".swiper-pagination");

        // 取得目前索引和總數
        const current = swiper.realIndex + 1;
        const total = swiper.slides.length;

        // 個位數補0
        const currentStr = current < 10 ? `0${current}` : `${current}`;
        const totalStr = total < 10 ? `0${total}` : `${total}`;

        fractionEl.textContent = `${currentStr} / ${totalStr}`;
    }

};
