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
    viewMode: "third",
    intro: null,
    currentThings: []
};

const introScenarios = [
    {
        hud: "새로운 디저트 가게의 첫날. 오늘은 꼭 첫 손님을 만족시켜야 한다.",
        line1: "나는 오키 디저트 가게의 문을 처음 열었다.",
        line2: "첫 주문을 준비하려면 마트에서 쿠키 재료를 사 와야 한다.",
        start: "새 가게의 첫날이다. 내가 마트에서 버터, 박력분, 초코칩, 계란을 찾아야겠다."
    },
    {
        hud: "비 오는 아침, 손님을 기다리며 따뜻한 쿠키를 준비하기로 했다.",
        line1: "비가 오는 날에도 가게 불은 환하게 켜져 있다.",
        line2: "손님이 오기 전에 초코칩 쿠키 재료부터 사 오자.",
        start: "비 오는 아침이다. 내가 따뜻한 쿠키를 만들 재료를 사러 마트에 왔다."
    },
    {
        hud: "동네에 작은 디저트 가게가 생겼다는 소문이 퍼지기 시작했다.",
        line1: "동네 사람들이 새 디저트 가게를 궁금해하고 있다.",
        line2: "첫인상을 좋게 남기려면 좋은 재료부터 준비해야 한다.",
        start: "동네 손님들을 위해 내가 좋은 재료부터 골라야겠다."
    },
    {
        hud: "돈을 벌기 위해 시작한 가게지만, 이제는 맛있는 디저트를 만들고 싶다.",
        line1: "나는 돈을 벌기 위해 가게를 차렸지만, 맛도 놓치고 싶지 않다.",
        line2: "초코칩 쿠키 재료를 사면서 과학 문제도 풀어 보자.",
        start: "내 가게의 첫 디저트를 위해 내가 재료를 하나씩 찾아야겠다."
    }
];

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
    { id: "butter", label: "버터", x: 23, y: 50 },
    { id: "flour", label: "박력분", x: 44, y: 38 },
    { id: "choco", label: "초코칩", x: 66, y: 48 },
    { id: "egg", label: "계란", x: 80, y: 68 }
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
    x: 62,
    y: 52,
    type: "customer"
};

const groupCustomer = {
    id: "groupCustomer",
    label: "단체 손님",
    x: 62,
    y: 52,
    type: "customer"
};

const shopFixtures = [
    { id: "customerTable", label: "손님 탁자", x: 54, y: 66, type: "fixture" },
    { id: "kiosk", label: "키오스크", x: 78, y: 54, type: "fixture" },
    { id: "counter", label: "계산대", x: 34, y: 58, type: "fixture" },
    { id: "displayShelf", label: "진열장", x: 43, y: 34, type: "fixture" },
    { id: "sofa", label: "대기 소파", x: 20, y: 70, type: "fixture" },
    { id: "plantPot", label: "화분", x: 18, y: 42, type: "fixture" },
    { id: "rug", label: "러그", x: 50, y: 80, type: "fixture" }
];

const kitchenStations = [
    { id: "bowl", label: "믹싱볼", x: 25, y: 56, type: "station" },
    { id: "sieve", label: "체", x: 44, y: 42, type: "station" },
    { id: "tray", label: "오븐 판", x: 63, y: 58, type: "station" },
    { id: "oven", label: "오븐", x: 78, y: 39, type: "station" },
    { id: "package", label: "포장대", x: 80, y: 72, type: "station" }
];

const firstCookieSteps = [
    { station: "bowl", text: "내가 믹싱볼에 실온에 둔 버터를 넣었다." },
    { station: "bowl", text: "내가 실리콘 주걱으로 버터를 으깼다.", quiz: "lemonAcid" },
    { station: "bowl", text: "내가 계란을 넣었다." },
    { station: "bowl", text: "내가 계란을 넣고 11자로 저었다.", quiz: "baseBleach" },
    { station: "bowl", text: "내가 설탕을 넣고 알갱이가 사라질 때까지 섞었다." },
    { station: "sieve", text: "내가 박력분을 체 쳐서 넣었다.", quiz: "cabbageAcid" },
    { station: "bowl", text: "내가 초코칩을 넣었다.", quiz: "phenolphthaleinBase" },
    { station: "tray", text: "내가 오븐 판에 동그란 반죽 5개를 놓았다." },
    { station: "oven", text: "내가 오븐에서 쿠키를 노릇하게 익혔다." },
    { station: "package", text: "내가 초코칩 쿠키 5개를 예쁘게 포장했다." }
];

