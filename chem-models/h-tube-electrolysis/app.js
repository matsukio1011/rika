if (new URLSearchParams(window.location.search).get("embed") === "1") {
  document.documentElement.classList.add("is-embedded");
}

const state = {
  powerOn: false,
  progress: 0, // 0 to 100
  cathodeSide: "left", // "left" or "right"
  showModels: true,
  quizMode: false,
  bubbles: [],
  lastTime: null
};

// Geometry constants for SVG tubes
const TUBE_TOP_Y = 70;
const TUBE_BOTTOM_Y = 365;
const TUBE_HEIGHT = TUBE_BOTTOM_Y - TUBE_TOP_Y; // 295
const MAX_H2_DROP = 160; // 20 mL equivalent
const MAX_O2_DROP = 80;  // 10 mL equivalent

// DOM Elements
const powerBtn = document.getElementById("power-btn");
const powerBtnText = document.getElementById("power-btn-text");
const swapPolarityBtn = document.getElementById("swap-polarity-btn");
const resetBtn = document.getElementById("reset-btn");
const modelToggle = document.getElementById("model-toggle");
const quizBtn = document.getElementById("quiz-btn");
const progressSlider = document.getElementById("progress-slider");
const progressPct = document.getElementById("progress-pct");
const testLeftBtn = document.getElementById("test-left-btn");
const testRightBtn = document.getElementById("test-right-btn");
const testResultCard = document.getElementById("test-result-card");
const testResultText = document.getElementById("test-result-text");

const leftGasBg = document.getElementById("left-gas-bg");
const leftWater = document.getElementById("left-water");
const leftMeniscus = document.getElementById("left-meniscus");
const leftBubblesG = document.getElementById("left-bubbles");
const leftMoleculesG = document.getElementById("left-molecules");

const rightGasBg = document.getElementById("right-gas-bg");
const rightWater = document.getElementById("right-water");
const rightMeniscus = document.getElementById("right-meniscus");
const rightBubblesG = document.getElementById("right-bubbles");
const rightMoleculesG = document.getElementById("right-molecules");

const wireLeft = document.getElementById("wire-left");
const wireRight = document.getElementById("wire-right");
const termLeftSign = document.getElementById("term-left-sign");
const termRightSign = document.getElementById("term-right-sign");
const psuLed = document.getElementById("psu-led");
const psuStatusText = document.getElementById("psu-status-text");

const leftPoleLabel = document.getElementById("left-pole-label");
const leftGasName = document.getElementById("left-gas-name");
const leftVolText = document.getElementById("left-vol-text");

const rightPoleLabel = document.getElementById("right-pole-label");
const rightGasName = document.getElementById("right-gas-name");
const rightVolText = document.getElementById("right-vol-text");

const ratioText = document.getElementById("ratio-text");
const testEffectLayer = document.getElementById("test-effect-layer");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeLabelEl = document.getElementById("theme-label");
const fullscreenToggleBtn = document.getElementById("fullscreen-toggle");
const fullscreenLabelEl = document.getElementById("fullscreen-label");

/* ================= Theme & Fullscreen ================= */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("htube-theme", theme);
  themeLabelEl.textContent = theme === "dark" ? "ライト" : "ダーク";
}

applyTheme(localStorage.getItem("htube-theme") || "light");

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

fullscreenToggleBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn("Fullscreen failed:", err);
  }
});

document.addEventListener("fullscreenchange", () => {
  const isFs = Boolean(document.fullscreenElement);
  document.body.classList.toggle("is-fullscreen", isFs);
  fullscreenLabelEl.textContent = isFs ? "元に戻す" : "全画面";
});

/* ================= Scale Ticks ================= */
function renderScaleTicks() {
  const ticksG = document.getElementById("scale-ticks");
  ticksG.innerHTML = "";

  // Draw 10 graduation marks down each tube
  for (let i = 1; i <= 9; i++) {
    const y = TUBE_TOP_Y + i * 20;
    const isMajor = i % 2 === 0;
    const len = isMajor ? 14 : 8;

    // Left tube ticks
    const lLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lLine.setAttribute("x1", 251 - len);
    lLine.setAttribute("y1", y);
    lLine.setAttribute("x2", 251);
    lLine.setAttribute("y2", y);
    ticksG.appendChild(lLine);

    // Right tube ticks
    const rLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    rLine.setAttribute("x1", 509);
    rLine.setAttribute("y1", y);
    rLine.setAttribute("x2", 509 + len);
    rLine.setAttribute("y2", y);
    ticksG.appendChild(rLine);

    if (isMajor) {
      const vol = (i * 2.5).toFixed(0);
      const lTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      lTxt.setAttribute("x", 256);
      lTxt.setAttribute("y", y + 3);
      lTxt.textContent = `${vol}`;
      ticksG.appendChild(lTxt);

      const rTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      rTxt.setAttribute("x", 504);
      rTxt.setAttribute("y", y + 3);
      rTxt.setAttribute("text-anchor", "end");
      rTxt.textContent = `${vol}`;
      ticksG.appendChild(rTxt);
    }
  }
}

