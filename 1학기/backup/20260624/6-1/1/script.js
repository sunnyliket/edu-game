const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const progressText = document.getElementById("progressText");
const missionText = document.getElementById("missionText");
const unitProgress = document.getElementById("unitProgress");
const promptBox = document.getElementById("prompt");
const promptText = document.getElementById("promptText");
const promptButton = document.getElementById("promptButton");
const starLayer = document.getElementById("starLayer");
const toastStack = document.getElementById("toastStack");
const startModal = document.getElementById("startModal");
const startButton = document.getElementById("startButton");
const quizModal = document.getElementById("quizModal");
const closeQuiz = document.getElementById("closeQuiz");
const quizUnit = document.getElementById("quizUnit");
const quizTitle = document.getElementById("quizTitle");
const questionText = document.getElementById("questionText");
const choicesBox = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const characterModal = document.getElementById("characterModal");
const closeCharacter = document.getElementById("closeCharacter");
const characterButtons = [...document.querySelectorAll("[data-character]")];
const escapeModal = document.getElementById("escapeModal");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const stick = document.getElementById("stick");
const stickKnob = document.getElementById("stickKnob");
const mobileAction = document.getElementById("mobileAction");

const WORLD = { width: 1180, height: 820 };
const PLAYER_RADIUS = 18;
const TOTAL_QUESTIONS = 60;
const MAX_DPR = 1.5;

