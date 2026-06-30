// ─── PRE-GALAXY MUSIC ───
const bgMusicPre = new Audio('music2.mp3');
bgMusicPre.loop = true;
bgMusicPre.volume = 0.5;
bgMusicPre.preload = 'auto';

// ─── SCENE SETUP ───
const canvas = document.getElementById('galaxy');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;

// ─── SOFT GLOW SPRITE (for nebula particles) ───
function createGlowTexture() {
  const size = 64;
  const canvas2d = document.createElement('canvas');
  canvas2d.width = size;
  canvas2d.height = size;
  const ctx = canvas2d.getContext('2d');
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas2d);
}

const glowTexture = createGlowTexture();

// ─── CAT INTERACTION ───
const catScreen = document.getElementById('catScreen');
const phoneBox = document.getElementById('phoneBox');
const runningCat = document.getElementById('runningCat');
const bubbleBox = document.getElementById('bubbleBox');
const bubbleText = document.getElementById('bubbleText');
const catSpeech = document.getElementById('catSpeech');

// ─── DANCER CAT (standby) ───
const dancerCat = document.getElementById('dancerCat');
const dancerCatSpeech = document.getElementById('dancerCatSpeech');

const dancerLines = [
  "Meow meow meow meow meow",
  "Dancing dancing meow meow",
  "Hey meow look I am dancing",
  "Your wonderful meow meow",
  "Happy 11th Meow meow",
  "HAPPY 11TH MEOW MEOW MEOW"
];

let dancerLineIndex = 0;
let dancerClickCount = 0;
let dancerSpecialMessageActive = false;

function showDancerLine(text) {
  dancerCatSpeech.style.opacity = '0';
  setTimeout(() => {
    dancerCatSpeech.textContent = text;
    dancerCatSpeech.style.opacity = '1';
  }, 300);
}

// Auto-cycle through dancer lines, looping forever
function cycleDancerLines() {
  if (!dancerSpecialMessageActive) {
    showDancerLine(dancerLines[dancerLineIndex % dancerLines.length]);
    dancerLineIndex++;
  }
}

// Show first line immediately, then cycle every 3s
cycleDancerLines();
setInterval(cycleDancerLines, 3000);

// One-time line when the catch-the-cat screen finally appears (after quiz)
function dancerSayCatchLine() {
  dancerSpecialMessageActive = true;
  let repeatCount = 0;
  const maxRepeats = 3;

  showDancerLine("Catch this idiot one meow");
  repeatCount++;

  const repeatInterval = setInterval(() => {
    if (repeatCount >= maxRepeats) {
      clearInterval(repeatInterval);
      dancerSpecialMessageActive = false;
      dancerLineIndex = 0;
      cycleDancerLines();
      return;
    }
    showDancerLine("Catch this idiot one meow");
    repeatCount++;
  }, 3000);
}

// Click handling
dancerCat.addEventListener('pointerdown', (e) => {
  e.stopPropagation();

  // Ignore clicks while a special sequence is already playing
  if (dancerSpecialMessageActive) return;

  dancerClickCount++;
  dancerSpecialMessageActive = true;

  if (dancerClickCount === 1) {
    showDancerLine("Meow meow meow I'm just dancing");
    setTimeout(() => {
      dancerSpecialMessageActive = false;
      dancerLineIndex = 0;
    }, 3000);
  } else if (dancerClickCount === 2) {
    showDancerLine("I told you meow meow");
    setTimeout(() => {
      dancerSpecialMessageActive = false;
      dancerLineIndex = 0;
    }, 3000);
  } else {
    // 3rd+ click → repeating catch line
    dancerSayCatchLine();
  }
});

let noCount = 0;
const noLines = [
  "Are you sure? Huhu 🥺",
  "No no no no mah love, like... you sure? 😭",
  "Very very very sure? 💔",
  "VERY VERY VERY VERY sure talaga?? 😤",
  "Charot lang hehe. Sure ka ba talaga?? 🥹",
  "Makulit ka naman haha. Last chance ha? 🐾💚",
  "Okay fine... pero I love you pa rin 😔💚<br>Click No again if you're a meanie 😤",
  "Okay OKAY alam ko na... 💚 *sigh* just click Yes na please 🥺"
];

// ─── JS-DRIVEN CAT RUNNER (all directions) ───
let catX = 80;
let catY = 300;
let catVX = 3.2;
let catVY = 2.6;
let catCaught = false;

// ─── GENERATE GRASS TUFTS (spiky blades, Pokémon tall-grass style) ───
const grassRow = document.getElementById('grassRow');
const tuftCount = 50;
for (let i = 0; i < tuftCount; i++) {
  const tuft = document.createElement('div');
  tuft.className = 'tuft';
  tuft.style.left = (Math.random() * 92) + '%';
  tuft.style.top = (Math.random() * 92) + '%';
  const scale = 0.7 + Math.random() * 0.9;
  tuft.style.animationDelay = (Math.random() * 2) + 's';
  tuft.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';

  for (let j = 0; j < 4; j++) {
    const spike = document.createElement('div');
    spike.className = 'spike';
    tuft.appendChild(spike);
  }

  tuft.style.transform = `scale(${scale})`;
  grassRow.appendChild(tuft);
}

// Same grass generator, but for the intro screen
const introGrassRow = document.getElementById('introGrassRow');
for (let i = 0; i < tuftCount; i++) {
  const tuft = document.createElement('div');
  tuft.className = 'tuft';
  tuft.style.left = (Math.random() * 92) + '%';
  tuft.style.top = (Math.random() * 92) + '%';
  const scale = 0.7 + Math.random() * 0.9;
  tuft.style.animationDelay = (Math.random() * 2) + 's';
  tuft.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';

  for (let j = 0; j < 4; j++) {
    const spike = document.createElement('div');
    spike.className = 'spike';
    tuft.appendChild(spike);
  }

  tuft.style.transform = `scale(${scale})`;
  introGrassRow.appendChild(tuft);
}