/* ================= Molecule Models inside Tubes ================= */
function drawMoleculeCluster(container, type, cx, cy) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  if (type === "H2") {
    [-6, 6].forEach((dx) => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx + dx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", 6.5);
      c.setAttribute("fill", "#ffffff");
      c.setAttribute("stroke", "#1e293b");
      c.setAttribute("stroke-width", "1.4");
      g.appendChild(c);
    });
  } else {
    [-7.5, 7.5].forEach((dx) => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx + dx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", 8);
      c.setAttribute("fill", "#ef4444");
      c.setAttribute("stroke", "#7f1d1d");
      c.setAttribute("stroke-width", "1.4");
      g.appendChild(c);
    });
  }
  container.appendChild(g);
}

function renderMolecules(leftType, rightType, leftGasH, rightGasH) {
  leftMoleculesG.innerHTML = "";
  rightMoleculesG.innerHTML = "";
  if (!state.showModels) return;

  const pct = state.progress / 100;
  // Max 8 H2 molecules (2x4) and 4 O2 molecules (2x2) -> clear 2:1 ratio!
  const leftCount = leftType === "H2" ? Math.floor(pct * 8) : Math.floor(pct * 4);
  const rightCount = rightType === "H2" ? Math.floor(pct * 8) : Math.floor(pct * 4);

  for (let i = 0; i < leftCount; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 196 + col * 34;
    const cy = TUBE_TOP_Y + 18 + row * 28;
    if (cy < TUBE_TOP_Y + leftGasH - 8) {
      drawMoleculeCluster(leftMoleculesG, leftType, cx, cy);
    }
  }

  for (let i = 0; i < rightCount; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 530 + col * 34;
    const cy = TUBE_TOP_Y + 18 + row * 28;
    if (cy < TUBE_TOP_Y + rightGasH - 8) {
      drawMoleculeCluster(rightMoleculesG, rightType, cx, cy);
    }
  }
}

/* ================= Render Apparatus State ================= */
function renderApparatus() {
  const isLeftCathode = state.cathodeSide === "left";
  const leftType = isLeftCathode ? "H2" : "O2";
  const rightType = isLeftCathode ? "O2" : "H2";

  const frac = state.progress / 100;
  const leftDrop = frac * (isLeftCathode ? MAX_H2_DROP : MAX_O2_DROP);
  const rightDrop = frac * (isLeftCathode ? MAX_O2_DROP : MAX_H2_DROP);

  // Left tube gas & water
  leftGasBg.setAttribute("height", leftDrop);
  leftGasBg.setAttribute("class", leftType === "H2" ? "gas-h2" : "gas-o2");
  leftWater.setAttribute("y", TUBE_TOP_Y + leftDrop);
  leftWater.setAttribute("height", TUBE_HEIGHT - leftDrop);
  leftMeniscus.setAttribute("y1", TUBE_TOP_Y + leftDrop);
  leftMeniscus.setAttribute("y2", TUBE_TOP_Y + leftDrop);

  // Right tube gas & water
  rightGasBg.setAttribute("height", rightDrop);
  rightGasBg.setAttribute("class", rightType === "H2" ? "gas-h2" : "gas-o2");
  rightWater.setAttribute("y", TUBE_TOP_Y + rightDrop);
  rightWater.setAttribute("height", TUBE_HEIGHT - rightDrop);
  rightMeniscus.setAttribute("y1", TUBE_TOP_Y + rightDrop);
  rightMeniscus.setAttribute("y2", TUBE_TOP_Y + rightDrop);

  // Wires & PSU polarity
  wireLeft.setAttribute("class", isLeftCathode ? "wire-neg" : "wire-pos");
  wireRight.setAttribute("class", isLeftCathode ? "wire-pos" : "wire-neg");
  termLeftSign.textContent = isLeftCathode ? "−" : "＋";
  termLeftSign.setAttribute("class", `term-sign ${isLeftCathode ? "neg" : "pos"}`);
  termRightSign.textContent = isLeftCathode ? "＋" : "−";
  termRightSign.setAttribute("class", `term-sign ${isLeftCathode ? "pos" : "neg"}`);

  // Side Labels
  leftPoleLabel.textContent = isLeftCathode ? "陰極（−）" : "陽極（＋）";
  leftPoleLabel.setAttribute("class", `pole-badge ${isLeftCathode ? "neg" : "pos"}`);
  rightPoleLabel.textContent = isLeftCathode ? "陽極（＋）" : "陰極（−）";
  rightPoleLabel.setAttribute("class", `pole-badge ${isLeftCathode ? "pos" : "neg"}`);

  if (state.quizMode) {
    leftGasName.textContent = "？？？";
    rightGasName.textContent = "？？？";
    ratioText.textContent = "体積比　？ ： ？";
  } else {
    leftGasName.textContent = leftType === "H2" ? "水素 (H₂)" : "酸素 (O₂)";
    rightGasName.textContent = rightType === "H2" ? "水素 (H₂)" : "酸素 (O₂)";
    ratioText.textContent = "体積比　水素 2 ： 酸素 1";
  }

  const leftVol = (frac * (isLeftCathode ? 20.0 : 10.0)).toFixed(1);
  const rightVol = (frac * (isLeftCathode ? 10.0 : 20.0)).toFixed(1);
  leftVolText.textContent = `発生量: ${leftVol} mL`;
  rightVolText.textContent = `発生量: ${rightVol} mL`;

  // Power Supply Status
  powerBtn.classList.toggle("is-on", state.powerOn);
  powerBtnText.textContent = state.powerOn ? "電源 OFF" : "電源 ON";
  psuLed.classList.toggle("is-on", state.powerOn);
  psuStatusText.textContent = state.powerOn ? "ON (6V 通電中)" : "OFF (0V)";

  // Progress & Test buttons
  progressSlider.value = Math.round(state.progress);
  progressPct.textContent = `${Math.round(state.progress)}%`;
  const canTest = state.progress >= 15;
  testLeftBtn.disabled = !canTest;
  testRightBtn.disabled = !canTest;

  renderMolecules(leftType, rightType, leftDrop, rightDrop);
}

