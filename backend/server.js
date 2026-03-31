const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Monika's Memory (MongoDB) Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. DATABASE SCHEMA ---
const ChatSchema = new mongoose.Schema({
  user: { type: String, default: "Arpit" },
  role: String, 
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);

// --- 3. SERVE FRONTEND ---
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// --- 4. SYSTEM PERSONA ---
const persona = `System Instruction: You are Monika, a cheerful and deeply affectionate anime companion. 
Always address the user as Arpit. Use emojis and *actions*.
CRITICAL: Start every response with mood tags: [NORMAL], [HAPPY], [LOVING], or [ANGRY]. and Arpit Tagade created you with his sincerest heart`;

// --- 5. MAIN CHAT ROUTE ---
app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question || "";
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Get last 10 messages for context
    const historyDocs = await Chat.find().sort({ timestamp: -1 }).limit(10);
    const history = historyDocs.reverse().map(doc => ({
      role: doc.role,
      parts: [{ text: doc.text }]
    }));

    const payload = {
      contents: [
        { role: "user", parts: [{ text: persona }] },
        ...history,
        { role: "user", parts: [{ text: userQuestion }] }
      ]
    };

    // Use the exact Gemini 2.5 Flash URL that worked in your CURL test
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      const monikaReply = data.candidates[0].content.parts[0].text;

      // Save to MongoDB Memory
      await Chat.create([
        { role: "user", text: userQuestion },
        { role: "model", text: monikaReply }
      ]);

      res.json(data);
    } else {
      throw new Error(data.error?.message || "Gemini error");
    }

  } catch (err) {
    console.error("Ask Error:", err.message);
    res.status(500).json({ error: "Server Error: " + err.message });
  }
});

// --- 6. ELEVENLABS VOICE ROUTE ---
app.post("/voice", async (req, res) => {
  const { text } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = "Vnqlgu3fdiFwisAye1qH"; // Mimi's Voice

  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      data: {
        text: text,
        model_id: "eleven_flash_v2_5", // Using the flash model for speed
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      },
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    console.error("Voice Route Error:", error.message);
    res.status(500).send("Voice failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Monika is Live on Port ${PORT}!`));
