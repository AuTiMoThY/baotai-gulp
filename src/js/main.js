/**
 * 主入口檔案
 * 模組化版本 - 方便開發維護
 */

import { pageBanner } from "./modules/pageBanner";
import { pageTitle } from "./modules/pageTitle";
import { isMobile } from "./modules/common/isMobile";
import { headerScroll } from "./modules/common/headerScroll";
import { resourcesLoading } from "./modules/common/resourcesLoading";

window.ucyCore = {
    isMobile,
    pageBanner,
    pageTitle,
    headerScroll,
    resourcesLoading,
};

window.addEventListener("load", function () {
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