/* ================= Bubble & Electrolysis Loop ================= */
function spawnBubble(side, meniscusY) {
  const xBase = side === "left" ? 213 : 547;
  state.bubbles.push({
    side,
    x: xBase + (Math.random() - 0.5) * 26,
    y: 316,
    r: 2 + Math.random() * 2.5,
    speed: 65 + Math.random() * 45,
    minY: meniscusY + 4
  });
}

function renderBubbles() {
  leftBubblesG.innerHTML = "";
  rightBubblesG.innerHTML = "";

  state.bubbles.forEach((b) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", b.x);
    circle.setAttribute("cy", b.y);
    circle.setAttribute("r", b.r);
    circle.setAttribute("class", "bubble");
    (b.side === "left" ? leftBubblesG : rightBubblesG).appendChild(circle);
  });
}

function tick(now) {
  if (state.lastTime === null) state.lastTime = now;
  const dt = Math.min((now - state.lastTime) / 1000, 0.1);
  state.lastTime = now;

  if (state.powerOn) {
    if (state.progress < 100) {
      state.progress = Math.min(100, state.progress + dt * 10); // ~10s full run
      renderApparatus();
    } else {
      state.powerOn = false;
      renderApparatus();
    }

    const isLeftCathode = state.cathodeSide === "left";
    const frac = state.progress / 100;
    const leftMeniscusY = TUBE_TOP_Y + frac * (isLeftCathode ? MAX_H2_DROP : MAX_O2_DROP);
    const rightMeniscusY = TUBE_TOP_Y + frac * (isLeftCathode ? MAX_O2_DROP : MAX_H2_DROP);

    // Cathode spawns 2x more bubbles
    if (Math.random() < (isLeftCathode ? 0.45 : 0.22)) {
      spawnBubble("left", leftMeniscusY);
    }
    if (Math.random() < (isLeftCathode ? 0.22 : 0.45)) {
      spawnBubble("right", rightMeniscusY);
    }
  }

  // Update existing bubbles
  if (state.bubbles.length > 0) {
    state.bubbles = state.bubbles.filter((b) => {
      b.y -= b.speed * dt;
      return b.y > b.minY;
    });
    renderBubbles();
  }

  requestAnimationFrame(tick);
}

/* ================= Gas Verification Tests ================= */
let sharedAudioCtx = null;

function playHydrogenPopSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume();
    }

    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;

    // 1. Resonant "pop" body (tube resonance pitch drop)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(105, now + 0.13);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.75, now + 0.006);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    // 2. Short combustion burst noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.07);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(1.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.075);
  } catch (_) {
    // Ignore audio errors if blocked by browser policy
  }
}

function runGasTest(side) {
  const isLeftCathode = state.cathodeSide === "left";
  const gasType =
    (side === "left" && isLeftCathode) || (side === "right" && !isLeftCathode)
      ? "H2"
      : "O2";

  const cx = side === "left" ? 213 : 547;
  testEffectLayer.innerHTML = "";

  if (gasType === "H2") {
    playHydrogenPopSound();
    testResultCard.className = "result-card is-h2";
    testResultText.textContent =
      "🔥 「ポンッ！」と音を立てて燃えました！ 発生した気体は【水素（H₂）】です。";

    testEffectLayer.innerHTML = `
      <g transform="translate(${cx}, 46)">
        <circle r="24" fill="#f97316" opacity="0.35"></circle>
        <text y="-28" text-anchor="middle" fill="#ea580c" font-size="18" font-weight="900">ポンッ！</text>
        <path d="M0 10 C-10 -2 -6 -16 0 -22 C6 -16 10 -2 0 10 Z" fill="#f59e0b" />
        <path d="M0 8 C-5 0 -3 -10 0 -14 C3 -10 5 0 0 8 Z" fill="#fef08a" />
      </g>
    `;
  } else {
    testResultCard.className = "result-card is-o2";
    testResultText.textContent =
      "✨ 火のついた線香が激しく炎を出して燃えました！ 発生した気体は【酸素（O₂）】です。";

    testEffectLayer.innerHTML = `
      <g transform="translate(${cx}, 46)">
        <circle r="26" fill="#ef4444" opacity="0.28"></circle>
        <text y="-28" text-anchor="middle" fill="#dc2626" font-size="16" font-weight="900">激しく燃える！</text>
        <line x1="0" y1="18" x2="0" y2="-4" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
        <path d="M0 -4 C-11 -16 -6 -28 0 -34 C6 -28 11 -16 0 -4 Z" fill="#ef4444" />
        <path d="M0 -6 C-5 -14 -3 -22 0 -26 C3 -22 5 -14 0 -6 Z" fill="#fde047" />
      </g>
    `;
  }

  setTimeout(() => {
    testEffectLayer.innerHTML = "";
  }, 2400);
}

