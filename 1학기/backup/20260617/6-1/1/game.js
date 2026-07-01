// Game Data
const gameData = [
  {
    roomName: "1단원: 산과 염기",
    bgClass: "bg-room-0",
    objects: [
      { id: "obj1-1", type: "quiz", icon: "🧪", label: "수상한 비커", x: 20 },
      { id: "obj1-2", type: "desc", icon: "🧫", label: "페트리 접시", x: 50, text: "여러 가지 용액들이 담겨 있다. 함부로 만지면 위험할 것 같다." },
      { id: "obj1-3", type: "quiz", icon: "📄", label: "리트머스 종이", x: 80 }
    ],
    quizzes: [
      {
        id: "quiz1-1",
        targetObj: "obj1-1",
        question: "다음 중 산성 용액이 아닌 것은 무엇일까요?",
        options: ["식초", "레몬즙", "사이다", "유리 세정제"],
        answer: 3 // 0-indexed
      },
      {
        id: "quiz1-2",
        targetObj: "obj1-3",
        question: "산성 용액을 푸른색 리트머스 종이에 떨어뜨리면 무슨 색으로 변하나요?",
        options: ["붉은 색", "푸른 색", "검정 색", "무지개 색"],
        answer: 0
      }
    ]
  },
  {
    roomName: "2단원: 여러 가지 힘 / 운동",
    bgClass: "bg-room-0",
    objects: [
      { id: "obj2-1", type: "desc", icon: "⏱️", label: "초시계", x: 30, text: "물체의 운동을 측정할 때 사용하는 초시계다." },
      { id: "obj2-2", type: "quiz", icon: "🚗", label: "미니카", x: 70 }
    ],
    quizzes: [
      {
        id: "quiz2-1",
        targetObj: "obj2-2",
        question: "일정한 거리를 이동하는 데 걸린 시간이 짧을수록 물체의 빠르기는 어떠한가요?",
        options: ["느리다", "빠르다", "같다", "알 수 없다"],
        answer: 1
      }
    ]
  },
  {
    roomName: "3단원: 식물의 구조와 기능",
    bgClass: "bg-room-0",
    objects: [
      { id: "obj3-1", type: "quiz", icon: "🪴", label: "시든 화분", x: 25 },
      { id: "obj3-2", type: "desc", icon: "🌿", label: "건강한 화분", x: 50, text: "잎이 푸르고 싱싱한 식물이다. 광합성을 잘 하고 있는 것 같다." },
      { id: "obj3-3", type: "quiz", icon: "🔬", label: "현미경", x: 75 }
    ],
    quizzes: [
      {
        id: "quiz3-1",
        targetObj: "obj3-1",
        question: "식물의 뿌리가 하는 역할 중, 물과 양분을 빨아들이는 작용은 무엇인가요?",
        options: ["지지 작용", "저장 작용", "흡수 작용", "호흡 작용"],
        answer: 2
      },
      {
        id: "quiz3-2",
        targetObj: "obj3-3",
        question: "잎에서 만들어진 양분이 이동하는 통로는 무엇인가요?",
        options: ["물관", "체관", "뿌리털", "기공"],
        answer: 1
      }
    ]
  },
  {
    roomName: "4단원: 지구와 달의 운동",
    bgClass: "bg-room-0",
    objects: [
      { id: "obj4-1", type: "desc", icon: "☀️", label: "전등", x: 20, text: "태양 역할을 하는 전등이다. 눈이 부시다." },
      { id: "obj4-2", type: "quiz", icon: "🌎", label: "지구본", x: 50 },
      { id: "obj4-3", type: "quiz", icon: "🌕", label: "달 모형", x: 80 }
    ],
    quizzes: [
      {
        id: "quiz4-1",
        targetObj: "obj4-2",
        question: "지구가 자전축을 중심으로 하루에 한 바퀴씩 도는 운동을 무엇이라고 하나요?",
        options: ["공전", "자전", "일식", "월식"],
        answer: 1
      },
      {
        id: "quiz4-2",
        targetObj: "obj4-3",
        question: "달의 모양이 변하는 이유는 무엇일까요?",
        options: ["달이 스스로 빛을 내기 때문에", "지구의 그림자에 가려지기 때문에", "달이 지구 주위를 공전하기 때문에", "구름이 달을 가리기 때문에"],
        answer: 2
      }
    ]
  }
];

// Game State
let currentRoomIndex = 0;
let playerX = 50; // Percentage 0-100
let isWalking = false;
let facingLeft = false;
let canInteract = true;
let currentInteractObj = null;
let solvedQuizzesInRoom = 0;
let totalQuizzesInRoom = 0;
let solvedObjIds = new Set();
let gameActive = false;

