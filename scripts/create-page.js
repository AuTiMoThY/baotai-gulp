import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得命令列參數
const pageName = process.argv[2];

if (!pageName) {
    console.error('❌ 錯誤：請提供 cut 名稱');
    console.log('使用方式: npm run create <cut-name>');
    console.log('範例: npm run create cut-4');
    process.exit(1);
}

// 定義檔案路徑
const projectRoot = path.join(__dirname, '..');
const njkPath = path.join(projectRoot, 'src', 'pages', `${pageName}.njk`);
const scssPath = path.join(projectRoot, 'src', 'sass', 'baotai', `_${pageName}.scss`);

// njk 模板內容
const njkTemplate = `{% set page_title = "" %}
{% set body_class = "${pageName}-body " %}
{% extends "layout.njk" %}
{% block content %}
<main class="main-box page-${pageName}">

</main>
{% endblock %}
{% block page_script %}

<script src="js/${pageName}.js{% if VERSION != '' %}?v=[[VERSION]]{% endif %}"></script>
{% endblock %}

`;

// scss 模板內容
const scssTemplate = `@use "../../../public/assets/css/utils/variables" as *;
@use "../../../public/assets/css/utils/mixin" as *;
@use "../abstracts/functions/set-vw" as *;

.page-${pageName} {}
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
console.log(`\n🚀 開始建立 ${pageName} 相關檔案...\n`);

const njkCreated = createFile(njkPath, njkTemplate, 'NJK');
const scssCreated = createFile(scssPath, scssTemplate, 'SCSS');

console.log('\n---');
if (njkCreated || scssCreated) {
    console.log('✨ 完成！');
    console.log('\n📝 下一步：');
    console.log(`   1. 編輯 src/pages/${pageName}.njk`);
    console.log(`   2. 編輯 src/sass/baotai/_${pageName}.scss`);
    console.log(`   3. 在 src/sass/style.scss 中引入 _${pageName}.scss`);
} else {
    console.log('⚠️  沒有建立新檔案');
}
console.log('');

