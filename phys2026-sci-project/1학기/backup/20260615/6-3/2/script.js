const sceneVisual = document.getElementById("sceneVisual");
const contentArea = document.getElementById("contentArea");
const speakerName = document.getElementById("speakerName");
const dialogueText = document.getElementById("dialogueText");
const livesText = document.getElementById("livesText");
const affectionText = document.getElementById("affectionText");
const yesunAvatar = document.getElementById("yesunAvatar");

const state = {
  scene: "classroom",
  outfit: "pink",
  hair: "soft",
  lives: 5,
  affection: 0,
  finalMistakes: 0,
  quiz: null
};

const outfits = [
  {
    id: "pink",
    name: "분홍 리본룩",
    desc: "밝고 귀여운 분위기의 원피스와 보라색 구두",
    dress: "#e76f8a",
    shoe: "#7b3f87",
    accessory: "#d79a2b"
  },
  {
    id: "mint",
    name: "민트 과학자룩",
    desc: "차분한 민트 재킷과 검은 로퍼",
    dress: "#47a992",
    shoe: "#2d2a32",
    accessory: "#5a86d6"
  },
  {
    id: "coral",
    name: "코랄 자신감룩",
    desc: "당당한 코랄 드레스와 금빛 장신구",
    dress: "#ef8354",
    shoe: "#9c4a28",
    accessory: "#f0c14b"
  }
];

const hairs = [
  {
    id: "soft",
    name: "차분한 단발",
    desc: "깔끔하고 단정한 갈색 단발",
    color: "#47342c"
  },
  {
    id: "wave",
    name: "초코 웨이브",
    desc: "부드럽게 내려오는 짙은 웨이브",
    color: "#2f211d"
  },
  {
    id: "sunny",
    name: "햇살 포니테일",
    desc: "가볍고 산뜻한 밝은 갈색 머리",
    color: "#8b5d33"
  }
];

