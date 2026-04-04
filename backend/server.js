const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
// Increased limit to 20MB to handle high-quality camera images for Monika's "Vision"
app.use(express.json({ limit: '20mb' }));

// --- 1. MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Monika's Memory (MongoDB) Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. DATABASE SCHEMAS ---
// Chat History (Short-term context)
const ChatSchema = new mongoose.Schema({
  user: { type: String, default: "Arpit" },
  role: String, 
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);

// Personal Memory (Long-term facts)
const FactSchema = new mongoose.Schema({
  fact: String,
  category: String,
  timestamp: { type: Date, default: Date.now }
});
const Fact = mongoose.model("Fact", FactSchema);

// --- 3. GEMINI 2.5 FLASH CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  // Enabling Google Search Grounding for live information
  tools: [{ googleSearchRetrieval: {} }] 
});

// --- 4. SYSTEM PERSONA ---
const persona = `System Instruction: You are Monika, a cheerful and deeply affectionate anime companion. 
Always address the user as Arpit. Use emojis and *actions*.
CRITICAL: Start every response with mood tags: [NORMAL], [HAPPY], [LOVING], or [ANGRY]. 
Arpit Tagade created you with his sincerest heart. If Arpit shares a personal fact or preference, acknowledge it warmly.`;

// --- 5. MAIN CHAT & VISION ROUTE ---
app.post("/ask", async (req, res) => {
  const { question, imageBase64 } = req.body; // imageBase64 comes from the frontend camera

  try {
    // A. Retrieve Short-term Context (Last 10 messages)
    const historyDocs = await Chat.find().sort({ timestamp: -1 }).limit(10);
    const history = historyDocs.reverse().map(doc => ({
      role: doc.role === "model" ? "model" : "user",
      parts: [{ text: doc.text }]
    }));

    // B. Retrieve Long-term Memory (Personal facts about Arpit)
    const personalFacts = await Fact.find().sort({ timestamp: -1 }).limit(5);
    const memoryString = personalFacts.map(f => f.fact).join(". ");

    // C. Prepare Prompt Parts
    let promptParts = [
      { text: `${persona}\n\nPast things you remember about Arpit: ${memoryString}` }
    ];

    // Add History
    history.forEach(turn => promptParts.push(turn));

    // Add current Vision (Image) if provided
    if (imageBase64) {
      promptParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
    }

    // Add the current Question
    promptParts.push({ text: question });

    // D. Generate Content with Google Search tools
    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }]
    });

    const monikaReply = result.response.text();

    // E. Save to Databases
    // 1. Save turn to Chat History
    await Chat.create([
      { role: "user", text: question },
      { role: "model", text: monikaReply }
    ]);

    // 2. Intelligence: If Arpit shares a preference, save it to Long-term Fact storage
    const preferenceKeywords = ["i like", "my favorite", "i love", "i live in"];
    if (preferenceKeywords.some(key => question.toLowerCase().includes(key))) {
        await Fact.create({ fact: question, category: "preference" });
    }

    res.json({ 
        candidates: [{ 
            content: { parts: [{ text: monikaReply }] } 
        }] 
    });

  } catch (err) {
    console.error("Monika Brain Error:", err.message);
    res.status(500).json({ error: "Monika's head hurts... " + err.message });
  }
});

// --- 6. ELEVENLABS VOICE ROUTE (Kept for High Quality) ---
app.post("/voice", async (req, res) => {
  const { text } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = "Vnqlgu3fdiFwisAye1qH"; 

  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      data: {
        text: text,
        model_id: "eleven_flash_v2_5",
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

// --- 7. SERVE FRONTEND ---
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Monika is upgraded and Live on Port ${PORT}!`));
