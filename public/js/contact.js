window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    ucyCore.resourcesLoading(() => {
        ucyCore.pageBanner.bannerAni(".contact-body");
        ucyCore.pageTitle.titleAni(".contact-body");
        document.fonts.ready.then(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: ".contact-info-text",
                    start: "-30% 75%",
                    end: "+=50%",
                    // scrub: 1
                    toggleActions: "play none play reverse"
                }
            });
    
            tl.addLabel("title");
            tl.from(".contact-info-text .title", {
                y: 50,
                scale: window.matchMedia("(max-width: 900px)").matches ? 1.4 : 1.1,
                opacity: 0,
                duration: 1
            });
            tl.addLabel("line");
            tl.from(
                ".contact-info-text .line",
                {
                    yPercent: 100,
                    scaleY: 0,
                    opacity: 0,
                    duration: 1
                },
                "<+=0.3"
            );
    
            const splitTxtsCreate = (el, tl) => {
                return SplitText.create(el, {
                    type: "lines, words",
                    // mask: "lines",
                    autoSplit: true,
                    onSplit(self) {
                        return tl.addLabel("txt").from(
                            self.lines,
                            {
                                scale: 1.25,
                                duration: 1,
                                y: 50,
                                autoAlpha: 0,
                                stagger: 0.25
                            },
                            "title+=0.5"
                        );
                    }
                });
            };
    
            splitTxtsCreate(".contact-info-text .txt.show-desktop", tl);
            splitTxtsCreate(".contact-info-text .txt.show-mobile", tl);
    
        });
    });
};
