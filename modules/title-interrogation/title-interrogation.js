export default function render(data) {
  const title = data.title || "";
  const text = data.text || "";
  return `
    <section class="title-interrogation">
      <h2>${title}</h2>
      <p>${text}</p>
    </section>
  `;
}