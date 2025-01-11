const form = document.getElementById("shorten-form");

const input = document.getElementById("url-input");
const shortenedLinkContainer = document.getElementById("shortened-link");
const shortenedUrl = document.getElementById("shortened-url");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = input.value;
  const response = await fetch("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  shortenedUrl.textContent = data.shortenedUrl;
  shortenedUrl.href = data.shortenedUrl;
  shortenedLinkContainer.classList.remove("hidden");
});

document.getElementById("copy-btn").addEventListener("click", function () {
  const link = document.getElementById("shortened-url");
  const range = document.createRange();
  range.selectNode(link);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  alert("Link copiado para a área de transferência!");
});