const units = [
  {
    id: "acid",
    name: "산과 염기",
    color: "#ef4444",
    station: "시약대",
    description: "리트머스 종이와 지시약이 놓인 시약대를 조사하세요.",
    questions: [
      q("우리 주변의 액체 중에서 새콤한 '신맛'이 나는 산성 액체는 무엇인가요?", ["비눗물", "식초", "주방 세제", "유리 세정제"], 1, "식초와 레몬즙처럼 신맛이 나는 액체는 산성인 경우가 많아요."),
      q("우리 주변의 액체 중에서 미끈미끈하고 쓴맛이 나는 '염기성 액체'는 무엇인가요?", ["레몬즙", "오렌지 주스", "사이다", "빨래 비눗물"], 3, "비눗물은 미끈미끈한 느낌이 나는 대표적인 염기성 액체예요."),
      q("어떤 액체가 산성인지 염기성인지 색깔 변화로 알려주는 '신호등' 같은 물질을 무엇이라고 하나요?", ["영양제", "소화제", "지시약", "촉매제"], 2, "지시약은 산성과 염기성을 색깔 변화로 알려 줍니다."),
      q("푸른색 리트머스 종이에 '식초(산성)'를 한 방울 떨어뜨렸을 때 변하는 색깔은 무엇인가요?", ["붉은색", "노란색", "초록색", "보라색"], 0, "산성 용액은 푸른색 리트머스 종이를 붉게 변화시켜요."),
      q("붉은색 리트머스 종이에 '비눗물(염기성)'을 한 방울 떨어뜨렸을 때 변하는 색깔은 무엇인가요?", ["노란색", "푸른색", "하얀색", "검은색"], 1, "염기성 용액은 붉은색 리트머스 종이를 푸르게 변화시켜요."),
      q("마법의 약 같은 '페놀프탈레인 용액'은 염기성 액체를 만나면 어떤 예쁜 색깔로 변하나요?", ["붉은색(진한 분홍색)", "노란색", "초록색", "하늘색"], 0, "페놀프탈레인 용액은 염기성에서 붉은색 계열로 변해요."),
      q("집에서 쉽게 만드는 천연 지시약인 '붉은 양배추 즙'에 산성 액체를 넣으면 어떤 색깔로 변하나요?", ["푸른색", "초록색", "노란색", "붉은색 계열(분홍색)"], 3, "붉은 양배추 지시약은 산성에서 붉은색 계열을 보여요."),
      q("'붉은 양배추 즙'에 염기성 액체를 넣었을 때 나타나는 색깔이 아닌 것은 무엇인가요?", ["푸른색", "초록색", "노란색", "붉은색"], 3, "염기성에서는 푸른색, 초록색, 노란색 계열이 나타나고 붉은색은 산성 쪽이에요."),
      q("묽은 염산(산성)에 달걀껍데기를 넣었을 때 일어나는 재미있는 변화는 무엇인가요?", ["아무런 변화가 없다.", "보글보글 기포가 나면서 달걀껍데기가 녹는다.", "달걀껍데기가 파랗게 변한다.", "달걀껍데기가 돌처럼 단단해진다."], 1, "달걀껍데기의 성분이 산과 반응하면서 기포가 생겨요."),
      q("염기성 액체에 삶은 달걀흰자를 넣고 하루 동안 두었을 때 일어나는 변화는 무엇인가요?", ["달걀흰자가 단단해진다.", "달걀흰자가 녹아서 흐물흐물해진다.", "기포가 펑 터지며 폭발한다.", "노란색으로 변한다."], 1, "염기성 액체는 단백질을 흐물흐물하게 만들 수 있어요."),
      q("산성 액체와 염기성 액체를 서로 섞으면 어떤 일이 일어날까요?", ["두 액체의 성질이 모두 엄청나게 강해진다.", "서로의 성질을 약하게 만들어 중성에 가까워진다.", "섞자마자 바로 얼음으로 얼어버린다.", "아무런 변화도 일어나지 않는다."], 1, "산과 염기가 만나 서로의 성질을 약하게 하는 것을 중화라고 해요."),
      q("다음 중 '산성 용액'의 공통적인 성질로 옳은 것은 무엇인가요?", ["맛을 보면 대부분 쓴맛이 난다.", "손으로 만지면 비누처럼 미끈미끈하다.", "푸른색 리트머스 종이를 붉은색으로 변화시킨다.", "달걀 껍데기를 넣어도 아무런 반응이 일어나지 않는다."], 2, "산성 용액은 푸른색 리트머스 종이를 붉게 바꿉니다."),
      q("생선회에 레몬즙(산성)을 뿌리면 비린내(염기성)가 사라집니다. 이 현상과 관련이 깊은 과학 내용은 무엇인가요?", ["액체의 증발", "산과 염기의 성질 약화(중화)", "기체의 녹는 성질", "물질의 불타기"], 1, "레몬즙의 산성과 비린내 성분이 만나 성질이 약해지는 중화와 관련 있어요."),
      q("음식을 너무 많이 먹어서 위산(산성) 때문에 속이 쓰릴 때 먹는 제산제는 어떤 성질을 가지고 있을까요?", ["강한 산성", "약한 산성", "약한 염기성", "중성"], 2, "제산제는 위산을 약하게 만들기 위해 약한 염기성을 띱니다."),
      q("염기성 액체를 손으로 만졌을 때 공통적으로 느껴지는 독특한 느낌은 무엇인가요?", ["얼음처럼 차가운 느낌", "미끈미끈한 느낌", "끈적끈적한 느낌", "따끔따끔한 느낌"], 1, "비눗물처럼 염기성 액체는 미끈미끈한 느낌이 납니다.")
    ]
  },
  {
    id: "motion",
    name: "물체의 이동",
    color: "#2563eb",
    station: "운동 실험 트랙",
    description: "미니 자동차와 자가 있는 운동 실험 트랙을 조사하세요.",
    questions: [
      q("과학에서 물체가 이동한 거리와 걸린 시간을 함께 말하여 물체의 움직임을 나타내는 것을 무엇이라고 할까요?", ["물체의 크기", "물체의 운동", "물체의 성질", "물체의 무게"], 1, "시간이 지남에 따라 물체의 위치가 변하는 것을 물체의 운동이라고 해요."),
      q("일정한 시간 동안에 물체가 이동한 거리를 비교하여 빠르기를 나타내는 값인 '속력'을 구하는 올바른 방법은 무엇일까요?", ["걸린 시간 × 이동한 거리", "걸린 시간 + 이동한 거리", "이동한 거리 ÷ 걸린 시간", "이동한 거리 - 걸린 시간"], 2, "속력은 이동한 거리를 걸린 시간으로 나누어 구해요."),
      q("다음 중 과학에서 사용하는 속력의 단위가 아닌 것은 무엇일까요?", ["m/s", "km/h", "m/min", "kg/s"], 3, "kg은 질량을 나타내는 단위라 속력 단위로 쓰지 않아요."),
      q("100m 달리기에서 빠르기를 비교한 기준으로 가장 알맞은 것은 무엇일까요?", ["이동한 거리가 같을 때, 걸린 시간이 길수록 빠르다.", "이동한 거리가 같을 때, 걸린 시간이 짧을수록 빠르다.", "걸린 시간이 같을 때, 이동한 거리가 짧을수록 빠르다.", "걸린 시간과 이동한 거리는 빠르기와 상관이 없다."], 1, "같은 거리를 갈 때는 시간이 짧을수록 빠릅니다."),
      q("자동차가 2시간 동안 총 120km를 달렸습니다. 이 자동차의 속력은 얼마일까요?", ["30 km/h", "60 km/h", "120 km/h", "240 km/h"], 1, "120km를 2시간으로 나누면 60 km/h입니다."),
      q("네 명의 친구가 10초 동안 달린 거리를 측정했습니다. 누가 가장 빠를까요?", ["민수: 50m", "영희: 60m", "철수: 70m", "지민: 45m"], 2, "같은 시간 동안 가장 먼 거리를 간 철수가 가장 빨라요."),
      q("걸린 시간과 이동한 거리가 모두 다를 때, 빠르기를 가장 정확하게 비교하는 방법은 무엇일까요?", ["각 기차의 무게를 비교한다.", "각 기차의 길이를 비교한다.", "두 기차의 속력을 각각 계산해서 비교한다.", "출발 신호를 준 사람의 목소리 크기를 비교한다."], 2, "거리와 시간이 모두 다르면 속력을 계산해 같은 기준으로 비교해야 해요."),
      q("일상생활에서 'km/h'라는 속력 단위를 가장 쉽게 찾아볼 수 있는 곳은 어디일까요?", ["자동차의 속도 계기판과 도로 교통 표지판", "마트 과일의 무게 표시판", "교실의 시계와 달력", "약국의 물약 계량컵"], 0, "자동차 속도계와 도로 표지판에서 km/h를 자주 볼 수 있어요."),
      q("다음 중 물체의 위치를 정확하게 나타내기 위해 반드시 필요한 3가지 요소가 바르게 짝지어진 것은 무엇일까요?", ["기준점, 방향, 거리", "기준점, 시간, 무게", "방향, 시간, 속력", "거리, 속력, 무게"], 0, "위치를 말할 때는 기준점, 방향, 거리가 필요해요."),
      q("'교탁을 기준으로 동쪽으로 3미터 거리에 지우가 앉아 있다.'라는 문장에서 기준점은 어디일까요?", ["교탁", "동쪽", "3미터", "지우"], 0, "기준점은 위치를 말할 때 출발 기준이 되는 곳입니다."),
      q("속력의 단위인 '10 m/s'가 의미하는 뜻으로 가장 올바른 것은 무엇일까요?", ["10초 동안 1미터를 이동한다.", "1초 동안 10미터를 이동한다.", "1분 동안 10미터를 이동한다.", "10분 동안 1미터를 이동한다."], 1, "m/s는 1초 동안 몇 미터를 가는지 나타내요."),
      q("치타는 1초에 약 30m, 사람은 1초에 약 8m를 달릴 수 있습니다. 걸린 시간이 같을 때 빠르기를 비교하는 방법으로 옳은 것은 무엇일까요?", ["숫자가 작을수록 빠르다.", "이동한 거리가 길수록 빠르다.", "몸무게가 가벼울수록 빠르다.", "키가 클수록 빠르다."], 1, "같은 시간 동안 더 멀리 이동하면 더 빠른 것입니다."),
      q("자전거를 타고 속력 5 m/s로 10초 동안 앞으로 똑바로 달려갔습니다. 이동한 총 거리는 몇 미터일까요?", ["2m", "5m", "50m", "500m"], 2, "5m씩 10초 동안 가므로 5 × 10 = 50m입니다."),
      q("학교 도로 앞 어린이 보호구역의 제한 속도는 보통 얼마일까요?", ["10 km/h 이하", "30 km/h 이하", "60 km/h 이하", "100 km/h 이하"], 1, "스쿨존 제한 속도는 보통 30 km/h 이하입니다."),
      q("교통사고를 예방하기 위해 속력을 줄이거나 안전을 지키는 장치가 아닌 것은 무엇일까요?", ["과속 방지턱", "과속 단속 카메라", "자동차의 안전벨트", "자동차의 가속 페달"], 3, "가속 페달은 자동차를 더 빠르게 만드는 장치예요.")
    ]
  },
  {
    id: "plant",
    name: "식물의 구조와 기능",
    color: "#16a34a",
    station: "식물 관찰대",
    description: "화분, 현미경, 식물 표본이 놓인 관찰대를 조사하세요.",
    questions: [
      q("식물의 뿌리가 하는 주요 기능이 아닌 것은 무엇입니까?", ["흙 속의 물을 흡수한다.", "식물이 쓰러지지 않게 지탱한다.", "광합성을 통해 스스로 양분을 만든다.", "흡수한 양분을 보관하고 저장하기도 한다."], 2, "광합성은 주로 잎에서 일어납니다."),
      q("뿌리털이 수없이 많이 나 있어서 식물에게 주는 이로운 점으로 가장 올바른 것은 무엇입니까?", ["줄기를 튼튼하게 만든다.", "흙과의 표면적을 넓혀 물을 더 잘 흡수하게 한다.", "해충이 뿌리로 접근하는 것을 막아준다.", "식물이 호흡하는 것을 방해한다."], 1, "뿌리털은 흙과 닿는 면적을 넓혀 물을 잘 흡수하게 해요."),
      q("식물 줄기를 관찰하는 실험에 대한 설명으로 올바르지 않은 것은 무엇입니까?", ["줄기 속에는 물이 이동하는 통로인 물관이 있다.", "붉은색 색소 물에 담가두면 줄기 내부가 붉게 물든다.", "뿌리에서 흡수한 물은 줄기를 거쳐 잎까지 이동한다.", "줄기는 오직 식물의 키를 키우는 기능만 한다."], 3, "줄기는 식물을 지탱하고 물과 양분이 이동하는 통로 역할도 합니다."),
      q("식물의 잎에 도달한 물이 수증기가 되어 기공을 통해 밖으로 빠져나가는 현상을 무엇이라고 합니까?", ["광합성", "증산 작용", "호흡 작용", "소화 작용"], 1, "잎에서 물이 수증기로 빠져나가는 현상을 증산 작용이라고 해요."),
      q("다음 중 식물의 증산 작용이 가장 활발하게 일어나는 조건으로 바르게 짝지어진 것은 무엇입니까?", ["햇빛이 강할 때, 습도가 낮을 때", "햇빛이 약할 때, 습도가 높을 때", "바람이 불지 않을 때, 온도가 낮을 때", "비가 내릴 때, 기온이 낮을 때"], 0, "햇빛이 강하고 공기가 건조하면 증산 작용이 활발해집니다."),
      q("식물이 햇빛을 이용해 스스로 양분을 만드는 작용은 무엇입니까?", ["증산 작용", "광합성", "풍화 작용", "응결"], 1, "광합성은 식물이 햇빛, 물, 이산화탄소를 이용해 양분을 만드는 작용입니다."),
      q("잎의 작은 구멍으로 기체가 드나들고 물이 빠져나가는 곳은 무엇입니까?", ["물관", "체관", "기공", "뿌리털"], 2, "기공은 잎 표면에 있는 작은 구멍입니다."),
      q("잎이 초록색으로 보이는 까닭과 관련 깊은 물질은 무엇입니까?", ["엽록소", "녹말", "석회수", "소금"], 0, "엽록소는 빛을 받아 광합성을 돕고 잎을 초록색으로 보이게 합니다."),
      q("꽃이 하는 중요한 역할로 가장 알맞은 것은 무엇입니까?", ["흙을 단단하게 만든다.", "식물이 번식할 수 있게 씨를 만드는 데 관여한다.", "줄기를 붉게 물들인다.", "뿌리털을 없앤다."], 1, "꽃은 열매와 씨가 만들어지는 데 중요한 역할을 합니다."),
      q("씨가 싹트기 위해 보통 필요한 조건이 아닌 것은 무엇입니까?", ["알맞은 물", "알맞은 온도", "공기", "반드시 아주 강한 바람"], 3, "씨가 싹트려면 물, 알맞은 온도, 공기 등이 필요합니다."),
      q("뿌리에서 흡수한 물이 잎까지 이동할 때 주로 지나가는 통로는 무엇입니까?", ["물관", "체관", "꽃잎", "수술"], 0, "물관은 뿌리에서 흡수한 물이 이동하는 통로입니다."),
      q("잎에서 만든 양분이 식물의 여러 부분으로 이동할 때 주로 지나가는 통로는 무엇입니까?", ["물관", "체관", "기공", "암술"], 1, "체관은 잎에서 만든 양분이 이동하는 통로입니다."),
      q("열매가 식물에게 주는 이로운 점으로 가장 알맞은 것은 무엇입니까?", ["씨를 보호하고 퍼뜨리는 데 도움을 준다.", "잎의 색을 없앤다.", "뿌리가 물을 흡수하지 못하게 한다.", "줄기를 사라지게 한다."], 0, "열매는 씨를 보호하고 동물이나 바람을 통해 퍼지는 데 도움을 줍니다."),
      q("선인장 잎이 가시처럼 변한 까닭으로 가장 알맞은 것은 무엇입니까?", ["물을 더 많이 잃기 위해서", "물의 증발을 줄이고 몸을 보호하기 위해서", "꽃을 피우지 않기 위해서", "뿌리를 움직이기 위해서"], 1, "가시는 물의 증발을 줄이고 식물을 보호하는 데 도움이 됩니다."),
      q("식물도 살아가기 위해 호흡을 합니다. 식물이 호흡할 때 필요한 기체는 무엇입니까?", ["산소", "수소", "헬륨", "네온"], 0, "식물도 살아 있는 생물이므로 호흡할 때 산소를 사용합니다.")
    ]
  },
  {
    id: "earth",
    name: "지구의 운동",
    color: "#7c3aed",
    station: "지구모형",
    description: "동그라미 모형인 지구본을 조사하세요.",
    questions: [
      q("지구가 회전축을 중심으로 하루에 한 바퀴씩 도는 운동을 무엇이라고 할까요?", ["지구의 자전", "지구의 공전", "지구의 이동", "지구의 중력"], 0, "제자리에서 스스로 도는 운동을 자전이라고 해요."),
      q("지구의 자전 방향과 자전하는 데 걸리는 시간이 바르게 짝지어진 것은 무엇일까요?", ["서쪽에서 동쪽 / 1시간", "동쪽에서 서쪽 / 1시간", "서쪽에서 동쪽 / 24시간(하루)", "동쪽에서 서쪽 / 24시간(하루)"], 2, "지구는 서쪽에서 동쪽으로 하루에 한 바퀴 자전합니다."),
      q("지구에서 하루 동안 낮과 밤이 반복해서 생기는 가장 결정적인 원인은 무엇일까요?", ["달이 지구 주위를 돌기 때문에", "지구가 태양 주위를 돌기 때문에", "태양이 스스로 돌고 있기 때문에", "지구가 하루에 한 바퀴씩 자전하기 때문에"], 3, "지구가 자전하면서 태양빛을 받는 쪽과 받지 못하는 쪽이 바뀝니다."),
      q("낮과 밤이 생기는 원인을 알아보는 실험에서 전등과 지구본은 각각 실제 자연에서 무엇을 의미할까요?", ["전등: 달 / 지구본: 태양", "전등: 태양 / 지구본: 지구", "전등: 지구 / 지구본: 태양", "전등: 태양 / 지구본: 달"], 1, "전등은 태양, 지구본은 지구를 나타냅니다."),
      q("태양이나 달이 매일 동쪽에서 떠서 서쪽으로 지는 것처럼 보이는 진짜 이유는 무엇일까요?", ["태양이 실제로 지구 주위를 돌아서", "달이 서쪽에서 동쪽으로 움직여서", "지구가 서쪽에서 동쪽으로 자전해서", "지구가 동쪽에서 서쪽으로 자전해서"], 2, "지구가 서쪽에서 동쪽으로 돌기 때문에 천체는 반대로 움직이는 것처럼 보여요."),
      q("실제로는 지구가 도는 것인데 우리 눈에는 천체가 움직이는 것처럼 보이는 운동을 무엇이라고 할까요?", ["진짜 운동", "겉보기 운동", "반사 운동", "중력 운동"], 1, "우리 눈에 그렇게 보이는 운동을 겉보기 운동이라고 합니다."),
      q("지구가 태양을 중심으로 일 년에 한 바퀴씩 도는 운동을 무엇이라고 할까요?", ["지구의 자전", "지구의 공전", "지구의 회전", "지구의 이동"], 1, "태양 주위를 도는 운동은 공전입니다."),
      q("지구의 공전 방향과 공전하는 데 걸리는 시간이 바르게 짝지어진 것은 무엇일까요?", ["서쪽에서 동쪽 / 1일", "동쪽에서 서쪽 / 1일", "서쪽에서 동쪽 / 1년", "동쪽에서 서쪽 / 1년"], 2, "지구는 서쪽에서 동쪽으로 1년에 한 바퀴 공전합니다."),
      q("계절에 따라 밤하늘에서 볼 수 있는 대표적인 별자리가 달라지는 원인은 무엇일까요?", ["지구가 자전하기 때문에", "지구가 공전하기 때문에", "별자리들이 직접 움직이기 때문에", "달이 지구 주위를 돌기 때문에"], 1, "지구가 공전하면 밤에 바라보는 우주의 방향이 달라집니다."),
      q("봄, 여름, 가을, 겨울 중에서 '사자자리'와 '처녀자리' 같은 별자리를 가장 잘 볼 수 있는 계절은 언제일까요?", ["봄", "여름", "가을", "겨울"], 0, "사자자리와 처녀자리는 대표적인 봄철 별자리입니다."),
      q("다음 중 우리나라에서 겨울철 밤에 가장 잘 보이는 대표적인 별자리는 무엇일까요?", ["사자자리", "백조자리", "페가수스자리", "오리온자리"], 3, "오리온자리는 겨울철 대표 별자리예요."),
      q("한여름인 8월 밤에는 봄철 대표 별자리인 '사자자리'를 쉽게 보기 어렵습니다. 그 이유는 무엇일까요?", ["사자자리가 지구 반대편으로 도망쳐서", "사자자리가 있는 방향에 태양이 있어서 낮에 위치해서", "여름에는 밤하늘이 너무 밝아서", "여름에는 별들이 빛을 내지 않아서"], 1, "태양 방향에 있는 별자리는 낮에 떠 있어 밤에 보기 어렵습니다."),
      q("다음 중 지구의 '자전' 때문에 일어나는 현상이 아닌 것은 무엇일까요?", ["낮과 밤이 반복된다.", "태양이 동쪽에서 떠서 서쪽으로 진다.", "달의 위치가 하루 동안 동쪽에서 서쪽으로 변한다.", "계절에 따라 밤하늘의 별자리가 달라진다."], 3, "계절별 별자리가 달라지는 것은 지구의 공전 때문입니다."),
      q("지구의 운동에 대한 설명으로 옳은 것은 무엇일까요?", ["지구는 자전만 하고 공전은 하지 않는다.", "지구는 자전과 공전을 동시에 하고 있다.", "지구의 자전축은 똑바로 곧게 서 있다.", "지구의 자전 방향과 공전 방향은 서로 반대이다."], 1, "지구는 자전하면서 동시에 태양 주위를 공전합니다."),
      q("달의 모양이 변하는 진짜 원인은 무엇일까요?", ["달이 지구 주위를 공전하면서 태양빛을 받는 부분이 달라져서", "지구가 자전하면서 달을 가리기 때문에", "달이 스스로 모습을 바꾸는 성질이 있어서", "구름이 달을 조금씩 가리기 때문에"], 0, "달이 지구 주위를 돌면서 우리가 보는 밝은 부분의 모양이 달라집니다.")
    ]
  }
];

