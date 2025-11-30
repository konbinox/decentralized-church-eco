async function init() {
  const [pagesRes, presetsRes] = await Promise.all([
    fetch("data/pages.json"),
    fetch("data/presets.json")
  ]);
  const pages = await pagesRes.json();
  const presets = await presetsRes.json();

  const selector = document.getElementById("pageSelector");
  selector.innerHTML = pages.map(p =>
    `<label><input type="checkbox" value="${p.id}"> ${p.name}</label>`
  ).join("");

  selector.addEventListener("change", () => {
    const selectedIds = Array.from(selector.querySelectorAll("input:checked")).map(i => i.value);
    renderForm(selectedIds, presets);
  });

  // 可选：页面加载后默认渲染第一个页面的表单，便于直接测试
  if (pages[0]) renderForm([pages[0].id], presets);
}
