// Three.js Game Engine for School Escape Science Quiz

// Global Game State
const state = {
  status: 'START', // START, PLAYING, QUIZ, GAMEOVER, VICTORY
  hearts: 5,
  clearedUnits: {
    unit1: false,
    unit2: false,
    unit3: false,
    unit4: false
  },
  hasKey: false,
  startTime: null,
  activeQuiz: null,
  activeSpecialPuzzle: null,
  invincibleUntil: 0,
  maxStamina: 100,
  stamina: 100,
  staminaRecoverAt: 0,
  isSprinting: false,
  threatLevel: 0,
  ghostTouching: false,
  inventory: {
    classroomClue: false,
    medkitUsed: false,
    musicKey: false,
    fuse: false,
    masterKeyPiece: false
  },
  specialSolved: {
    music: false,
    science: false,
    office: false
  },
  checkpoint: null,
  lastHintAt: 0
};

// 3D Scene setup variables
let scene, camera, renderer;
let walls = [];
let ghosts = [];
let corridorGhost;
let keyMesh;
let flashlight;
let flashlightTarget;
let handheldFlashlight;
let flashlightBeam;
let flashlightGlowSpot;
let flashlightNearLight;
let flashlightHotspotLight;
let classroomLights = [];
let specialObjects = [];
let startGateVisual;
let officeGateVisual;
let clock = new THREE.Clock();

// Controls state
const keys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
let rotY = 0; // Horizontal camera angle (yaw)
let rotX = 0; // Vertical camera angle (pitch)
let cameraHeight = 1.6; // Eye level
let mouseSpeed = 0.003;
let keyRotateSpeed = 0.03;
let isMobile = false;
const MAX_PITCH = Math.PI / 3; // 60 degrees up/down limit
const WALK_SPEED = 5.2;
const SPRINT_SPEED = 9.6;
const STAMINA_DRAIN_PER_SECOND = 32;
const STAMINA_RECOVER_PER_SECOND = 20;
const STAMINA_RECOVER_DELAY_MS = 650;
const THREAT_WARNING_DISTANCE = 7.5;
const THREAT_MAX_DISTANCE = 13.5;
const THREAT_DANGER_DISTANCE = 3.4;
const START_POSITION = { x: -17.2, z: 2.4, rotY: -Math.PI / 2 };
const CHECKPOINT_POSITION = { x: 1.9, z: -104.5, rotY: Math.PI };
const EXIT_DOOR_Z = -122.2;
const CORRIDOR_GHOST_START_Z = -18;
const GHOST_MIN_X = -2.35;
const GHOST_MAX_X = 2.35;
const GHOST_MIN_Z = -119;
const GHOST_MAX_Z = 32;

// Audio Context
let audioCtx = null;
let bgmNodes = null;
let quizMelodyTimer = null;
let quizNoteIndex = 0;

// Initialize Audio
function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  setupBgmLayers();
}

function playSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong' || type === 'damage') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'unlock') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.setValueAtTime(329.63, now + 0.15); // E4
    osc.frequency.setValueAtTime(392.00, now + 0.3); // G4
    osc.frequency.setValueAtTime(523.25, now + 0.45); // C5
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
    osc.start(now);
    osc.stop(now + 0.7);
  } else if (type === 'start') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.8);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

function setupBgmLayers() {
  if (!audioCtx || bgmNodes) return;

  const horrorGain = audioCtx.createGain();
  const quizGain = audioCtx.createGain();
  const masterGain = audioCtx.createGain();
  horrorGain.gain.value = 0;
  quizGain.gain.value = 0;
  masterGain.gain.value = 0.45;
  horrorGain.connect(masterGain);
  quizGain.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  const droneA = audioCtx.createOscillator();
  const droneB = audioCtx.createOscillator();
  droneA.type = 'sine';
  droneB.type = 'triangle';
  droneA.frequency.value = 42;
  droneB.frequency.value = 57;
  droneA.detune.value = -8;
  droneB.detune.value = 11;
  droneA.connect(horrorGain);
  droneB.connect(horrorGain);
  droneA.start();
  droneB.start();

  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.12;
  }
  const noise = audioCtx.createBufferSource();
  const noiseFilter = audioCtx.createBiquadFilter();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 640;
  noise.connect(noiseFilter);
  noiseFilter.connect(horrorGain);
  noise.start();

  bgmNodes = { horrorGain, quizGain, masterGain, mode: 'none' };
}

function fadeGain(gainNode, target, duration = 0.45) {
  if (!audioCtx || !gainNode) return;
  const now = audioCtx.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(target, now + duration);
}

function switchBgm(mode) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  setupBgmLayers();
  if (!bgmNodes || bgmNodes.mode === mode) return;

  bgmNodes.mode = mode;
  if (mode === 'quiz') {
    fadeGain(bgmNodes.horrorGain, 0.02);
    fadeGain(bgmNodes.quizGain, 0.19);
    startQuizMelody();
  } else if (mode === 'horror') {
    fadeGain(bgmNodes.horrorGain, 0.16);
    fadeGain(bgmNodes.quizGain, 0);
    stopQuizMelody();
  } else {
    fadeGain(bgmNodes.horrorGain, 0);
    fadeGain(bgmNodes.quizGain, 0);
    stopQuizMelody();
  }
}

function startQuizMelody() {
  if (!audioCtx || quizMelodyTimer) return;
  quizNoteIndex = 0;
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25];
  quizMelodyTimer = setInterval(() => {
    if (!audioCtx || !bgmNodes || bgmNodes.mode !== 'quiz') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[quizNoteIndex % notes.length];
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(bgmNodes.quizGain);
    osc.start(now);
    osc.stop(now + 0.25);
    quizNoteIndex++;
  }, 360);
}

function stopQuizMelody() {
  if (quizMelodyTimer) {
    clearInterval(quizMelodyTimer);
    quizMelodyTimer = null;
  }
}

// Start Game Setup
window.addEventListener('DOMContentLoaded', () => {
  // Check touch capability
  isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!isMobile) {
    document.getElementById('virtual-controls').style.display = 'none';
    document.getElementById('virtual-turn-controls').style.display = 'none';
  } else {
    document.getElementById('virtual-controls').style.display = 'flex';
    document.getElementById('virtual-turn-controls').style.display = 'flex';
  }

  // Setup Start Buttons
  document.getElementById('start-btn').addEventListener('click', () => {
    initAudio();
    playSound('start');
    startGame();
  });

  document.getElementById('restart-btn').addEventListener('click', () => {
    resetGame();
  });

  document.getElementById('victory-restart-btn').addEventListener('click', () => {
    resetGame();
  });

  init3D();
  animate();
});

// Setup Three.js scene
function init3D() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03050b);
  scene.fog = new THREE.FogExp2(0x03050b, 0.022);

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.rotation.order = 'YXZ'; // FPS-style: yaw first, then pitch
  // Spawn player facing down corridor
  camera.position.set(0, cameraHeight, 25);
  rotY = 0;
  rotX = 0;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Setup Lights
  const ambientLight = new THREE.AmbientLight(0x151d2d, 0.32);
  scene.add(ambientLight);

  // Hemisphere light for natural sky/ground fill
  const hemiLight = new THREE.HemisphereLight(0x3d526b, 0x05070d, 0.2);
  scene.add(hemiLight);

  // Directional light to simulate hallway overhead fluorescents
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.08);
  dirLight.position.set(0, 10, -30);
  dirLight.castShadow = true;
  scene.add(dirLight);

  createPlayerFlashlight();

  // Corridor Ceiling lights - MORE of them, spread evenly
  createCorridorLight(0, 3, 25);
  createCorridorLight(0, 3, 15);
  createCorridorLight(0, 3, 5);
  createCorridorLight(0, 3, -5);
  createCorridorLight(0, 3, -15);
  createCorridorLight(0, 3, -25);
  createCorridorLight(0, 3, -35);
  createCorridorLight(0, 3, -45);
  createCorridorLight(0, 3, -55);
  createCorridorLight(0, 3, -65);
  createCorridorLight(0, 3, -75);
  createCorridorLight(0, 3, -85);
  createCorridorLight(0, 3, -95);
  createCorridorLight(0, 3, -105);
  createCorridorLight(0, 3, -115);

  // Classroom interior lights (one per classroom)
  createClassroomLight(-12, 3, -5);   // Classroom 1
  createClassroomLight(12, 3, -25);   // Classroom 2
  createClassroomLight(-12, 3, -45);  // Classroom 3
  createClassroomLight(12, 3, -65);   // Classroom 4
  createClassroomLight(-12, 3, -85);  // Infirmary
  createClassroomLight(12, 3, -85);   // Music room
  createClassroomLight(-12, 3, -107); // Science room
  createClassroomLight(12, 3, -107);  // Teacher office

  // Build the Map
  buildSchoolMap();

  // Listeners
  window.addEventListener('resize', onWindowResize);
  setupInputListeners();
}