// DOM Elements
const screens = {
  title: document.getElementById('title-screen'),
  intro: document.getElementById('intro-screen'),
  game: document.getElementById('game-screen'),
  victory: document.getElementById('victory-screen')
};

const playerEl = document.getElementById('player');
const roomBgEl = document.getElementById('room-bg');
const roomObjectsEl = document.getElementById('room-objects');
const interactPrompt = document.getElementById('interact-prompt');
const roomTransition = document.getElementById('room-transition');
const transitionText = document.getElementById('transition-text');

// HUD
const hudRoom = document.getElementById('hud-room');
const hudFound = document.getElementById('hud-found');
const hudTotal = document.getElementById('hud-total');
const roomDots = document.querySelectorAll('.room-dot');

// Modals
const quizModal = document.getElementById('quiz-modal');
const descModal = document.getElementById('desc-modal');

// Input tracking
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false
};

// Initialize
function init() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function startGame() {
  switchScreen('intro');
  const introText = "으스스한 과학실...\n문이 잠겨 나갈 수 없다.\n단원별 문제를 모두 풀어야\n다음 구역으로 갈 수 있는 것 같다.\n\n주변을 조사해보자.";
  typeText(document.getElementById('intro-text'), introText, 50);
}

function switchScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
  if (screenName === 'game') {
    gameActive = true;
    loadRoom(currentRoomIndex);
    gameLoop();
  } else {
    gameActive = false;
  }
}

