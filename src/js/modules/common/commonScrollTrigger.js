/**
 * ScrollTrigger 相關設定
 */

export const commonScrollTrigger = (trigger, isMarkers = false) => {
    return gsap.timeline({
        ease: "back.inOut(1.7)",
        scrollTrigger: {
            markers: isMarkers,
            trigger: trigger,
            start: "top 75%",
            end: "75% 75%",
            scrub: 1,
        }
    });
};