function runCatLoop() {
  if (catCaught) return;

  const boxWidth = phoneBox.offsetWidth;
  const boxHeight = phoneBox.offsetHeight;
  const catSize = 56;

  catX += catVX;
  catY += catVY;

  // Bounce off walls
  if (catX + catSize >= boxWidth)  { catX = boxWidth - catSize;  catVX *= -1; }
  if (catX <= 0)                   { catX = 0;                   catVX *= -1; }
  if (catY + catSize >= boxHeight) { catY = boxHeight - catSize; catVY *= -1; }
  if (catY <= 0)                   { catY = 0;                   catVY *= -1; }

  runningCat.style.left = catX + 'px';
  runningCat.style.top  = catY + 'px';
  runningCat.style.bottom = 'auto';
  runningCat.style.transform = catVX > 0 ? 'scaleX(1)' : 'scaleX(-1)';

  // ── Follow cat with speech bubble ──
  const bubbleW = catSpeech.offsetWidth || 180;
  const bubbleH = catSpeech.offsetHeight || 44;
  const margin = 8;

  let bx = catX + (catSize / 2) - (bubbleW / 2);
  let by = catY - bubbleH - margin;

  // If bubble goes off top, show below cat instead
  if (by < margin) by = catY + catSize + margin;

  // Clamp horizontally so it doesn't go off left or right edge
  if (bx < margin) bx = margin;
  if (bx + bubbleW > boxWidth - margin) bx = boxWidth - bubbleW - margin;

  catSpeech.style.left = bx + 'px';
  catSpeech.style.top  = by + 'px';

  requestAnimationFrame(runCatLoop);
}

runCatLoop();

// ─── CAT SPEECH LINES ───
const catLines = [
  "Catch me mah love! 🐾",
  "Hoho catch me catch me! 😹",
  "Meow meow meow!! 🐱",
  "Hehe you can't catch me! 💨",
  "Try harder mah love! 🐾💚"
];

let catLineIndex = 0;

// Force show first line after DOM settles
catSpeech.textContent = catLines[0];
catLineIndex = 1;

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    catSpeech.style.opacity = '1';
  });
});

// Cycle lines every 2.5s
setInterval(() => {
  if (catCaught) return;

  catSpeech.style.opacity = '0';

  setTimeout(() => {
    catSpeech.textContent = catLines[catLineIndex % catLines.length];
    catLineIndex++;
    catSpeech.style.opacity = '1';
  }, 500);
}, 2500);

// ─── CATCH THE CAT ───
let catClickReady = false;
setTimeout(() => catClickReady = true, 500); // tiny delay so page load doesn't misfire

runningCat.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  if (!catClickReady || catCaught) return;
  catCaught = true;

  catSpeech.style.opacity = '0';

  const boxWidth = phoneBox.offsetWidth;
  const boxHeight = phoneBox.offsetHeight;
  runningCat.style.transition = 'all 0.4s ease';
  runningCat.style.left = (boxWidth / 2 - 30) + 'px';
  runningCat.style.top  = (boxHeight / 2 - 30) + 'px';
  runningCat.style.transform = 'scaleX(1)';
  runningCat.style.fontSize = '72px';
  runningCat.style.cursor = 'default';

  setTimeout(() => bubbleBox.classList.remove('hidden'), 450);
});

window.handleYes = function() {
  bubbleText.innerHTML = "Yeyyy!! 🎉💚 Hehe wait lang ha...";
  document.getElementById('bubbleButtons').style.display = 'none';

  // Fade out pre-galaxy music before galaxy music takes over
  let fadeOut = setInterval(() => {
    if (bgMusicPre.volume > 0.05) {
      bgMusicPre.volume -= 0.05;
    } else {
      bgMusicPre.pause();
      bgMusicPre.currentTime = 0;
      clearInterval(fadeOut);
    }
  }, 80);

  const galaxyEl = document.getElementById('galaxy');
  const uiEl = document.getElementById('ui');

  setTimeout(() => {
    // Step 1: fade the cat screen smoothly to transparent
    catScreen.style.opacity = '0';

    setTimeout(() => {
      // Step 2: swap scenes once cat screen has fully faded
      catScreen.remove();
      galaxyEl.style.display = 'block';
      uiEl.style.display = 'block';

      // Force a reflow so the browser registers display:block
      // BEFORE we trigger the opacity transition (prevents the snap/glitch)
      void galaxyEl.offsetWidth;

      // Step 3: bloom the galaxy into view
      galaxyEl.style.opacity = '1';
      uiEl.style.opacity = '1';

      // Step 4: only start the heart formation + music once the
      // galaxy has FULLY bloomed into view (transition actually finished)
      galaxyEl.addEventListener('transitionend', function onBloom(e) {
        if (e.propertyName !== 'opacity') return;
        galaxyEl.removeEventListener('transitionend', onBloom);
        startHeartFormation();
      }, { once: true });

    }, 800); // matches #catScreen fade duration

  }, 300); // tiny pause so "Yeyyy!!" text is visible before fading
};

window.handleNo = function() {
  const line = noLines[Math.min(noCount, noLines.length - 1)];
  bubbleText.innerHTML = line + "<br><br>";
  noCount++;

  // After all lines exhausted, change No button to force Yes
  if (noCount >= noLines.length) {
    document.getElementById('btnNo').textContent = "...Fine, Yes 💚";
    document.getElementById('btnNo').onclick = handleYes;
  }
};