const questionBank = [
  {
    question: "유리 세정제나 비눗물을 손으로 만졌을 때 공통으로 느껴지는 촉감은 무엇일까요?",
    choices: ["미끈거린다.", "아무런 느낌도 없다.", "끈적끈적하다."],
    answer: 0,
    explain: "염기성 용액은 손으로 만졌을 때 미끈거리는 느낌이 날 수 있어요."
  },
  {
    question: "레몬즙이나 식초를 맛보았을 때 공통으로 느껴지는 맛은 무엇일까요?",
    choices: ["짠맛", "쓴맛", "신맛"],
    answer: 2,
    explain: "레몬즙과 식초는 산성 용액이라 신맛이 납니다."
  },
  {
    question: "산성 용액에 리트머스 종이를 넣었을 때 나타나는 색깔 변화로 올바른 것은 무엇일까요?",
    choices: ["푸른색 리트머스 종이가 붉은색으로 변한다.", "붉은색 리트머스 종이가 푸른색으로 변한다.", "푸른색 리트머스 종이가 푸른색으로 변한다."],
    answer: 0,
    explain: "산성 용액은 푸른색 리트머스 종이를 붉게 바꿉니다."
  },
  {
    question: "붉은색 리트머스 종이에 비눗물을 떨어뜨렸을 때 나타나는 색깔 변화로 옳은 것은 무엇일까요?",
    choices: ["노란색으로 변한다.", "푸른색으로 변한다.", "붉은색 그대로 있다."],
    answer: 1,
    explain: "비눗물은 염기성이므로 붉은색 리트머스 종이를 푸르게 바꿉니다."
  },
  {
    question: "페놀프탈레인 용액은 염기성 용액을 만났을 때 어떤 색으로 변할까요?",
    choices: ["붉은색", "노란색", "초록색"],
    answer: 0,
    explain: "페놀프탈레인 용액은 염기성에서 붉은색 계열로 변합니다."
  },
  {
    question: "산성 용액에 염기성 용액을 조금씩 넣을 때 일어나는 변화로 옳은 설명은 무엇일까요?",
    choices: ["용액의 색깔이 항상 투명해집니다.", "용액의 산성이 점점 강해집니다.", "산성이 점점 약해지다가 염기성 용액으로 변할 수 있습니다."],
    answer: 2,
    explain: "산성 용액에 염기성 용액을 넣으면 산성이 약해지고, 더 넣으면 염기성이 될 수 있어요."
  },
  {
    question: "생활 속에서 산성 용액과 염기성 용액을 이용하는 사례 중 성질이 다른 하나는 무엇일까요?",
    choices: ["기름때 세정제를 사용하여 때를 닦아냅니다.", "생선 비린내를 없애기 위해 레몬즙을 뿌립니다.", "식초를 이용해 물때를 닦아냅니다."],
    answer: 0,
    explain: "레몬즙과 식초는 산성, 기름때 세정제는 보통 염기성 성질을 이용합니다."
  },
  {
    question: "양배추 지시약을 산성 용액에 넣었을 때 나타나는 색은 무엇일까요?",
    choices: ["붉은색 계열", "푸른색이나 초록색", "노란색"],
    answer: 0,
    explain: "양배추 지시약은 산성 용액에서 붉은색 계열로 변합니다."
  },
  {
    question: "다음 중 염기성 용액에 해당하는 물질을 모두 고른 것은 무엇일까요?",
    choices: ["오렌지 주스, 토마토즙", "식초, 사이다", "유리 세정제, 빨래 비눗물"],
    answer: 2,
    explain: "유리 세정제와 빨래 비눗물은 염기성 용액의 예입니다."
  },
  {
    question: "물체가 실제로 움직인 경로의 총 길이를 무엇이라고 하나요?",
    choices: ["이동 거리", "이동 시간", "걸린 시간", "걸린 방향"],
    answer: 0,
    explain: "물체가 지나간 경로의 전체 길이는 이동 거리입니다."
  },
  {
    question: "일정한 시간 동안 이동한 거리가 길수록 물체의 빠르기는 어떻게 될까요?",
    choices: ["더 느려진다.", "더 빨라진다.", "항상 그대로다.", "방향만 바뀐다."],
    answer: 1,
    explain: "같은 시간에 더 먼 거리를 이동하면 빠르기가 더 큽니다."
  },
  {
    question: "속력을 구하는 식으로 알맞은 것은 무엇일까요?",
    choices: ["속력 = 이동 거리 ÷ 걸린 시간", "속력 = 걸린 시간 ÷ 이동 거리", "속력 = 이동 거리 + 걸린 시간", "속력 = 이동 거리 × 걸린 시간"],
    answer: 0,
    explain: "속력은 이동 거리를 걸린 시간으로 나누어 구합니다."
  }
];

const stages = {
  shop: {
    step: "shop",
    sceneClass: "shop",
    speaker: "알바생",
    intro: "저희가 이벤트 중이라서요. 과학 문제를 맞히면 모두 공짜로 드리겠습니다. 하시겠어요?",
    successSpeaker: "알바생",
    success: "약속대로 공짜로 드리겠습니다.",
    failSpeaker: "알바생",
    fail: "아쉽지만 이번에는 인정 도장을 줄 수 없겠어요.",
    next: "salonChoice",
    questions: questionBank.slice(0, 5)
  },
  salon: {
    step: "salon",
    sceneClass: "salon",
    speaker: "미용실 아주머니",
    intro: "아유, 됐엉. 과학 문제 몇 개만 맞히면 공짜로 해줄게.",
    successSpeaker: "여선",
    success: "이게 왠 떡이야. 이제 대망의 용산이에게 고백하러 가야지.",
    failSpeaker: "미용실 아주머니",
    fail: "오늘은 머리 손질보다 과학 복습이 먼저겠구나.",
    next: "confessionIntro",
    questions: questionBank.slice(5, 10)
  },
  final: {
    step: "confession",
    sceneClass: "confession",
    speaker: "용산",
    intro: "나는 너의 과학 실력을 보고 싶은데. 내가 내는 문제를 맞히면 사귈게.",
    successSpeaker: "용산",
    success: "너.. 생각보다 과학을 정말 잘하는 애구나. 좋아, 나랑 사귀자.",
    failSpeaker: "용산",
    fail: "오늘은 조금 아쉬웠어. 다음에 다시 과학 실력을 보여줘.",
    next: "ending",
    questions: [questionBank[1], questionBank[3], questionBank[8], questionBank[10], questionBank[11]]
  }
};

