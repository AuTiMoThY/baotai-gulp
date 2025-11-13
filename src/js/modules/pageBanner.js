export const pageBanner = {
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