const stationByUnit = new Map(units.map((unit) => [unit.id, unit]));

const characterPresets = {
  boy: {
    skin: "#f6c39b",
    skinStroke: "#d18b65",
    hair: "#111827",
    shirt: "#2563eb",
    shirtStroke: "#1d4ed8",
    accent: "#60a5fa",
    pants: "#1e3a8a",
    shoes: "#1d4ed8",
    mouth: "#9a3412",
    hairStyle: "short"
  },
  girl: {
    skin: "#f6c39b",
    skinStroke: "#d18b65",
    hair: "#5b2a1f",
    shirt: "#ec4899",
    shirtStroke: "#be185d",
    accent: "#f9a8d4",
    pants: "#7c2d12",
    shoes: "#be185d",
    mouth: "#9a3412",
    hairStyle: "long"
  }
};

const state = {
  running: false,
  lastTime: 0,
  score: 0,
  solved: 0,
  activeTarget: null,
  currentQuiz: null,
  modalOpen: false,
  escaped: false,
  loopActive: false
};

const player = {
  x: 590,
  y: 705,
  vx: 0,
  vy: 0,
  facing: -Math.PI / 2,
  bob: 0,
  character: "boy"
};

const camera = {
  x: player.x,
  y: player.y,
  targetX: player.x,
  targetY: player.y,
  lookX: 0,
  lookY: 0
};

const input = {
  keys: new Set(),
  joyX: 0,
  joyY: 0,
  pointerDown: false,
  dragId: null,
  dragStartX: 0,
  dragStartY: 0,
  lookStartX: 0,
  lookStartY: 0
};

const objects = [
  obj("acid", "산과 염기 시약대", 188, 250, 130, 88, "station", { unitId: "acid" }),
  obj("motion", "운동 실험 트랙", 578, 203, 210, 78, "station", { unitId: "motion" }),
  obj("plant", "식물 관찰대", 942, 302, 132, 116, "station", { unitId: "plant" }),
  obj("earth", "지구모형", 906, 613, 92, 92, "station", { unitId: "earth" }),
  obj("table", "중앙 실험 테이블", 558, 432, 240, 126, "furniture"),
  obj("chair1", "의자", 438, 432, 46, 56, "chair"),
  obj("chair2", "의자", 678, 432, 46, 56, "chair"),
  obj("chair3", "의자", 558, 330, 56, 46, "chair"),
  obj("chair4", "의자", 558, 534, 56, 46, "chair"),
  obj("coat1", "실험복 1", 104, 586, 38, 80, "coat"),
  obj("coat2", "실험복 2", 154, 586, 38, 80, "coat"),
  obj("coat3", "실험복 3", 204, 586, 38, 80, "coat"),
  obj("coat4", "실험복 4", 254, 586, 38, 80, "coat"),
  obj("door", "탈출문", 590, 52, 126, 28, "door", { solid: false })
];

const staticObstacles = objects.filter((item) => item.solid !== false);
const stationObjects = objects.filter((item) => item.kind === "station");
let lastPromptKey = "";

function q(text, choices, answer, explanation) {
  return { text, choices, answer, explanation, solved: false };
}

function obj(id, name, x, y, w, h, kind, extra = {}) {
  return {
    id,
    name,
    x,
    y,
    w,
    h,
    kind,
    solid: extra.solid !== false,
    ...extra
  };
}

