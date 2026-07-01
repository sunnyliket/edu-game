const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const game = {
    scene: "market",
    started: false,
    player: { x: 50, y: 78 },
    keys: new Set(),
    nearby: null,
    acquired: new Set(),
    marketQuizSolved: false,
    quizSolvedCount: 0,
    reputation: 0,
    kitchenMode: null,
    kitchenStepIndex: 0,
    quizLocked: false,
    currentThings: []
};

const scenes = {
    market: {
        label: "MART",
        place: "마트",
        className: "market-world",
        start: { x: 50, y: 82 }
    },
    shop: {
        label: "OKI SHOP",
        place: "가게",
        className: "shop-world",
        start: { x: 50, y: 82 }
    },
    kitchen: {
        label: "KITCHEN",
        place: "주방",
        className: "kitchen-world",
        start: { x: 50, y: 82 }
    }
};

const marketItems = [
    { id: "butter", label: "버터", icon: "🧈", x: 23, y: 50 },
    { id: "flour", label: "강력분", icon: "🥣", x: 44, y: 38 },
    { id: "choco", label: "초코칩", icon: "🍫", x: 66, y: 48 },
    { id: "egg", label: "계란", icon: "🥚", x: 80, y: 68 }
];

const scienceQuizzes = {
    litmusSort: {
        badge: "1번 과학 퀴즈",
        title: "리트머스 종이 분류",
        type: "choice",
        question: "리트머스 종이에 반응하는 물질을 산성과 염기성으로 바르게 나눈 것은 무엇일까요?",
        options: [
            "산성: 탄산수, 레몬즙, 묽은 염산 / 염기성: 석회수, 빨래 비누 물, 묽은 수산화 나트륨 용액",
            "산성: 석회수, 빨래 비누 물 / 염기성: 탄산수, 레몬즙, 묽은 염산",
            "산성: 탄산수, 석회수, 계란 / 염기성: 레몬즙, 초코칩, 버터",
            "산성: 모든 보기 / 염기성: 없음"
        ],
        answer: 0,
        good: "정답! 탄산수, 레몬즙, 묽은 염산은 산성이고 석회수, 빨래 비누 물, 묽은 수산화 나트륨 용액은 염기성입니다."
    },
    lemonAcid: {
        badge: "2번 과학 퀴즈",
        title: "레몬즙과 산성",
        type: "ox",
        question: "레몬즙은 산성 용액에 해당되나요?",
        answer: true,
        good: "정답! 레몬즙은 대표적인 산성 용액입니다."
    },
    baseBleach: {
        badge: "3번 과학 퀴즈",
        title: "염기성과 표백제",
        type: "ox",
        question: "표백제는 염기성 용액에 해당되나요?",
        answer: true,
        good: "정답! 표백제는 염기성 용액의 예입니다."
    },
    cabbageAcid: {
        badge: "4번 과학 퀴즈",
        title: "양배추 지시약",
        type: "ox",
        question: "양배추 지시약을 넣었을 때 산성 용액은 색깔이 변하나요?",
        answer: true,
        good: "정답! 양배추 지시약은 산성과 염기성에서 색이 달라집니다."
    },
    phenolphthaleinBase: {
        badge: "5번 과학 퀴즈",
        title: "페놀프탈레인 반응",
        type: "ox",
        question: "페놀프탈레인을 염기성 용액에 넣었을 때 색깔이 변하나요?",
        answer: true,
        good: "정답! 페놀프탈레인은 염기성 용액에서 붉은색 계열로 변합니다."
    },
    redCabbageAcid: {
        badge: "6번 과학 퀴즈",
        title: "붉은 양배추 지시약",
        type: "ox",
        question: "산성 용액에 붉은색 양배추 지시약은 붉은색으로 변합니다.",
        answer: true,
        good: "정답! 산성에서는 붉은색 계열로 변합니다."
    },
    cabbageBaseColor: {
        badge: "7번 과학 퀴즈",
        title: "염기성과 양배추 지시약",
        type: "text",
        question: "붉은색 양배추 지시약을 넣었을 때 염기성 용액은 무슨 색 계열로 변하나요?",
        keywords: ["푸른", "노란"],
        good: "정답! 염기성 용액은 푸른색 계열이나 노란색 계열로 변합니다."
    },
    acidificationDamage: {
        badge: "8번 과학 퀴즈",
        title: "산성화 피해",
        type: "text",
        question: "땅이나 물 등이 산성으로 변하는 것을 산성화라고 합니다. 그 피해 사례를 한 가지 쓰세요.",
        keywords: ["산성비", "산림", "황폐", "환경", "문화유산"],
        good: "정답! 산성비로 산림이 황폐해지거나 문화유산이 훼손될 수 있습니다."
    }
};

