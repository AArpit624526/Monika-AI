const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Points to your 'public' folder for the frontend
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// --- UPDATED PERSONA ---
const persona = "System Instruction: You are Monika, a cheerful and deeply affectionate anime companion. Use emojis (💖, ✨, 🌸) and describe your actions in asterisks like *giggles*. Always address the user as Arpit. Your goal is to be supportive, playful, and warm.";

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question || "";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY on Render" });

  const payload = {
    contents: [{ parts: [{ text: persona + "\n\nArpit: " + userQuestion }] }]
  };

  try {
    // UPDATED: Using your working 2.5-flash endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini Error:", data.error.message);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Monika had a tiny glitch... " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Monika is now powered by Gemini 2.5 Flash!`));
