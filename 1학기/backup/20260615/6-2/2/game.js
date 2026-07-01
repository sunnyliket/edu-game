const state = {
    money: 0,
    reputation: 0,
    cleaned: 0,
    totalMess: 8,
    acquired: new Set(),
    currentQuiz: null,
    cookingIndex: 0
};

const ingredientQuizzes = {
    butter: {
        title: "버터 문제",
        question: "쿠키 반죽을 시작할 때 버터는 어떤 상태가 좋을까요?",
        options: ["냉동실에서 막 꺼낸 딱딱한 상태", "실온에 둔 말랑하고 꾸덕한 상태", "완전히 물처럼 녹은 상태"],
        answer: 1,
        good: "맞아요! 실온에 둔 말랑한 버터가 섞기 좋아요."
    },
    flour: {
        title: "박력분 문제",
        question: "바삭하고 부드러운 쿠키를 만들 때 가장 알맞은 밀가루는 무엇일까요?",
        options: ["강력분", "박력분", "찹쌀가루"],
        answer: 1,
        good: "정답! 쿠키에는 박력분을 쓰는 것이 좋아요."
    },
    choco: {
        title: "초코칩 문제",
        question: "초코칩은 반죽 과정 중 언제 넣는 것이 알맞을까요?",
        options: ["박력분을 넣고 반죽이 만들어진 뒤", "버터를 꺼내기 전", "오븐에서 다 구운 뒤에만"],
        answer: 0,
        good: "좋아요! 반죽이 어느 정도 만들어진 뒤 초코칩을 섞어요."
    },
    egg: {
        title: "계란 문제",
        question: "버터를 으깬 뒤 계란을 넣으면 어떤 모양으로 저어 섞나요?",
        options: ["동그라미로만 빠르게 젓기", "11자 모양으로 젓기", "젓지 않고 바로 굽기"],
        answer: 1,
        good: "정답! 계란을 넣고 11자로 저어 섞어요."
    }
};

const cookingOrder = ["butter", "mash", "egg", "stir", "sugar", "flour", "choco", "tray", "bake"];

const missions = {
    intro: ["첫 미션", "가게가 너무 지저분하다. 가게를 청소하자!"],
    market: ["재료 미션", "재료를 사려면 문제를 풀어야 해! 재료를 클릭해서 문제를 맞혀 보자."],
    customer: ["첫 손님", "첫 손님을 실망시키지 않도록 초코칩 쿠키 5개를 만들자!"],
    cooking: ["쿠키 만들기", "레시피 순서대로 도구와 재료를 클릭해 초코칩 쿠키 5개를 완성하자."]
};

const messItems = [
    { icon: "🧹", label: "먼지", x: 20, y: 68 },
    { icon: "🗞️", label: "신문지", x: 44, y: 70 },
    { icon: "🧃", label: "빈 컵", x: 70, y: 64 },
    { icon: "🧻", label: "휴지", x: 30, y: 47 },
    { icon: "📦", label: "상자", x: 62, y: 47 },
    { icon: "🕸️", label: "거미줄", x: 15, y: 28 },
    { icon: "🧽", label: "얼룩", x: 51, y: 30 },
    { icon: "🍂", label: "낙엽", x: 81, y: 74 }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
    $("#startBtn").addEventListener("click", startGame);
    $("#missionCloseBtn").addEventListener("click", () => $("#missionPanel").classList.add("hidden"));
    $("#goMarketBtn").addEventListener("click", enterMarket);
    $("#quizCloseBtn").addEventListener("click", closeQuiz);
    $("#serveBtn").addEventListener("click", serveCookies);
    $("#restartBtn").addEventListener("click", restartGame);

    $$(".ingredient-card").forEach((card) => {
        card.addEventListener("click", () => tryIngredient(card.dataset.ingredient));
    });

    $$(".tool-btn").forEach((button) => {
        button.addEventListener("click", () => useCookingAction(button.dataset.action, button));
    });

    setupMess();
    updateStats();
});

