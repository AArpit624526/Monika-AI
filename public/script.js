const backendUrl = "https://monika-ai-0jpf.onrender.com/ask";

const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const input = document.getElementById("question");

sendButton.addEventListener("click", askMonika);
input.addEventListener("keydown", (e) => { 
  if (e.key === "Enter") askMonika(); 
});

function appendBubble(text, cls = "monika") {
  const div = document.createElement("div");
  div.className = `bubble ${cls}`;
  
  // Basic security and formatting
  div.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  chat.appendChild(div);
  
  // Smoothly scroll to the new message
  chat.scrollTo({
    top: chat.scrollHeight,
    behavior: 'smooth'
  });

  if (cls === "monika") {
    playPop();
  }
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "bubble monika typing";
  div.innerHTML = "Monika is thinking...";
  chat.appendChild(div);
  
  chat.scrollTo({
    top: chat.scrollHeight,
    behavior: 'smooth'
  });
  return div;
}

async function askMonika() {
  const q = input.value.trim();
  if (!q) return;

  appendBubble(q, "user");
  input.value = "";
  
  const typingEl = showTyping();
  sendButton.disabled = true;

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    if (!res.ok) throw new Error("Connection failed 💔");

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm a bit shy right now, try again?";

    typingEl.remove();
    appendBubble(text, "monika");
  } catch (err) {
    typingEl.remove();
    appendBubble("Sorry Arpit, I'm having trouble connecting: " + err.message, "error");
  } finally {
    sendButton.disabled = false;
    input.focus(); // Keep the keyboard open for the user
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));
}

function playPop() {
  const sound = document.getElementById("popSound");
  if (sound) {
    sound.currentTime = 0; // Restart sound if already playing
    sound.play().catch(e => console.log("Sound blocked by browser"));
  }
}