function createCorridorLight(x, y, z) {
  const pointLight = new THREE.PointLight(0xddeeff, 0.58, 17);
  pointLight.position.set(x, y, z);
  pointLight.castShadow = true;
  pointLight.shadow.bias = -0.002;
  scene.add(pointLight);

  // Small visible bulb
  const geo = new THREE.SphereGeometry(0.15, 8, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);

  classroomLights.push({ light: pointLight, mesh: mesh, baseIntensity: 0.58, baseZ: z });
}

function createClassroomLight(x, y, z) {
  const pointLight = new THREE.PointLight(0xffeedd, 0.78, 16);
  pointLight.position.set(x, y, z);
  scene.add(pointLight);

  const geo = new THREE.SphereGeometry(0.2, 8, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffee });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}

function createPlayerFlashlight() {
  flashlight = new THREE.SpotLight(0xfff1bd, 58, 115, Math.PI / 3.4, 0.34, 0.45);
  flashlight.castShadow = true;
  flashlight.shadow.bias = -0.002;
  flashlightTarget = new THREE.Object3D();
  scene.add(flashlight);
  scene.add(flashlightTarget);
  flashlight.target = flashlightTarget;

  flashlightNearLight = new THREE.PointLight(0xfff1bd, 2.4, 9, 0.8);
  scene.add(flashlightNearLight);

  flashlightHotspotLight = new THREE.PointLight(0xffe7a6, 13.5, 34, 0.82);
  scene.add(flashlightHotspotLight);

  handheldFlashlight = new THREE.Group();
  handheldFlashlight.position.set(0.38, -0.32, -0.68);
  handheldFlashlight.rotation.set(-0.08, -0.12, 0.02);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b2534, metalness: 0.45, roughness: 0.35 });
  const lensMat = new THREE.MeshStandardMaterial({ color: 0xfff1bd, emissive: 0xfff2a8, emissiveIntensity: 1.45, roughness: 0.16 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.44, 16), bodyMat);
  body.rotation.x = Math.PI / 2;
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.035, 16), lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = -0.24;

  handheldFlashlight.add(body);
  handheldFlashlight.add(lens);
  camera.add(handheldFlashlight);

  const beamLength = 15.5;
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff3b0,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    fog: false
  });
  beamMat.userData.baseOpacity = 0.12;
  flashlightBeam = new THREE.Mesh(new THREE.ConeGeometry(1.75, beamLength, 32, 1, true), beamMat);
  flashlightBeam.rotation.x = Math.PI / 2;
  flashlightBeam.position.set(0.14, -0.12, -beamLength / 2 - 0.8);
  flashlightBeam.renderOrder = 2;
  camera.add(flashlightBeam);

  const glowMap = createGlowTexture('rgba(255, 245, 185, 0.58)', 'rgba(255, 245, 185, 0)');
  const glowMat = new THREE.SpriteMaterial({
    map: glowMap,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    fog: false
  });
  flashlightGlowSpot = new THREE.Sprite(glowMat);
  flashlightGlowSpot.position.set(0, 0, -19.5);
  flashlightGlowSpot.scale.set(3.15, 3.15, 1);
  flashlightGlowSpot.renderOrder = 4;
  camera.add(flashlightGlowSpot);
}

// Build School Corridor, Classrooms, and Props
function buildSchoolMap() {
  const textureLoader = new THREE.TextureLoader();

  // Textures
  const wallTex = textureLoader.load('assets/wall_texture.png');
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(1, 1);
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xb8c7d9,
    emissive: 0x202a3a,
    emissiveIntensity: 0.22,
    roughness: 0.82
  });
  const wallEdgeMat = new THREE.LineBasicMaterial({
    color: 0xa9c8ff,
    transparent: true,
    opacity: 0.34,
    fog: false
  });

  const floorTex = textureLoader.load('assets/floor_texture.png');
  floorTex.wrapS = THREE.RepeatWrapping;
  floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(12, 100);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0x8f9caf,
    emissive: 0x070b11,
    emissiveIntensity: 0.08,
    roughness: 0.9
  });

  const doorTex = textureLoader.load('assets/door_texture.png');
  const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.7 });

  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.9 });

  // Main Floor & Ceiling (Length from Z=45 to Z=-145)
  const floorGeo = new THREE.PlaneGeometry(50, 190);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -50);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 4, -50);
  scene.add(ceiling);

  // Helper to create walls
  function addWall(x, z, w, h, d, material, rotYAngle = 0) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, h/2, z);
    mesh.rotation.y = rotYAngle;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), wallEdgeMat);
    edges.position.copy(mesh.position);
    edges.rotation.copy(mesh.rotation);
    edges.renderOrder = 6;
    scene.add(edges);

    // Bounding Box for Collision
    walls.push({
      minX: x - (rotYAngle === 0 ? w/2 : d/2) - 0.2,
      maxX: x + (rotYAngle === 0 ? w/2 : d/2) + 0.2,
      minZ: z - (rotYAngle === 0 ? d/2 : w/2) - 0.2,
      maxZ: z + (rotYAngle === 0 ? d/2 : w/2) + 0.2
    });
    return mesh;
  }

  function addSideRoom(side, centerZ, label, color) {
    const outerX = side * 20.2;
    const roomX = side * 12.2;
    const corridorX = side * 4.2;
    addWall(outerX, centerZ, 0.4, 4, 20.4, wallMat);
    addWall(roomX, centerZ + 10.2, 16.4, 4, 0.4, wallMat);
    addWall(roomX, centerZ - 10.2, 16.4, 4, 0.4, wallMat);
    addWall(corridorX, centerZ + 7, 0.4, 4, 6.4, wallMat);
    addWall(corridorX, centerZ - 7, 0.4, 4, 6.4, wallMat);
    addClassroomDoor(corridorX, centerZ, label, color);
  }

  // Corridor walls (Corridor is 8 units wide: X = -4 to 4)
  // Wall sections are split so classroom and special-room door gaps are truly walkable.
  addWall(-4.2, 20, 0.4, 4, 30, wallMat);
  addWall(-4.2, -25, 0.4, 4, 19.2, wallMat);
  addWall(-4.2, -65, 0.4, 4, 19.2, wallMat);
  addWall(-4.2, -121.2, 0.4, 4, 8, wallMat);

  addWall(4.2, 20, 0.4, 4, 30, wallMat);
  addWall(4.2, -4.8, 0.4, 4, 19.6, wallMat);
  addWall(4.2, -45, 0.4, 4, 19.2, wallMat);
  addWall(4.2, -121.2, 0.4, 4, 8, wallMat);

  // Corridor end caps
  addWall(0, 35.2, 8.8, 4, 0.4, wallMat); // Start boundary wall

  // Classroom 1 (Unit 1: Acid/Base) - Left side, Z range 5 to -15, entrance around Z=-5
  // Left boundary: X = -20
  addWall(-20.2, -5, 0.4, 4, 20.4, wallMat); // Left wall
  addWall(-12.2, 5.2, 16.4, 4, 0.4, wallMat); // Front wall
  addWall(-12.2, -15.2, 16.4, 4, 0.4, wallMat); // Back wall
  // Inner corridor walls with door gap
  addWall(-4.2, 2, 0.4, 4, 6.4, wallMat); 
  addWall(-4.2, -12, 0.4, 4, 6.4, wallMat);
  // Door mesh (can walk through it, triggers classroom entry)
  addClassroomDoor(-4.2, -5, "1단원: 산과 염기", 0x00b4d8);

  // Classroom 2 (Unit 2: Motion) - Right side, Z range -15 to -35, entrance around Z=-25
  addWall(20.2, -25, 0.4, 4, 20.4, wallMat);
  addWall(12.2, -14.8, 16.4, 4, 0.4, wallMat);
  addWall(12.2, -35.2, 16.4, 4, 0.4, wallMat);
  addWall(4.2, -18, 0.4, 4, 6.4, wallMat);
  addWall(4.2, -32, 0.4, 4, 6.4, wallMat);
  addClassroomDoor(4.2, -25, "2단원: 물체의 운동", 0xffb703);

  // Classroom 3 (Unit 3: Plant) - Left side, Z range -35 to -55, entrance around Z=-45
  addWall(-20.2, -45, 0.4, 4, 20.4, wallMat);
  addWall(-12.2, -34.8, 16.4, 4, 0.4, wallMat);
  addWall(-12.2, -55.2, 16.4, 4, 0.4, wallMat);
  addWall(-4.2, -38, 0.4, 4, 6.4, wallMat);
  addWall(-4.2, -52, 0.4, 4, 6.4, wallMat);
  addClassroomDoor(-4.2, -45, "3단원: 식물 구조/기능", 0x38b000);

  // Classroom 4 (Unit 4: Earth) - Right side, Z range -55 to -75, entrance around Z=-65
  addWall(20.2, -65, 0.4, 4, 20.4, wallMat);
  addWall(12.2, -54.8, 16.4, 4, 0.4, wallMat);
  addWall(12.2, -75.2, 16.4, 4, 0.4, wallMat);
  addWall(4.2, -58, 0.4, 4, 6.4, wallMat);
  addWall(4.2, -72, 0.4, 4, 6.4, wallMat);
  addClassroomDoor(4.2, -65, "4단원: 지구의 운동", 0x9d4edd);

  // Special rooms for the extended escape route
  addSideRoom(-1, -85, "보건실", 0xff4d6d);
  addSideRoom(1, -85, "음악실", 0xffb703);
  addSideRoom(-1, -107, "과학실", 0x00b4d8);
  addSideRoom(1, -107, "교무실", 0x38b000);

  startGateVisual = createGateMarker(-4.2, -5, "단서 필요", 0xff4d6d);
  walls.push({
    minX: -4.95, maxX: -3.45,
    minZ: -8.8, maxZ: -1.2,
    gate: 'startClue'
  });

  officeGateVisual = createGateMarker(4.2, -107, "교무실 잠김", 0xffb703);
  walls.push({
    minX: 3.45, maxX: 4.95,
    minZ: -110.8, maxZ: -103.2,
    gate: 'office'
  });

  // Corridor End: Back Exit Door
  addWall(-2.5, EXIT_DOOR_Z, 3.8, 4, 0.4, wallMat);
  addWall(2.5, EXIT_DOOR_Z, 3.8, 4, 0.4, wallMat);

  // Interactive Exit Door Mesh
  const exitDoorGeo = new THREE.BoxGeometry(1.6, 2.8, 0.15);
  const exitDoorMesh = new THREE.Mesh(exitDoorGeo, doorMat);
  exitDoorMesh.position.set(0, 1.4, EXIT_DOOR_Z);
  exitDoorMesh.castShadow = true;
  exitDoorMesh.name = "EXIT_DOOR";
  scene.add(exitDoorMesh);
  // Add collision box for exit door
  walls.push({
    minX: -0.9, maxX: 0.9,
    minZ: EXIT_DOOR_Z - 0.2, maxZ: EXIT_DOOR_Z + 0.2,
    isExitDoor: true
  });

  // Above Exit door sign
  createLabelSign(0, 3.2, EXIT_DOOR_Z + 0.1, "뒷문 EXIT", 0xff4d6d);

  // Alternating locker blocks create a light maze path through the corridor.
  createLockerBlock(-2.85, 12, 1.05, 6.0);
  createLockerBlock(2.85, -8, 1.05, 6.0);
  createLockerBlock(-2.85, -28, 1.05, 6.0);
  createLockerBlock(2.85, -48, 1.05, 6.0);
  createLockerBlock(-2.85, -68, 1.05, 5.2);

  // Classroom Decorations (Interactive features and themes)
  // Classroom 1 (Chemistry theme): colored cylinders representing test tubes/beakers
  createTable(-12, -7, 0xff0055);
  createTable(-15, -3, 0x00ffcc);
  createTable(-10, -10, 0x9d4edd);

  // Classroom 2 (Motion theme): rolling spheres on tables and ramps
  createTable(12, -22, 0xdddddd, 'sphere');
  createTable(15, -28, 0xdddddd, 'sphere');

  // Classroom 3 (Plant theme): potted green boxes
  createTable(-12, -42, 0x38b000, 'plant');
  createTable(-15, -48, 0x38b000, 'plant');

  // Classroom 4 (Earth theme): large spinning globe in the middle
  createGlobe(13, 1.2, -65);

  // Special-room interactive objects
  createStartClue(-15.1, 2.2);
  createMedkitStation(-12.5, -85);
  createMusicStation(12.4, -85);
  createScienceStation(-12.4, -107);
  createOfficeStation(12.4, -107);

  // Create Static Classroom Quiz Ghosts
  createQuizGhost(-13, 1.2, -5, 'unit1');
  createQuizGhost(13, 1.2, -25, 'unit2');
  createQuizGhost(-13, 1.2, -45, 'unit3');
  createQuizGhost(13, 1.2, -65, 'unit4');

  // Create chasing corridor ghost
  createCorridorGhostEntity();
}

