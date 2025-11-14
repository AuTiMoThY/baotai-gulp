/**
 * 主入口檔案
 * 模組化版本 - 方便開發維護
 */

import { pageBanner } from "./modules/pageBanner";
import { pageTitle } from "./modules/pageTitle";
import { isMobile } from "./modules/common/isMobile";

window.ucyCore = {
    isMobile,
    pageBanner,
    pageTitle,
}