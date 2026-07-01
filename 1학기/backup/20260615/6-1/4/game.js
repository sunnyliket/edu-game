const ELEMENTS = {
  water: { label: "물", color: "#39bdec" },
  fire: { label: "불", color: "#ff6259" },
  stone: { label: "돌", color: "#a18a6d" },
  ice: { label: "얼음", color: "#a5e8ff" },
  lightning: { label: "번개", color: "#f5ce58" },
  grass: { label: "풀", color: "#48d28c" },
  plain: { label: "일반", color: "#d9d4c8" },
  teacher: { label: "보스", color: "#9b7bff" }
};

const WEAKNESSES = {
  water: "ice",
  fire: "water",
  ice: "fire",
  stone: "water",
  lightning: "water",
  grass: "fire",
  plain: "fire",
  teacher: "science"
};

const CHARACTERS = [
  { id: "water-guard", name: "워터 가드", element: "water", tutorial: true, desc: "물총 압력을 올려 불·돌·번개 몹을 빠르게 제압합니다." },
  { id: "flame-runner", name: "플레임 러너", element: "fire", tutorial: true, desc: "화염 속성으로 얼음과 풀 타입에게 강합니다." },
  { id: "stone-anchor", name: "스톤 앵커", element: "stone", tutorial: true, desc: "단단한 방어력으로 튜토리얼 전투를 안정적으로 버팁니다." },
  { id: "ice-scout", name: "아이스 스카우트", element: "ice", tutorial: false, desc: "얼음 속성으로 물 타입 몬스터의 움직임을 끊습니다." },
  { id: "bolt-maker", name: "볼트 메이커", element: "lightning", tutorial: false, desc: "빠른 조준과 이동으로 스켈레톤전을 유리하게 만듭니다." },
  { id: "leaf-binder", name: "리프 바인더", element: "grass", tutorial: false, desc: "속박 스킬의 지속 시간이 조금 더 깁니다." }
];

const STAGES = [
  {
    name: "STAGE 1 · 용산초 튜토리얼",
    select: "튜토리얼 캐릭터",
    tutorialOnly: true,
    monsters: [
      { name: "물 좀비", element: "water", hp: 72, attack: 6 },
      { name: "불 좀비", element: "fire", hp: 76, attack: 7 },
      { name: "얼음 좀비", element: "ice", hp: 80, attack: 7 }
    ]
  },
  {
    name: "STAGE 2 · 운동장 균열",
    select: "스테이지 2 캐릭터",
    monsters: [
      { name: "돌 좀비", element: "stone", hp: 92, attack: 8 },
      { name: "번개 좀비", element: "lightning", hp: 86, attack: 9 },
      { name: "풀 좀비", element: "grass", hp: 88, attack: 8 }
    ]
  },
  {
    name: "STAGE 3 · 과학실 복도",
    select: "스테이지 3 캐릭터",
    monsters: [
      { name: "스켈레톤", element: "plain", hp: 94, attack: 9 },
      { name: "번개 스켈레톤", element: "lightning", hp: 106, attack: 10 },
      { name: "얼음 스켈레톤", element: "ice", hp: 104, attack: 10 }
    ]
  },
  {
    name: "STAGE 4 · 실험 준비실",
    select: "스테이지 4 캐릭터",
    monsters: [
      { name: "불 스켈레톤", element: "fire", hp: 116, attack: 11 },
      { name: "돌 스켈레톤", element: "stone", hp: 126, attack: 11 },
      { name: "풀 스켈레톤", element: "grass", hp: 112, attack: 12 }
    ]
  },
  {
    name: "STAGE 5 · 수행평가 보스전",
    select: "보스전 캐릭터",
    boss: true,
    monsters: [
      { name: "과학쌤", element: "teacher", hp: 260, attack: 14 }
    ]
  }
];

const SKILLS = {
  e: {
    category: "acidBase",
    label: "산과 염기",
    verb: "정답 속성탄",
    apply: () => {
      const weakness = getCurrentWeakness();
      const damage = state.currentMonster.element === "teacher" ? 42 : 54;
      damageMonster(damage, `${ELEMENTS[weakness]?.label || "과학"} 속성으로 공격 성공`);
    }
  },
  z: {
    category: "motion",
    label: "물체의 운동",
    verb: "회피",
    apply: () => {
      state.dodges = Math.min(state.dodges + 2, 3);
      log("운동 문제 정답. 다음 공격을 회피합니다.");
      updateUI();
    }
  },
  x: {
    category: "plant",
    label: "식물의 구조와 기능",
    verb: "속박",
    apply: () => {
      const bindTurns = state.selectedCharacter?.element === "grass" ? 3 : 2;
      state.boundTurns = Math.max(state.boundTurns, bindTurns);
      damageMonster(22, "식물 속박 성공");
    }
  },
  c: {
    category: "earth",
    label: "지구의 운동",
    verb: "궁극기",
    apply: () => {
      damageMonster(state.currentMonster.element === "teacher" ? 84 : 96, "지구 운동 궁극기 발동");
    }
  }
};