function addClassroomDoor(x, z, label, color) {
  // A wooden door mesh frame on the wall
  const textureLoader = new THREE.TextureLoader();
  const doorTex = textureLoader.load('assets/door_texture.png');
  const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.7 });

  const doorGeo = new THREE.BoxGeometry(0.15, 2.8, 1.6);
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(x, 1.4, z);
  scene.add(door);

  // Sign board above door
  createLabelSign(x + (x > 0 ? -0.15 : 0.15), 3.1, z, label, color, Math.PI / 2);
}

function createLabelSign(x, y, z, text, colorCode, rotYAngle = 0) {
  // Draw label on 2D canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(7, 9, 19, 0.9)';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = `#${colorCode.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 120);

  ctx.font = 'bold 36px "Noto Sans KR", Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 10;
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const planeGeo = new THREE.PlaneGeometry(2.4, 0.6);
  const mesh = new THREE.Mesh(planeGeo, material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotYAngle;
  scene.add(mesh);
}

function createGlowTexture(innerColor, outerColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.35, innerColor);
  gradient.addColorStop(1, outerColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function createTextSprite(text, colorCode) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const color = `#${colorCode.toString(16).padStart(6, '0')}`;

  ctx.fillStyle = 'rgba(7, 9, 19, 0.88)';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.font = 'bold 44px "Noto Sans KR", Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 256, 66);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    fog: false,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 8;
  sprite.scale.set(3.2, 0.8, 1);
  return sprite;
}

function createGateMarker(x, z, text, colorCode) {
  const color = `#${colorCode.toString(16).padStart(6, '0')}`;
  const material = new THREE.MeshBasicMaterial({
    color: colorCode,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
    fog: false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.35), material);
  mesh.position.set(x, 1.35, z);
  mesh.rotation.y = Math.PI / 2;
  mesh.renderOrder = 5;
  scene.add(mesh);

  const label = createTextSprite(text, colorCode);
  label.position.set(x + (x > 0 ? -0.75 : 0.75), 2.85, z);
  scene.add(label);

  return { mesh, label, color };
}

function setGateVisible(gate, visible) {
  if (!gate) return;
  gate.mesh.visible = visible;
  gate.label.visible = visible;
}

function registerSpecialObject(id, type, group, x, z, radius = 2.1) {
  specialObjects.push({
    id,
    type,
    group,
    position: new THREE.Vector3(x, 1.0, z),
    radius
  });
}

function setGroupVisible(group, visible) {
  if (!group) return;
  group.visible = visible;
  group.traverse((child) => {
    child.visible = visible;
  });
}

function createStartClue(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x57412d, roughness: 0.82 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xfff8d6, emissive: 0xffd166, emissiveIntensity: 0.38, roughness: 0.55 });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.14, 0.8), deskMat);
  desk.position.y = 0.72;
  group.add(desk);
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.035, 0.42), paperMat);
  paper.position.set(0, 0.82, 0);
  group.add(paper);
  const label = createTextSprite('첫 단서', 0xffb703);
  label.position.set(0, 1.55, 0);
  label.scale.set(2.0, 0.5, 1);
  group.add(label);
  scene.add(group);
  registerSpecialObject('classroomClue', 'pickup', group, x, z, 1.45);
}

function createMedkitStation(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.45, emissive: 0x441111, emissiveIntensity: 0.08 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.4, emissive: 0xff4d6d, emissiveIntensity: 0.2 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.58), boxMat);
  box.position.y = 0.72;
  group.add(box);
  const crossA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.42), redMat);
  const crossB = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.12), redMat);
  crossA.position.set(0, 0.96, 0);
  crossB.position.set(0, 0.965, 0);
  group.add(crossA);
  group.add(crossB);
  const label = createTextSprite('구급상자', 0xff4d6d);
  label.position.set(0, 1.55, 0);
  label.scale.set(2.2, 0.55, 1);
  group.add(label);
  scene.add(group);
  registerSpecialObject('medkit', 'medkit', group, x, z, 2.0);
}

function createMusicStation(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const pianoMat = new THREE.MeshStandardMaterial({ color: 0x0c0e14, roughness: 0.38, metalness: 0.18 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.34 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.42 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.75), pianoMat);
  body.position.y = 0.72;
  group.add(body);
  for (let i = 0; i < 7; i++) {
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.42), whiteMat);
    key.position.set(-0.72 + i * 0.24, 1.0, 0.02);
    group.add(key);
  }
  for (let i = 0; i < 5; i++) {
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.24), blackMat);
    key.position.set(-0.6 + i * 0.3, 1.04, -0.05);
    group.add(key);
  }
  const label = createTextSprite('피아노 퍼즐', 0xffb703);
  label.position.set(0, 1.7, 0);
  label.scale.set(2.35, 0.55, 1);
  group.add(label);
  scene.add(group);
  registerSpecialObject('music', 'puzzle', group, x, z, 2.2);
}

