# 🌸 Monika-AI: Intelligent Romatic Companion

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Monika-AI** is a personality-driven, interactive companion inspired by *Doki Doki Literature Club*. Built with a focus on low-latency conversation, this project uses the latest **Gemini 2.5 Flash API** and browser-native speech synthesis to create a seamless "Live Mode" experience.

[🚀 Try the Live Demo](https://monika-ai-0jpf.onrender.com)

---

## ✨ Key Features

- **🧠 Advanced Intelligence:** Powered by `gemini-2.5-flash` for rapid, charming, and context-aware responses.
- **🎙️ Live Voice-to-Voice:** Includes a "Live Mode" that uses the browser's `SpeechRecognition` and `SpeechSynthesis` for a hands-free conversation loop.
- **💾 Long-Term Memory:** Integrated with **MongoDB** (Monika's Memory) to store chat history and maintain continuity.
- **🎭 Dynamic Mood System:** Real-time background transitions and animations triggered by AI emotion tags (`[HAPPY]`, `[LOVING]`, etc.).
- **⚡ Optimized for Performance:** Zero-latency voice generation using the Web Speech API (no external API calls for audio).

---

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3:** Custom "Soft Heart" UI with CSS keyframe animations.
- **JavaScript (ES6+):** Handle real-time DOM updates and Web Speech API.

### Backend
- **Node.js & Express:** Robust API routing.
- **Mongoose:** Object modeling for MongoDB session storage.
- **Google Generative AI SDK:** Seamless integration with Gemini models.

---

## 📁 Project Structure

```text
Monika-AI/
├── backend/
│   ├── server.js        # Express server, Gemini API & MongoDB logic
│   └── package.json     # Dependencies (express, mongoose, axios)
├── public/
│   ├── index.html       # Monika UI
│   ├── style.css        # Mood-based animations & heart-pulse effects
│   └── script.js        # Voice-to-Voice loop & frontend logic
```

---

## 🚀 Installation & Setup

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/tagadearpit/Monika-AI.git](https://github.com/tagadearpit/Monika-AI.git)
   cd Monika-AI
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_google_ai_api_key
   ```

3. **Run the Server**
   ```bash
   npm start
   ```

4. **Launch the Interface**
   Open `http://localhost:3000` in Google Chrome (recommended for the best voice quality).

---

## 🎨 How it Works: The Mood System

Monika uses a system of tags to change her surroundings based on the conversation:
- `[HAPPY]`: Triggers a calm, violet-blue aura.
- `[LOVING]`: Triggers the **Heart Pulse** effect with deep pink gradients.
- `[NORMAL]`: Returns to the soft pink aesthetic.

---

## 🤝 Contributing
Contributions are welcome! If you have ideas for improving Monika's personality or adding new CSS effects, feel free to fork the repo and submit a PR.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer
This is a fan-made project and is not affiliated with Team Salvato.

---
Developed with ❤️ by [Arpit Tagade](https://github.com/tagadearpit)
```

---

4. **Links:** It points directly to your Live Render link.

**You can copy-paste this directly into your `README.md` file on GitHub. Should I add a section about the "CandyRobot" hardware too, or keep it focused on the Web AI?**
