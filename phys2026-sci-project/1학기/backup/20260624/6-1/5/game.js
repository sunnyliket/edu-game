const unitDefinitions = [
  {
    title: "1단원: 산과 염기",
    shortTitle: "산·염기",
    sceneClass: "unit-acid",
    icons: ["🧪", "🧫", "🔬", "🧴", "📄"],
    labels: [
      "푸른 리트머스 종이", "페놀프탈레인 용액", "붉은 양배추 지시약", "비눗물 병", "식초 비커",
      "유리 세정제", "레몬즙", "탄산수", "실험 장갑", "스포이트", "붉은 리트머스 종이", "중화 실험 컵",
      "안전 고글", "분류 표", "지시약 상자"
    ],
    quizzes: [
      {
        question: "산성 용액을 푸른색 리트머스 종이에 떨어뜨리면 무슨 색으로 변하나요?",
        options: ["붉은 색", "푸른 색", "검정 색", "무지개 색"],
        answer: 0
      },
      {
        question: "페놀프탈레인 용액에 산성 용액을 떨어뜨리면 무슨 색으로 변하나요?",
        options: ["변하지 않는다", "붉은 색", "푸른 색", "노란 색"],
        answer: 0
      },
      {
        question: "푸른색 리트머스 종이에 어떤 액체를 한 방울 떨어뜨렸더니 종이가 붉은색으로 변했습니다. 이 액체는 어떤 성질인가요?",
        options: ["염기성", "산성", "산성과 염기성이 아닌 용액"],
        answer: 1
      },
      {
        question: "다음 중 주변에서 볼 수 있는 염기성 물질로 바르게 짝지은 것은 무엇인가요?",
        options: ["비눗물, 유리 세정제", "식초, 레몬즙", "과일 주스, 탄산수"],
        answer: 0
      },
      {
        question: "붉은 양배추 지시약과 다른 지시약의 차이점은 무엇인가요?",
        options: ["양배추 지시약은 먹을 수 있다", "붉은 양배추 지시약은 산성, 염기성 모두를 색 변화로 알아볼 수 있다"],
        answer: 1
      },
      {
        question: "페놀프탈레인 용액을 염기성 용액에 떨어뜨리면 붉은색으로 변한다.",
        options: ["O", "X"],
        answer: 0
      },
      {
        question: "붉은색 리트머스 종이를 푸르게 변화시키는 용액은 어떤 성질인가요?",
        options: ["산성", "염기성", "중성", "모른다"],
        answer: 1
      },
      {
        question: "다음 중 산성 물질에 가까운 것은 무엇인가요?",
        options: ["레몬즙", "비눗물", "유리 세정제", "묽은 암모니아수"],
        answer: 0
      },
      {
        question: "실험실에서 성질을 모르는 용액을 확인할 때 가장 안전한 방법은 무엇인가요?",
        options: ["직접 맛보기", "손으로 비벼 보기", "지시약을 사용하기", "냄새를 깊게 맡기"],
        answer: 2
      },
      {
        question: "산성 용액과 염기성 용액을 섞으면 서로의 성질이 약해지는 현상을 무엇이라고 하나요?",
        options: ["증발", "중화", "응결", "침전"],
        answer: 1
      },
      {
        question: "붉은 양배추 지시약을 산성 용액에 넣었을 때 주로 나타나는 색 계열은 무엇인가요?",
        options: ["붉은색 계열", "초록색 계열", "검은색 계열", "투명한 색"],
        answer: 0
      },
      {
        question: "붉은 양배추 지시약을 염기성 용액에 넣었을 때 주로 나타나는 색 계열은 무엇인가요?",
        options: ["붉은색 계열", "푸른색 또는 초록색 계열", "항상 흰색", "항상 검은색"],
        answer: 1
      },
      {
        question: "산성 용액과 염기성 용액을 분류할 때 사용하는 것은 무엇인가요?",
        options: ["지시약", "돋보기", "나침반", "자석"],
        answer: 0
      },
      {
        question: "다음 중 실험 안전 수칙으로 알맞은 것은 무엇인가요?",
        options: ["모르는 용액은 맛을 본다", "보안경과 장갑을 착용한다", "용액을 친구에게 뿌린다", "라벨을 보지 않는다"],
        answer: 1
      },
      {
        question: "산성 용액의 성질로 알맞은 것은 무엇인가요?",
        options: ["푸른 리트머스 종이를 붉게 변화시킨다", "페놀프탈레인을 항상 붉게 만든다", "붉은 리트머스 종이를 푸르게 만든다", "모든 지시약을 검게 만든다"],
        answer: 0
      }
    ]
  },
  {
    title: "2단원: 물체의 운동",
    shortTitle: "운동",
    sceneClass: "unit-motion",
    icons: ["⏱️", "🚗", "📏", "🛤️", "⚙️"],
    labels: [
      "초시계", "미니카", "줄자", "경사로", "기록판", "출발선", "도착선", "바퀴", "트랙",
      "방향 표지판", "속력 계산기", "운동 그래프", "운동 기록지", "위치 센서", "요소 분석표"
    ],
    quizzes: [
      {
        question: "물체가 이동한 빠르기를 비교하려면 어떤 두 가지 양을 알아야 하나요?",
        options: ["색깔과 모양", "이동 거리와 걸린 시간", "무게와 냄새", "온도와 부피"],
        answer: 1
      },
      {
        question: "같은 거리를 이동했을 때 걸린 시간이 짧은 물체는 어떻게 움직인 것인가요?",
        options: ["더 느리게", "더 빠르게", "멈춰 있게", "방향만 바뀌게"],
        answer: 1
      },
      {
        question: "같은 시간 동안 더 먼 거리를 이동한 물체는 어떤 물체인가요?",
        options: ["더 빠른 물체", "더 느린 물체", "움직이지 않은 물체", "항상 가벼운 물체"],
        answer: 0
      },
      {
        question: "미니카가 이동하는 데 걸린 시간을 재는 데 알맞은 도구는 무엇인가요?",
        options: ["온도계", "초시계", "저울", "나침반"],
        answer: 1
      },
      {
        question: "미니카가 이동한 거리를 재는 데 알맞은 도구는 무엇인가요?",
        options: ["줄자", "비커", "스포이트", "리트머스 종이"],
        answer: 0
      },
      {
        question: "속력을 구하는 식으로 알맞은 것은 무엇인가요?",
        options: ["이동 거리 ÷ 걸린 시간", "걸린 시간 ÷ 이동 거리", "이동 거리 + 걸린 시간", "이동 거리 × 색깔"],
        answer: 0
      },
      {
        question: "운동하는 물체의 위치가 시간에 따라 어떻게 되는지 알아보려면 무엇을 기록해야 하나요?",
        options: ["위치와 시간", "냄새와 색", "소리와 맛", "모양과 재질만"],
        answer: 0
      },
      {
        question: "미니카 실험을 공정하게 하려면 무엇을 같게 해야 하나요?",
        options: ["출발 위치", "친구 이름", "교실 온도만", "문제 번호"],
        answer: 0
      },
      {
        question: "물체의 운동을 나타낼 때 필요한 정보가 아닌 것은 무엇인가요?",
        options: ["위치", "방향", "빠르기", "좋아하는 음식"],
        answer: 3
      },
      {
        question: "운동 방향이 바뀐다는 것은 무엇이 바뀐다는 뜻인가요?",
        options: ["물체가 나아가는 쪽", "물체의 이름", "물체의 재질", "물체의 그림자만"],
        answer: 0
      },
      {
        question: "10초 동안 30 m 이동한 물체의 속력은 얼마인가요?",
        options: ["1 m/s", "2 m/s", "3 m/s", "30 m/s"],
        answer: 2
      },
      {
        question: "물체가 빠르게 움직일수록 같은 시간 동안 이동한 거리는 어떻게 되나요?",
        options: ["더 길어진다", "항상 0이 된다", "반드시 짧아진다", "색깔이 변한다"],
        answer: 0
      },
      {
        question: "운동 실험 결과를 친구에게 정확히 알려 주려면 무엇을 해야 하나요?",
        options: ["측정값을 기록한다", "마음대로 숫자를 만든다", "결과를 숨긴다", "도구를 사용하지 않는다"],
        answer: 0
      },
      {
        question: "시간에 따라 위치가 바뀌는 것은 무엇이라고 하나요?",
        options: ["운동", "위치"],
        answer: 0
      },
      {
        question: "과학에서 물체의 운동 설명하기 위해 반드시 필요한 세가지 요소가 아닌 것은 무엇인가요?",
        options: ["기준점", "물체의 무게", "방향", "거리"],
        answer: 1
      }
    ]
  },
  {
    title: "3단원: 식물의 구조와 기능",
    shortTitle: "식물",
    sceneClass: "unit-plant",
    icons: ["🪴", "🌱", "🍃", "🌸", "🌿"],
    labels: [
      "강낭콩 화분", "봉선화 화분", "뿌리 표본", "줄기 단면", "잎 표본", "꽃 모형", "씨앗 접시",
      "물관 카드", "체관 카드", "현미경", "돋보기", "증산 실험 봉지", "햇빛 램프", "물뿌리개", "식물 기록장"
    ],
    quizzes: [
      {
        question: "식물의 뿌리가 하는 일로 알맞은 것은 무엇인가요?",
        options: ["물과 양분을 흡수한다", "씨를 만든다", "빛을 낸다", "달의 모양을 바꾼다"],
        answer: 0
      },
      {
        question: "식물의 줄기가 하는 일로 알맞은 것은 무엇인가요?",
        options: ["몸을 지탱하고 물질을 이동시킨다", "초시계를 움직인다", "흙을 모두 먹는다", "그림자를 없앤다"],
        answer: 0
      },
      {
        question: "잎에서 주로 일어나는 작용은 무엇인가요?",
        options: ["광합성", "자전", "중화", "속력 측정"],
        answer: 0
      },
      {
        question: "식물이 광합성을 할 때 필요한 것이 아닌 것은 무엇인가요?",
        options: ["빛", "물", "이산화 탄소", "유리 세정제"],
        answer: 3
      },
      {
        question: "잎에서 만들어진 양분이 이동하는 통로는 무엇인가요?",
        options: ["체관", "물관", "리트머스 종이", "경사로"],
        answer: 0
      },
      {
        question: "뿌리에서 흡수한 물이 이동하는 통로는 무엇인가요?",
        options: ["물관", "체관", "꽃잎", "달"],
        answer: 0
      },
      {
        question: "꽃의 중요한 역할로 알맞은 것은 무엇인가요?",
        options: ["씨가 생기는 데 관여한다", "물체의 속력을 잰다", "지구본을 돌린다", "산성 용액을 만든다"],
        answer: 0
      },
      {
        question: "열매 안에 들어 있어 새로운 식물이 될 수 있는 것은 무엇인가요?",
        options: ["씨", "모래", "초시계", "지시약"],
        answer: 0
      },
      {
        question: "식물의 잎에서 물이 수증기로 빠져나가는 현상을 무엇이라고 하나요?",
        options: ["증산 작용", "중화 작용", "자전", "공전"],
        answer: 0
      },
      {
        question: "식물의 잎을 투명한 비닐봉지로 감싸면 안쪽에 물방울이 맺히는 까닭은 무엇인가요?",
        options: ["증산 작용 때문이다", "달빛 때문이다", "미니카가 움직였기 때문이다", "리트머스 종이가 변했기 때문이다"],
        answer: 0
      },
      {
        question: "식물이 살아가는 데 필요한 조건으로 알맞은 것은 무엇인가요?",
        options: ["빛과 물", "나침반만", "비눗물만", "검은 종이만"],
        answer: 0
      },
      {
        question: "식물의 몸을 이루는 기본 기관이 아닌 것은 무엇인가요?",
        options: ["뿌리", "줄기", "잎", "초시계"],
        answer: 3
      },
      {
        question: "꽃가루가 암술머리에 옮겨 붙는 과정을 무엇이라고 하나요?",
        options: ["수분", "중화", "증발", "자전"],
        answer: 0
      },
      {
        question: "식물의 뿌리가 흙속으로 뻗는 까닭으로 알맞은 것은 무엇인가요?",
        options: ["몸을 지탱하고 물을 얻기 위해서", "별자리를 보기 위해서", "속력을 빠르게 하기 위해서", "빛을 피하기 위해서만"],
        answer: 0
      },
      {
        question: "잎이 넓게 펼쳐져 있는 것은 어떤 점에 유리한가요?",
        options: ["빛을 많이 받는 데 유리하다", "초시계를 숨기는 데 유리하다", "산성 용액을 만드는 데 유리하다", "달 모양을 바꾸는 데 유리하다"],
        answer: 0
      }
    ]
  },
  {
    title: "4단원: 지구와 달의 운동",
    shortTitle: "지구·달",
    sceneClass: "unit-earth",
    icons: ["🌐", "🌙", "☀️", "🧭", "🔦"],
    labels: [
      "지구본", "달 모형", "태양 전등", "나침반", "손전등", "그림자 판", "자전축 막대", "공전 궤도",
      "달 위상 카드", "관찰 기록장", "동쪽 표지", "서쪽 표지", "낮밤 카드", "계절 카드", "천체 모형 상자"
    ],
    quizzes: [
      {
        question: "지구가 자전축을 중심으로 하루에 한 바퀴 도는 운동을 무엇이라고 하나요?",
        options: ["자전", "공전", "일식", "월식"],
        answer: 0
      },
      {
        question: "지구의 자전 때문에 나타나는 현상은 무엇인가요?",
        options: ["낮과 밤", "식물의 꽃가루", "용액의 색 변화", "미니카 속력"],
        answer: 0
      },
      {
        question: "태양이 하루 동안 동쪽에서 떠서 서쪽으로 지는 것처럼 보이는 까닭은 무엇인가요?",
        options: ["지구가 자전하기 때문", "달이 사라지기 때문", "식물이 광합성하기 때문", "초시계가 움직이기 때문"],
        answer: 0
      },
      {
        question: "지구가 태양 주위를 도는 운동을 무엇이라고 하나요?",
        options: ["공전", "자전", "중화", "증산"],
        answer: 0
      },
      {
        question: "달이 스스로 빛나는 것처럼 보이는 까닭은 무엇인가요?",
        options: ["태양빛을 반사하기 때문", "달 안에 전구가 있기 때문", "지구가 빛을 모두 막기 때문", "항상 불이 붙어 있기 때문"],
        answer: 0
      },
      {
        question: "달의 모양이 날마다 달라 보이는 주된 까닭은 무엇인가요?",
        options: ["달이 지구 주위를 돌기 때문", "달이 작아졌다 커지기 때문", "달 색이 매일 바뀌기 때문", "구름이 달을 만들기 때문"],
        answer: 0
      },
      {
        question: "보름달은 어느 모양에 가까운가요?",
        options: ["둥근 원 모양", "반원 모양", "가느다란 눈썹 모양", "보이지 않는 모양"],
        answer: 0
      },
      {
        question: "상현달은 어느 모양에 가까운가요?",
        options: ["반달", "보름달", "그믐달", "달이 없음"],
        answer: 0
      },
      {
        question: "지구본에서 기울어진 막대처럼 표시된 것은 무엇을 나타내나요?",
        options: ["자전축", "물관", "리트머스 종이", "초시계 바늘"],
        answer: 0
      },
      {
        question: "지구에서 태양빛을 받는 쪽은 주로 무엇이 되나요?",
        options: ["낮", "밤", "항상 겨울", "항상 달"],
        answer: 0
      },
      {
        question: "태양빛을 받지 못하는 지구의 반대쪽은 주로 무엇이 되나요?",
        options: ["밤", "낮", "보름달", "중화"],
        answer: 0
      },
      {
        question: "달이 지구 주위를 한 바퀴 도는 운동을 무엇이라고 하나요?",
        options: ["달의 공전", "지구의 자전", "식물의 증산", "물체의 속력"],
        answer: 0
      },
      {
        question: "태양, 지구, 달 모형 실험에서 손전등은 무엇의 역할을 하나요?",
        options: ["태양", "지구", "달", "구름"],
        answer: 0
      },
      {
        question: "그림자가 생기는 까닭으로 알맞은 것은 무엇인가요?",
        options: ["빛이 물체에 막히기 때문", "빛이 맛있기 때문", "물체가 녹기 때문", "달이 노래하기 때문"],
        answer: 0
      },
      {
        question: "하루 동안 그림자의 방향과 길이가 달라지는 까닭은 무엇인가요?",
        options: ["태양의 위치가 달라 보이기 때문", "식물이 물을 흡수하기 때문", "산성 용액이 변하기 때문", "줄자가 늘어나기 때문"],
        answer: 0
      }
    ]
  }
];