function createScienceStation(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x26364a, roughness: 0.62 });
  const fluidMat = new THREE.MeshStandardMaterial({ color: 0x00b4d8, transparent: true, opacity: 0.75, emissive: 0x0077b6, emissiveIntensity: 0.22 });
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.8), tableMat);
  table.position.y = 0.72;
  group.add(table);
  for (let i = 0; i < 3; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.48, 14), fluidMat);
    tube.position.set(-0.42 + i * 0.42, 1.02, 0);
    group.add(tube);
  }
  const label = createTextSprite('과학실 암호', 0x00b4d8);
  label.position.set(0, 1.7, 0);
  label.scale.set(2.35, 0.55, 1);
  group.add(label);
  scene.add(group);
  registerSpecialObject('science', 'puzzle', group, x, z, 2.2);
}

function createOfficeStation(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x4b372a, roughness: 0.72 });
  const safeMat = new THREE.MeshStandardMaterial({ color: 0x2b3445, roughness: 0.36, metalness: 0.35 });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.18, 0.9), deskMat);
  desk.position.y = 0.72;
  group.add(desk);
  const safe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.55, 0.52), safeMat);
  safe.position.set(0, 1.04, 0);
  group.add(safe);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.035, 16), new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.8, roughness: 0.18 }));
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0, 1.05, -0.28);
  group.add(knob);
  const label = createTextSprite('교무실 금고', 0x38b000);
  label.position.set(0, 1.78, 0);
  label.scale.set(2.35, 0.55, 1);
  group.add(label);
  scene.add(group);
  registerSpecialObject('office', 'puzzle', group, x, z, 2.2);
}

function createTable(x, z, propColor, propType = 'beaker') {
  // Table
  const tableGroup = new THREE.Group();
  tableGroup.position.set(x, 0, z);

  const topGeo = new THREE.BoxGeometry(2, 0.1, 1.2);
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
  const top = new THREE.Mesh(topGeo, woodMat);
  top.position.y = 0.8;
  top.castShadow = true;
  top.receiveShadow = true;
  tableGroup.add(top);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
  for (let lx of [-0.9, 0.9]) {
    for (let lz of [-0.5, 0.5]) {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.4, lz);
      leg.castShadow = true;
      tableGroup.add(leg);
    }
  }

  // Props on table
  if (propType === 'beaker') {
    const beakerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.35, 12);
    const beakerMat = new THREE.MeshStandardMaterial({ color: propColor, transparent: true, opacity: 0.8, roughness: 0.1 });
    const beaker = new THREE.Mesh(beakerGeo, beakerMat);
    beaker.position.set(0, 0.98, 0);
    beaker.castShadow = true;
    tableGroup.add(beaker);
  } else if (propType === 'sphere') {
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.2 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(0, 1.03, 0);
    sphere.castShadow = true;
    tableGroup.add(sphere);
  } else if (propType === 'plant') {
    const potGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.25, 8);
    const potMat = new THREE.MeshStandardMaterial({ color: 0x8d99ae });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0, 0.925, 0);
    tableGroup.add(pot);

    const plantGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.9 });
    const plant = new THREE.Mesh(plantGeo, plantMat);
    plant.position.set(0, 1.15, 0);
    tableGroup.add(plant);
  }

  scene.add(tableGroup);

  // Bounding box table
  walls.push({
    minX: x - 1.1,
    maxX: x + 1.1,
    minZ: z - 0.7,
    maxZ: z + 0.7
  });
}

function createGlobe(x, y, z) {
  const globeGroup = new THREE.Group();
  globeGroup.position.set(x, y, z);

  const globeGeo = new THREE.SphereGeometry(0.8, 24, 24);
  const globeMat = new THREE.MeshStandardMaterial({ color: 0x1d3557, roughness: 0.6, metalness: 0.1 });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeMesh.name = "SPINNING_GLOBE";
  globeGroup.add(globeMesh);

  // Stand
  const standGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2);
  const standMat = new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.8, roughness: 0.2 });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, -0.6, 0);
  globeGroup.add(stand);

  scene.add(globeGroup);
  walls.push({
    minX: x - 1.0,
    maxX: x + 1.0,
    minZ: z - 1.0,
    maxZ: z + 1.0
  });
}

function createLockerBlock(x, z, width, depth) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const lockerMat = new THREE.MeshStandardMaterial({ color: 0x26364a, roughness: 0.72, metalness: 0.18 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x101722, roughness: 0.8 });
  const block = new THREE.Mesh(new THREE.BoxGeometry(width, 2.45, depth), lockerMat);
  block.position.y = 1.225;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  const doorCount = Math.max(2, Math.floor(depth / 1.2));
  for (let i = 0; i < doorCount; i++) {
    const zOffset = -depth / 2 + 0.55 + i * (depth - 1.1) / Math.max(1, doorCount - 1);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(width + 0.015, 2.1, 0.035), edgeMat);
    seam.position.set(0, 1.25, zOffset);
    group.add(seam);
  }

  scene.add(group);
  walls.push({
    minX: x - width / 2 - 0.12,
    maxX: x + width / 2 + 0.12,
    minZ: z - depth / 2 - 0.12,
    maxZ: z + depth / 2 + 0.12
  });
}

// Create Quiz Ghosts
function createQuizGhost(x, y, z, unitId) {
  const textureLoader = new THREE.TextureLoader();
  const ghostMap = textureLoader.load('assets/ghost.png');
  // Glow effect material
  const ghostMat = new THREE.SpriteMaterial({
    map: ghostMap,
    transparent: true,
    color: 0xffffff,
    fog: false
  });
  const sprite = new THREE.Sprite(ghostMat);
  sprite.position.set(x, y, z);
  sprite.scale.set(2.35, 2.35, 2.35);
  scene.add(sprite);

  // Add small hovering light to spotlight the ghost
  const ghostLight = new THREE.PointLight(0x00b4d8, 1.15, 13);
  ghostLight.position.set(x, y + 1.0, z);
  scene.add(ghostLight);

  ghosts.push({
    sprite: sprite,
    light: ghostLight,
    baseY: y,
    unitId: unitId,
    solved: false,
    currentQuestionIndex: 0
  });
}

