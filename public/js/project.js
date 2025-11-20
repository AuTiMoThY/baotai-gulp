window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText)

    

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


    const bannerAni = () => {

        const tl = gsap.timeline({
            onComplete: bannerAniRepeat
        });
        tl.from('.project-body .banner-box .img-box img', {
            scale: 1.4,
            duration: 1.2,
            ease: 'power1.inOut',
        })
    }
    bannerAni();

    function bannerAniRepeat() {
        let tl = gsap.timeline({
            yoyo: true,
            repeat: -1
        });
        tl.fromTo('.project-body .banner-box .img-box img', { scale: 1, }, { duration: 15, ease: "power1.inOut", scale: 1.25 })
    }


    const titleAni = () => {
        const zhSplit = SplitText.create('.project-body .main-box .title-box .top .zh', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const enSplit = SplitText.create('.project-body .main-box .title-box .bottom .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".project-body .main-box .title-box",
                start: "top center",
            }
        })

        tl.from(zhSplit.chars, { duration: 1, opacity: 0, stagger: 0.1, y: 80, })
            .fromTo(enSplit.chars, {
                opacity: 0,
                rotationY: 180,
                yPercent: 100
            },
                {
                    duration: 1,
                    opacity: 1,
                    rotationY: 0,
                    yPercent: 0,
                    stagger: 0.03,
                }, '<0.3')

            .from('.project-body .main-box .title-box .top .line', { duration: 1, width: '0', opacity: 0 }, '<0.45')

            .from('.project-body .main-box .swiper', { duration: 1, opacity: 0, ease: 'power1.in' }, '<0.1')
    }
    titleAni()
};