function resize() {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  delete canvas.dataset.renderStats;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function openDialog(dialog) {
  state.modalOpen = true;
  if (!dialog.open) dialog.showModal();
}

function closeDialog(dialog) {
  if (dialog.open) dialog.close();
  state.modalOpen = false;
}

function openCharacterModal() {
  if (startModal.open || quizModal.open || escapeModal.open) return;
  updateCharacterSelection();
  openDialog(characterModal);
}

function closeCharacterModal() {
  closeDialog(characterModal);
}

function setCharacter(character) {
  if (!["boy", "girl"].includes(character)) return;
  player.character = character;
  updateCharacterSelection();
  closeCharacterModal();
  showToast(character === "boy" ? "남자 캐릭터를 선택했습니다." : "여자 캐릭터를 선택했습니다.");
}

function updateCharacterSelection() {
  for (const button of characterButtons) {
    button.classList.toggle("selected", button.dataset.character === player.character);
  }
}

function startGame() {
  state.running = true;
  state.lastTime = performance.now();
  closeDialog(startModal);
  showToast("과학실 물건에 가까이 가서 조사 버튼을 눌러보세요.");
  ensureGameLoop();
}

function resetGame() {
  for (const unit of units) {
    for (const item of unit.questions) item.solved = false;
  }
  Object.assign(state, {
    running: true,
    lastTime: performance.now(),
    score: 0,
    solved: 0,
    activeTarget: null,
    currentQuiz: null,
    modalOpen: false,
    escaped: false
  });
  Object.assign(player, { x: 590, y: 705, vx: 0, vy: 0, facing: -Math.PI / 2, bob: 0 });
  Object.assign(camera, { x: player.x, y: player.y, targetX: player.x, targetY: player.y, lookX: 0, lookY: 0 });
  lastPromptKey = "";
  closeDialog(escapeModal);
  updateHud();
  showToast("새 게임을 시작했습니다.");
  ensureGameLoop();
}

function ensureGameLoop() {
  if (state.loopActive) return;
  state.loopActive = true;
  requestAnimationFrame(loop);
}

function loop(time) {
  if (!state.running) {
    state.loopActive = false;
    return;
  }
  const dt = Math.min(0.033, (time - state.lastTime) / 1000 || 0.016);
  state.lastTime = time;
  if (!state.modalOpen) update(dt);
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  const move = getMoveVector();
  const targetSpeed = 158;
  const ease = 1 - Math.exp(-dt * (move.active ? 9.5 : 7.2));
  player.vx += (move.x * targetSpeed - player.vx) * ease;
  player.vy += (move.y * targetSpeed - player.vy) * ease;

  movePlayer(player.vx * dt, player.vy * dt);

  const speed = Math.hypot(player.vx, player.vy);
  if (speed > 10) {
    player.bob += dt * (5.5 + Math.min(1, speed / targetSpeed) * 4);
  } else {
    player.bob += dt * 2;
  }

  camera.targetX = player.x;
  camera.targetY = player.y;
  camera.x += (camera.targetX - camera.x) * Math.min(1, dt * 14);
  camera.y += (camera.targetY - camera.y) * Math.min(1, dt * 14);

  state.activeTarget = findActiveTarget();
  renderPrompt();
}

function getMoveVector() {
  let x = 0;
  let y = 0;
  if (input.keys.has("w") || input.keys.has("arrowup")) y -= 1;
  if (input.keys.has("s") || input.keys.has("arrowdown")) y += 1;
  if (input.keys.has("a") || input.keys.has("arrowleft")) x -= 1;
  if (input.keys.has("d") || input.keys.has("arrowright")) x += 1;
  x += input.joyX;
  y += input.joyY;
  const length = Math.hypot(x, y);
  const localX = length > 1 ? x / length : x;
  const localY = length > 1 ? y / length : y;
  const forward = { x: Math.cos(player.facing), y: Math.sin(player.facing) };
  const right = { x: -forward.y, y: forward.x };
  return {
    x: right.x * localX - forward.x * localY,
    y: right.y * localX - forward.y * localY,
    active: length > 0.01
  };
}

function movePlayer(dx, dy) {
  player.x = clamp(player.x + dx, 58, WORLD.width - 58);
  for (const obstacle of staticObstacles) {
    resolveCircleRect(player, PLAYER_RADIUS, obstacle);
  }
  player.y = clamp(player.y + dy, 58, WORLD.height - 58);
  for (const obstacle of staticObstacles) {
    resolveCircleRect(player, PLAYER_RADIUS, obstacle);
  }
}

function resolveCircleRect(circle, radius, rect) {
  const halfW = rect.w / 2;
  const halfH = rect.h / 2;
  const closestX = clamp(circle.x, rect.x - halfW, rect.x + halfW);
  const closestY = clamp(circle.y, rect.y - halfH, rect.y + halfH);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  const dist = Math.hypot(dx, dy);
  if (dist > 0 && dist < radius) {
    const push = radius - dist;
    circle.x += (dx / dist) * push;
    circle.y += (dy / dist) * push;
  }
}

function findActiveTarget() {
  let best = null;
  let bestDist = Infinity;
  for (const item of objects) {
    const range = item.kind === "station" ? 98 : 72;
    const d = distanceToObject(player.x, player.y, item);
    if (d < range && d < bestDist && isTargetVisible(item)) {
      best = item;
      bestDist = d;
    }
  }
  return best;
}

function isTargetVisible(item) {
  if (item.id === "door") return state.solved >= TOTAL_QUESTIONS;
  return true;
}

function distanceToObject(x, y, item) {
  const cx = clamp(x, item.x - item.w / 2, item.x + item.w / 2);
  const cy = clamp(y, item.y - item.h / 2, item.y + item.h / 2);
  return Math.hypot(x - cx, y - cy);
}

function renderPrompt() {
  const target = state.activeTarget;
  const key = getPromptKey(target);
  if (key === lastPromptKey) return;
  lastPromptKey = key;
  if (!target) {
    promptBox.hidden = true;
    return;
  }
  promptBox.hidden = false;
  if (target.kind === "station") {
    const unit = stationByUnit.get(target.unitId);
    const solved = unit.questions.filter((item) => item.solved).length;
    if (solved >= unit.questions.length) {
      promptText.textContent = `${target.name}: ${unit.name} 단원을 모두 해결했습니다.`;
    } else {
      promptText.textContent = `${target.name}: ${unit.name} 문제 ${solved + 1}/15 풀기`;
    }
    return;
  }
  if (target.id === "door") {
    promptText.textContent = "탈출문: 모든 문제를 해결했습니다. 문을 열 수 있습니다.";
    return;
  }
  promptText.textContent = `${target.name} 조사하기`;
}

function getPromptKey(target) {
  if (!target) return "none";
  if (target.kind === "station") {
    const unit = stationByUnit.get(target.unitId);
    const solved = unit.questions.filter((item) => item.solved).length;
    return `${target.id}:${solved}`;
  }
  return `${target.id}:${state.solved}`;
}

function interact() {
  const target = state.activeTarget || findActiveTarget();
  if (!target || state.modalOpen) return;
  if (target.kind === "station") {
    openNextQuestion(target.unitId);
    return;
  }
  if (target.id === "door") {
    finishEscape();
    return;
  }
  showToast(`${target.name}에는 탈출에 필요한 표시가 없습니다.`);
}

function openNextQuestion(unitId) {
  const unit = stationByUnit.get(unitId);
  const questionIndex = unit.questions.findIndex((item) => !item.solved);
  if (questionIndex === -1) {
    showToast(`${unit.name} 단원은 모두 완료했습니다.`);
    return;
  }
  state.currentQuiz = { unit, question: unit.questions[questionIndex], index: questionIndex };
  renderQuiz();
  openDialog(quizModal);
}

function renderQuiz() {
  const { unit, question, index } = state.currentQuiz;
  quizUnit.textContent = unit.name;
  quizTitle.textContent = `${unit.station} 문제 ${index + 1}/15`;
  questionText.textContent = question.text;
  feedback.textContent = "";
  choicesBox.replaceChildren();
  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = `${["①", "②", "③", "④"][index]} ${choice}`;
    button.addEventListener("click", () => answerQuestion(index, button));
    choicesBox.appendChild(button);
  });
}

function answerQuestion(index, button) {
  const current = state.currentQuiz;
  if (!current || current.question.solved) return;
  const { unit, question } = current;
  const buttons = [...choicesBox.querySelectorAll(".choice")];
  buttons.forEach((item) => {
    item.disabled = true;
    if (buttons.indexOf(item) === question.answer) item.classList.add("correct");
  });
  if (index === question.answer) {
    question.solved = true;
    state.score += 1;
    state.solved += 1;
    button.classList.add("correct");
    feedback.textContent = `정답입니다. ${question.explanation}`;
    burstStars(window.innerWidth / 2, window.innerHeight / 2, 5);
    showToast(`${unit.name} 정답! 별풍선이 나왔습니다.`);
    setTimeout(() => {
      closeDialog(quizModal);
      state.currentQuiz = null;
      checkMissionComplete();
    }, 1250);
  } else {
    button.classList.add("wrong");
    feedback.textContent = `아쉬워요. 정답은 ${["①", "②", "③", "④"][question.answer]}입니다. ${question.explanation}`;
    setTimeout(() => {
      buttons.forEach((item) => {
        item.disabled = false;
        item.classList.remove("wrong", "correct");
      });
      feedback.textContent = "다시 골라보세요.";
    }, 1450);
  }
  updateHud();
}

function checkMissionComplete() {
  if (state.solved >= TOTAL_QUESTIONS) {
    finishEscape();
  }
}

function finishEscape() {
  if (state.escaped) return;
  finalScore.textContent = String(state.score);
  state.escaped = true;
  updateHud();
  showToast("방에서 탈출완료!");
  openDialog(escapeModal);
  burstStars(window.innerWidth / 2, window.innerHeight * 0.38, 14);
}

function updateHud() {
  scoreText.textContent = String(state.score);
  progressText.textContent = `${state.solved}/${TOTAL_QUESTIONS}`;
  if (state.solved < TOTAL_QUESTIONS) {
    missionText.textContent = "과학실 물건을 조사해 4개 단원 문제를 모두 푸세요.";
  } else {
    missionText.textContent = "방에서 탈출완료!";
  }
  renderUnitProgress();
}

function renderUnitProgress() {
  unitProgress.replaceChildren();
  for (const unit of units) {
    const solved = unit.questions.filter((item) => item.solved).length;
    const row = document.createElement("div");
    row.className = "unit-row";
    row.innerHTML = `
      <span>${unit.name}</span>
      <div class="bar"><span style="width:${(solved / 15) * 100}%; background:${unit.color}"></span></div>
      <strong>${solved}/15</strong>
    `;
    unitProgress.appendChild(row);
  }
}

function burstStars(x, y, count = 6) {
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("div");
    star.className = "star-balloon";
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 44;
    star.style.setProperty("--x", `${x + offsetX}px`);
    star.style.setProperty("--y", `${y + offsetY}px`);
    star.style.animationDelay = `${i * 0.035}s`;
    starLayer.appendChild(star);
    setTimeout(() => star.remove(), 1700);
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastStack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
  }, 2500);
  setTimeout(() => toast.remove(), 3100);
}

function worldToScreen(x, y) {
  return {
    x: x - camera.x + window.innerWidth / 2,
    y: y - camera.y + window.innerHeight / 2
  };
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  draw3DScene();
  updateCanvasDiagnostics();
}

function draw3DScene() {
  const view = create3DView();
  const faces = [];
  const sprites = [];

  draw3DBackdrop();
  draw3DRoom(view);
  add3DLabFurniture(faces, sprites, view);
  add3DStations(faces, sprites, view);

  const renderables = faces.concat(sprites).sort((a, b) => b.depth - a.depth);
  for (const item of renderables) item.draw();

  draw3DLabels(view);
  drawFirstPersonHands();
}

function create3DView() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const yaw = player.facing;
  const forward = { x: Math.cos(yaw), z: Math.sin(yaw) };
  const right = { x: -forward.z, z: forward.x };
  const camX = camera.x + forward.x * 10;
  const camZ = camera.y + forward.z * 10;
  const camHeight = 95;
  const targetDistance = 230;
  const targetHeight = 84;
  const targetUp = targetHeight - camHeight;
  const pitch = Math.atan2(targetUp, targetDistance) + camera.lookY;

  return {
    width,
    height,
    cx: width / 2,
    cy: height * 0.54,
    focal: Math.min(width, height) * 0.92,
    camX,
    camZ,
    camHeight,
    forward,
    right,
    pitch,
    near: 16
  };
}

function project3D(view, x, z, y = 0) {
  const dx = x - view.camX;
  const dz = z - view.camZ;
  const side = dx * view.right.x + dz * view.right.z;
  const forward = dx * view.forward.x + dz * view.forward.z;
  const up = y - view.camHeight;
  const cp = Math.cos(view.pitch);
  const sp = Math.sin(view.pitch);
  const depth = forward * cp + up * sp;
  const up2 = up * cp - forward * sp;

  if (depth <= view.near) return null;

  const scale = view.focal / depth;
  return {
    x: view.cx + side * scale,
    y: view.cy - up2 * scale,
    scale,
    depth
  };
}

