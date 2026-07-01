const unitDefinitions = [
  {
    title: "1단원: 산과 염기",
    shortTitle: "산·염기",
    sceneClass: "unit-acid",
    icons: ["🧪", "🧫", "🔬", "🧴", "📄"],
    labels: [
      "푸른 리트머스 종이", "페놀프탈레인 용액", "붉은 양배추 지시약", "비눗물 병", "식초 비커",
      "유리 세정제", "조개 껍데기", "염기성 용액", "산성화 기록지", "레몬즙",
      "대리석 조각", "사이다 컵", "달걀껍데기", "중화 실험 컵", "지시약 상자"
    ],
    quizzes: [
      {
        question: "산성 용액을 푸른색 리트머스 종이에 떨어뜨리면 무슨 색으로 변하나요?",
        options: ["붉은 색", "푸른 색", "검정 색", "무지개 색"],
        answer: 0
      },
      {
        question: "페놀프탈레인 용액에 산성용액을 떨어뜨리면 무슨 색으로 변하나요?",
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
        question: "붉은 양배추 지시약과 다른 지시약(페놀프탈레인 용액, 붉은색 리트머스 종이, 푸른색 리트머스 종이)의 차이점은 무엇인가요?",
        options: ["양배추 지시약은 먹을 수 있다", "다른 지시약은 산성, 염기성 중에 하나만 제시하는데 붉은 양배추 지시약은 둘 다 지시한다"],
        answer: 1
      },
      {
        question: "페놀프탈레인 용액에 염기성 성질을 띄는 용액에 떨어뜨리면 붉은색으로 변한다.",
        options: ["O", "X"],
        answer: 0
      },
      {
        question: "산성용액은 조개 껍데기를 녹일 수 있나요?",
        options: ["O", "X"],
        answer: 0
      },
      {
        question: "붉은 양배추 지시약에 염기성 용액을 떨어뜨렸을 때 나타나는 색깔은 무엇인가요?",
        options: ["붉은색 계열", "노란색이나 푸른색 계열", "무색투명한", "보라색 그대로 유지"],
        answer: 1
      },
      {
        question: "산성화가 계속 된다면 어떤 문제가 생기나요?",
        options: ["산성비가 계속 내리면 산림이 황폐해진다", "토양 산성화가 계속된다면 식물들이 잘 자란다"],
        answer: 0
      },
      {
        question: "다음 중 주변에서 흔히 볼 수 있는 대표적인 산성 용액은 무엇인가요?",
        options: ["석회수", "레몬즙", "유리 세정제", "빨래 비눗물"],
        answer: 1
      },
      {
        question: "다음 중 산성 용액에 대리석 조각을 넣었을 때 일어나는 현상으로 가장 올바른 것은 무엇인가요?",
        options: ["대리석이 단단해진다", "용액의 색깔이 검게 변한다", "거품이 발생하며 대리석이 녹는다", "대리석 주위로 얼음이 고체화된다"],
        answer: 2
      },
      {
        question: "다음 중 식초나 사이다와 같은 산성 용액이 갖는 일반적인 성질로 올바른 것은 무엇인가요?",
        options: ["만졌을 때 미끈미끈하다", "주로 쓴맛이 난다", "달걀껍데기를 전혀 녹이지 못한다", "주로 신맛이 난다"],
        answer: 3
      },
      {
        question: "다음 중 산성 용액에 달걀껍데기를 넣었을 때 일어나는 변화를 올바르게 설명한 것은 무엇인가요?",
        options: ["달걀껍데기가 더 두꺼워진다", "아무런 변화가 일어나지 않는다", "거품이 생기면서 달걀껍데기가 녹는다", "달걀껍데기가 파란색으로 변한다"],
        answer: 2
      },
      {
        question: "다음 중 산성 용액과 염기성 용액을 섞었을 때 일어나는 변화로 올바른 것은 무엇인가요?",
        options: ["서로의 성질을 약하게 만든다", "두 용액의 성질이 모두 강해진다", "용액의 온도가 급격히 차가워진다", "갑자기 붉은색으로 변하며 폭발한다"],
        answer: 0
      },
      {
        question: "페놀프탈레인 용액이 붉게 변하는 용액은 무엇인가요?",
        options: ["산성 용액", "염기성 용액", "산성과 염기성이 아닌 용액"],
        answer: 1
      }
    ]
  },
  {
    title: "2단원: 물체의 운동",
    shortTitle: "운동",
    sceneClass: "unit-motion",
    icons: ["⏱️", "🚗", "📏", "🛤️", "⚙️"],
    labels: [
      "초시계", "미니카", "운동 카드", "기준점 표지", "속력 계산판", "100m 기록지", "단위 카드", "위치 설명판", "운동 설명 카드",
      "거리 비교표", "시간 기록표", "생활 속 속력", "운동 정의 카드", "무게 카드", "버스 모형"
    ],
    quizzes: [
      {
        question: "시간에 따라 위치가 바뀌는 것은 무엇이라고 하나요?",
        options: ["운동", "위치", "물체", "달리기"],
        answer: 0
      },
      {
        question: "운동에 맞는 상황을 고르시오.",
        options: ["달리기", "앉았다 일어나기", "가만히 서있기", "꽃에 물주기"],
        answer: 0
      },
      {
        question: "물체의 위치가 바뀌는 것을 운동이라고 한다.",
        options: ["O", "X"],
        answer: 0
      },
      {
        question: "과학에서 물체의 운동을 설명하기 위해 반드시 필요한 세 가지 요소가 아닌 것은 무엇인가요?",
        options: ["기준점", "물체의 무게", "방향", "거리"],
        answer: 1
      },
      {
        question: "어떤 달리기 선수가 10초 동안 50m를 달렸습니다. 이 선수의 속력은 얼마인가요?",
        options: ["5m/s", "500m/s", "10m/s", "50m/s"],
        answer: 0
      },
      {
        question: "체육시간에 100m 달리기를 했습니다. 가장 빠른 사람을 고르세요.",
        options: ["10초 성호", "12초 재현", "15초 상혁", "13초 수혁"],
        answer: 0
      },
      {
        question: "다음 중 속력의 단위로 올바르지 않은 것은 무엇인가요?",
        options: ["km/h", "kg/m", "m/s", "cm/s"],
        answer: 1
      },
      {
        question: "물체의 위치를 정확하게 나타내기 위해 반드시 포함되어야 하는 세 가지 요소가 아닌 것은 무엇인가요?",
        options: ["방향", "물체의 무게", "기준점", "거리"],
        answer: 1
      },
      {
        question: "다음 중 과학에서 말하는 물체의 운동에 대한 설명으로 가장 바른 것은 무엇인가요?",
        options: ["물체의 모양이 변하는 것", "물체의 위치가 시간에 따라 변하는 것", "물체의 온도가 높아지는 것", "물체의 무게가 무거워지는 것"],
        answer: 1
      },
      {
        question: "같은 거리를 이동할 때, 걸린 시간이 가장 짧은 물체의 빠르기는 어떠한가요?",
        options: ["가장 빠르다", "가장 느리다", "중간이다", "알 수 없다"],
        answer: 0
      },
      {
        question: "일정한 속력으로 움직이는 물체가 움직인 시간이 길어질수록 이동한 거리는 어떻게 되나요?",
        options: ["늘어난다", "줄어든다", "변하지 않는다", "줄어들다 늘어난다"],
        answer: 0
      },
      {
        question: "다음 중 일상생활에서 속력을 이용하는 예가 아닌 것은 무엇인가요?",
        options: ["태풍의 이동 속도 확인하기", "고속도로의 제한 속도 표지판 보기", "야구 투수가 던진 공의 빠르기 측정하기", "스마트폰의 무게 측정하기"],
        answer: 3
      },
      {
        question: "과학에서 말하는 물체의 운동에 대한 올바른 설명은 무엇인가요?",
        options: ["물체의 색깔이 변하는 것", "물체의 모양이나 크기가 변하는 것", "물체가 가만히 멈춰 서 있는 것", "시간에 따라 위치가 바뀌는 것"],
        answer: 3
      },
      {
        question: "다음 중 물체의 위치 변화를 설명할 때 반드시 포함되어야 하는 세 가지 요소가 아닌 것은 무엇인가요?",
        options: ["기준점", "방향", "거리", "물체의 무게"],
        answer: 3
      },
      {
        question: "다음 중 일상생활에서 볼 수 있는 물체의 운동 중 빠르기가 일정하지 않고 계속 변하는 운동은 무엇인가요?",
        options: ["일정한 속력으로 움직이는 에스컬레이터", "정류장에 멈추기 위해 속도를 줄이는 버스", "일정한 빠르기로 도는 시계바늘", "무빙워크 위에 가만히 서 있는 사람"],
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
      "세포 그림", "뿌리 설명 카드", "고구마 화분", "기공 표본", "증산 실험 봉지", "꽃 모형", "뿌리 표본",
      "줄기 단면", "아이오딘 용액", "잎 표본", "비닐봉지 실험", "광합성 카드", "줄기 통로", "수술 모형", "가시 식물 카드"
    ],
    quizzes: [
      {
        question: "생물을 이루고 있는 기본 단위를 뭐라고 하나요?",
        options: ["세포", "뿌리", "줄기", "세포막"],
        answer: 0
      },
      {
        question: "뿌리에 대한 설명으로 알맞게 짝 지어진 것을 고르시오. 뿌리는 물을 __ 하고 식물이 쓰러지지 않게 __ 합니다. 또한 뿌리에 양분을 __합니다.",
        options: ["머금고, 고정, 추가", "흡수, 지지, 저장", "흡수, 저장, 지지"],
        answer: 1
      },
      {
        question: "뿌리에 양분을 저장하는 식물을 바르게 짝지어 둔 것은 무엇인가요?",
        options: ["고구마, 수박", "딸기, 무", "고구마, 무", "토마토, 망고스틴"],
        answer: 2
      },
      {
        question: "기공이 무엇인지 설명하세요.",
        options: ["잎의 표면에 있는 작은 구멍", "잎의 표면에 있는 큰 구멍", "구멍"],
        answer: 0
      },
      {
        question: "잎에 도달한 물이 수증기가 되어 기공을 통해 빠져나가는 것을 뭐라고 할까요?",
        options: ["광합성", "기공", "증산작용"],
        answer: 2
      },
      {
        question: "다음 중 꽃을 이루고 있지 않는 것을 고르시오.",
        options: ["수술", "암술", "꽃잎", "꽃받침", "강낭콩"],
        answer: 4
      },
      {
        question: "식물의 몸을 지탱하고 흙 속의 물과 양분을 흡수하는 곳은 어디인가요?",
        options: ["잎", "줄기", "꽃", "뿌리"],
        answer: 3
      },
      {
        question: "식물의 기관 중 줄기가 없으면 어떻게 되나요?",
        options: ["줄기가 없으면 식물이 더 잘 산다", "줄기가 없으면 식물의 양분이 고르게 이동되지 못하고 지지 되지 못하여 식물의 생존이 어려워진다"],
        answer: 1
      },
      {
        question: "잎에서 만든 양분이 녹말인지 확인하기 위해 아이오딘-아이오딘화 칼륨 용액을 떨어뜨렸을 때 나타나는 색깔 변화는 무엇인가요?",
        options: ["황록색", "청남색", "적갈색", "무색"],
        answer: 1
      },
      {
        question: "식물의 잎에 도달한 물이 기공을 통해 수증기 형태로 공기 중으로 나가는 현상을 무엇이라고 하나요?",
        options: ["광합성", "호흡 작용", "증산 작용", "흡수 작용"],
        answer: 2
      },
      {
        question: "투명한 비닐봉지를 식물의 잎에 씌워 두었더니 비닐봉지 안쪽에 물방울이 맺혔습니다. 이 실험으로 알 수 있는 식물의 작용은 무엇인가요?",
        options: ["광합성", "호흡 작용", "증산 작용", "소화 작용"],
        answer: 2
      },
      {
        question: "식물의 뿌리가 하는 기능으로 올바르지 않은 것은 무엇인가요?",
        options: ["식물이 쓰러지지 않도록 지지한다", "남은 양분을 저장하기도 한다", "흙 속의 물과 무기 양분을 흡수한다", "광합성을 하여 양분을 만든다"],
        answer: 3
      },
      {
        question: "뿌리에서 흡수한 물이 식물 전체로 이동할 때 지나가는 통로가 있는 기관은 어디인가요?",
        options: ["뿌리", "줄기", "잎", "열매", "꽃"],
        answer: 1
      },
      {
        question: "꽃의 구조 중에서 꽃가루를 만들어내는 곳은 어디인가요?",
        options: ["암술", "꽃받침", "씨앗", "수술"],
        answer: 3
      },
      {
        question: "선인장의 가시나 장미의 가시처럼, 원래는 잎이나 줄기였던 부분이 주변 환경으로부터 자신을 보호하기 위해 변한 것을 무엇이라고 하나요?",
        options: ["저장", "적응", "광합성", "호흡 기관"],
        answer: 1
      }
    ]
  },
  {
    title: "4단원: 지구의 운동",
    shortTitle: "지구 운동",
    sceneClass: "unit-earth",
    icons: ["🌐", "🌙", "☀️", "🧭", "🔦"],
    labels: [
      "북극성 카드", "지구본", "낮밤 카드", "계절 카드", "자전 방향 표지", "태양 전등", "자전축 막대", "별자리 판",
      "여름 별자리 카드", "낮 카드", "공전 궤도", "사자자리 카드", "별자리 기록장", "운동 분류표", "자전 시간 카드"
    ],
    quizzes: [
      {
        question: "북반구에서 밤하늘의 별을 관측할 때, 거의 움직이지 않고 제자리에 있는 것처럼 보이는 별은?",
        options: ["금성", "목성", "북극성", "토성"],
        answer: 2
      },
      {
        question: "지구가 자전축을 중심으로 하루에 한 바퀴씩 제자리에서 도는 운동을 무엇이라고 합니까?",
        options: ["공전", "자전", "회전", "운동"],
        answer: 1
      },
      {
        question: "지구의 자전 때문에 매일매일 반복해서 나타나는 현상은 무엇인가요?",
        options: ["낮과 밤", "계절 변화", "별자리 변화", "달의 모양 변화"],
        answer: 0
      },
      {
        question: "지구에서 계절 변화가 생기는 원인은 무엇인가요?",
        options: ["달이 지구를 돌아서", "지구가 똑바로 서 있어서", "지구가 공전해서", "태양이 움직여서"],
        answer: 2
      },
      {
        question: "지구가 자전하는 방향은 어느 쪽에서 어느 쪽인가요?",
        options: ["서쪽에서 동쪽", "동쪽에서 서쪽", "북쪽에서 남쪽", "남쪽에서 북쪽"],
        answer: 0
      },
      {
        question: "태양이 매일 아침 동쪽에서 떠서 서쪽으로 지는 것처럼 보이는 이유는 무엇입니까?",
        options: ["지구가 태양 주위를 공전하기 때문에", "지구가 자전하기 때문에"],
        answer: 1
      },
      {
        question: "지구가 스스로 하루에 한 바퀴씩 도는 운동을 무엇이라고 하나요?",
        options: ["공전", "이동", "자전", "회전"],
        answer: 2
      },
      {
        question: "지구의 공전 때문에 나타나는 현상으로, 계절에 따라 밤하늘에서 볼 수 있는 무엇이 달라지나요?",
        options: ["별자리", "태양의 크기", "낮의 길이", "달의 모양"],
        answer: 0
      },
      {
        question: "여름철 밤하늘에서 찾아볼 수 있는 대표적인 별자리는 무엇인가요?",
        options: ["오리온자리", "사자자리", "페가수스자리", "백조자리"],
        answer: 3
      },
      {
        question: "지구가 자전할 때, 태양 빛을 받는 쪽은 무엇이 되나요?",
        options: ["밤", "낮", "저녁"],
        answer: 1
      },
      {
        question: "계절에 따라 밤하늘에서 볼 수 있는 대표적인 별자리가 달라지는 이유는 무엇인가요?",
        options: ["별들이 사라지기 때문에", "지구가 자전하기 때문에", "태양이 움직이기 때문에", "지구가 공전하기 때문에"],
        answer: 3
      },
      {
        question: "우리나라에서 봄철에 사자자리가 가장 잘 보이는 시간대는 언제인가요?",
        options: ["이른 아침", "낮 12시", "한밤중", "해가 뜰 때"],
        answer: 2
      },
      {
        question: "지구의 공전 때문에 일어나는 현상은 무엇인가요?",
        options: ["계절에 따라 보이는 별자리가 달라진다", "하루 동안 낮과 밤이 바뀐다", "태양이 매일 동쪽에서 뜬다", "한 시간마다 별의 위치가 바뀐다"],
        answer: 0
      },
      {
        question: "다음 중 지구의 두 가지 대표적인 운동은 무엇인가요?",
        options: ["자전과 회전", "자전과 공전", "공전과 이동", "이동과 회전"],
        answer: 1
      },
      {
        question: "지구가 한 바퀴씩 자전하는 데 걸리는 시간은 정확히 얼마인가요?",
        options: ["1시간", "12시간", "24시간", "48시간"],
        answer: 2
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
  acceptingInput: true,
  viewMode: "third",
  lastDirection: "down",
  isMoving: false
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
const viewToggle = document.getElementById("view-toggle");
const unitTabs = document.getElementById("unit-tabs");
const labScene = document.getElementById("lab-scene");
const roomObjects = document.getElementById("room-objects");
const focus = document.getElementById("focus");
const thirdPersonPlayer = document.getElementById("third-person-player");
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
  state.viewMode = "third";
  state.lastDirection = "down";
  state.isMoving = false;
  closeQuiz();
  updateViewMode();

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

  labScene.className = `${unit.sceneClass} view-${state.viewMode}`;
  hudName.textContent = state.playerName;
  hudRoom.textContent = unit.title;
  renderUnitTabs();
  renderObjects();
  updateHud();
  updateViewMode();
  updateFocus();
  showPrompt(`${unit.title}입니다. WASD로 아바타를 움직여 준비물에 가까이 가세요.`);
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
    const depth = Math.round((object.y - 50) * 7);
    const scale = (0.78 + (object.y - 28) * 0.011).toFixed(2);
    const hoverDepth = depth + 56;
    const hoverScale = Math.min(Number(scale) + 0.1, 1.36).toFixed(2);
    objectButton.style.setProperty("--object-depth", `${depth}px`);
    objectButton.style.setProperty("--object-scale", scale);
    objectButton.style.setProperty("--object-hover-depth", `${hoverDepth}px`);
    objectButton.style.setProperty("--object-hover-scale", hoverScale);
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
        showPrompt("WASD로 아바타를 준비물 가까이 이동한 뒤 Space 또는 Enter로 조사하세요.");
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
  thirdPersonPlayer.style.left = `${state.focusX}%`;
  thirdPersonPlayer.style.top = `${state.focusY}%`;
  updateAvatarPose();
  const cameraX = Math.round((state.focusX - 50) * 3.1);
  const cameraY = Math.round((state.focusY - 54) * 1.6);
  labScene.style.setProperty("--camera-x", `${cameraX}px`);
  labScene.style.setProperty("--camera-y", `${cameraY}px`);
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

  if (state.keys.has("left")) {
    state.focusX -= speed;
    moved = true;
    state.lastDirection = "left";
  }
  if (state.keys.has("right")) {
    state.focusX += speed;
    moved = true;
    state.lastDirection = "right";
  }
  if (state.keys.has("up")) {
    state.focusY -= speed;
    moved = true;
    state.lastDirection = "up";
  }
  if (state.keys.has("down")) {
    state.focusY += speed;
    moved = true;
    state.lastDirection = "down";
  }

  state.focusX = clamp(state.focusX, 8, 92);
  state.focusY = clamp(state.focusY, 23, 78);
  state.isMoving = moved;
  updateAvatarPose();

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
    showPrompt("WASD로 아바타를 움직여 과학실 준비물 가까이 이동하세요.");
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

function updateAvatarPose() {
  if (!thirdPersonPlayer) {
    return;
  }

  thirdPersonPlayer.classList.toggle("walking", state.isMoving);
  thirdPersonPlayer.classList.toggle("facing-left", state.lastDirection === "left");
  thirdPersonPlayer.classList.toggle("facing-right", state.lastDirection === "right");
  thirdPersonPlayer.classList.toggle("facing-up", state.lastDirection === "up");
  thirdPersonPlayer.classList.toggle("facing-down", state.lastDirection === "down");
}

function toggleViewMode() {
  state.viewMode = state.viewMode === "first" ? "third" : "first";
  updateViewMode();
  updateFocus();
}

function updateViewMode() {
  if (!labScene || !viewToggle) {
    return;
  }

  labScene.classList.toggle("view-first", state.viewMode === "first");
  labScene.classList.toggle("view-third", state.viewMode === "third");
  viewToggle.textContent = state.viewMode === "first" ? "시점: 1인칭" : "시점: 3인칭";
  viewToggle.setAttribute("aria-pressed", state.viewMode === "third" ? "true" : "false");
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
    const optionCount = quizOptions.querySelectorAll(".quiz-option").length;
    if (Number.isInteger(number) && number >= 1 && number <= optionCount) {
      selectAnswer(number - 1);
      event.preventDefault();
    }

    if (event.key === "Escape") {
      closeQuiz();
      event.preventDefault();
    }
    return;
  }

  const moveKey = getMoveKey(event.key);
  if (moveKey && screens.game.classList.contains("active") && quizModal.classList.contains("hidden")) {
    state.keys.add(moveKey);
    event.preventDefault();
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
  const moveKey = getMoveKey(event.key);
  if (moveKey) {
    state.keys.delete(moveKey);
    if (state.keys.size === 0) {
      state.isMoving = false;
      updateAvatarPose();
    }
  }
}

function getMoveKey(key) {
  const normalized = key.toLowerCase();

  if (normalized === "a" || key === "ArrowLeft") return "left";
  if (normalized === "d" || key === "ArrowRight") return "right";
  if (normalized === "w" || key === "ArrowUp") return "up";
  if (normalized === "s" || key === "ArrowDown") return "down";

  return null;
}

function init() {
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", () => resetGame(true));
  viewToggle.addEventListener("click", toggleViewMode);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  playerNameInput.focus();
  gameLoop();
}

init();