function setScene(sceneClass) {
  sceneVisual.className = `scene-visual ${sceneClass}`;
}

function setDialogue(speaker, text) {
  speakerName.textContent = speaker;
  dialogueText.textContent = text;
}

function setStep(step) {
  const order = ["classroom", "shop", "salon", "confession"];
  document.querySelectorAll(".progress-dot").forEach((dot) => {
    const dotStep = dot.dataset.step;
    dot.classList.toggle("active", dotStep === step);
    dot.classList.toggle("done", order.indexOf(dotStep) < order.indexOf(step));
  });
}

function updateStats() {
  livesText.textContent = String(state.lives);
  affectionText.textContent = String(state.affection);
}

function applyLook() {
  const outfit = outfits.find((item) => item.id === state.outfit) || outfits[0];
  const hair = hairs.find((item) => item.id === state.hair) || hairs[0];
  yesunAvatar.style.setProperty("--dress", outfit.dress);
  yesunAvatar.style.setProperty("--shoe", outfit.shoe);
  yesunAvatar.style.setProperty("--accessory", outfit.accessory);
  yesunAvatar.style.setProperty("--hair", hair.color);
}

function renderStart() {
  state.scene = "classroom";
  state.quiz = null;
  state.lives = 5;
  state.affection = 0;
  state.finalMistakes = 0;
  setScene("classroom");
  setStep("classroom");
  updateStats();
  applyLook();
  setDialogue("여선", "안되겠어.. 용산이에게 고백해야겠다!");
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>용산이의 마음을 얻기 위한 하루가 시작됩니다.</h2>
      <p>여선이는 백화점과 미용실에서 과학 퀴즈를 통과한 뒤, 용산이 앞에서 마지막 과학 실력을 보여줘야 합니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="nextDialogue">다음</button>
      </div>
    </div>
  `;
}

function renderClassroomDialogue(index = 0) {
  const lines = [
    ["여선", "용산이의 이상형은 잘생기고 과학을 잘하는 사람이라고 했었던 것 같은데.. 난가? 큼큼."],
    ["여선", "거기 자네! 나를 좀 도와 주겠니?"],
    ["여선", "먼저 백화점에 가서 고백룩을 골라야겠어."]
  ];
  const [speaker, text] = lines[index];
  setDialogue(speaker, text);
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>${index === lines.length - 1 ? "백화점으로 이동" : "교실"}</h2>
      <p>용산이는 자리에 앉아 있고, 여선이는 마음속으로 작전을 세웁니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="${index === lines.length - 1 ? "shopChoice" : "classroomDialogue"}" data-index="${index + 1}">다음</button>
      </div>
    </div>
  `;
}

function renderShopChoice() {
  state.scene = "shopChoice";
  state.quiz = null;
  setScene("shop");
  setStep("shop");
  updateStats();
  setDialogue("여선", "백화점에 왔으니 마음에 드는 옷과 신발, 장신구를 골라보자.");
  contentArea.innerHTML = `
    <div class="option-grid">
      ${outfits.map((item) => `
        <button class="option-card ${state.outfit === item.id ? "selected" : ""}" type="button" data-action="selectOutfit" data-id="${item.id}">
          <span class="mini-look" style="--mini-dress:${item.dress}; --mini-shoe:${item.shoe}; --mini-acc:${item.accessory};">
            <span class="mini-top"></span>
            <span class="mini-shoe"></span>
            <span class="mini-acc"></span>
          </span>
          <h2>${item.name}</h2>
          <p>${item.desc}</p>
        </button>
      `).join("")}
    </div>
    <div class="action-row" style="margin-top:16px">
      <button class="primary-btn" type="button" data-action="shopCheckout">계산하러 가기</button>
    </div>
  `;
}