// Create chasing corridor ghost
function createCorridorGhostEntity() {
  const textureLoader = new THREE.TextureLoader();
  const ghostMap = textureLoader.load('assets/ghost.png');
  const ghostMat = new THREE.SpriteMaterial({
    map: ghostMap,
    transparent: true,
    color: 0xffffff,
    fog: false,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(ghostMat);
  sprite.position.set(0, 1.3, CORRIDOR_GHOST_START_Z);
  sprite.scale.set(3.3, 3.3, 3.3);
  sprite.renderOrder = 10;
  scene.add(sprite);

  const auraMap = createGlowTexture('rgba(255, 77, 109, 0.9)', 'rgba(255, 77, 109, 0)');
  const auraMat = new THREE.SpriteMaterial({
    map: auraMap,
    transparent: true,
    blending: THREE.AdditiveBlending,
    fog: false,
    depthTest: false,
    depthWrite: false
  });
  const aura = new THREE.Sprite(auraMat);
  aura.position.set(0, 1.35, CORRIDOR_GHOST_START_Z);
  aura.scale.set(5.0, 5.0, 5.0);
  aura.renderOrder = 9;
  scene.add(aura);

  const ringGeo = new THREE.RingGeometry(1.2, 1.75, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff4d6d,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    fog: false,
    depthTest: false,
    depthWrite: false
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.045, CORRIDOR_GHOST_START_Z);
  ring.renderOrder = 7;
  scene.add(ring);

  const label = createTextSprite('유령 선생님', 0xff4d6d);
  label.position.set(0, 3.55, CORRIDOR_GHOST_START_Z);
  scene.add(label);

  const light = new THREE.PointLight(0xff4d6d, 2.3, 22);
  light.position.set(0, 2.3, CORRIDOR_GHOST_START_Z);
  scene.add(light);

  corridorGhost = {
    sprite: sprite,
    aura: aura,
    ring: ring,
    label: label,
    light: light,
    speed: 3.15 // units per second
  };
}

// Generate escape key model when unlocked
function spawnKeyInScene() {
  const textureLoader = new THREE.TextureLoader();
  const keyMap = textureLoader.load('assets/key.png');
  const keyMat = new THREE.SpriteMaterial({ map: keyMap, transparent: true });
  const sprite = new THREE.Sprite(keyMat);
  // Position right in front of exit door
  sprite.position.set(0, 1.4, EXIT_DOOR_Z + 1.7);
  sprite.scale.set(1.0, 1.0, 1.0);
  scene.add(sprite);

  const light = new THREE.PointLight(0xffb703, 1.0, 5);
  light.position.set(0, 1.4, EXIT_DOOR_Z + 1.7);
  scene.add(light);

  keyMesh = {
    sprite: sprite,
    light: light,
    baseY: 1.4
  };
}

// Input Handlers
function setupInputListeners() {
  // Key press
  window.addEventListener('keydown', (e) => {
    if (state.status !== 'PLAYING') return;
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = true;
    if (key === 's' || key === 'arrowdown') keys.s = true;
    if (key === 'a') keys.a = true;
    if (key === 'd') keys.d = true;
    if (key === 'q' || key === 'arrowleft') keys.q = true;
    if (key === 'e' || key === 'arrowright') keys.e = true;
    if (key === 'shift') keys.shift = true;
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = false;
    if (key === 's' || key === 'arrowdown') keys.s = false;
    if (key === 'a') keys.a = false;
    if (key === 'd') keys.d = false;
    if (key === 'q' || key === 'arrowleft') keys.q = false;
    if (key === 'e' || key === 'arrowright') keys.e = false;
    if (key === 'shift') keys.shift = false;
  });

  // Mouse drag to look around (both horizontal AND vertical)
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  window.addEventListener('mousedown', (e) => {
    if (state.status !== 'PLAYING') return;
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || state.status !== 'PLAYING') return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    rotY -= deltaX * mouseSpeed;
    rotX -= deltaY * mouseSpeed;
    rotX = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, rotX)); // Clamp pitch
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch screen dragging for mobile look (both horizontal AND vertical)
  let prevTouchX = 0;
  let prevTouchY = 0;
  window.addEventListener('touchstart', (e) => {
    if (state.status !== 'PLAYING') return;
    if (e.touches.length > 0) {
      isDragging = true;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || state.status !== 'PLAYING') return;
    if (e.touches.length > 0) {
      const deltaX = e.touches[0].clientX - prevTouchX;
      const deltaY = e.touches[0].clientY - prevTouchY;
      rotY -= deltaX * mouseSpeed * 1.5;
      rotX -= deltaY * mouseSpeed * 1.5;
      rotX = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, rotX)); // Clamp pitch
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Virtual Joypad buttons for touch devices
  setupVirtualButton('btn-forward', 'w');
  setupVirtualButton('btn-back', 's');
  setupVirtualButton('btn-left', 'a');
  setupVirtualButton('btn-right', 'd');
  setupVirtualButton('btn-turn-left', 'q');
  setupVirtualButton('btn-turn-right', 'e');
}

function setupVirtualButton(id, keyStr) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys[keyStr] = true;
  });
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys[keyStr] = false;
  });
}

// Resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Game State Operations
function createDefaultInventory() {
  return {
    classroomClue: false,
    medkitUsed: false,
    musicKey: false,
    fuse: false,
    masterKeyPiece: false
  };
}

function createDefaultSpecialSolved() {
  return {
    music: false,
    science: false,
    office: false
  };
}

function cloneProgressSnapshot() {
  return {
    clearedUnits: { ...state.clearedUnits },
    inventory: { ...state.inventory },
    specialSolved: { ...state.specialSolved },
    hasKey: state.hasKey,
    startTime: state.startTime
  };
}

function applyPlayerPose(pose) {
  camera.position.set(pose.x, cameraHeight, pose.z);
  rotY = pose.rotY;
  rotX = 0;
  camera.rotation.set(rotX, rotY, 0);
}

function resetCorridorGhost(z = CORRIDOR_GHOST_START_Z) {
  corridorGhost.sprite.position.set(0, 1.3, z);
  corridorGhost.aura.position.set(0, 1.35, z);
  corridorGhost.ring.position.set(0, 0.045, z);
  corridorGhost.label.position.set(0, 3.55, z);
  corridorGhost.light.position.set(0, 2.3, z);
  corridorGhost.sprite.visible = true;
  corridorGhost.aura.visible = true;
  corridorGhost.ring.visible = true;
  corridorGhost.label.visible = true;
  corridorGhost.light.visible = true;
}

function refreshQuizGhostsFromProgress() {
  ghosts.forEach(g => {
    const solved = Boolean(state.clearedUnits[g.unitId]);
    g.solved = solved;
    g.currentQuestionIndex = solved ? questionsDB[g.unitId].questions.length : 0;
    g.sprite.material.color.setHex(solved ? 0x38b000 : 0xffffff);
    g.light.color.setHex(solved ? 0x38b000 : 0x00b4d8);
  });
}

function updateSpecialObjectVisibility() {
  specialObjects.forEach(obj => {
    let visible = true;
    if (obj.id === 'classroomClue') visible = !state.inventory.classroomClue;
    if (obj.id === 'medkit') visible = !state.inventory.medkitUsed;
    if (obj.id === 'music') visible = !state.specialSolved.music;
    if (obj.id === 'science') visible = !state.specialSolved.science;
    if (obj.id === 'office') visible = !state.specialSolved.office;
    setGroupVisible(obj.group, visible);
  });

  setGateVisible(startGateVisual, !state.inventory.classroomClue);
  setGateVisible(officeGateVisual, !(state.inventory.musicKey && state.inventory.fuse));
}

function removeSceneKey() {
  if (keyMesh) {
    scene.remove(keyMesh.sprite);
    scene.remove(keyMesh.light);
    keyMesh = null;
  }
}

function createOfficeCheckpoint() {
  state.checkpoint = cloneProgressSnapshot();
  showToastNotification('교무실 체크포인트 저장! 다음 게임오버 후 여기서 다시 시작합니다.');
}

function restoreCheckpoint() {
  const checkpoint = state.checkpoint;
  if (!checkpoint) {
    startGame();
    return;
  }

  state.status = 'PLAYING';
  state.hearts = 5;
  state.hasKey = checkpoint.hasKey;
  state.startTime = checkpoint.startTime || Date.now();
  state.clearedUnits = { ...checkpoint.clearedUnits };
  state.inventory = { ...checkpoint.inventory };
  state.specialSolved = { ...checkpoint.specialSolved };
  state.activeQuiz = null;
  state.activeSpecialPuzzle = null;
  state.stamina = state.maxStamina;
  state.staminaRecoverAt = 0;
  state.isSprinting = false;
  state.threatLevel = 0;
  state.ghostTouching = false;
  state.lastHintAt = 0;
  state.invincibleUntil = Date.now() + 1200;
  for (let k in keys) keys[k] = false;

  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');

  refreshQuizGhostsFromProgress();
  resetCorridorGhost(-118);
  applyPlayerPose(CHECKPOINT_POSITION);
  removeSceneKey();
  updateSpecialObjectVisibility();
  updateHUD();
  updatePlayerMeters(0);
  updateThreatWarning(Infinity, 0);
  switchBgm('horror');
  showToastNotification('체크포인트에서 재시작했습니다. 하트가 5개로 회복되었습니다.');
}

function startGame() {
  state.status = 'PLAYING';
  state.hearts = 5;
  state.hasKey = false;
  state.startTime = Date.now();
  state.clearedUnits = { unit1: false, unit2: false, unit3: false, unit4: false };
  state.inventory = createDefaultInventory();
  state.specialSolved = createDefaultSpecialSolved();
  state.checkpoint = null;
  state.activeQuiz = null;
  state.activeSpecialPuzzle = null;
  state.stamina = state.maxStamina;
  state.staminaRecoverAt = 0;
  state.isSprinting = false;
  state.threatLevel = 0;
  state.ghostTouching = false;
  state.invincibleUntil = 0;
  state.lastHintAt = 0;
  for (let k in keys) keys[k] = false;

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');

  updateHUD();
  updatePlayerMeters(0);
  updateThreatWarning(Infinity, 0);

  refreshQuizGhostsFromProgress();
  resetCorridorGhost(CORRIDOR_GHOST_START_Z);
  applyPlayerPose(START_POSITION);
  removeSceneKey();
  updateSpecialObjectVisibility();
  switchBgm('horror');
  showToastNotification('1단원 교실 책상 위의 첫 단서를 찾으세요.');
}

function resetGame() {
  const shouldRestoreCheckpoint = state.status === 'GAMEOVER' && state.checkpoint;
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  if (shouldRestoreCheckpoint) {
    restoreCheckpoint();
  } else {
    startGame();
  }
}

