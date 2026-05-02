const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const surpriseButton = document.getElementById("surpriseButton");
const pulseButton = document.getElementById("pulseButton");
const saveButton = document.getElementById("saveButton");
const statusText = document.getElementById("statusText");
const letterInput = document.getElementById("letterInput");

const storageKey = "birthday-letter-liziying-21";
const particles = [];
let pulseMode = false;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function loadLetter() {
  const savedLetter = window.localStorage.getItem(storageKey);
  if (savedLetter) {
    letterInput.value = savedLetter;
  }
}

function saveLetter() {
  window.localStorage.setItem(storageKey, letterInput.value);
  statusText.textContent = "这封信已经悄悄存好了，等你把它写成最想送给她的话。";
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBurst(x, y) {
  const colors = ["#ffd76a", "#ff95b2", "#ff8848", "#fff0ae", "#86d7ff", "#ffb37b"];
  for (let index = 0; index < 28; index += 1) {
    const angle = (Math.PI * 2 * index) / 28 + randomBetween(-0.08, 0.08);
    const speed = randomBetween(1.4, 4.6);
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: randomBetween(28, 44),
      radius: randomBetween(1.8, 3.6),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function launchShow() {
  const maxX = Math.max(window.innerWidth - 120, 160);
  const burstCount = window.innerWidth < 640 ? 4 : 6;
  for (let i = 0; i < burstCount; i += 1) {
    createBurst(
      randomBetween(80, maxX),
      randomBetween(70, Math.min(window.innerHeight * 0.42, 280))
    );
  }
  statusText.textContent = "烟花已经替你先说了一遍生日快乐。";
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.x += particle.dx;
    particle.y += particle.dy;
    particle.dy += 0.035;
    particle.life -= 1;

    if (particle.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = Math.max(particle.life / 44, 0);
    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  window.requestAnimationFrame(animate);
}

surpriseButton.addEventListener("click", launchShow);

pulseButton.addEventListener("click", () => {
  pulseMode = !pulseMode;
  document.body.classList.toggle("pulse-mode", pulseMode);
  statusText.textContent = pulseMode
    ? "心动模式已打开，今晚的浪漫指数正在悄悄上升。"
    : "心动模式先收起来，留一点悬念给真正见面的那一刻。";
});

saveButton.addEventListener("click", saveLetter);
letterInput.addEventListener("input", saveLetter);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
loadLetter();
animate();

window.setTimeout(launchShow, 700);
