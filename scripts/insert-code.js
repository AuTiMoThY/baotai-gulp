import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得命令列參數
const args = process.argv.slice(2);

// 顯示使用說明
function showHelp() {
    console.log("\n📝 插入程式碼工具\n");
    console.log("使用方式:");
    console.log("  npm run insert <檔案路徑> <模式> [選項]\n");
    console.log("模式:");
    console.log("  --append         在檔案結尾插入");
    console.log("  --prepend        在檔案開頭插入");
    console.log("  --line <行數>    在指定行數之後插入");
    console.log("  --before <文字>  在包含指定文字的行之前插入");
    console.log("  --after <文字>   在包含指定文字的行之後插入\n");
    console.log("選項:");
    console.log('  --content "<內容>"  要插入的內容（使用引號包裹）');
    console.log("  --template <名稱>   使用預設模板\n");
    console.log("範例:");
    console.log(
        '  npm run insert src/pages/index.njk --append --content "<!-- 新內容 -->"'
    );
    console.log(
        '  npm run insert src/pages/index.njk --line 10 --content "<div>test</div>"'
    );
    console.log(
        '  npm run insert src/pages/index.njk --after "cut-2" --template swiper'
    );
    console.log("");
}

// 預設模板
const templates = {
    swiper: `<div class="swiper">
    <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>

    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>

    <!-- If we need scrollbar -->
    <div class="swiper-scrollbar"></div>
</div>`,

    section: `<section class="section-wrap">
    <div class="section-container">
        <div class="section-hd">
            <h2 class="title">標題</h2>
        </div>
        <div class="section-bd">
            <p>內容</p>
        </div>
    </div>
</section>`,

    svgtxt: `<span class="svgtxt" style="background-image: url('[[ IMG_PATH ]]text.svg')">TEXT</span>`,

    img: `<img src="[[ IMG_PATH ]]image.webp" alt="">`
};

// 解析參數
function parseArgs(args) {
    if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
        showHelp();
        process.exit(0);
    }

    const config = {
        filePath: args[0],
        mode: null,
        value: null,
        content: null
    };

    for (let i = 1; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case "--append":
                config.mode = "append";
                break;
            case "--prepend":
                config.mode = "prepend";
                break;
            case "--line":
                config.mode = "line";
                config.value = parseInt(args[++i]);
                break;
            case "--before":
                config.mode = "before";
                config.value = args[++i];
                break;
            case "--after":
                config.mode = "after";
                config.value = args[++i];
                break;
            case "--content":
                config.content = args[++i];
                break;
            case "--template":
                const templateName = args[++i];
                if (templates[templateName]) {
                    config.content = templates[templateName];
                } else {
                    console.error(`❌ 找不到模板: ${templateName}`);
                    console.log(
                        `可用的模板: ${Object.keys(templates).join(", ")}`
                    );
                    process.exit(1);
                }
                break;
        }
    }

    return config;
}

// 執行插入
function insertCode(config) {
    const projectRoot = path.join(__dirname, "..");
    const fullPath = path.isAbsolute(config.filePath)
        ? config.filePath
        : path.join(projectRoot, config.filePath);

    // 檢查檔案是否存在
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ 檔案不存在: ${config.filePath}`);
        process.exit(1);
    }

    // 檢查是否有內容
    if (!config.content) {
        console.error("❌ 錯誤：請提供要插入的內容");
        console.log('使用 --content "<內容>" 或 --template <名稱>');
        process.exit(1);
    }

    // 讀取檔案
    let fileContent = fs.readFileSync(fullPath, "utf8");
    let lines = fileContent.split("\n");
    let insertLine = -1;

    // 根據模式決定插入位置
    switch (config.mode) {
        case "append":
            lines.push(config.content);
            break;

        case "prepend":
            lines.unshift(config.content);
            break;

        case "line":
            if (config.value < 0 || config.value > lines.length) {
                console.error(
                    `❌ 行數超出範圍: ${config.value} (檔案共 ${lines.length} 行)`
                );
                process.exit(1);
            }
            lines.splice(config.value, 0, config.content);
            insertLine = config.value + 1;
            break;

        case "before":
            const beforeIndex = lines.findIndex((line) =>
                line.includes(config.value)
            );
            if (beforeIndex === -1) {
                console.error(`❌ 找不到包含 "${config.value}" 的行`);
                process.exit(1);
            }
            lines.splice(beforeIndex, 0, config.content);
            insertLine = beforeIndex + 1;
            break;

        case "after":
            const afterIndex = lines.findIndex((line) =>
                line.includes(config.value)
            );
            if (afterIndex === -1) {
                console.error(`❌ 找不到包含 "${config.value}" 的行`);
                process.exit(1);
            }
            lines.splice(afterIndex + 1, 0, config.content);
            insertLine = afterIndex + 2;
            break;

        default:
            console.error("❌ 錯誤：請指定插入模式");
            showHelp();
            process.exit(1);
    }

    // 寫入檔案
    const newContent = lines.join("\n");
    fs.writeFileSync(fullPath, newContent, "utf8");

    // 顯示成功訊息
    console.log("\n✅ 程式碼插入成功！");
    console.log(`📄 檔案: ${path.relative(projectRoot, fullPath)}`);
    if (insertLine > 0) {
        console.log(`📍 位置: 第 ${insertLine} 行`);
    }
    console.log("");
}

// 執行
try {
    const config = parseArgs(args);
    insertCode(config);
} catch (error) {
    console.error("❌ 發生錯誤:", error.message);
    process.exit(1);
}