function updateHUD() {
  // Update Hearts
  const hearts = document.querySelectorAll('.hud-heart');
  hearts.forEach((heart, idx) => {
    if (idx < state.hearts) {
      heart.classList.remove('lost');
    } else {
      heart.classList.add('lost');
    }
  });

  // Update Checklist
  updateChecklistItem('chk-unit1', state.clearedUnits.unit1);
  updateChecklistItem('chk-unit2', state.clearedUnits.unit2);
  updateChecklistItem('chk-unit3', state.clearedUnits.unit3);
  updateChecklistItem('chk-unit4', state.clearedUnits.unit4);

  // Update Key Row
  const chkKey = document.getElementById('chk-key');
  if (state.hasKey) {
    chkKey.style.display = 'flex';
  } else {
    chkKey.style.display = 'none';
  }

  updateInventoryItem('inv-clue', state.inventory.classroomClue);
  updateInventoryItem('inv-medkit', state.inventory.medkitUsed);
  updateInventoryItem('inv-music-key', state.inventory.musicKey);
  updateInventoryItem('inv-fuse', state.inventory.fuse);
  updateInventoryItem('inv-master-key', state.inventory.masterKeyPiece);
  updateInventoryItem('inv-checkpoint', Boolean(state.checkpoint));
}

function updateChecklistItem(id, cleared) {
  const item = document.getElementById(id);
  if (cleared) {
    item.classList.add('cleared');
    item.querySelector('.checklist-icon').textContent = '✅';
  } else {
    item.classList.remove('cleared');
    item.querySelector('.checklist-icon').textContent = '⬜';
  }
}

function updateInventoryItem(id, active) {
  const item = document.getElementById(id);
  if (!item) return;
  item.classList.toggle('active', active);
}

function updatePlayerMeters(threatLevel = state.threatLevel) {
  const staminaPercent = Math.round((state.stamina / state.maxStamina) * 100);
  const staminaFill = document.getElementById('stamina-fill');
  const staminaText = document.getElementById('stamina-text');
  if (staminaFill) {
    staminaFill.style.width = `${staminaPercent}%`;
    staminaFill.style.background = staminaPercent < 24
      ? 'linear-gradient(90deg, #ff4d6d, #ffb703)'
      : 'linear-gradient(90deg, #38b000, #ffb703)';
  }
  if (staminaText) {
    staminaText.textContent = `${staminaPercent}%`;
  }

  const lightPercent = Math.round(100 - threatLevel * 55);
  const flashlightFill = document.getElementById('flashlight-fill');
  const flashlightText = document.getElementById('flashlight-text');
  if (flashlightFill) {
    flashlightFill.style.width = `${lightPercent}%`;
  }
  if (flashlightText) {
    flashlightText.textContent = threatLevel > 0.65 ? '축소' : threatLevel > 0.25 ? '불안' : '안정';
  }
}

function updateThreatWarning(distance, threatLevel) {
  const warning = document.getElementById('threat-warning');
  if (!warning) return;

  const shouldWarn = state.status === 'PLAYING' && distance <= THREAT_WARNING_DISTANCE;
  warning.classList.toggle('hidden', !shouldWarn);
  warning.classList.toggle('danger', shouldWarn && distance <= THREAT_DANGER_DISTANCE);

  const vignette = document.getElementById('flashlight-vignette');
  if (vignette) {
    vignette.classList.toggle('narrow', state.status === 'PLAYING' && threatLevel > 0.35);
  }
}

function updateFlashlight(threatLevel, time) {
  if (!flashlight || !flashlightTarget) return;

  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const targetPosition = camera.position.clone().add(forward.clone().multiplyScalar(38));
  flashlight.position.copy(camera.position);
  flashlight.position.y -= 0.08;
  flashlightTarget.position.copy(targetPosition);

  const calmAngle = Math.PI / 3.4;
  const narrowAngle = Math.PI / 5.8;
  flashlight.angle = calmAngle + (narrowAngle - calmAngle) * threatLevel;
  flashlight.distance = 115 - threatLevel * 25;
  flashlight.intensity = 58 - threatLevel * 10 + Math.sin(time * 18) * 0.35;
  flashlightTarget.updateMatrixWorld();

  if (flashlightNearLight) {
    flashlightNearLight.position.copy(camera.position);
    flashlightNearLight.position.y -= 0.28;
    flashlightNearLight.intensity = state.status === 'PLAYING' ? 2.4 - threatLevel * 0.45 : 0;
    flashlightNearLight.distance = 9;
    flashlightNearLight.visible = state.status === 'PLAYING';
  }

  if (flashlightHotspotLight) {
    flashlightHotspotLight.position.copy(camera.position).add(forward.clone().multiplyScalar(13.5));
    flashlightHotspotLight.position.y -= 0.2;
    flashlightHotspotLight.intensity = state.status === 'PLAYING' ? 13.5 - threatLevel * 2.5 : 0;
    flashlightHotspotLight.distance = 34 - threatLevel * 6;
    flashlightHotspotLight.visible = state.status === 'PLAYING';
  }

  const beamWidth = 1 - threatLevel * 0.28;
  const beamPulse = Math.sin(time * 10) * 0.012;
  if (flashlightBeam) {
    flashlightBeam.scale.set(beamWidth, 1, beamWidth);
    flashlightBeam.material.opacity = Math.max(0.07, flashlightBeam.material.userData.baseOpacity + beamPulse - threatLevel * 0.03);
    flashlightBeam.visible = state.status === 'PLAYING';
  }
  if (flashlightGlowSpot) {
    const glowScale = 3.15 - threatLevel * 0.7;
    flashlightGlowSpot.scale.set(glowScale, glowScale, 1);
    flashlightGlowSpot.material.opacity = Math.max(0.14, 0.32 + beamPulse - threatLevel * 0.08);
    flashlightGlowSpot.visible = state.status === 'PLAYING';
  }
}

// Collisions & Movement logic
function checkCollision(x, z) {
  const radius = 0.7; // player bounds
  for (const wall of walls) {
    if (wall.gate === 'startClue' && state.inventory.classroomClue) {
      continue;
    }
    if (wall.gate === 'office' && state.inventory.musicKey && state.inventory.fuse) {
      continue;
    }
    // If it's the Exit door, we block it unless the player has the key
    if (wall.isExitDoor && state.hasKey) {
      continue; // Let them through!
    }
    if (x + radius > wall.minX && x - radius < wall.maxX &&
        z + radius > wall.minZ && z - radius < wall.maxZ) {
      return true;
    }
  }
  return false;
}

// Damage response
function takeDamage() {
  if (Date.now() < state.invincibleUntil) return;

  state.hearts--;
  state.invincibleUntil = Date.now() + 1500; // 1.5s invincibility

  // Audio & Visual feedback
  playSound('damage');
  flashDamageScreen();
  updateHUD();

  // Check Game Over
  if (state.hearts <= 0) {
    triggerGameOver();
  }
}

function showHint(message, cooldown = 2400) {
  const now = Date.now();
  if (now - state.lastHintAt < cooldown) return;
  state.lastHintAt = now;
  showToastNotification(message);
}

function flashDamageScreen() {
  const body = document.getElementById('game-body');
  const flash = document.getElementById('damage-flash');
  
  body.classList.add('screen-shake-anim');
  flash.classList.add('flash');
  
  setTimeout(() => {
    body.classList.remove('screen-shake-anim');
    flash.classList.remove('flash');
  }, 400);
}

function triggerGameOver() {
  state.status = 'GAMEOVER';
  document.getElementById('hud').classList.add('hidden');
  const messageEl = document.getElementById('gameover-message');
  if (messageEl) {
    messageEl.textContent = state.checkpoint
      ? '교무실 체크포인트부터 다시 시작할 수 있습니다.'
      : '유령에게 하트를 모두 잃었습니다.';
  }
  document.getElementById('gameover-screen').classList.remove('hidden');
  document.getElementById('quiz-screen').classList.add('hidden');
  switchBgm('none');
}

function triggerVictory() {
  state.status = 'VICTORY';
  document.getElementById('hud').classList.add('hidden');
  switchBgm('none');
  
  // Calculate stats
  const timeDiff = Date.now() - state.startTime;
  const mins = Math.floor(timeDiff / 60000).toString().padStart(2, '0');
  const secs = Math.floor((timeDiff % 60000) / 1000).toString().padStart(2, '0');

  document.getElementById('stat-time').textContent = `${mins}:${secs}`;
  document.getElementById('stat-hearts').textContent = `${state.hearts} / 5`;
  document.getElementById('victory-screen').classList.remove('hidden');
}

// Quiz Manager
function startQuiz(ghostEntity) {
  state.status = 'QUIZ';
  state.activeQuiz = ghostEntity;
  state.activeSpecialPuzzle = null;
  
  // Clear keypresses
  for (let k in keys) keys[k] = false;

  document.getElementById('quiz-screen').classList.remove('hidden');
  switchBgm('quiz');
  showQuestion();
}

function showQuestion() {
  const ghost = state.activeQuiz;
  const database = questionsDB[ghost.unitId];
  const questionData = database.questions[ghost.currentQuestionIndex];

  document.getElementById('quiz-title').textContent = database.title;
  document.getElementById('quiz-progress-text').textContent = `문제 ${ghost.currentQuestionIndex + 1} / ${database.questions.length}`;
  document.getElementById('quiz-question-text').textContent = questionData.q;

  // Options buttons
  const container = document.getElementById('quiz-options-container');
  container.innerHTML = '';

  questionData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = `${idx + 1}. ${opt}`;
    btn.addEventListener('click', () => handleOptionClick(btn, idx));
    container.appendChild(btn);
  });
}

