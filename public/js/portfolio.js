window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const hdElArr = [
        ".portfolio-hd .title",
        ".portfolio-hd .line",
        ".portfolio-hd .txt"
    ];
    const timelineElArr = [
        ".portfolio-timeline-line",
        ".portfolio-timeline-item .year",
        ".portfolio-timeline-item .img-list-l .img-item",
        ".portfolio-timeline-item .img-list-r .img-item"
    ];

    const timelineItems = document.querySelectorAll(".portfolio-timeline-item");

    const runTimeline = (itemEl, index, callback) => {
        gsap.set(itemEl.querySelector(".portfolio-timeline-line"), {
            height: 0,
            opacity: 1
        });
        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power1.out"
            },
            scrollTrigger: {
                // markers: true,
                trigger: itemEl,
                start: "top 80%",
                end: "top 80%"
            }
        });
        tl.addLabel("year");
        tl.fromTo(
            itemEl.querySelector(".year"),
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 0.75
            }
        );
        tl.addLabel("line");
        tl.to(
            itemEl.querySelector(".portfolio-timeline-line"),
            {
                height: ucyCore.isMobile() ? "calc(100% - 13.4vw)" : "calc(100% - 5.4vw)",
                duration: 1,
                ease: "power1.out"
            },
            "<+=0.3"
        );
        tl.addLabel("img");
        if (ucyCore.isMobile()) {
            const listR = itemEl.querySelector(".img-list-r");
            const imgItemsR = listR.querySelectorAll(".img-item");
            tl.to(imgItemsR, { opacity: 1, stagger: 0.3, ease: "linear" }, "year+=0.3");

            tl.fromTo(
                imgItemsR,
                itemFromObj(45),
                itemToObj(),
                "year+=0.3"
            );
        } else {
            const listL = itemEl.querySelector(".img-list-l.show-desktop");
            const listR = itemEl.querySelector(".img-list-r");

            const imgItemsL = listL.querySelectorAll(".img-item");
            if (imgItemsL.length >= 1) {
                tl.to(imgItemsL, { opacity: 1, stagger: 0.3, ease: "linear" }, "year+=0.3");
                tl.fromTo(
                    imgItemsL,
                    itemFromObj(-45),
                    itemToObj(),
                    "year+=0.3"
                );
            }

            const imgItemsR = listR.querySelectorAll(
                ".img-item:not(.show-mobile)"
            );
            if (imgItemsR.length >= 1) {
                tl.to(imgItemsR, { opacity: 1, stagger: 0.3, ease: "linear" }, "year+=0.3");

                tl.fromTo(imgItemsR, itemFromObj(45), itemToObj(), "year+=0.3");
            }
        }
        tl.call(
            function () {
                // 提前 1 秒觸發的 callback
                console.log("runTimeline", index);
                callback && callback();
            },
            null,
            "-=1.5"
        );
    };

    const itemFromObj = (x) => {
        return {
            x: x,
        };
    };
    const itemToObj = () => {
        return {
            x: 0,
            duration: 2,
            stagger: 0.3,
            ease: "circ.out"
        };
    };

    // 依序執行動畫，一個完成後才執行下一個
    const runTimelineSequentially = (index) => {
        if (index >= timelineItems.length) {
            return;
        }
        runTimeline(timelineItems[index], index, () => {
            // 當前動畫完成後，執行下一個
            runTimelineSequentially(index + 1);
        });
    };

    gsap.set(hdElArr, { opacity: 0 });
    gsap.set(timelineElArr, { opacity: 0 });
    ucyCore.resourcesLoading(() => {
        ucyCore.pageBanner.bannerAni(".portfolio-body");

        document.fonts.ready.then(() => {
            ucyCore.pageTitle.titleAni(".portfolio-body", () => {
                const hdTl = gsap.timeline({
                    defaults: {
                        duration: 1,
                        ease: "power1.out"
                    },
                    scrollTrigger: {
                        // markers: true,
                        trigger: ".portfolio-hd",
                        start: "-30% 75%",
                        end: "+=50%",
                        toggleActions: "play none none reverse"
                    }
                });
    
                hdTl.fromTo(
                    hdElArr[0],
                    {
                        opacity: 0,
                        y: 80
                    },
                    {
                        opacity: 1,
                        y: 0
                    }
                );
                hdTl.fromTo(
                    hdElArr[1],
                    {
                        scaleY: 0,
                        opacity: 0
                    },
                    {
                        scaleY: 1,
                        opacity: 1
                    },
                    "<+=0.3"
                );
                hdTl.fromTo(
                    hdElArr[2],
                    {
                        opacity: 0,
                        y: 80
                    },
                    {
                        opacity: 1,
                        y: 0
                    },
                    "<+=0.3"
                );
                hdTl.call(function () {
                    runTimelineSequentially(0);
                }, null, "-=1");

            });
        });
    });

};