function draw3DBackdrop() {
  const wall = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  wall.addColorStop(0, "#f8fcff");
  wall.addColorStop(0.48, "#eef6fb");
  wall.addColorStop(1, "#f9fbfd");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function draw3DRoom(view) {
  drawFace3D(view, [
    p3(42, 42, 0),
    p3(WORLD.width - 42, 42, 0),
    p3(WORLD.width - 42, WORLD.height - 42, 0),
    p3(42, WORLD.height - 42, 0)
  ], "#fbfdff", "#cbd9e6", 2);

  drawFace3D(view, [
    p3(42, 42, 0),
    p3(WORLD.width - 42, 42, 0),
    p3(WORLD.width - 42, 42, 170),
    p3(42, 42, 170)
  ], "#f3f9ff", "#cbd9e6", 2);

  drawFace3D(view, [
    p3(42, 42, 0),
    p3(42, WORLD.height - 42, 0),
    p3(42, WORLD.height - 42, 150),
    p3(42, 42, 170)
  ], "#f7fbff", "#d6e1eb", 2);

  drawFace3D(view, [
    p3(WORLD.width - 42, 42, 0),
    p3(WORLD.width - 42, WORLD.height - 42, 0),
    p3(WORLD.width - 42, WORLD.height - 42, 150),
    p3(WORLD.width - 42, 42, 170)
  ], "#f7fbff", "#d6e1eb", 2);

  drawFloorGrid3D(view);
  drawWallDecor3D(view);
}

function drawFloorGrid3D(view) {
  ctx.save();
  ctx.strokeStyle = "rgba(82, 108, 132, 0.18)";
  ctx.lineWidth = 1;
  for (let x = 80; x < WORLD.width - 70; x += 40) {
    drawLine3D(view, p3(x, 56, 1), p3(x, WORLD.height - 56, 1));
  }
  for (let z = 80; z < WORLD.height - 70; z += 40) {
    drawLine3D(view, p3(56, z, 1), p3(WORLD.width - 56, z, 1));
  }
  ctx.restore();
}

function drawWallDecor3D(view) {
  drawFace3D(view, [p3(120, 41, 62), p3(294, 41, 62), p3(294, 41, 116), p3(120, 41, 116)], "#eaf5ff", "#b9d3ef", 2);
  drawScreenText3D(view, "안전 수칙", 164, 41, 94, 16, "#1f3654");

  drawFace3D(view, [p3(493, 40, 72), p3(690, 40, 72), p3(690, 40, 116), p3(493, 40, 116)], state.solved >= TOTAL_QUESTIONS ? "#dcfce7" : "#eef2f7", "#bfccd9", 2);
  drawScreenText3D(view, state.solved >= TOTAL_QUESTIONS ? "탈출문 열림" : "잠긴 탈출문", 540, 39, 98, 15, state.solved >= TOTAL_QUESTIONS ? "#16723a" : "#58677c");

  for (let x = 830; x <= 1030; x += 70) {
    drawFace3D(view, [p3(x, 41, 58), p3(x + 48, 41, 58), p3(x + 48, 41, 118), p3(x, 41, 118)], "#f2f8ff", "#cbd9e6", 2);
    drawFace3D(view, [p3(x + 8, 40, 76), p3(x + 40, 40, 76), p3(x + 40, 40, 90), p3(x + 8, 40, 90)], "#dbeafe", null, 0);
    drawFace3D(view, [p3(x + 8, 40, 96), p3(x + 40, 40, 96), p3(x + 40, 40, 116), p3(x + 8, 40, 116)], "#c7f9d4", null, 0);
  }
}

function add3DLabFurniture(faces, sprites, view) {
  const table = objects.find((item) => item.id === "table");
  addCuboid3D(faces, view, table.x, table.y, table.w, table.h, 12, 58, "#dbeafe", "#9bb6c7");
  addCuboid3D(faces, view, table.x, table.y - 28, table.w - 46, 28, 60, 18, "#eef6f9", "#abc2d3");
  for (const leg of [
    [table.x - 92, table.y - 42],
    [table.x + 92, table.y - 42],
    [table.x - 92, table.y + 42],
    [table.x + 92, table.y + 42]
  ]) {
    addCuboid3D(faces, view, leg[0], leg[1], 16, 16, 0, 48, "#9bb6c7", "#7894a8");
  }
  addBeaker3D(faces, view, table.x - 70, table.y + 14, "#60a5fa");
  addBeaker3D(faces, view, table.x - 18, table.y + 14, "#f472b6");
  addBeaker3D(faces, view, table.x + 34, table.y + 14, "#34d399");
  addCuboid3D(faces, view, table.x + 82, table.y + 18, 44, 32, 62, 5, "#ffffff", "#94a3b8");

  for (const chair of objects.filter((item) => item.kind === "chair")) {
    addCuboid3D(faces, view, chair.x, chair.y, chair.w, chair.h, 0, 26, "#e2e8f0", "#94a3b8");
    addCuboid3D(faces, view, chair.x, chair.y - chair.h / 2 + 6, chair.w, 8, 25, 44, "#cbd5e1", "#94a3b8");
  }

  addCuboid3D(faces, view, 181, 612, 230, 38, 0, 78, "#f8fafc", "#cbd5e1");
  drawScreenText3D(view, "실험복 보관대", 116, 575, 90, 14, "#334155");
  for (const coat of objects.filter((item) => item.kind === "coat")) {
    addCoatSprite3D(sprites, view, coat.x, coat.y, 72);
  }
}

function add3DStations(faces, sprites, view) {
  addAcidStation3D(faces, view, objects.find((item) => item.id === "acid"));
  addMotionStation3D(faces, sprites, view, objects.find((item) => item.id === "motion"));
  addPlantStation3D(faces, sprites, view, objects.find((item) => item.id === "plant"));
  addGlobeStation3D(faces, sprites, view, objects.find((item) => item.id === "earth"));
  addQuestionBadges3D(sprites, view);
}

function addAcidStation3D(faces, view, item) {
  addCuboid3D(faces, view, item.x, item.y, item.w, item.h, 0, 54, "#fee2e2", "#fca5a5");
  for (let i = 0; i < 5; i += 1) {
    const x = item.x - 48 + i * 24;
    addCuboid3D(faces, view, x, item.y + 4, 13, 13, 56, 38, ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"][i], "#ffffff");
  }
}

function addMotionStation3D(faces, sprites, view, item) {
  addCuboid3D(faces, view, item.x, item.y, item.w, item.h, 0, 48, "#eff6ff", "#93c5fd");
  addCuboid3D(faces, view, item.x, item.y + 18, 168, 12, 50, 7, "#2563eb", "#1d4ed8");
  addCuboid3D(faces, view, item.x + 50, item.y - 2, 48, 28, 57, 18, "#f97316", "#c2410c");
  addWheelSprite3D(sprites, view, item.x + 36, item.y + 16, 60);
  addWheelSprite3D(sprites, view, item.x + 66, item.y + 16, 60);
}

function addPlantStation3D(faces, sprites, view, item) {
  addCuboid3D(faces, view, item.x, item.y, item.w, item.h, 0, 52, "#dcfce7", "#86efac");
  for (let i = 0; i < 3; i += 1) {
    const x = item.x - 32 + i * 32;
    addCuboid3D(faces, view, x, item.y + 16, 22, 22, 54, 24, "#c08457", "#92400e");
    addPlantSprite3D(sprites, view, x, item.y + 10, 98 + i * 4);
  }
  addMicroscope3D(faces, view, item.x + 42, item.y - 18, 55);
}

function addGlobeStation3D(faces, sprites, view, item) {
  addCuboid3D(faces, view, item.x, item.y, item.w, item.h, 0, 48, "#ede9fe", "#c4b5fd");
  addCuboid3D(faces, view, item.x, item.y + 26, 48, 12, 50, 10, "#64748b", "#475569");
  addCuboid3D(faces, view, item.x, item.y + 8, 10, 10, 58, 44, "#64748b", "#475569");
  addGlobeSprite3D(sprites, view, item.x, item.y - 3, 110);
}

function addBeaker3D(faces, view, x, z, liquid) {
  addCuboid3D(faces, view, x, z, 18, 18, 60, 36, "#e0f2fe", "#64748b");
  addCuboid3D(faces, view, x, z + 1, 14, 14, 60, 14, liquid, liquid);
}

function addMicroscope3D(faces, view, x, z, base) {
  addCuboid3D(faces, view, x, z + 14, 48, 18, base, 8, "#64748b", "#475569");
  addCuboid3D(faces, view, x + 10, z - 7, 16, 30, base + 8, 44, "#94a3b8", "#475569");
  addCuboid3D(faces, view, x + 18, z - 28, 34, 14, base + 50, 12, "#64748b", "#475569");
}

function addCuboid3D(faces, view, x, z, width, depth, base, height, fill, stroke) {
  const x1 = x - width / 2;
  const x2 = x + width / 2;
  const z1 = z - depth / 2;
  const z2 = z + depth / 2;
  const y0 = base;
  const y1 = base + height;
  const shaded = shadeSet(fill);
  addFace3D(faces, view, [p3(x1, z1, y1), p3(x2, z1, y1), p3(x2, z2, y1), p3(x1, z2, y1)], shaded.top, stroke, 1.4);
  addFace3D(faces, view, [p3(x1, z2, y0), p3(x2, z2, y0), p3(x2, z2, y1), p3(x1, z2, y1)], shaded.front, stroke, 1.2);
  addFace3D(faces, view, [p3(x1, z1, y0), p3(x1, z2, y0), p3(x1, z2, y1), p3(x1, z1, y1)], shaded.sideA, stroke, 1.2);
  addFace3D(faces, view, [p3(x2, z1, y0), p3(x2, z2, y0), p3(x2, z2, y1), p3(x2, z1, y1)], shaded.sideB, stroke, 1.2);
  addFace3D(faces, view, [p3(x1, z1, y0), p3(x2, z1, y0), p3(x2, z1, y1), p3(x1, z1, y1)], shaded.back, stroke, 1.2);
}

function addOrientedCuboid3D(faces, view, x, z, width, depth, base, height, yaw, fill, stroke) {
  const forward = { x: Math.cos(yaw), z: Math.sin(yaw) };
  const right = { x: -forward.z, z: forward.x };
  const halfW = width / 2;
  const halfD = depth / 2;
  const y0 = base;
  const y1 = base + height;
  const shaded = shadeSet(fill);

  const corner = (side, front, y) => p3(
    x + right.x * halfW * side + forward.x * halfD * front,
    z + right.z * halfW * side + forward.z * halfD * front,
    y
  );

  addFace3D(faces, view, [corner(-1, -1, y1), corner(1, -1, y1), corner(1, 1, y1), corner(-1, 1, y1)], shaded.top, stroke, 1.4);
  addFace3D(faces, view, [corner(-1, 1, y0), corner(1, 1, y0), corner(1, 1, y1), corner(-1, 1, y1)], shaded.front, stroke, 1.2);
  addFace3D(faces, view, [corner(-1, -1, y0), corner(1, -1, y0), corner(1, -1, y1), corner(-1, -1, y1)], shaded.back, stroke, 1.2);
  addFace3D(faces, view, [corner(-1, -1, y0), corner(-1, 1, y0), corner(-1, 1, y1), corner(-1, -1, y1)], shaded.sideA, stroke, 1.2);
  addFace3D(faces, view, [corner(1, -1, y0), corner(1, 1, y0), corner(1, 1, y1), corner(1, -1, y1)], shaded.sideB, stroke, 1.2);
}

function addFace3D(faces, view, points, fill, stroke, lineWidth = 1) {
  const projected = points.map((point) => project3D(view, point.x, point.z, point.y));
  if (projected.some((point) => !point)) return;
  const depth = projected.reduce((sum, point) => sum + point.depth, 0) / projected.length;
  faces.push({
    depth,
    draw() {
      drawProjectedPoly(projected, fill, stroke, lineWidth);
    }
  });
}

function drawFace3D(view, points, fill, stroke, lineWidth = 1) {
  const projected = points.map((point) => project3D(view, point.x, point.z, point.y));
  if (projected.some((point) => !point)) return;
  drawProjectedPoly(projected, fill, stroke, lineWidth);
}

function drawProjectedPoly(projected, fill, stroke, lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(projected[0].x, projected[0].y);
  for (let i = 1; i < projected.length; i += 1) ctx.lineTo(projected[i].x, projected[i].y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawLine3D(view, a, b) {
  const pa = project3D(view, a.x, a.z, a.y);
  const pb = project3D(view, b.x, b.z, b.y);
  if (!pa || !pb) return;
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
}

function addQuestionBadges3D(sprites, view) {
  for (const station of stationObjects) {
    const unit = stationByUnit.get(station.unitId);
    const solved = unit.questions.filter((item) => item.solved).length;
    const p = project3D(view, station.x, station.y + station.h / 2 + 26, 70);
    if (!p) continue;
    sprites.push({
      depth: p.depth,
      draw() {
        const scale = clamp(p.scale * 42, 0.38, 1.15);
        const width = 112 * scale;
        const height = 30 * scale;
        roundRect(p.x - width / 2, p.y - height / 2, width, height, 7, "rgba(255,255,255,0.92)", unit.color, 2);
        drawText(`${solved}/15`, p.x - 15 * scale, p.y + 5 * scale, 14 * scale, unit.color, "900");
      }
    });
  }
}

function addGlobeSprite3D(sprites, view, x, z, y) {
  const p = project3D(view, x, z, y);
  if (!p) return;
  sprites.push({
    depth: p.depth,
    draw() {
      const r = clamp(28 * p.scale, 12, 64);
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = Math.max(2, r * 0.08);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 1.12, -Math.PI * 0.15, Math.PI * 1.15);
      ctx.stroke();
      circle(p.x, p.y, r, "#38bdf8", "#1d4ed8", 3);
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.ellipse(p.x - r * 0.25, p.y - r * 0.16, r * 0.28, r * 0.52, -0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x + r * 0.38, p.y + r * 0.18, r * 0.25, r * 0.42, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function addPlantSprite3D(sprites, view, x, z, y) {
  const p = project3D(view, x, z, y);
  if (!p) return;
  sprites.push({
    depth: p.depth,
    draw() {
      const s = clamp(p.scale * 38, 0.55, 1.6);
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 12 * s);
      ctx.lineTo(p.x, p.y - 18 * s);
      ctx.stroke();
      drawLeafScreen(p.x - 10 * s, p.y - 6 * s, 8 * s, 15 * s, -0.55);
      drawLeafScreen(p.x + 11 * s, p.y - 18 * s, 8 * s, 15 * s, 0.55);
      drawLeafScreen(p.x - 3 * s, p.y - 28 * s, 7 * s, 14 * s, -0.1);
    }
  });
}

function addCoatSprite3D(sprites, view, x, z, y) {
  const p = project3D(view, x, z, y);
  if (!p) return;
  sprites.push({
    depth: p.depth,
    draw() {
      const s = clamp(p.scale * 56, 0.5, 1.25);
      roundRect(p.x - 14 * s, p.y - 27 * s, 28 * s, 58 * s, 6 * s, "#ffffff", "#cbd5e1", 2);
      ctx.fillStyle = "#e0f2fe";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 24 * s);
      ctx.lineTo(p.x - 8 * s, p.y - 4 * s);
      ctx.lineTo(p.x, p.y + 3 * s);
      ctx.lineTo(p.x + 8 * s, p.y - 4 * s);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function addWheelSprite3D(sprites, view, x, z, y) {
  const p = project3D(view, x, z, y);
  if (!p) return;
  sprites.push({
    depth: p.depth,
    draw() {
      circle(p.x, p.y, clamp(6 * p.scale, 2, 11), "#1f2937", "#0f172a", 1);
    }
  });
}

function add3DPlayer(faces, sprites, view) {
  const preset = characterPresets[player.character] || characterPresets.boy;
  const yaw = player.facing;
  const forward = { x: Math.cos(yaw), z: Math.sin(yaw) };
  const right = { x: -forward.z, z: forward.x };
  const speedRatio = Math.min(1, Math.hypot(player.vx, player.vy) / 120);
  const walk = Math.sin(player.bob) * speedRatio;
  const x = player.x;
  const z = player.y;

  addPlayerShadow3D(sprites, view, x, z);

  addOrientedCuboid3D(faces, view, x, z, 34, 23, 43, 43, yaw, preset.shirt, preset.shirtStroke);
  addOrientedCuboid3D(faces, view, x + forward.x * 12, z + forward.z * 12, 18, 5, 55, 18, yaw, preset.accent, preset.shirtStroke);
  addOrientedCuboid3D(faces, view, x, z, 12, 12, 86, 8, yaw, preset.skin, preset.skinStroke);

  addOrientedCuboid3D(faces, view, x, z, 33, 29, 94, 30, yaw, preset.skin, preset.skinStroke);
  addOrientedCuboid3D(faces, view, x - forward.x * 3, z - forward.z * 3, 35, 31, 119, 9, yaw, preset.hair, preset.hair);
  addOrientedCuboid3D(faces, view, x + forward.x * 10, z + forward.z * 10, 34, 8, 111, 13, yaw, preset.hair, preset.hair);
  if (preset.hairStyle === "long") {
    const leftHair = offsetPoint(x, z, right, -19, forward, -2);
    const rightHair = offsetPoint(x, z, right, 19, forward, -2);
    addOrientedCuboid3D(faces, view, leftHair.x, leftHair.z, 8, 15, 85, 37, yaw, preset.hair, preset.hair);
    addOrientedCuboid3D(faces, view, rightHair.x, rightHair.z, 8, 15, 85, 37, yaw, preset.hair, preset.hair);
    addOrientedCuboid3D(faces, view, x - forward.x * 14, z - forward.z * 14, 31, 10, 86, 32, yaw, preset.hair, preset.hair);
  }

  const leftLeg = offsetPoint(x, z, right, -8, forward, walk * 6);
  const rightLeg = offsetPoint(x, z, right, 8, forward, -walk * 6);
  addOrientedCuboid3D(faces, view, leftLeg.x, leftLeg.z, 9, 11, 6, 38, yaw, preset.pants, "#172554");
  addOrientedCuboid3D(faces, view, rightLeg.x, rightLeg.z, 9, 11, 6, 38, yaw, preset.pants, "#172554");
  addOrientedCuboid3D(faces, view, leftLeg.x + forward.x * 3, leftLeg.z + forward.z * 3, 12, 17, 0, 7, yaw, preset.shoes, "#172554");
  addOrientedCuboid3D(faces, view, rightLeg.x + forward.x * 3, rightLeg.z + forward.z * 3, 12, 17, 0, 7, yaw, preset.shoes, "#172554");

  const leftArm = offsetPoint(x, z, right, -25, forward, -walk * 4);
  const rightArm = offsetPoint(x, z, right, 25, forward, walk * 4);
  addOrientedCuboid3D(faces, view, leftArm.x, leftArm.z, 8, 9, 42, 37, yaw, preset.skin, preset.skinStroke);
  addOrientedCuboid3D(faces, view, rightArm.x, rightArm.z, 8, 9, 42, 37, yaw, preset.skin, preset.skinStroke);

  addPlayerFaceDetails3D(sprites, view, x, z, right, forward, preset);
}

function addPlayerShadow3D(sprites, view, x, z) {
  const p = project3D(view, x, z, 2);
  if (!p) return;
  sprites.push({
    depth: p.depth + 2,
    draw() {
      const sx = clamp(24 * p.scale, 11, 42);
      const sy = clamp(10 * p.scale, 4, 18);
      ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, sx, sy, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function addPlayerFaceDetails3D(sprites, view, x, z, right, forward, preset) {
  const faceCenter = offsetPoint(x, z, right, 0, forward, 15.4);
  const leftEye = offsetPoint(faceCenter.x, faceCenter.z, right, -6, forward, 0);
  const rightEye = offsetPoint(faceCenter.x, faceCenter.z, right, 6, forward, 0);
  const mouth = offsetPoint(faceCenter.x, faceCenter.z, right, 0, forward, 0);
  const pLeftEye = project3D(view, leftEye.x, leftEye.z, 109);
  const pRightEye = project3D(view, rightEye.x, rightEye.z, 109);
  const pMouth = project3D(view, mouth.x, mouth.z, 101);
  const detailDepth = [pLeftEye, pRightEye, pMouth].filter(Boolean).reduce((sum, p) => sum + p.depth, 0) / 3;

  if (!pLeftEye || !pRightEye || !pMouth || !Number.isFinite(detailDepth)) return;

  sprites.push({
    depth: detailDepth - 1,
    draw() {
      const eyeSize = clamp(2.4 * pLeftEye.scale, 1.5, 5);
      circle(pLeftEye.x, pLeftEye.y, eyeSize, "#111827");
      circle(pRightEye.x, pRightEye.y, eyeSize, "#111827");

      ctx.strokeStyle = preset.mouth;
      ctx.lineWidth = clamp(1.4 * pMouth.scale, 1, 3);
      ctx.beginPath();
      ctx.arc(pMouth.x, pMouth.y, clamp(6 * pMouth.scale, 3, 10), 0.16, Math.PI - 0.16);
      ctx.stroke();
    }
  });
}

function drawFirstPersonHands() {
  const preset = characterPresets[player.character] || characterPresets.boy;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = clamp(Math.min(width, height) / 720, 0.62, 1.08);
  const speedRatio = Math.min(1, Math.hypot(player.vx, player.vy) / 158);
  const swing = Math.sin(player.bob) * 7 * speedRatio * scale;
  const lift = Math.abs(Math.cos(player.bob)) * 4 * speedRatio * scale;

  drawFirstPersonArm(width * 0.07, height - 60 * scale + lift, 1, swing, preset, scale);
  drawFirstPersonArm(width * 0.93, height - 62 * scale + lift, -1, -swing, preset, scale);
  drawFirstPersonReticle();
}

function drawFirstPersonArm(anchorX, anchorY, direction, swing, preset, scale) {
  ctx.save();
  ctx.translate(anchorX, anchorY + swing * 0.2);
  ctx.rotate(direction * 0.12 + swing * 0.008);
  ctx.scale(direction, 1);

  ctx.globalAlpha = 0.14;
  roundRect(16 * scale, 11 * scale, 112 * scale, 28 * scale, 8 * scale, "#0f172a");
  ctx.globalAlpha = 1;

  roundRect(0, -19 * scale, 94 * scale, 36 * scale, 8 * scale, preset.shirt, preset.shirtStroke, 2);
  roundRect(9 * scale, -16 * scale, 24 * scale, 30 * scale, 6 * scale, preset.accent, "rgba(255,255,255,0.42)", 1);
  roundRect(74 * scale, -16 * scale, 34 * scale, 31 * scale, 8 * scale, preset.skin, preset.skinStroke, 2);
  circle(108 * scale, -1 * scale, 17 * scale, preset.skin, preset.skinStroke, 2);

  ctx.globalAlpha = 0.28;
  circle(113 * scale, -7 * scale, 5 * scale, "#ffffff");
  ctx.restore();
}

function drawFirstPersonReticle() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight * 0.52;
  const active = Boolean(state.activeTarget);
  ctx.save();
  ctx.strokeStyle = active ? "rgba(34, 197, 94, 0.9)" : "rgba(15, 23, 42, 0.34)";
  ctx.lineWidth = active ? 2 : 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.lineTo(x - 3, y);
  ctx.moveTo(x + 3, y);
  ctx.lineTo(x + 9, y);
  ctx.moveTo(x, y - 9);
  ctx.lineTo(x, y - 3);
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 9);
  ctx.stroke();
  circle(x, y, active ? 2.4 : 2, active ? "#22c55e" : "rgba(15, 23, 42, 0.36)");
  ctx.restore();
}

function draw3DLabels(view) {
  for (const item of objects) {
    if (!isTargetVisible(item)) continue;
    if (!["station", "door"].includes(item.kind)) continue;
    const near = state.activeTarget && state.activeTarget.id === item.id;
    const p = project3D(view, item.x, item.y - item.h / 2 - 6, item.kind === "door" ? 120 : 84);
    if (!p) continue;
    const s = clamp(p.scale * 48, 0.48, 1.2);
    const w = Math.max(94, item.name.length * 12) * s;
    const h = 26 * s;
    roundRect(p.x - w / 2, p.y - h / 2, w, h, 6 * s, near ? "#1f2937" : "rgba(255,255,255,0.94)", near ? "#1f2937" : "#d7e0ea", 1);
    drawText(item.name, p.x - textOffset(item.name, 12 * s), p.y + 4 * s, 12 * s, near ? "#ffffff" : "#334155", "800");
  }
}

function drawScreenText3D(view, text, x, z, y, size, color) {
  const p = project3D(view, x, z, y);
  if (!p) return;
  const s = clamp(p.scale * 46, 0.45, 1.1);
  drawText(text, p.x, p.y, size * s, color, "800");
}

function drawLeafScreen(x, y, rx, ry, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function shadeSet(color) {
  return {
    top: lightenColor(color, 0.1),
    front: color,
    sideA: darkenColor(color, 0.08),
    sideB: darkenColor(color, 0.15),
    back: darkenColor(color, 0.2)
  };
}

function lightenColor(color, amount) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return toHexColor(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  );
}

function darkenColor(color, amount) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return toHexColor(rgb.r * (1 - amount), rgb.g * (1 - amount), rgb.b * (1 - amount));
}

function parseHexColor(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return null;
  return {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16)
  };
}

function toHexColor(r, g, b) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function offsetPoint(x, z, right, side, forward, ahead) {
  return {
    x: x + right.x * side + forward.x * ahead,
    z: z + right.z * side + forward.z * ahead
  };
}

function p3(x, z, y) {
  return { x, z, y };
}

function drawRoom() {
  roundRect(38, 38, WORLD.width - 76, WORLD.height - 76, 14, "#ffffff", "#c7d6e5", 6);
  drawGrid();
  drawWallDetails();
}

function drawGrid() {
  ctx.save();
  ctx.beginPath();
  ctx.rect(50, 50, WORLD.width - 100, WORLD.height - 100);
  ctx.clip();
  ctx.strokeStyle = "rgba(80, 108, 140, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 70; x < WORLD.width - 60; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 58);
    ctx.lineTo(x, WORLD.height - 58);
    ctx.stroke();
  }
  for (let y = 70; y < WORLD.height - 60; y += 34) {
    ctx.beginPath();
    ctx.moveTo(58, y);
    ctx.lineTo(WORLD.width - 58, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWallDetails() {
  roundRect(74, 72, 182, 54, 8, "#eaf5ff", "#b9d3ef", 2);
  drawText("안전 수칙", 98, 105, 18, "#1f3654", "700");
  roundRect(484, 42, 212, 28, 6, state.solved >= TOTAL_QUESTIONS ? "#dcfce7" : "#eef2f7", "#bfccd9", 2);
  drawText(state.solved >= TOTAL_QUESTIONS ? "탈출문 열림" : "잠긴 탈출문", 536, 62, 15, state.solved >= TOTAL_QUESTIONS ? "#16723a" : "#58677c", "700");

  for (let x = 820; x <= 1030; x += 70) {
    roundRect(x, 72, 48, 58, 8, "#f2f8ff", "#cbd9e6", 2);
    ctx.fillStyle = "#dbeafe";
    ctx.fillRect(x + 8, 82, 32, 12);
    ctx.fillStyle = "#c7f9d4";
    ctx.fillRect(x + 8, 100, 32, 18);
  }
}

function drawStations() {
  drawAcidStation(objects.find((item) => item.id === "acid"));
  drawMotionStation(objects.find((item) => item.id === "motion"));
  drawPlantStation(objects.find((item) => item.id === "plant"));
  drawGlobeStation(objects.find((item) => item.id === "earth"));
}

function drawAcidStation(item) {
  roundRect(item.x - item.w / 2, item.y - item.h / 2, item.w, item.h, 10, "#fef2f2", "#fecaca", 3);
  drawText("산과 염기", item.x - 42, item.y - 24, 15, "#991b1b", "800");
  for (let i = 0; i < 5; i += 1) {
    const x = item.x - 48 + i * 24;
    ctx.fillStyle = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"][i];
    roundRect(x, item.y + 8, 13, 38, 4, ctx.fillStyle, "#ffffff", 2);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(x + 3, item.y + 14, 7, 8);
  }
  ctx.strokeStyle = "#b91c1c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(item.x - 58, item.y - 2);
  ctx.lineTo(item.x + 58, item.y - 2);
  ctx.stroke();
}

function drawMotionStation(item) {
  roundRect(item.x - item.w / 2, item.y - item.h / 2, item.w, item.h, 10, "#eff6ff", "#bfdbfe", 3);
  drawText("물체의 이동", item.x - 48, item.y - 22, 15, "#1e40af", "800");
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(item.x - 80, item.y + 17);
  ctx.lineTo(item.x + 84, item.y + 17);
  ctx.stroke();
  for (let i = 0; i < 9; i += 1) {
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(item.x - 78 + i * 20, item.y + 10);
    ctx.lineTo(item.x - 78 + i * 20, item.y + 26);
    ctx.stroke();
  }
  roundRect(item.x + 34, item.y - 2, 44, 24, 6, "#f97316", "#c2410c", 2);
  circle(item.x + 44, item.y + 22, 6, "#1f2937");
  circle(item.x + 68, item.y + 22, 6, "#1f2937");
}

function drawPlantStation(item) {
  roundRect(item.x - item.w / 2, item.y - item.h / 2, item.w, item.h, 10, "#f0fdf4", "#bbf7d0", 3);
  drawText("식물 관찰", item.x - 39, item.y - 38, 15, "#166534", "800");
  roundRect(item.x - 42, item.y + 20, 84, 20, 6, "#a16207", "#854d0e", 2);
  for (let i = 0; i < 3; i += 1) {
    const x = item.x - 32 + i * 32;
    roundRect(x - 10, item.y + 1, 20, 24, 4, "#c08457", "#92400e", 2);
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, item.y + 2);
    ctx.lineTo(x, item.y - 24 - i * 3);
    ctx.stroke();
    leaf(x - 8, item.y - 20 - i * 3, -0.5);
    leaf(x + 8, item.y - 28 - i * 3, 0.5);
  }
  drawMicroscope(item.x + 42, item.y - 18);
}

function drawGlobeStation(item) {
  roundRect(item.x - item.w / 2, item.y - item.h / 2, item.w, item.h, 10, "#f5f3ff", "#ddd6fe", 3);
  drawText("지구모형", item.x - 36, item.y - 45, 15, "#5b21b6", "800");
  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(item.x, item.y - 2, 30, -Math.PI * 0.15, Math.PI * 1.15);
  ctx.stroke();
  circle(item.x, item.y - 2, 28, "#38bdf8", "#1d4ed8", 3);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(item.x - 8, item.y - 10, 10, 17, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(item.x + 12, item.y + 5, 9, 14, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(item.x, item.y + 28);
  ctx.lineTo(item.x, item.y + 42);
  ctx.stroke();
  roundRect(item.x - 24, item.y + 40, 48, 10, 5, "#64748b", "#475569", 1);
}

function drawFurniture() {
  const table = objects.find((item) => item.id === "table");
  roundRect(table.x - table.w / 2, table.y - table.h / 2, table.w, table.h, 10, "#eef6f9", "#9bb6c7", 4);
  roundRect(table.x - 95, table.y - 41, 190, 24, 6, "#dbeafe", "#b3c9df", 2);
  drawText("중앙 실험 테이블", table.x - 68, table.y - 17, 14, "#344054", "800");
  drawBeaker(table.x - 70, table.y + 18, "#60a5fa");
  drawBeaker(table.x - 18, table.y + 18, "#f472b6");
  drawBeaker(table.x + 34, table.y + 18, "#34d399");
  drawNotebook(table.x + 76, table.y + 24);

  for (const chair of objects.filter((item) => item.kind === "chair")) {
    roundRect(chair.x - chair.w / 2, chair.y - chair.h / 2, chair.w, chair.h, 8, "#e2e8f0", "#94a3b8", 3);
    circle(chair.x - chair.w / 4, chair.y + chair.h / 4, 4, "#64748b");
    circle(chair.x + chair.w / 4, chair.y + chair.h / 4, 4, "#64748b");
  }

  roundRect(72, 526, 218, 146, 10, "#f8fafc", "#cbd5e1", 3);
  drawText("실험복 보관대", 116, 552, 15, "#334155", "800");
  for (const coat of objects.filter((item) => item.kind === "coat")) {
    drawLabCoat(coat.x, coat.y);
  }
}

function drawQuestionBadges() {
  for (const station of stationObjects) {
    const unit = stationByUnit.get(station.unitId);
    const solved = unit.questions.filter((item) => item.solved).length;
    const total = unit.questions.length;
    const startX = station.x - 65;
    const startY = station.y + station.h / 2 + 18;
    for (let i = 0; i < total; i += 1) {
      const x = startX + (i % 5) * 32;
      const y = startY + Math.floor(i / 5) * 24;
      circle(x, y, 9, i < solved ? unit.color : "#ffffff", unit.color, 2);
      drawText(String(i + 1), x - (i + 1 >= 10 ? 6 : 3), y + 4, 10, i < solved ? "#ffffff" : unit.color, "800");
    }
  }
}

function drawPlayer() {
  const walk = Math.sin(player.bob) * Math.min(1, Math.hypot(player.vx, player.vy) / 90);
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.facing + Math.PI / 2);

  ctx.fillStyle = "rgba(15, 23, 42, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 24, 18, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-6, 14);
  ctx.lineTo(-11, 29 + walk * 3);
  ctx.moveTo(6, 14);
  ctx.lineTo(11, 29 - walk * 3);
  ctx.stroke();

  ctx.strokeStyle = "#f3b58f";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-14, -6);
  ctx.lineTo(-22, 9 - walk * 2);
  ctx.moveTo(14, -6);
  ctx.lineTo(22, 9 + walk * 2);
  ctx.stroke();

  roundRect(-14, -14, 28, 34, 8, "#2563eb", "#1d4ed8", 2);
  roundRect(-9, 2, 18, 14, 4, "#60a5fa", "#1d4ed8", 1);
  circle(0, -30, 17, "#f6c39b", "#d18b65", 2);

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(0, -36, 18, Math.PI * 0.95, Math.PI * 2.08);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(-6, -31, 2, 0, Math.PI * 2);
  ctx.arc(6, -31, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9a3412";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -25, 6, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.restore();
}

function drawLabels() {
  for (const item of objects) {
    if (!isTargetVisible(item)) continue;
    if (!["station", "door"].includes(item.kind)) continue;
    const near = state.activeTarget && state.activeTarget.id === item.id;
    const y = item.y - item.h / 2 - 20;
    roundRect(item.x - 58, y - 18, 116, 26, 6, near ? "#1f2937" : "rgba(255,255,255,0.92)", near ? "#1f2937" : "#d7e0ea", 1);
    drawText(item.name, item.x - textOffset(item.name, 12), y, 12, near ? "#ffffff" : "#334155", "800");
  }
}

function drawBeaker(x, y, color) {
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 18);
  ctx.lineTo(x - 8, y + 14);
  ctx.lineTo(x + 8, y + 14);
  ctx.lineTo(x + 10, y - 18);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillRect(x - 7, y + 1, 14, 12);
}

function drawNotebook(x, y) {
  roundRect(x - 21, y - 16, 42, 32, 4, "#ffffff", "#94a3b8", 2);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let i = -6; i <= 8; i += 7) {
    ctx.beginPath();
    ctx.moveTo(x - 13, y + i);
    ctx.lineTo(x + 13, y + i);
    ctx.stroke();
  }
}

function drawMicroscope(x, y) {
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 20);
  ctx.quadraticCurveTo(x + 12, y - 4, x + 4, y - 28);
  ctx.stroke();
  roundRect(x - 4, y - 34, 28, 10, 4, "#64748b", "#475569", 1);
  roundRect(x - 22, y + 22, 46, 10, 4, "#64748b", "#475569", 1);
}

function drawLabCoat(x, y) {
  ctx.save();
  ctx.translate(x, y);
  roundRect(-16, -28, 32, 58, 6, "#ffffff", "#cbd5e1", 2);
  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(-8, -4);
  ctx.lineTo(0, 2);
  ctx.lineTo(8, -4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(0, 28);
  ctx.stroke();
  ctx.restore();
}

function leaf(x, y, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function circle(x, y, r, fill, stroke, lineWidth = 1) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function roundRect(x, y, w, h, r, fill, stroke, lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawText(text, x, y, size, color, weight = "600") {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Segoe UI", "Malgun Gothic", sans-serif`;
  ctx.fillText(text, x, y);
}

function textOffset(text, size) {
  return Math.min(56, text.length * size * 0.48);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

window.addEventListener("resize", resize);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "escape") {
    if (characterModal.open) {
      closeCharacterModal();
    } else {
      openCharacterModal();
    }
    event.preventDefault();
    return;
  }
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    input.keys.add(key);
    event.preventDefault();
  }
  if (["e", " "].includes(key)) {
    interact();
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  input.keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  input.pointerDown = true;
  input.dragId = event.pointerId;
  input.dragStartX = event.clientX;
  input.dragStartY = event.clientY;
  input.lookStartX = player.facing;
  input.lookStartY = camera.lookY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!input.pointerDown || input.dragId !== event.pointerId) return;
  const dx = event.clientX - input.dragStartX;
  const dy = event.clientY - input.dragStartY;
  player.facing = normalizeAngle(input.lookStartX - dx * 0.005);
  camera.lookX = 0;
  camera.lookY = clamp(input.lookStartY + dy * 0.0025, -0.22, 0.28);
});

canvas.addEventListener("pointerup", (event) => {
  if (input.dragId !== event.pointerId) return;
  const dx = event.clientX - input.dragStartX;
  const dy = event.clientY - input.dragStartY;
  if (Math.hypot(dx, dy) < 8) interact();
  input.pointerDown = false;
  input.dragId = null;
});

promptButton.addEventListener("click", interact);
mobileAction.addEventListener("click", interact);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
closeQuiz.addEventListener("click", () => closeDialog(quizModal));
closeCharacter.addEventListener("click", closeCharacterModal);
for (const button of characterButtons) {
  button.addEventListener("click", () => setCharacter(button.dataset.character));
}

stick.addEventListener("pointerdown", (event) => {
  stick.setPointerCapture(event.pointerId);
  updateStick(event);
});

stick.addEventListener("pointermove", updateStick);

stick.addEventListener("pointerup", () => {
  input.joyX = 0;
  input.joyY = 0;
  stickKnob.style.transform = "translate(-50%, -50%)";
});

stick.addEventListener("pointercancel", () => {
  input.joyX = 0;
  input.joyY = 0;
  stickKnob.style.transform = "translate(-50%, -50%)";
});

function updateStick(event) {
  const rect = stick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = event.clientX - cx;
  const dy = event.clientY - cy;
  const length = Math.hypot(dx, dy);
  const max = rect.width * 0.34;
  const limited = Math.min(length, max);
  const angle = Math.atan2(dy, dx);
  const knobX = Math.cos(angle) * limited;
  const knobY = Math.sin(angle) * limited;
  input.joyX = length > 6 ? knobX / max : 0;
  input.joyY = length > 6 ? knobY / max : 0;
  stickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
}

let diagnosticsFrame = 0;

function collectCanvasDiagnostics() {
  const width = canvas.width;
  const height = canvas.height;
  const stepX = Math.max(1, Math.floor(width / 48));
  const stepY = Math.max(1, Math.floor(height / 32));
  let samples = 0;
  let nonWhite = 0;
  let dark = 0;
  let saturated = 0;
  const buckets = new Set();

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = pixel;
      samples += 1;
      if (r < 245 || g < 245 || b < 245) nonWhite += 1;
      if (r + g + b < 250) dark += 1;
      if (Math.max(r, g, b) - Math.min(r, g, b) > 50) saturated += 1;
      buckets.add(`${r >> 4},${g >> 4},${b >> 4}`);
    }
  }

  return {
    width,
    height,
    samples,
    uniqueBuckets: buckets.size,
    nonWhiteRatio: Number((nonWhite / samples).toFixed(3)),
    darkRatio: Number((dark / samples).toFixed(3)),
    saturatedRatio: Number((saturated / samples).toFixed(3))
  };
}

function updateCanvasDiagnostics() {
  canvas.dataset.cameraState = JSON.stringify({
    playerX: Number(player.x.toFixed(2)),
    playerY: Number(player.y.toFixed(2)),
    cameraX: Number(camera.x.toFixed(2)),
    cameraY: Number(camera.y.toFixed(2)),
    facing: Number(player.facing.toFixed(3))
  });
  if (canvas.dataset.renderStats) return;
  diagnosticsFrame = (diagnosticsFrame + 1) % 30;
  if (diagnosticsFrame !== 1) return;
  canvas.dataset.renderStats = JSON.stringify(collectCanvasDiagnostics());
}

window.__scienceEscapeDiagnostics = collectCanvasDiagnostics;

resize();
updateHud();
openDialog(startModal);
