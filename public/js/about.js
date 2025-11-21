window.onload = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    ucyCore.pageBanner.bannerAni(".about-body");

    const cut1 = () => {
        const elArray = [
            ".about-founder .summary-block .title",
            ".about-founder .summary-block .line",
            ".about-founder .summary-block .txtimg",
            ".about-founder .founder-signature .title",
            ".about-founder .founder-signature .img",
            ".about-founder .founder-photo img"
        ];
        return {
            elArray,
            init() {
                gsap.set(elArray, { opacity: 0 });
            }
        };
    };
    const cut2 = () => {
        const elArray = [
            ".spirit-img",
            ".spirit-block-hd .title-txt-1",
            ".spirit-block-hd .title-txt-2",
            ".spirit-block-hd .line",
            ".spirit-block-bd .title",
            ".spirit-block-bd .txt",
            ".spirit-block-ft .swiper-button-prev",
            ".spirit-block-ft .swiper-button-next"
        ];
        return {
            elArray,
            init() {
                gsap.set(
                    [
                        gsap.utils.toArray(elArray[0])[0],
                        gsap.utils.toArray(elArray[1])[0],
                        gsap.utils.toArray(elArray[2])[0],
                        gsap.utils.toArray(elArray[3])[0],
                        gsap.utils.toArray(elArray[4])[0],
                        gsap.utils.toArray(elArray[5])[0],
                        gsap.utils.toArray(elArray[6])[0],
                        gsap.utils.toArray(elArray[7])[0]
                    ],
                    { opacity: 0 }
                );
            }
        };
    };

    const cut3 = () => {
        const elArray = [".structure-img"];
        return {
            elArray,
            init() {
                gsap.set([gsap.utils.toArray(elArray[0])[0]], { opacity: 0 });
            }
        };
    };

    cut1().init();
    cut2().init();
    cut3().init();

    document.fonts.ready.then(() => {
        ucyCore.pageTitle.titleAni(".about-founder", () => {
            const summaryTl = gsap.timeline({
                defaults: { duration: 1, ease: "power1.out" },
                scrollTrigger: {
                    // markers: true,
                    trigger: ".about-founder .summary-block",
                    start: "-30% 75%",
                    end: "bottom 75%",
                    toggleActions: "play none none reverse"
                }
            });

            summaryTl.fromTo(
                cut1().elArray[0],
                {
                    opacity: 0,
                    y: 80
                },
                {
                    opacity: 1,
                    y: 0
                }
            );
            summaryTl.fromTo(
                cut1().elArray[1],
                {
                    scaleY: 0,
                    opacity: 0
                },
                {
                    scaleY: 1,
                    opacity: 1
                },
                "<+0.3"
            );
            summaryTl.fromTo(
                cut1().elArray[2],
                {
                    opacity: 0
                    // y: 80
                },
                {
                    opacity: 1
                    // y: 0
                },
                "<+0.3"
            );
            summaryTl.call(
                function () {
                    const signatureTl = gsap.timeline({
                        defaults: { duration: 1, ease: "power1.out" },
                        scrollTrigger: {
                            // markers: true,
                            trigger: ".founder-signature",
                            start: "-50% 75%",
                            end: "bottom 75%",
                            toggleActions: "play none none reverse"
                        }
                    });
                    signatureTl.fromTo(
                        [cut1().elArray[3], cut1().elArray[4]],
                        {
                            opacity: 0,
                            y: 40
                        },
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.1
                        },
                        "<+0.3"
                    );
                },
                null,
                "-=1"
            );

            const photoTl = gsap.timeline({
                defaults: { duration: 1, ease: "linear" },
                scrollTrigger: {
                    // markers: true,
                    trigger: ".founder-photo",
                    start: "top 75%",
                    end: "bottom 75%",
                    toggleActions: "play none none reverse"
                }
            });
            photoTl.fromTo(
                cut1().elArray[5],
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            );


            gsap.to(".founder-photo img", {
                y: "20%", // 向下移動
                // scale: 1.1,
                ease: "none",
                scrollTrigger: {
                    // markers: true,
                    trigger: ".founder-photo",
                    start: "top-=50% 75%",
                    end: "bottom+=50% 75%",
                    scrub: true
                }
            });
        });
        ucyCore.pageTitle.titleAni(".about-spirit", () => {});
        ucyCore.pageTitle.titleAni(".about-corp-structure", () => {
            const tl = gsap.timeline({
                defaults: { duration: 1, ease: "linear" },
                scrollTrigger: {
                    // markers: true,
                    trigger: ".structure-img",
                    start: "-30% 75%",
                    end: "bottom 75%",
                    toggleActions: "play none none reverse"
                }
            });
            tl.fromTo(
                cut3().elArray[0],
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            );
        });
    });

    let swiper = null;
    const initSwiper = () => {
        swiper = new Swiper(".spirit-swiper", {
            effect: "creative",
            creativeEffect: {
                prev: {
                    opacity: 0
                },
                next: {
                    opacity: 0
                }
            },
            loop: true,
            speed: 1500,
            autoHeight: ucyCore.isMobile() ? true : false,
            spaceBetween: 30,
            pagination: {
                el: ".spirit-swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    return `<span class="${className}">
                    <span class="circle"></span>
                    <span class="circle"></span>
                    <svg class="svg-inactive" viewBox="0 0 117 117" xmlns="http://www.w3.org/2000/svg">
                        <g opacity=".2">
                            <image width="117" height="117" xlink:href="data:image/png;base64,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"/>
                        </g>
                        <g opacity=".5">
                            <image width="101" height="101" transform="translate(8 8)" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAACXBIWXMAAAsSAAALEgHS3X78AAAE1klEQVR4nO2bD08bRxDFH8YGF0wSEpx/baQ0+f4fqVKl0pKEkGAwYLC5qxa9jV5XZ0OCjcfN+0mrM3eGO+bdzM7O7sIYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcbchbVVslJd1/l5v/e565tfWlur5/9Ui2ElhKEgubXY9Fzjr0mr2G7OrYJAoYUpBFkH0AbQ4bEtIjWRxZiwjXm8XgWBwgojoqxTjE0AXQBbAH7hz21eL/+PmgIkIS4BXAA4BzDiz+MsUFRxQgojoiTDb1CMRwAeA3jCz1sUZ73Bayoa/pKCnAA4BjDg53TuisKFFCecMIUoyUN6AHYB9AG84PEpgB1enyVM8pBTAF8AHAL4yONXAENeDylOO8AzfKNBlGT8PQCvAPzG9kqEuYvHZGEORMy2vJQ34tR1HSprCyPMFFGSd/wK4C3bGwAvGc62GOZaRXaWs7GK4eqcYSyFwW0RU6NFOHEieUzu6JOxe/SUJMo7AO8pzGsAz3hdDdzU+dfiNTsUsstEolV8r5LvW5iMeEuHBtxlyHpLUX5nGOtLCGuLgZuEAQ2+wdYpPKWSzG2S0+v0LBG8JorHZG/ZZMbVpxA5hKXPz3ntNlEytYxzdFAKXhvTmzSFnogXLZWlC9PQt6S+4AXFeMPw1aco2nHfllHm6y16i4qSM7YzJgen/JwEuo7gNVE8piVhLHXsfYayl+xTNHzdRRQlf7fNv7FD7zjnuOaI7ZjnxgxrS2VaOeMhyfWvNkf0yTOesj2Rjv5HRMmoV27K2GiPwueMrVOEvKURQRgURktesyOZlPYp9zGYvgB54FpWEjamlHgenEjCtEScLo8bUwaQ87rPNl+AHr31mzAyxbAUogmzXjT1knkZSsdLXYrTK2pv9piCtYb09kf7lVn30PS8S2/pFh5qj5nBooyjHtqRFkIUrIAwPy3RhVnUIK+WksxY2rXUzZZKNGF0fr7Cf+ft53kPLXCOOMM5YjU6hDhRhNE3WJsaaF6GyqJcSVlmyFH/ZZQKczRhJkVhUd/gRdwn18qG9JqrKGsBIgkzkTn6XFjMb/FkDuFFRRlRjAFrZLoOwB5D1GAXNNIXtmMa8PKeJfm6EH/Ief/PLGAO6D3jKJ1/lOpyJRXfJMYh5+gfc0SuxcX8zHcda5SinFKMD7zHJ4oUprKMCMKkWJ6QEJPe3o+sYW3LSpgsxPcUNcs+5YSi/wPgLwD7vNcg2oqZKB6j6Ws2Xi5klpNc5dTyrDn/qvCUQ4rxJ9s+z51EysgQRRjxmhzOvsoqS104kQeEPZnNLBdk6DhFO/ojekoS5A8eD4owFmZ9WaRVMjq+GBbGzn3QiEbclQm0cmqgkr+jHf0Hhq/sLX+z8x9GysYyYYSh10De8oyGuTP2B3sy69iVcj2KEX3+/md6xz7bAc+dRl2NGWol5hRxNDHIGdUzzjxqgtDh98fFQotj/s4nL5G9Bw3ilB34Eb3lEcNZnn1UYS5o+CE79gHF8KLy+3LLNoxt2Y6xNcVjzmX7xZm3YcyRGRuXOrLCUhMAFB3/FdvYG5cWwJStfk3rAzCjSu2tfoui2BxbiqXjmHIux5tjH5IZu5hXTghjjDHGGGOMMcYYY4wxxhhjfnqMMcYYY4wxxhhjjDHGGPP/AcC/o4IcPuyF3fMAAAAASUVORK5CYII="/>
                        </g>
                        <circle cx="58.29" cy="58.79" r="4.4" fill="#b58b54"/>
                    </svg>
                    <svg class="svg-active" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="M72.88,50.22c0,12.17-9.86,22.03-22.03,22.03s-22.03-9.86-22.03-22.03,9.86-22.03,22.03-22.03,22.03,9.86,22.03,22.03Z" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="1.1"/>
                        <g opacity=".5">
                        <image width="101" height="101" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAABlCAYAAABUfC3PAAAACXBIWXMAAAsSAAALEgHS3X78AAAFFklEQVR4nO2bC08bRxSFD+ZhIIAhDaRpUrVp//9PqlQ1aSAvwBiwgzFbDT23Ohnttii2u7PifNLIxjZae7+9M3fnzsAYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMaY7rHTNVVVV8Z0f+t2r+w+vrFTL+1aLpTNSKCNaj01f++rj0u7Y7l/rgpzipVBGSFgFsCZtlS3/HSHiNmuzEFSynGKlSGSEiHUAfQCbALb4vM/3evJbKp78JOELgDHbhH+HqGIjp0gpIiSd8A1K2AGwK22Hr69TXI//fkcpScA1gBGACwBDAJd8Lb035eeKE1OclExIioonAA4AfAfgGR8PKGeb0VInZUIJ5wA+A/jExzNKSnJuImpKErNWwHf4hxohu5TwAsAPbEcAnvK9LUZSU6RcUcpHAO8BHAM44d9njKLEbVVVxWRoxUhpEHII4CWAn9heUso+I6hpTLlj9zRmVBwyyvbZ7fVFYiXjkKVkxKC+wRP3jBJeA/iVUl4wSnYobk0ys0BPcuqeBpSxL9EVvzsytPtsLV0YJURLEVIkStKgvc0xIwn4mUJ+AfCKonYbIkQjBTzRfUrYkowtfnNkZzroT0uIllIiJaIknbQ9djevKOU1nx9RiEYIGpKVqua+JrI0UMiYicAVn6eomlV/h0urYlqXUjOWpO7mOUX8yMH9kLJCSN1dvKLRk9/1RxIwYhJwznFnLF1Zq1J6D/jM/0Ev67qO2H19z+xLu6z/EpITMwKaQDzlMZ6zSxyocJlfa+1ktM2KSEkZ1UDuSQ4kW/oWIYGK2RIxhzzWniQArZ+TUqRE1pUiZY+Z0qAmy5rnCs7F7DVkZfMeZ25alZLNb+XTKU33IfOQH+sJj7edRWOrlBQpfZ6cHZ6sTblbX+SJiqxMJzgXLX/uL9gm2qX05erdXmC3pWhW1pOp/1WZqnn0UlAjps8IWdaVW1csK0JGUEpKXHflLvtEFVtLKkVKJbO7M60QLvFGrtjKYwlSdFY3KoWTmPZYgpi6+n3rd/FK21IqmamN+scl2zgTs6jjoSEyZ6XIKSFSQkpUCodSup1oPX2Bx4tp/S9Z7d5SOBtbSaRE+faMj1d8fRHRkkdl1O9HUre/ffRSSCUzt0nKGWvpp4yYMcebea7iJvmnbJ4lriEG+nTFRk39Q3bCvlVMLmRE6Ses2X/kMa/lGK3Sej0ldWEJKTwNufLkvUzbb0qBaj1bHflv5F3WBSW8A/AGwFseZ6jj16MvcpG8C/vMq3jAaZd1fm5Ws9arqRxcZUnEiEKSiN/Z3vK1iwWOXXNThBRGS5zAa44rJ5wDCyFT1lj2snp7LkfT3WnWZb2jjN/4eMxjRddVxPqvklazVFk380G+35SZ2IjFqUE2k6zFqZB7I3X4kPyHRMmf7CYvl3A/NBfFSJGxJQb8U74V0TPk1R6L8fZl6WpfxpyZzAyMJHE4Znf1hs8/8f1ixpKgqBWS2dgCXvU32UrHQ1m6OpBEQLu5GEOGlBvZnK6OvCxRCApfS6yFqCh+xcK6g6xknI891zI7cCbtvPR1xOjAqvsVWbcVRbAQtJNVKXWR3SSbR9P1XUWvuEfpm4ZETq9mn4qWcjeyMSWf1woRU515LnXjUCe219Vsravb0ZWvutddXF/VZ0rfYtepjajZJtS6vY9o2uuIDm1G7dzu4OABu4Q7tyvYGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDGmawD4C9Y2FUjuEBXeAAAAAElFTkSuQmCC"/>
                        </g>
                    </g>
                    <circle cx="50.85" cy="50.22" r="4.4" fill="#b58b54"/>
                    </svg>
                    </span>`;
                }
            },
            navigation: {
                prevEl: ".spirit-swiper-nav.swiper-button-prev",
                nextEl: ".spirit-swiper-nav.swiper-button-next"
            },
            on: {
                init: function () {
                    const bulletArr = gsap.utils.toArray(".spirit-img .swiper-pagination-bullet");
                    gsap.set(bulletArr, { opacity: 0 });

                    const spiritTl = gsap.timeline({
                        defaults: { duration: 1, ease: "linear" },
                        scrollTrigger: {
                            // markers: true,
                            trigger: ".about-spirit",
                            start: "top 75%",
                            end: "bottom 75%",
                            toggleActions: "play none none reverse"
                        }
                    });

                    spiritTl.fromTo(
                        cut2().elArray[0],
                        {
                            opacity: 0
                        },
                        {
                            delay: 0.5,
                            opacity: 1
                        }
                    );
                    spiritTl.fromTo(
                        bulletArr,
                        {
                            opacity: 0,
                            scale: 0
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            stagger: 0.15
                        },
                        "<+0.3"
                    );
                    spiritTl.fromTo(
                        [
                            gsap.utils.toArray(cut2().elArray[1])[0],
                            gsap.utils.toArray(cut2().elArray[2])[0],
                            gsap.utils.toArray(cut2().elArray[4])[0],
                            gsap.utils.toArray(cut2().elArray[5])[0]
                        ],
                        {
                            opacity: 0
                        },
                        {
                            opacity: 1,
                            duration: 1.5,
                            stagger: 0.3
                        },
                        "<+0.3"
                    );
                    spiritTl.fromTo(
                        cut2().elArray[3],
                        {
                            transformOrigin: "left center",
                            opacity: 0,
                            scaleX: 0
                        },
                        {
                            opacity: 1,
                            scaleX: 1
                        },
                        "<+0.3"
                    );
                    spiritTl.fromTo(
                        [cut2().elArray[6], cut2().elArray[7]],
                        {
                            opacity: 0
                        },
                        {
                            opacity: 1,
                            duration: 1.5,
                            stagger: 0.3
                        },
                        "<+0.3"
                    );
                }
            }
        });
    };

    const destroySwiper = () => {
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
    };

    const handleResize = () => {
        if (ucyCore.isMobile()) {
            destroySwiper();
            initSwiper();
        } else {
            destroySwiper();
            initSwiper();
        }
    };

    initSwiper();

    // window.addEventListener("resize", handleResize);
};
