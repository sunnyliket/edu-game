const STORE_PREFIX = "science6_g1_";
const CURRENT_KEY = "science6_g1_current";

const app = document.getElementById("app");
let currentId = "";
let profile = null;
let currentStage = null;
let run = null;
let audioCtx = null;
let dexTab = "lab";

function startAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function tone(freq, duration, type = "square", volume = 0.045) {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.value = volume;
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.stop(audioCtx.currentTime + duration);
}

function sfx(kind) {
  if (kind === "snap") {
    tone(620, 0.07, "triangle");
    setTimeout(() => tone(840, 0.08, "triangle"), 55);
  } else if (kind === "coin") {
    tone(880, 0.08);
    setTimeout(() => tone(1180, 0.09), 70);
  } else if (kind === "clear") {
    [523, 659, 784, 1046].forEach((freq, i) => setTimeout(() => tone(freq, 0.12, "triangle", 0.055), i * 95));
  } else {
    tone(240, 0.08, "sine", 0.035);
  }
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  }[char]));
}

function solutionByName(name) {
  return solutionPool.find(item => item.name === name);
}

function profileKey(id) {
  return `${STORE_PREFIX}${id}`;
}

function emptyProfile(id) {
  return {
    studentId: id,
    stages: {},
    cards: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function loadProfile(id) {
  const raw = localStorage.getItem(profileKey(id));
  if (!raw) return emptyProfile(id);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...emptyProfile(id),
      ...parsed,
      stages: parsed.stages || {},
      cards: parsed.cards || {}
    };
  } catch {
    return emptyProfile(id);
  }
}

function saveProfile() {
  if (!profile || !currentId) return;
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(profileKey(currentId), JSON.stringify(profile));
  localStorage.setItem(CURRENT_KEY, currentId);
}

function stageStars(stageId, row = profile) {
  return row?.stages?.[stageId]?.stars || 0;
}

function totalStars(row = profile) {
  return stages.reduce((sum, stage) => sum + stageStars(stage.id, row), 0);
}

function cardCount(row = profile) {
  return Object.keys(row?.cards || {}).length;
}

function stagesByWorld(worldId) {
  return stages.filter(stage => stage.world === worldId);
}

function isStageUnlocked(stage) {
  if (!profile) return false;
  const world = worlds.find(item => item.id === stage.world);
  if (world.order === 1 && stage.index === 1) return true;
  if (stage.index === 1) {
    const previousWorld = worlds.find(item => item.order === world.order - 1);
    if (!previousWorld) return true;
    return stagesByWorld(previousWorld.id)
      .filter(item => item.index <= 5)
      .reduce((sum, item) => sum + stageStars(item.id), 0) >= 5;
  }
  const previous = stages.find(item => item.world === stage.world && item.index === stage.index - 1);
  return previous && stageStars(previous.id) > 0;
}

function renderTopbar(title, subtitle = "") {
  return `
    <div class="topbar">
      <div class="nav-title">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle || `학번 ${currentId}`)}</span>
      </div>
      <div class="hud">
        <div class="hud-pill" title="누적 별">별 <strong>${totalStars()}</strong></div>
        <div class="hud-pill" title="도감 진행">도감 <strong>${cardCount()}/${allCards.length}</strong></div>
      </div>
      <div class="hud">
        <button class="ghost-btn" data-action="map">월드맵</button>
        <button class="ghost-btn" data-action="dex">도감</button>
        <button class="ghost-btn" data-action="teacher">교사용</button>
        <button class="ghost-btn" data-action="logout">나가기</button>
      </div>
    </div>
  `;
}

function bindGlobalActions(root = app) {
  root.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", event => {
      startAudio();
      const action = event.currentTarget.dataset.action;
      if (action === "map") renderMap();
      if (action === "dex") renderCollection();
      if (action === "teacher") renderTeacher();
      if (action === "logout") {
        localStorage.removeItem(CURRENT_KEY);
        currentId = "";
        profile = null;
        renderLogin();
      }
    });
  });
}

function renderLogin() {
  app.innerHTML = `
    <main class="login-screen">
      <section class="start-panel" aria-labelledby="app-title">
        <div class="brand-scene" aria-hidden="true">
          <div class="scene-island"></div>
          <div class="scene-island"></div>
          <div class="scene-lab"></div>
          <div class="scene-planet"></div>
        </div>
        <h1 id="app-title">6학년 과학 탐험</h1>
        <p>1학기 과학 내용을 네 개의 섬에서 직접 조작 미션으로 해결합니다. 학번만 저장하며 이름은 입력하지 않습니다.</p>
        <div class="input-row">
          <input id="student-id" class="student-input" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="학번 2~8자리 숫자">
          <button id="enter-btn" class="primary-btn">시작</button>
        </div>
        <div id="login-error" class="error-msg" role="alert"></div>
        <div class="teacher-actions">
          <button id="teacher-direct" class="ghost-btn">교사용 화면</button>
        </div>
      </section>
    </main>
  `;
  const input = byId("student-id");
  const error = byId("login-error");
  const submit = () => {
    startAudio();
    const value = input.value.trim();
    if (!/^[0-9]{2,8}$/.test(value)) {
      error.textContent = "학번은 2~8자리 숫자만 사용할 수 있습니다.";
      sfx("soft");
      return;
    }
    currentId = value;
    profile = loadProfile(value);
    saveProfile();
    sfx("coin");
    renderMap();
  };
  byId("enter-btn").addEventListener("click", submit);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") submit();
  });
  byId("teacher-direct").addEventListener("click", () => {
    startAudio();
    renderTeacher();
  });
  input.focus();
}

function renderMap() {
  if (!profile) {
    const recent = localStorage.getItem(CURRENT_KEY);
    if (recent && /^[0-9]{2,8}$/.test(recent)) {
      currentId = recent;
      profile = loadProfile(recent);
    } else {
      renderLogin();
      return;
    }
  }

  app.innerHTML = `
    ${renderTopbar("월드맵", "스테이지를 클리어하며 다음 길을 엽니다.")}
    <main class="screen map-screen">
      <section class="adventure-map" aria-label="스테이지 지도">
        ${renderMapZones()}
        ${renderMapDecorations()}
        <svg class="adventure-path" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" aria-hidden="true">
          <path class="path-base" d="${mapPathD()}"></path>
          <path class="path-dash" d="${mapPathD()}"></path>
        </svg>
        ${stages.map(stage => renderMapNode(stage)).join("")}
      </section>
    </main>
  `;
  bindGlobalActions();
  app.querySelectorAll(".map-node").forEach(button => {
    button.addEventListener("click", () => {
      startAudio();
      const stage = stages.find(item => item.id === button.dataset.stage);
      if (stage && isStageUnlocked(stage)) renderStage(stage.id);
    });
  });
}

function renderMapZones() {
  return worlds.map(world => {
    const top = (world.order - 1) * MAP_ZONE_HEIGHT;
    return `
      <div class="map-zone ${world.className}" style="top:${top}px">
        <div class="zone-banner">${escapeHtml(world.title)} · ${escapeHtml(world.unit)}</div>
      </div>
    `;
  }).join("");
}

function renderMapDecorations() {
  return `
    <div class="map-lab-building" aria-hidden="true"><span></span></div>
    <div class="map-beaker" aria-hidden="true"></div>
    <div class="map-flag" aria-hidden="true"></div>
    <div class="map-track-mark" aria-hidden="true"></div>
    <div class="map-tree" aria-hidden="true"></div>
    <div class="map-flower" aria-hidden="true"></div>
    <div class="map-moon" aria-hidden="true"></div>
    <div class="map-star s1" aria-hidden="true"></div>
    <div class="map-star s2" aria-hidden="true"></div>
  `;
}