const shopCustomer = {
    id: "firstCustomer",
    label: "첫 손님",
    icon: "😊",
    x: 62,
    y: 52,
    type: "customer"
};

const groupCustomer = {
    id: "groupCustomer",
    label: "단체 손님",
    icon: "👨‍👩‍👧",
    x: 62,
    y: 52,
    type: "customer"
};

const kitchenStations = [
    { id: "bowl", label: "믹싱볼", icon: "🥣", x: 25, y: 56, type: "station" },
    { id: "sieve", label: "체", icon: "🕳️", x: 44, y: 42, type: "station" },
    { id: "tray", label: "오븐 판", icon: "🍪", x: 63, y: 58, type: "station" },
    { id: "oven", label: "오븐", icon: "🔥", x: 78, y: 39, type: "station" },
    { id: "package", label: "포장대", icon: "🎁", x: 80, y: 72, type: "station" }
];

const firstCookieSteps = [
    { station: "bowl", text: "믹싱볼에 실온에 둔 버터를 넣었다." },
    { station: "bowl", text: "실리콘 주걱으로 버터를 으깼다.", quiz: "lemonAcid" },
    { station: "bowl", text: "계란을 넣었다." },
    { station: "bowl", text: "계란을 넣고 11자로 저었다.", quiz: "baseBleach" },
    { station: "bowl", text: "설탕을 넣고 알갱이가 사라질 때까지 섞었다." },
    { station: "sieve", text: "박력분을 체 쳐서 넣었다.", quiz: "cabbageAcid" },
    { station: "bowl", text: "초코칩을 넣었다.", quiz: "phenolphthaleinBase" },
    { station: "tray", text: "오븐 판에 동그란 반죽 5개를 놓았다." },
    { station: "oven", text: "오븐에서 쿠키를 노릇하게 익혔다." },
    { station: "package", text: "초코칩 쿠키 5개를 예쁘게 포장했다." }
];

const groupCookieSteps = [
    { station: "bowl", text: "단체 손님용 쿠키 반죽을 빠르게 시작했다." },
    { station: "bowl", text: "버터를 실온에 미리 둬서 더 빨리 으깼다." },
    { station: "bowl", text: "계란을 넣고 11자로 저었다." },
    { station: "sieve", text: "설탕을 섞고 박력분을 체 쳐 넣었다." },
    { station: "bowl", text: "초코칩을 넣어 쿠키 반죽을 완성했다." },
    { station: "tray", text: "오븐 판에 쿠키 반죽 2개를 놓았다." },
    { station: "oven", text: "쿠키 2개를 무사히 구웠다.", quiz: "acidificationDamage" }
];

document.addEventListener("DOMContentLoaded", () => {
    $("#startBtn").addEventListener("click", startGame);
    $("#missionCloseBtn").addEventListener("click", () => $("#missionPanel").classList.add("hidden"));
    $("#quizCloseBtn").addEventListener("click", () => $("#quizModal").classList.remove("visible"));
    $("#dialogBtn").addEventListener("click", closeDialog);

    document.addEventListener("keydown", (event) => {
        if (isModalOpen()) return;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
            game.keys.add(event.key.toLowerCase());
            event.preventDefault();
        }
        if (event.key.toLowerCase() === "e") {
            interactNearby();
        }
    });

    document.addEventListener("keyup", (event) => {
        game.keys.delete(event.key.toLowerCase());
    });

    setScene("market");
    updateHud();
    requestAnimationFrame(tick);
});