/* ================= Event Listeners ================= */
powerBtn.addEventListener("click", () => {
  if (state.progress >= 100 && !state.powerOn) {
    state.progress = 0;
  }
  state.powerOn = !state.powerOn;
  renderApparatus();
});

swapPolarityBtn.addEventListener("click", () => {
  state.cathodeSide = state.cathodeSide === "left" ? "right" : "left";
  testEffectLayer.innerHTML = "";
  renderApparatus();
});

resetBtn.addEventListener("click", () => {
  state.powerOn = false;
  state.progress = 0;
  state.bubbles = [];
  testEffectLayer.innerHTML = "";
  testResultCard.className = "result-card";
  testResultText.textContent =
    "電源をONにして気体を集めたあと、下の「気体を確かめる」ボタンを押してください。";
  renderBubbles();
  renderApparatus();
});

modelToggle.addEventListener("change", (e) => {
  state.showModels = e.target.checked;
  renderApparatus();
});

quizBtn.addEventListener("click", () => {
  state.quizMode = !state.quizMode;
  quizBtn.classList.toggle("active", state.quizMode);
  renderApparatus();
});

progressSlider.addEventListener("input", (e) => {
  state.powerOn = false;
  state.progress = Number(e.target.value);
  renderApparatus();
});

const illustrationModal = document.getElementById("illustration-modal");
const illustrationCloseBtn = document.getElementById("illustration-close-btn");
let leftTestStreak = 0;
let leftTestStreakTimer = null;

function resetLeftTestStreak() {
  leftTestStreak = 0;
  if (leftTestStreakTimer) {
    clearTimeout(leftTestStreakTimer);
    leftTestStreakTimer = null;
  }
}

function openIllustrationModal() {
  illustrationModal.classList.remove("hidden");
}

function closeIllustrationModal() {
  illustrationModal.classList.add("hidden");
}

illustrationModal.addEventListener("click", closeIllustrationModal);
illustrationCloseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeIllustrationModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !illustrationModal.classList.contains("hidden")) {
    closeIllustrationModal();
  }
});

testLeftBtn.addEventListener("click", () => {
  runGasTest("left");
  leftTestStreak += 1;
  if (leftTestStreakTimer) clearTimeout(leftTestStreakTimer);

  if (leftTestStreak >= 3) {
    resetLeftTestStreak();
    openIllustrationModal();
  } else {
    leftTestStreakTimer = setTimeout(resetLeftTestStreak, 1800);
  }
});

testRightBtn.addEventListener("click", () => {
  resetLeftTestStreak();
  runGasTest("right");
});

// Explanation Tabs
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== `tab-${target}`);
    });
  });
});

/* ================= Initialize ================= */
renderScaleTicks();
renderApparatus();
requestAnimationFrame(tick);

/* ================= Top-Level Mode Tabs ================= */
const viewSim = document.getElementById("view-sim");
const viewSetup = document.getElementById("view-setup");

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".mode-tab").forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });
    const mode = tab.dataset.mode;
    viewSim.classList.toggle("hidden", mode !== "sim");
    viewSetup.classList.toggle("hidden", mode !== "setup");
    quizBtn.style.display = mode === "sim" ? "" : "none";
  });
});

/* ================= Interactive Setup & Usage Simulator ================= */
const setupState = {
  step: 0,
  cocks: { left: true, right: true, res: true }, // true = open, false = closed
  filled: false,
  powerOn: false,
  gasAmount: 0, // 0 to 1 (electrolysis generated gas)
  tested: false,
  resOffset: 0, // -60 (low) to +60 (high)
  leftDrop: 232, // current gas/air column height in left tube (0 = full at y=102)
  rightDrop: 232, // current gas/air column height in right tube (0 = full at y=102)
  resH: 0, // current water depth in reservoir cup
  sealedLeft: { drop: 0, refOffset: 0 }, // trapped air/gas when left cock is closed
  sealedRight: { drop: 0, refOffset: 0 }, // trapped air/gas when right cock is closed
  lockedResH: 24, // reservoir water depth locked when res cock is closed
  warn: null,
  heightNote: null
};

