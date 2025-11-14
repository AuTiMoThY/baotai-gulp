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

    ucyCore.pageBanner.bannerAni(".portfolio-body");
    ucyCore.pageTitle.titleAni(".portfolio-body");

    document.fonts.ready.then(() => {
        const hdTl = gsap.timeline({
            delay: 0.7,
            scrollTrigger: {
                // markers: true,
                trigger: ".portfolio-hd",
                start: "-30% 75%",
                end: "+=50%"
                // scrub: 1
                // toggleActions: "play none play reverse"
            },
            onComplete: () => {
                console.log("onComplete");
            }
        });

        hdTl.addLabel("title");
        hdTl.from(".portfolio-hd .title", {
            opacity: 0,
            y: 80,
            duration: 1
        });
        hdTl.addLabel("line");
        hdTl.from(
            ".portfolio-hd .line",
            {
                scaleY: 0,
                opacity: 0,
                duration: 1
            },
            "<+=0.3"
        );

        hdTl.addLabel("txt");
        hdTl.from(
            ".portfolio-hd .txt",
            {
                opacity: 0,
                y: 80,
                duration: 1
            },
            "<+=0.3"
        );

        let lineHeight = 0;
        const line = document.querySelector(".portfolio-timeline-line");
        let isLineComplete = false;

        gsap.set(line, { height: lineHeight });

        const timelineItems = document.querySelectorAll(
            ".portfolio-timeline-item"
        );

        // 計算 lineHeight 的函數
        const calculateLineHeight = (targetIndex) => {
            let height = 0;
            for (let i = 0; i <= targetIndex; i++) {
                height += timelineItems[i].offsetHeight;
            }
            return height;
        };

        const getItemTotal = timelineItems.length;

        timelineItems.forEach((item, index) => {
            // const line = item.querySelector(".portfolio-timeline-line");
            // const imgItems = item.querySelectorAll(".img-item");

            const lineObj = {
                delay: 1,
                duration: 1.5,
                ease: "linear"
            };

            const tl = gsap.timeline({
                delay: ucyCore.isMobile() ? 1.5 : 0,
                scrollTrigger: {
                    // markers: true,
                    trigger: item,
                    start: "top 80%",
                    end: "top 60%",
                    onEnter: () => {
                        if (!isLineComplete) {
                            lineHeight = calculateLineHeight(index);
                            gsap.to(line, {
                                height: lineHeight,
                                ...lineObj
                            });
                            console.log(
                                "onEnter",
                                index,
                                "lineHeight:",
                                lineHeight
                            );

                            if (index === getItemTotal - 1) {
                                isLineComplete = true;
                            }
                        }
                    },
                    onLeave: () => {
                        // console.log(
                        //     "onLeave",
                        //     index,
                        //     "lineHeight:",
                        //     lineHeight
                        // );
                    },
                    onEnterBack: () => {
                        if (!isLineComplete) {
                            lineHeight = calculateLineHeight(index);
                            gsap.to(line, {
                                height: lineHeight,
                                ...lineObj
                            });
                            console.log(
                                "onEnterBack",
                                index,
                                "lineHeight:",
                                lineHeight
                            );
                        }
                    },
                    onLeaveBack: () => {
                        if (!isLineComplete) {
                            lineHeight = calculateLineHeight(index - 1);
                            gsap.to(line, {
                                height: lineHeight,
                                ...lineObj
                            });
                            console.log(
                                "onLeaveBack",
                                index,
                                "lineHeight:",
                                lineHeight
                            );
                        }
                    }
                }
            });
            tl.addLabel("year");
            tl.from(item.querySelector(".year"), {
                opacity: 0,
                // scale: 1.2,
                duration: 0.75,
                ease: "power1.inOut"
            });
            tl.addLabel("img");
            const itemObj = (x) => {
                return {
                    opacity: 0,
                    x: x,
                    duration: 2,
                    stagger: 0.5,
                    // ease: "linear"
                }
            }
            if (ucyCore.isMobile()) {
                const listR = item.querySelector(".img-list-r");
                tl.from(
                    gsap.utils.toArray(listR.querySelectorAll(".img-item")),
                    itemObj(45),
                    "year+=0.7"
                );
            } else {
                const listL = item.querySelector(".img-list-l.show-desktop");
                const listR = item.querySelector(".img-list-r");

                const imgItemsL = gsap.utils.toArray(listL.querySelectorAll(".img-item"));
                if (imgItemsL.length >= 1) {
                    tl.from(
                        imgItemsL,
                        itemObj(-45),
                        "year+=0.7"
                    );
                }
                
                const imgItemsR = gsap.utils.toArray(listR.querySelectorAll(".img-item:not(.show-mobile)"));
                if (imgItemsR.length >= 1) {
                    tl.from(
                        imgItemsR,
                        itemObj(45),
                        "year+=0.7"
                    );
                }
            }
        });
    });
};
