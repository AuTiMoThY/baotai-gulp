window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    gsap.set(".swiper-controller .prev-next-box", { opacity: 0 });
    gsap.set(".swiper-controller .swiper-pagination", { opacity: 0 });
    ucyCore.pageBanner.bannerAni(".preview-body");
    document.fonts.ready.then(() => {
        ucyCore.pageTitle.titleAni(".preview-body", () => {
            const tl = gsap.timeline({
                defaults: {
                    duration: 1,
                    ease: "power1.out"
                },
                scrollTrigger: {
                    // markers: true,
                    trigger: ".preview-body .page-title",
                    start: "top 30%",
                    end: "bottom",
                    toggleActions: "play none none reverse"
                }
            });
            tl.fromTo(".swiper-controller .prev-next-box", {opacity: 0, height: 0}, { opacity: 1, height: "auto" });
            tl.fromTo(".swiper-controller .swiper-pagination", {opacity: 0}, { opacity: 1 }, ">-0.5");
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
            mousewheel: true,
            centeredSlides: true,
            speed: 1000,
            navigation: { prevEl: ".prev", nextEl: ".next" },
            initialSlide: 1, // 初始顯示第二個
            pagination: {
                el: ".swiper-pagination-progressbar",
                type: "progressbar"
            },
            on: {
                init: function () {
                    updateFraction(this);
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

    // 檢查初始狀態並設定
    const isMobile = window.innerWidth <= 1024;

    if (!isMobile) {
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
        const currentStr = current < 10 ? `0${current}` : `${current}`;
        const totalStr = total < 10 ? `0${total}` : `${total}`;

        fractionEl.textContent = `${currentStr} / ${totalStr}`;
    }

    if (!ucyCore.isMobile()) {
        ScrollTrigger.create({
            // markers: true,
            trigger: ".preview-body .gallery",
            pin: true,
            start: "top top",
            end: "bottom+=50% 50%+=100px",
            // onToggle: (self) => console.log("toggled, isActive:", self.isActive),
            // onUpdate: (self) => {
            //     console.log(
            //         "progress:",
            //         self.progress.toFixed(3),
            //         "direction:",
            //         self.direction,
            //         "velocity",
            //         self.getVelocity()
            //     );
            // }
        });
    }
};
