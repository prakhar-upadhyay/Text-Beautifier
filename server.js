require("dotenv").config();

const path = require("path");
const express = require("express");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: "1mb" }));

async function callGeminiGenerateContent(inputText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
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

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const responseBodyText = await response.text();

  if (!response.ok) {
    let message = `Gemini request failed (${response.status}).`;
    try {
      const errJson = JSON.parse(responseBodyText);
      if (errJson?.error?.message) {
        message = errJson.error.message;
      }
    } catch (_) {
      /* ignore */
    }
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const data = JSON.parse(responseBodyText);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }
  return text;
}

app.post("/api/format", async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY is not set. Create a .env file with GEMINI_API_KEY=... (see .env.example).",
    });
  }

  const text = req.body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: 'Missing or invalid "text" field.' });
  }

  try {
    const formatted = await callGeminiGenerateContent(text.trim());
    res.json({ formatted });
  } catch (e) {
    const status = e.status && Number(e.status) >= 400 && Number(e.status) < 600 ? e.status : 502;
    res.status(status).json({ error: e.message || "Upstream error." });
  }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Text Beautifier server at http://localhost:${PORT}`);
  console.log("Serve the app from this URL so /api/format stays same-origin.");
});