function startGame() {
    $("#introModal").classList.remove("visible");
    showMission(...missions.intro);
    setPhase("가게가 너무 지저분하다. 먼저 청소부터 해야 한다.");
}

function setupMess() {
    const layer = $("#messLayer");
    layer.innerHTML = "";

    messItems.forEach((item, index) => {
        const button = document.createElement("button");
        button.className = "mess";
        button.style.left = `${item.x}%`;
        button.style.top = `${item.y}%`;
        button.dataset.index = index;
        button.title = `${item.label} 치우기`;
        button.textContent = item.icon;
        button.addEventListener("click", () => cleanMess(button));
        layer.appendChild(button);
    });
}

function cleanMess(button) {
    if (button.classList.contains("cleaned")) return;
    button.classList.add("cleaned");
    state.cleaned += 1;
    setPhase(`청소 중... ${state.cleaned}/${state.totalMess}개를 치웠다.`);

    if (state.cleaned >= state.totalMess) {
        state.money += 10;
        updateStats();
        showMission("청소 완료", "가게가 깨끗해졌다! 이제 마트에 가서 쿠키 재료를 사자.");
        setPhase("가게 청소 완료! 재료를 사러 마트로 가자.");
        $("#goMarketBtn").classList.remove("hidden");
    }
}

function enterMarket() {
    switchScene("marketScene");
    showMission(...missions.market);
    setPhase("마트에 도착했다. 왼쪽 종이에 적힌 재료를 모두 찾자.");
}

function tryIngredient(ingredient) {
    if (state.acquired.has(ingredient)) {
        showMission("이미 샀어요", "이 재료는 이미 장바구니에 담았습니다.");
        return;
    }
    openQuiz(ingredient);
}

function openQuiz(ingredient) {
    const quiz = ingredientQuizzes[ingredient];
    state.currentQuiz = ingredient;
    $("#quizTitle").textContent = quiz.title;
    $("#quizQuestion").textContent = quiz.question;
    $("#quizFeedback").textContent = "";
    $("#quizFeedback").className = "feedback";

    const options = $("#quizOptions");
    options.innerHTML = "";
    quiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => answerQuiz(index));
        options.appendChild(button);
    });

    $("#quizModal").classList.add("visible");
}

function answerQuiz(index) {
    const ingredient = state.currentQuiz;
    const quiz = ingredientQuizzes[ingredient];
    const feedback = $("#quizFeedback");

    if (index !== quiz.answer) {
        feedback.textContent = "아깝다! 재료를 사려면 다시 맞혀야 해.";
        feedback.className = "feedback bad";
        return;
    }

    feedback.textContent = quiz.good;
    feedback.className = "feedback good";
    state.acquired.add(ingredient);
    document.querySelector(`.ingredient-card[data-ingredient="${ingredient}"]`).classList.add("acquired");
    document.querySelector(`#shoppingList li[data-ingredient="${ingredient}"]`).classList.add("done");
    state.money += 5;
    updateStats();

    setTimeout(() => {
        closeQuiz();
        if (state.acquired.size === Object.keys(ingredientQuizzes).length) {
            returnToShopWithCustomer();
        }
    }, 650);
}

function closeQuiz() {
    $("#quizModal").classList.remove("visible");
    state.currentQuiz = null;
}

function returnToShopWithCustomer() {
    switchScene("shopScene");
    $("#goMarketBtn").classList.add("hidden");
    showMission("재료 구매 완료", "문제를 모두 맞혀 재료를 샀다! 가게로 자동으로 돌아왔다.");
    setPhase("재료를 모두 샀다. 첫 손님이 들어오고 있다!");

    setTimeout(() => {
        showMission(...missions.customer);
        setPhase("첫 손님 주문: 초코칩 쿠키 5개");
    }, 900);

    setTimeout(() => {
        switchScene("kitchenScene");
        showMission(...missions.cooking);
        setPhase("초코칩 쿠키 5개 만들기 시작!");
        highlightCurrentStep();
    }, 1900);
}

