/**
 * 主入口檔案
 * 模組化版本 - 方便開發維護
 */

import { pageBanner } from "./modules/pageBanner";
import { pageTitle } from "./modules/pageTitle";
import { isMobile } from "./modules/common/isMobile";
import { headerScroll } from "./modules/common/headerScroll";
import { resourcesLoading } from "./modules/common/resourcesLoading";
import { viewport } from "./modules/viewport";

window.ucyCore = {
    isMobile,
    pageBanner,
    pageTitle,
    headerScroll,
    resourcesLoading,
    viewport,
};


// 防止瀏覽器記住滾動位置，重新整理時回到頂部
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
    // 確保頁面載入時回到頂部
    window.scrollTo(0, 0);
    ucyCore.headerScroll.init();

    const parallax = document.querySelectorAll(".ukiyo");
    new Ukiyo(parallax, {
        scale: 1.1,
        speed: 2,
        willChange: true,
        externalRAF: false
    });
});

$('.hamburger').click(function (e) { 
    e.preventDefault();
    $(this).toggleClass('is-active');
    $('.header-box .link-box').toggleClass('active');
});