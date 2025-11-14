window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    window.addEventListener("scroll", function () {
        const header = document.querySelector(".header");

        if (window.scrollY > 50) {
            header.classList.add("transparent");
        } else {
            header.classList.remove("transparent");
        }
    });

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
            const getDigitHeight = scroll.querySelector(".digit").offsetHeight; // 取得數字的高度

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
        allowTouchMove: false,
        speed: 1000,
        effect: "creative",
        creativeEffect: {
            prev: {
                translate: [0, 0, 400],
                opacity: 0
            },
            next: {
                translate: [0, 0, -200],
                opacity: 0
            }
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                // console.log(this);

                const start = Number(this.pagination.el.dataset.start);
                return `<span class="${className}" data-year="${index + start}">${index + start}</span>`;
            }
        },
        on: {
            slideChange: function (swiper) {
                currentYear = Number(
                    swiper.slides[swiper.activeIndex].dataset.year
                );
                scrollToYear(currentYear);

                const activeSlide = swiper.slides[swiper.activeIndex];
                const prevSlide = swiper.slides[swiper.previousIndex];

                console.log(activeSlide, prevSlide);

                const tl = gsap.timeline({
                    duration: 1,
                    ease: "power2.out"
                });

                gsap.fromTo(
                    [activeSlide.querySelector(".history-slide-img"), activeSlide.querySelector(".history-slide-content")],
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1,
                        stagger: 0.5
                    }
                );

            }
            // slideChangeTransitionEnd: function (swiper) {
            //     console.log("slideChangeTransitionEnd", swiper);

            //     const activeSlide = swiper.slides[swiper.activeIndex];
            //     const prevSlide = swiper.slides[swiper.previousIndex];

            //     console.log(activeSlide, prevSlide);

            //     const tl = gsap.timeline({
            //         duration: 1,
            //         ease: "power2.out"
            //     });

            //     gsap.to(
            //         [prevSlide.querySelector(".history-slide-img"), prevSlide.querySelector(".history-slide-content")],
            //         {
            //             opacity: 0
            //         }
            //     );
            // },
        }
    });
};
