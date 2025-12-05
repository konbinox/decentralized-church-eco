const fs = require("fs");
const path = require("path");

const modulesDir = path.join(__dirname, "modules");

function makeManifest(id) {
  return {
    name: `模块 ${id}`,
    script: `${id}.js`,
    style: `${id}.css`,
    inputs: [
      { key: "title", label: "标题", type: "text" },
      { key: "text", label: "正文", type: "textarea" }
    ]
  };
}

function makeScript(id) {
  return `
export default function render(data) {
  const title = data.title || "";
  const text = data.text || "";
  return \`
    <section class="${id}">
      <h2>\${title}</h2>
      <p>\${text}</p>
    </section>
  \`;
}
`.trim();
}

function makeStyle(id) {
  return `
.${id} {
  margin: 20px;
  padding: 10px;
  font-family: sans-serif;
}
.${id} h2 {
  font-size: 20px;
  margin-bottom: 8px;
}
.${id} p {
  font-size: 16px;
  line-height: 1.5;
}
`.trim();
}

fs.readdirSync(modulesDir).forEach((modId) => {
  const modPath = path.join(modulesDir, modId);
  if (!fs.statSync(modPath).isDirectory()) return;

  // manifest.json
  const manifestPath = path.join(modPath, "manifest.json");
  const manifest = makeManifest(modId);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✅ 替换 manifest: ${modId}`);

  // JS 文件
  const jsPath = path.join(modPath, manifest.script);
  fs.writeFileSync(jsPath, makeScript(modId), "utf8");
  console.log(`✅ 替换 JS: ${modId}`);

  // CSS 文件
  const cssPath = path.join(modPath, manifest.style);
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, makeStyle(modId), "utf8");
    console.log(`🎨 创建 CSS: ${modId}`);
  }
});
