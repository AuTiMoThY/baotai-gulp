import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得命令列參數
const cutName = process.argv[2];

if (!cutName) {
    console.error('❌ 錯誤：請提供 cut 名稱');
    console.log('使用方式: npm run create <cut-name>');
    console.log('範例: npm run create cut-4');
    process.exit(1);
}

// 定義檔案路徑
const projectRoot = path.join(__dirname, '..');
const njkPath = path.join(projectRoot, 'src', 'pages_templates', 'home', `${cutName}.njk`);
const scssPath = path.join(projectRoot, 'src', 'sass', 'frontend', 'entry', `_${cutName}.scss`);

// njk 模板內容
const njkTemplate = `<section class="${cutName} section-wrap">
    <div class="${cutName}-bg section-bg"
         style="background-image: url('[[ IMG_PATH ]]${cutName}-bg.jpg')"></div>
    <div class="section-container">
        <div class="${cutName}-hd section-hd">
            <h2 class="title section-hd-title">
                <span class="svgtxt"
                      style="background-image: url('[[ IMG_PATH ]]${cutName}-title.svg')">TITLE</span>
            </h2>
            <b class="subtitle section-hd-subtitle">副標題</b>
        </div>
        <div class="${cutName}-bd section-bd">
            <h3 class="section-bd-title">標題</h3>
            <div class="${cutName}-content section-content">
                <p class="txt">
                    內容文字
                </p>
            </div>
        </div>
    </div>
</section>

`;

// scss 模板內容
const scssTemplate = `@use "../../abstracts/functions/set-vw" as *;
@use "../../abstracts/mixin/wh" as *;
@use "../../abstracts/mixin/position" as *;
@use "../../abstracts/mixin/gradient" as *;
@use "../../abstracts/mixin/psudoClass" as *;

.${cutName} {
    position: relative;

}
`;

// 建立檔案的函數
function createFile(filePath, content, fileType) {
    if (fs.existsSync(filePath)) {
        console.log(`⚠️  檔案已存在: ${path.relative(projectRoot, filePath)}`);
        return false;
    }

    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已建立 ${fileType} 檔案: ${path.relative(projectRoot, filePath)}`);
        return true;
    } catch (error) {
        console.error(`❌ 建立 ${fileType} 檔案時發生錯誤:`, error.message);
        return false;
    }
}

// 建立檔案
console.log(`\n🚀 開始建立 ${cutName} 相關檔案...\n`);

const njkCreated = createFile(njkPath, njkTemplate, 'NJK');
const scssCreated = createFile(scssPath, scssTemplate, 'SCSS');

console.log('\n---');
if (njkCreated || scssCreated) {
    console.log('✨ 完成！');
    console.log('\n📝 下一步：');
    console.log(`   1. 編輯 src/pages_templates/home/${cutName}.njk`);
    console.log(`   2. 編輯 src/sass/frontend/entry/_${cutName}.scss`);
    console.log(`   3. 在 src/pages/index.njk 中引入 ${cutName}.njk`);
    console.log(`   4. 在 src/sass/style.scss 中引入 _${cutName}.scss`);
} else {
    console.log('⚠️  沒有建立新檔案');
}
console.log('');

