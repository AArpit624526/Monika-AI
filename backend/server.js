require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// --- MongoDB Configuration ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Monika's Memory (MongoDB) Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const chatSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

// --- Gemini AI Configuration ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ask", async (req, res) => {
    const { question, imageBase64 } = req.body;

    try {
        // 1. Retrieve last 12 messages for better context (6 turns)
        const rawHistory = await Chat.find().sort({ timestamp: -1 }).limit(12);
        
        // 2. FORMAT HISTORY: Crucial fix for the "role" error
        // Gemini expects: [ { role: "user", parts: [{ text: "..." }] }, ... ]
        const formattedHistory = rawHistory.reverse().map(msg => ({
            role: msg.sender === "Arpit" ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: "You are Monika, an intelligent and caring AI companion. You are talking to Arpit. Be helpful, concise, and slightly witty."
        });

        // 3. Handle Vision (if image is present)
        if (imageBase64) {
            const result = await model.generateContent([
                question,
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
            ]);
            const response = await result.response;
            const text = response.text();

            // Save to DB
            await new Chat({ sender: "Arpit", text: question }).save();
            await new Chat({ sender: "Monika", text }).save();

            return res.json({ candidates: [{ content: { parts: [{ text }] } }] });
        }

        // 4. Handle Standard Chat (with history)
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: { maxOutputTokens: 500 }
        });

        const result = await chat.sendMessage(question);
        const response = await result.response;
        const text = response.text();

        // 5. Save new conversation to MongoDB
        await new Chat({ sender: "Arpit", text: question }).save();
        await new Chat({ sender: "Monika", text: text }).save();

        // Return in format expected by script.js
        res.json({ candidates: [{ content: { parts: [{ text }] } }] });

    } catch (error) {
        console.error("Monika Brain Error:", error);
        res.status(500).json({ error: "Monika's brain is fuzzy. Try again! 💔" });
    }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Monika is upgraded and Live on Port ${PORT}!`);
});
