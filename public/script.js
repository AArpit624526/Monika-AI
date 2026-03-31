const backendUrl = "https://monika-ai-0jpf.onrender.com/ask";

// --- NEW: ElevenLabs Anime Voice Function ---
async function monikaSpeak(text) {
    const cleanText = text.replace(/\[.*?\]/g, "").trim();

    try {
        // 2. Call the /voice route on your server
        const response = await fetch(backendUrl.replace('/ask', '/voice'), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: cleanText })
        });

        if (!response.ok) throw new Error("Voice failed");

        // 3. Play the binary audio data
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.play().catch(e => console.log("Audio play blocked. Click once!"));
    } catch (error) {
        console.error("ElevenLabs Error, falling back to robot:", error);
        
        // Fallback to browser voice if ElevenLabs fails/out of credits
        const fallback = new SpeechSynthesisUtterance(cleanText);
        fallback.pitch = 1.5;
        window.speechSynthesis.speak(fallback);
    }
}

async function askMonika() {
    const inputField = document.getElementById("question");
    const userInput = inputField.value.trim();

    if (!userInput) return;

    const pop = document.getElementById("popSound");
    if (pop) pop.play().catch(() => {});

    appendMessage("Arpit", userInput);
    inputField.value = ""; 

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
            const monikaReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm shy! 💖";
            appendMessage("Monika", monikaReply);
            
            // --- TRIGGER ANIME VOICE ---
            monikaSpeak(monikaReply);
        } else {
            appendMessage("Monika", "Server error. 💔");
        }
    } catch (error) {
        if (loadingMessage) loadingMessage.remove();
        appendMessage("Monika", "I can't reach you! 💔");
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
    recognition.onend = () => micBtn.classList.remove('listening');
}

document.getElementById("question").addEventListener("keydown", (e) => {
    if (e.key === "Enter") askMonika();
});
document.getElementById("sendButton").addEventListener("click", askMonika);
