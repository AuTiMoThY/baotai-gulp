/**
 * Version: html 4.3
 */

import browserSyncPackage from "browser-sync";
const sync = browserSyncPackage.create();

import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;
import gulpIf from "gulp-if";
import clean from "gulp-clean";
import newer from "gulp-newer";
import cache from "gulp-cache";
import imagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";

import gulpSass from "gulp-sass";
import * as dartSass from "sass";
const sass = gulpSass(dartSass);
import sassGlob from "gulp-sass-glob";
import sassVars from "gulp-sass-vars";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import plumber from "gulp-plumber";
import nunjucksRender from "gulp-nunjucks-render";
import prettier from "gulp-prettier";
import concat from "gulp-concat";
import terser from "gulp-terser";
import header from "gulp-header";

// 導入 Rollup 相關套件
import { rollup } from "rollup";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupCommonjs from "@rollup/plugin-commonjs";
import rollupTerser from "@rollup/plugin-terser";

import config from "./gulp.config.js";
const { version, prodOutput, output } = config;

const args = process.argv.slice(2);
const isProduction = args.includes("--prod");
const isDevelopment = args.includes("--dev");
console.log(args, isProduction, isDevelopment, version);

const outputPath = isProduction ? prodOutput : output;
const assetsPath = isProduction ? "./assets" : "./assets";

// 生成當前時間的版本號 YYYYMMDD-HHMMSS
function getCurrentVersion() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// 自定義 Nunjucks 環境
function manageEnvironment(environment) {
    environment.opts.tags = {
        variableStart: "[[",
        variableEnd: "]]"
    };

    environment.addFilter("random", function (max) {
        return Math.floor(Math.random() * (max + 1));
    });
}

function generateCSS() {
    return src(`${config.entryPath.sass}/**/*.scss`)
        .pipe(
            plumber(function (err) {
                console.log("SASS Compile Error:", err.message);
                this.emit("end");
            })
        )
        .pipe(sassVars(config.sassVar, { verbose: true }))
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass(config.sassOpt))
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest(`./public/assets/css`))
        .pipe(gulpIf(isDevelopment, sync.stream()))
        .on("end", () => {
            console.log("=================================");
            console.log(`generate CSS OK!`);
            console.log("=================================");
        });
}

// 編譯 assets/css/*.scss 成 app.css
function generateAssetsCSS() {
    return src(`./public/assets/css/*.scss`)
        .pipe(
            plumber(function (err) {
                console.log("Assets SASS Compile Error:", err.message);
                this.emit("end");
            })
        )
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(concat("app.css"))
        .pipe(sourcemaps.write("."))
        .pipe(dest(`./public/assets/css`))
        .pipe(gulpIf(isDevelopment, sync.stream()))
        .on("end", () => {
            console.log("=================================");
            console.log(`generate Assets CSS (app.css) OK!`);
            console.log("=================================");
        });
}

// 使用 Rollup 打包 JS 模組
async function bundleJS() {
    try {
        const bundle = await rollup({
            input: "src/js/main.js",
            plugins: [
                rollupResolve(),
                rollupCommonjs(),
                // ...(isProduction ? [rollupTerser()] : [])
            ]
        });

        await bundle.write({
            file: "public/assets/js/main.js",
            format: "iife",
            sourcemap: !isProduction
        });

        console.log("=================================");
        console.log(`Bundle JS OK!`);
        console.log("=================================");

        if (isDevelopment) {
            sync.reload();
        }
    } catch (error) {
        console.error("JS Bundle Error:", error);
    }
}

function nunjucksTask() {
    return (
        src(`${config.entry}/pages/**/*.+(html|nunjucks|njk)`)
            .pipe(
                plumber(function (err) {
                    console.log("nunjucks Error:", err.message);
                    this.emit("end");
                })
            )
            .pipe(
                nunjucksRender({
                    path: [`${config.entry}/pages_templates`],
                    manageEnv: manageEnvironment,
                    data: {
                        ...config.njkOpt,
                        IMG_PATH: isProduction ? `${config.serverUrl}assets/images/` : `${assetsPath}/images/`,
                        CSS_PATH: isProduction ? `${config.serverUrl}assets/css/` : `${assetsPath}/css/`,
                        JS_PATH: isProduction ? `${config.serverUrl}assets/js/` : `${assetsPath}/js/`,
                        VERSION: isProduction ? getCurrentVersion() : "",
                        PROD_PATH: isProduction ? config.serverUrl : "",
                    }
                })
            )

            .pipe(
                prettier({
                    printWidth: 120,
                    tabWidth: 4,
                    bracketSameLine: true,
                    proseWrap: "preserve"
                })
            )
            .pipe(dest(`${outputPath}`))
            .on("end", () => {
                console.log("=================================");
                console.log(`generate HTML OK!`);
                console.log("=================================");
                if (isDevelopment) {
                    sync.reload();
                }
            })
    );
}