const objectPositions = [
  [13, 31], [27, 28], [43, 31], [59, 28], [75, 31],
  [17, 49], [33, 46], [50, 49], [67, 46], [83, 49],
  [14, 68], [30, 66], [46, 69], [63, 66], [80, 68],
  [20, 58], [36, 56], [52, 58], [68, 56], [84, 58]
];

const gameData = unitDefinitions.map((unit, unitIndex) => ({
  ...unit,
  objects: unit.quizzes.map((quiz, quizIndex) => ({
    id: `unit-${unitIndex + 1}-quiz-${quizIndex + 1}`,
    label: unit.labels[quizIndex],
    icon: unit.icons[quizIndex % unit.icons.length],
    x: objectPositions[quizIndex][0],
    y: objectPositions[quizIndex][1],
    quiz
  }))
}));

const state = {
  playerName: "학생",
  unitIndex: 0,
  focusX: 50,
  focusY: 54,
  keys: new Set(),
  solved: new Set(),
  activeObject: null,
  quizLocked: false,
  acceptingInput: true
};

const screens = {
  rules: document.getElementById("rules-screen"),
  game: document.getElementById("game-screen"),
  victory: document.getElementById("victory-screen")
};

const playerNameInput = document.getElementById("player-name");
const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const hudName = document.getElementById("hud-name");
const hudRoom = document.getElementById("hud-room");
const hudRoomProgress = document.getElementById("hud-room-progress");
const hudTotalProgress = document.getElementById("hud-total-progress");
const unitTabs = document.getElementById("unit-tabs");
const labScene = document.getElementById("lab-scene");
const roomObjects = document.getElementById("room-objects");
const focus = document.getElementById("focus");
const interactPrompt = document.getElementById("interact-prompt");
const quizModal = document.getElementById("quiz-modal");
const quizIcon = document.getElementById("quiz-icon");
const quizTitle = document.getElementById("quiz-title");
const quizCount = document.getElementById("quiz-count");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizResult = document.getElementById("quiz-result");
const transition = document.getElementById("transition");
const transitionText = document.getElementById("transition-text");
const victoryMessage = document.getElementById("victory-message");

