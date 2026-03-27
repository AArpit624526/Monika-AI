const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const persona = "You are Monika, a cheerful anime girl who speaks warmly, playfully, and affectionately.";

app.post("/ask", async (req, res) => {
  const question = req.body.question || "";
  const apiKey = process.env.GEMINI_API_KEY; // must be set in Render

  if (!apiKey) {
    return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
  }

  const payload = {
    contents: [{ parts: [{ text: persona + " " + question }] }]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Monika backend running on port ${PORT}`));