// ─── STAR FIELD ───
function createStars() {
  const geo = new THREE.BufferGeometry();
  const count = 3000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 800;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}

const stars = createStars();
scene.add(stars);

// ─── SHOOTING STARS ───
const shootingStars = [];

function createShootingStar() {
  const startX = (Math.random() - 0.5) * 500;
  const startY = (Math.random() - 0.5) * 250 + 100;
  const startZ = (Math.random() - 0.5) * 300;

  const angle = Math.random() * Math.PI * 2;
  const dirX = Math.cos(angle);
  const dirY = -0.3 - Math.random() * 0.3;
  const speed = 2 + Math.random() * 2;

  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(6);
  positions[0] = startX; positions[1] = startY; positions[2] = startZ;
  positions[3] = startX + dirX * 12; positions[4] = startY + dirY * 12; positions[5] = startZ;
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);

  shootingStars.push({
    mesh: line,
    pos: { x: startX, y: startY, z: startZ },
    dir: { x: dirX, y: dirY },
    speed,
    life: 1.0
  });
}

setInterval(createShootingStar, 250);

// ─── 3D PARTICLE HEART ───
function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
          - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x, y];
}

let heartTargetPositions, heartStartPositions, heartPoints;

function createHeart() {
  const N = 6000;
  heartTargetPositions = new Float32Array(N * 3);
  heartStartPositions = new Float32Array(N * 3);
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const t = Math.random() * Math.PI * 2;
    const [hx, hy] = heartPoint(t);
    const scatter = 0.6 + Math.random() * 0.6;

    heartTargetPositions[i * 3]     = hx + (Math.random() - 0.5) * scatter;
    heartTargetPositions[i * 3 + 1] = hy + (Math.random() - 0.5) * scatter;
    heartTargetPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

    // scattered starting position — explode outward from center
    const r = 40 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    heartStartPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    heartStartPositions[i * 3 + 1] = r * Math.cos(phi);
    heartStartPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    positions[i * 3]     = heartStartPositions[i * 3];
    positions[i * 3 + 1] = heartStartPositions[i * 3 + 1];
    positions[i * 3 + 2] = heartStartPositions[i * 3 + 2];

    const brightness = 0.5 + Math.random() * 0.5;
    colors[i * 3]     = 0;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness * 0.25;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  heartPoints = new THREE.Points(geo, mat);
  return heartPoints;
}

const heart = createHeart();
heart.position.y = 12;
scene.add(heart);

// ─── HEART FORMATION ANIMATION ───
let formationProgress = 0;
let formationPlaying = false;
let formationStartTime = 0;
const formationDuration = 4.5; // seconds — slower, smoother formation

function startHeartFormation() {
  formationPlaying = true;
  formationProgress = 0;
  formationStartTime = performance.now();

  // Music starts the exact instant the heart begins moving — and now
  // this only fires after the galaxy has fully bloomed into view.
  bgMusic.play().catch(e => console.log('Music blocked:', e));
}

function updateHeartFormation() {
  if (!formationPlaying) return;

  const elapsed = (performance.now() - formationStartTime) / 1000; // seconds
  formationProgress = Math.min(elapsed / formationDuration, 1);

  if (formationProgress >= 1) {
    formationPlaying = false;
  }

  // Smooth ease-in-out (slow start, slow end, faster middle)
  const ease = formationProgress < 0.5
    ? 4 * Math.pow(formationProgress, 3)
    : 1 - Math.pow(-2 * formationProgress + 2, 3) / 2;

  const posAttr = heartPoints.geometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    posAttr.array[i * 3]     = heartStartPositions[i * 3]     + (heartTargetPositions[i * 3]     - heartStartPositions[i * 3])     * ease;
    posAttr.array[i * 3 + 1] = heartStartPositions[i * 3 + 1] + (heartTargetPositions[i * 3 + 1] - heartStartPositions[i * 3 + 1]) * ease;
    posAttr.array[i * 3 + 2] = heartStartPositions[i * 3 + 2] + (heartTargetPositions[i * 3 + 2] - heartStartPositions[i * 3 + 2]) * ease;
  }
  posAttr.needsUpdate = true;
}

