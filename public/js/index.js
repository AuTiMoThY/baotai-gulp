window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText)

    // 檢測是否為 Safari 瀏覽器
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     (navigator.vendor && navigator.vendor.indexOf('Apple') > -1);
    
    // 根據 Safari 檢測結果顯示或隱藏 dummy-video
    const dummyVideo = document.querySelector('.dummy-video');
    if (dummyVideo) {
        dummyVideo.style.display = isSafari ? 'block' : 'none';
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            dummyVideo.classList.add('js-hidden');
        } else {
            dummyVideo.classList.remove('js-hidden');
        }
    });

    let isSyncing = false;

    const swiperLeft = new Swiper(".swiper-left", { loop: true, speed: 1200, allowTouchMove: false, });
    const swiperMiddle = new Swiper(".swiper-middle", {
        loop: true,
        speed: 1200,
        allowTouchMove: false,
        navigation: { prevEl: ".prev", nextEl: ".next" },
        // pagination: { el: '.swiper-pagination', type: 'fraction' },
        on: {
            init: function () {
                updateFraction(this);
            },
            slideChange: function () {
                updateFraction(this);
            },
        },
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
    const swiperRight = new Swiper(".swiper-right", { allowTouchMove: false, loop: true, speed: 1200 });

    // 初始設定偏移
    const total = swiperMiddle.slides.length;

    console.log(total);
    const middleIndex = 1;
    const leftIndex = (middleIndex - 1 + total) % total;
    const rightIndex = (middleIndex + 1) % total;

    console.log(leftIndex, middleIndex, rightIndex);

    swiperMiddle.slideToLoop(middleIndex, 0, false);
    swiperLeft.slideToLoop(leftIndex, 0, false);
    swiperRight.slideToLoop(rightIndex, 0, false);

    // 同步函數
    function syncSwipers(direction) {
        if (isSyncing) return;
        isSyncing = true;

        if (direction === 'next') {
            swiperLeft.slideNext();
            swiperRight.slideNext();
        } else if (direction === 'prev') {
            swiperLeft.slidePrev();
            swiperRight.slidePrev();
        }

        isSyncing = false;
    }

    // 監聽中間 Swiper 滑動方向
    swiperMiddle.on('slideNextTransitionStart', () => syncSwipers('next'));
    swiperMiddle.on('slidePrevTransitionStart', () => syncSwipers('prev'));

    const maskWrapper = document.querySelector('.c-bg-black-s');

    document.body.addEventListener('mousemove', (e) => {
        const rect = maskWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;

        // 限制百分比在 0~100% 之間，避免超出範圍
        let percent = (mouseX / width) * 100;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        maskWrapper.style.setProperty('--spotlight', `${percent}%`);
    });


    const loadingScreen = document.querySelector(".loading-screen");
    const loadingText = document.getElementById("loading-text");

    const images = Array.from(document.images);
    const videos = Array.from(document.querySelectorAll("video"));
    const resources = [...images, ...videos]; // 統一資源陣列
    const totalResources = resources.length;
    let loadedResources = 0;

    // 更新百分比函數
    function updateProgress() {
        let percent = totalResources === 0 ? 100 : Math.floor((loadedResources / totalResources) * 100);
        loadingText.textContent = percent;

        if (percent >= 100) {
            gsap.timeline()
                .to(loadingScreen, { duration: 1, height: 0, ease: "power3.in" })
                .to(loadingScreen, { duration: 1, display: 'none', ease: "power1.inOut" }, '<0.5')

            if($(window).width()>1024){
                c1Ani();
            }
            
        }
    }

    // 統一監聽函數
    function listenResourceLoad(res) {
        // 已經加載完成或可播放
        if ((res.tagName === "IMG" && res.complete) ||
            (res.tagName === "VIDEO" && res.readyState >= 3)) {
            loadedResources++;
            updateProgress();
        } else {
            res.addEventListener("load", () => { loadedResources++; updateProgress(); });
            res.addEventListener("loadeddata", () => { loadedResources++; updateProgress(); });
            res.addEventListener("error", () => { loadedResources++; updateProgress(); });
        }
    }

    // 監聽所有資源
    resources.forEach(res => listenResourceLoad(res));

    // 如果沒有資源，也直接跳到 100%
    if (totalResources === 0) updateProgress();


    function c1Ani() {

        const enSplit1 = SplitText.create('.index-body .scroll-box .card1 .main-box .title-box .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const bigzhSplit1 = SplitText.create('.index-body .scroll-box .card1 .main-box .title-box .zh', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const content = SplitText.create('.index-body .scroll-box .card1 .main-box .title-box .content', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({ delay: 0.85 })
        tl.fromTo(enSplit1.chars, {
            opacity: 0,
            rotationY: 180,
            yPercent: 100
        },
            {
                duration: 0.9,
                opacity: 1,
                rotationY: 0,
                yPercent: 0,
                stagger: 0.03,
            })
            .from(bigzhSplit1.chars, { duration: 1, yPercent: 100, opacity: 0, stagger: 0.04 }, '<0.3')
            .from(content.lines, { duration: 1, y: '80', opacity: 0 }, '<0.3')
            .from('.index-body .scroll-box .card1 .main-box .p-fv-img-wrapper .img-box', {
                duration: 1,
                ease: 'power2.in',
                opacity: 0
            }, '<0.2')
            .from('.index-body .c-bg-black-s', {
                duration: 1,
                ease: 'power2.in',
                opacity: 0
            }, '<0.35')


    }


    //-- 第一卡(電腦) --
    const c1ScrollAni = () => {
        // 計算 21vw 對應的 vh 值，解決 Safari 混合單位動畫問題
        const imgBox = document.querySelector('.index-body .card1 .main-box .p-fv-img-wrapper .img-box');
        const initialHeightVh = imgBox ? ((21 * window.innerWidth) / window.innerHeight).toFixed(4) + 'dvh' : '21vw';
        console.log(initialHeightVh);
        gsap.set('.index-body .card1 .main-box .p-fv-img-wrapper .img-box', {
            height: initialHeightVh,
        });
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.card1',
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: '.card1',
                pinSpacing: true,
                invalidateOnRefresh: true,
                // markers: true,
            }
        })

        tl.fromTo('.index-body .card1 .main-box .p-fv-img-wrapper .img-box', {
            width: '31vw',
            height: initialHeightVh,

            right: '7.2vw',
            top: '12vw',
        }, {
            duration: 1,
            width: '100vw',
            height: '100dvh',
            right: '0vw',
            top: '0vw',
        })
            .to('.card1 .title-box', { duration: 1, top: '-40vw' }, '<')
            .to('.c-maskText-wrapper .c-maskText-inner', { duration: 1, x: -150 }, '<')
            .fromTo('.index-body .card1 .main-box .p-fv-img-wrapper .img-box img', { width: '100%', }, { duration: 0.5, width: '100vw', })
    }
    //-- 第一卡(手機) --
    const c1ScrollAni_mobile = () => {

        const enSplit1 = SplitText.create('.hot-project .title-box .pad .en', {
            type: 'chars',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({delay:1})
        tl.from('.card1 .p-fv-img-wrapper .img-box', { duration: 1.5, scale: 1.5, ease: 'power2.inOut' })
          .from('.marquee-box', { duration: 1.5, y:-100, ease: 'power2.out'}, '<0.8')
          .from('.hot-project .title-box .pad .zh', { duration: 1, y: 20, scale: 1.2, opacity:0, ease: 'power1.out'}, '<0.5')
          .fromTo(enSplit1.chars, {opacity: 0, rotationY: 180, yPercent: 100}, { duration: 1, opacity: 1, rotationY: 0, yPercent: 0, stagger: 0.1}, '<0.3')
          .from('.hot-project .swiper-box', { duration: 1.5, y: 10, scale: 0.9, filter:"blur(10px)", opacity:0, ease: 'power1.out'}, '<0.5')
          .from('.hot-project .swiper-controller', { duration: 1, x: -30, opacity:0, ease: 'power1.out'}, '<0.3')
          
    }

    if($(window).width()>1024){
        c1ScrollAni();
    }
    else{
        // c1ScrollAni_mobile();
    }
    

    //-- 跑馬燈動態 --
    const marqueeAni = () => {
        let tl = gsap.timeline({
            scrollTrigger: {
                toggleActions: "play none none reverse",
                trigger: '.marquee-box',
                start: "top 70%",
                end: "top 70%",
            }
        })

        tl.to('.c-bg-black-s', { duration: 0.01, position: 'absolute', top: 0 })
    }

    if($(window).width()>1024){
        marqueeAni();
    }
    
    //-- 熱銷建案 --
    const hotProjectAni = () => {

        const enSplit1 = SplitText.create('.index-body .hot-project .title-box .top .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const enSplit2 = SplitText.create('.index-body .hot-project .title-box .bottom .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hot-project",
                start: "-10% center",
                end: 'bottom bottom',
                scrub: 4,

            }
        })

        tl.from('.swiper-left,.swiper-middle,.swiper-right', { duration: 1, opacity: 0, yPercent: 30, stagger: 0.1, }, '<0.3')

    }
    hotProjectAni()


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
                invalidateOnRefresh: true,
            }
        })

          tl.to('#slide-4', { duration: 1, opacity: 1, }, '<0.2')
            .to('#slide-4', {
                duration: 2,
                xPercent: -50,
                yPercent: -50,
                z: 550,
            }, '<0.25')

            .to('#slide-5', { duration: 1, opacity: 1, }, '<0.3')
            .to('#slide-5', {
                duration: 2,
                xPercent: -50,
                yPercent: -50,
                z: 700,
            }, '<0.15')

            .to('#slide-6', { duration: 1, opacity: 1, }, '<0.15')
            .to('#slide-6', {
                duration: 1, 
                xPercent: -50,
                yPercent: -50,
                z: 700,
            }, '<0.05')

            .to('#slide-1', { duration: 1, opacity: 1, }, '<0.2')
            .to('#slide-1', {
                duration: 2,
                xPercent: is2K ? -85 : -50,
                yPercent: -50,
                z: is2K ? -600 : -735,
            }, '<0.1')

            .to('#slide-3', { duration: 1, opacity: 1, }, '<0.3')
            .to('#slide-3', {
                duration: 2,
                xPercent: 20,
                yPercent: -150,
                z: -450,
            }, '<0.2')

            .to('#slide-2', { duration: 1, opacity: 1, }, '<0.1')
            .to('#slide-2', {
                duration: 2,
                xPercent: -120,
                yPercent: is2K ? 32 : -40,
                z: is2K ? -1300 : -1333,
            }, '<0.2')
            .to('.our-vision .slider', { duration: 2, y: -50 }, '<1')
    }

    //-- 品牌願景(mobile) --
    const ourVisionAni_mobile =()=>{

        const enSplit1 = SplitText.create('.our-vision .title-box .pad .en', {
            type: 'chars',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".our-vision",
                start: "top 70%",
                end: "top 70%",
                toggleActions: "play none none reverse",
                // markers: true
            }
        })

        tl.from('.our-vision .title-box .pad .zh', { duration: 1, y: 20, scale: 1.2, opacity:0, ease: 'power1.inOut'})
          .fromTo(enSplit1.chars, {opacity: 0, rotationY: 180, yPercent: 100}, { duration: 1, opacity: 1, rotationY: 0, yPercent: 0, stagger: 0.1}, '<0.3')
          .from('.our-vision .our-img-box img', { duration: 1.5, y: 10, scale: 0.9, filter:"blur(10px)", opacity:0, ease: 'power1.inOut'}, '<0.5')
    }

    if($(window).width()>1024){
        ourVisionAni();
    }
    else{
        ourVisionAni_mobile();
    }
    

    const ourVisionTextAni = () => {

        const enSplit1 = SplitText.create('.index-body .our-vision .title-box .top .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const enSplit2 = SplitText.create('.index-body .our-vision .title-box .bottom .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const bigzhSplit1 = SplitText.create('.index-body .our-vision .big-title', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })
        const zhSplitContent = SplitText.create('.index-body .our-vision .content', {
            type: 'lines',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".our-vision",
                start: "top center",
                end: 'bottom bottom',
                scrub: 4,

            }
        })

        tl.fromTo(enSplit1.chars, {
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
            })
            .fromTo(enSplit2.chars, {
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
                }, '<0.25')
            .from('.index-body .our-vision .title-box .top .zh', { duration: 0.8, opacity: 0, ease: 'power1.inOut' }, '<0.15')
            .from('.index-body .our-vision .title-box .bottom .zh', { duration: 0.8, opacity: 0, ease: 'power1.inOut' }, '<0.3')
            .from('.index-body .our-vision .title-box .top .line', { duration: 0.8, width: '0', opacity: 0 }, '<0.3')
            .from(bigzhSplit1.chars, { duration: 1.2, yPercent: 100, opacity: 0, stagger: 0.03 }, '<0.1')
            .from('.index-body .our-vision .content-line', { duration: 1, opacity: 0, }, '<0.35')
            .from(zhSplitContent.lines, {
                y: 70,
                autoAlpha: 0,
                duration: 1.2,
                ease: 'power2.out',
                stagger: 0.15,
            }, '<0.3')
            .from('.index-body .our-vision .more-box ', { duration: 1, y: 70, autoAlpha: 0, }, '<0.35')
    }
    ourVisionTextAni();

    // 共用計算 function
    const calcEndPercent = () => {
        const vh = window.innerHeight;
        const percent = (400 / vh) * 100;
        return `+=${percent}%`;
    };

    //共用 resize 更新 function
    const updateEndOnResize = (...timelines) => {
        window.addEventListener("resize", () => {
            const newEnd = calcEndPercent();
            timelines.forEach(tl => {
                if (tl.scrollTrigger) {
                    tl.scrollTrigger.end = newEnd;
                    tl.scrollTrigger.refresh();
                }
            });
        });
    };


    const newsLatestTitleAni = () => {
        const enSplit1 = SplitText.create('.index-body .news-latest .title-box .top .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const enSplit2 = SplitText.create('.index-body .news-latest .title-box .bottom .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".news-latest",
                start: "top 65%",
                end: calcEndPercent(), // 動態換算
                scrub: 5,

            }
        })

        tl.fromTo(enSplit1.chars, {
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
            })
            .fromTo(enSplit2.chars, {
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
                }, '<0.25')
            .from('.index-body .news-latest .title-box .top .zh', { duration: 0.8, opacity: 0, ease: 'power1.inOut' }, '<0.15')
            .from('.index-body .news-latest .title-box .bottom .zh', { duration: 0.8, opacity: 0, ease: 'power1.inOut' }, '<0.3')
            .from('.index-body .news-latest .title-box .top .line', { duration: 0.8, width: '0', opacity: 0 }, '<0.3')

        return tl;
    }
    // newsLatestTitleAni()

    const newsLatestAni = () => {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".news-latest",

                // start: "-10% center",
                // end: '+=400px',
                start: "top 80%",
                end: calcEndPercent(), // 動態換算
                scrub: 5,

            }
        })
        tl.from('.index-body .news-latest .news-box .item', { duration: 1.5, xPercent: '-40', opacity: 0, stagger: 0.3 })


        return tl;
    }

    // 初始化 & 綁定共用 resize
    const tlTitle = newsLatestTitleAni();
    const tlNews = newsLatestAni();
    updateEndOnResize(tlTitle, tlNews);
};
