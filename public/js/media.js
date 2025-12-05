window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    ucyCore.resourcesLoading(() => {
        ucyCore.pageBanner.bannerAni(".media-body");
    });
    gsap.set(".page-media", { opacity: 1 });

    const asideItemArr = document.querySelectorAll(".media-aside-item");
    asideItemArr.forEach((item, index) => {
        item.addEventListener("click", function () {
            asideItemArr.forEach((item) => {
                item.classList.remove("active");
            });
            item.classList.add("active");
        });
    });

    const mediaItems = document.querySelectorAll(".media-item");
    gsap.set([mediaItems, ".media-aside-list"], { opacity: 0 });

    document.fonts.ready.then(() => {

        ucyCore.pageTitle.titleAni(".media-body", () => {
            const tl = gsap.timeline({
                defaults: {
                    ease: "power1.out",
                    duration: 1
                }
            });

            tl.to(".media-aside-list", {
                opacity: 1
            });
            tl.add(() => {
                mediaItems.forEach((item, index) => {
                    gsap.to(item, {
                        delay: 0.3,
                        ease: "linear",
                        duration: 2,
                        opacity: 1,
                        scrollTrigger: {
                            // markers: true,
                            trigger: item,
                            start: "top 75%",
                            end: "50% 75%",
                            toggleActions: "play none none reverse"
                        }
                    });
                });
            }, "<0.3");
        });
    });
};
