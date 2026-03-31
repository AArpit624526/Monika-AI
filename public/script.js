// Ensure this is just the base URL without /ask at the end
const baseUrl = "https://monika-ai-0jpf.onrender.com";

// --- ElevenLabs Anime Voice Function ---
async function monikaSpeak(text) {
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
        
        audio.play().catch(e => console.log("Click the page once to enable audio!"));
    } catch (error) {
        console.error("Voice Error:", error);
        // Fallback to browser voice
        const fallback = new SpeechSynthesisUtterance(cleanText);
        fallback.pitch = 1.3;
        window.speechSynthesis.speak(fallback);
    }
}

async function askMonika() {
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
            appendMessage("Monika", monikaReply);
            
            // Trigger Anime Voice
            monikaSpeak(monikaReply);
        } else {
            appendMessage("Monika", "Server error. Check logs! 💔");
        }
    } catch (error) {
        if (loadingMessage) loadingMessage.remove();
        console.error("Fetch Error:", error);
        appendMessage("Monika", "Connection failed! 💔");
    }
}

function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat");
    const msgDiv = document.createElement("div");
    msgDiv.className = `bubble ${sender === "Arpit" ? "user" : "monika"}`;
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text.replace(/\n/g, "<br>")}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
    return msgDiv;
}

// Event Listeners
document.getElementById("sendButton").addEventListener("click", askMonika);
document.getElementById("question").addEventListener("keydown", (e) => {
    if (e.key === "Enter") askMonika();
});

// Mic Support
const micBtn = document.getElementById('micButton');
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
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
