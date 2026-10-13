
/* ===== ANIMATED CURSOR PARTICLES ===== */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mouse = { x: -1000, y: -1000 };
let particles = [];
let frame = null;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from(
    { length: innerWidth < 600 ? 20 : 45 },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    })
  );
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

    const distance = Math.hypot(p.x - mouse.x, p.y - mouse.y);

    if (distance < 125) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(65,65,65,${1 - distance / 125})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = "#777";
    ctx.fill();
  }

  frame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

if (!reduceMotion.matches) drawParticles();

/* ===== REVEAL ELEMENTS ON SCROLL ===== */
const revealElements = document.querySelectorAll(
  ".experience-item, .skill, .education-card, .certificate"
);

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => element.classList.add("reveal"));
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

/* ===== CHAT WINDOW ===== */
const chatWindow = document.getElementById("chat-window");
const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");

chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("open");
  if (chatWindow.classList.contains("open")) {
    document.getElementById("chat-input").focus();
  }
});

chatClose.addEventListener("click", () => {
  chatWindow.classList.remove("open");
});

/* ===== PORTFOLIO FAQ CHATBOT ===== */
const answers = [
  {
    keys: ["skill", "tool", "technology", "canoe", "tableau", "matlab", "python"],
    text: "Aswani's listed skills include data analytics, automotive testing, C programming, Python, Tableau, Power BI, MATLAB/Simulink, Polyspace, CAN, UDS and ECU testing."
  },
  {
    keys: ["experience", "work", "job", "career", "tata elxsi"],
    text: "The portfolio lists experience at Tata Elxsi in test engineering, data analysis and quality engineering. Please see the Experience section for details."
  },
  {
    keys: ["education", "degree", "study", "college"],
    text: "The portfolio lists a Diploma in Electronics Engineering and a Bachelor of Computer Applications at IGNOU, currently pursuing."
  },
  {
    keys: ["contact", "email", "phone", "linkedin", "hire"],
    text: "Use the Contact section to reach Aswani by email, phone or LinkedIn. You can also download her CV from the page."
  },
  {
    keys: ["project", "projects"],
    text: "The portfolio currently highlights skills and work experience. A dedicated project gallery can be added to showcase dashboards, testing work and other projects."
  },
  {
    keys: ["hello", "hi", "hey"],
    text: "Hello! 👋 I can answer questions about Aswani's skills, work experience, education and contact information."
  }
];

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;

  const userMessage = document.createElement("p");
  userMessage.className = "user-message";
  userMessage.textContent = question;
  chatMessages.appendChild(userMessage);

  const normalized = question.toLowerCase();
  const match = answers.find(item =>
    item.keys.some(key => normalized.includes(key))
  );

  const reply = document.createElement("p");
  reply.className = "bot-message";
  reply.textContent = match
    ? match.text
    : "I can help with questions about skills, tools, experience, education or contact details. Try asking about one of these topics.";

  chatMessages.appendChild(reply);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value = "";
  chatInput.focus();
});
  