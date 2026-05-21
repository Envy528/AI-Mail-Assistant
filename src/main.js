import "./style.css";
import { jsPDF } from "jspdf";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="bg-grid"></div>
  <main class="container">
    <header class="header">
      <div class="logo">
        <span class="logo-icon">✉</span>
        <div>
          <h1>AI Mail Assistant</h1>
          <p class="subtitle">Redacción inteligente con IA local</p>
        </div>
      </div>
    </header>

    <div class="layout">
      <div class="main-col">
        <div class="card">
          <label class="label">¿Qué necesitas comunicar?</label>
          <textarea id="input" placeholder="Ejemplo: Necesito responder a un cliente molesto por un retraso en su pedido..."></textarea>

          <label class="label">Tono del correo</label>
          <div class="tone-grid">
            <button class="tone-btn active" data-tone="formal">🎩 Formal</button>
            <button class="tone-btn" data-tone="amigable">😊 Amigable</button>
            <button class="tone-btn" data-tone="profesional">💼 Profesional</button>
            <button class="tone-btn" data-tone="persuasivo">🎯 Persuasivo</button>
            <button class="tone-btn" data-tone="empático">🤝 Empático</button>
            <button class="tone-btn" data-tone="directo">⚡ Directo</button>
            <button class="tone-btn" data-tone="conciliador">🕊️ Conciliador</button>
            <button class="tone-btn" data-tone="urgente">🚨 Urgente</button>
          </div>

          <button id="generate" class="generate-btn">
            <span id="btn-text">Generar correo con IA</span>
            <span id="btn-loader" class="btn-loader hidden">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </span>
          </button>
        </div>

        <div class="result-card hidden" id="result-card">
          <div class="result-header">
            <span class="result-label">✉ Correo generado</span>
            <div class="result-actions">
              <button id="copy-btn" class="action-btn">📋 Copiar</button>
              <button id="export-txt" class="action-btn">📄 TXT</button>
              <button id="export-pdf" class="action-btn">📕 PDF</button>
            </div>
          </div>
          <section class="result" id="result"></section>
        </div>
      </div>

      <aside class="history-col">
        <div class="history-card">
          <div class="history-header">
            <span class="label">📁 Historial</span>
            <button id="clear-history" class="clear-btn">Limpiar</button>
          </div>
          <div id="history-list" class="history-list">
            <p class="empty-history">Aún no hay correos generados.</p>
          </div>
        </div>
      </aside>
    </div>
  </main>
`;

let selectedTone = "formal";
let history = JSON.parse(localStorage.getItem("mail-history") || "[]");

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\n/g, "<br>");
}

function renderHistory() {
  const list = document.querySelector("#history-list");
  if (history.length === 0) {
    list.innerHTML = `<p class="empty-history">Aún no hay correos generados.</p>`;
    return;
  }
  list.innerHTML = history.map((item, i) => `
    <div class="history-item" data-index="${i}">
      <div class="history-meta">
        <span class="history-tone">${item.tone}</span>
        <span class="history-date">${item.date}</span>
      </div>
      <p class="history-preview">${item.preview}</p>
    </div>
  `).join("");

  list.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const item = history[el.dataset.index];
      const result = document.querySelector("#result");
      const resultCard = document.querySelector("#result-card");
      result.innerHTML = renderMarkdown(item.content);
      resultCard.classList.remove("hidden");
      currentContent = item.content;
    });
  });
}

function saveToHistory(content, tone) {
  const item = {
    tone,
    content,
    preview: content.slice(0, 60).replace(/\n/g, " ") + "...",
    date: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  };
  history.unshift(item);
  if (history.length > 10) history.pop();
  localStorage.setItem("mail-history", JSON.stringify(history));
  renderHistory();
}

document.querySelectorAll(".tone-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tone-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTone = btn.dataset.tone;
  });
});

let currentContent = "";

const button = document.querySelector("#generate");
const btnText = document.querySelector("#btn-text");
const btnLoader = document.querySelector("#btn-loader");
const result = document.querySelector("#result");
const resultCard = document.querySelector("#result-card");

button.addEventListener("click", async () => {
  const input = document.querySelector("#input").value;

  if (!input.trim()) {
    result.innerHTML = "Debes escribir contenido.";
    resultCard.classList.remove("hidden");
    return;
  }

  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");
  button.disabled = true;
  resultCard.classList.add("hidden");

  const prompt = `Actúa como un asistente empresarial experto en comunicación corporativa.
Redacta un correo profesional con tono ${selectedTone} basado en la siguiente situación:

${input}

El correo debe tener: asunto, saludo, cuerpo y despedida. Solo responde con el correo, sin explicaciones adicionales.`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemma:2b", prompt, stream: false }),
    });

    const data = await response.json();
    currentContent = data.response;
    result.innerHTML = renderMarkdown(currentContent);
    resultCard.classList.remove("hidden");
    saveToHistory(currentContent, selectedTone);
  } catch (error) {
    result.innerHTML = "Error conectando con Ollama. Asegúrate de que esté corriendo.";
    resultCard.classList.remove("hidden");
    console.error(error);
  } finally {
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
    button.disabled = false;
  }
});

document.querySelector("#copy-btn").addEventListener("click", () => {
  navigator.clipboard.writeText(currentContent).then(() => {
    const btn = document.querySelector("#copy-btn");
    btn.textContent = "✅ Copiado";
    setTimeout(() => btn.textContent = "📋 Copiar", 2000);
  });
});

document.querySelector("#export-txt").addEventListener("click", () => {
  const blob = new Blob([currentContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `correo-${selectedTone}-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#export-pdf").addEventListener("click", () => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(currentContent, 180);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(lines, 15, 20);
  doc.save(`correo-${selectedTone}-${Date.now()}.pdf`);
});

document.querySelector("#clear-history").addEventListener("click", () => {
  history = [];
  localStorage.removeItem("mail-history");
  renderHistory();
});

renderHistory();
