const state = {
  xp: Number(localStorage.getItem("xp")) || 0,
  achievements: new Set(JSON.parse(localStorage.getItem("achievements") || "[]")),
};

const header = document.getElementById("header");
const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const xpFill = document.getElementById("xpFill");
const achievementsEl = document.getElementById("achievements");
const feedback = document.getElementById("challengeFeedback");
const easterEgg = document.getElementById("easterEgg");
const fakeTerminal = document.getElementById("fakeTerminal");

function updateProfile() {
  const level = Math.floor(state.xp / 100) + 1;
  const xpCurrent = state.xp % 100;
  xpEl.textContent = xpCurrent;
  levelEl.textContent = level;
  xpFill.style.width = `${xpCurrent}%`;
  achievementsEl.textContent = state.achievements.size
    ? Array.from(state.achievements).join(", ")
    : "Nenhuma";

  localStorage.setItem("xp", String(state.xp));
  localStorage.setItem("achievements", JSON.stringify(Array.from(state.achievements)));
}

function addXP(amount, achievement) {
  state.xp += amount;
  if (achievement) state.achievements.add(achievement);
  updateProfile();
}

document.getElementById("enterSystem").addEventListener("click", () => {
  addXP(10, "Primeiro acesso");
  window.scrollTo({ top: document.getElementById("jogos").offsetTop - 60, behavior: "smooth" });
});

for (const button of document.querySelectorAll(".play-btn")) {
  button.addEventListener("click", () => {
    addXP(Number(button.dataset.xp), `Jogou ${button.parentElement.querySelector("h3").textContent}`);
    button.textContent = "Sessão iniciada";
    setTimeout(() => (button.textContent = "Jogar"), 1200);
  });
}

document.getElementById("submitAnswer").addEventListener("click", () => {
  const value = document.getElementById("challengeInput").value.trim().toLowerCase();
  if (value === "neonroot") {
    feedback.className = "feedback ok";
    feedback.textContent = "Acesso permitido. +40 XP";
    addXP(40, "Desafio 01 resolvido");
    easterEgg.classList.remove("hidden");
  } else {
    feedback.className = "feedback fail";
    feedback.textContent = "Resposta incorreta. Tente novamente.";
  }
});

const cmdSamples = [
  "scan --ports",
  "decrypt --packet alpha",
  "trace --ghost-signal",
  "authorize --user operator_01",
];
document.getElementById("runCommand").addEventListener("click", () => {
  const cmd = cmdSamples[Math.floor(Math.random() * cmdSamples.length)];
  const result = Math.random() > 0.3 ? "STATUS: OK" : "STATUS: WARNING";
  fakeTerminal.textContent += `> ${cmd}\n${result}\n`;
  fakeTerminal.scrollTop = fakeTerminal.scrollHeight;
  addXP(8, "Ferramenta terminal usada");
});

document.getElementById("generateName").addEventListener("click", () => {
  const names = ["ZeroSpecter", "ByteHunter", "NeonCipher", "PulseShade", "QuantumFox"];
  const selected = names[Math.floor(Math.random() * names.length)];
  document.getElementById("codename").textContent = `Codinome: ${selected}`;
  addXP(6, "Gerou codinome");
});

document.getElementById("simulateState").addEventListener("click", () => {
  const states = ["Estado: Estável", "Estado: Firewall em alerta", "Estado: Intrusão simulada", "Estado: Modo stealth"]; 
  document.getElementById("systemState").textContent = states[Math.floor(Math.random() * states.length)];
  addXP(6, "Simulou sistema");
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

for (const anchor of document.querySelectorAll('a[href^="#"]')) {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");
const chars = "アァイィウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let fontSize = 14;
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffcc";
  ctx.font = `${fontSize}px Share Tech Mono`;

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
setInterval(drawMatrix, 45);
updateProfile();

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let buffer = [];
window.addEventListener("keydown", (event) => {
  buffer.push(event.key);
  buffer = buffer.slice(-konami.length);
  if (buffer.join("|").toLowerCase() === konami.join("|").toLowerCase()) {
    easterEgg.classList.remove("hidden");
    addXP(50, "Easter egg encontrado");
  }
});