function mapPathD() {
  const points = stages.map(stage => mapNodes[stage.id]);
  return points.reduce((d, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const midY = (previous.y + point.y) / 2;
    return `${d} C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
  }, "");
}

function renderMapNode(stage) {
  const point = mapNodes[stage.id];
  const world = worlds.find(item => item.id === stage.world);
  const stars = stageStars(stage.id);
  const unlocked = isStageUnlocked(stage);
  return `
    <button class="map-node ${unlocked ? "" : "locked"}" data-stage="${stage.id}"
      style="left:${point.x}px; top:${point.y}px; --node-color:${world.color}" ${unlocked ? "" : "disabled"}
      aria-label="${escapeHtml(stage.title)}">
      <span class="node-number">${unlocked ? stage.index : "🔒"}</span>
      <span class="map-node-stars">${starText(stars)}</span>
    </button>
  `;
}

function starText(count) {
  return `${count >= 1 ? "★" : "☆"}${count >= 2 ? "★" : "☆"}${count >= 3 ? "★" : "☆"}`;
}

function renderStage(stageId) {
  currentStage = stages.find(stage => stage.id === stageId);
  run = {
    stage: currentStage,
    startAt: Date.now(),
    mistakes: 0,
    bonus: true,
    completed: false
  };

  app.innerHTML = `
    <main class="stage-screen">
      <section class="stage-hud">
        <div>
          <div class="mission-line">${escapeHtml(currentStage.title)} · ${escapeHtml(currentStage.mission)}</div>
          <div class="criteria-row">
            ${currentStage.criteria.map((criterion, index) => `<span class="criterion">별 ${index + 1}: ${escapeHtml(criterion)}</span>`).join("")}
          </div>
        </div>
        <div class="stage-buttons">
          <button class="ghost-btn" id="hint-btn">힌트 1회</button>
          <button class="ghost-btn" id="stage-map-btn">월드맵</button>
        </div>
      </section>
      <section class="playfield-wrap">
        <div id="playfield" class="playfield"></div>
        <div id="tool-shelf" class="tool-shelf"></div>
      </section>
    </main>
  `;
  byId("stage-map-btn").addEventListener("click", () => {
    startAudio();
    renderMap();
  });
  byId("hint-btn").addEventListener("click", () => {
    startAudio();
    if (!run || run.hintUsed) return;
    run.hintUsed = true;
    run.bonus = false;
    byId("hint-btn").disabled = true;
    showMessage(currentStage.hint, 2600);
  });

  const renderers = {
    acidGuest: renderAcidGuest,
    acidStain: renderAcidStain,
    labDress: renderLabDress,
    acidRecipe: renderAcidRecipe,
    acidSwipe: renderAcidSwipe,
    acidLife: renderAcidLife,
    stopwatch: renderStopwatch,
    ghostRace: renderGhostRace,
    safeCity: renderSafeCity,
    slowReplay: renderSlowReplay,
    speedTable: renderSpeedTable,
    speedDetective: renderSpeedDetective,
    plantHunt: renderPlantHunt,
    waterJourney: renderWaterJourney,
    organMatch: renderOrganMatch,
    stemDye: renderStemDye,
    seedJourney: renderSeedJourney,
    pollinator: renderPollinator,
    leafSort: renderLeafSort,
    plantGrowth: renderPlantGrowth,
    earthSpin: renderEarthSpin,
    skyScrub: renderSkyScrub,
    constellation: renderConstellation,
    starConnect: renderStarConnect,
    dayStarMove: renderDayStarMove,
    seasonField: renderSeasonField
  };
  renderers[currentStage.type](currentStage);
}

function playfield() {
  return byId("playfield");
}

function shelf() {
  return byId("tool-shelf");
}

function showMessage(text, timeout = 1300) {
  const field = playfield();
  const old = field.querySelector(".floating-msg");
  if (old) old.remove();
  const msg = document.createElement("div");
  msg.className = "floating-msg";
  msg.textContent = text;
  field.appendChild(msg);
  if (timeout) setTimeout(() => msg.remove(), timeout);
}

function markMistake(message = "좋아요, 다시 맞춰 볼까요?") {
  if (!run) return;
  run.mistakes += 1;
  run.bonus = false;
  sfx("soft");
  playfield().classList.add("shake");
  setTimeout(() => playfield().classList.remove("shake"), 240);
  showMessage(message);
}

function flashAt(field, x, y) {
  const splash = document.createElement("div");
  splash.className = "liquid-splash";
  splash.style.left = `${x}px`;
  splash.style.top = `${y}px`;
  field.appendChild(splash);
  setTimeout(() => splash.remove(), 500);
}

function goodSnap(element, message = "딱 맞았어요!") {
  sfx("snap");
  if (element) {
    element.classList.add("snap-good");
    setTimeout(() => element.classList.remove("snap-good"), 360);
    const fieldRect = playfield().getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    flashAt(playfield(), rect.left + rect.width / 2 - fieldRect.left, rect.top + rect.height / 2 - fieldRect.top);
  }
  showMessage(message, 1000);
}

function completeStage() {
  if (!run || run.completed) return;
  run.completed = true;
  const elapsed = (Date.now() - run.startAt) / 1000;
  let stars = 1;
  if (elapsed <= currentStage.twoTime && run.mistakes <= currentStage.twoMistakes) stars = 2;
  if (elapsed <= currentStage.threeTime && run.mistakes === 0 && run.bonus) stars = 3;
  const previous = profile.stages[currentStage.id]?.stars || 0;
  profile.stages[currentStage.id] = {
    stars: Math.max(previous, stars),
    bestTime: Math.min(profile.stages[currentStage.id]?.bestTime || 99999, Number(elapsed.toFixed(1))),
    attempts: (profile.stages[currentStage.id]?.attempts || 0) + 1,
    lastStars: stars,
    lastTime: Number(elapsed.toFixed(1)),
    mistakes: run.mistakes
  };
  let newCard = false;
  if (stars === 3 && currentStage.card && !profile.cards[currentStage.card.id]) {
    profile.cards[currentStage.card.id] = true;
    newCard = true;
  }
  saveProfile();
  sfx("clear");
  setTimeout(() => renderResult(stars, elapsed, newCard), 520);
}

function renderResult(stars, elapsed, newCard) {
  const world = worlds.find(item => item.id === currentStage.world);
  const next = stages.find(stage => stage.world === currentStage.world && stage.index === currentStage.index + 1)
    || stages.find(stage => worlds.find(w => w.id === stage.world)?.order === world.order + 1 && stage.index === 1);
  app.innerHTML = `
    <main class="result-screen">
      <section class="result-panel">
        <h2>${escapeHtml(currentStage.title)} 클리어</h2>
        <p>기록 ${elapsed.toFixed(1)}초 · 다시 조절한 횟수 ${run.mistakes}회 반영</p>
        <div class="big-stars">
          ${[1, 2, 3].map(index => `<div class="big-star ${stars >= index ? "on" : ""}" style="animation-delay:${index * 130}ms"></div>`).join("")}
        </div>
        <p>${newCard ? `도감 카드 "${escapeHtml(currentStage.card.title)}"가 열렸습니다.` : "별을 더 모으면 도감 카드도 하나씩 채워집니다."}</p>
        <div class="result-actions">
          <button id="retry-btn" class="ghost-btn">다시 도전</button>
          <button id="next-btn" class="primary-btn" ${next && isStageUnlocked(next) ? "" : "disabled"}>다음 스테이지</button>
          <button id="map-btn" class="ghost-btn">월드맵</button>
          <button id="dex-btn" class="ghost-btn">도감</button>
        </div>
      </section>
    </main>
  `;
  [1, 2, 3].forEach((_, index) => setTimeout(() => sfx("coin"), 250 + index * 180));
  byId("retry-btn").addEventListener("click", () => renderStage(currentStage.id));
  byId("map-btn").addEventListener("click", renderMap);
  byId("dex-btn").addEventListener("click", renderCollection);
  byId("next-btn").addEventListener("click", () => {
    if (next && isStageUnlocked(next)) renderStage(next.id);
  });
}

function getDropTarget(x, y, selector) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.matches && element.matches(selector)) return element;
    const closest = element.closest?.(selector);
    if (closest) return closest;
  }
  return null;
}

function makeDraggable(element, handlers = {}) {
  let origin = null;
  let pointer = null;
  element.classList.add("draggable");
  element.addEventListener("pointerdown", event => {
    startAudio();
    if (handlers.canStart && !handlers.canStart(element)) return;
    event.preventDefault();
    pointer = event.pointerId;
    origin = { x: event.clientX, y: event.clientY };
    element.setPointerCapture(pointer);
    element.classList.add("dragging");
    handlers.onStart?.(element, event, origin);
  });
  element.addEventListener("pointermove", event => {
    if (!origin || event.pointerId !== pointer) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    element.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
    handlers.onMove?.(element, event, origin);
  });
  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);

  function finishDrag(event) {
    if (!origin || event.pointerId !== pointer) return;
    element.releasePointerCapture(pointer);
    element.classList.remove("dragging");
    const completed = handlers.onEnd?.(element, event, origin);
    if (!completed) element.style.transform = "";
    origin = null;
    pointer = null;
  }
}

function indicatorName(indicator) {
  if (indicator === "cabbage") return "붉은 양배추 지시약";
  if (indicator === "phenol") return "페놀프탈레인 용액";
  return "BTB 용액";
}

function indicatorColor(solution, indicator) {
  if (indicator === "phenol") return solution.kind === "base" ? { hex: "#ff5b99" } : { hex: "#eef7ff" };
  if (indicator === "btb") return solution.kind === "base" ? { hex: "#2483d6" } : { hex: "#ffd84d" };
  return solution.kind === "base" ? { hex: "#48b96b" } : { hex: "#ff6b7a" };
}

function renderAcidGuest(stage) {
  const field = playfield();
  const items = stage.solutionIds.map(solutionByName);
  let idx = 0;
  let dropperFilled = false;
  let observed = false;
  let served = 0;
  field.innerHTML = `
    <div class="counter acid" data-kind="acid">산성 카운터</div>
    <div class="counter base" data-kind="base">염기성 카운터</div>
    <div id="customer-wrap" class="customer-wrap"></div>
    <div id="dropper" class="dropper-tool" title="스포이트"></div>
    <div id="indicator-bottle" class="bottle-zone">${indicatorName(stage.indicator)}</div>
    <div id="queue-meter" class="queue-meter">손님 0/${items.length}</div>
  `;
  shelf().innerHTML = `<span class="tool-tile"><span class="tool-icon icon-dropper"></span>스포이트를 병에 담갔다가 비커로 옮기세요</span>`;

  function drawCustomer() {
    const solution = items[idx];
    observed = false;
    dropperFilled = false;
    byId("dropper").classList.remove("filled");
    byId("customer-wrap").innerHTML = `
      <div class="speech">${escapeHtml(solution.name)}이 산성인지 염기성인지 알려줘!</div>
      <div id="customer" class="customer draggable">
        <div class="head"></div><div class="body"></div>
        <div id="guest-beaker" class="beaker" style="--liq:#cdefff"></div>
      </div>
    `;
    makeDraggable(byId("customer"), {
      canStart: () => observed,
      onEnd: (element, event) => {
        const target = getDropTarget(event.clientX, event.clientY, ".counter");
        if (!target) return false;
        if (target.dataset.kind === solution.kind) {
          served += 1;
          goodSnap(target, "손님 안내 완료!");
          byId("queue-meter").textContent = `손님 ${served}/${items.length}`;
          idx += 1;
          if (idx >= items.length) setTimeout(() => completeStage(), 650);
          else setTimeout(drawCustomer, 480);
          return true;
        }
        markMistake("색을 한 번 더 보고 안내해 볼까요?");
        return false;
      }
    });
  }

  makeDraggable(byId("dropper"), {
    onEnd: (element, event) => {
      const bottle = getDropTarget(event.clientX, event.clientY, "#indicator-bottle");
      const beaker = getDropTarget(event.clientX, event.clientY, "#guest-beaker");
      const solution = items[idx];
      if (bottle) {
        dropperFilled = true;
        element.classList.add("filled");
        goodSnap(bottle, "스포이트 준비!");
        return false;
      }
      if (beaker && dropperFilled) {
        observed = true;
        dropperFilled = false;
        element.classList.remove("filled");
        const color = indicatorColor(solution, stage.indicator);
        beaker.style.setProperty("--liq", color.hex);
        goodSnap(beaker, `${indicatorName(stage.indicator)}: ${solution[stage.indicator]}`);
        return false;
      }
      markMistake("스포이트를 병에 담근 뒤 비커 위에서 떨어뜨려요.");
      return false;
    }
  });
  drawCustomer();
}

function renderAcidStain(stage) {
  const stains = stage.solutionIds.map((name, index) => ({ ...solutionByName(name), id: `stain-${index}` }));
  let cleaned = 0;
  playfield().innerHTML = `
    <div class="stain-table">
      ${stains.map((stain, index) => `
        <div class="stain" id="${stain.id}" data-kind="${stain.kind}" style="left:${12 + (index % 2) * 58}%; top:${16 + Math.floor(index / 2) * 38}%; --stain:#7a5438">${escapeHtml(stain.name)}</div>
      `).join("")}
    </div>
  `;
  shelf().innerHTML = `
    <div id="stain-dropper" class="tool-tile draggable"><span class="tool-icon icon-dropper"></span>${indicatorName(stage.indicator)}</div>
    <div id="acid-cleaner" class="tool-tile draggable" data-kind="acid"><span class="tool-icon icon-bottle" style="background:linear-gradient(#fff 0 34%, #ff6b7a 35%)"></span>산성 청소액</div>
    <div id="base-cleaner" class="tool-tile draggable" data-kind="base"><span class="tool-icon icon-bottle" style="background:linear-gradient(#fff 0 34%, #27b37e 35%)"></span>염기성 청소액</div>
  `;
  makeDraggable(byId("stain-dropper"), {
    onEnd: (element, event) => {
      const stain = getDropTarget(event.clientX, event.clientY, ".stain:not(.cleaned)");
      if (!stain) return false;
      const data = stains.find(item => item.id === stain.id);
      const color = indicatorColor(data, stage.indicator);
      stain.style.setProperty("--stain", color.hex);
      stain.dataset.observed = "1";
      goodSnap(stain, `${data[stage.indicator]}으로 보입니다.`);
      return false;
    }
  });
  ["acid-cleaner", "base-cleaner"].forEach(id => {
    makeDraggable(byId(id), {
      onEnd: (element, event) => {
        const stain = getDropTarget(event.clientX, event.clientY, ".stain:not(.cleaned)");
        if (!stain) return false;
        if (stain.dataset.observed !== "1") {
          markMistake("먼저 지시약으로 색 변화를 확인해요.");
          return false;
        }
        if (stain.dataset.kind === element.dataset.kind) {
          stain.classList.add("cleaned");
          cleaned += 1;
          goodSnap(stain, "깨끗해졌어요!");
          if (cleaned === stains.length) setTimeout(() => completeStage(), 650);
        } else {
          const scale = Number(stain.dataset.scale || 1) + 0.16;
          stain.dataset.scale = scale;
          stain.style.transform = `scale(${scale})`;
          markMistake("얼룩이 커졌어요. 색을 다시 비교해 봐요.");
        }
        return false;
      }
    });
  });
}

function renderLabDress() {
  const needed = ["goggles", "gloves", "coat"];
  const labels = { goggles: "보안경", gloves: "장갑", coat: "가운", cap: "모자" };
  const filled = new Set();
  playfield().innerHTML = `
    <div class="dress-room">
      <div class="dress-character">
        <div class="head"></div><div class="body"></div>
        <div class="wear-slot" data-item="goggles">눈</div>
        <div class="wear-slot" data-item="coat">몸</div>
        <div class="wear-slot" data-item="gloves">손</div>
      </div>
      <div id="lab-door" class="lab-door">실험실 문</div>
    </div>
  `;
  shelf().innerHTML = ["goggles", "gloves", "coat", "cap"].map(item => `<div class="tool-tile draggable dress-item" data-item="${item}">${labels[item]}</div>`).join("");
  shelf().querySelectorAll(".dress-item").forEach(item => {
    makeDraggable(item, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".wear-slot");
        if (!slot) return false;
        if (slot.dataset.item === element.dataset.item) {
          slot.textContent = labels[element.dataset.item];
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          filled.add(element.dataset.item);
          goodSnap(slot, `${labels[element.dataset.item]} 착용!`);
          if (needed.every(value => filled.has(value))) {
            byId("lab-door").classList.add("opened");
            setTimeout(() => completeStage(), 760);
          }
          return true;
        }
        markMistake("안내 표시가 가리키는 곳에 맞춰 입혀 볼까요?");
        return false;
      }
    });
  });
}

function renderStopwatch(stage) {
  let runnerIndex = 0;
  let phase = "waiting";
  let actualStart = 0;
  let userStart = null;
  const records = [];
  playfield().innerHTML = `
    <div class="motion-game">
      <div class="race-track-area">
        <div class="track-condition">같은 출발선 · 같은 거리</div>
        <div class="track-label start">출발선</div>
        <div class="track-label finish">결승선</div>
        <div class="motion-track-line"></div>
        <div id="runner" class="motion-runner">1</div>
      </div>
      <div class="motion-control-row">
        <div class="motion-timer-card">
          <strong id="runner-name">준비</strong>
          <div id="timer-readout" class="timer-readout">0.00</div>
          <button id="press-btn" class="big-press">출발 순간 누르기</button>
        </div>
        <div class="motion-record-card">
          <strong>측정 기록</strong>
          <div id="record-list">같은 거리에서 직접 잰 시간을 기록합니다.</div>
        </div>
        <div id="rank-board" class="rank-board motion-rank-board"></div>
      </div>
    </div>
  `;
  shelf().innerHTML = `<span class="tool-tile"><span class="tool-icon icon-ruler"></span>카드에 적힌 직접 잰 시간으로 순위를 정하세요</span>`;
  const press = byId("press-btn");
  const runner = byId("runner");
  const readout = byId("timer-readout");
  const name = byId("runner-name");
  const recordList = byId("record-list");

  function setupRunner() {
    const data = stage.runners[runnerIndex];
    phase = "waiting";
    userStart = null;
    runner.style.transition = "none";
    runner.style.left = "7%";
    runner.style.setProperty("--runner", data.color);
    runner.textContent = runnerIndex + 1;
    name.textContent = data.name;
    readout.textContent = "0.00";
    press.disabled = false;
    press.textContent = "출발 순간 누르기";
    setTimeout(() => launchRunner(data), 700);
  }

  function launchRunner(data) {
    if (!run || run.completed) return;
    phase = "running";
    actualStart = performance.now();
    runner.style.transition = `left ${data.ms}ms linear`;
    runner.style.left = "84%";
    requestAnimationFrame(tick);
    setTimeout(() => {
      if (phase === "running") {
        phase = "arrived";
        press.textContent = userStart === null ? "같은 물체 다시 출발" : "도착 순간 누르기";
      }
    }, data.ms);
  }

  function tick() {
    if (phase === "running" || phase === "arrived") {
      readout.textContent = `${Math.max(0, (performance.now() - actualStart) / 1000).toFixed(2)}`;
      if (phase === "running") requestAnimationFrame(tick);
    }
  }

  press.addEventListener("click", () => {
    startAudio();
    if (phase === "waiting") {
      showMessage("물체가 출발하면 눌러요.");
      return;
    }
    if (phase === "running" && userStart === null) {
      userStart = performance.now();
      press.textContent = "도착 순간 누르기";
      goodSnap(press, "시작 기록!");
      return;
    }
    if (phase === "arrived" && userStart === null) {
      markMistake("출발 순간을 놓쳤어요. 같은 물체로 바로 다시 가 볼게요.");
      setTimeout(setupRunner, 650);
      return;
    }
    if ((phase === "running" || phase === "arrived") && userStart !== null) {
      const data = stage.runners[runnerIndex];
      const measured = Math.max(0.1, (performance.now() - userStart) / 1000);
      const previous = records[records.length - 1];
      if (previous && Math.abs(measured - previous.measured) < 0.05) {
        showMessage("한 번 더 재 보세요.", 1800);
        setTimeout(setupRunner, 650);
        return;
      }
      records.push({ ...data, measured });
      recordList.innerHTML = records.map(item => `${escapeHtml(item.name)} ${item.measured.toFixed(2)}초`).join("<br>");
      goodSnap(press, `${measured.toFixed(2)}초 기록!`);
      runnerIndex += 1;
      if (runnerIndex >= stage.runners.length) setTimeout(showRankBoard, 700);
      else setTimeout(setupRunner, 900);
    }
  });

  function showRankBoard() {
    phase = "ranking";
    name.textContent = "순위 보드";
    press.disabled = true;
    readout.textContent = "정렬";
    const board = byId("rank-board");
    board.style.gridTemplateColumns = `repeat(${stage.runners.length}, minmax(0, 1fr))`;
    board.innerHTML = stage.runners.map((_, index) => `<div class="rank-slot" data-rank="${index}">${index + 1}위</div>`).join("");
    shelf().innerHTML = records.map(item => `<div class="card-tile draggable rank-card" data-name="${escapeHtml(item.name)}">${escapeHtml(item.name)}<small>${item.measured.toFixed(2)}초</small></div>`).join("");
    bindRankCards(records, "measuredTime", () => completeStage());
  }

  setupRunner();
}

function bindRankCards(items, mode, onComplete) {
  const answer = [...items]
    .sort((a, b) => mode === "measuredTime" ? a.measured - b.measured : b.distance - a.distance)
    .map(item => item.name);
  const placed = {};
  document.querySelectorAll(".rank-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".rank-slot");
        if (!slot || slot.classList.contains("filled")) return false;
        const rank = Number(slot.dataset.rank);
        if (answer[rank] === element.dataset.name) {
          slot.textContent = `${rank + 1}위 ${element.dataset.name}`;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          placed[rank] = element.dataset.name;
          goodSnap(slot, "순위가 맞아요!");
          if (Object.keys(placed).length === answer.length) setTimeout(onComplete, 700);
          return true;
        }
        markMistake("비교 기준을 다시 살펴보고 순서를 바꿔 볼까요?");
        return false;
      }
    });
  });
}

function renderGhostRace(stage) {
  const measured = new Set();
  playfield().innerHTML = `
    <div class="ghost-game">
      <div class="ghost-lanes">
        ${stage.racers.map((racer, index) => `
          <div class="ghost-lane-row" data-name="${escapeHtml(racer.name)}" data-distance="${racer.distance}">
            <span class="ghost-lane-name">${escapeHtml(racer.name)}</span>
            <div class="ghost-lane-track">
              <span class="ghost-start">출발</span>
              <span class="ghost-finish">도착</span>
              <div class="ghost-object" style="--runner:${racer.color}; left:${racer.distance}%">${index + 1}</div>
            </div>
            <span class="distance-label">${racer.distance}칸</span>
          </div>
        `).join("")}
      </div>
      <div id="rank-board" class="rank-board ghost-rank-board"></div>
    </div>
  `;
  shelf().innerHTML = `
    <div id="ruler" class="tool-tile draggable"><span class="tool-icon icon-ruler"></span>줄자</div>
    <span class="hint-box">줄자를 각 트랙에 대면 이동 거리가 표시됩니다.</span>
  `;
  makeDraggable(byId("ruler"), {
    onEnd: (element, event) => {
      const lane = getDropTarget(event.clientX, event.clientY, ".ghost-lane-row");
      if (!lane) return false;
      lane.querySelector(".distance-label").classList.add("visible");
      measured.add(lane.dataset.name);
      goodSnap(lane, "거리 확인!");
      if (measured.size === stage.racers.length) showGhostRank(stage);
      return false;
    }
  });
}

function showGhostRank(stage) {
  const board = byId("rank-board");
  board.style.gridTemplateColumns = `repeat(${stage.racers.length}, minmax(0, 1fr))`;
  board.innerHTML = stage.racers.map((_, index) => `<div class="rank-slot" data-rank="${index}">${index + 1}위</div>`).join("");
  shelf().innerHTML = stage.racers.map(item => `<div class="card-tile draggable rank-card" data-name="${escapeHtml(item.name)}">${escapeHtml(item.name)}<small>${item.distance}칸</small></div>`).join("");
  bindRankCards(stage.racers, "distance", () => completeStage());
}

function renderSafeCity(stage) {
  const placed = new Set();
  playfield().innerHTML = `
    <div class="city">
      <div class="crosswalk"></div>
      <div class="city-slot" data-target="횡단보도 앞" style="left:40%; top:31%;">횡단보도 앞</div>
      <div class="city-slot" data-target="골목 앞" style="left:13%; top:38%;">골목 앞</div>
      <div class="city-slot" data-target="차 사이" style="right:18%; top:53%;">차 사이</div>
      <div id="walker" class="city-actor" style="left:30%; top:43%;">사람</div>
      <div id="bike" class="city-actor" style="left:6%; top:54%; background:#86ceff;">자전거</div>
      <div id="car" class="city-actor" style="right:8%; top:59%; background:#ff914d;">차</div>
    </div>
  `;
  shelf().innerHTML = stage.placements.map(item => `<div class="tool-tile draggable city-item" data-target="${escapeHtml(item.target)}">${escapeHtml(item.item)}</div>`).join("")
    + `<button id="city-run" class="primary-btn" disabled>통과 시작</button>`;
  shelf().querySelectorAll(".city-item").forEach(item => {
    makeDraggable(item, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".city-slot");
        if (!slot || slot.classList.contains("filled")) return false;
        if (slot.dataset.target === element.dataset.target) {
          slot.textContent = element.textContent;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          placed.add(element.dataset.target);
          goodSnap(slot, "좋은 위치예요!");
          byId("city-run").disabled = placed.size !== stage.placements.length;
          return true;
        }
        markMistake("도로의 표시 위치를 다시 살펴봐요.");
        return false;
      }
    });
  });
  byId("city-run").addEventListener("click", () => {
    startAudio();
    byId("walker").style.transform = "translateX(180px)";
    byId("bike").style.transform = "translateX(290px)";
    byId("car").style.transform = "translateX(-180px)";
    goodSnap(playfield(), "안전하게 통과!");
    setTimeout(() => completeStage(), 1300);
  });
}

function plantSvgMarkup() {
  return `
    <svg class="plant-svg" viewBox="0 0 400 700" aria-hidden="true">
      <g class="plant-root plant-part" data-part="뿌리">
        <path d="M190 500 C165 545 155 590 142 640 M200 500 C200 555 200 610 200 672 M210 500 C238 545 250 590 262 640" fill="none" stroke="#8c6848" stroke-width="24" stroke-linecap="round"/>
        <path d="M160 590 C130 600 112 620 98 650 M240 590 C272 602 292 625 306 654" fill="none" stroke="#8c6848" stroke-width="14" stroke-linecap="round"/>
      </g>
      <g class="plant-stem plant-part" data-part="줄기">
        <path d="M200 500 C198 410 202 275 200 176" fill="none" stroke="#3a9b52" stroke-width="28" stroke-linecap="round"/>
      </g>
      <g class="plant-leaf plant-part left" data-part="잎">
        <path d="M188 330 C122 270 74 286 52 346 C116 374 158 362 188 330Z" fill="#58bd66" stroke="#276b38" stroke-width="8"/>
        <path d="M74 342 C112 334 148 332 188 330" fill="none" stroke="#276b38" stroke-width="5"/>
      </g>
      <g class="plant-leaf plant-part right" data-part="잎">
        <path d="M212 330 C278 270 326 286 348 346 C284 374 242 362 212 330Z" fill="#58bd66" stroke="#276b38" stroke-width="8"/>
        <path d="M326 342 C288 334 252 332 212 330" fill="none" stroke="#276b38" stroke-width="5"/>
      </g>
      <g class="plant-flower plant-part" data-part="꽃">
        <circle cx="200" cy="140" r="34" fill="#ffd24d" stroke="#a33f62" stroke-width="8"/>
        <circle cx="162" cy="140" r="30" fill="#ff7aa9" stroke="#a33f62" stroke-width="7"/>
        <circle cx="238" cy="140" r="30" fill="#ff7aa9" stroke="#a33f62" stroke-width="7"/>
        <circle cx="200" cy="102" r="30" fill="#ff7aa9" stroke="#a33f62" stroke-width="7"/>
        <circle cx="200" cy="178" r="30" fill="#ff7aa9" stroke="#a33f62" stroke-width="7"/>
      </g>
    </svg>
  `;
}

function plantMarkup() {
  return `
    <div class="plant-illustration">
      ${plantSvgMarkup()}
      <div class="water-drop"></div>
    </div>
  `;
}

function renderPlantHunt(stage) {
  let index = 0;
  playfield().innerHTML = `
    <div class="plant-scene">
      <div id="plant-mood" class="plant-mood">찾을 부분: ${stage.targetOrder[index]}</div>
      ${plantMarkup()}
    </div>
  `;
  shelf().innerHTML = `<span class="tool-tile">뿌리 → 줄기 → 잎 → 꽃 순서로 눌러요</span>`;
  playfield().querySelectorAll(".plant-part").forEach(part => {
    part.addEventListener("click", event => {
      startAudio();
      const target = stage.targetOrder[index];
      if (event.currentTarget.dataset.part === target) {
        event.currentTarget.classList.add("found");
        goodSnap(event.currentTarget, `${target} 찾기 완료!`);
        index += 1;
        if (index >= stage.targetOrder.length) setTimeout(() => completeStage(), 650);
        else byId("plant-mood").textContent = `찾을 부분: ${stage.targetOrder[index]}`;
      } else {
        markMistake("이번에 찾을 부분을 다시 확인해요.");
      }
    });
  });
}

function renderWaterJourney(stage) {
  let watered = false;
  let traveled = false;
  playfield().innerHTML = `
    <div class="plant-scene">
      <div class="plant-mood">${escapeHtml(stage.plantName)} 물길 관찰</div>
      ${plantMarkup()}
    </div>
  `;
  shelf().innerHTML = `<div id="watering-can" class="tool-tile draggable"><span class="tool-icon icon-can"></span>물뿌리개</div>`;
  makeDraggable(byId("watering-can"), {
    onEnd: (element, event) => {
      const root = getDropTarget(event.clientX, event.clientY, ".plant-root");
      if (!root) return false;
      watered = true;
      const drop = playfield().querySelector(".water-drop");
      drop.classList.add("travel");
      goodSnap(root, "물이 뿌리에서 출발!");
      setTimeout(() => {
        traveled = true;
        showMessage("물이 빠져나가는 곳을 눌러 표시하세요.", 2200);
      }, 2100);
      return false;
    }
  });
  playfield().addEventListener("click", event => {
    if (!watered || !traveled || run.completed) return;
    const leaf = getDropTarget(event.clientX, event.clientY, ".plant-leaf");
    if (leaf) {
      goodSnap(leaf, "잎에서 밖으로 나갔어요!");
      setTimeout(() => completeStage(), 650);
    } else {
      markMistake("물방울이 마지막으로 향한 잎을 찾아 표시해요.");
    }
  });
}

function renderOrganMatch() {
  const pairs = [
    { organ: "뿌리", text: "물을 흡수", x: 200, y: 580 },
    { organ: "줄기", text: "물이 이동하는 통로 역할", x: 200, y: 380 },
    { organ: "잎", text: "물이 공기 중으로 빠져나감", x: 130, y: 330 },
    { organ: "꽃", text: "씨가 만들어지는 것과 관련", x: 200, y: 140 }
  ];
  const placed = new Set();
  playfield().innerHTML = `
    <div class="plant-scene organ-scene">
      <div class="plant-illustration organ-plant">
        ${plantSvgMarkup()}
        ${pairs.map(pair => `<div class="label-hotspot organ-target" data-organ="${pair.organ}" style="left:${(pair.x / 400) * 100}%; top:${(pair.y / 700) * 100}%;">${pair.organ}</div>`).join("")}
      </div>
    </div>
  `;
  shelf().innerHTML = pairs.map(pair => `<div class="card-tile draggable organ-card" data-organ="${pair.organ}">${pair.text}</div>`).join("");
  document.querySelectorAll(".organ-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const target = getDropTarget(event.clientX, event.clientY, ".organ-target");
        if (!target || target.classList.contains("filled")) return false;
        if (target.dataset.organ === element.dataset.organ) {
          target.classList.add("filled");
          target.textContent = `${target.dataset.organ}: 연결`;
          element.style.visibility = "hidden";
          placed.add(element.dataset.organ);
          drawLineBetween(element, target);
          goodSnap(target, "연결 완료!");
          if (placed.size === 4) setTimeout(() => completeStage(), 700);
          return true;
        }
        markMistake("부분의 일을 떠올려 다시 이어 봐요.");
        return false;
      }
    });
  });
}

function drawLineBetween(fromElement, toElement) {
  const fieldRect = playfield().getBoundingClientRect();
  const from = fromElement.getBoundingClientRect();
  const to = toElement.getBoundingClientRect();
  const x1 = from.left + from.width / 2 - fieldRect.left;
  const y1 = from.top + from.height / 2 - fieldRect.top;
  const x2 = to.left + to.width / 2 - fieldRect.left;
  const y2 = to.top + to.height / 2 - fieldRect.top;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const line = document.createElement("div");
  line.className = "organ-line";
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  playfield().appendChild(line);
}

function renderStemDye(stage) {
  let poured = false;
  let dyeReady = false;
  let cut = false;
  let marked = 0;
  playfield().innerHTML = `
    <div class="stem-dye-scene">
      <div class="plant-mood">빨간 물을 컵에 부어 관찰하세요.</div>
      <div id="dye-cup" class="dye-cup">
        <div id="cup-water" class="cup-water"></div>
        <div id="dye-stem" class="dye-stem"></div>
        <div class="dye-leaf left"></div>
        <div class="dye-leaf right"></div>
        <div id="white-flower" class="white-flower"></div>
      </div>
      <div id="stem-closeup" class="stem-closeup hidden">
        <strong>줄기 단면</strong>
        <div class="stem-slice">
          <button class="dye-dot" data-dot="1" style="left:34%; top:32%"></button>
          <button class="dye-dot" data-dot="2" style="left:58%; top:38%"></button>
          <button class="dye-dot" data-dot="3" style="left:45%; top:62%"></button>
        </div>
      </div>
    </div>
  `;
  shelf().innerHTML = `
    <div id="red-water-bottle" class="tool-tile draggable"><span class="tool-icon icon-bottle" style="background:linear-gradient(#fff 0 34%, #e94b5f 35%)"></span>빨간 물 병</div>
    <div id="scissors-tool" class="tool-tile draggable"><span class="tool-icon scissors-icon"></span>가위</div>
  `;

  makeDraggable(byId("red-water-bottle"), {
    onEnd: (element, event) => {
      const cup = getDropTarget(event.clientX, event.clientY, "#dye-cup");
      if (!cup) return false;
      poured = true;
      cup.classList.add("poured");
      byId("cup-water").classList.add("filled");
      byId("dye-stem").classList.add("dyed");
      byId("white-flower").classList.add("dyed");
      playfield().querySelectorAll(".dye-leaf").forEach(leaf => leaf.classList.add("dyed"));
      goodSnap(cup, "빨간 물이 줄기를 따라 올라갑니다.");
      setTimeout(() => {
        dyeReady = true;
        showMessage("이제 가위로 줄기를 잘라 단면을 살펴보세요.", 2200);
      }, 3600);
      return false;
    }
  });

  makeDraggable(byId("scissors-tool"), {
    onEnd: (element, event) => {
      const stem = getDropTarget(event.clientX, event.clientY, "#dye-stem");
      if (!stem) return false;
      if (!poured) {
        markMistake("먼저 컵에 빨간 물을 부어요.");
        return false;
      }
      if (!dyeReady) {
        showMessage("빨간색이 올라갈 때까지 잠깐 관찰해요.", 1800);
        return false;
      }
      cut = true;
      byId("stem-closeup").classList.remove("hidden");
      goodSnap(stem, "줄기 단면을 살펴봐요.");
      return false;
    }
  });

  playfield().querySelectorAll(".dye-dot").forEach(dot => {
    dot.addEventListener("click", event => {
      startAudio();
      if (!cut) {
        markMistake("줄기를 자른 뒤 단면을 표시해요.");
        return;
      }
      if (event.currentTarget.classList.contains("marked")) return;
      event.currentTarget.classList.add("marked");
      marked += 1;
      goodSnap(event.currentTarget, "물이 지나간 자리 표시!");
      if (marked >= stage.dyeTargets) setTimeout(() => completeStage(), 650);
    });
  });
}

function renderSeedJourney(stage) {
  const placed = {};
  playfield().innerHTML = `
    <div class="plant-scene seed-scene">
      <div class="plant-mood">꽃에서 씨까지</div>
      <div class="seed-slots">
        ${stage.order.map((_, index) => `<div class="rank-slot seed-slot" data-rank="${index}">${index + 1}</div>`).join("")}
      </div>
    </div>
  `;
  shelf().innerHTML = shuffle([...stage.order]).map(item => `<div class="card-tile draggable seed-card" data-name="${item}">${item}</div>`).join("");
  document.querySelectorAll(".seed-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".seed-slot");
        if (!slot || slot.classList.contains("filled")) return false;
        const rank = Number(slot.dataset.rank);
        if (stage.order[rank] === element.dataset.name) {
          slot.textContent = `${rank + 1}. ${element.dataset.name}`;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          placed[rank] = element.dataset.name;
          goodSnap(slot, "흐름이 이어졌어요!");
          if (Object.keys(placed).length === stage.order.length) setTimeout(() => completeStage(), 650);
          return true;
        }
        markMistake("꽃에서 시작하는 순서를 다시 떠올려요.");
        return false;
      }
    });
  });
}

function shuffle(items) {
  return items.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(item => item.value);
}

function renderEarthSpin(stage) {
  let angle = stage.target === "밤" ? 255 : 170;
  let dragging = false;
  let lastX = 0;
  playfield().innerHTML = `
    <div class="space-scene">
      <div class="sun-lamp">전등</div>
      <div id="earth-globe" class="earth-globe draggable">
        <div id="globe-rotor" class="globe-rotor">
          <svg class="continent-layer" viewBox="0 0 240 240" aria-hidden="true">
            <path d="M70 48 C96 34 128 42 135 72 C115 86 99 86 82 74 C73 68 67 60 70 48Z"></path>
            <path d="M145 83 C178 78 200 104 190 134 C164 142 140 128 134 106 C132 96 136 88 145 83Z"></path>
            <path d="M75 138 C106 130 130 150 122 178 C96 194 69 174 62 154 C60 146 65 141 75 138Z"></path>
            <path d="M142 164 C162 158 178 171 174 192 C153 205 134 191 132 176 C131 170 136 166 142 164Z"></path>
          </svg>
          <div id="korea-marker" class="korea-marker">한국</div>
        </div>
        <div class="globe-shade"></div>
      </div>
      <div id="time-state" class="time-state">현재: ${timeName(angle)} · 목표: ${stage.target}</div>
      <div class="earth-spin-note">지구는 한 방향으로만 굴러갑니다.</div>
      <button id="earth-check" class="primary-btn" style="position:absolute; right:8%; bottom:54px;">맞추기</button>
    </div>
  `;
  const globe = byId("earth-globe");
  const rotor = byId("globe-rotor");
  const state = byId("time-state");
  function update(useEase = false) {
    rotor.style.transition = useEase ? "transform .35s ease-out" : "none";
    rotor.style.transform = `rotate(${angle}deg)`;
    state.textContent = `현재: ${timeName(angle)} · 목표: ${stage.target}`;
  }
  globe.addEventListener("pointerdown", event => {
    startAudio();
    dragging = true;
    lastX = event.clientX;
    rotor.style.transition = "none";
    globe.setPointerCapture(event.pointerId);
  });
  globe.addEventListener("pointermove", event => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    lastX = event.clientX;
    angle = (angle - Math.abs(dx) * 1.4 + 360) % 360;
    update(false);
  });
  globe.addEventListener("pointerup", event => {
    dragging = false;
    globe.releasePointerCapture(event.pointerId);
    update(true);
  });
  globe.addEventListener("pointercancel", event => {
    dragging = false;
    globe.releasePointerCapture(event.pointerId);
    update(true);
  });
  byId("earth-check").addEventListener("click", () => {
    startAudio();
    const current = timeName(angle);
    if (current === stage.target) {
      goodSnap(globe, `${stage.target} 위치예요!`);
      setTimeout(() => completeStage(), 650);
    } else {
      markMistake("한국 위치를 조금 더 굴려 맞춰 봐요.");
    }
  });
  update(false);
}

function timeName(angle) {
  const normalized = (angle + 360) % 360;
  if (normalized >= 315 || normalized < 45) return "저녁";
  if (normalized >= 45 && normalized < 135) return "낮";
  if (normalized >= 135 && normalized < 225) return "새벽";
  return "밤";
}

function renderSkyScrub() {
  const placed = new Set();
  playfield().innerHTML = `
    <div id="skyline" class="skyline">
      <div id="sky-sun" class="sky-sun"></div>
      <div class="school-ground"></div>
      <div class="time-slider-panel">
        <label>시간 슬라이더</label>
        <input id="sky-slider" type="range" min="0" max="100" value="0">
        <div class="slot-row">
          <div class="match-slot sky-slot" data-slot="morning">아침 태양 위치</div>
          <div class="match-slot sky-slot" data-slot="evening">저녁 태양 위치</div>
        </div>
      </div>
    </div>
  `;
  shelf().innerHTML = `
    <div class="card-tile draggable direction-card" data-slot="morning">동쪽</div>
    <div class="card-tile draggable direction-card" data-slot="evening">서쪽</div>
  `;
  const slider = byId("sky-slider");
  const skyline = byId("skyline");
  function updateSky() {
    const v = Number(slider.value);
    const x = 12 + v * 0.76;
    const y = 46 - Math.sin((v / 100) * Math.PI) * 32;
    skyline.style.setProperty("--sunX", `${x}%`);
    skyline.style.setProperty("--sunY", `${y}%`);
    skyline.style.setProperty("--skyTop", v < 30 ? "#bce5ff" : v < 70 ? "#8ed6ff" : "#f5a06b");
    skyline.style.setProperty("--skyBottom", v < 30 ? "#ffe3a3" : v < 70 ? "#dff5ff" : "#5360a7");
  }
  slider.addEventListener("input", updateSky);
  document.querySelectorAll(".direction-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".sky-slot");
        if (!slot || slot.classList.contains("filled")) return false;
        if (slot.dataset.slot === element.dataset.slot) {
          slot.textContent = `${slot.dataset.slot === "morning" ? "아침" : "저녁"}: ${element.textContent}`;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          placed.add(slot.dataset.slot);
          goodSnap(slot, "관찰 카드 완료!");
          if (placed.size === 2) setTimeout(() => completeStage(), 650);
          return true;
        }
        markMistake("슬라이더로 하늘을 다시 살펴보고 넣어 봐요.");
        return false;
      }
    });
  });
  updateSky();
}

function renderConstellation(stage) {
  const seasons = [
    { name: "봄", x: "50%", y: "4%", outerClass: "top", answers: ["사자자리", "처녀자리"] },
    { name: "여름", x: "86%", y: "43%", outerClass: "right", answers: ["백조자리", "거문고자리"] },
    { name: "가을", x: "50%", y: "82%", outerClass: "bottom", answers: ["페가수스자리", "안드로메다자리"] },
    { name: "겨울", x: "4%", y: "43%", outerClass: "left", answers: ["오리온자리", "큰개자리"] }
  ];
  let seasonPlaced = false;
  playfield().innerHTML = `
    <div class="orbit-scene">
      <div class="orbit-guide">지구를 ${escapeHtml(stage.season)} 위치에 놓고, 그 한밤중 하늘이 향하는 자리에 별자리 카드를 놓으세요.</div>
      <div class="orbit">
        <div class="orbit-sun">태양</div>
        ${seasons.map(season => `<div class="season-slot" data-season="${season.name}" style="left:${season.x}; top:${season.y}; transform:translate(-50%,-50%);">${season.name}</div>`).join("")}
        ${seasons.map(season => `<div class="constellation-target ${season.outerClass}" data-season="${season.name}">${season.name}철</div>`).join("")}
      </div>
      <div id="earth-token" class="earth-token draggable">지구</div>
    </div>
  `;
  const cards = ["사자자리", "처녀자리", "백조자리", "거문고자리", "페가수스자리", "안드로메다자리", "오리온자리", "큰개자리"];
  shelf().innerHTML = cards.map(card => `<div class="card-tile draggable star-card" data-name="${card}">${card}</div>`).join("");
  makeDraggable(byId("earth-token"), {
    onEnd: (element, event) => {
      const slot = getDropTarget(event.clientX, event.clientY, ".season-slot");
      if (!slot) return false;
      if (slot.dataset.season === stage.season) {
        slot.classList.add("filled");
        slot.textContent = `${stage.season} 위치`;
        element.style.visibility = "hidden";
        seasonPlaced = true;
        goodSnap(slot, "위치 완료!");
        return true;
      }
      markMistake(`${stage.season} 위치를 찾아 놓아 봐요.`);
      return false;
    }
  });
  document.querySelectorAll(".star-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".constellation-target");
        if (!slot) return false;
        if (!seasonPlaced) {
          markMistake("먼저 지구 모형을 목표 위치에 놓아요.");
          return false;
        }
        if (slot.dataset.season !== stage.season) {
          markMistake(`${stage.season}철 하늘이 향하는 자리로 옮겨 보세요.`);
          return false;
        }
        if (stage.answers.includes(element.dataset.name)) {
          slot.textContent = element.dataset.name;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          goodSnap(slot, "별자리 카드 완료!");
          setTimeout(() => completeStage(), 650);
          return true;
        }
        markMistake(`${stage.season}철 별자리 카드를 다시 골라요.`);
        return false;
      }
    });
  });
}

function renderAcidRecipe(stage) {
  const acids = shuffle(solutionPool.filter(item => item.kind === "acid")).slice(0, 4);
  const bases = shuffle(solutionPool.filter(item => item.kind === "base")).slice(0, 4);
  const ingredients = shuffle([...acids, ...bases]);
  const used = new Set();
  playfield().innerHTML = `
    <div class="recipe-scene">
      <div id="cauldron" class="cauldron"><div class="soap-bubble"></div><strong>가마솥</strong></div>
      <div id="soap-float" class="soap-float hidden">비누 완성</div>
    </div>
  `;
  shelf().innerHTML = ingredients.map(item => `
    <div class="card-tile draggable recipe-card" data-name="${escapeHtml(item.name)}" data-kind="${item.kind}">
      ${escapeHtml(item.name)}
      <small>${item.cabbage}</small>
    </div>
  `).join("");
  document.querySelectorAll(".recipe-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const pot = getDropTarget(event.clientX, event.clientY, "#cauldron");
        if (!pot) return false;
        if (element.dataset.kind === "base") {
          used.add(element.dataset.name);
          element.style.visibility = "hidden";
          pot.classList.add("boil");
          setTimeout(() => pot.classList.remove("boil"), 600);
          goodSnap(pot, "보글!");
          if (used.size >= stage.recipeNeed) {
            byId("soap-float").classList.remove("hidden");
            setTimeout(() => completeStage(), 760);
          }
          return true;
        }
        pot.classList.add("sink");
        setTimeout(() => pot.classList.remove("sink"), 520);
        markMistake("거품이 가라앉았어요. 염기성 재료를 골라요.");
        return false;
      }
    });
  });
}

function renderAcidSwipe(stage) {
  const items = stage.solutionIds.map(solutionByName);
  let idx = 0;
  let observed = false;
  let classified = 0;
  let spraying = false;
  playfield().innerHTML = `
    <div class="swipe-scene">
      <div class="swipe-bin acid" data-kind="acid">산성 통</div>
      <div class="swipe-belt"></div>
      <div class="swipe-bin base" data-kind="base">염기성 통</div>
      <button id="sprayer-button" class="sprayer-button">지시약 분무기</button>
      <div id="swipe-counter" class="queue-meter">0/${items.length}</div>
      <div id="swipe-holder"></div>
    </div>
  `;
  shelf().innerHTML = `<span class="tool-tile">분무기를 켜고 비커 위에서 색을 본 뒤 분류하세요</span>`;
  const sprayer = byId("sprayer-button");
  const setSpraying = value => {
    spraying = value;
    sprayer.classList.toggle("active", spraying);
  };
  sprayer.addEventListener("pointerdown", event => {
    startAudio();
    if (event.pointerType === "touch") setSpraying(!spraying);
    else setSpraying(true);
  });
  window.addEventListener("pointerup", event => {
    if (event.pointerType !== "touch") setSpraying(false);
  }, { once: false });
  function drawBeaker() {
    observed = false;
    const solution = items[idx];
    byId("swipe-holder").innerHTML = `<div id="swipe-beaker" class="swipe-beaker draggable" data-kind="${solution.kind}" style="--liq:#cdefff">${escapeHtml(solution.name)}</div>`;
    const beaker = byId("swipe-beaker");
    const reveal = event => {
      if (!spraying || observed) return;
      const target = getDropTarget(event.clientX, event.clientY, "#swipe-beaker");
      if (target) {
        observed = true;
        beaker.style.setProperty("--liq", indicatorColor(solution, "cabbage").hex);
        goodSnap(beaker, `색 변화: ${solution.cabbage}`);
      }
    };
    beaker.addEventListener("pointermove", reveal);
    beaker.addEventListener("click", reveal);
    makeDraggable(beaker, {
      canStart: () => observed,
      onEnd: (element, event) => {
        const bin = getDropTarget(event.clientX, event.clientY, ".swipe-bin");
        if (!bin) return false;
        if (bin.dataset.kind === solution.kind) {
          classified += 1;
          byId("swipe-counter").textContent = `${classified}/${items.length}`;
          goodSnap(bin, "분류 완료!");
          idx += 1;
          if (idx >= items.length) setTimeout(() => completeStage(), 650);
          else setTimeout(drawBeaker, 420);
          return true;
        }
        markMistake("색을 다시 떠올려 알맞은 통으로 보내요.");
        return false;
      }
    });
  }
  drawBeaker();
}

function renderAcidLife(stage) {
  const items = stage.solutionIds.map(solutionByName);
  let done = 0;
  playfield().innerHTML = `
    <div class="life-scene">
      <div class="kitchen-scene">부엌</div>
      <div class="bath-scene">욕실</div>
      <div class="life-box acid" data-kind="acid">산성 박스</div>
      <div class="life-box base" data-kind="base">염기성 박스</div>
    </div>
  `;
  shelf().innerHTML = items.map(item => `
    <div class="card-tile draggable life-card" data-kind="${item.kind}">
      <span class="color-dot" style="background:${indicatorColor(item, "cabbage").hex}"></span>${escapeHtml(item.name)}
    </div>
  `).join("");
  document.querySelectorAll(".life-card").forEach(card => {
    makeDraggable(card, {
      onEnd: (element, event) => {
        const box = getDropTarget(event.clientX, event.clientY, ".life-box");
        if (!box) return false;
        if (box.dataset.kind === element.dataset.kind) {
          element.style.visibility = "hidden";
          done += 1;
          goodSnap(box, "정리 완료!");
          if (done >= items.length) setTimeout(() => completeStage(), 650);
          return true;
        }
        markMistake("작은 색 힌트를 보고 다시 나눠요.");
        return false;
      }
    });
  });
}

function renderSlowReplay(stage) {
  let runnerIndex = 0;
  let phase = "idle";
  let actualStart = 0;
  let userStart = null;
  const records = [];
  playfield().innerHTML = `
    <div class="slow-scene">
      <div class="race-track-area replay-track">
        <div class="track-condition">같은 출발선 · 같은 거리</div>
        <div class="track-label start">출발선</div>
        <div class="track-label finish">결승선</div>
        <div id="replay-runner" class="motion-runner">1</div>
      </div>
      <div class="slow-panel">
        <div class="motion-timer-card">
          <strong id="replay-name">느린 화면 선택</strong>
          <div id="timer-readout" class="timer-readout">0.00</div>
          <button id="press-btn" class="big-press" disabled>측정 버튼</button>
        </div>
        <div id="replay-buttons" class="replay-buttons"></div>
        <div id="rank-board" class="rank-board motion-rank-board"></div>
      </div>
    </div>
  `;
  shelf().innerHTML = `<span class="tool-tile">느린 화면으로 다시 본 뒤 직접 잰 시간으로 정렬하세요</span>`;
  const runner = byId("replay-runner");
  const press = byId("press-btn");
  const readout = byId("timer-readout");
  byId("replay-buttons").innerHTML = stage.runners.map((runner, index) => `<button class="ghost-btn replay-btn" data-index="${index}">${runner.name}</button>`).join("");
  document.querySelectorAll(".replay-btn").forEach(button => button.addEventListener("click", () => startReplay(Number(button.dataset.index))));
  function startReplay(index) {
    if (records.some(item => item.index === index)) {
      showMessage("이미 기록한 물체예요.", 1200);
      return;
    }
    runnerIndex = index;
    const data = stage.runners[index];
    byId("replay-name").textContent = data.name;
    runner.style.transition = "none";
    runner.style.left = "7%";
    runner.style.setProperty("--runner", data.color);
    runner.textContent = index + 1;
    readout.textContent = "0.00";
    press.disabled = false;
    press.textContent = "출발 순간 누르기";
    userStart = null;
    phase = "ready";
    setTimeout(() => {
      phase = "running";
      actualStart = performance.now();
      runner.style.transition = `left ${Math.max(1200, data.ms * 2.4)}ms linear`;
      runner.style.left = "84%";
      requestAnimationFrame(tick);
      setTimeout(() => {
        if (phase === "running") {
          phase = "arrived";
          press.textContent = userStart ? "도착 순간 누르기" : "다시 보기";
        }
      }, Math.max(1200, data.ms * 2.4));
    }, 500);
  }
  function tick() {
    if (phase === "running" || phase === "arrived") {
      readout.textContent = `${Math.max(0, (performance.now() - actualStart) / 1000).toFixed(2)}`;
      if (phase === "running") requestAnimationFrame(tick);
    }
  }
  press.addEventListener("click", () => {
    startAudio();
    if (phase === "running" && userStart === null) {
      userStart = performance.now();
      press.textContent = "도착 순간 누르기";
      goodSnap(press, "시작 기록!");
      return;
    }
    if (phase === "arrived" && userStart === null) {
      startReplay(runnerIndex);
      return;
    }
    if ((phase === "running" || phase === "arrived") && userStart) {
      const measured = Math.max(0.1, (performance.now() - userStart) / 1000);
      const previous = records[records.length - 1];
      if (previous && Math.abs(measured - previous.measured) < 0.05) {
        showMessage("한 번 더 재 보세요.", 1600);
        startReplay(runnerIndex);
        return;
      }
      records.push({ ...stage.runners[runnerIndex], index: runnerIndex, measured });
      goodSnap(press, `${measured.toFixed(2)}초 기록!`);
      press.disabled = true;
      if (records.length === stage.runners.length) showReplayRank();
    }
  });
  function showReplayRank() {
    const board = byId("rank-board");
    board.style.gridTemplateColumns = `repeat(${records.length}, minmax(0, 1fr))`;
    board.innerHTML = records.map((_, index) => `<div class="rank-slot" data-rank="${index}">${index + 1}위</div>`).join("");
    shelf().innerHTML = records.map(item => `<div class="card-tile draggable rank-card" data-name="${escapeHtml(item.name)}">${escapeHtml(item.name)}<small>${item.measured.toFixed(2)}초</small></div>`).join("");
    bindRankCards(records, "measuredTime", () => completeStage());
  }
}

function renderSpeedTable(stage) {
  const filled = {};
  const ranks = {};
  let rankingReady = false;
  playfield().innerHTML = `
    <div class="speed-table-scene">
      <table class="speed-table">
        <thead><tr><th>이름</th><th>거리</th><th>시간</th><th>빠른 순위</th></tr></thead>
        <tbody>
          ${stage.rows.map((row, index) => `
            <tr data-index="${index}">
              <td>${row.name}</td>
              <td class="measure-cell" data-kind="distance">${index % 2 === 0 ? "" : `${row.distance}m`}</td>
              <td class="measure-cell" data-kind="time">${index % 2 === 1 ? "" : `${row.time}초`}</td>
              <td><div class="rank-slot table-rank-slot" data-name="${row.name}">순위</div></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  shelf().innerHTML = `
    <div class="tool-tile draggable table-tool" data-tool="distance"><span class="tool-icon icon-ruler"></span>줄자</div>
    <div class="tool-tile draggable table-tool" data-tool="time"><span class="tool-icon icon-dropper"></span>스톱워치</div>
  `;
  document.querySelectorAll(".table-tool").forEach(tool => makeDraggable(tool, {
    onEnd: (element, event) => {
      const rowEl = getDropTarget(event.clientX, event.clientY, ".speed-table tbody tr");
      if (!rowEl) return false;
      const index = Number(rowEl.dataset.index);
      const row = stage.rows[index];
      const kind = element.dataset.tool;
      const cell = rowEl.querySelector(`.measure-cell[data-kind="${kind}"]`);
      cell.textContent = kind === "distance" ? `${row.distance}m` : `${row.time}초`;
      filled[`${index}-${kind}`] = true;
      goodSnap(cell, "기록 완료!");
      const allFilled = [...document.querySelectorAll(".measure-cell")].every(item => item.textContent.trim());
      if (!rankingReady && allFilled) {
        rankingReady = true;
        showRankNumbers();
      }
      return false;
    }
  }));
  function showRankNumbers() {
    shelf().innerHTML = [1, 2, 3, 4].map(rank => `<div class="card-tile draggable table-rank-card" data-rank="${rank}">${rank}위</div>`).join("");
    document.querySelectorAll(".table-rank-card").forEach(card => makeDraggable(card, {
      onEnd: (element, event) => {
        const slot = getDropTarget(event.clientX, event.clientY, ".table-rank-slot");
        if (!slot || slot.classList.contains("filled")) return false;
        const answer = [...stage.rows].sort((a, b) => a.time - b.time).findIndex(row => row.name === slot.dataset.name) + 1;
        if (Number(element.dataset.rank) === answer) {
          slot.textContent = element.textContent;
          slot.classList.add("filled");
          element.style.visibility = "hidden";
          ranks[slot.dataset.name] = true;
          goodSnap(slot, "순위 기록!");
          if (Object.keys(ranks).length === stage.rows.length) setTimeout(() => completeStage(), 650);
          return true;
        }
        markMistake("표의 시간 값을 다시 비교해요.");
        return false;
      }
    }));
  }
}

function renderSpeedDetective(stage) {
  playfield().innerHTML = `<div class="detective-scene"><div id="rank-board" class="rank-board detective-board">${stage.cases.map((_, i) => `<div class="rank-slot" data-rank="${i}">${i + 1}위</div>`).join("")}</div></div>`;
  shelf().innerHTML = stage.cases.map(item => `<div class="card-tile draggable rank-card detective-card" data-name="${item.name}"><strong>${item.name}</strong><small>${item.text}</small></div>`).join("");
  bindRankCards(stage.cases.map(item => ({ ...item, measured: item.time })), "measuredTime", () => completeStage());
}

function renderPollinator(stage) {
  const done = new Set();
  playfield().innerHTML = `
    <div class="pollinator-scene">
      ${Array.from({ length: stage.flowerCount }, (_, i) => `<div class="garden-flower" data-index="${i}" style="left:${16 + i * 17}%; top:${36 + (i % 2) * 18}%"><span></span></div>`).join("")}
    </div>
  `;
  shelf().innerHTML = `<div id="bee-tool" class="tool-tile draggable bee-tool">꿀벌</div>`;
  makeDraggable(byId("bee-tool"), {
    onEnd: (element, event) => {
      const flower = getDropTarget(event.clientX, event.clientY, ".garden-flower");
      if (!flower) {
        markMistake("꿀벌을 꽃 위에 놓아 주세요.");
        return false;
      }
      flower.classList.add("visited");
      done.add(flower.dataset.index);
      goodSnap(flower, "작은 열매 표시가 생겼어요!");
      if (done.size >= stage.flowerCount) setTimeout(() => completeStage(), 650);
      return false;
    }
  });
}

function renderLeafSort(stage) {
  const done = {};
  const leafShapes = {
    "강낭콩": "둥근 잎",
    "봉선화": "길쭉한 잎",
    "해바라기": "넓은 잎",
    "토마토": "갈라진 잎"
  };
  playfield().innerHTML = `
    <div class="leaf-sort-scene">
      ${stage.plants.map(plant => `<div class="plant-row" data-plant="${plant}"><div class="mini-plant ${plant}">${plant}</div><div class="match-slot leaf-slot" data-plant="${plant}">잎 카드</div></div>`).join("")}
    </div>
  `;
  shelf().innerHTML = shuffle(stage.plants).map(plant => `<div class="card-tile draggable leaf-card" data-plant="${plant}">${leafShapes[plant]}</div>`).join("");
  document.querySelectorAll(".leaf-card").forEach(card => makeDraggable(card, {
    onEnd: (element, event) => {
      const slot = getDropTarget(event.clientX, event.clientY, ".leaf-slot");
      if (!slot || slot.classList.contains("filled")) return false;
      if (slot.dataset.plant === element.dataset.plant) {
        slot.textContent = element.textContent;
        slot.classList.add("filled");
        element.style.visibility = "hidden";
        done[slot.dataset.plant] = true;
        goodSnap(slot, "잎 모양 확인!");
        if (Object.keys(done).length === stage.plants.length) setTimeout(() => completeStage(), 650);
        return true;
      }
      markMistake("식물 그림의 잎 모양을 다시 살펴봐요.");
      return false;
    }
  }));
}

function renderPlantGrowth(stage) {
  const placed = {};
  playfield().innerHTML = `
    <div class="growth-scene">
      <div id="growth-pot" class="growth-pot" data-stage="0"><div class="growth-plant"></div></div>
      <div class="growth-slider-panel"><input id="growth-slider" type="range" min="0" max="100" value="0"></div>
      <div class="growth-slots">${stage.order.map((label, i) => `<div class="match-slot growth-slot" data-label="${label}">${i + 1}</div>`).join("")}</div>
    </div>
  `;
  shelf().innerHTML = shuffle([...stage.order]).map(label => `<div class="card-tile draggable growth-card" data-label="${label}">${label}</div>`).join("");
  const slider = byId("growth-slider");
  slider.addEventListener("input", () => byId("growth-pot").dataset.stage = Math.min(4, Math.floor(Number(slider.value) / 21)));
  document.querySelectorAll(".growth-card").forEach(card => makeDraggable(card, {
    onEnd: (element, event) => {
      const slot = getDropTarget(event.clientX, event.clientY, ".growth-slot");
      if (!slot || slot.classList.contains("filled")) return false;
      if (slot.dataset.label === element.dataset.label) {
        slot.textContent = element.dataset.label;
        slot.classList.add("filled");
        element.style.visibility = "hidden";
        placed[element.dataset.label] = true;
        goodSnap(slot, "순서 확인!");
        if (Object.keys(placed).length === stage.order.length) setTimeout(() => completeStage(), 650);
        return true;
      }
      markMistake("슬라이더로 자라는 모습을 다시 살펴봐요.");
      return false;
    }
  }));
}

function renderStarConnect(stage) {
  let next = 0;
  const points = stage.points;
  playfield().innerHTML = `
    <div class="star-connect-scene">
      <svg id="star-lines" class="star-lines" viewBox="0 0 100 100"></svg>
      ${points.map((point, i) => `<button class="star-point" data-index="${i}" style="left:${point.x}%; top:${point.y}%">${i + 1}</button>`).join("")}
      <div id="constellation-name" class="constellation-name hidden">${stage.constellationName}</div>
    </div>
  `;
  shelf().innerHTML = `<span class="tool-tile">번호 순서대로 별을 눌러 선을 이어요</span>`;
  document.querySelectorAll(".star-point").forEach(point => point.addEventListener("click", event => {
    startAudio();
    const index = Number(event.currentTarget.dataset.index);
    if (index !== next) {
      markMistake("다음 번호의 별을 찾아 눌러요.");
      return;
    }
    event.currentTarget.classList.add("active");
    next += 1;
    drawStarPolyline(points.slice(0, next));
    goodSnap(event.currentTarget, "별을 이었어요!");
    if (next === points.length) {
      byId("constellation-name").classList.remove("hidden");
      setTimeout(() => completeStage(), 700);
    }
  }));
}

function drawStarPolyline(points) {
  byId("star-lines").innerHTML = `<polyline points="${points.map(point => `${point.x},${point.y}`).join(" ")}"></polyline>`;
}

function renderDayStarMove(stage) {
  const placed = {};
  playfield().innerHTML = `
    <div class="day-star-scene">
      <div id="moving-stars" class="moving-stars"></div>
      <div class="day-slider-panel"><input id="day-star-slider" type="range" min="0" max="100" value="0"></div>
      <div class="day-slots">${stage.labels.map((label, i) => `<div class="match-slot day-slot" data-label="${label}" data-index="${i}">${i + 1}</div>`).join("")}</div>
    </div>
  `;
  shelf().innerHTML = stage.labels.map(label => `<div class="card-tile draggable day-card" data-label="${label}">${label}</div>`).join("");
  const slider = byId("day-star-slider");
  const stars = byId("moving-stars");
  slider.addEventListener("input", () => {
    const v = Number(slider.value);
    stars.style.left = `${18 + v * 0.64}%`;
    stars.style.top = `${58 - Math.sin((v / 100) * Math.PI) * 30}%`;
  });
  document.querySelectorAll(".day-card").forEach(card => makeDraggable(card, {
    onEnd: (element, event) => {
      const slot = getDropTarget(event.clientX, event.clientY, ".day-slot");
      if (!slot || slot.classList.contains("filled")) return false;
      if (slot.dataset.label === element.dataset.label) {
        slot.textContent = element.dataset.label;
        slot.classList.add("filled");
        element.style.visibility = "hidden";
        placed[element.dataset.label] = true;
        goodSnap(slot, "시각 카드 완료!");
        if (Object.keys(placed).length === stage.labels.length) setTimeout(() => completeStage(), 650);
        return true;
      }
      markMistake("슬라이더로 위치를 다시 살펴봐요.");
      return false;
    }
  }));
}

function renderSeasonField(stage) {
  const done = {};
  const allCards = ["사자자리", "처녀자리", "백조자리", "거문고자리", "페가수스자리", "안드로메다자리", "오리온자리", "큰개자리"];
  playfield().innerHTML = `
    <div class="season-field-scene">
      ${stage.seasons.map(item => `<div class="season-card ${item.season}" data-answer="${item.answer}"><strong>${item.season}</strong><span>${item.scene}</span><div class="faint-stars"></div><div class="match-slot season-name-slot">이름 카드</div></div>`).join("")}
    </div>
  `;
  shelf().innerHTML = allCards.map(name => `<div class="card-tile draggable season-star-card" data-name="${name}">${name}</div>`).join("");
  document.querySelectorAll(".season-star-card").forEach(card => makeDraggable(card, {
    onEnd: (element, event) => {
      const card = getDropTarget(event.clientX, event.clientY, ".season-card");
      if (!card || card.classList.contains("filled")) return false;
      if (card.dataset.answer === element.dataset.name) {
        card.classList.add("filled");
        card.querySelector(".season-name-slot").textContent = element.dataset.name;
        element.style.visibility = "hidden";
        done[element.dataset.name] = true;
        goodSnap(card, "계절 별자리 확인!");
        if (Object.keys(done).length === stage.seasons.length) setTimeout(() => completeStage(), 650);
        return true;
      }
      markMistake("계절 풍경과 별자리 모양을 다시 비교해요.");
      return false;
    }
  }));
}

function renderCollection() {
  if (!profile) {
    const recent = localStorage.getItem(CURRENT_KEY);
    if (recent) {
      currentId = recent;
      profile = loadProfile(recent);
    }
  }
  app.innerHTML = `
    ${profile ? renderTopbar("도감", "3별로 클리어한 스테이지의 카드가 펼쳐집니다.") : ""}
    <main class="screen">
      <h2>과학 도감</h2>
      <div class="book-tabs">
        ${worlds.map(world => `<button class="book-tab ${dexTab === world.id ? "active" : ""}" data-tab="${world.id}">${escapeHtml(world.title)}</button>`).join("")}
      </div>
      <div class="collection-grid">
        ${allCards.filter(card => card.world === dexTab).map(card => renderDexCard(card)).join("")}
      </div>
    </main>
  `;
  if (profile) bindGlobalActions();
  app.querySelectorAll(".book-tab").forEach(tab => tab.addEventListener("click", () => {
    dexTab = tab.dataset.tab;
    renderCollection();
  }));
}

function renderDexCard(card) {
  const unlocked = Boolean(profile?.cards?.[card.id]);
  return `
    <article class="dex-card ${unlocked ? "unlocked" : "locked"}" tabindex="0">
      <div class="dex-inner">
        <div class="dex-face">
          <div>
            <div class="dex-art" style="--art:${card.color}"></div>
            <strong>${unlocked ? escapeHtml(card.title) : "잠긴 카드"}</strong>
          </div>
        </div>
        <div class="dex-face dex-back">
          <strong>${escapeHtml(card.title)}</strong>
          <span>${unlocked ? escapeHtml(card.fact) : "3별 클리어로 열립니다."}</span>
        </div>
      </div>
    </article>
  `;
}

function readAllProfiles() {
  const rows = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORE_PREFIX) || key === CURRENT_KEY) continue;
    const id = key.slice(STORE_PREFIX.length);
    if (!/^[0-9]{2,8}$/.test(id)) continue;
    rows.push(loadProfile(id));
  }
  return rows.sort((a, b) => a.studentId.localeCompare(b.studentId));
}

function renderTeacher(selectedId = "") {
  const rows = readAllProfiles();
  const selected = selectedId ? rows.find(row => row.studentId === selectedId) : rows[0];
  app.innerHTML = `
    <main class="screen">
      <section class="teacher-panel">
        <h2>교사용 진행 데이터</h2>
        <p>학생 이름은 저장하지 않습니다. 이 브라우저의 학번별 기록만 표시합니다.</p>
        <div class="teacher-actions">
          ${profile ? `<button class="ghost-btn" data-action="map">월드맵</button><button class="ghost-btn" data-action="dex">도감</button>` : `<button id="teacher-login-back" class="ghost-btn">시작 화면</button>`}
          <button id="export-json" class="ghost-btn">JSON 내보내기</button>
          <button id="export-csv" class="ghost-btn">CSV 내보내기</button>
          <label class="ghost-btn" for="import-json">JSON 가져오기</label>
          <input id="import-json" type="file" accept="application/json" class="hidden">
          <button id="reset-all" class="danger-btn">전체 초기화</button>
        </div>
        <div class="teacher-table-wrap">
          <table>
            <thead>
              <tr>
                <th>학번</th><th>진행률</th><th>별 합계</th>
                ${worlds.map(world => `<th>${escapeHtml(world.title)}</th>`).join("")}
                <th>상세</th><th>삭제</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map(row => renderTeacherRow(row)).join("") : `<tr><td colspan="9">저장된 학생 기록이 없습니다.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div id="student-detail" class="detail-box">
          ${selected ? renderStudentDetail(selected) : "학생을 선택하면 상세 보기가 표시됩니다."}
        </div>
      </section>
    </main>
  `;
  if (profile) bindGlobalActions();
  if (byId("teacher-login-back")) byId("teacher-login-back").addEventListener("click", renderLogin);
  app.querySelectorAll("[data-detail]").forEach(button => button.addEventListener("click", () => renderTeacher(button.dataset.detail)));
  app.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.delete;
    if (confirm(`${id} 기록을 삭제할까요?`)) {
      localStorage.removeItem(profileKey(id));
      if (currentId === id) {
        currentId = "";
        profile = null;
        localStorage.removeItem(CURRENT_KEY);
      }
      renderTeacher();
    }
  }));
  byId("export-json").addEventListener("click", exportJson);
  byId("export-csv").addEventListener("click", exportCsv);
  byId("import-json").addEventListener("change", importJson);
  byId("reset-all").addEventListener("click", () => {
    if (!confirm("이 브라우저의 모든 학생 기록을 초기화할까요?")) return;
    readAllProfiles().forEach(row => localStorage.removeItem(profileKey(row.studentId)));
    localStorage.removeItem(CURRENT_KEY);
    currentId = "";
    profile = null;
    renderTeacher();
  });
}

function renderTeacherRow(row) {
  const cleared = stages.filter(stage => row.stages?.[stage.id]?.stars > 0).length;
  const starSum = totalStars(row);
  return `
    <tr>
      <td>${escapeHtml(row.studentId)}</td>
      <td>${cleared}/${stages.length}</td>
      <td>${starSum}</td>
      ${worlds.map(world => {
        const worldStages = stagesByWorld(world.id);
        const worldCleared = worldStages.filter(stage => row.stages?.[stage.id]?.stars > 0).length;
        const worldStars = worldStages.reduce((sum, stage) => sum + (row.stages?.[stage.id]?.stars || 0), 0);
        return `<td>${worldCleared}/${worldStages.length} · 별 ${worldStars}</td>`;
      }).join("")}
      <td><button class="ghost-btn" data-detail="${escapeHtml(row.studentId)}">보기</button></td>
      <td><button class="danger-btn" data-delete="${escapeHtml(row.studentId)}">삭제</button></td>
    </tr>
  `;
}

function renderStudentDetail(row) {
  const starSum = totalStars(row);
  const nextStage = stages.find(stage => !row.stages?.[stage.id]?.stars);
  return `
    <h3>학번 ${escapeHtml(row.studentId)} 상세</h3>
    <p>별 합계 ${starSum} · 도감 ${Object.keys(row.cards || {}).length}/${allCards.length} · ${nextStage ? `다음 관심 스테이지: ${escapeHtml(nextStage.title)}` : "모든 스테이지 클리어"}</p>
    <div class="progress-strip">
      ${stages.map(stage => {
        const stars = row.stages?.[stage.id]?.stars || 0;
        return `<div class="mini-cell ${stars ? "done" : ""}" title="${escapeHtml(stage.title)}">${stars ? starText(stars) : stage.index}</div>`;
      }).join("")}
    </div>
    <table>
      <thead><tr><th>스테이지</th><th>별</th><th>최고 기록</th><th>도전</th></tr></thead>
      <tbody>
        ${stages.map(stage => {
          const data = row.stages?.[stage.id];
          return `<tr><td>${escapeHtml(stage.title)}</td><td>${starText(data?.stars || 0)}</td><td>${data?.bestTime ? `${data.bestTime}초` : "-"}</td><td>${data?.attempts || 0}</td></tr>`;
        }).join("")}
      </tbody>
    </table>
  `;
}

function exportJson() {
  const payload = { exportedAt: new Date().toISOString(), app: "science6_g1", students: readAllProfiles() };
  downloadText("science6_g1_progress.json", JSON.stringify(payload, null, 2), "application/json");
}

function exportCsv() {
  const header = ["학번", "진행률", "별 합계", ...worlds.map(world => world.title)];
  const lines = [header.join(",")];
  readAllProfiles().forEach(row => {
    const cleared = stages.filter(stage => row.stages?.[stage.id]?.stars > 0).length;
    const starSum = totalStars(row);
    const worldTexts = worlds.map(world => {
      const worldStages = stagesByWorld(world.id);
      const worldCleared = worldStages.filter(stage => row.stages?.[stage.id]?.stars > 0).length;
      const worldStars = worldStages.reduce((sum, stage) => sum + (row.stages?.[stage.id]?.stars || 0), 0);
      return `${worldCleared}/${worldStages.length} 별 ${worldStars}`;
    });
    lines.push([row.studentId, `${cleared}/${stages.length}`, starSum, ...worldTexts].map(csvCell).join(","));
  });
  downloadText("science6_g1_progress.csv", lines.join("\n"), "text/csv");
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const students = Array.isArray(parsed) ? parsed : parsed.students;
      if (!Array.isArray(students)) throw new Error("no students");
      students.forEach(row => {
        if (!/^[0-9]{2,8}$/.test(String(row.studentId))) return;
        localStorage.setItem(profileKey(String(row.studentId)), JSON.stringify({
          ...emptyProfile(String(row.studentId)),
          ...row,
          studentId: String(row.studentId),
          stages: row.stages || {},
          cards: row.cards || {},
          updatedAt: new Date().toISOString()
        }));
      });
      renderTeacher();
    } catch {
      alert("가져올 수 있는 JSON 형식이 아닙니다.");
    }
  };
  reader.readAsText(file);
}

function boot() {
  const recent = localStorage.getItem(CURRENT_KEY);
  if (recent && /^[0-9]{2,8}$/.test(recent)) {
    currentId = recent;
    profile = loadProfile(recent);
    renderMap();
  } else {
    renderLogin();
  }
}

boot();

