<<<<<<< HEAD
<template id="scripture">
  <div class="scripture-block">
    <p class="scripture-text">“{{text}}”</p>
    <p class="scripture-ref">— {{reference}}</p>
  </div>
</template>
=======
export function renderScripture(data) {
  const template = document.getElementById("scripture").innerHTML;
  return template
    .replace("{{text}}", data.text || "")
    .replace("{{reference}}", data.reference || "");
}
>>>>>>> 4a68468905ce0622c2dfd4d057aa1a140c1b4ef2