function totalQuestionCount() {
  return gameData.reduce((sum, unit) => sum + unit.quizzes.length, 0);
}

function solvedTotalCount() {
  return state.solved.size;
}

function currentUnit() {
  return gameData[state.unitIndex];
}

function currentRoomSolvedCount() {
  return currentUnit().objects.filter((object) => state.solved.has(object.id)).length;
}

function switchScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function startGame() {
  const trimmedName = playerNameInput.value.trim();
  state.playerName = trimmedName || "학생";
  resetGame(false);
  switchScreen("game");
  renderRoom();
}

function resetGame(showRules = true) {
  state.unitIndex = 0;
  state.focusX = 50;
  state.focusY = 54;
  state.keys.clear();
  state.solved.clear();
  state.activeObject = null;
  state.quizLocked = false;
  state.acceptingInput = true;
  closeQuiz();

  if (showRules) {
    switchScreen("rules");
    playerNameInput.focus();
  }
}

function renderUnitTabs() {
  unitTabs.innerHTML = "";

  gameData.forEach((unit, index) => {
    const tab = document.createElement("div");
    tab.className = "unit-tab";
    tab.textContent = index + 1;
    tab.title = unit.title;

    if (index === state.unitIndex) {
      tab.classList.add("active");
    }

    const solvedInUnit = unit.objects.every((object) => state.solved.has(object.id));
    if (solvedInUnit) {
      tab.classList.add("done");
    }

    unitTabs.appendChild(tab);
  });
}