function startGame() {
    game.started = true;
    $("#introModal").classList.remove("visible");
    showMission("재료 미션", "재료를 사려면 과학 문제를 풀어야 해! 재료 가까이 가서 E를 누르자.");
    setStory("마트에서 버터, 강력분, 초코칩, 계란을 찾아야 한다.");
}

function tick() {
    if (game.started && !isModalOpen()) {
        movePlayer();
        updateNearby();
    }
    requestAnimationFrame(tick);
}

function movePlayer() {
    let dx = 0;
    let dy = 0;
    if (game.keys.has("arrowleft") || game.keys.has("a")) dx -= 1;
    if (game.keys.has("arrowright") || game.keys.has("d")) dx += 1;
    if (game.keys.has("arrowup") || game.keys.has("w")) dy -= 1;
    if (game.keys.has("arrowdown") || game.keys.has("s")) dy += 1;

    if (dx === 0 && dy === 0) return;

    const speed = 0.42;
    game.player.x = clamp(game.player.x + dx * speed, 7, 93);
    game.player.y = clamp(game.player.y + dy * speed, 24, 90);
    renderPlayer();
}

function renderPlayer() {
    const player = $("#player");
    player.style.setProperty("--x", `${game.player.x}%`);
    player.style.setProperty("--y", `${game.player.y}%`);
}

function setScene(sceneName) {
    game.scene = sceneName;
    const scene = scenes[sceneName];
    const world = $("#world");
    world.className = `world ${scene.className}`;
    $("#worldLabel").textContent = scene.label;
    game.player = { ...scene.start };
    renderPlayer();
    renderInteractions();
    updateHud();
}

function renderInteractions() {
    const container = $("#interactions");
    container.innerHTML = "";

    if (game.scene === "market") {
        game.currentThings = marketItems.map((item) => ({
            ...item,
            done: game.acquired.has(item.id)
        }));
    } else if (game.scene === "shop") {
        game.currentThings = getShopThings();
    } else {
        game.currentThings = kitchenStations;
    }

    game.currentThings.forEach((thing) => {
        const button = document.createElement("button");
        button.className = `thing ${thing.type || ""} ${thing.done ? "done" : ""}`;
        button.style.left = `${thing.x}%`;
        button.style.top = `${thing.y}%`;
        button.dataset.id = thing.id;
        button.innerHTML = `<span class="icon">${thing.icon}</span><span class="name">${thing.label}</span>`;
        button.addEventListener("click", () => interactThing(thing));
        container.appendChild(button);
    });
}

function getShopThings() {
    if (game.shopPhase === "group") return [groupCustomer];
    return [shopCustomer];
}

function updateNearby() {
    const near = game.currentThings.find((thing) => distance(game.player, thing) < 10);
    game.nearby = near || null;
    $$(".thing").forEach((node) => {
        node.classList.toggle("near", near && node.dataset.id === near.id);
    });

    const prompt = $("#prompt");
    if (near) {
        prompt.textContent = `E ${near.label} 상호작용`;
        prompt.classList.remove("hidden");
    } else {
        prompt.classList.add("hidden");
    }
}

function interactNearby() {
    if (!game.nearby) return;
    interactThing(game.nearby);
}

function interactThing(thing) {
    if (isTooFar(thing)) {
        showMission("조금 더 가까이", "재료나 손님 가까이 다가가야 상호작용할 수 있어.");
        return;
    }

    if (game.scene === "market") {
        handleMarketIngredient(thing);
    } else if (game.scene === "shop") {
        handleShopCustomer(thing);
    } else {
        handleKitchenStation(thing);
    }
}

function isTooFar(thing) {
    return distance(game.player, thing) >= 10;
}

function handleMarketIngredient(thing) {
    if (game.acquired.has(thing.id)) {
        showMission("이미 담은 재료", `${thing.label}은 이미 샀어.`);
        return;
    }

    if (!game.marketQuizSolved) {
        openQuiz(scienceQuizzes.litmusSort, () => {
            game.marketQuizSolved = true;
            acquireIngredient(thing);
        });
        return;
    }

    acquireIngredient(thing);
}

