const inputEl = document.getElementById("inputText");
const outputEl = document.getElementById("result");
const formatBtn = document.getElementById("formatBtn");

async function transformTextViaServer(inputText) {
  const response = await fetch("/api/format", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: inputText }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = payload?.error || `Request failed (${response.status}).`;
    throw new Error(msg);
  }

  const formatted = payload?.formatted;
  if (typeof formatted !== "string" || !formatted.trim()) {
    throw new Error("Server returned an empty result.");
  }

  return formatted.trim();
}

formatBtn.addEventListener("click", async () => {
  const inputText = inputEl.value.trim();

  if (!inputText) {
    outputEl.textContent = "Please enter some text first.";
    return;
  }

  outputEl.textContent = "Formatting text with Gemini...";
  formatBtn.disabled = true;

  try {
    const transformed = await transformTextViaServer(inputText);
    outputEl.textContent = transformed;
  } catch (error) {
    outputEl.textContent = `Error: ${error.message}`;
  } finally {
    formatBtn.disabled = false;
  }
});
