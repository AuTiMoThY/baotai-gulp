export const pageTitle = {
    titleAni(bodyClass) {


        document.fonts.ready.then(() => {
            const zhSplit = SplitText.create(
                `${bodyClass} .main-box .title-box .top .zh`,
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );
    
            const enSplit = SplitText.create(
                `${bodyClass} .main-box .title-box .bottom .en`,
                {
                    type: "chars,words,lines",
                    linesClass: "clip-text"
                }
            );
            let tl = gsap.timeline({
                scrollTrigger: {
                    // markers: true,
                    trigger: `${bodyClass} .main-box .title-box`,
                    start: "top 75%"
                }
            });

            tl.from(zhSplit.chars, {
                duration: 1,
                opacity: 0,
                stagger: 0.1,
                y: 80
            })
                .fromTo(
                    enSplit.chars,
                    {
                        opacity: 0,
                        rotationY: 180,
                        yPercent: 100
                    },
                    {
                        duration: 1,
                        opacity: 1,
                        rotationY: 0,
                        yPercent: 0,
                        stagger: 0.03
                    },
                    "<0.3"
                )

                .from(
                    `${bodyClass} .main-box .title-box .top .line`,
                    { duration: 1, width: "0", opacity: 0 },
                    "<0.45"
                );
        });
    }
};
