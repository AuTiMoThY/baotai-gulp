window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    
    ucyCore.pageBanner.bannerAni(".history-body");

    const startYear = Number(
        document.querySelectorAll(".history-swiper .swiper-slide")[0].dataset
            .year
    );
    console.log(startYear);
    let currentYear = 2003;
    const initDigits = () => {
        for (let i = 0; i < 4; i++) {
            const container = document.getElementById(`digit-${i}`);
            const scroll = document.createElement("div");
            scroll.className = "digit-scroll";
            scroll.id = `scroll-${i}`;

            // 為每個位數創建0-9的數字
            for (let num = 0; num <= 9; num++) {
                const digit = document.createElement("div");
                digit.className = "digit";
                digit.textContent = num;
                scroll.appendChild(digit);
            }

            container.appendChild(scroll);
        }
    };
    const scrollToYear = (year) => {
        const yearStr = year.toString();

        // 對每個位數進行動畫
        for (let i = 0; i < 4; i++) {
            const targetDigit = parseInt(yearStr[i]);
            const scroll = document.getElementById(`scroll-${i}`);
            const getDigitHeight = scroll
                .querySelector(".digit")
                .getBoundingClientRect()
                .height.toFixed(2); // 取得數字的高度（通常為整數）

            // 計算目標位置
            const targetY = -targetDigit * getDigitHeight;

            // 使用GSAP動畫
            gsap.to(scroll, {
                y: targetY,
                duration: 1,
                ease: "power2.out",
                delay: i * 0.1 // 每個位數延遲0.1秒，產生波浪效果
            });
        }
    };

    initDigits();
    scrollToYear(currentYear);

    window.addEventListener("resize", () => {
        scrollToYear(currentYear);
    });

    const swiper = new Swiper(".history-swiper", {
        mousewheel: false,
        allowTouchMove: ucyCore.isMobile() ? true : false,
        speed: 1000,
        effect: "creative",
        creativeEffect: {
            prev: {
                translate: [ucyCore.isMobile() ? -100 : 0, 0, 0],
                opacity: 0
            },
            next: {
                translate: [ucyCore.isMobile() ? 100 : 0, 0, 0],
                opacity: 0
            }
        },
        navigation: {
            addIcons: false,
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                // console.log(this);
                return `<span class="${className}" data-year="${index + startYear}">${index + startYear}</span>`;
            }
        },
        on: {
            slideChange: function (swiper) {
                currentYear = Number(
                    swiper.slides[swiper.activeIndex].dataset.year
                );
                scrollToYear(currentYear);

                const activeSlide = swiper.slides[swiper.activeIndex];

                gsap.fromTo(
                    [
                        activeSlide.querySelector(".history-slide-img"),
                        activeSlide.querySelector(".history-slide-content")
                    ],
                    {
                        opacity: 0,
                        duration: 1
                    },
                    {
                        opacity: 1,
                    }
                );
            }
        }
    });

    gsap.set(".history-summary .line", { scaleY: 0 });
    gsap.set(".history-summary .txt", { opacity: 0, y: 80 });
    gsap.set(".history-summary .title", { opacity: 0, y: 80 });
    gsap.set(".history-photo picture", { opacity: 0 });

    document.fonts.ready.then(() => {
        ucyCore.pageTitle.titleAni(".history-body", () => {
            const photoTl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: ".history-photo",
                    start: "top 75%",
                    end: "bottom 75%",
                    toggleActions: "play none none reverse"
                }
            });
            photoTl.to(".history-photo picture", { opacity: 1, duration: 1.5 });

            gsap.fromTo(".history-photo img", {
                scale: 1.2,
                yPercent: -10,
            },{
                yPercent: 10, // 向下移動
                scrollTrigger: {
                    // markers: true,
                    trigger: ".history-photo",
                    start: "top 100%",
                    end: "bottom 0%",
                    scrub: 0.5
                }
            });

            const summaryTl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: ".history-summary",
                    start: "-30% 75%",
                    end: "bottom 75%",
                    toggleActions: "play none none reverse"
                }
            });
            summaryTl.to(".history-summary .title", {
                opacity: 1,
                y: 0,
                duration: 1
            });
            summaryTl.to(
                ".history-summary .line",
                { scaleY: 1, opacity: 1, duration: 1 },
                "<+=0.3"
            );
            summaryTl.to(
                ".history-summary .txt",
                { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
                "<+=0.3"
            );
        });
    });

    const tl = gsap.timeline({
        defaults: { duration: 1.5 },
        scrollTrigger: {
            // markers: true,
            trigger: ".history-swiper",
            start: "top 75%",
            end: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tl.from(".history-swiper-pagination", {
        opacity: 0,
        x: 100,
        duration: 1.5
    });
    tl.from(".history-slide-img", { opacity: 0 }, "<+0.3");
    tl.from(".history-swiper .year-box", { opacity: 0 }, "<+0.3");
    tl.from(".history-slide-content", { opacity: 0 }, "<+0.3");
};