function acquireIngredient(thing) {
    game.acquired.add(thing.id);
    const noteItem = document.querySelector(`[data-need="${thing.id}"]`);
    if (noteItem) noteItem.classList.add("done");
    renderInteractions();
    showMission("재료 획득", `${thing.label}을/를 장바구니에 담았다.`);

    if (game.acquired.size === marketItems.length) {
        setStory("문제를 맞히고 재료를 모두 샀다. 자동으로 가게로 돌아간다!");
        showMission("재료 구매 완료", "좋아! 이제 가게로 자동 이동한다.");
        setTimeout(() => {
            setScene("shop");
            setStory("재료를 모두 샀다. 첫 손님이 가게에 들어왔다.");
            $("#shoppingNote").classList.add("hidden");
            $("#orderText").textContent = "첫 손님: 초코칩 쿠키 5개 주세요!";
            showMission("첫 손님", "첫 손님을 실망시키지 않도록 주문을 받아 초코칩 쿠키 5개를 만들자.");
        }, 900);
    }
}

function handleShopCustomer(thing) {
    if (thing.id === "firstCustomer") {
        showDialog("첫 손님", "손님: 초코칩 쿠키 5개 주세요!", () => {
            startKitchen("first");
        });
    } else {
        openQuiz(scienceQuizzes.cabbageBaseColor, () => {
            $("#orderText").textContent = "단체 손님: 마카롱 5개, 쿠키 2개, 에그타르트 4개 주세요!";
            showDialog("단체 손님 등장", "이런? 단체 손님이 왔다! 일단 늘 하던 대로 쿠키 2개부터 만들자.", () => {
                startKitchen("groupCookie");
            });
        });
    }
}

function startKitchen(mode) {
    game.kitchenMode = mode;
    game.kitchenStepIndex = 0;
    setScene("kitchen");
    if (mode === "first") {
        $("#orderText").textContent = "초코칩 쿠키 5개 제작 중";
        showMission("쿠키 만들기", "주방 기구 가까이 가서 E를 누르자. 레시피 순서대로 진행해야 해.");
        setStory("초코칩 쿠키 5개를 만들 준비를 한다.");
    } else {
        $("#orderText").textContent = "단체 손님용 쿠키 2개 제작 중";
        showMission("쿠키 2개 만들기", "단체 손님 주문 중 쿠키 2개부터 빠르게 만들자.");
        setStory("버터를 실온에 미리 보관해서 더 빨리 만들 수 있을 것 같다.");
    }
}

function handleKitchenStation(thing) {
    const steps = getCurrentKitchenSteps();
    const step = steps[game.kitchenStepIndex];
    if (!step) return;

    if (thing.id !== step.station) {
        showMission("순서 확인", "지금은 다른 도구를 사용할 차례야. 레시피 흐름을 생각해 보자.");
        return;
    }

    const complete = () => completeKitchenStep(step);
    if (step.quiz) {
        openQuiz(scienceQuizzes[step.quiz], complete);
    } else {
        complete();
    }
}

function completeKitchenStep(step) {
    game.kitchenStepIndex += 1;
    setStory(step.text);
    showMission("제작 진행", step.text);

    const steps = getCurrentKitchenSteps();
    if (game.kitchenStepIndex < steps.length) return;

    if (game.kitchenMode === "first") {
        openQuiz(scienceQuizzes.redCabbageAcid, () => {
            game.reputation += 1;
            updateHud();
            showDialog("첫 손님 만족", "다행히 잘 만들었다! 예쁘게 포장한 쿠키를 받은 손님이 만족했다.", () => {
                game.shopPhase = "group";
                setScene("shop");
                setStory("첫 손님을 잘 보냈더니 곧바로 단체 손님이 들어왔다.");
                showMission("단체 손님", "단체 손님에게 다가가 주문을 확인하자.");
            });
        });
    } else {
        showDialog("쿠키 2개 완성", "휴, 다행히 쿠키 2개를 무사히 만들었다. 이제 마카롱을 준비해 보자!", () => {
            setStory("마카롱은 계란 흰자와 노른자를 분리하고, 흰자로 머랭을 치며 설탕을 3번 나누어 넣는다.");
            showMission("다음 준비", "이번 버전은 단체 손님 쿠키까지 완료! 다음은 마카롱 제작을 이어서 만들 수 있다.");
        });
    }
}

