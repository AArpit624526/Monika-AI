const backendUrl = "https://monika-ai-0jpf.onrender.com/ask";

// --- Optimized Voice Synthesis Function ---
function monikaSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        // FORCED: Using the high-quality voice you found in your console
        const monikaVoice = voices.find(v => v.name === "Google UK English Female") || 
                           voices.find(v => v.name === "Google US English") || 
                           voices.find(v => v.name.includes("Zira"));
        
        if (monikaVoice) {
            utterance.voice = monikaVoice;
            console.log("Monika is using voice: " + monikaVoice.name);
        }
        
        utterance.pitch = 1.3; // Feminine/Cute pitch
        utterance.rate = 1.0; 
        window.speechSynthesis.speak(utterance);
    }
}

async function askMonika() {
    const inputField = document.getElementById("question");
    const chatBox = document.getElementById("chat");
    const userInput = inputField.value.trim();

    if (!userInput) return;

    // 1. Play the pop sound (Fixed source in HTML)
    const pop = document.getElementById("popSound");
    if (pop) {
        pop.play().catch(e => console.log("Audio play blocked by browser. Click the screen once!"));
    }

    // 2. Display Arpit's message
    appendMessage("Arpit", userInput);
    inputField.value = ""; 

    // 3. Show "Writing..." indicator
    const loadingMessage = appendMessage("Monika", "Writing... ✍️🌸");

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput })
        });

        const data = await response.json();
        if (loadingMessage) loadingMessage.remove(); 

        if (response.ok) {
            const monikaReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm a bit shy right now... try again? 💖";
            appendMessage("Monika", monikaReply);
            
            // Trigger Voice
            monikaSpeak(monikaReply);
        } else {
            appendMessage("Monika", "Server error. Try again! 💔");
        }
    } catch (error) {
        console.error("Error:", error);
        if (loadingMessage) loadingMessage.remove();
        appendMessage("Monika", "I can't reach you! Wait for the server to wake up. 💔");
    }
}

function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("bubble");
    msgDiv.classList.add(sender === "Arpit" ? "user" : "monika");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text.replace(/\n/g, "<br>")}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
    return msgDiv;
}

// Microphone Listener
const micBtn = document.getElementById('micButton');
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add('listening');
    };

    recognition.onresult = (event) => {
        document.getElementById("question").value = event.results[0][0].transcript;
        askMonika();
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
    };
}

// Enter Key Listener
document.getElementById("question").addEventListener("keydown", (e) => {
    if (e.key === "Enter") askMonika();
});

document.getElementById("sendButton").addEventListener("click", askMonika);

// Force voices to load
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};