function copyAssets() {
    return src(["public/assets/**/*"], { encoding: false })
        .pipe(newer(`${prodOutput}/assets`))
        .pipe(
            imagemin(
                [
                    imageminMozjpeg({ quality: 80, progressive: true }),
                    imageminPngquant({ optimizationLevel: 5 })
                ],
                {
                    verbose: true
                }
            )
        )
        .pipe(dest(`${prodOutput}/assets`))
        .on("error", function (err) {
            console.log("Error copying assets:", err.message);
        })
        .on("end", () => {
            console.log("=================================");
            console.log(`Copy assets OK!`);
            console.log("=================================");
        });
}

function copyJS() {
    return src(["public/js/**/*"], { encoding: false })
        .pipe(newer(`${prodOutput}/js`))
        .pipe(dest(`${prodOutput}/js`))
        .on("error", function (err) {
            console.log("Error copying JS:", err.message);
        })
        .on("end", () => {
            console.log("=================================");
            console.log(`Copy JS OK!`);
            console.log("=================================");
        });
}

function cleanProd() {
    return src([`${prodOutput}`, `!${prodOutput}/assets/images/**`], {
        read: false,
        allowEmpty: true
    })
        .pipe(clean())
        .on("end", () => {
            console.log("=================================");
            console.log(`Clean prod folder OK!`);
            console.log("=================================");
        });
}

function browserSync() {
    sync.init({
        ui: {
            port: config.port
        },
        server: {
            baseDir: ["./dist", "./public"]
        },
        port: config.port
    });

    console.log("=================================");
    console.log(config.project + " serving!!");
    console.log("=================================");

    global.isWatching = true;

    watch(config.entryPath.sass, generateCSS);
    watch([`${config.entry}/pages/**/*`, `${config.entry}/pages_templates/**/*`], nunjucksTask);
    
    // 監聽 assets/css 目錄的 SCSS 檔案
    watch([`./public/assets/css/**/*.scss`], generateAssetsCSS).on("error", function (err) {
        console.log("Error watching assets CSS files:", err);
    });
    
    // 監聽 src/js 目錄的所有 JS 檔案
    watch([`./src/js/**/*.js`], bundleJS).on("error", function (err) {
        console.log("Error watching JS files:", err);
    });

    watch([`./public/js/*.js`], bundleJS).on("error", function (err) {
        console.log("Error watching news.js files:", err);
    });

    watch([`./public/assets/images/**/*`], (cb) => {
        sync.reload();
        cb();
    }).on("error", function (err) {
        console.log("Error watching image files:", err);
    });
}

// 壓縮 main.js（用於 SRL）
function compressMainJS() {
    return src("./public/assets/js/main.js")
        .pipe(terser())
        .pipe(dest("./.temp"))
        .on("end", () => {
            console.log("=================================");
            console.log(`Compress main.js OK!`);
            console.log("=================================");
        });
}

// 合併 JS 檔案（用於 SRL）
function mergeJS() {
    const currentVersion = getCurrentVersion();
    return src(["./srl/source.js", "./.temp/main.js"])
        .pipe(concat("output.js"))
        .pipe(header(`/*! Version: ${currentVersion} */\n`))
        .pipe(dest("./srl"))
        .on("end", () => {
            console.log("=================================");
            console.log(`Merge JS to srl/output.js OK! (Version: ${currentVersion})`);
            console.log("=================================");
        });
}

// 清理暫存檔案
function cleanTemp() {
    return src(["./.temp"], {
        read: false,
        allowEmpty: true
    })
        .pipe(clean())
        .on("end", () => {
            console.log("=================================");
            console.log(`Clean temp folder OK!`);
            console.log("=================================");
        });
}

// 合併 CSS 檔案
function mergeSrlCSS() {
    const currentVersion = getCurrentVersion();
    return src(["./srl/source.css", "./dist_prod/assets/css/style.css"])
        .pipe(concat("output.css"))
        .pipe(header(`/*! Version: ${currentVersion} */\n`))
        .pipe(dest("./srl"))
        .on("end", () => {
            console.log("=================================");
            console.log(`Merge CSS to srl/output.css OK! (Version: ${currentVersion})`);
            console.log("=================================");
        });
}

const build = series(cleanProd, parallel(generateCSS, generateAssetsCSS, bundleJS, nunjucksTask), copyAssets, copyJS);
const mergeSrlJS = series(compressMainJS, mergeJS, cleanTemp);

// 將默認任務導出為 ES 模塊
export default isProduction ? build : series(parallel(generateCSS, generateAssetsCSS, bundleJS, nunjucksTask), browserSync);

// 導出 mergeSrlJS 和 mergeSrlCSS 任務
export { mergeSrlJS, mergeSrlCSS };