function useCookingAction(action, button) {
    const expected = cookingOrder[state.cookingIndex];
    if (action !== expected) {
        button.classList.remove("wrong");
        void button.offsetWidth;
        button.classList.add("wrong");
        showMission("순서 확인", "레시피 순서대로 눌러야 해! 오른쪽 레시피를 다시 보자.");
        return;
    }

    button.classList.add("used");
    completeStep(action);
    state.cookingIndex += 1;
    highlightCurrentStep();

    if (state.cookingIndex >= cookingOrder.length) {
        $("#serveBtn").classList.remove("hidden");
        showMission("쿠키 완성", "초코칩 쿠키 5개가 완성됐다! 손님에게 전달하자.");
        setPhase("오븐에서 따끈한 쿠키가 나왔다.");
    }
}

function completeStep(action) {
    const label = $("#bowlLabel");
    const messages = {
        butter: "말랑한 버터",
        mash: "꾸덕한 버터",
        egg: "계란을 넣은 반죽",
        stir: "11자로 섞은 반죽",
        sugar: "설탕 알갱이가 사라지는 중",
        flour: "박력분을 체 쳐 넣은 반죽",
        choco: "초코칩 반죽",
        tray: "오븐 판에 반죽 5개",
        bake: "노릇한 초코칩 쿠키 5개"
    };
    label.textContent = messages[action];

    const step = document.querySelector(`#recipeSteps li[data-step="${action}"]`);
    if (step) step.classList.add("done");

    if (action === "tray") {
        const tray = $("#ovenTray");
        tray.innerHTML = "";
        for (let i = 0; i < 5; i += 1) {
            const cookie = document.createElement("span");
            cookie.className = "cookie-dot";
            tray.appendChild(cookie);
        }
    }

    if (action === "bake") {
        $$(".cookie-dot").forEach((cookie) => cookie.style.backgroundColor = "#c47a39");
    }
}

function highlightCurrentStep() {
    $$("#recipeSteps li").forEach((li) => li.style.background = "");
    const nextAction = cookingOrder[state.cookingIndex];
    const current = document.querySelector(`#recipeSteps li[data-step="${nextAction}"]`);
    if (current) current.style.background = "#fff1bd";
}

function serveCookies() {
    state.money += 100;
    state.reputation += 1;
    updateStats();
    switchScene("completeScene");
    $("#missionPanel").classList.add("hidden");
    setPhase("초코칩 쿠키 5개 판매 성공!");
}

function restartGame() {
    state.money = 0;
    state.reputation = 0;
    state.cleaned = 0;
    state.acquired = new Set();
    state.currentQuiz = null;
    state.cookingIndex = 0;
    setupMess();
    updateStats();
    $$("#shoppingList li").forEach((li) => li.classList.remove("done"));
    $$(".ingredient-card").forEach((card) => card.classList.remove("acquired"));
    $$(".tool-btn").forEach((button) => button.classList.remove("used", "wrong"));
    $$("#recipeSteps li").forEach((li) => {
        li.classList.remove("done");
        li.style.background = "";
    });
    $("#ovenTray").innerHTML = "";
    $("#bowlLabel").textContent = "믹싱볼";
    $("#goMarketBtn").classList.add("hidden");
    $("#serveBtn").classList.add("hidden");
    switchScene("shopScene");
    $("#introModal").classList.add("visible");
    $("#missionPanel").classList.add("hidden");
    setPhase("돈을 벌기 위해 작은 디저트 가게를 차리게 되었다.");
}

function switchScene(sceneId) {
    $$(".scene").forEach((scene) => scene.classList.remove("active"));
    $(`#${sceneId}`).classList.add("active");
}

function showMission(title, text) {
    $("#missionTitle").textContent = title;
    $("#missionText").textContent = text;
    $("#missionPanel").classList.remove("hidden");
}

function setPhase(text) {
    $("#phaseText").textContent = text;
}

function updateStats() {
    $("#moneyText").textContent = state.money.toLocaleString("ko-KR");
    $("#repText").textContent = state.reputation;
}
