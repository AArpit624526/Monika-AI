// --- CONFIGURATION ---
const baseUrl = "https://monika-ai-0jpf.onrender.com";
let isLiveMode = false; 

const visionFeed = document.getElementById('vision-feed');
const visionContainer = document.getElementById('vision-container');
const chatContainer = document.getElementById('chat-container');
const micBtn = document.getElementById('micButton');
const micIcon = document.getElementById('micIcon');
const inputField = document.getElementById("question");
const chatBox = document.getElementById("chat");
const pipBtn = document.getElementById('pipButton');

// --- 1. POP-OUT LOGIC ---
pipBtn.onclick = async () => {
    if (!window.documentPictureInPicture) {
        alert("Use Chrome for the floating window! 🌸");
        return;
    }
    const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 400, height: 600 });
    [...document.styleSheets].forEach((styleSheet) => {
        try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = styleSheet.href;
            pipWindow.document.head.appendChild(link);
        }
    });
    pipWindow.document.body.append(chatContainer);
    pipWindow.addEventListener("pagehide", (event) => {
        document.getElementById('main-wrapper').append(event.target.querySelector('#chat-container'));
    });
};

// --- 2. TYPEWRITER ---
function typeWriter(text, element, callback) {
    let i = 0;
    const cleanText = text.replace(/\[.*?\]/g, "").trim();
    element.innerHTML = "<strong>Monika:</strong> ";
    function type() {
        if (i < cleanText.length) {
            element.innerHTML += cleanText.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(type, (cleanText[i-1] === "." ? 200 : 35));
        } else if (callback) callback();
    }
    type();
}

// --- 3. VISION & BROWSER VOICE ---
async function startVision() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        visionFeed.srcObject = stream;
        visionContainer.classList.add('active'); 
    } catch (e) { alert("Camera access needed! 🌸"); }
}

function stopVision() {
    if (visionFeed.srcObject) {
        visionFeed.srcObject.getTracks().forEach(track => track.stop());
        visionFeed.srcObject = null;
        visionContainer.classList.remove('active');
    }
}

async function captureVisionFrame() {
    if (!visionFeed.srcObject) return null;
    const canvas = document.getElementById('capture-canvas');
    canvas.width = visionFeed.videoWidth;
    canvas.height = visionFeed.videoHeight;
    canvas.getContext('2d').drawImage(visionFeed, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
}

function monikaSpeak(text) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 1.3;
    utterance.rate = 1.0;
    const voices = window.speechSynthesis.getVoices();
    // Tries to find a female-sounding voice
    utterance.voice = voices.find(v => v.name.includes("Female") || v.name.includes("Google UK English Female")) || voices[0];
    window.speechSynthesis.speak(utterance);
}

// --- 4. CHAT LOGIC ---
async function askMonika() {
    let userInput = inputField.value.trim();
    if (!userInput && isLiveMode) userInput = "What do you see right now, Monika?";
    if (!userInput) return;

    appendMessage("Arpit", userInput);
    inputField.value = ""; 
    const loading = appendMessage("Monika", "...");

    let imageBase64 = isLiveMode ? await captureVisionFrame() : null;

    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput, imageBase64 })
        });
        const data = await response.json();
        loading.remove(); 
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm a bit confused... 💔";
        const newMsg = appendMessage("Monika", "");
        typeWriter(reply, newMsg, () => { if(isLiveMode) monikaSpeak(reply); });
    } catch (e) { 
        loading.remove(); 
        appendMessage("Monika", "Connection lost... 💔"); 
    }
}

// --- 5. UI ---
micBtn.onclick = () => {
    isLiveMode = !isLiveMode;
    micBtn.classList.toggle('listening', isLiveMode);
    micIcon.innerText = isLiveMode ? '📸' : '🎤';
    isLiveMode ? startVision() : stopVision();
    if (!isLiveMode) window.speechSynthesis.cancel();
};

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `bubble ${sender === "Arpit" ? "user" : "monika"}`;
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

document.getElementById("sendButton").onclick = () => askMonika();
inputField.onkeydown = (e) => { if(e.key === "Enter") askMonika(); };
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