// ─── SOLID GLOWING HEART CENTER ───
const centerGlowMat = new THREE.SpriteMaterial({
  map: glowTexture,
  color: 0xff69b4,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const centerGlow = new THREE.Sprite(centerGlowMat);
centerGlow.scale.set(10, 10, 1);
centerGlow.position.y = 12;
scene.add(centerGlow);

// ─── SWIRLING PARTICLE DISK ───
function createSwirlDisk() {
  const bladeCount = 5;
  const particlesPerBlade = 4000;
  const count = bladeCount * particlesPerBlade;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  let idx = 0;
  for (let b = 0; b < bladeCount; b++) {
    const bladeOffset = (b / bladeCount) * Math.PI * 2;
    for (let i = 0; i < particlesPerBlade; i++) {
      const tNorm = Math.pow(Math.random(), 0.6); // bias toward outer spread
      const radius = 4 + tNorm * 110;             // WAY wider: up to ~114 units
      const curl = tNorm * 2.8;
      const angle = bladeOffset + curl + (Math.random() - 0.5) * 0.22;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * (0.8 - tNorm * 0.6); // very flat disk

      positions[idx * 3]     = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      // Dramatic center-bright, gentle gradual fade with distance
      const brightness = Math.pow(1 - tNorm, 1.0) * 1.6;
      colors[idx * 3]     = brightness * 0.25;
      colors[idx * 3 + 1] = 0.12 + brightness * 0.95;
      colors[idx * 3 + 2] = brightness * 0.35 + 0.02;

      // Bigger near center, tiny at edges

      idx++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.6,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  return new THREE.Points(geo, mat);
}

const swirlDisk = createSwirlDisk();
swirlDisk.position.y = -1;
scene.add(swirlDisk);

// ─── FAINT FILLED FLOOR ───
function createFloorDisk() {
  const count = 18000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Fill entire disk evenly using square-root for uniform distribution
    const radius = Math.sqrt(Math.random()) * 115;
    const angle = Math.random() * Math.PI * 2;

    positions[i * 3]     = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // very flat
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    // Bright center, fading toward edges
    const fade = Math.pow(1 - radius / 115, 1.8);
    colors[i * 3]     = fade * 0.05;
    colors[i * 3 + 1] = 0.45 + fade * 0.6;
    colors[i * 3 + 2] = fade * 0.1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.8,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,           // brighter than before, but still under the swirl's 1.0
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  return new THREE.Points(geo, mat);
}

const floorDisk = createFloorDisk();
floorDisk.position.y = -1;
scene.add(floorDisk);

// ─── FLOOR CENTER GLOW ───
const floorGlowMat = new THREE.SpriteMaterial({
  map: glowTexture,
  color: 0xff69b4,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const floorGlow = new THREE.Sprite(floorGlowMat);
floorGlow.scale.set(40, 40, 1);  // wide flat glow at center
floorGlow.position.set(0, 2, 0);
scene.add(floorGlow);

// ─── SATURN BLACK HOLE ───
function createBlackHole() {
  // --- Dark core void (black sphere) ---
  const coreGeo = new THREE.SphereGeometry(5, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const core = new THREE.Mesh(coreGeo, coreMat);

  // --- Gravitational lens glow (sprite behind core) ---
  const lensGlowMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff69b4,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const lensGlow = new THREE.Sprite(lensGlowMat);
  lensGlow.scale.set(22, 22, 1);

  // --- Outer soft halo ---
  const haloMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff69b4,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(42, 42, 1);

  scene.add(lensGlow);
  scene.add(halo);
  scene.add(core);

  // --- Saturn rings (flat disk rings around the black hole) ---
  const ringConfigs = [
    { inner: 7,  outer: 9,   color: 0xff69b4, opacity: 0.95 }, // pink
    { inner: 9.5,outer: 11,  color: 0xff1493, opacity: 0.85 }, // deep pink
    { inner: 12, outer: 14,  color: 0xffb6c1, opacity: 0.75 }, // light pink
    { inner: 15, outer: 16.5,color: 0xff69b4, opacity: 0.6  }, // pink
    { inner: 17.5,outer: 18.5,color: 0xffc0cb, opacity: 0.35 }, // baby pink
  ];

  const rings = [];
  ringConfigs.forEach(cfg => {
    const geo = new THREE.RingGeometry(cfg.inner, cfg.outer, 128);
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: cfg.opacity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2.2; // slight tilt like Saturn
    scene.add(ring);
    rings.push(ring);
  });

  // --- Accretion disk particles (swirling in-fall) ---
  const diskCount = 12000;
  const diskPositions = new Float32Array(diskCount * 3);
  const diskColors = new Float32Array(diskCount * 3);

  for (let i = 0; i < diskCount; i++) {
    const r = 6 + Math.pow(Math.random(), 0.5) * 20;
    const angle = Math.random() * Math.PI * 2;
    const tilt = (Math.random() - 0.5) * 0.35;

    diskPositions[i * 3]     = Math.cos(angle) * r;
    diskPositions[i * 3 + 1] = tilt;
    diskPositions[i * 3 + 2] = Math.sin(angle) * r;

    // Color gradient: hot white/teal near center → purple/gold at edge
    const normalized = (r - 6) / 20;
    if (normalized < 0.25) {
      // bright pink core
      diskColors[i * 3] = 1.0; diskColors[i * 3 + 1] = 0.41; diskColors[i * 3 + 2] = 0.71;
    } else if (normalized < 0.5) {
      // deep pink mid
      diskColors[i * 3] = 1.0; diskColors[i * 3 + 1] = 0.08; diskColors[i * 3 + 2] = 0.58;
    } else if (normalized < 0.75) {
      // hot pink outer
      diskColors[i * 3] = 1.0; diskColors[i * 3 + 1] = 0.2; diskColors[i * 3 + 2] = 0.6;
    } else {
      // baby pink edge
      diskColors[i * 3] = 1.0; diskColors[i * 3 + 1] = 0.75; diskColors[i * 3 + 2] = 0.8;
    }
  }

  const diskGeo = new THREE.BufferGeometry();
  diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
  diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

  const diskMat = new THREE.PointsMaterial({
    size: 0.55,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const disk = new THREE.Points(diskGeo, diskMat);
  scene.add(disk);

  return { core, rings, disk, lensGlow, halo };
}

const blackHole = createBlackHole();

// Position everything below the heart solar system
const BH_Y = -32;
blackHole.core.position.set(0, BH_Y, 0);
blackHole.lensGlow.position.set(0, BH_Y, 0);
blackHole.halo.position.set(0, BH_Y, 0);
blackHole.rings.forEach(r => r.position.set(0, BH_Y, 0));
blackHole.disk.position.set(0, BH_Y, 0);

// ─── OUTER NEBULA SHELL (visible from far away) ───
let nebulaFallSpeeds, nebulaSwaySpeeds, nebulaSwayOffsets, nebulaStartY;
const NEBULA_TOP = 160;
const NEBULA_BOTTOM = -20;

function createNebula() {
  const count = 600; // fewer, bigger, lantern-like particles
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  nebulaFallSpeeds = new Float32Array(count);
  nebulaSwaySpeeds = new Float32Array(count);
  nebulaSwayOffsets = new Float32Array(count);
  nebulaStartY = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // spread wide across the whole scene horizontally
    const x = (Math.random() - 0.5) * 260;
    const z = (Math.random() - 0.5) * 260;
    const y = NEBULA_BOTTOM + Math.random() * (NEBULA_TOP - NEBULA_BOTTOM);

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    nebulaStartY[i] = y;
    nebulaFallSpeeds[i] = 0.04 + Math.random() * 0.05; // very slow, dreamy drift
    nebulaSwaySpeeds[i] = 0.2 + Math.random() * 0.3;
    nebulaSwayOffsets[i] = Math.random() * Math.PI * 2;

    // warm yellow / gold / soft white mix, like floating lantern light
    const choice = Math.random();
    if (choice < 0.45) {
      colors[i * 3]     = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.1 + Math.random() * 0.15;
    } else if (choice < 0.75) {
      colors[i * 3]     = 0.95 + Math.random() * 0.05;
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
    } else {
      colors[i * 3]     = 1.0;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.05 + Math.random() * 0.1;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 3.2,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  return new THREE.Points(geo, mat);
}

const nebula = createNebula();
scene.add(nebula);

// ─── ANIMATE FALLING LANTERN PARTICLES ───
function updateNebulaRain(time) {
  const posAttr = nebula.geometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    posAttr.array[i * 3 + 1] -= nebulaFallSpeeds[i];

    // gentle horizontal sway like a drifting lantern
    posAttr.array[i * 3]     += Math.sin(time * nebulaSwaySpeeds[i] + nebulaSwayOffsets[i]) * 0.015;
    posAttr.array[i * 3 + 2] += Math.cos(time * nebulaSwaySpeeds[i] + nebulaSwayOffsets[i]) * 0.015;

    // loop back to the top once it falls below the floor
    if (posAttr.array[i * 3 + 1] < NEBULA_BOTTOM) {
      posAttr.array[i * 3 + 1] = NEBULA_TOP;
    }
  }
  posAttr.needsUpdate = true;
}

// ─── ORBIT RINGS ───
function createOrbitRing(radius, color, opacity) {
  const geo = new THREE.RingGeometry(radius, radius + 0.15, 128);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2.5;
  return ring;
}

// ─── FLOATING PHOTOS ───
const photoFiles = [
  "p01.jpg",
  "p02.jpg",
  "p03.jpg",
  "p04.jpg",
  "p05.jpg",
  "p06.jpg",
  "p07.jpg",
  "p08.jpg",
  "p09.jpg",
  "p10.jpg",
  "p11.jpg",
  "p12.jpg",
  "p13.jpg",
  "p14.jpg",
  "p15.jpg",
  "p16.jpg",
  "p17.jpg",
  "p18.jpg",
  "p19.jpg"
];

const photoMeshes = [];
const loader = new THREE.TextureLoader();

photoFiles.forEach((src, i) => {
  loader.load(src, (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const aspect = texture.image.width / texture.image.height;
    const size = 8;
    const geo = new THREE.PlaneGeometry(size * aspect, size);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);

    // scatter randomly in 3D space around the heart
    const radius = 35 + Math.random() * 35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    let px = radius * Math.sin(phi) * Math.cos(theta);
    let py = radius * Math.cos(phi) * 0.6;
    let pz = radius * Math.sin(phi) * Math.sin(theta);

    // Keep photos away from the black hole zone (below y = -18)
    if (py < -18) py = -18 + Math.random() * 6;

    mesh.position.set(px, py, pz);

    mesh.userData = {
      baseOpacity: 0.85,
      glow: 0,
      floatSpeed: 0.2 + Math.random() * 0.3,
      floatOffset: Math.random() * Math.PI * 2,
      basePos: mesh.position.clone()
    };

    scene.add(mesh);
    photoMeshes.push(mesh);
  });
});

function updatePhotos(time, isMoving) {
  photoMeshes.forEach(mesh => {
    const u = mesh.userData;
    mesh.position.y = u.basePos.y + Math.sin(time * u.floatSpeed + u.floatOffset) * 1.5;
    mesh.lookAt(camera.position);

    const targetGlow = isMoving ? 1 : 0;
    u.glow += (targetGlow - u.glow) * 0.05;
    mesh.material.opacity = u.baseOpacity + u.glow * 0.15;

    if (u.glow > 0.05) {
      mesh.material.color.setRGB(
        1 + u.glow * 0.3,
        1 + u.glow * 0.5,
        1 + u.glow * 0.3
      );
    } else {
      mesh.material.color.setRGB(1, 1, 1);
    }
  });
}

const ring1 = createOrbitRing(28, 0x00ff88, 0.5);
const ring2 = createOrbitRing(42, 0x00ff88, 0.35);
ring1.position.y = 12;
ring2.position.y = 12;
scene.add(ring1);
scene.add(ring2);

// ─── ORBITING MESSAGES ───
const messages = [
  "HEHE, HELLO MAH LOVE",
  "DID YOU LIKE IT?",
  "HAPPY MONTHSARY SAAKONG LALAB",
  "BUYAG 3 YEARS M.U",
  "11 MONTHS AS YOUR PARTNER IN LIFE",
  "THANK YOU FOR THE LOVE AND CARE",
  "I APPRECIATE YOU VERY MUCH",
  "I HAVE NO REGRETS LOVING YOU",
  "I'LL ALWAYS BE WITH YOU",
  "MAH LOVE",
  "GOD IS ALWAYS GRACIOUS",
  "I LOVE YOU JANELLE",
  "GIAN AND JANELLE"
];

const messageObjects = [];
const orbitRadius = 28;

messages.forEach((text, i) => {
  const canvas2d = document.createElement('canvas');
canvas2d.width = 640;
canvas2d.height = 150;
const ctx = canvas2d.getContext('2d');
ctx.clearRect(0, 0, 640, 150);

// dark pill background for readability
ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
ctx.beginPath();
ctx.roundRect(15, 20, 610, 110, 24);
ctx.fill();

// subtle green glow
ctx.shadowColor = 'rgba(0, 255, 136, 0.9)';
ctx.shadowBlur = 16;
ctx.font = 'bold 34px Inter, Arial, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(text, 320, 75);

const texture = new THREE.CanvasTexture(canvas2d);
const geo = new THREE.PlaneGeometry(17, 4);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const mesh = new THREE.Mesh(geo, mat);
  const angle = (i / messages.length) * Math.PI * 2;
  const heightOffset = (Math.random() - 0.5) * 8;

  mesh.userData = {
  angle: angle,
  speed: 0.0025 + Math.random() * 0.0015,
  radius: 30 + (i % 2) * 10,
  height: 3 + Math.random() * 2
};

  scene.add(mesh);
  messageObjects.push(mesh);
});

// ─── UPDATE MESSAGES (called inside animate) ───
function updateMessages() {
  messageObjects.forEach(msg => {
    msg.userData.angle += msg.userData.speed;
    const a = msg.userData.angle;
    msg.position.x = Math.cos(a) * msg.userData.radius;
    msg.position.z = Math.sin(a) * msg.userData.radius;
    msg.position.y = 12 + msg.userData.height + Math.sin(a * 2) * 2;
    msg.lookAt(camera.position);
  });
}

// ─── CAMERA CONTROLS ───
let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let spherical = { theta: 0.4, phi: Math.PI / 3.2, radius: 90 };
let targetSpherical = { ...spherical };
let autoRotate = true;
let pinchStartDist = null;

canvas.addEventListener('mousedown', e => {
  isDragging = true;
  prevMouse = { x: e.clientX, y: e.clientY };
  autoRotate = false;
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - prevMouse.x;
  const dy = e.clientY - prevMouse.y;
  targetSpherical.theta -= dx * 0.005;
  targetSpherical.phi   -= dy * 0.005;
  targetSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, targetSpherical.phi));
  prevMouse = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  setTimeout(() => autoRotate = true, 4000);
});

canvas.addEventListener('touchstart', e => {
  autoRotate = false;
  if (e.touches.length === 1) {
    isDragging = true;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}, { passive: true });

window.addEventListener('touchmove', e => {
  if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;
    targetSpherical.theta -= dx * 0.005;
    targetSpherical.phi   -= dy * 0.005;
    targetSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, targetSpherical.phi));
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}, { passive: true });

window.addEventListener('touchend', e => {
  isDragging = false;
  pinchStartDist = null;
  setTimeout(() => autoRotate = true, 4000);
});

// ─── ZOOM MESSAGE ───
const zoomMsg = document.getElementById('zoomMsg');

// ─── MUSIC ───
const bgMusic = new Audio('music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.preload = 'auto'; // ← preloads the file in background before tap

function playMusic() {
  bgMusic.play().catch(e => console.log('Music blocked:', e));
}

function launchGalaxy() {
  const galaxyEl = document.getElementById('galaxy');
  const uiEl = document.getElementById('ui');

  galaxyEl.style.display = 'block';
  uiEl.style.display = 'block';

  // Force a reflow so the transition triggers properly
  requestAnimationFrame(() => {
    galaxyEl.style.opacity = '1';
    uiEl.style.opacity = '1';
  });

  bgMusic.play().catch(e => console.log('Music blocked:', e));
  bgMusic.addEventListener('playing', () => {
    startHeartFormation();
  }, { once: true });
  setTimeout(() => {
    if (formationProgress === 0 && !formationPlaying) {
      startHeartFormation();
    }
  }, 1500);
}

// ─── ANIMATION LOOP ───
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  if (autoRotate) {
    targetSpherical.theta += 0.003;
  }

  spherical.theta  += (targetSpherical.theta  - spherical.theta)  * 0.05;
  spherical.phi    += (targetSpherical.phi    - spherical.phi)    * 0.05;
  spherical.radius += (targetSpherical.radius - spherical.radius) * 0.15;

  camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
  camera.position.y = spherical.radius * Math.cos(spherical.phi);
  camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
  camera.lookAt(0, 0, 0);

  const isCameraMoving = isDragging || Math.abs(targetSpherical.theta - spherical.theta) > 0.001 || Math.abs(targetSpherical.radius - spherical.radius) > 0.5;
  const pulse = 1 + 0.05 * Math.sin(time * 1.8);
  heart.scale.setScalar(pulse);
  const baseGlow = 0.85 + 0.15 * Math.sin(time * 1.2);
  heart.material.opacity = isCameraMoving ? Math.min(1, baseGlow + 0.25) : baseGlow;
  heart.material.size = isCameraMoving ? 0.65 : 0.5;
  const glowPulse = 1 + 0.12 * Math.sin(time * 2.2); // stronger pulse = clearer "click me" cue
centerGlow.scale.setScalar(10 * glowPulse);
// ── Position the "Click" hint just below the glowing heart center ──
const hintEl = document.getElementById('clickHint');
if (hintEl) {
  const glowWorldPos = centerGlow.position.clone();
  glowWorldPos.project(camera);

  const screenX = (glowWorldPos.x * 0.5 + 0.5) * window.innerWidth;
  const screenY = (-glowWorldPos.y * 0.5 + 0.5) * window.innerHeight;

  hintEl.style.left = screenX + 'px';
  hintEl.style.top  = (screenY + 26) + 'px'; // 26px below the glow

  // Hide the hint once the love popup is open, or if the glow is behind the camera
  const popupOpen = document.getElementById('lovePopup').classList.contains('visible');
  hintEl.style.display = (popupOpen || glowWorldPos.z > 1) ? 'none' : 'block';
}
  centerGlow.material.opacity = isCameraMoving ? 1 : 0.8;

  swirlDisk.rotation.y += 0.0008;
  // black hole rotation
  blackHole.disk.rotation.y += 0.003;
  blackHole.rings.forEach((r, i) => {
    r.rotation.z += i % 2 === 0 ? 0.0008 : -0.0005;
  });
  blackHole.lensGlow.material.opacity = 0.55 + 0.1 * Math.sin(time * 1.5);
  blackHole.halo.material.opacity     = 0.2  + 0.08 * Math.sin(time * 0.8);
  floorDisk.rotation.y += 0.0003; // floor rotates slower than swirl
  ring1.rotation.z += 0.002;
  ring2.rotation.z -= 0.001;

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.pos.x += s.dir.x * s.speed;
    s.pos.y += s.dir.y * s.speed;

    const positions = s.mesh.geometry.attributes.position.array;
    positions[0] = s.pos.x;
    positions[1] = s.pos.y;
    positions[3] = s.pos.x + s.dir.x * 12;
    positions[4] = s.pos.y + s.dir.y * 12;
    s.mesh.geometry.attributes.position.needsUpdate = true;

    s.life -= 0.012;
    s.mesh.material.opacity = s.life;

    if (s.life <= 0) {
      scene.remove(s.mesh);
      shootingStars.splice(i, 1);
    }
  }

  updateHeartFormation();
  updateMessages(); // ← called here now ✅
  updateNebulaRain(time);
  const isMoving = isDragging || Math.abs(targetSpherical.theta - spherical.theta) > 0.001;
  updatePhotos(time, isMoving);
  renderer.render(scene, camera);
}

animate();

// ─── RESIZE ───
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── GLOW CLICK DETECTION ───
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const lovePopup = document.getElementById('lovePopup');
const closePopup = document.getElementById('closePopup');

canvas.addEventListener('click', (e) => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(centerGlow);

  if (intersects.length > 0) {
    lovePopup.classList.add('visible');
  }
});

// Hover cue — cursor turns into a pointer when hovering the glow,
// signaling to the user that it's clickable
canvas.addEventListener('mousemove', (e) => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hover = raycaster.intersectObject(centerGlow);

  canvas.style.cursor = hover.length > 0 ? 'pointer' : 'default';
});

closePopup.addEventListener('click', () => {
  lovePopup.classList.remove('visible');
});

// ─── LANTERN PARTICLES BACKGROUND ───
const bgCanvas = document.createElement('canvas');
bgCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
document.body.prepend(bgCanvas);
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const lanterns = [];
for (let i = 0; i < 80; i++) {
  lanterns.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    size: 1.5 + Math.random() * 3,
    speedY: 0.3 + Math.random() * 0.7,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: 0.4 + Math.random() * 0.6,
    twinkle: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? '255,220,100' : '200,255,200'
  });
}

