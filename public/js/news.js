// 共用計算 function
const calcEndPercent = () => {
    const vh = window.innerHeight;
    const percent = (400 / vh) * 100;
    return `+=${percent}%`;
};

window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText);

    window.addEventListener("scroll", function () {
        const header = document.querySelector(".header");

        if (window.scrollY > 50) {
            header.classList.add("transparent");
        } else {
            header.classList.remove("transparent");
        }
    });

    pageBanner.bannerAni(".news-body");
    pageTitle.titleAni(".news-body");

    const newsListAni = () => {
        const isMobile = window.matchMedia("(max-width: 1024px)").matches;
        const items = document.querySelectorAll(".news-box .item");
        const itemsArray = Array.from(items);

        if (isMobile) {
            itemsArray.forEach((item, index) => {
                // 排除第一個 item
                if (index === 0) {
                    gsap.from(item, {
                        duration: 2.5,
                        opacity: 0,
                    });
                    return;
                };
                
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
        }else {
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
    newsListAni();
};