const QUESTIONS = {
  acidBase: [
    {
      q: "푸른 리트머스 종이를 붉게 변화시키는 용액의 성질은?",
      a: "산성",
      choices: ["산성", "염기성", "중성", "자성"]
    },
    {
      q: "염기성 용액에 페놀프탈레인 용액을 떨어뜨리면 주로 어떤 색이 되나요?",
      a: "붉은색 계열",
      choices: ["무색", "붉은색 계열", "검은색", "파란색만"]
    },
    {
      q: "식초와 레몬즙에 공통으로 가까운 성질은?",
      a: "산성",
      choices: ["산성", "염기성", "금속성", "자석성"]
    },
    {
      q: "산성과 염기성이 서로 반응해 성질이 약해지는 반응은?",
      a: "중화 반응",
      choices: ["중화 반응", "증발 반응", "응결 반응", "자전 반응"]
    }
  ],
  motion: [
    {
      q: "속력을 구하는 기본 식은?",
      a: "이동 거리 ÷ 걸린 시간",
      choices: ["걸린 시간 ÷ 이동 거리", "이동 거리 ÷ 걸린 시간", "질량 ÷ 부피", "힘 × 온도"]
    },
    {
      q: "물체가 일정한 속력으로 곧게 움직이는 운동은?",
      a: "등속 직선 운동",
      choices: ["등속 직선 운동", "광합성", "중화 반응", "공전"]
    },
    {
      q: "운동 방향과 같은 방향으로 힘이 작용하면 물체의 속력은 보통 어떻게 되나요?",
      a: "빨라진다",
      choices: ["빨라진다", "항상 멈춘다", "색이 변한다", "질량이 사라진다"]
    },
    {
      q: "마찰이 큰 바닥에서 물체가 더 빨리 멈추는 까닭은?",
      a: "운동을 방해하는 힘이 크기 때문",
      choices: ["운동을 방해하는 힘이 크기 때문", "온도가 무조건 낮기 때문", "식물이 자라기 때문", "달이 공전하기 때문"]
    }
  ],
  plant: [
    {
      q: "식물에서 광합성이 주로 일어나는 기관은?",
      a: "잎",
      choices: ["잎", "꽃잎의 색", "열매 껍질", "씨앗의 겉면"]
    },
    {
      q: "뿌리에서 흡수한 물이 이동하는 통로는?",
      a: "물관",
      choices: ["물관", "체관", "기공", "꽃가루"]
    },
    {
      q: "잎에서 만든 양분이 이동하는 통로는?",
      a: "체관",
      choices: ["체관", "물관", "암술", "수술"]
    },
    {
      q: "뿌리의 대표적인 기능은?",
      a: "물과 무기 양분 흡수",
      choices: ["물과 무기 양분 흡수", "달빛 만들기", "번개 저장", "리트머스 종이 만들기"]
    }
  ],
  earth: [
    {
      q: "낮과 밤이 생기는 주된 원인은?",
      a: "지구의 자전",
      choices: ["지구의 자전", "식물의 증산 작용", "산과 염기의 중화", "물의 끓음"]
    },
    {
      q: "계절 변화와 가장 관련이 깊은 것은?",
      a: "지구의 공전과 자전축 기울기",
      choices: ["지구의 공전과 자전축 기울기", "마찰력 0", "리트머스 종이", "뿌리털의 색"]
    },
    {
      q: "지구가 태양 주위를 도는 운동은?",
      a: "공전",
      choices: ["공전", "자전", "증발", "응결"]
    },
    {
      q: "하루 동안 태양이 동쪽에서 서쪽으로 움직이는 것처럼 보이는 까닭은?",
      a: "지구가 자전하기 때문",
      choices: ["지구가 자전하기 때문", "물이 산성이기 때문", "잎이 광합성하기 때문", "마찰이 사라졌기 때문"]
    }
  ]
};

const $ = (selector) => document.querySelector(selector);