function handleOptionClick(btn, selectedIndex) {
  const ghost = state.activeQuiz;
  const database = questionsDB[ghost.unitId];
  const questionData = database.questions[ghost.currentQuestionIndex];
  
  // Disable all buttons in quiz to prevent double clicking
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIndex === questionData.answer) {
    // Correct
    btn.classList.add('correct');
    playSound('correct');
    
    setTimeout(() => {
      ghost.currentQuestionIndex++;
      if (ghost.currentQuestionIndex >= database.questions.length) {
        // Classroom quiz cleared!
        ghost.solved = true;
        state.clearedUnits[ghost.unitId] = true;
        ghost.sprite.material.color.setHex(0x38b000); // Green color tint
        ghost.light.color.setHex(0x38b000);
        
        playSound('unlock');
        exitQuiz();
        
        // Check if all classrooms are cleared
        checkAllClassroomsCleared();
      } else {
        showQuestion();
      }
    }, 1000);
  } else {
    // Incorrect
    btn.classList.add('incorrect');
    takeDamage();

    setTimeout(() => {
      // Re-enable options to try again
      if (state.status === 'QUIZ') {
        buttons.forEach(b => b.style.pointerEvents = 'auto');
        btn.classList.remove('incorrect');
      }
    }, 1000);
  }
}

function checkAllClassroomsCleared() {
  const allCleared = state.clearedUnits.unit1 && state.clearedUnits.unit2 && state.clearedUnits.unit3 && state.clearedUnits.unit4;
  if (allCleared) {
    if (state.inventory.masterKeyPiece) {
      showToastNotification('뒷문의 마지막 문제가 열렸습니다. EXIT로 가세요.');
    } else {
      showToastNotification('4단원 완료! 특별실을 해결해 마스터키 조각을 얻으세요.');
    }
  }
  updateHUD();
}

function showToastNotification(message = '탈출 열쇠를 획득했습니다! 탈출구로 향하세요.') {
  const toast = document.getElementById('key-get-toast');
  const messageEl = toast.querySelector('span');
  if (messageEl) {
    messageEl.textContent = message;
  }
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function exitQuiz() {
  state.status = 'PLAYING';
  state.activeQuiz = null;
  state.activeSpecialPuzzle = null;
  document.getElementById('quiz-screen').classList.add('hidden');
  switchBgm('horror');
}

function startSpecialPuzzle(puzzleId) {
  if (state.specialSolved[puzzleId]) return;
  if (!specialPuzzlesDB[puzzleId]) return;

  state.status = 'QUIZ';
  state.activeQuiz = null;
  state.activeSpecialPuzzle = puzzleId;
  for (let k in keys) keys[k] = false;

  document.getElementById('quiz-screen').classList.remove('hidden');
  switchBgm('quiz');
  showSpecialPuzzle();
}

function showSpecialPuzzle() {
  const puzzle = specialPuzzlesDB[state.activeSpecialPuzzle];
  document.getElementById('quiz-title').textContent = puzzle.title;
  document.getElementById('quiz-progress-text').textContent = puzzle.progressText;
  document.getElementById('quiz-question-text').textContent = puzzle.q;

  const container = document.getElementById('quiz-options-container');
  container.innerHTML = '';
  puzzle.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = `${idx + 1}. ${opt}`;
    btn.addEventListener('click', () => handleSpecialOptionClick(btn, idx));
    container.appendChild(btn);
  });
}

function handleSpecialOptionClick(btn, selectedIndex) {
  const puzzleId = state.activeSpecialPuzzle;
  const puzzle = specialPuzzlesDB[puzzleId];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIndex === puzzle.answer) {
    btn.classList.add('correct');
    playSound('correct');
    setTimeout(() => {
      completeSpecialPuzzle(puzzleId);
    }, 900);
  } else {
    btn.classList.add('incorrect');
    takeDamage();
    setTimeout(() => {
      if (state.status === 'QUIZ') {
        buttons.forEach(b => b.style.pointerEvents = 'auto');
        btn.classList.remove('incorrect');
      }
    }, 1000);
  }
}

function completeSpecialPuzzle(puzzleId) {
  state.specialSolved[puzzleId] = true;
  playSound('unlock');

  if (puzzleId === 'music') {
    state.inventory.musicKey = true;
    exitQuiz();
    showToastNotification('음악실 퍼즐 해결! 교무실 열쇠를 얻었습니다.');
  } else if (puzzleId === 'science') {
    state.inventory.fuse = true;
    exitQuiz();
    showToastNotification('과학실 퍼즐 해결! 퓨즈를 얻었습니다.');
  } else if (puzzleId === 'office') {
    state.inventory.masterKeyPiece = true;
    exitQuiz();
    updateHUD();
    updateSpecialObjectVisibility();
    createOfficeCheckpoint();
    checkAllClassroomsCleared();
    return;
  }

  updateHUD();
  updateSpecialObjectVisibility();
}

// Final Riddle trigger (At exit door)
function startFinalQuiz() {
  state.status = 'QUIZ';
  state.activeQuiz = {
    unitId: 'final',
    currentQuestionIndex: 0,
    solved: false
  };
  state.activeSpecialPuzzle = null;

  // Clear keypresses
  for (let k in keys) keys[k] = false;

  document.getElementById('quiz-screen').classList.remove('hidden');
  switchBgm('quiz');
  
  const questionData = questionsDB.final;
  document.getElementById('quiz-title').textContent = "뒷문 잠금장치";
  document.getElementById('quiz-progress-text').textContent = "최종 문제";
  document.getElementById('quiz-question-text').textContent = questionData.q;

  const container = document.getElementById('quiz-options-container');
  container.innerHTML = '';

  questionData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = `${idx + 1}. ${opt}`;
    btn.addEventListener('click', () => handleFinalOptionClick(btn, idx));
    container.appendChild(btn);
  });
}

function handleFinalOptionClick(btn, selectedIndex) {
  const questionData = questionsDB.final;
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIndex === questionData.answer) {
    btn.classList.add('correct');
    playSound('correct');
    
    setTimeout(() => {
      state.hasKey = true;
      playSound('unlock');
      exitQuiz();
      camera.position.z = EXIT_DOOR_Z + 2.8;
      updateHUD();
      showToastNotification('마지막 문제 해결! 탈출 열쇠를 획득했습니다.');
      
      // Visual feedback: Key is picked up, keyMesh vanishes
      if (keyMesh) {
        scene.remove(keyMesh.sprite);
        scene.remove(keyMesh.light);
        keyMesh = null;
      }
    }, 1000);
  } else {
    btn.classList.add('incorrect');
    takeDamage();

    setTimeout(() => {
      if (state.status === 'QUIZ') {
        buttons.forEach(b => b.style.pointerEvents = 'auto');
        btn.classList.remove('incorrect');
      }
    }, 1000);
  }
}

function distanceToPlayer2D(position) {
  const dx = camera.position.x - position.x;
  const dz = camera.position.z - position.z;
  return Math.sqrt(dx * dx + dz * dz);
}

function handleSpecialInteractions() {
  for (const obj of specialObjects) {
    if (!obj.group.visible) continue;
    if (distanceToPlayer2D(obj.position) > obj.radius) continue;

    if (obj.id === 'classroomClue' && !state.inventory.classroomClue) {
      state.inventory.classroomClue = true;
      playSound('correct');
      updateHUD();
      updateSpecialObjectVisibility();
      showToastNotification('첫 단서를 찾았습니다. 이제 교실 문을 열고 복도로 나갈 수 있습니다.');
      continue;
    }

    if (obj.id === 'medkit' && !state.inventory.medkitUsed) {
      if (state.hearts >= 5) {
        showHint('하트가 가득 차 있어 구급상자를 아직 사용하지 않았습니다.');
      } else {
        state.hearts = Math.min(5, state.hearts + 1);
        state.inventory.medkitUsed = true;
        playSound('correct');
        updateHUD();
        updateSpecialObjectVisibility();
        showToastNotification('구급상자를 사용해 하트가 1개 회복되었습니다.');
      }
      continue;
    }

    if (obj.id === 'music' && !state.specialSolved.music) {
      startSpecialPuzzle('music');
      return;
    }

    if (obj.id === 'science' && !state.specialSolved.science) {
      startSpecialPuzzle('science');
      return;
    }

    if (obj.id === 'office' && !state.specialSolved.office) {
      if (!state.inventory.musicKey || !state.inventory.fuse) {
        showHint('교무실은 음악실 열쇠와 과학실 퓨즈가 모두 필요합니다.');
        return;
      }
      startSpecialPuzzle('office');
      return;
    }
  }

  const nearStartGate = camera.position.x < -3.0 && camera.position.x > -6.0 && camera.position.z > -9.2 && camera.position.z < -0.8;
  if (nearStartGate && !state.inventory.classroomClue) {
    showHint('먼저 1단원 교실 안의 첫 단서를 찾아야 나갈 수 있습니다.');
  }

  const nearOfficeGate = camera.position.x > 3.0 && camera.position.x < 6.0 && camera.position.z > -111.2 && camera.position.z < -102.8;
  if (nearOfficeGate && (!state.inventory.musicKey || !state.inventory.fuse)) {
    showHint('교무실 문이 잠겨 있습니다. 음악실 열쇠와 과학실 퓨즈가 필요합니다.');
  }
}