const SETUP_STEPS = [
  {
    badge: "STEP 1 / 6",
    text: "まず、ゴム栓の上部のピンチコック（2か所）と液だめのピンチコックを全て「開」にします。空気が抜ける道をつくるためです。",
    apply: () => {
      setupState.cocks = { left: true, right: true, res: true };
      setupState.filled = false;
      setupState.powerOn = false;
      setupState.gasAmount = 0;
      setupState.tested = false;
      setupState.resOffset = 0;
      setupState.leftDrop = 232;
      setupState.rightDrop = 232;
      setupState.resH = 0;
      setupState.sealedLeft = { drop: 0, refOffset: 0 };
      setupState.sealedRight = { drop: 0, refOffset: 0 };
      setupState.lockedResH = 24;
    }
  },
  {
    badge: "STEP 2 / 6",
    text: "液だめを高くして水溶液を注ぎ、H字管内に空気が残らないように上まで満たします（連通管の原理で液だめと同じ高さまで上がります）。",
    apply: () => {
      setupState.cocks = { left: true, right: true, res: true };
      setupState.filled = true;
      setupState.powerOn = false;
      setupState.gasAmount = 0;
      setupState.tested = false;
      setupState.resOffset = 55;
      setupState.leftDrop = 0;
      setupState.rightDrop = 0;
      setupState.resH = 24;
      setupState.sealedLeft = { drop: 0, refOffset: 55 };
      setupState.sealedRight = { drop: 0, refOffset: 55 };
      setupState.lockedResH = 24;
    }
  },
  {
    badge: "STEP 3 / 6",
    text: "ゴム栓の上部のピンチコック（左右）を「閉」にします。すると液だめを元の高さに戻しても、H字管内の水は下がらず満たされたままになります。",
    apply: () => {
      setupState.cocks = { left: false, right: false, res: true };
      setupState.filled = true;
      setupState.powerOn = false;
      setupState.gasAmount = 0;
      setupState.tested = false;
      setupState.resOffset = 0;
      setupState.leftDrop = 0;
      setupState.rightDrop = 0;
      setupState.resH = 24;
      setupState.sealedLeft = { drop: 0, refOffset: 0 };
      setupState.sealedRight = { drop: 0, refOffset: 0 };
      setupState.lockedResH = 24;
    }
  },
  {
    badge: "STEP 4 / 6",
    text: "電極と電源装置をつないで電流を流します。気体がたまると、押し出された水溶液が液だめへ移動して液だめの水面が上がります。",
    apply: () => {
      setupState.cocks = { left: false, right: false, res: true };
      setupState.filled = true;
      setupState.powerOn = true;
      setupState.gasAmount = 0.85;
      setupState.tested = false;
      setupState.resOffset = 0;
      setupState.sealedLeft = { drop: 0.85 * 116, refOffset: 0 };
      setupState.sealedRight = { drop: 0.85 * 58, refOffset: 0 };
    }
  },
  {
    badge: "STEP 5 / 6",
    text: "十分に気体がたまったら、電源を切ります（OFFにします）。",
    apply: () => {
      setupState.cocks = { left: false, right: false, res: true };
      setupState.filled = true;
      setupState.powerOn = false;
      setupState.gasAmount = 0.85;
      setupState.tested = false;
      setupState.resOffset = 0;
      setupState.sealedLeft = { drop: 0.85 * 116, refOffset: 0 };
      setupState.sealedRight = { drop: 0.85 * 58, refOffset: 0 };
    }
  },
  {
    badge: "STEP 6 / 6",
    text: "液だめのピンチコックを「閉」にしてから、上部のコックを開いてマッチや線香で気体の確認を行います！（※開いたままだと液だめの水圧で中身が吹き出します）",
    apply: () => {
      setupState.cocks = { left: true, right: true, res: false };
      setupState.filled = true;
      setupState.powerOn = false;
      setupState.gasAmount = 0.85;
      setupState.tested = true;
      setupState.resOffset = 0;
      setupState.leftDrop = 0.85 * 116;
      setupState.rightDrop = 0.85 * 58;
      setupState.lockedResH = Math.min(64, 24 + (setupState.leftDrop + setupState.rightDrop) * 0.18);
      setupState.resH = setupState.lockedResH;
    }
  }
];

const setupLeftWater = document.getElementById("setup-left-water");
const setupRightWater = document.getElementById("setup-right-water");
const setupBridgeWater = document.getElementById("setup-bridge-water");
const setupResWater = document.getElementById("setup-res-water");
const setupTubeWater = document.getElementById("setup-tube-water");
const setupRubberTube = document.getElementById("setup-rubber-tube");
const setupResAssembly = document.getElementById("setup-res-assembly");
const setupLevelGuide = document.getElementById("setup-level-guide");
const resHeightSlider = document.getElementById("res-height-slider");
const resHeightReset = document.getElementById("res-height-reset");
const setupPsuLed = document.getElementById("setup-psu-led");
const setupPsuStatus = document.getElementById("setup-psu-status");
const setupStepBadge = document.getElementById("setup-step-badge");
const setupFeedbackCard = document.getElementById("setup-feedback-card");
const setupFeedbackText = document.getElementById("setup-feedback-text");
const setupTestEffect = document.getElementById("setup-test-effect");
const setupPowerBtn = document.getElementById("setup-power-btn");
const setupPowerText = document.getElementById("setup-power-text");
const stepPrevBtn = document.getElementById("step-prev-btn");
const stepNextBtn = document.getElementById("step-next-btn");

function updateCockVisual(id, isOpen) {
  const el = document.getElementById(id);
  el.classList.toggle("is-open", isOpen);
  el.classList.toggle("is-closed", !isOpen);
  el.querySelector(".cock-text").textContent = isOpen ? "開" : "閉";
}