const els = {
  startScreen: $("#startScreen"),
  selectScreen: $("#selectScreen"),
  gameScreen: $("#gameScreen"),
  resultScreen: $("#resultScreen"),
  playButton: $("#playButton"),
  restartButton: $("#restartButton"),
  characterGrid: $("#characterGrid"),
  stageBadge: $("#stageBadge"),
  selectTitle: $("#selectTitle"),
  stageName: $("#stageName"),
  playerHealthBar: $("#playerHealthBar"),
  playerHealthText: $("#playerHealthText"),
  ammoText: $("#ammoText"),
  scene: $("#scene"),
  worldOffset: $("#worldOffset"),
  monster: $("#monster"),
  monsterName: $("#monsterName"),
  monsterHealthBar: $("#monsterHealthBar"),
  weaknessText: $("#weaknessText"),
  fireButton: $("#fireButton"),
  aimButton: $("#aimButton"),
  reloadButton: $("#reloadButton"),
  combatLog: $("#combatLog"),
  questionModal: $("#questionModal"),
  questionCategory: $("#questionCategory"),
  questionTitle: $("#questionTitle"),
  answerList: $("#answerList"),
  hitFlash: $("#hitFlash"),
  weapon: $("#weapon"),
  resultTitle: $("#resultTitle"),
  resultText: $("#resultText")
};

const state = {
  screen: "start",
  stageIndex: 0,
  monsterIndex: 0,
  selectedCharacter: null,
  usedCharacters: new Set(),
  playerHp: 100,
  ammo: 25,
  reloads: 5,
  currentMonster: null,
  currentMonsterHp: 0,
  aiming: false,
  dodges: 0,
  boundTurns: 0,
  questionSkill: null,
  lastQuestions: {},
  position: { x: 0, y: 0 },
  loopId: null,
  busy: false
};

function showScreen(name) {
  state.screen = name;
  [els.startScreen, els.selectScreen, els.resultScreen].forEach((screen) => {
    screen.classList.remove("screen-active");
  });

  if (name === "start") els.startScreen.classList.add("screen-active");
  if (name === "select") els.selectScreen.classList.add("screen-active");
  if (name === "result") els.resultScreen.classList.add("screen-active");
}

function startGame() {
  Object.assign(state, {
    stageIndex: 0,
    monsterIndex: 0,
    selectedCharacter: null,
    usedCharacters: new Set(),
    playerHp: 100,
    ammo: 25,
    reloads: 5,
    currentMonster: null,
    currentMonsterHp: 0,
    aiming: false,
    dodges: 0,
    boundTurns: 0,
    questionSkill: null,
    lastQuestions: {},
    position: { x: 0, y: 0 },
    busy: false
  });
  stopMonsterLoop();
  renderCharacterSelect();
  showScreen("select");
  log("스테이지 캐릭터를 선택하세요.");
}

function renderCharacterSelect() {
  const stage = STAGES[state.stageIndex];
  els.stageBadge.textContent = `STAGE ${state.stageIndex + 1}`;
  els.selectTitle.textContent = stage.select;
  els.characterGrid.innerHTML = "";

  CHARACTERS.forEach((character) => {
    const isBoss = stage.boss;
    const lockedByTutorial = stage.tutorialOnly && !character.tutorial;
    const lockedByUse = !isBoss && state.usedCharacters.has(character.id);
    const locked = lockedByTutorial || lockedByUse;
    const element = ELEMENTS[character.element];
    const card = document.createElement("button");
    card.className = "character-card";
    card.disabled = locked;
    card.innerHTML = `
      <span class="element-token" style="background:${element.color}">${element.label}</span>
      <h3>${character.name}</h3>
      <p>${character.desc}</p>
      ${locked ? `<span class="locked-note">${lockedByTutorial ? "튜토리얼 잠김" : "보스전 전까지 잠김"}</span>` : ""}
    `;
    card.addEventListener("click", () => selectCharacter(character));
    els.characterGrid.appendChild(card);
  });
}

function selectCharacter(character) {
  const stage = STAGES[state.stageIndex];
  state.selectedCharacter = character;
  if (!stage.boss) {
    state.usedCharacters.add(character.id);
  }
  beginStage();
}