// Frame update loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Subtle corridor light flicker (much less aggressive, stays bright)
  classroomLights.forEach(item => {
    // Rare subtle flicker instead of going nearly dark
    if (Math.random() > 0.99) {
      item.light.intensity = item.baseIntensity * 0.7;
      item.mesh.material.color.setHex(0xaabbcc);
    } else {
      item.light.intensity = item.baseIntensity * (1.0 + Math.sin(time * 8 + item.baseZ) * 0.08);
      item.mesh.material.color.setHex(0xffffff);
    }
  });

  // Spin the Globe prop in Classroom 4
  const globe = scene.getObjectByName("SPINNING_GLOBE");
  if (globe) {
    globe.rotation.y += 0.01;
  }

  // Bobbing and floating animations for static quiz ghosts
  ghosts.forEach(g => {
    if (!g.solved) {
      g.sprite.position.y = g.baseY + Math.sin(time * 2.5 + g.baseY) * 0.15;
    } else {
      // Slighly fading and going up after solved
      g.sprite.position.y = g.baseY + 1.0 + Math.sin(time * 1.5) * 0.05;
    }
  });

  // Key mesh bobbing and spinning
  if (keyMesh) {
    keyMesh.sprite.position.y = keyMesh.baseY + Math.sin(time * 3) * 0.08;
  }

  if (state.status === 'PLAYING') {
    // 1. Horizontal Turning (Q/E or Arrow Keys)
    if (keys.q) rotY += keyRotateSpeed;
    if (keys.e) rotY -= keyRotateSpeed;

    // Apply turning (yaw + pitch with YXZ order)
    camera.rotation.set(rotX, rotY, 0);

    // 2. WASD Movement
    let dx = 0;
    let dz = 0;

    if (keys.w) {
      dx -= Math.sin(rotY);
      dz -= Math.cos(rotY);
    }
    if (keys.s) {
      dx += Math.sin(rotY);
      dz += Math.cos(rotY);
    }
    if (keys.a) {
      dx -= Math.cos(rotY);
      dz += Math.sin(rotY);
    }
    if (keys.d) {
      dx += Math.cos(rotY);
      dz -= Math.sin(rotY);
    }

    // Normalize movement vector if diagonal
    if (dx !== 0 && dz !== 0) {
      const len = Math.sqrt(dx * dx + dz * dz);
      dx /= len;
      dz /= len;
    }

    const isMoving = dx !== 0 || dz !== 0;
    const wantsSprint = keys.shift && isMoving && state.stamina > 0;
    state.isSprinting = wantsSprint;

    if (wantsSprint) {
      state.stamina = Math.max(0, state.stamina - STAMINA_DRAIN_PER_SECOND * delta);
      state.staminaRecoverAt = Date.now() + STAMINA_RECOVER_DELAY_MS;
      if (state.stamina <= 0) {
        state.isSprinting = false;
        keys.shift = false;
      }
    } else if (Date.now() >= state.staminaRecoverAt) {
      state.stamina = Math.min(state.maxStamina, state.stamina + STAMINA_RECOVER_PER_SECOND * delta);
    }

    const speed = (state.isSprinting ? SPRINT_SPEED : WALK_SPEED) * delta;
    const nextX = camera.position.x + dx * speed;
    const nextZ = camera.position.z + dz * speed;

    // Collisions check (slide along axes if possible)
    if (!checkCollision(nextX, camera.position.z)) {
      camera.position.x = nextX;
    }
    if (!checkCollision(camera.position.x, nextZ)) {
      camera.position.z = nextZ;
    }

    // 3. Chasing corridor ghost logic
    let distToCorridorGhost = Infinity;
    if (corridorGhost && corridorGhost.sprite.visible) {
      const ghostPosition = corridorGhost.sprite.position;
      const targetX = Math.max(GHOST_MIN_X, Math.min(GHOST_MAX_X, camera.position.x));
      const toPlayer = new THREE.Vector3(
        targetX - ghostPosition.x,
        0,
        camera.position.z - ghostPosition.z
      );
      distToCorridorGhost = Math.sqrt(toPlayer.x * toPlayer.x + toPlayer.z * toPlayer.z);

      if (distToCorridorGhost > 1.25) {
        toPlayer.normalize();
        const catchUpBoost = distToCorridorGhost > 20 ? 0.45 : 0;
        const closeSlowdown = distToCorridorGhost < 5 ? -0.35 : 0;
        const chaseSpeed = Math.max(2.2, corridorGhost.speed + catchUpBoost + closeSlowdown);
        ghostPosition.x += toPlayer.x * chaseSpeed * delta;
        ghostPosition.z += toPlayer.z * chaseSpeed * delta;
        ghostPosition.x = Math.max(GHOST_MIN_X, Math.min(GHOST_MAX_X, ghostPosition.x));
        ghostPosition.z = Math.max(GHOST_MIN_Z, Math.min(GHOST_MAX_Z, ghostPosition.z));
      }

      corridorGhost.aura.position.x = ghostPosition.x;
      corridorGhost.aura.position.z = corridorGhost.sprite.position.z;
      corridorGhost.ring.position.x = ghostPosition.x;
      corridorGhost.ring.position.z = corridorGhost.sprite.position.z;
      corridorGhost.label.position.x = ghostPosition.x;
      corridorGhost.label.position.z = corridorGhost.sprite.position.z;
      corridorGhost.light.position.x = ghostPosition.x;
      corridorGhost.light.position.z = corridorGhost.sprite.position.z;

      // Bobbing
      corridorGhost.sprite.position.y = 1.3 + Math.sin(time * 4) * 0.12;
      corridorGhost.aura.position.y = corridorGhost.sprite.position.y + 0.05;
      corridorGhost.label.position.y = 3.55 + Math.sin(time * 4) * 0.08;
      corridorGhost.ring.rotation.z += delta * 1.8;
      corridorGhost.ring.material.opacity = 0.58 + Math.sin(time * 5) * 0.17;

      // Check collision with player
      distToCorridorGhost = camera.position.distanceTo(corridorGhost.sprite.position);
      if (distToCorridorGhost < 1.6) {
        if (!state.ghostTouching) {
          takeDamage();
          state.ghostTouching = true;
        }
      } else if (distToCorridorGhost > 2.2) {
        state.ghostTouching = false;
      }
    }

    const threatRange = THREAT_MAX_DISTANCE - THREAT_DANGER_DISTANCE;
    state.threatLevel = Math.max(0, Math.min(1, (THREAT_MAX_DISTANCE - distToCorridorGhost) / threatRange));
    updateFlashlight(state.threatLevel, time);
    updatePlayerMeters(state.threatLevel);
    updateThreatWarning(distToCorridorGhost, state.threatLevel);
    handleSpecialInteractions();

    // 4. Check proximity to classroom quiz ghosts
    ghosts.forEach(g => {
      if (!g.solved) {
        const dist = camera.position.distanceTo(g.sprite.position);
        if (dist < 2.0) {
          startQuiz(g);
        }
      }
    });

    // 5. Check exit door interaction
    const distToExitDoor = camera.position.distanceTo(new THREE.Vector3(0, cameraHeight, EXIT_DOOR_Z));
    if (distToExitDoor < 2.2) {
      // If we have key, escape!
      if (state.hasKey) {
        triggerVictory();
      } else {
        // If all classrooms cleared, start final lock quiz
        const allCleared = state.clearedUnits.unit1 && state.clearedUnits.unit2 && state.clearedUnits.unit3 && state.clearedUnits.unit4;
        if (allCleared && state.inventory.masterKeyPiece) {
          startFinalQuiz();
        } else {
          // Push player back and notify them
          camera.position.z += 1.0;
          if (!allCleared) {
            showHint('뒷문 잠금장치가 닫혀 있습니다. 4개 단원 퀴즈를 모두 해결하세요.');
          } else {
            showHint('뒷문에는 교무실에서 얻는 마스터키 조각이 필요합니다.');
          }
        }
      }
    }
  } else {
    state.isSprinting = false;
    updateFlashlight(0, time);
    updateThreatWarning(Infinity, 0);
  }

  renderer.render(scene, camera);
}