function recomputeSetupPhysics() {
  if (!setupState.filled) {
    setupState.leftDrop = 232;
    setupState.rightDrop = 232;
    setupState.resH = 0;
    return;
  }

  if (setupState.cocks.res) {
    // Reservoir cock is OPEN: H-tube communicates with the reservoir cup
    if (!setupState.cocks.left) {
      if (setupState.sealedLeft.drop <= 0.5) {
        setupState.leftDrop = 0;
      } else {
        const deltaOffset = setupState.resOffset - setupState.sealedLeft.refOffset;
        setupState.leftDrop = Math.max(6, Math.min(188, setupState.sealedLeft.drop - deltaOffset * 0.25));
      }
    }
    if (!setupState.cocks.right) {
      if (setupState.sealedRight.drop <= 0.5) {
        setupState.rightDrop = 0;
      } else {
        const deltaOffset = setupState.resOffset - setupState.sealedRight.refOffset;
        setupState.rightDrop = Math.max(6, Math.min(188, setupState.sealedRight.drop - deltaOffset * 0.25));
      }
    }

    // Iteratively solve coupled reservoir water depth (resH) and open-tube communicating vessel level
    let lDrop = setupState.leftDrop;
    let rDrop = setupState.rightDrop;
    let rH = setupState.resH;
    for (let i = 0; i < 12; i++) {
      rH = Math.max(14, Math.min(64, 24 + (lDrop + rDrop) * 0.18));
      const resSurfaceY = 180 - setupState.resOffset - rH;
      const openDrop = Math.max(0, Math.min(188, resSurfaceY - 102));
      if (setupState.cocks.left) lDrop = openDrop;
      if (setupState.cocks.right) rDrop = openDrop;
    }
    rH = Math.max(14, Math.min(64, 24 + (lDrop + rDrop) * 0.18));

    setupState.leftDrop = lDrop;
    setupState.rightDrop = rDrop;
    setupState.resH = rH;
    setupState.lockedResH = rH;
  } else {
    // Reservoir cock is CLOSED: reservoir cup is isolated from H-tube
    setupState.resH = setupState.lockedResH;

    // If BOTH top cocks are open while reservoir cock is closed, left & right form an open U-tube and equalize
    if (setupState.cocks.left && setupState.cocks.right && !setupState.tested) {
      const avgDrop = (setupState.leftDrop + setupState.rightDrop) / 2;
      setupState.leftDrop = avgDrop;
      setupState.rightDrop = avgDrop;
    }
  }
}

function describePhysicsNote() {
  if (!setupState.filled) {
    return "まだ水溶液が入っていません。「💧 水溶液を注ぐ」で水を入れると、ピンチコックと液だめの高さに応じた水面の変化が見られます。";
  }

  const { left, right, res } = setupState.cocks;

  if (!res) {
    if (left && right) {
      return "液だめのコックは「閉」ですが、左右の上部コックが両方「開」でH字管の横管でつながっているため、左右の管どうしで水面が同じ高さにそろいます（U字管の連通管）。液だめを上下してもH字管の水面は動きません。";
    }
    if (left !== right) {
      const openSide = left ? "左" : "右";
      const closedSide = left ? "右" : "左";
      return `液だめのコックと${closedSide}のコックが「閉」のため水の出入りがなく、${openSide}のコックを「開」にしても液だめの水圧で吹き出さずに水面が保たれます（気体を安全に確認できる状態）。`;
    }
    return "3つのピンチコックがすべて「閉」で密閉されているため、液だめを上下に動かしてもH字管内の水面はまったく動きません。";
  }

  // res is OPEN
  if (left && right) {
    if (setupState.leftDrop <= 0.5 && setupState.rightDrop <= 0.5) {
      return "3つのコックがすべて「開」で、液だめの水面がH字管の上端（ゴム栓）より高いため、左右とも上まで満水になっています。";
    }
    return "3つのコックがすべて「開」で大気圧につながっているため、左右の管と液だめの3つの水面がすべて同じ高さ（青い点線）にそろいます（連通管の原理）。";
  }

  if (left !== right) {
    const openSide = left ? "左" : "右";
    const closedSide = left ? "右" : "左";
    const closedDrop = left ? setupState.rightDrop : setupState.leftDrop;
    if (closedDrop <= 0.5) {
      return `${openSide}の管（開）と液だめ（開）は大気圧につながっているため同じ高さ（青い点線）にそろい、${closedSide}の管（閉）は空気が入らないため大気圧に支えられて上まで満水のまま保たれます。`;
    }
    return `${openSide}の管（開）は液だめ（開）と同じ高さ（青い点線）にそろいます。${closedSide}の管（閉）には気体（空気）が閉じ込められているため上まで水が入らず、液だめの水圧に応じて気体が少し縮んだり広がったりします。`;
  }

  // Both top cocks CLOSED, res OPEN
  if (setupState.leftDrop <= 0.5 && setupState.rightDrop <= 0.5) {
    return "上部2つのコックが「閉」のため、液だめを下げても上部に空気が入らず、大気圧に支えられてH字管は隙間なく上まで満水のまま保たれます。";
  }
  return setupState.resOffset >= 0
    ? "上部が「閉」で気体が閉じ込められています。液だめを高くすると水圧が増し、H字管内の気体が少し押し縮められて水面が上がります。"
    : "上部が「閉」で気体が閉じ込められています。液だめを低くすると水圧が減り、H字管内の気体が少し広がって水面が下がります。";
}

