const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- THE PUBLIC FOLDER FIX ---
// This moves UP from 'backend' and then into 'public'
const publicPath = path.join(__dirname, "..", "public");

// Serve all your frontend files (CSS, JS, Hearts)
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// --- MONIKA AI LOGIC ---
const persona = "You are Monika, a cheerful anime companion. Speak warmly with emojis and asterisks like *giggles*. Always address the user as Arpit.";

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question || "";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "Server missing API Key" });

  const payload = {
    contents: [{ parts: [{ text: persona + "\n\nArpit says: " + userQuestion }] }]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "I'm having trouble thinking... " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Monika is awake and looking in ${publicPath} ✨`));
