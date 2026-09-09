/* =========================================================
   HAPPY BIRTHDAY — MODERN CINEMATIC EDITION
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const gift = $("#gift");
const openBtn = $("#openGift");
const surprise = $("#surprise");
const typing = $("#typing");
const celebrateBtn = $("#celebrate");
const music = $("#music");
const musicToggle = $("#musicToggle");
const intro = $("#intro");
const countdown = $("#countdown");

const birthdayMessage =
  "Happy Birthday! ❤️ I hope this beautiful day brings you all the happiness you deserve. May your year be filled with laughter, unforgettable memories, exciting adventures, and dreams coming true. Thank you for being such an amazing person. Keep smiling, keep shining, and never forget how special you are. 🎂✨";

let opened = false;
let typingTimer = null;
let fireworksRunning = false;

/* ---------- Intro ---------- */
let number = 3;
const introTimer = setInterval(() => {
  number--;

  if (number > 0) {
    countdown.textContent = number;
    countdown.style.animation = "none";
    void countdown.offsetWidth;
    countdown.style.animation = "countdownPop .9s ease both";
  } else {
    countdown.textContent = "🎁";
    clearInterval(introTimer);

    setTimeout(() => {
      intro.classList.add("fade-out");
      document.body.classList.add("ready");
    }, 900);
  }
}, 1000);

/* ---------- Gift ---------- */
function openGift() {
  if (opened) return;
  opened = true;

  gift.classList.add("shake");
  setTimeout(() => {
    gift.classList.remove("shake");
    gift.classList.add("open");
    createSparkExplosion();
    createConfetti(220);
    launchFireworkBurst(5);
  }, 450);

  tryStartMusic();

  setTimeout(() => {
    surprise.classList.remove("hidden");
    surprise.classList.add("show");
    surprise.scrollIntoView({ behavior: "smooth", block: "start" });
    typeWriter();
  }, 1100);
}

gift?.addEventListener("click", openGift);
openBtn?.addEventListener("click", openGift);

/* Shake animation added dynamically so it doesn't interfere with floating. */
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  .gift.shake { animation: giftShake .45s ease !important; }
  @keyframes giftShake {
    0%,100% { transform: rotate(0) scale(1); }
    20% { transform: rotate(-7deg) scale(1.02); }
    40% { transform: rotate(7deg) scale(1.02); }
    60% { transform: rotate(-5deg); }
    80% { transform: rotate(5deg); }
  }
