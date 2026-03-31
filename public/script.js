// Ensure this is just the base URL without /ask at the end
const baseUrl = "https://monika-ai-0jpf.onrender.com";
let isLiveMode = false; // Tracks if we are in the "continuous" voice mode

// --- 1. ElevenLabs Anime Voice Function ---
async function monikaSpeak(text, voiceEnabled = false) {
    // Only speak if we are in Live Mode (voiceEnabled will be true)
    if (!voiceEnabled) return; 

    // Remove mood tags [HAPPY] etc. for cleaner speech
    const cleanText = text.replace(/\[.*?\]/g, "").trim();

    try {
        const response = await fetch(`${baseUrl}/voice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: cleanText })
        });

        if (!response.ok) throw new Error("Voice API failed");

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        // LOOP LOGIC: When she stops talking, turn the mic back on automatically
        audio.onended = () => {
            if (isLiveMode) {
                console.log("Monika finished. Listening for Arpit...");
                startListening();
            }
        };
        
        audio.play().catch(e => console.log("Click the page once to enable audio!"));
    } catch (error) {
        console.error("Voice Error:", error);
    }
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
            
            // Trigger Anime Voice (only if called from mic)
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
        // TURN LIVE MODE ON
        isLiveMode = true;
        micBtn.classList.add('listening'); // Triggers the pulse CSS
        
        const greeting = "What would you like to talk about today, Arpit?";
        appendMessage("Monika", greeting);
        monikaSpeak(greeting, true); // Speaks the greeting to start the loop
    } else {
        // TURN LIVE MODE OFF
        isLiveMode = false;
        micBtn.classList.remove('listening');
        if (recognition) recognition.stop();
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

// Manual Typing Listeners (Always SILENT)
document.getElementById("sendButton").addEventListener("click", () => askMonika(false));
document.getElementById("question").addEventListener("keydown", (e) => {
    if (e.key === "Enter") askMonika(false);
});
