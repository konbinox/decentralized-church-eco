const fs = require("fs");
const path = require("path");

// 字段库映射表：模块名关键词 → 字段类型
const fieldMap = {
  title: "title",
  welcome: "title",
  end: "title",
  king: "script",
  script: "script",
  image: "url",
  music: "audio",
  zoom: "text",
  default: "text"
};

// 根据字段类型生成 inputs
function getInputs(fieldType) {
  switch (fieldType) {
    case "url": return [{ key: "url", label: "图片链接" }];
    case "audio": return [
      { key: "title", label: "音乐标题" },
      { key: "url", label: "音乐链接" }
    ];
    case "script": return [{ key: "script", label: "脚本/台词" }];
    case "title": return [{ key: "title", label: "标题" }];
    default: return [{ key: "text", label: "文本字段" }];
  }
}

// 根据字段类型生成 HTML 模板
function getHtml(moduleName, fieldType) {
  switch (fieldType) {
    case "url":
      return `<template>
  <div class="${moduleName}">
    <img src="{{url}}" alt="${moduleName}">
  </div>
</template>`;
    case "audio":
      return `<template>
  <div class="${moduleName}">
    <h2>{{title}}</h2>
    <audio controls src="{{url}}"></audio>
  </div>
</template>`;
    case "script":
      return `<template>
  <div class="${moduleName}">
    <p>{{script}}</p>
  </div>
</template>`;
    case "title":
      return `<template>
  <h1 class="${moduleName}">{{title}}</h1>
</template>`;
    default:
      return `<template>
  <div class="${moduleName}">
    <p>{{text}}</p>
  </div>
</template>`;
  }
}

// 生成模块
function createModule(moduleName, fieldType) {
  const dir = path.join(__dirname, "modules", moduleName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const inputs = getInputs(fieldType);
  const manifest = {
    template: `${moduleName}.html`,
    style: `${moduleName}.css`,
    inputs
  };
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(dir, `${moduleName}.html`), getHtml(moduleName, fieldType));
  fs.writeFileSync(path.join(dir, `${moduleName}.css`), `.${moduleName} {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  text-align: center;
}`);

  console.log(`✅ 模块 ${moduleName} 已生成 (${fieldType})`);
}

// 主函数：读取 presets.json 并生成模块
function main() {
  const presetsPath = path.join(__dirname, "data", "presets.json");
  if (!fs.existsSync(presetsPath)) {
    console.error("❌ 找不到 data/presets.json，请确认路径正确");
    return;
  }

  const presets = JSON.parse(fs.readFileSync(presetsPath, "utf-8"));
  const allModules = new Set();

  Object.values(presets).forEach(modList => {
    modList.forEach(m => allModules.add(m));
  });

  console.log("🟢 从 presets.json 解析到的模块:", Array.from(allModules));

  Array.from(allModules).forEach(m => {
    const key = Object.keys(fieldMap).find(k => m.includes(k)) || "default";
    const fieldType = fieldMap[key];
    createModule(m, fieldType);
  });
}

main();
