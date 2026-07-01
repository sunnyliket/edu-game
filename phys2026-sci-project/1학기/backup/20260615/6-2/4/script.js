(() => {
  const TOTAL_KEYS = 10;
  const STUDY_SECONDS = 10;

  const students = ["예승", "리원", "지후", "성현"];

  const questionBank = [
    {
      category: "지구의 운동",
      question: "해가 동쪽에서 뜨고 서쪽으로 지는 것처럼 보이는 까닭은?",
      answer: "지구가 서쪽에서 동쪽으로 자전하기 때문",
      choices: [
        "지구가 서쪽에서 동쪽으로 자전하기 때문",
        "태양이 하루에 한 번 지구 주위를 실제로 돌기 때문",
        "지구가 동쪽에서 서쪽으로 자전하기 때문",
        "달이 지구를 가려서 그렇게 보이기 때문"
      ],
      study: "지구가 서쪽에서 동쪽으로 자전하기 때문에 해가 동쪽에서 떠서 서쪽으로 지는 것처럼 보입니다."
    },
    {
      category: "산과 염기",
      question: "지시약이 무엇인지 설명한 것으로 알맞은 것은?",
      answer: "용액의 성질에 따라서 색깔이 변하는 물질",
      choices: [
        "용액의 성질에 따라서 색깔이 변하는 물질",
        "물체의 빠르기를 재는 도구",
        "식물이 양분을 저장하는 기관",
        "해가 뜨는 방향을 알려 주는 물질"
      ],
      study: "지시약은 산성, 중성, 염기성 같은 용액의 성질에 따라 색이 변하는 물질입니다."
    },
    {
      category: "산과 염기",
      question: "산성 용액과 염기성 용액을 바르게 분류한 것은?",
      answer: "산성: 탄산수, 레몬즙, 묽은 염산 / 염기성: 석회수, 빨랫비누 물, 묽은 수산화 나트륨 용액",
      choices: [
        "산성: 탄산수, 레몬즙, 묽은 염산 / 염기성: 석회수, 빨랫비누 물, 묽은 수산화 나트륨 용액",
        "산성: 석회수, 빨랫비누 물 / 염기성: 탄산수, 레몬즙",
        "산성: 물, 모래 / 염기성: 공기, 소금",
        "산성: 모든 투명한 액체 / 염기성: 모든 색깔 있는 액체"
      ],
      study: "탄산수, 레몬즙, 묽은 염산은 산성이고 석회수, 빨랫비누 물, 묽은 수산화 나트륨 용액은 염기성입니다."
    },
    {
      category: "산과 염기",
      question: "페놀프탈레인 용액의 색깔이 변하지 않는 용액은?",
      answer: "산성 용액",
      choices: ["산성 용액", "염기성 용액", "빨랫비누 물", "묽은 수산화 나트륨 용액"],
      study: "페놀프탈레인 용액은 염기성에서 붉은색 계열로 변하고 산성에서는 색이 거의 변하지 않습니다."
    },
    {
      category: "산과 염기",
      question: "산성 용액과 염기성 용액의 성질로 알맞은 것은?",
      answer: "산성 용액은 탄산 칼슘을 녹이고, 염기성 용액은 단백질을 녹이는 성질이 있다.",
      choices: [
        "산성 용액은 탄산 칼슘을 녹이고, 염기성 용액은 단백질을 녹이는 성질이 있다.",
        "산성 용액은 단백질만 만들고, 염기성 용액은 빛을 만든다.",
        "산성 용액과 염기성 용액은 언제나 같은 색으로 변한다.",
        "산성 용액은 식물의 뿌리, 염기성 용액은 식물의 잎이다."
      ],
      study: "산성 용액은 탄산 칼슘을 녹일 수 있고, 염기성 용액은 단백질을 녹일 수 있습니다."
    },
    {
      category: "산과 염기",
      question: "산성 용액에서 붉은 양배추 지시약은 무슨 색 계열로 변하는가?",
      answer: "붉은색 계열",
      choices: ["붉은색 계열", "푸른색 계열", "노란색 계열", "검은색 계열"],
      study: "붉은 양배추 지시약은 산성 용액에서 붉은색 계열로 변합니다."
    },
    {
      category: "산과 염기",
      question: "염기성 용액에서 붉은 양배추 지시약은 무슨 색 계열로 변하는가?",
      answer: "푸른색 계열이나 노란색 계열",
      choices: ["푸른색 계열이나 노란색 계열", "붉은색 계열", "흰색 계열", "투명한 색 계열"],
      study: "붉은 양배추 지시약은 염기성 용액에서 푸른색 계열이나 노란색 계열로 변합니다."
    },
    {
      category: "산과 염기",
      question: "산성 용액에 염기성 용액을 계속 넣으면 어떻게 변하는가?",
      answer: "무색에서 붉은색 계열로 변하고, 성질은 염기성 쪽으로 변한다.",
      choices: [
        "무색에서 붉은색 계열로 변하고, 성질은 염기성 쪽으로 변한다.",
        "계속 산성으로만 남고 색도 전혀 변하지 않는다.",
        "항상 검은색으로 변한다.",
        "용액이 물체의 운동으로 변한다."
      ],
      study: "산성 용액에 염기성 용액을 충분히 넣으면 성질이 염기성 쪽으로 변할 수 있고, 지시약 색도 달라집니다."
    },
    {
      category: "산과 염기",
      question: "염기성 용액에 산성 용액을 계속 넣으면 무슨 성질로 변하는가?",
      answer: "산성 용액",
      choices: ["산성 용액", "염기성 용액", "단백질", "탄산 칼슘"],
      study: "염기성 용액에 산성 용액을 충분히 넣으면 용액의 성질이 산성 쪽으로 변할 수 있습니다."
    },
    {
      category: "산과 염기",
      question: "산성 용액은 무엇을 녹이는 성질이 있는가?",
      answer: "탄산 칼슘",
      choices: ["탄산 칼슘", "단백질", "햇빛", "소리"],
      study: "산성 용액은 조개껍데기나 석회암에 들어 있는 탄산 칼슘을 녹이는 성질이 있습니다."
    },
    {
      category: "산과 염기",
      question: "염기성 용액은 무엇을 녹이는 성질이 있는가?",
      answer: "단백질",
      choices: ["단백질", "탄산 칼슘", "지구의 자전", "시간"],
      study: "염기성 용액은 단백질을 녹이는 성질이 있습니다."
    },
    {
      category: "물체의 운동",
      question: "시간이 지남에 따라 물체의 위치가 변할 때 물체가 무엇을 한다고 하는가?",
      answer: "운동",
      choices: ["운동", "광합성", "증산 작용", "중화"],
      study: "시간에 따라 물체의 위치가 변하면 그 물체는 운동하고 있다고 말합니다."
    },
    {
      category: "물체의 운동",
      question: "속력은 1초, 1시간 등 일정한 시간 동안 물체가 이동한 거리를 말한다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "속력은 일정한 시간 동안 물체가 이동한 거리로 나타냅니다."
    },
    {
      category: "물체의 운동",
      question: "물체의 운동은 무엇으로 표현할 수 있는가?",
      answer: "물체가 이동하는 데 걸린 시간과 위치 변화",
      choices: [
        "물체가 이동하는 데 걸린 시간과 위치 변화",
        "용액의 색깔과 냄새",
        "식물의 잎 크기와 꽃 색",
        "지시약 병의 모양"
      ],
      study: "물체의 운동은 이동하는 데 걸린 시간과 위치 변화로 표현할 수 있습니다."
    },
    {
      category: "물체의 운동",
      question: "다음 중 과학적으로 볼 때 운동한 물체에 해당하는 것은?",
      answer: "2번. 에스컬레이터를 타고 이동하는 사람",
      choices: [
        "1번. 가만히 서 있는 나무",
        "2번. 에스컬레이터를 타고 이동하는 사람",
        "3번. 멈춰 있는 신호등",
        "4번. 바구니에 담겨 움직이지 않는 사과"
      ],
      study: "에스컬레이터를 타고 이동하는 사람은 시간이 지나며 위치가 변하므로 운동한 물체입니다."
    },
    {
      category: "물체의 운동",
      question: "다음 중 시간에 따라 빠르기가 변하지 않고 일정한 운동을 하는 물체로 볼 수 없는 것은?",
      answer: "2번. 출발하여 속력을 높이는 자동차",
      choices: [
        "1번. 에스컬레이터",
        "2번. 출발하여 속력을 높이는 자동차",
        "3번. 컨베이어 벨트",
        "4번. 일정한 속력으로 달리는 유람선",
        "5번. 일정한 빠르기로 회전하는 대관람차"
      ],
      study: "출발하여 속력을 높이는 자동차는 빠르기가 변하므로 일정한 운동으로 보기 어렵습니다."
    },
    {
      category: "물체의 운동",
      question: "움직이고 있는 차는 운동 중이다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "움직이는 차는 시간이 지남에 따라 위치가 변하므로 운동 중입니다."
    },
    {
      category: "물체의 운동",
      question: "멈춰 있는 공은 운동하고 있다. OX",
      answer: "X",
      choices: ["O", "X"],
      study: "멈춰 있는 공은 위치가 변하지 않으므로 운동하고 있다고 보기 어렵습니다."
    },
    {
      category: "물체의 운동",
      question: "굴러가는 공은 운동하고 있다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "굴러가는 공은 위치가 변하므로 운동하고 있습니다."
    },
    {
      category: "물체의 운동",
      question: "엘리베이터가 올라가면 운동하는 것이다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "엘리베이터가 올라가면 위치가 변하므로 운동하는 것입니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "식물의 뿌리가 식물체가 쓰러지지 않도록 지탱해 주는 기능은?",
      answer: "지지 작용",
      choices: ["지지 작용", "광합성", "자전", "중화 작용"],
      study: "뿌리는 물과 무기 양분을 흡수하고, 식물체가 쓰러지지 않도록 지지합니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "식물이 빛, 물, 이산화 탄소를 이용해 스스로 양분을 만드는 작용은?",
      answer: "광합성",
      choices: ["광합성", "운동", "지시약 반응", "탄산 칼슘 녹이기"],
      study: "식물은 주로 잎에서 빛, 물, 이산화 탄소를 이용해 양분을 만들며, 이를 광합성이라고 합니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "뿌리털은 표면적을 넓혀 물과 양분을 더 잘 흡수하도록 돕는다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "뿌리털은 뿌리의 표면적을 넓혀 물과 무기 양분을 더 잘 흡수하게 합니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "수술에서 만들어진 꽃가루가 암술머리에 붙는 현상을 수분이라고 한다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "수분은 꽃가루가 암술머리에 붙는 현상이며 꽃가루받이라고도 합니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "생물은 모두 어떤 것으로 이루어져 있는가?",
      answer: "세포",
      choices: ["세포", "기공", "탄산 칼슘", "시험관"],
      study: "생물은 모두 세포로 이루어져 있습니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "잎의 표면에 있는 작은 구멍은 무엇인가?",
      answer: "기공",
      choices: ["기공", "뿌리털", "암술", "수술"],
      study: "잎의 표면에는 기공이라는 작은 구멍이 있어 기체가 드나듭니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "잎에 도달한 물이 수증기가 되어 기공을 통해 밖으로 빠져나가는 것은?",
      answer: "증산 작용",
      choices: ["증산 작용", "광합성", "지지 작용", "수분"],
      study: "물이 수증기가 되어 식물 밖으로 빠져나가는 현상을 증산 작용이라고 합니다."
    },
    {
      category: "식물의 구조와 기능",
      question: "식물 세포막 바깥쪽에는 세포벽이 있다. OX",
      answer: "O",
      choices: ["O", "X"],
      study: "식물 세포는 세포막 바깥쪽에 단단한 세포벽이 있습니다."
    }
  ];

  const keySpots = [
    { label: "현미경 그림자", hint: "왼쪽 아래 미로 길 끝, 현미경 받침대 그림자에 아주 작게 숨겼다.", x: 8.4, y: 68.5 },
    { label: "시험관 꽂이 뒤", hint: "아래쪽 갈림길을 따라가면 시험관 꽂이 뒤쪽에 희미한 반짝임이 보일 거다.", x: 21.8, y: 80.8 },
    { label: "싱크대 가장자리", hint: "실험대 가운데 물길처럼 보이는 선 옆, 싱크대 턱을 찾아봐.", x: 31.5, y: 74.5 },
    { label: "창가 플라스크 틈", hint: "중간 미로의 왼쪽 꺾이는 길, 플라스크 사이 어두운 틈에 숨겼다.", x: 18.5, y: 55.8 },
    { label: "가운데 현미경 렌즈", hint: "가운데 현미경 렌즈 옆 검은 점처럼 보이는 곳을 살펴봐.", x: 47.8, y: 54.8 },
    { label: "시약병 그림자", hint: "노란 길이 한 번 꺾인 뒤, 시약병 줄의 뒤쪽 그림자를 확인해.", x: 55.4, y: 61.5 },
    { label: "유리 시약장 아래 칸", hint: "위쪽 선반 아래, 병과 병 사이에 거의 보이지 않게 끼워 두었다.", x: 37.5, y: 38.5 },
    { label: "칠판 분필받침", hint: "칠판 아래 긴 그림자를 따라 오른쪽으로 가면 작은 금빛 점이 있다.", x: 64.5, y: 44.2 },
    { label: "오른쪽 진열장 병 뒤", hint: "오른쪽 진열장 위쪽 병 뒤, 미로 길이 끊긴 것처럼 보이는 지점이다.", x: 86.5, y: 37.8 },
    { label: "과학실 문손잡이 아래", hint: "탈출구 바로 앞이다. 문손잡이 아래 어두운 경계선을 끝까지 살펴봐.", x: 94.2, y: 52.5 }
  ];

  const state = {
    questions: [],
    roundIndex: 0,
    keys: 0,
    truthCount: 0,
    awaitingKey: false,
    inTruthRoom: false,
    timerId: 0,
    secondsLeft: STUDY_SECONDS
  };

  const elements = {
    startModal: document.getElementById("start-modal"),
    truthModal: document.getElementById("truth-modal"),
    winModal: document.getElementById("win-modal"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    studyDoneButton: document.getElementById("study-done-button"),
    questionCategory: document.getElementById("question-category"),
    questionText: document.getElementById("question-text"),
    choiceGrid: document.getElementById("choice-grid"),
    feedback: document.getElementById("feedback"),
    keyLayer: document.getElementById("key-layer"),
    keyRack: document.getElementById("key-rack"),
    keyCount: document.getElementById("key-count"),
    truthCount: document.getElementById("truth-count"),
    roundCount: document.getElementById("round-count"),
    crewList: document.getElementById("crew-list"),
    truthTitle: document.getElementById("truth-title"),
    truthMessage: document.getElementById("truth-message"),
    truthAnswer: document.getElementById("truth-answer"),
    studyNote: document.getElementById("study-note"),
    studySeconds: document.getElementById("study-seconds"),
    timerBar: document.getElementById("timer-bar"),
    winSummary: document.getElementById("win-summary")
  };

  function shuffle(items) {
    const mixed = [...items];
    for (let index = mixed.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [mixed[index], mixed[target]] = [mixed[target], mixed[index]];
    }
    return mixed;
  }

  function setupGame() {
    state.questions = shuffle(questionBank).slice(0, TOTAL_KEYS);
    state.roundIndex = 0;
    state.keys = 0;
    state.truthCount = 0;
    state.awaitingKey = false;
    state.inTruthRoom = false;
    clearInterval(state.timerId);
    renderCrew();
    renderKeyLayer();
    renderKeyRack();
    renderQuestion();
    updateHud();
  }

  function renderCrew(status = "solving") {
    elements.crewList.innerHTML = "";
    students.forEach((student) => {
      const chip = document.createElement("span");
      chip.className = "crew-chip";
      if (status === "studying") {
        chip.classList.add("is-studying");
      } else {
        chip.classList.add("is-solving");
      }
      chip.textContent = student;
      elements.crewList.append(chip);
    });
  }

  function renderKeyLayer() {
    elements.keyLayer.innerHTML = "";
    elements.keyLayer.classList.remove("is-hunting");
    keySpots.forEach((spot, index) => {
      const button = document.createElement("button");
      button.className = "key-spot";
      button.type = "button";
      button.dataset.keyIndex = String(index);
      button.style.left = `${spot.x}%`;
      button.style.top = `${spot.y}%`;
      button.setAttribute("aria-label", `${spot.label}에 숨겨진 열쇠`);
      button.addEventListener("click", () => collectKey(index));
      elements.keyLayer.append(button);
    });
  }

  function renderKeyRack() {
    elements.keyRack.innerHTML = "";
    for (let index = 0; index < TOTAL_KEYS; index += 1) {
      const dot = document.createElement("span");
      dot.className = "key-dot";
      if (index < state.keys) {
        dot.classList.add("is-collected");
      }
      elements.keyRack.append(dot);
    }
  }

  function updateHud() {
    elements.keyCount.textContent = `${state.keys} / ${TOTAL_KEYS}`;
    elements.truthCount.textContent = `${state.truthCount}회`;
    elements.roundCount.textContent = `${Math.min(state.roundIndex + 1, TOTAL_KEYS)} / ${TOTAL_KEYS}`;
    renderKeyRack();
  }

  function currentQuestion() {
    return state.questions[state.roundIndex];
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) {
      showWin();
      return;
    }

    elements.questionCategory.textContent = question.category;
    elements.questionText.textContent = question.question;
    elements.feedback.className = "feedback";
    elements.feedback.textContent = "예승, 리원, 지후, 성현이 함께 과학쌤의 문제지를 보고 정답을 고른다.";
    elements.choiceGrid.innerHTML = "";

    question.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => handleChoice(index, button));
      elements.choiceGrid.append(button);
    });
  }

  function handleChoice(choiceIndex, button) {
    if (state.awaitingKey || state.inTruthRoom) {
      return;
    }

    const question = currentQuestion();
    const isCorrect = question.choices[choiceIndex] === question.answer;
    const choiceButtons = [...elements.choiceGrid.querySelectorAll(".choice-button")];

    choiceButtons.forEach((choiceButton) => {
      choiceButton.disabled = true;
      if (choiceButton.textContent === question.answer) {
        choiceButton.classList.add("is-correct");
      }
    });

    if (isCorrect) {
      button.classList.add("is-correct");
      revealKeyHint();
      return;
    }

    button.classList.add("is-wrong");
    elements.feedback.className = "feedback is-danger";
    elements.feedback.textContent = "오답이다. 과학쌤의 표정이 더 무서워지고, 네 명 모두 진실의 방으로 향한다.";
    window.setTimeout(enterTruthRoom, 700);
  }

  function revealKeyHint() {
    const spot = keySpots[state.roundIndex];
    const keyButton = elements.keyLayer.querySelector(`[data-key-index="${state.roundIndex}"]`);
    state.awaitingKey = true;
    elements.keyLayer.classList.add("is-hunting");

    if (keyButton) {
      keyButton.classList.add("is-active");
    }

    elements.feedback.className = "feedback is-success";
    elements.feedback.textContent = `정답이다. 과학쌤이 문제지 뒤에서 낮게 말한다. "${spot.hint}"`;
  }

  function collectKey(index) {
    if (!state.awaitingKey || index !== state.roundIndex) {
      return;
    }

    const keyButton = elements.keyLayer.querySelector(`[data-key-index="${index}"]`);
    if (keyButton) {
      keyButton.classList.remove("is-active");
      keyButton.classList.add("is-collected");
    }

    state.keys += 1;
    state.awaitingKey = false;
    elements.keyLayer.classList.remove("is-hunting");
    state.roundIndex += 1;
    updateHud();

    if (state.keys >= TOTAL_KEYS) {
      window.setTimeout(showWin, 350);
      return;
    }

    elements.feedback.className = "feedback is-success";
    elements.feedback.textContent = "열쇠를 얻었다. 다음 문제지가 펼쳐진다.";
    window.setTimeout(renderQuestion, 700);
  }

  function enterTruthRoom() {
    if (state.inTruthRoom) {
      return;
    }

    const question = currentQuestion();
    state.inTruthRoom = true;
    state.truthCount += 1;
    state.secondsLeft = STUDY_SECONDS;
    updateHud();
    renderCrew("studying");

    elements.truthTitle.textContent = "예승, 리원, 지후, 성현 전원 진실의 방 입장";
    elements.truthMessage.textContent = "문제를 틀리면 네 명 모두 진실의 방에서 공부한다. 지금은 게임 규칙에 따라 10초 동안 함께 공부하고 같은 문제에 다시 도전한다.";
    elements.truthAnswer.textContent = question.answer;
    elements.studyNote.textContent = question.study;
    elements.studySeconds.textContent = `${state.secondsLeft}초`;
    elements.timerBar.style.width = "100%";
    elements.studyDoneButton.disabled = true;
    elements.studyDoneButton.textContent = "공부 중";
    elements.truthModal.hidden = false;

    clearInterval(state.timerId);
    state.timerId = window.setInterval(tickStudyTimer, 1000);
  }

  function tickStudyTimer() {
    state.secondsLeft -= 1;
    const ratio = Math.max(state.secondsLeft, 0) / STUDY_SECONDS;
    elements.studySeconds.textContent = `${Math.max(state.secondsLeft, 0)}초`;
    elements.timerBar.style.width = `${ratio * 100}%`;

    if (state.secondsLeft <= 0) {
      clearInterval(state.timerId);
      elements.studyDoneButton.disabled = false;
      elements.studyDoneButton.textContent = "문제풀이 복귀";
      window.setTimeout(leaveTruthRoom, 900);
    }
  }

  function leaveTruthRoom() {
    clearInterval(state.timerId);
    state.inTruthRoom = false;
    elements.truthModal.hidden = true;
    renderCrew("solving");
    renderQuestion();
  }

  function showWin() {
    clearInterval(state.timerId);
    state.inTruthRoom = false;
    state.awaitingKey = false;
    elements.winSummary.textContent = `예승, 리원, 지후, 성현이 함께 열쇠 ${TOTAL_KEYS}개를 모두 찾았다. 전원 진실의 방은 ${state.truthCount}번 다녀왔고, 과학실 문은 드디어 열렸다.`;
    elements.winModal.hidden = false;
  }

  function startGame() {
    elements.startModal.hidden = true;
    renderQuestion();
  }

  function restartGame() {
    elements.winModal.hidden = true;
    elements.truthModal.hidden = true;
    setupGame();
  }

  const sceneMotion = {
    pointerX: 0,
    pointerY: 0,
    startTime: window.performance.now(),
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function setSceneVariable(name, value, unit) {
    document.documentElement.style.setProperty(name, `${value.toFixed(2)}${unit}`);
  }

  function updateSceneDepth(clientX, clientY) {
    const width = Math.max(window.innerWidth, 1);
    const height = Math.max(window.innerHeight, 1);
    sceneMotion.pointerX = (clientX / width - 0.5) * 2;
    sceneMotion.pointerY = (clientY / height - 0.5) * 2;
  }

  function applySceneMotion(now = window.performance.now()) {
    const elapsed = (now - sceneMotion.startTime) / 1000;
    const autoX = sceneMotion.reduceMotion ? 0 : Math.sin(elapsed * 0.58) * 0.34 + Math.sin(elapsed * 0.21) * 0.16;
    const autoY = sceneMotion.reduceMotion ? 0 : Math.cos(elapsed * 0.52) * 0.28 + Math.sin(elapsed * 0.31) * 0.14;
    const xRatio = Math.max(-1, Math.min(1, sceneMotion.pointerX * 0.74 + autoX));
    const yRatio = Math.max(-1, Math.min(1, sceneMotion.pointerY * 0.74 + autoY));
    const tiltX = yRatio * 5.4;
    const tiltY = xRatio * 6.8;
    const floatX = xRatio * 18;
    const floatY = yRatio * 14;

    setSceneVariable("--tilt-y", tiltY, "deg");
    setSceneVariable("--tilt-x", tiltX, "deg");
    setSceneVariable("--float-x", floatX, "px");
    setSceneVariable("--float-y", floatY, "px");
    setSceneVariable("--scene-x", xRatio * 6, "px");
    setSceneVariable("--scene-y", yRatio * 5, "px");
    setSceneVariable("--key-x", xRatio * 3, "px");
    setSceneVariable("--key-y", yRatio * 2, "px");
    setSceneVariable("--hud-x", floatX * 0.25, "px");
    setSceneVariable("--hud-y", floatY * 0.25, "px");
    setSceneVariable("--crew-x", floatX * -0.22, "px");
    setSceneVariable("--crew-y", floatY * 0.18, "px");
    setSceneVariable("--paper-x", floatX * 0.38, "px");
    setSceneVariable("--paper-y", floatY * 0.34, "px");
    setSceneVariable("--rack-x", floatX * 0.18, "px");
    setSceneVariable("--rack-y", floatY * -0.12, "px");
    setSceneVariable("--maze-x", floatX * -0.12, "px");
    setSceneVariable("--maze-y", floatY * -0.08, "px");
    setSceneVariable("--title-tilt-x", tiltX * -0.16, "deg");
    setSceneVariable("--title-tilt-y", tiltY * 0.16, "deg");
    setSceneVariable("--crew-tilt-x", tiltX * -0.12, "deg");
    setSceneVariable("--crew-tilt-y", tiltY * 0.12, "deg");
    setSceneVariable("--paper-tilt-x", tiltX * -0.62, "deg");
    setSceneVariable("--paper-tilt-y", tiltY * 0.62, "deg");
    setSceneVariable("--rack-tilt-x", tiltX * -0.1, "deg");
    setSceneVariable("--rack-tilt-y", tiltY * 0.1, "deg");
    setSceneVariable("--modal-tilt-x", tiltX * -0.18, "deg");
    setSceneVariable("--modal-tilt-y", tiltY * 0.18, "deg");

    window.requestAnimationFrame(applySceneMotion);
  }

  window.addEventListener("pointermove", (event) => {
    updateSceneDepth(event.clientX, event.clientY);
  });

  window.addEventListener("pointerleave", () => {
    updateSceneDepth(window.innerWidth / 2, window.innerHeight / 2);
  });

  elements.startButton.addEventListener("click", startGame);
  elements.restartButton.addEventListener("click", restartGame);
  elements.studyDoneButton.addEventListener("click", leaveTruthRoom);

  setupGame();
  applySceneMotion();
})();