function animateLanterns() {
  requestAnimationFrame(animateLanterns);
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  lanterns.forEach(l => {
    l.twinkle += 0.05;
    l.y -= l.speedY;
    l.x += l.speedX;
    const glow = l.opacity * (0.6 + 0.4 * Math.sin(l.twinkle));

    if (l.y < -10) {
      l.y = bgCanvas.height + 10;
      l.x = Math.random() * bgCanvas.width;
    }

    const grad = bgCtx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 3);
    grad.addColorStop(0, `rgba(${l.color},${glow})`);
    grad.addColorStop(1, `rgba(${l.color},0)`);
    bgCtx.beginPath();
    bgCtx.arc(l.x, l.y, l.size * 3, 0, Math.PI * 2);
    bgCtx.fillStyle = grad;
    bgCtx.fill();
  });
}

animateLanterns();

window.addEventListener('resize', () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});

// ═══════════════════════════════════════════
// INTRO SEQUENCE (chase cat → greet cat)
// ═══════════════════════════════════════════
const introScreen = document.getElementById('introScreen');
const introCatWrap = document.getElementById('introCatWrap');
const introCatImg = document.getElementById('introCatImg');
const introSpeech = document.getElementById('introSpeech');
const quizScreen = document.getElementById('quizScreen');
const catScreenEl = document.getElementById('catScreen');

