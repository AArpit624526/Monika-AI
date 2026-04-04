# 🌸 Monika-AI: Vision-Powered Intelligent Companion

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Monika-AI** is a high-performance, personality-driven interactive companion. Leveraging **Gemini 1.5 Flash** and advanced browser APIs, Monika doesn't just chat—she **sees**, **hears**, and **follows** you across your desktop with a custom Picture-in-Picture interface.

[🚀 Launch Live Demo](https://monika-ai-0jpf.onrender.com)

---

## 🔥 New & Advanced Features

- **👁️ Vision Engine:** Monika can now see through your webcam. Show her objects, code, or your surroundings, and she will react in real-time.
- **🖼️ Floating Window (PiP):** Multitask with ease. Use the **Document Picture-in-Picture API** to pop Monika into a floating, always-on-top window while you code or game.
- **🌌 Cyber-Sakura UI:** A gorgeous "Glassmorphism" interface featuring:
  - **3D Mouse Parallax:** The UI panels tilt and react to your cursor movement.
  - **Dynamic Mood Engine:** Backgrounds and glows shift colors based on Monika's emotions (`[HAPPY]`, `[LOVING]`, `[THINKING]`).
  - **Scanline Effects:** A sci-fi HUD overlay for the vision feed.
- **🎙️ Seamless Voice Loop:** Zero-latency speech synthesis combined with hands-free `SpeechRecognition`.
- **💾 Persistent Memory:** MongoDB integration ensures she remembers your name, projects (like your Pothole Portal or CandyRobot), and past conversations.

---

## 🛠️ Technical Overhaul

### High-Performance Frontend
- **Document PiP API:** Advanced window detachment for "Always-on-Top" functionality.
- **CSS3 Glassmorphism:** Deep blurs, saturation filters, and `cubic-bezier` transitions.
- **Web Speech API:** Native browser processing to keep server CPU usage low.

### Optimized Backend
- **Gemini 1.5 Flash:** Optimized for high-speed multimodal (Text + Image) reasoning.
- **Buffered Image Processing:** Secure Base64 handling for vision frames.
- **Mongoose ODM:** Structured conversation logging and user profiling.

---

## 📁 Project Structure

```text
Monika-AI/
├── backend/
│   ├── server.js        # Express, Gemini Vision Logic & MongoDB
│   └── package.json     # Node dependencies
├── public/
│   ├── index.html       # Multimodal UI & PiP entry point
│   ├── style.css        # 3D effects, Glassmorphism & Mood themes
│   └── script.js        # Vision capture, PiP Logic & Voice Loop
```

---

## 🚀 Installation

1. **Clone & Install**
   ```bash
   git clone [https://github.com/tagadearpit/Monika-AI.git](https://github.com/tagadearpit/Monika-AI.git)
   cd Monika-AI/backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in `/backend`:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_key_here
   MONGO_URI=your_mongodb_atlas_uri
   ```

3. **Run**
   ```bash
   npm start
   ```
   *Recommended: Access via **Google Chrome** for full Vision and PiP support.*

---

## 🎨 Mood & Interaction System

Monika's environment reacts to her internal state:
- **[HAPPY]**: Soft violet-blue gradients.
- **[LOVING]**: Pulsing pink "Heart-Glow" animations.
- **[THINKING]**: Deep space-blue with increased scanline intensity.

---

## 🤝 Contributing
Have ideas for a more "glitchy" aesthetic or better vision prompts? PRs are welcome! 

Developed with ❤️ by [Arpit Tagade](https://github.com/tagadearpit)
```

### 💡 What changed in this version:
1.  **Updated Badges:** Switched to `for-the-badge` style for a more "premium" feel.
2.  **Vision & PiP Focus:** Put your two coolest technical features (Vision and Floating Window) at the very top.
3.  **Modernized Tech Stack:** Mentioned the specific APIs (Document PiP, Glassmorphism) that recruiters love to see.
4.  **Hardware Context:** Subtle references to her remembering your specific projects, which shows off her "Long-Term Memory."


