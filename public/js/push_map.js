window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const bannerAni = () => {

        const tl = gsap.timeline({
            onComplete: bannerAniRepeat
        });
        tl.from('.push-map-body .banner-box .img-box img', {
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
        tl.fromTo('.push-map-body .banner-box .img-box img', { scale: 1, }, { duration: 15, ease: "power1.inOut", scale: 1.25 })
    }

    const titleAni = () => {

        const zhSplit = SplitText.create('.push-map-body .main-box .title-box .top .zh', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        const enSplit = SplitText.create('.push-map-body .main-box .title-box .bottom .en', {
            type: 'chars,words,lines',
            linesClass: 'clip-text',
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".push-map-body .main-box .title-box",
                start: "top center",
            }
        })

        tl
            .from(zhSplit.chars, { duration: 1, opacity: 0, stagger: 0.1, y: 80, })
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

            .from('.push-map-body .main-box .title-box .top .line', { duration: 1, width: '0', opacity: 0 }, '<0.45')

    }
    titleAni();


    // 
};