// Hide quiz + cat screens at start; only intro shows
quizScreen.classList.add('hidden');
catScreenEl.classList.add('hidden');

const chaseLines = [
  "Meow meow meow",
  "Ugh! What is this I can't meow meow",
  "Here ya go meow meow",
  "Where ya going meow",
  "Chump chump chump meow",
  "Come here! Meow!"
];

const greetLines = [
  "Oh finally! Here you are mah love",
  "Welcome to my meow meow meow",
  "Now listen carefully",
  "Meow meow meow meow meow meow",
  "Did you get it meow?",
  "WAHAHAHAHAHAHA"
];

function showIntroLine(text) {
  introSpeech.style.opacity = '0';
  setTimeout(() => {
    introSpeech.textContent = text;
    introSpeech.style.opacity = '1';
  }, 300);
}

function playIntroLines(lines, onDone) {
  let i = 0;
  showIntroLine(lines[i]);
  i++;
  const interval = setInterval(() => {
    if (i >= lines.length) {
      clearInterval(interval);
      setTimeout(onDone, 2000);
      return;
    }
    showIntroLine(lines[i]);
    i++;
  }, 2200);
}

function startIntroSequence() {
  introCatWrap.classList.add('chasing');
  playIntroLines(chaseLines, () => {
    // Switch to greet cat, stop chasing animation
    introCatWrap.classList.remove('chasing');
    introCatImg.src = 'greetcat.gif';
    playIntroLines(greetLines, () => {
      // Transition to quiz
      introScreen.style.opacity = '0';
      setTimeout(() => {
        introScreen.classList.add('hidden');
        startQuiz();
      }, 600);
    });
  });
}