function renderShopCheckout() {
  setDialogue("여선", "여기 계산이요!");
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>계산대</h2>
      <p>알바생이 여선이에게 과학 이벤트를 제안합니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="startQuiz" data-stage="shop">이벤트 도전</button>
      </div>
    </div>
  `;
}

function renderSalonChoice() {
  state.scene = "salonChoice";
  state.quiz = null;
  setScene("salon");
  setStep("salon");
  updateStats();
  setDialogue("여선", "기분 좋게 미용실에 도착했다. 이번에는 머리 스타일을 골라보자.");
  contentArea.innerHTML = `
    <div class="option-grid">
      ${hairs.map((item) => `
        <button class="option-card ${state.hair === item.id ? "selected" : ""}" type="button" data-action="selectHair" data-id="${item.id}">
          <span class="mini-look" style="--mini-hair:${item.color};">
            <span class="mini-hair"></span>
          </span>
          <h2>${item.name}</h2>
          <p>${item.desc}</p>
        </button>
      `).join("")}
    </div>
    <div class="action-row" style="margin-top:16px">
      <button class="primary-btn" type="button" data-action="salonCheckout">계산하기</button>
    </div>
  `;
}

function renderSalonCheckout() {
  setDialogue("여선", "계산할게요!");
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>미용실 계산대</h2>
      <p>미용실 아주머니가 과학 퀴즈를 맞히면 공짜로 해주겠다고 합니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="startQuiz" data-stage="salon">퀴즈 풀기</button>
      </div>
    </div>
  `;
}

