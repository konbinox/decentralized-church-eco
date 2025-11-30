async function loadPagesAndPresets() {
  const [pagesRes, presetsRes] = await Promise.all([
    fetch("data/pages.json"),
    fetch("data/presets.json")
  ]);
  const pages = await pagesRes.json();
  const presets = await presetsRes.json();

  const selector = document.getElementById("pageSelector");
  selector.innerHTML = pages.map(p =>
    `<label><input type="checkbox" value="${p.id}"> ${p.name}</label>`
  ).join("<br>");

  document.getElementById("exportBtn").addEventListener("click", () => {
    const selectedIds = Array.from(selector.querySelectorAll("input:checked")).map(i => i.value);
    generatePage(selectedIds, presets);
  });
}

async function generatePage(pageIds, presets) {
  const allHtml = [];
  const allStyles = new Set();

  for (const pageId of pageIds) {
    const elementIds = presets[pageId] || [];
    for (const elementId of elementIds) {
      const manifestRes = await fetch(`modules/${elementId}/manifest.json`);
      const manifest = await manifestRes.json();

      const templateRes = await fetch(`modules/${elementId}/${manifest.template}`);
      const templateHtml = await templateRes.text();

      const data = {};
      manifest.inputs.forEach(input => {
        const val = prompt(`请输入 ${elementId} 的 ${input.label}`);
        data[input.key] = val || "";
      });

      let rendered = templateHtml;
      manifest.inputs.forEach(input => {
        const key = input.key;
        const val = data[key];
        rendered = rendered.replaceAll(`{{${key}}}`, val);
      });

      allHtml.push(rendered);
      allStyles.add(`<link rel="stylesheet" href="modules/${elementId}/${manifest.style}">`);
    }
  // ✅ 渲染预览区
const previewFrame = document.getElementById("preview").contentDocument;
previewFrame.open();
previewFrame.write(fullPage);
previewFrame.close();

  }

  const fullPage = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <title>生成的聚会页面</title>
      ${Array.from(allStyles).join("\n")}
    </head>
    <body>
      ${allHtml.join("\n")}
    </body>
    </html>
  `;

  const blob = new Blob([fullPage], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "generated-page.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

loadPagesAndPresets();