function typeText(element, text, speed, callback) {
  element.innerHTML = '';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      if (text.charAt(i) === '\n') {
        element.innerHTML += '<br>';
      } else {
        element.innerHTML += text.charAt(i);
      }
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function loadRoom(index) {
  const room = gameData[index];
  
  // Update HUD
  hudRoom.textContent = room.roomName;
  totalQuizzesInRoom = room.quizzes.length;
  solvedQuizzesInRoom = 0;
  hudTotal.textContent = totalQuizzesInRoom;
  hudFound.textContent = "0";
  
  roomDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Clear solved objects for new room
  solvedObjIds.clear();

  // Reset player position
  playerX = 50;
  updatePlayerTransform();

  // Render objects
  roomObjectsEl.innerHTML = '';
  room.objects.forEach(obj => {
    const objEl = document.createElement('div');
    objEl.className = 'interactable-object';
    objEl.id = obj.id;
    objEl.style.left = `calc(${obj.x}% - 30px)`;
    objEl.innerHTML = `
      <div class="object-glow"></div>
      <span class="object-label">${obj.label}</span>
      <div class="object-icon">${obj.icon}</div>
    `;
    roomObjectsEl.appendChild(objEl);
  });

  // Background
  roomBgEl.className = 'room-background ' + room.bgClass;
  
  // Flash transition text
  showTransition(room.roomName);
}

function showTransition(text) {
  transitionText.textContent = text;
  roomTransition.classList.remove('hidden');
  roomTransition.classList.add('show');
  
  setTimeout(() => {
    roomTransition.classList.remove('show');
    setTimeout(() => {
      roomTransition.classList.add('hidden');
    }, 1000);
  }, 2000);
}

// Game Loop & Input
function handleKeyDown(e) {
  if (keys.hasOwnProperty(e.code)) {
    keys[e.code] = true;
  }

  // Handle intro skip
  if (screens.intro.classList.contains('active')) {
    switchScreen('game');
    return;
  }

  // Handle modal close
  if (!descModal.classList.contains('hidden')) {
    closeModal(descModal);
    return;
  }

  // Handle interaction
  if (e.code === 'ArrowUp' && gameActive && canInteract && currentInteractObj) {
    interactWith(currentInteractObj);
  }
}

function handleKeyUp(e) {
  if (keys.hasOwnProperty(e.code)) {
    keys[e.code] = false;
  }
}

function gameLoop() {
  if (!gameActive) return;

  updatePlayerPosition();
  checkProximity();

  requestAnimationFrame(gameLoop);
}

function updatePlayerPosition() {
  if (!canInteract) return;

  const speed = 0.5;
  isWalking = false;

  if (keys.ArrowLeft) {
    playerX -= speed;
    isWalking = true;
    facingLeft = true;
  }
  if (keys.ArrowRight) {
    playerX += speed;
    isWalking = true;
    facingLeft = false;
  }

  // Clamp position (prevent walking off screen)
  if (playerX < 2) playerX = 2;
  if (playerX > 98) playerX = 98;

  updatePlayerTransform();
}

function updatePlayerTransform() {
  // Update classes for animation
  playerEl.classList.toggle('walking', isWalking);
  playerEl.classList.toggle('facing-left', facingLeft);
  playerEl.classList.toggle('facing-right', !facingLeft);

  // Apply position
  playerEl.style.left = `${playerX}%`;
  
  // Parallax background (subtle)
  const bgOffset = (playerX - 50) * -0.2;
  roomBgEl.style.transform = `translateX(${bgOffset}%)`;
  roomObjectsEl.style.transform = `translateX(${bgOffset}%)`;
}

function checkProximity() {
  if (!canInteract) return;

  const room = gameData[currentRoomIndex];
  let nearestObj = null;
  let minDistance = 10; // Interaction threshold (%)

  room.objects.forEach(obj => {
    if (solvedObjIds.has(obj.id)) return; // Ignore solved

    const dist = Math.abs(playerX - obj.x);
    if (dist < minDistance) {
      minDistance = dist;
      nearestObj = obj;
    }
  });

  // Update object glow
  document.querySelectorAll('.interactable-object').forEach(el => {
    el.classList.remove('near');
  });

  if (nearestObj) {
    currentInteractObj = nearestObj;
    document.getElementById(nearestObj.id).classList.add('near');
    
    // Show prompt
    interactPrompt.classList.remove('hidden');
    // Position prompt above player
    interactPrompt.style.left = `${playerX}%`;
  } else {
    currentInteractObj = null;
    interactPrompt.classList.add('hidden');
  }
}

// Interactions
function interactWith(obj) {
  canInteract = false;
  isWalking = false;
  playerEl.classList.remove('walking');
  interactPrompt.classList.add('hidden');

  if (obj.type === 'desc') {
    showDescription(obj);
  } else if (obj.type === 'quiz') {
    showQuiz(obj);
  }
}

function showDescription(obj) {
  document.getElementById('desc-icon').textContent = obj.icon;
  document.getElementById('desc-text').textContent = obj.text;
  
  descModal.classList.remove('hidden');
}

function showQuiz(obj) {
  const room = gameData[currentRoomIndex];
  const quiz = room.quizzes.find(q => q.targetObj === obj.id);

  if (!quiz) {
    // Failsafe
    canInteract = true;
    return;
  }

  document.getElementById('quiz-icon').textContent = obj.icon;
  document.getElementById('quiz-question').textContent = quiz.question;
  
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  
  quiz.options.forEach((opt, idx) => {
    const optEl = document.createElement('div');
    optEl.className = 'quiz-option';
    optEl.innerHTML = `<span class="option-number">${idx + 1}</span> ${opt}`;
    optEl.onclick = () => selectAnswer(quiz, idx, optEl);
    optionsContainer.appendChild(optEl);
  });

  document.getElementById('quiz-result').classList.add('hidden');
  quizModal.classList.remove('hidden');
}

function selectAnswer(quiz, selectedIdx, optionElement) {
  // Disable all options
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.onclick = null);

  const resultBox = document.getElementById('quiz-result');
  const resultIcon = document.getElementById('result-icon');
  const resultText = document.getElementById('result-text');

  resultBox.classList.remove('hidden', 'success', 'fail');

  if (selectedIdx === quiz.answer) {
    // Correct
    optionElement.classList.add('correct');
    resultBox.classList.add('success');
    resultIcon.textContent = '✅';
    resultText.textContent = '정답입니다!';
    
    // Mark as solved
    solvedObjIds.add(quiz.targetObj);
    document.getElementById(quiz.targetObj).classList.add('solved');
    
    solvedQuizzesInRoom++;
    hudFound.textContent = solvedQuizzesInRoom;

    setTimeout(() => {
      closeModal(quizModal);
      checkRoomComplete();
    }, 1500);

  } else {
    // Wrong
    optionElement.classList.add('wrong');
    // Highlight correct
    options[quiz.answer].classList.add('correct');
    
    resultBox.classList.add('fail');
    resultIcon.textContent = '❌';
    resultText.textContent = '틀렸습니다. 다시 생각해보세요.';

    setTimeout(() => {
      closeModal(quizModal);
    }, 2000);
  }
}

function closeModal(modal) {
  modal.classList.add('hidden');
  
  // Re-enable interaction after a short delay
  setTimeout(() => {
    canInteract = true;
  }, 200);
}

function checkRoomComplete() {
  if (solvedQuizzesInRoom >= totalQuizzesInRoom) {
    // Room clear
    canInteract = false; // block interaction during transition
    setTimeout(() => {
      if (currentRoomIndex < gameData.length - 1) {
        currentRoomIndex++;
        loadRoom(currentRoomIndex);
        canInteract = true;
      } else {
        // Game clear
        switchScreen('victory');
      }
    }, 1000);
  }
}

function restartGame() {
  currentRoomIndex = 0;
  switchScreen('title');
}

// Start
init();
