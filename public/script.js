// Backend endpoint
const backendUrl = "https://monika-ai-0jpf.onrender.com/ask";

const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const input = document.getElementById("question");

sendButton.addEventListener("click", askMonika);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") askMonika(); });

function appendBubble(text, cls = "monika") {
  const div = document.createElement("div");
  div.className = `bubble ${cls}`;
  div.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(text) {
  const el = document.createElement("div");
  el.className = "status";
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

async function askMonika() {
  const q = input.value.trim();
  if (!q) return;
  appendBubble(q, "user");
  input.value = "";
  const statusEl = setStatus("Monika is thinking…");
  sendButton.disabled = true;

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server ${res.status}: ${txt}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text 
                 || data?.message 
                 || "No reply.";

    statusEl.remove();
    appendBubble(text, "monika");
  } catch (err) {
    statusEl.remove();
    appendBubble("Error: " + err.message, "error");
  } finally {
    sendButton.disabled = false;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));
}
