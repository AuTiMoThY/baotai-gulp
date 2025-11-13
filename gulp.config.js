const project = "BaoTai";
const version = "20251110";

const entry = "src";
const output = "dist";
const prodOutput = "dist_prod";

// 使用 export default 導出配置物件
export default {
    project: project,
    version: version,
    port: 8082,
    entry: `./${entry}`,
    output: `./${output}`,
    prodOutput: `./${prodOutput}`,
    entryPath: {
        sass: `./${entry}/sass`
    },
    sassOpt: {
        outputStyle: "expanded",
        loadPaths: ["node_modules/"]
    },
    sassVar: {
        PROJECT_NAME: project,
        VERSION: version
    },
    njkOpt: {
        PROJECT_NAME: project
    },
    serverUrl: "https://srl.tw/red_heart/baotai/"
};