function renderConfessionIntro(index = 0) {
  state.scene = "confessionIntro";
  state.quiz = null;
  setScene("confession");
  setStep("confession");
  updateStats();
  const lines = [
    ["용산", "어? 여선아, 왠일이야?"],
    ["여선", "그... 사실... 그러니까 말야..."],
    ["용산", "응? 뭐라고?"],
    ["여선", "나 너 좋아해! 나랑 사귈래?"],
    ["용산", "음... 나는 너 과학 실력을 보고 싶은데. 내가 내는 과학 문제를 맞히면 사귈게!"],
    ["여선", "좋아..! 용산이와 사귀기 위해서라면!"]
  ];
  const [speaker, text] = lines[index];
  setDialogue(speaker, text);
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>${index === lines.length - 1 ? "마지막 과학 승부" : "고백의 순간"}</h2>
      <p>여선이는 떨리는 마음을 숨기고 용산이 앞에 섰습니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="${index === lines.length - 1 ? "startQuiz" : "confessionDialogue"}" data-stage="final" data-index="${index + 1}">다음</button>
      </div>
    </div>
  `;
}

function startQuiz(stageId) {
  const stage = stages[stageId];
  state.quiz = {
    stageId,
    index: 0,
    correct: 0,
    answered: false
  };
  state.lives = 5;
  if (stageId === "final") {
    state.affection = 0;
    state.finalMistakes = 0;
  }
  setScene(stage.sceneClass);
  setStep(stage.step);
  setDialogue(stage.speaker, stage.intro);
  updateStats();
  renderQuizQuestion();
}

function renderQuizQuestion(feedback = "") {
  const stage = stages[state.quiz.stageId];
  const question = stage.questions[state.quiz.index];
  const total = stage.questions.length;
  const affectionMeter = state.quiz.stageId === "final"
    ? `<div class="meter" aria-label="호감도"><span style="--meter:${state.affection}%"></span></div>`
    : "";

  contentArea.innerHTML = `
    <div class="quiz-layout">
      <div class="quiz-meta">
        <span class="meta-pill">문제 ${state.quiz.index + 1} / ${total}</span>
        <span class="meta-pill">남은 목숨 ${state.lives}</span>
        <span class="meta-pill">정답 ${state.quiz.correct}</span>
      </div>
      ${affectionMeter}
      <div class="question-card">
        <h2>${question.question}</h2>
        <div class="choices">
          ${question.choices.map((choice, index) => `
            <button class="choice-btn" type="button" data-action="answerQuiz" data-choice="${index}">${index + 1}. ${choice}</button>
          `).join("")}
        </div>
      </div>
      <p class="feedback">${feedback}</p>
    </div>
  `;
}

function answerQuiz(choiceIndex) {
  if (!state.quiz || state.quiz.answered) {
    return;
  }

  const stage = stages[state.quiz.stageId];
  const question = stage.questions[state.quiz.index];
  const buttons = [...contentArea.querySelectorAll(".choice-btn")];
  const correct = choiceIndex === question.answer;

  state.quiz.answered = true;
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (correct && index === question.answer) {
      button.classList.add("correct");
    }
    if (index === choiceIndex && !correct) {
      button.classList.add("wrong");
    }
  });

  if (correct) {
    state.quiz.correct += 1;
    if (state.quiz.stageId === "final") {
      state.affection = Math.min(100, state.affection + 20);
    }
    updateStats();
    setDialogue("여선", "좋아, 이건 확실히 알겠어!");
    showNextQuizStep(`정답입니다. ${question.explain}`);
    return;
  }

  state.lives -= 1;
  if (state.quiz.stageId === "final") {
    state.finalMistakes += 1;
  }
  updateStats();
  setDialogue("여선", "앗, 다시 생각해볼걸.");

  if (state.lives <= 0) {
    renderQuizFail();
    return;
  }

  showRetryQuizStep("아쉬워요. 목숨이 하나 줄었습니다. 같은 문제를 다시 풀어보세요.");
}

function showNextQuizStep(feedback) {
  const stage = stages[state.quiz.stageId];
  const isLast = state.quiz.index >= stage.questions.length - 1;
  const quizLayout = contentArea.querySelector(".quiz-layout");
  const feedbackNode = contentArea.querySelector(".feedback");

  feedbackNode.textContent = feedback;
  const row = document.createElement("div");
  row.className = "action-row";
  row.innerHTML = `<button class="primary-btn" type="button" data-action="${isLast ? "finishQuiz" : "nextQuiz"}">${isLast ? "결과 보기" : "다음 문제"}</button>`;
  quizLayout.appendChild(row);
}

function showRetryQuizStep(feedback) {
  const quizLayout = contentArea.querySelector(".quiz-layout");
  const feedbackNode = contentArea.querySelector(".feedback");

  feedbackNode.textContent = feedback;
  const row = document.createElement("div");
  row.className = "action-row";
  row.innerHTML = `<button class="primary-btn" type="button" data-action="retryQuestion">다시 풀기</button>`;
  quizLayout.appendChild(row);
}

function nextQuiz() {
  state.quiz.index += 1;
  state.quiz.answered = false;
  const stage = stages[state.quiz.stageId];
  setDialogue(stage.speaker, state.quiz.stageId === "final" ? "다음 문제야." : "다음 과학 문제입니다.");
  renderQuizQuestion();
}

function retryQuestion() {
  state.quiz.answered = false;
  const stage = stages[state.quiz.stageId];
  setDialogue(stage.speaker, state.quiz.stageId === "final" ? "다시 생각해봐." : "다시 한번 생각해보세요.");
  renderQuizQuestion();
}

function finishQuiz() {
  const stage = stages[state.quiz.stageId];
  setDialogue(stage.successSpeaker, stage.success);
  state.quiz = null;
  updateStats();

  if (stage.next === "ending") {
    renderEnding(true);
    return;
  }

  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>통과</h2>
      <p>여선이는 과학 문제를 통과하고 다음 장소로 향합니다.</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="${stage.next}">다음 장소</button>
      </div>
    </div>
  `;
}

