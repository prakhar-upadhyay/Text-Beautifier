const inputEl = document.getElementById("inputText");
const outputEl = document.getElementById("result");
const formatBtn = document.getElementById("formatBtn");

const GEMINI_API_KEY = "AIzaSyDhFA37vwfIyM0ZokjliUw8UaDl8CdJCRw";
const GEMINI_MODELS = ["gemini-2.0-flash"];

async function transformTextWithGemini(inputText) {
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Format and improve readability of this text while preserving meaning:\n\n${inputText}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  };

  let lastStatus = 0;
  let lastBody = "";
  let data = null;

  for (const model of GEMINI_MODELS) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseBodyText = await response.text();

    if (response.ok) {
      data = JSON.parse(responseBodyText);
      break;
    }

    let parsedError = null;
    try {
      parsedError = JSON.parse(responseBodyText);
    } catch (_) {
      parsedError = null;
    }

    if (response.status === 429) {
      throw new Error(
        "Gemini quota exceeded (429). Add billing or wait for quota reset, then try again."
      );
    }

    lastStatus = response.status;
    lastBody = responseBodyText;
  }

  if (!data) {
    throw new Error(
      `Gemini request failed with status ${lastStatus}. ${lastBody.slice(0, 120)}`
    );
  }

  const transformedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!transformedText) {
    throw new Error("Gemini returned an empty response.");
  }

  return transformedText;
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
    const transformed = await transformTextWithGemini(inputText);
    outputEl.textContent = transformed;
  } catch (error) {
    outputEl.textContent = `Error: ${error.message}`;
  } finally {
    formatBtn.disabled = false;
  }
});