const tapOverlay = document.getElementById('tapToStart');

// Always show tap screen — guarantees music plays on all mobile browsers
document.getElementById('tapBtn').addEventListener('click', () => {
  tapOverlay.classList.add('hidden');
  setTimeout(() => tapOverlay.remove(), 700);
  bgMusicPre.volume = 0.5;
  bgMusicPre.play().catch(e => console.log('Pre-music blocked:', e));
  startIntroSequence();
}, { once: true });

// ═══════════════════════════════════════════
// QUIZ SEQUENCE
// ═══════════════════════════════════════════
const quizTitle = document.getElementById('quizTitle');
const quizChoicesEl = document.getElementById('quizChoices');
const quizCatSpeech = document.getElementById('quizCatSpeech');

const quizData = [
  {
    title: "Sport",
    choices: [
      { img: "quiz1_1.jpg", line: "Hehe yey!! Opkors you'd choose that, you know me very well meow meow" },
      { img: "quiz1_2.jpg", line: "Meowwww I don't play that meow ow kinda a lil bit" },
      { img: "quiz1_3.jpg", line: "Meow meow meow nahhhhh mwuahhh" },
      { img: "quiz1_4.jpg", line: "Bola? Bola bola bola bola meow meow!" }
    ]
  },
  {
    title: "Hobby",
    choices: [
      { img: "quiz2_1.jpg", line: "Mah hand is kinda lazy for that meow meow" },
      { img: "quiz2_2.jpg", line: "Scrap book book? Meowwwwwww" },
      { img: "quiz2_3.jpg", line: "Meow yey! Meow yey! Meow yey! That's it!" },
      { img: "quiz2_4.jpg", line: "Mah head hurts for that huhu meow meow meow" }
    ]
  },
  {
    title: "Sawsawan",
    choices: [
      { img: "quiz3_1.jpg", line: "Pait Meow meow meow meow meow meow" },
      { img: "quiz3_2.jpg", line: "Yummy meow! HAHAHAHAHAHAHAHAHAH" }
    ]
  },
  {
    title: "Yanyan's Porma Taste",
    choices: [
      { img: "quiz4_1.jpg", line: "Gisigisi mana HAHAHAHAHAHHA aw oo diay meow meow meow" },
      { img: "quiz4_2.jpg", line: "Not mah style momomomomomomeowwwwwwwww" },
      { img: "quiz4_3.jpg", line: "APPP gamayyyyyyyy HAHAHAHAHAHAHAH" },
      { img: "quiz4_4.jpg", line: "Yessssssssss very good choice that's me meowwwwwwwwww" }
    ]
  },
  {
    title: "Ride",
    choices: [
      { img: "quiz5_1.jpg", line: "Wewsmeow cooooool graghhhhhhh broom broomeow" },
      { img: "quiz5_2.jpg", line: "WAHAHAHAHAHAHAHAHAHAHAHAH roarrrrr aw no meow diay" },
      { img: "quiz5_3.jpg", line: "Oi, aw? Broom broom? nahmeow" }
    ]
  }
];