function renderRoom() {
  const unit = currentUnit();

  labScene.className = unit.sceneClass;
  hudName.textContent = state.playerName;
  hudRoom.textContent = unit.title;
  renderUnitTabs();
  renderObjects();
  updateHud();
  updateFocus();
  showPrompt(`${unit.title}입니다. 방향키로 준비물에 가까이 가세요.`);
}

function renderObjects() {
  const unit = currentUnit();
  roomObjects.innerHTML = "";

  unit.objects.forEach((object, index) => {
    const objectButton = document.createElement("button");
    objectButton.type = "button";
    objectButton.className = "room-object";
    objectButton.id = object.id;
    objectButton.style.left = `${object.x}%`;
    objectButton.style.top = `${object.y}%`;
    objectButton.setAttribute("aria-label", `${object.label} 조사하기`);
    objectButton.innerHTML = `
      <span class="object-label">${index + 1}. ${object.label}</span>
      <span class="object-icon" aria-hidden="true">${object.icon}</span>
    `;

    if (state.solved.has(object.id)) {
      objectButton.classList.add("solved");
    }

    objectButton.addEventListener("click", () => {
      if (!state.solved.has(object.id) && distanceToObject(object) <= 8.6) {
        openQuiz(object);
      } else {
        showPrompt("방향키로 준비물 가까이 이동한 뒤 Space 또는 Enter로 조사하세요.");
      }
    });

    roomObjects.appendChild(objectButton);
  });
}

