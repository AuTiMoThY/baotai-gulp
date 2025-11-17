(function () {
    'use strict';

    const pageBanner = {
        bannerAniRepeat(bodyClass) {
            const tl = gsap.timeline({
                yoyo: true,
                repeat: -1
            });
            tl.fromTo(
                `${bodyClass} .banner-box .img-box img`,
                { scale: 1 },
                { duration: 15, ease: "power1.inOut", scale: 1.25 }
            );
        },

        bannerAni(bodyClass) {
            const tl = gsap.timeline({
                onComplete: () => this.bannerAniRepeat(bodyClass)
            });
            tl.from(`${bodyClass} .banner-box .img-box img`, {
                scale: 1.3,
                opacity: 0,
                duration: 7,
                // ease: "power1.inOut"
            });
        }
    };

    const pageTitle = {
        titleAni(bodyClass, callback) {
            const zhSplit = SplitText.create(
                `${bodyClass} .main-box .title-box .top .zh`,
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );

            const enSplit = SplitText.create(
                `${bodyClass} .main-box .title-box .bottom .en`,
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );
            let tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: `${bodyClass} .main-box .title-box`,
                    start: "top 75%",
                    once: true,
                }
            });        

            tl.from(zhSplit.chars, {
                duration: 1,
                opacity: 0,
                stagger: 0.1,
                y: 80
            })
                .fromTo(
                    enSplit.chars,
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
                    "<0.3"
                )

                .from(
                    `${bodyClass} .main-box .title-box .top .line`,
                    { duration: 1, width: "0", opacity: 0 },
                    "<0.45"
                )
                .call(function() {
                    // 提前 1 秒觸發的 callback
                    console.log("提前 1 秒觸發", this);
                    callback && callback();
                }, null, "-=1");
        }
    };

    const isMobile = () => {
        return window.matchMedia("(max-width: 1024px)").matches;
    };

    const headerScroll = {
        init() {
            window.addEventListener("scroll", function () {
                const header = document.querySelector(".header");

                if (window.scrollY > 50) {
                    header.classList.add("transparent");
                } else {
                    header.classList.remove("transparent");
                }
            });
        }
    };

    /**
     * 主入口檔案
     * 模組化版本 - 方便開發維護
     */


    window.ucyCore = {
        isMobile,
        pageBanner,
        pageTitle,
        headerScroll,
    };

})();
//# sourceMappingURL=main.js.map