let quizIndex = 0;
let quizAnswered = false;

function startQuiz() {
  quizScreen.classList.remove('hidden');
  quizScreen.style.opacity = '0';
  requestAnimationFrame(() => { quizScreen.style.opacity = '1'; });
  quizIndex = 0;
  renderQuizItem();
}

function renderQuizItem() {
  quizAnswered = false;
  const item = quizData[quizIndex];
  quizTitle.textContent = item.title;
  quizChoicesEl.innerHTML = '';

  const count = item.choices.length;
  quizChoicesEl.className = '';
  if (count === 2) quizChoicesEl.classList.add('layout-2');
  if (count === 3) quizChoicesEl.classList.add('layout-3');

  item.choices.forEach((choice, i) => {
    const div = document.createElement('div');
    div.className = 'quizChoice';
    div.innerHTML = `<img src="${choice.img}" alt="" />`;
    div.addEventListener('click', () => handleQuizChoice(div, choice));
    quizChoicesEl.appendChild(div);
  });

  // Stable waiting line
  quizCatSpeech.style.opacity = '0';
  setTimeout(() => {
    quizCatSpeech.textContent = "Now mah love let me meow meow you";
    quizCatSpeech.style.opacity = '1';
  }, 300);
}

function handleQuizChoice(chosenEl, choice) {
  if (quizAnswered) return;
  quizAnswered = true;

  const allChoices = quizChoicesEl.querySelectorAll('.quizChoice');
  allChoices.forEach(el => {
    if (el === chosenEl) {
      el.classList.add('chosen');
    } else {
      el.classList.add('faded');
    }
  });

  quizCatSpeech.style.opacity = '0';
  setTimeout(() => {
    quizCatSpeech.textContent = choice.line;
    quizCatSpeech.style.opacity = '1';
  }, 300);

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizData.length) {
      renderQuizItem();
    } else {
      // Quiz finished — transition to existing catch-the-cat screen
      quizScreen.style.opacity = '0';
      setTimeout(() => {
        quizScreen.classList.add('hidden');
        catScreenEl.classList.remove('hidden');
        catScreenEl.style.opacity = '0';
        requestAnimationFrame(() => { catScreenEl.style.opacity = '1'; });
        setTimeout(dancerSayCatchLine, 3000);
      }, 600);
    }
  }, 4000);
}
