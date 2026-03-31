// Ensure this is just the base URL without /ask at the end
const baseUrl = "https://monika-ai-0jpf.onrender.com";
let isLiveMode = false; // Tracks if we are in the "continuous" voice mode

// --- 1. Browser-Based Web Speech Function ---
function monikaSpeak(text, voiceEnabled = false) {
    // Only speak if we are in Live Mode or voice was explicitly requested
    if (!voiceEnabled) return; 

    // Remove mood tags [HAPPY] etc. for cleaner speech
    const cleanText = text.replace(/\[.*?\]/g, "").trim();

    // Cancel any current speech so it doesn't overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // --- MONIKA'S VOICE SETTINGS ---
    utterance.pitch = 1.6; // High pitch for that "Anime/Cute" vibe
    utterance.rate = 1.15;  // Slightly faster, energetic talking
    utterance.volume = 1.0;

    // Try to pick a high-quality female voice from the browser
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
        v.name.includes("Google US English") || 
        v.name.includes("Female") || 
        v.name.includes("Zira") ||
        v.name.includes("Samantha")
    );

    if (preferredVoice) utterance.voice = preferredVoice;

    // LOOP LOGIC: When she stops talking, turn the mic back on automatically
    utterance.onend = () => {
        if (isLiveMode) {
            console.log("Monika finished. Listening for Arpit...");
            startListening();
        }
    };
    
    window.speechSynthesis.speak(utterance);
}

// --- 2. Main Chat Function ---
async function askMonika(isFromVoice = false) {
    const inputField = document.getElementById("question");
    const userInput = inputField.value.trim();

    if (!userInput) return;

    // Play UI sound
    const pop = document.getElementById("popSound");
    if (pop) pop.play().catch(() => {});

    appendMessage("Arpit", userInput);
    inputField.value = ""; 

    const loadingMessage = appendMessage("Monika", "Writing... ✍️🌸");

    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput })
        });

        const data = await response.json();
        if (loadingMessage) loadingMessage.remove(); 

        if (response.ok) {
            const monikaReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm a bit lost... 💖";
            
            // Mood Background Logic
            if (monikaReply.includes("[HAPPY]")) document.body.className = "mood-happy";
            else if (monikaReply.includes("[LOVING]")) document.body.className = "mood-loving";
            else document.body.className = "";

            appendMessage("Monika", monikaReply);
            
            // Trigger Browser Voice
            monikaSpeak(monikaReply, isFromVoice);
        } else {
            appendMessage("Monika", "Server error. Check logs! 💔");
        }
    } catch (error) {
        if (loadingMessage) loadingMessage.remove();
        console.error("Fetch Error:", error);
        appendMessage("Monika", "Connection failed! 💔");
    }
}

// --- 3. Speech Recognition & Live Mode Logic ---
const micBtn = document.getElementById('micButton');
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("question").value = transcript;
        askMonika(true); // 'true' means we want her to speak back
    };
}

function startListening() {
    if (recognition && isLiveMode) {
        try { recognition.start(); } catch(e) {}
    }
}

// Mic Button Toggle
micBtn.onclick = () => {
    if (!isLiveMode) {
        isLiveMode = true;
        micBtn.classList.add('listening');
        
        const greeting = "What would you like to talk about today, Arpit?";
        appendMessage("Monika", greeting);
        monikaSpeak(greeting, true); 
    } else {
        isLiveMode = false;
        micBtn.classList.remove('listening');
        if (recognition) recognition.stop();
        window.speechSynthesis.cancel(); // Stops her if she's still talking
    }
};

// --- 4. UI Helpers ---
function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat");
    const msgDiv = document.createElement("div");
    msgDiv.className = `bubble ${sender === "Arpit" ? "user" : "monika"}`;
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text.replace(/\n/g, "<br>")}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
    return msgDiv;
}

// Load voices (crucial for Chrome/Edge)
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};

// Manual Typing Listeners (Always SILENT)
document.getElementById("sendButton").addEventListener("click", () => askMonika(false));
document.getElementById("question").addEventListener("keydown", (e) => {
    if (e.key === "Enter") askMonika(false);
});