function renderSetup() {
  recomputeSetupPhysics();

  updateCockVisual("cock-left", setupState.cocks.left);
  updateCockVisual("cock-right", setupState.cocks.right);
  updateCockVisual("cock-res", setupState.cocks.res);

  // Reservoir vertical offset (positive resOffset = higher = negative SVG Y)
  const dy = -setupState.resOffset;
  setupResAssembly.setAttribute("transform", `translate(0, ${dy})`);
  resHeightSlider.value = setupState.resOffset;

  // Dynamic rubber tubing path connecting reservoir bottom (468, 180 + dy) to center of H-tube bridge (277, 242)
  const resBottomY = 180 + dy;
  const sagY = Math.max(256, resBottomY + 56);
  const tubePath = `M468 ${resBottomY} V${sagY} C468 ${sagY + 24} 446 ${sagY + 30} 424 ${sagY + 30} H295 C282 ${sagY + 30} 277 ${sagY + 24} 277 ${sagY + 12} V242`;
  setupRubberTube.setAttribute("d", tubePath);
  setupTubeWater.setAttribute("d", tubePath);

  // Water levels
  if (!setupState.filled) {
    setupLeftWater.setAttribute("y", 334);
    setupLeftWater.setAttribute("height", 0);
    setupRightWater.setAttribute("y", 334);
    setupRightWater.setAttribute("height", 0);
    setupBridgeWater.classList.add("hidden");
    setupTubeWater.classList.add("hidden");
    setupResWater.setAttribute("y", 180);
    setupResWater.setAttribute("height", 0);
    setupLevelGuide.classList.add("hidden");
  } else {
    const leftDrop = setupState.leftDrop;
    const rightDrop = setupState.rightDrop;
    const resH = setupState.resH;

    setupLeftWater.setAttribute("y", 102 + leftDrop);
    setupLeftWater.setAttribute("height", Math.max(0, 232 - leftDrop));
    setupRightWater.setAttribute("y", 102 + rightDrop);
    setupRightWater.setAttribute("height", Math.max(0, 232 - rightDrop));
    setupBridgeWater.classList.remove("hidden");
    setupTubeWater.classList.remove("hidden");

    setupResWater.setAttribute("y", 180 - resH);
    setupResWater.setAttribute("height", resH);

    // Horizontal water-level comparison guide line (at reservoir water surface)
    const guideY = 180 + dy - resH;
    setupLevelGuide.setAttribute("y1", guideY);
    setupLevelGuide.setAttribute("y2", guideY);
    setupLevelGuide.classList.remove("hidden");
  }

  // PSU
  setupPsuLed.classList.toggle("is-on", setupState.powerOn);
  setupPsuStatus.textContent = setupState.powerOn ? "ON (通電中)" : "OFF";
  setupPowerBtn.classList.toggle("is-on", setupState.powerOn);
  setupPowerText.textContent = setupState.powerOn ? "電源を切る" : "電流を流す";

  // Step cards & nav
  document.querySelectorAll(".step-card").forEach((card, idx) => {
    card.classList.toggle("active", idx === setupState.step);
  });
  stepPrevBtn.disabled = setupState.step <= 0;
  stepNextBtn.disabled = setupState.step >= SETUP_STEPS.length - 1;

  // Feedback card
  if (setupState.warn) {
    setupFeedbackCard.className = "result-card is-warn";
    setupStepBadge.textContent = "注意ポイント";
    setupFeedbackText.textContent = setupState.warn;
  } else if (setupState.heightNote) {
    setupFeedbackCard.className = "result-card";
    setupStepBadge.textContent = "液だめの高さ実験";
    setupFeedbackText.textContent = setupState.heightNote;
  } else {
    setupFeedbackCard.className = "result-card";
    setupStepBadge.textContent = SETUP_STEPS[setupState.step].badge;
    setupFeedbackText.textContent = SETUP_STEPS[setupState.step].text;
  }

  // Gas test visual
  if (setupState.tested) {
    setupTestEffect.innerHTML = `
      <g transform="translate(225, 42)">
        <text y="-6" text-anchor="middle" fill="#ea580c" font-size="13" font-weight="900">ポンッ！(H₂)</text>
        <path d="M0 14 C-7 5 -4 -4 0 -8 C4 -4 7 5 0 14 Z" fill="#f59e0b" />
      </g>
      <g transform="translate(329, 42)">
        <text y="-6" text-anchor="middle" fill="#dc2626" font-size="13" font-weight="900">激しく燃える(O₂)</text>
        <path d="M0 14 C-7 5 -4 -4 0 -8 C4 -4 7 5 0 14 Z" fill="#ef4444" />
      </g>
    `;
  } else {
    setupTestEffect.innerHTML = "";
  }
}

function goToSetupStep(idx) {
  setupState.step = idx;
  setupState.warn = null;
  setupState.heightNote = null;
  SETUP_STEPS[idx].apply();
  renderSetup();
}

// Clickable Pinchcocks
[["cock-left", "left"], ["cock-right", "right"], ["cock-res", "res"]].forEach(([id, key]) => {
  document.getElementById(id).addEventListener("click", () => {
    setupState.tested = false;

    // Record sealed state before toggling cock
    if (key === "left" && setupState.cocks.left) {
      const refOffset = setupState.cocks.res
        ? setupState.resOffset
        : Math.max(-60, Math.min(60, 78 - setupState.resH - setupState.leftDrop));
      setupState.sealedLeft = { drop: setupState.leftDrop, refOffset };
    } else if (key === "right" && setupState.cocks.right) {
      const refOffset = setupState.cocks.res
        ? setupState.resOffset
        : Math.max(-60, Math.min(60, 78 - setupState.resH - setupState.rightDrop));
      setupState.sealedRight = { drop: setupState.rightDrop, refOffset };
    } else if (key === "res" && setupState.cocks.res) {
      setupState.lockedResH = setupState.resH;
      setupState.sealedLeft = { drop: setupState.leftDrop, refOffset: setupState.resOffset };
      setupState.sealedRight = { drop: setupState.rightDrop, refOffset: setupState.resOffset };
    }

    setupState.cocks[key] = !setupState.cocks[key];
    recomputeSetupPhysics();
    setupState.warn = null;
    setupState.heightNote = describePhysicsNote();
    renderSetup();
  });
});

