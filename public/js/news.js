window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const newsListAni = () => {
        const items = document.querySelectorAll(".news-box .item");
        const itemsArray = Array.from(items);

        if (ucyCore.isMobile()) {
            itemsArray.forEach((item, index) => {
                // 排除第一個 item
                if (index === 0) {
                    gsap.from(item, {
                        duration: 2.5,
                        opacity: 0
                    });
                    return;
                }

                gsap.from(item, {
                    duration: 1.7,
                    opacity: 0,
                    stagger: 0.15,
                    scrollTrigger: {
                        // markers: true,
                        trigger: item,
                        start: "top 80%",
                        end: "80% 80%",
                        scrub: 3
                    }
                });
            });
        } else {
            // 每3個為一組
            for (let i = 0; i < itemsArray.length; i += 3) {
                const group = itemsArray.slice(i, i + 3);

                // 使用組內第一個元素作為觸發點
                gsap.from(group, {
                    duration: 1,
                    opacity: 0,
                    stagger: 0.15,
                    scrollTrigger: {
                        // markers: true,
                        trigger: group[0], // 使用該組第一個item作為觸發點
                        start: "top 80%",
                        end: "80% 80%",
                        scrub: 3
                    }
                });
            }
        }
    };

    ucyCore.resourcesLoading(() => {
        ucyCore.pageBanner.bannerAni(".news-body");
        ucyCore.pageTitle.titleAni(".news-body");
        newsListAni();
    });
};