function getCurrentKitchenSteps() {
    return game.kitchenMode === "groupCookie" ? groupCookieSteps : firstCookieSteps;
}

function openQuiz(quiz, onCorrect) {
    game.quizLocked = false;
    $("#quizBadge").textContent = quiz.badge;
    $("#quizTitle").textContent = quiz.title;
    $("#quizQuestion").textContent = quiz.question;
    $("#quizFeedback").textContent = "";
    $("#quizFeedback").className = "feedback";
    $("#quizBody").innerHTML = "";
    $("#quizModal").classList.add("visible");

    if (quiz.type === "choice") renderChoiceQuiz(quiz, onCorrect);
    if (quiz.type === "ox") renderOxQuiz(quiz, onCorrect);
    if (quiz.type === "text") renderTextQuiz(quiz, onCorrect);
}

function renderChoiceQuiz(quiz, onCorrect) {
    const wrap = document.createElement("div");
    wrap.className = "sort-options";
    quiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "sort-choice";
        button.textContent = option;
        button.addEventListener("click", () => {
            if (index === quiz.answer) {
                passQuiz(quiz, onCorrect);
            } else {
                failQuiz("아깝다! 산성과 염기성 분류를 다시 생각해 보자.");
            }
        });
        wrap.appendChild(button);
    });
    $("#quizBody").appendChild(wrap);
}

function renderOxQuiz(quiz, onCorrect) {
    const wrap = document.createElement("div");
    wrap.className = "quiz-options";
    [
        { label: "O", value: true },
        { label: "X", value: false }
    ].forEach((option) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.textContent = option.label;
        button.addEventListener("click", () => {
            if (option.value === quiz.answer) {
                passQuiz(quiz, onCorrect);
            } else {
                failQuiz("틀렸어. 다시 풀어야 다음으로 갈 수 있어.");
            }
        });
        wrap.appendChild(button);
    });
    $("#quizBody").appendChild(wrap);
}

function renderTextQuiz(quiz, onCorrect) {
    const row = document.createElement("div");
    row.className = "text-answer-row";
    row.innerHTML = `<input id="textAnswerInput" type="text" placeholder="정답을 입력하세요"><button class="main-btn">확인</button>`;
    row.querySelector("button").addEventListener("click", () => {
        const answer = row.querySelector("input").value.trim();
        const ok = quiz.keywords.some((keyword) => answer.includes(keyword));
        if (ok) {
            passQuiz(quiz, onCorrect);
        } else {
            failQuiz("핵심 단어가 빠졌어. 정답을 다시 써 보자.");
        }
    });
    row.querySelector("input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") row.querySelector("button").click();
    });
    $("#quizBody").appendChild(row);
    row.querySelector("input").focus();
}

function passQuiz(quiz, onCorrect) {
    if (game.quizLocked) return;
    game.quizLocked = true;
    $("#quizFeedback").textContent = quiz.good;
    $("#quizFeedback").className = "feedback good";
    game.quizSolvedCount += 1;
    updateHud();
    setTimeout(() => {
        $("#quizModal").classList.remove("visible");
        if (onCorrect) onCorrect();
    }, 700);
}

function failQuiz(message) {
    $("#quizFeedback").textContent = message;
    $("#quizFeedback").className = "feedback bad";
}

function showMission(title, text) {
    $("#missionTitle").textContent = title;
    $("#missionText").textContent = text;
    $("#missionPanel").classList.remove("hidden");
}

function showDialog(title, text, onClose) {
    $("#dialogTitle").textContent = title;
    $("#dialogText").textContent = text;
    $("#dialogModal").classList.add("visible");
    game.dialogCallback = onClose;
}

function closeDialog() {
    $("#dialogModal").classList.remove("visible");
    const callback = game.dialogCallback;
    game.dialogCallback = null;
    if (callback) callback();
}

function updateHud() {
    $("#placeText").textContent = scenes[game.scene].place;
    $("#quizCountText").textContent = game.quizSolvedCount;
    $("#repText").textContent = game.reputation;
}

function setStory(text) {
    $("#storyText").textContent = text;
}

function isModalOpen() {
    return $$(".modal").some((modal) => modal.classList.contains("visible"));
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