`;
document.head.appendChild(shakeStyle);

/* ---------- Typewriter ---------- */
function typeWriter() {
  if (!typing) return;
  clearInterval(typingTimer);
  typing.textContent = "";

  let i = 0;
  typingTimer = setInterval(() => {
    typing.textContent += birthdayMessage[i++];
    if (i >= birthdayMessage.length) clearInterval(typingTimer);
  }, 24);
}

/* ---------- Spark explosion ---------- */
function createSparkExplosion() {
  const rect = gift.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 90; i++) {
    const spark = document.createElement("span");
    spark.className = "sparkle";
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    spark.style.width = `${Math.random() * 5 + 3}px`;
    spark.style.height = spark.style.width;
    spark.style.background = `hsl(${Math.random() * 60 + 25}, 100%, 70%)`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 260;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    spark.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
      ],
      { duration: 1000 + Math.random() * 500, easing: "cubic-bezier(.1,.7,.2,1)" }
    );

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1600);
  }
}

/* ---------- Confetti ---------- */
const confettiCanvas = $("#confetti");
const confettiCtx = confettiCanvas?.getContext("2d");
let confettiPieces = [];
let confettiActive = false;

function resizeCanvas(canvas) {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createConfetti(amount = 180) {
  if (!confettiCtx) return;

  confettiPieces = Array.from({ length: amount }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight,
    w: Math.random() * 8 + 4,
    h: Math.random() * 13 + 5,
    speed: Math.random() * 3 + 2,
    drift: Math.random() * 1.4 - .7,
    rotation: Math.random() * Math.PI,
    spin: Math.random() * .16 - .08,
    color: `hsl(${Math.random() * 360}, 95%, 65%)`
  }));

  confettiActive = true;
  animateConfetti();
}

function animateConfetti() {
  if (!confettiActive || !confettiCtx) return;

  confettiCtx.clearRect(0, 0, innerWidth, innerHeight);

  confettiPieces.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.spin;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  confettiPieces = confettiPieces.filter(p => p.y < innerHeight + 30);

  if (confettiPieces.length) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

/* ---------- Fireworks ---------- */
const fireCanvas = $("#fireworks");
const fireCtx = fireCanvas?.getContext("2d");
let fireworks = [];

function launchFireworkBurst(count = 1) {
  if (!fireCtx) return;
  fireworksRunning = true;

  for (let n = 0; n < count; n++) {
    const x = innerWidth * (.15 + Math.random() * .7);
    const y = innerHeight * (.12 + Math.random() * .38);
    const hue = Math.random() * 360;

    for (let i = 0; i < 45; i++) {
      const angle = (Math.PI * 2 * i) / 45;
      const speed = 1.5 + Math.random() * 4.2;

      fireworks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: `hsl(${hue}, 100%, 68%)`
      });
    }
  }
}

function animateFireworks() {
  if (!fireCtx) return;

  fireCtx.clearRect(0, 0, innerWidth, innerHeight);

  fireworks.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += .025;
    p.life -= .012;

    fireCtx.globalAlpha = Math.max(0, p.life);
    fireCtx.fillStyle = p.color;
    fireCtx.beginPath();
    fireCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    fireCtx.fill();
  });

  fireCtx.globalAlpha = 1;
  fireworks = fireworks.filter(p => p.life > 0);

  if (fireworksRunning && Math.random() < .006 && opened) {
    launchFireworkBurst(1);
  }

  requestAnimationFrame(animateFireworks);
}

/* ---------- Floating sparkles ---------- */
function createFloatingSparkle() {
  const el = document.createElement("span");
  el.className = "sparkle";
  el.style.left = `${Math.random() * 100}vw`;
  el.style.top = `${70 + Math.random() * 35}vh`;
  el.style.animationDuration = `${2.5 + Math.random() * 3}s`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

setInterval(createFloatingSparkle, 450);

/* ---------- Music ---------- */
function tryStartMusic() {
  if (!music) return;
  music.volume = .35;
  music.play()
    .then(() => { musicToggle.textContent = "🔊"; })
    .catch(() => {
      musicToggle.textContent = "🔇";
    });
}

musicToggle?.addEventListener("click", async () => {
  if (!music) return;

  if (music.paused) {
    try {
      await music.play();
      musicToggle.textContent = "🔊";
    } catch {
      musicToggle.textContent = "🔇";
    }
  } else {
    music.pause();
    musicToggle.textContent = "🔇";
  }
});

/* ---------- Gallery lightbox ---------- */
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
const closeLightbox = $("#closeLightbox");

$$(".polaroid").forEach(card => {
  card.addEventListener("click", () => {
    const img = card.dataset.full;
    const caption = card.dataset.caption || "";

    lightboxImage.src = img;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function hideLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeLightbox?.addEventListener("click", hideLightbox);
lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) hideLightbox();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") hideLightbox();
});

/* ---------- Celebrate again ---------- */
celebrateBtn?.addEventListener("click", () => {
  createConfetti(260);
  launchFireworkBurst(7);

  const card = $(".surprise-card");
  card.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.015)" },
      { transform: "scale(1)" }
    ],
    { duration: 600, easing: "ease-out" }
  );

  tryStartMusic();
});

/* ---------- Resize ---------- */
function resizeAll() {
  resizeCanvas(confettiCanvas);
  resizeCanvas(fireCanvas);
}
window.addEventListener("resize", resizeAll);
resizeAll();
animateFireworks();