function beginStage() {
  const stage = STAGES[state.stageIndex];
  state.monsterIndex = 0;
  state.playerHp = Math.min(100, state.playerHp + 24);
  state.ammo = 25;
  state.reloads = 5;
  state.dodges = 0;
  state.boundTurns = 0;
  state.position = { x: 0, y: 0 };
  state.aiming = false;
  document.body.classList.remove("aiming");
  showScreen("game");
  els.stageName.textContent = stage.name;
  spawnMonster();
  startMonsterLoop();
  log(`${state.selectedCharacter.name} 출전. ${stage.name} 시작.`);
}

function spawnMonster() {
  const stage = STAGES[state.stageIndex];
  const monster = { ...stage.monsters[state.monsterIndex] };
  state.currentMonster = monster;
  state.currentMonsterHp = monster.hp;
  state.boundTurns = 0;
  state.busy = false;
  els.monster.className = `monster monster-${monster.element}`;
  updateUI();
  log(`${monster.name} 등장.`);
}

function getCurrentWeakness() {
  return WEAKNESSES[state.currentMonster?.element] || "fire";
}

function updateUI() {
  const stage = STAGES[state.stageIndex];
  const monster = state.currentMonster;
  const weakness = getCurrentWeakness();
  els.stageName.textContent = stage.name;
  els.playerHealthText.textContent = Math.max(0, Math.ceil(state.playerHp));
  els.playerHealthBar.style.width = `${Math.max(0, state.playerHp)}%`;
  els.ammoText.textContent = `${state.ammo} / ${state.reloads}`;

  if (monster) {
    els.monsterName.textContent = monster.name;
    els.monsterHealthBar.style.width = `${Math.max(0, state.currentMonsterHp / monster.hp) * 100}%`;
    els.weaknessText.textContent = monster.element === "teacher"
      ? "정답 스킬로 수행평가 만점"
      : `약점: ${ELEMENTS[weakness].label}`;
  }

  els.worldOffset.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`;
  els.monster.classList.toggle("bind", state.boundTurns > 0);
  document.body.classList.toggle("aiming", state.aiming);
  els.aimButton.textContent = state.aiming ? "조준중" : "조준";
}

function fireWeapon() {
  if (!canAct()) return;
  if (state.ammo <= 0) {
    log("탄환이 없습니다. 장전하세요.");
    return;
  }
  state.ammo -= 1;
  els.weapon.classList.remove("firing");
  void els.weapon.offsetWidth;
  els.weapon.classList.add("firing");
  els.hitFlash.classList.remove("active");
  void els.hitFlash.offsetWidth;
  els.hitFlash.classList.add("active");

  const weakness = getCurrentWeakness();
  const charElement = state.selectedCharacter?.element;
  let damage = state.aiming ? 16 : 11;
  if (charElement === weakness) damage += state.aiming ? 20 : 14;
  if (state.currentMonster.element === "teacher") damage = state.aiming ? 13 : 9;

  damageMonster(damage, charElement === weakness ? "약점 명중" : "물총 명중");
  updateUI();
}

function reloadWeapon() {
  if (state.ammo >= 25) {
    log("이미 탄창이 가득 찼습니다.");
    return;
  }
  if (state.reloads <= 0) {
    log("남은 장전 횟수가 없습니다.");
    return;
  }
  state.reloads -= 1;
  state.ammo = 25;
  log("25발 장전 완료.");
  updateUI();
}

function toggleAim() {
  state.aiming = !state.aiming;
  log(state.aiming ? "조준 모드." : "일반 사격 모드.");
  updateUI();
}

function movePlayer(direction) {
  if (state.screen !== "game") return;
  const amount = 18;
  if (direction === "forward") state.position.y = Math.min(state.position.y + amount, 54);
  if (direction === "back") state.position.y = Math.max(state.position.y - amount, -54);
  if (direction === "left") state.position.x = Math.min(state.position.x + amount, 90);
  if (direction === "right") state.position.x = Math.max(state.position.x - amount, -90);
  updateUI();
}

function useSkill(key) {
  if (!canAct()) return;
  const skill = SKILLS[key];
  if (!skill) return;
  state.questionSkill = key;
  openQuestion(skill);
}

function openQuestion(skill) {
  const question = pickQuestion(skill.category);
  els.questionCategory.textContent = skill.label;
  els.questionTitle.textContent = question.q;
  els.answerList.innerHTML = "";
  question.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.addEventListener("click", () => answerQuestion(question, choice));
    els.answerList.appendChild(button);
  });
  els.questionModal.classList.add("show");
}

function pickQuestion(category) {
  const questions = QUESTIONS[category];
  let index = Math.floor(Math.random() * questions.length);
  if (questions.length > 1 && state.lastQuestions[category] === index) {
    index = (index + 1) % questions.length;
  }
  state.lastQuestions[category] = index;
  return questions[index];
}

function answerQuestion(question, choice) {
  const key = state.questionSkill;
  const skill = SKILLS[key];
  els.questionModal.classList.remove("show");
  state.questionSkill = null;

  if (choice === question.a) {
    skill.apply();
    return;
  }

  if (state.ammo > 0) state.ammo -= 1;
  log("오답. 탄환 1발 소모.");
  updateUI();
}

function damageMonster(amount, reason) {
  if (!state.currentMonster) return;
  state.busy = true;
  state.currentMonsterHp = Math.max(0, state.currentMonsterHp - amount);
  els.monster.classList.add("hit");
  setTimeout(() => els.monster.classList.remove("hit"), 170);
  log(`${reason}: ${Math.ceil(amount)} 피해.`);
  updateUI();

  if (state.currentMonsterHp <= 0) {
    setTimeout(defeatMonster, 220);
  } else {
    setTimeout(() => {
      state.busy = false;
    }, 180);
  }
}

function defeatMonster() {
  const defeated = state.currentMonster?.name;
  const stage = STAGES[state.stageIndex];
  log(`${defeated} 제압.`);
  state.monsterIndex += 1;

  if (state.monsterIndex < stage.monsters.length) {
    spawnMonster();
    return;
  }

  stopMonsterLoop();
  if (state.stageIndex >= STAGES.length - 1) {
    clearGame();
    return;
  }

  state.stageIndex += 1;
  renderCharacterSelect();
  showScreen("select");
  log("다음 스테이지 캐릭터를 선택하세요.");
}

function monsterAttack() {
  if (state.screen !== "game" || !state.currentMonster || state.questionSkill) return;
  if (state.boundTurns > 0) {
    state.boundTurns -= 1;
    log("몬스터가 속박되어 움직이지 못했습니다.");
    updateUI();
    return;
  }
  if (state.dodges > 0) {
    state.dodges -= 1;
    log("회피 성공.");
    updateUI();
    return;
  }

  const damage = state.currentMonster.attack;
  state.playerHp = Math.max(0, state.playerHp - damage);
  log(`${state.currentMonster.name}의 공격: ${damage} 피해.`);
  updateUI();

  if (state.playerHp <= 0) {
    gameOver();
  }
}

function startMonsterLoop() {
  stopMonsterLoop();
  state.loopId = window.setInterval(monsterAttack, 2300);
}

function stopMonsterLoop() {
  if (state.loopId) {
    window.clearInterval(state.loopId);
    state.loopId = null;
  }
}

function gameOver() {
  stopMonsterLoop();
  els.resultTitle.textContent = "재도전 필요";
  els.resultText.textContent = "체력이 0이 되었습니다. 과학 문제를 맞혀 스킬을 더 자주 사용해 보세요.";
  showScreen("result");
}

function clearGame() {
  stopMonsterLoop();
  els.resultTitle.textContent = "수행평가 만점!";
  els.resultText.textContent = "과학쌤 보스전까지 모두 완료했습니다. 과학RPG 클리어!";
  showScreen("result");
}

function canAct() {
  return state.screen === "game" && state.currentMonster && !state.questionSkill && !state.busy;
}

function log(message) {
  els.combatLog.textContent = message;
}

function bindEvents() {
  els.playButton.addEventListener("click", startGame);
  els.restartButton.addEventListener("click", startGame);
  els.fireButton.addEventListener("click", fireWeapon);
  els.aimButton.addEventListener("click", toggleAim);
  els.reloadButton.addEventListener("click", reloadWeapon);

  document.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => useSkill(button.dataset.skill));
  });

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => movePlayer(button.dataset.move));
  });

  window.addEventListener("keydown", (event) => {
    if (els.questionModal.classList.contains("show")) return;
    const key = event.key.toLowerCase();
    if (key === " ") {
      event.preventDefault();
      fireWeapon();
    }
    if (key === "r") reloadWeapon();
    if (key === "q") toggleAim();
    if (key === "w") movePlayer("forward");
    if (key === "a") movePlayer("left");
    if (key === "s") movePlayer("back");
    if (key === "d") movePlayer("right");
    if (["e", "z", "x", "c"].includes(key)) useSkill(key);
  });

  els.scene.addEventListener("click", () => {
    if (state.screen === "game") fireWeapon();
  });
}

bindEvents();
updateUI();