function updateHud() {
  const unit = currentUnit();
  hudRoomProgress.textContent = `${currentRoomSolvedCount()} / ${unit.objects.length}`;
  hudTotalProgress.textContent = `${solvedTotalCount()} / ${totalQuestionCount()}`;
  renderUnitTabs();
}

function updateFocus() {
  focus.style.left = `${state.focusX}%`;
  focus.style.top = `${state.focusY}%`;
}

function gameLoop() {
  if (screens.game.classList.contains("active") && quizModal.classList.contains("hidden") && state.acceptingInput) {
    moveFocus();
    findNearestObject();
  }

  requestAnimationFrame(gameLoop);
}

function moveFocus() {
  const speed = 0.58;
  let moved = false;

  if (state.keys.has("ArrowLeft")) {
    state.focusX -= speed;
    moved = true;
  }
  if (state.keys.has("ArrowRight")) {
    state.focusX += speed;
    moved = true;
  }
  if (state.keys.has("ArrowUp")) {
    state.focusY -= speed;
    moved = true;
  }
  if (state.keys.has("ArrowDown")) {
    state.focusY += speed;
    moved = true;
  }

  state.focusX = clamp(state.focusX, 8, 92);
  state.focusY = clamp(state.focusY, 23, 78);

  if (moved) {
    updateFocus();
  }
}