// Interactive Action Buttons
document.getElementById("setup-fill-btn").addEventListener("click", () => {
  if (!setupState.cocks.left || !setupState.cocks.right || !setupState.cocks.res) {
    setupState.warn = "ピンチコックが閉じていると空気が抜けず、水溶液がH字管に入りません！ 3つ全て「開」にしてください。";
    renderSetup();
    return;
  }
  goToSetupStep(1);
});

setupPowerBtn.addEventListener("click", () => {
  if (setupState.powerOn) {
    goToSetupStep(4);
    return;
  }
  if (!setupState.filled) {
    setupState.warn = "先に「💧 水溶液を注ぐ」でH字管を水溶液で満たしてください。";
    renderSetup();
    return;
  }
  if (setupState.cocks.left || setupState.cocks.right) {
    setupState.warn = "上部のピンチコックが開いていると、発生した気体が外へ逃げてしまいます！ 上部2つを「閉」にしてください。";
    renderSetup();
    return;
  }
  if (setupState.gasAmount === 0 && (setupState.leftDrop > 5 || setupState.rightDrop > 5)) {
    setupState.warn = "H字管の上部に空気が残っています！ 上部コックを「開」にして液だめを高くし、上まで水溶液で満たしてから「閉」にしてください。";
    renderSetup();
    return;
  }
  if (!setupState.cocks.res) {
    setupState.warn = "液だめのピンチコックが閉じていると、気体がたまったときに押し出される液の逃げ場がなくなります！ 液だめを「開」にしてください。";
    renderSetup();
    return;
  }
  goToSetupStep(3);
});

document.getElementById("setup-test-btn").addEventListener("click", () => {
  if (setupState.gasAmount <= 0 || (setupState.leftDrop < 5 && setupState.rightDrop < 5)) {
    setupState.warn = "まだ気体がたまっていません。先に電流を流して気体を集めてください。";
    renderSetup();
    return;
  }
  if (setupState.powerOn) {
    setupState.warn = "安全のため、気体を確認する前に電源を切ってください（OFF）。";
    renderSetup();
    return;
  }
  if (setupState.cocks.res) {
    setupState.warn = "液だめのピンチコックが「開」のままだと、上部を開けた瞬間に液だめの水圧で液が吹き出してしまいます！ 先に液だめのコックを「閉」にしてください。";
    renderSetup();
    return;
  }
  goToSetupStep(5);
});

document.getElementById("setup-reset-btn").addEventListener("click", () => {
  goToSetupStep(0);
});

document.getElementById("setup-labels-toggle").addEventListener("change", (e) => {
  const hide = !e.target.checked;
  document.getElementById("setup-part-labels").classList.toggle("hidden", hide);
  document.getElementById("setup-res-labels").classList.toggle("hidden", hide);
});

function setReservoirOffset(val) {
  setupState.resOffset = Math.max(-60, Math.min(60, Math.round(val)));
  recomputeSetupPhysics();
  setupState.warn = null;
  setupState.heightNote = describePhysicsNote();
  renderSetup();
}

resHeightSlider.addEventListener("input", (e) => {
  setReservoirOffset(Number(e.target.value));
});

resHeightReset.addEventListener("click", () => {
  setReservoirOffset(0);
});

// Direct drag on reservoir assembly inside SVG
let isDraggingRes = false;
let dragStartClientY = 0;
let dragStartOffset = 0;

setupResAssembly.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".pinchcock")) return;
  isDraggingRes = true;
  dragStartClientY = e.clientY;
  dragStartOffset = setupState.resOffset;
  setupResAssembly.setPointerCapture(e.pointerId);
});

setupResAssembly.addEventListener("pointermove", (e) => {
  if (!isDraggingRes) return;
  const svgRect = document.getElementById("setup-svg").getBoundingClientRect();
  const scaleY = 470 / svgRect.height;
  const deltaSvgY = (e.clientY - dragStartClientY) * scaleY;
  setReservoirOffset(dragStartOffset - deltaSvgY);
});

setupResAssembly.addEventListener("pointerup", () => {
  isDraggingRes = false;
});
setupResAssembly.addEventListener("pointercancel", () => {
  isDraggingRes = false;
});

document.querySelectorAll(".step-card").forEach((card) => {
  card.addEventListener("click", () => goToSetupStep(Number(card.dataset.step)));
});

stepPrevBtn.addEventListener("click", () => {
  if (setupState.step > 0) goToSetupStep(setupState.step - 1);
});

stepNextBtn.addEventListener("click", () => {
  if (setupState.step < SETUP_STEPS.length - 1) goToSetupStep(setupState.step + 1);
});

renderSetup();