const groupCookieSteps = [
    { station: "bowl", text: "내가 단체 손님용 쿠키 반죽을 빠르게 시작했다." },
    { station: "bowl", text: "내가 버터를 실온에 미리 둬서 더 빨리 으깼다." },
    { station: "bowl", text: "내가 계란을 넣고 11자로 저었다." },
    { station: "sieve", text: "내가 설탕을 섞고 박력분을 체 쳐 넣었다." },
    { station: "bowl", text: "내가 초코칩을 넣어 쿠키 반죽을 완성했다." },
    { station: "tray", text: "내가 오븐 판에 쿠키 반죽 2개를 놓았다." },
    { station: "oven", text: "내가 쿠키 2개를 무사히 구웠다.", quiz: "acidificationDamage" }
];

const cookingQuizSequence = [
    "lemonAcid",
    "baseBleach",
    "cabbageAcid",
    "phenolphthaleinBase",
    "redCabbageAcid",
    "cabbageBaseColor",
    "acidificationDamage"
];

document.addEventListener("DOMContentLoaded", () => {
    setRandomIntro();
    $("#startBtn").addEventListener("click", startGame);
    $("#missionCloseBtn").addEventListener("click", () => $("#missionPanel").classList.add("hidden"));
    $("#quizCloseBtn").addEventListener("click", () => $("#quizModal").classList.remove("visible"));
    $("#dialogBtn").addEventListener("click", closeDialog);

    document.addEventListener("keydown", (event) => {
        if (isModalOpen()) return;
        if (event.key.toLowerCase() === "q") {
            toggleViewMode();
            event.preventDefault();
            return;
        }
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
    setStory(game.intro ? game.intro.start : "내가 마트에서 버터, 박력분, 초코칩, 계란을 찾아야겠다.");
}

function setRandomIntro() {
    game.intro = introScenarios[Math.floor(Math.random() * introScenarios.length)];
    $("#storyText").textContent = game.intro.hud;
    $("#introLine1").textContent = game.intro.line1;
    $("#introLine2").textContent = game.intro.line2;
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
    world.className = `world ${scene.className} ${game.viewMode === "first" ? "first-person-view" : "third-person-view"}`;
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
        button.innerHTML = `<span class="icon"></span><span class="name">${thing.label}</span>`;
        button.addEventListener("click", () => interactThing(thing));
        container.appendChild(button);
    });
}

function getShopThings() {
    const customer = game.shopPhase === "group" ? groupCustomer : shopCustomer;
    return [customer, ...shopFixtures];
}

function updateNearby() {
    const near = game.currentThings.find((thing) => distance(game.player, thing) < getInteractionRange(thing));
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

function getInteractionRange(thing) {
    if (thing.id === "kiosk" || thing.id === "customerTable") return 15;
    if (thing.type === "fixture") return 12;
    return 10;
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
        if (thing.type === "fixture") {
            handleShopFixture(thing);
            return;
        }
        handleShopCustomer(thing);
    } else {
        handleKitchenStation(thing);
    }
}

function handleShopFixture(thing) {
    if (thing.id === "kiosk") {
        showDialog("키오스크", "키오스크 화면에 오늘의 주문이 떠 있다. 손님이 직접 메뉴를 보고 주문할 수 있도록 준비됐다.", () => {
            $("#orderText").textContent = game.shopPhase === "group"
                ? "키오스크 주문: 마카롱 5개, 쿠키 2개, 에그타르트 4개"
                : "키오스크 주문: 초코칩 쿠키 5개";
            showMission("키오스크 확인", "주문이 접수됐다. 이제 손님에게 가거나 주방에서 만들 준비를 하자.");
        });
        return;
    }

    if (thing.id === "customerTable") {
        showDialog("손님 탁자", "손님을 받을 수 있는 탁자를 정리했다. 의자와 메뉴판을 맞춰 두었고, 손님이 앉으면 바로 주문을 받을 수 있다.", () => {
            showMission("손님 받을 준비 완료", "탁자가 준비됐다. 손님에게 다가가 주문을 확인하자.");
        });
        return;
    }

    const messages = {
        customerTable: ["손님 탁자", "손님이 앉아 주문을 기다릴 수 있는 탁자다. 첫 손님을 여기로 안내할 수 있다."],
        kiosk: ["키오스크", "가게 안 키오스크다. 손님이 직접 메뉴를 보고 주문할 수 있게 설치했다."],
        counter: ["계산대", "포장과 결제를 처리하는 계산대다. 가게의 중심이 되는 공간이다."],
        displayShelf: ["진열장", "완성된 쿠키와 디저트를 예쁘게 진열할 수 있는 장식장이다."],
        sofa: ["대기 소파", "손님이 편하게 기다릴 수 있는 일상 가구다."],
        plantPot: ["화분", "가게 분위기를 살려 주는 초록 화분이다."],
        rug: ["러그", "가게 바닥을 더 따뜻하고 현실적인 분위기로 만들어 주는 러그다."]
    };
    const [title, text] = messages[thing.id] || ["가구", `${thing.label}을/를 확인했다.`];
    showMission(title, text);
}

function isTooFar(thing) {
    return distance(game.player, thing) >= getInteractionRange(thing);
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
        setStory("내가 문제를 맞히고 재료를 모두 샀다. 자동으로 내 가게로 돌아간다!");
        showMission("재료 구매 완료", "좋아! 이제 내 가게로 자동 이동한다.");
        setTimeout(() => {
            setScene("shop");
            setStory("내가 재료를 모두 샀다. 첫 손님이 내 가게에 들어왔다.");
            $("#shoppingNote").classList.add("hidden");
            $("#orderText").textContent = "첫 손님: 초코칩 쿠키 5개 주세요!";
            showMission("첫 손님", "첫 손님을 실망시키지 않도록 주문을 받아 초코칩 쿠키 5개를 만들어야겠다.");
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
        setStory("내가 초코칩 쿠키 5개를 만들 준비를 해야겠다.");
    } else {
        $("#orderText").textContent = "단체 손님용 쿠키 2개 제작 중";
        showMission("쿠키 2개 만들기", "단체 손님 주문 중 쿠키 2개부터 빠르게 만들자.");
        setStory("내가 버터를 실온에 미리 보관해 두었으니 더 빨리 만들 수 있을 것 같다.");
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
    const quizKey = step.quiz || cookingQuizSequence[game.kitchenStepIndex % cookingQuizSequence.length];
    openQuiz(scienceQuizzes[quizKey], complete);
}

function completeKitchenStep(step) {
    game.kitchenStepIndex += 1;
    setStory(step.text);
    showMission("제작 진행", step.text);

    const steps = getCurrentKitchenSteps();
    if (game.kitchenStepIndex < steps.length) return;

    if (game.kitchenMode === "first") {
        game.reputation += 1;
        updateHud();
        showDialog("첫 손님 만족", "다행히 내가 잘 만들었다! 예쁘게 포장한 내 쿠키를 받은 손님이 만족했다.", () => {
            game.shopPhase = "group";
            setScene("shop");
            setStory("내가 첫 손님을 잘 대접해 보냈더니 곧바로 단체 손님이 들어왔다.");
            showMission("단체 손님", "단체 손님에게 다가가 주문을 확인하자.");
        });
    } else {
        showDialog("쿠키 2개 완성", "휴, 다행히 내가 쿠키 2개를 무사히 만들었다. 이제 마카롱을 준비해 보자!", () => {
            setStory("마카롱은 내가 계란 흰자와 노른자를 분리하고, 흰자로 머랭을 치며 설탕을 3번 나누어 넣어야 한다.");
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
    $("#viewModeText").textContent = game.viewMode === "first" ? "1인칭" : "3인칭";
}

function toggleViewMode() {
    game.viewMode = game.viewMode === "first" ? "third" : "first";
    applyViewMode();
    updateHud();
    showMission("시점 전환", `${game.viewMode === "first" ? "1인칭" : "3인칭"} 시점으로 바꿨다.`);
}

function applyViewMode() {
    const world = $("#world");
    world.classList.toggle("first-person-view", game.viewMode === "first");
    world.classList.toggle("third-person-view", game.viewMode === "third");
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