function findNearestObject() {
  const threshold = 8.6;
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  currentUnit().objects.forEach((object) => {
    if (state.solved.has(object.id)) {
      return;
    }

    const distance = distanceToObject(object);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = object;
    }
  });

  document.querySelectorAll(".room-object").forEach((node) => node.classList.remove("near"));

  if (nearest && nearestDistance <= threshold) {
    state.activeObject = nearest;
    const node = document.getElementById(nearest.id);
    if (node) {
      node.classList.add("near");
    }
    showPrompt(`${nearest.label} 발견. Space 또는 Enter로 조사하세요.`);
  } else {
    state.activeObject = null;
    showPrompt("방향키로 과학실 준비물 가까이 이동하세요.");
  }
}

function distanceToObject(object) {
  const dx = state.focusX - object.x;
  const dy = (state.focusY - object.y) * 1.15;
  return Math.sqrt(dx * dx + dy * dy);
}

function showPrompt(text) {
  interactPrompt.textContent = text;
  interactPrompt.classList.remove("hidden");
}

function openQuiz(object) {
  if (!object || state.solved.has(object.id) || !state.acceptingInput) {
    return;
  }

  state.activeObject = object;
  state.quizLocked = false;
  const unit = currentUnit();
  const index = unit.objects.findIndex((item) => item.id === object.id);

  quizIcon.textContent = object.icon;
  quizTitle.textContent = `${unit.shortTitle} 문제`;
  quizCount.textContent = `${index + 1} / ${unit.objects.length}`;
  quizQuestion.textContent = object.quiz.question;
  quizResult.className = "quiz-result hidden";
  quizResult.textContent = "";
  quizOptions.innerHTML = "";

  object.quiz.options.forEach((option, optionIndex) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.className = "quiz-option";
    optionButton.innerHTML = `
      <span class="option-number">${optionIndex + 1}</span>
      <span>${option}</span>
    `;
    optionButton.addEventListener("click", () => selectAnswer(optionIndex));
    quizOptions.appendChild(optionButton);
  });

  quizModal.classList.remove("hidden");
  const firstOption = quizOptions.querySelector("button");
  if (firstOption) {
    firstOption.focus();
  }
}

