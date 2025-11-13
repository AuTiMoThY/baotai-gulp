window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText)

    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');

        if (window.scrollY > 50) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
    });
    let slidesView = window.innerWidth <= 1440 ? 2.5 : 2;

    const swiper = new Swiper(".mySwiper", {
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
        swiper.params.slidesPerView = window.innerWidth <= 1440 ? 2.5 : 2;
        swiper.update(); // 更新 swiper 設定
    });


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
