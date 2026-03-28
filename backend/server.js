const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// --- DYNAMIC PATH SOLVER ---
// This checks if we are in a 'backend' subfolder or the root
const rootPath = fs.existsSync(path.join(__dirname, "index.html")) 
                 ? __dirname 
                 : path.join(__dirname, "..");

app.use(express.static(rootPath));

app.get("/", (req, res) => {
  const indexPath = path.join(rootPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Monika says: I can't find my index.html file in " + rootPath);
  }
});

const persona = "You are Monika, a cheerful anime companion. Always call the user Arpit.";

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question || "";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "API Key Missing" });

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
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Monika is officially awake on port ${PORT} ✨`));