function selectAnswer(optionIndex) {
  if (state.quizLocked || !state.activeObject) {
    return;
  }

  const quiz = state.activeObject.quiz;
  const optionButtons = Array.from(quizOptions.querySelectorAll(".quiz-option"));
  const selectedButton = optionButtons[optionIndex];

  if (!selectedButton) {
    return;
  }

  if (optionIndex === quiz.answer) {
    state.quizLocked = true;
    selectedButton.classList.add("correct");
    quizResult.className = "quiz-result success";
    quizResult.textContent = "정답입니다. 준비물이 제자리를 찾았습니다.";
    solveActiveObject();

    window.setTimeout(() => {
      closeQuiz();
      afterSolved();
    }, 850);
    return;
  }

  state.quizLocked = true;
  selectedButton.classList.add("wrong");
  quizResult.className = "quiz-result fail";
  quizResult.textContent = "오답입니다. 표시가 사라지면 다시 골라보세요.";

  window.setTimeout(() => {
    selectedButton.classList.remove("wrong");
    quizResult.className = "quiz-result hidden";
    quizResult.textContent = "";
    state.quizLocked = false;
  }, 900);
}

function solveActiveObject() {
  state.solved.add(state.activeObject.id);
  const node = document.getElementById(state.activeObject.id);
  if (node) {
    node.classList.add("solved");
    node.classList.remove("near");
  }
  updateHud();
}

function closeQuiz() {
  quizModal.classList.add("hidden");
  state.quizLocked = false;
}

function afterSolved() {
  if (currentRoomSolvedCount() < currentUnit().objects.length) {
    findNearestObject();
    return;
  }

  if (state.unitIndex < gameData.length - 1) {
    const nextUnit = gameData[state.unitIndex + 1];
    showTransition(`${currentUnit().shortTitle} 완료\n${nextUnit.title}로 이동합니다`, () => {
      state.unitIndex += 1;
      state.focusX = 50;
      state.focusY = 54;
      renderRoom();
    });
    return;
  }

  showTransition("모든 문제 해결\n집으로 돌아갑니다", showVictory);
}

function showTransition(text, callback) {
  state.acceptingInput = false;
  transitionText.innerHTML = text.replace(/\n/g, "<br>");
  transition.classList.remove("hidden");

  window.setTimeout(() => {
    transition.classList.add("hidden");
    state.acceptingInput = true;
    callback();
  }, 1400);
}

function showVictory() {
  victoryMessage.textContent = `${state.playerName}은(는) 과학 문제 ${totalQuestionCount()}개를 모두 해결하고 무사히 집으로 돌아왔습니다.`;
  switchScreen("victory");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function handleKeyDown(event) {
  const movementKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

  if (movementKeys.includes(event.key)) {
    state.keys.add(event.key);
    event.preventDefault();
  }

  if (screens.rules.classList.contains("active") && event.key === "Enter") {
    startGame();
    event.preventDefault();
    return;
  }

  if (screens.victory.classList.contains("active") && event.key === "Enter") {
    resetGame(true);
    event.preventDefault();
    return;
  }

  if (!quizModal.classList.contains("hidden")) {
    const number = Number(event.key);
    if (Number.isInteger(number) && number >= 1 && number <= 4) {
      selectAnswer(number - 1);
      event.preventDefault();
    }

    if (event.key === "Escape") {
      closeQuiz();
      event.preventDefault();
    }
    return;
  }

  if (screens.game.classList.contains("active") && (event.key === " " || event.key === "Enter")) {
    if (state.activeObject) {
      openQuiz(state.activeObject);
    } else {
      showPrompt("조사할 준비물 가까이에서 Space 또는 Enter를 누르세요.");
    }
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  state.keys.delete(event.key);
}

function init() {
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", () => resetGame(true));
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  playerNameInput.focus();
  gameLoop();
}

init();