function renderQuizFail() {
  const stage = stages[state.quiz.stageId];
  setDialogue(stage.failSpeaker, stage.fail);
  const stageId = state.quiz.stageId;
  state.quiz = null;
  updateStats();

  if (stageId === "final") {
    renderEnding(false);
    return;
  }

  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>다시 도전</h2>
      <p>${stageId === "shop" ? "옷을 구입하려면 알바생의 인정을 받아야 합니다." : "머리를 예쁘게 하려면 미용실 퀴즈를 통과해야 합니다."}</p>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="startQuiz" data-stage="${stageId}">다시 하기</button>
        <button class="secondary-btn" type="button" data-action="${stageId === "shop" ? "shopChoice" : "salonChoice"}">다시 고르기</button>
      </div>
    </div>
  `;
}

function renderEnding(success) {
  state.scene = "ending";
  state.quiz = null;
  setScene("confession");
  setStep("confession");
  updateStats();

  if (!success) {
    setDialogue("여선", "다음에는 꼭 더 잘할 수 있어.");
    contentArea.innerHTML = `
      <div class="ending-card">
        <h2>게임 오버</h2>
        <p>목숨이 모두 닳아 용산이의 마지막 과학 퀴즈를 통과하지 못했습니다. 그래도 여선이는 복습할 문제를 정확히 알게 되었습니다.</p>
        <div class="meter"><span style="--meter:${state.affection}%"></span></div>
        <div class="action-row">
          <button class="primary-btn" type="button" data-action="startQuiz" data-stage="final">마지막 퀴즈 다시 하기</button>
          <button class="secondary-btn" type="button" data-action="restart">처음부터</button>
        </div>
      </div>
    `;
    return;
  }

  let title = "두근두근 성공 엔딩";
  let message = "용산이는 여선이의 과학 실력과 용기를 보고 마음을 열었습니다.";
  if (state.finalMistakes === 0) {
    title = "완벽한 과학 고백 엔딩";
    message = "여선이는 한 번도 틀리지 않고 용산이의 문제를 모두 맞혔습니다. 용산이의 호감도는 최고치입니다.";
  } else if (state.finalMistakes >= 3) {
    title = "간신히 성공 엔딩";
    message = "조금 아슬아슬했지만 여선이는 끝까지 포기하지 않고 모든 문제를 해결했습니다.";
  }

  setDialogue("여선", "너..! 나를 도와줘서 고마워. 이 은혜 잊지 못할 거야!");
  contentArea.innerHTML = `
    <div class="ending-card">
      <h2>${title}</h2>
      <p>${message}</p>
      <p>용산: 너.. 생각보다 과학을 정말 잘하는 애구나. 좋아..! 나랑 사귀자.</p>
      <div class="meter"><span style="--meter:${state.affection}%"></span></div>
      <div class="action-row">
        <button class="primary-btn" type="button" data-action="restart">처음부터 다시</button>
      </div>
    </div>
  `;
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) {
    return;
  }

  if (action === "nextDialogue") {
    renderClassroomDialogue(0);
  }

  if (action === "classroomDialogue") {
    renderClassroomDialogue(Number(target.dataset.index));
  }

  if (action === "shopChoice") {
    renderShopChoice();
  }

  if (action === "selectOutfit") {
    state.outfit = target.dataset.id;
    applyLook();
    renderShopChoice();
  }

  if (action === "shopCheckout") {
    renderShopCheckout();
  }

  if (action === "salonChoice") {
    renderSalonChoice();
  }

  if (action === "selectHair") {
    state.hair = target.dataset.id;
    applyLook();
    renderSalonChoice();
  }

  if (action === "salonCheckout") {
    renderSalonCheckout();
  }

  if (action === "confessionIntro") {
    renderConfessionIntro(0);
  }

  if (action === "confessionDialogue") {
    renderConfessionIntro(Number(target.dataset.index));
  }

  if (action === "startQuiz") {
    startQuiz(target.dataset.stage);
  }

  if (action === "answerQuiz") {
    answerQuiz(Number(target.dataset.choice));
  }

  if (action === "nextQuiz") {
    nextQuiz();
  }

  if (action === "retryQuestion") {
    retryQuestion();
  }

  if (action === "finishQuiz") {
    finishQuiz();
  }

  if (action === "restart") {
    renderStart();
  }
}

contentArea.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (target) {
    handleAction(target);
  }
});

applyLook();
renderStart();
