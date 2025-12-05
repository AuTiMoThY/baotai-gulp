export const resourcesLoading = (callback) => {
    const loadingScreen = document.querySelector(".loading-screen");
    const loadingText = document.getElementById("loading-text");

    if (!loadingScreen) {
        gsap.delayedCall(0.5, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
        return;
    }

    const images = Array.from(document.images);
    const videos = Array.from(document.querySelectorAll("video"));
    const resources = [...images, ...videos]; // 統一資源陣列
    const totalResources = resources.length;
    console.log(resources);
    console.log(totalResources);
    let loadedResources = 0;
    let currentDisplayPercent = 0; // 追蹤當前顯示的百分比
    let progressTween = null; // 追蹤當前的動畫實例

    // 更新百分比函數
    function updateProgress() {
        let targetPercent =
            totalResources === 0
                ? 100
                : Math.floor((loadedResources / totalResources) * 100);
        // console.log(targetPercent);

        // 如果已經有動畫在運行，先停止它
        if (progressTween) {
            progressTween.kill();
        }

        // 創建動畫對象
        const progressObj = { value: currentDisplayPercent };

        // 使用 GSAP 動畫從當前值到目標值
        progressTween = gsap.to(progressObj, {
            value: targetPercent,
            duration: 0.5,
            ease: "power1.out",
            onUpdate: function () {
                const displayValue = Math.floor(progressObj.value);
                loadingText.textContent = displayValue;
                currentDisplayPercent = displayValue;
            },
            onComplete: function () {
                progressTween = null;
            }
        });

        if (targetPercent >= 100) {
            // 等待動畫完成後再執行隱藏動畫
            gsap.delayedCall(0.5, () => {
                gsap.timeline()
                    .to(loadingScreen, {
                        duration: 1,
                        opacity: 0,
                        ease: "power3.in"
                    })
                    .to(
                        loadingScreen,
                        { duration: 1, display: "none", ease: "power1.inOut" },
                        "<0.5"
                    );

                if (typeof callback === 'function') {
                    callback();
                }

            });
        }
    }

    // 統一監聽函數
    function listenResourceLoad(res) {
        // 已經加載完成或可播放
        if (
            (res.tagName === "IMG" && res.complete) ||
            (res.tagName === "VIDEO" && res.readyState >= 3)
        ) {
            loadedResources++;
            updateProgress();
        } else {
            res.addEventListener("load", () => {
                loadedResources++;
                updateProgress();
            });
            res.addEventListener("loadeddata", () => {
                loadedResources++;
                updateProgress();
            });
            res.addEventListener("error", () => {
                loadedResources++;
                updateProgress();
            });
        }
    }

    // 監聽所有資源
    resources.forEach((res) => listenResourceLoad(res));

    // 如果沒有資源，也直接跳到 100%
    if (totalResources === 0) updateProgress();
};
