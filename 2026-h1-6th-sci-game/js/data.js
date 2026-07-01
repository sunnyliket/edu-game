const solutionPool = [
  { name: "식초", kind: "acid", cabbage: "붉은색", phenol: "거의 그대로", btb: "노란색" },
  { name: "레몬즙", kind: "acid", cabbage: "붉은색", phenol: "거의 그대로", btb: "노란색" },
  { name: "사이다", kind: "acid", cabbage: "붉은빛", phenol: "거의 그대로", btb: "노란색" },
  { name: "사과즙", kind: "acid", cabbage: "붉은빛", phenol: "거의 그대로", btb: "노란색" },
  { name: "우유", kind: "acid", cabbage: "연한 붉은빛", phenol: "거의 그대로", btb: "연한 노란색" },
  { name: "탄산수", kind: "acid", cabbage: "붉은빛", phenol: "거의 그대로", btb: "노란색" },
  { name: "묽은 염산", kind: "acid", cabbage: "붉은색", phenol: "거의 그대로", btb: "노란색" },
  { name: "빨랫비누 물", kind: "base", cabbage: "푸른빛", phenol: "붉은색", btb: "푸른색" },
  { name: "유리세정제", kind: "base", cabbage: "초록빛", phenol: "붉은색", btb: "푸른색" },
  { name: "묽은 암모니아수", kind: "base", cabbage: "초록빛", phenol: "붉은색", btb: "푸른색" },
  { name: "석회수", kind: "base", cabbage: "초록빛", phenol: "붉은색", btb: "푸른색" },
  { name: "묽은 수산화 나트륨", kind: "base", cabbage: "초록빛", phenol: "붉은색", btb: "푸른색" }
];

const worlds = [
  { id: "lab", order: 1, title: "실험실 섬", unit: "산과 염기", className: "lab", color: "#e44d67" },
  { id: "motion", order: 2, title: "경주장 섬", unit: "물체의 운동", className: "motion", color: "#e89a00" },
  { id: "plant", order: 3, title: "정원 섬", unit: "식물의 구조와 기능", className: "plant", color: "#3a9b52" },
  { id: "space", order: 4, title: "우주 정거장", unit: "지구의 운동", className: "space", color: "#4650b5" }
];

const MAP_WIDTH = 1180;
const MAP_HEIGHT = 2400;
const MAP_ZONE_HEIGHT = 600;

const mapNodes = {
  "lab-1": { x: 255, y: 120 }, "lab-2": { x: 735, y: 185 }, "lab-3": { x: 430, y: 255 }, "lab-4": { x: 805, y: 325 },
  "lab-5": { x: 515, y: 395 }, "lab-6": { x: 875, y: 465 }, "lab-7": { x: 410, y: 525 }, "lab-8": { x: 720, y: 575 },
  "motion-1": { x: 300, y: 705 }, "motion-2": { x: 790, y: 775 }, "motion-3": { x: 455, y: 845 }, "motion-4": { x: 840, y: 915 },
  "motion-5": { x: 560, y: 985 }, "motion-6": { x: 245, y: 1055 }, "motion-7": { x: 760, y: 1125 }, "motion-8": { x: 500, y: 1175 },
  "plant-1": { x: 300, y: 1305 }, "plant-2": { x: 775, y: 1375 }, "plant-3": { x: 420, y: 1445 }, "plant-4": { x: 830, y: 1515 },
  "plant-5": { x: 540, y: 1585 }, "plant-6": { x: 250, y: 1655 }, "plant-7": { x: 760, y: 1725 }, "plant-8": { x: 505, y: 1775 },
  "space-1": { x: 285, y: 1905 }, "space-2": { x: 760, y: 1975 }, "space-3": { x: 430, y: 2045 }, "space-4": { x: 825, y: 2115 },
  "space-5": { x: 565, y: 2185 }, "space-6": { x: 245, y: 2250 }, "space-7": { x: 765, y: 2310 }, "space-8": { x: 520, y: 2365 }
};

const stages = [
  {
    id: "lab-1", world: "lab", index: 1, type: "acidGuest", title: "오늘의 손님 1",
    mission: "손님 3명의 용액에 붉은 양배추 지시약을 떨어뜨리고 알맞은 카운터로 안내하세요.",
    hint: "붉은빛이면 산성 쪽, 초록빛이면 염기성 쪽으로 안내해 보세요.",
    indicator: "cabbage", count: 3, solutionIds: ["식초", "빨랫비누 물", "레몬즙"],
    twoTime: 95, threeTime: 60, twoMistakes: 1,
    criteria: ["미션 클리어", "95초 안에 손님 안내", "60초 안에 도움 없이 안내"],
    card: { id: "lab-card-1", title: "양배추 지시약", fact: "붉은 양배추 지시약은 산성에서 붉은빛, 염기성에서 초록빛을 보입니다.", color: "#ff6b7a" }
  },
  {
    id: "lab-2", world: "lab", index: 2, type: "acidStain", title: "얼룩 청소부",
    mission: "얼룩에 BTB 용액을 떨어뜨린 뒤 알맞은 청소액을 부어 식탁을 깨끗하게 하세요.",
    hint: "얼룩 색을 먼저 확인하고 산성 얼룩은 산성 청소액, 염기성 얼룩은 염기성 청소액을 골라요.",
    indicator: "btb", solutionIds: ["사이다", "유리세정제", "사과즙"],
    twoTime: 110, threeTime: 75, twoMistakes: 1,
    criteria: ["모든 얼룩 청소", "110초 안에 청소", "얼룩을 키우지 않고 청소"],
    card: { id: "lab-card-2", title: "BTB 용액", fact: "BTB 용액은 산성에서 노란색, 염기성에서 푸른색을 보입니다.", color: "#4bb9ff" }
  },
  {
    id: "lab-3", world: "lab", index: 3, type: "labDress", title: "실험실 출입 검사",
    mission: "보안경, 장갑, 가운을 캐릭터에게 끌어다 입혀 실험실 문을 여세요.",
    hint: "눈, 손, 몸을 보호하는 세 가지를 모두 갖추면 문이 열립니다.",
    twoTime: 80, threeTime: 45, twoMistakes: 1,
    criteria: ["문 열기", "80초 안에 준비", "45초 안에 한 번에 준비"],
    card: { id: "lab-card-3", title: "실험 준비", fact: "실험 전에는 보안경, 장갑, 가운을 알맞게 착용합니다.", color: "#ffd24d" }
  },
  {
    id: "lab-4", world: "lab", index: 4, type: "acidGuest", title: "오늘의 손님 2",
    mission: "손님 5명의 용액에 페놀프탈레인 용액을 떨어뜨리고 알맞은 카운터로 안내하세요.",
    hint: "붉은색으로 변하면 염기성입니다. 거의 그대로면 산성 쪽을 살펴보세요.",
    indicator: "phenol", count: 5, solutionIds: ["탄산수", "석회수", "묽은 암모니아수", "우유", "유리세정제"],
    twoTime: 120, threeTime: 80, twoMistakes: 1,
    criteria: ["손님 5명 안내", "120초 안에 안내", "80초 안에 도움 없이 안내"],
    card: { id: "lab-card-4", title: "페놀프탈레인 용액", fact: "페놀프탈레인 용액은 염기성에서 붉은색을 보입니다.", color: "#ff88bb" }
  },
  {
    id: "lab-5", world: "lab", index: 5, type: "acidStain", title: "반짝 식탁 마감",
    mission: "네 얼룩의 색 변화를 확인하고 알맞은 청소액으로 모두 닦으세요.",
    hint: "지시약을 먼저 떨어뜨려 얼룩마다 보이는 색을 차분히 비교해요.",
    indicator: "cabbage", solutionIds: ["묽은 염산", "묽은 수산화 나트륨", "레몬즙", "빨랫비누 물"],
    twoTime: 125, threeTime: 86, twoMistakes: 1,
    criteria: ["얼룩 4개 청소", "125초 안에 청소", "잘못 붓지 않고 청소"],
    card: { id: "lab-card-5", title: "용액 분류", fact: "지시약 색 변화를 보고 용액을 산성 또는 염기성으로 분류할 수 있습니다.", color: "#27b37e" }
  },
  // 참고 장르: 요리 시뮬레이션.
  {
    id: "lab-6", world: "lab", index: 6, type: "acidRecipe", title: "비누 공방",
    mission: "비누를 만들려면 염기성 재료가 필요해요. 솥에 염기성 재료 4개를 끌어 넣으세요.",
    hint: "붉은 양배추 지시약에서 초록빛이나 푸른빛으로 보이는 재료를 골라요.",
    recipeNeed: 4,
    twoTime: 115, threeTime: 75, twoMistakes: 1,
    criteria: ["염기성 재료 4개 넣기", "115초 안에 완성", "잘못 넣지 않고 완성"],
    card: { id: "lab-card-6", title: "비누 공방", fact: "생활 속 여러 물질도 지시약 색 변화를 보고 산성 또는 염기성으로 분류할 수 있습니다.", color: "#7bd9a5" }
  },
  // 참고 장르: 빠른 손 액션.
  {
    id: "lab-7", world: "lab", index: 7, type: "acidSwipe", title: "재빠른 분류",
    mission: "지시약 분무기를 누른 채 비커 위를 지나 색을 보고, 산성 통이나 염기성 통으로 분류하세요.",
    hint: "붉은빛이면 산성 통, 초록빛이면 염기성 통으로 스와이프해요.",
    indicator: "cabbage", solutionIds: ["식초", "레몬즙", "사이다", "우유", "빨랫비누 물", "유리세정제", "묽은 암모니아수", "석회수"],
    twoTime: 90, threeTime: 62, twoMistakes: 1,
    criteria: ["비커 8개 분류", "90초 안에 분류", "한 번에 모두 분류"],
    card: { id: "lab-card-7", title: "색으로 분류", fact: "지시약 색 변화를 반복해서 보면 산성/염기성 분류가 더 쉬워집니다.", color: "#ff91a3" }
  },
  // 참고 장르: 정리 정돈 퍼즐.
  {
    id: "lab-8", world: "lab", index: 8, type: "acidLife", title: "생활 속 산과 염기",
    mission: "양배추 지시약 색 변화 힌트를 보고 생활 물건 카드를 산성 박스와 염기성 박스로 나누세요.",
    hint: "카드의 작은 색 힌트를 보고 같은 성질의 박스로 옮겨요.",
    indicator: "cabbage", solutionIds: ["식초", "레몬즙", "사이다", "우유", "빨랫비누 물", "유리세정제", "묽은 암모니아수", "석회수"],
    twoTime: 120, threeTime: 82, twoMistakes: 1,
    criteria: ["카드 8개 분류", "120초 안에 분류", "한 번에 모두 분류"],
    card: { id: "lab-card-8", title: "생활 물질", fact: "주변 물질도 지시약 색 변화를 이용해 산성 또는 염기성으로 나눌 수 있습니다.", color: "#ffd0d8" }
  },
  {
    id: "motion-1", world: "motion", index: 1, type: "stopwatch", title: "스톱워치 챔피언 1",
    mission: "같은 출발선에서 같은 거리를 달리는 물체의 출발과 도착 순간을 누르고, 직접 잰 시간이 짧은 순서대로 카드를 놓으세요.",
    hint: "같은 거리를 움직일 때 직접 잰 시간이 짧을수록 더 빠릅니다.",
    runners: [
      { name: "노란 카트", ms: 2900, color: "#ffb000" },
      { name: "초록 보드", ms: 3600, color: "#39c46b" },
      { name: "파란 썰매", ms: 4300, color: "#3d8bfd" }
    ],
    twoTime: 160, threeTime: 115, twoMistakes: 1,
    criteria: ["시간을 재고 순위 완성", "160초 안에 순위 완성", "도움 없이 한 번에 완성"],
    card: { id: "motion-card-1", title: "시간 비교", fact: "같은 거리를 움직일 때 걸린 시간이 짧을수록 더 빠릅니다.", color: "#ffb000" }
  },
  {
    id: "motion-2", world: "motion", index: 2, type: "ghostRace", title: "고스트 레이스 1",
    mission: "같은 시간 동안 이동한 거리를 줄자로 확인하고 더 멀리 간 순서대로 놓으세요.",
    hint: "같은 시간 동안 더 멀리 이동한 물체가 더 빠릅니다.",
    racers: [
      { name: "빨간 공", distance: 72, color: "#ff6262" },
      { name: "초록 공", distance: 58, color: "#39c46b" },
      { name: "파란 공", distance: 84, color: "#3d8bfd" }
    ],
    twoTime: 135, threeTime: 95, twoMistakes: 1,
    criteria: ["이동 거리 확인", "135초 안에 순위 완성", "한 번에 거리 순서 완성"],
    card: { id: "motion-card-2", title: "거리 비교", fact: "같은 시간 동안 더 멀리 간 물체가 더 빠릅니다.", color: "#3d8bfd" }
  },
  {
    id: "motion-3", world: "motion", index: 3, type: "safeCity", title: "안전 도시",
    mission: "신호등, 멈춤 표지, 안전거리 표시를 알맞은 위치에 배치해 시민들이 안전하게 지나가게 하세요.",
    hint: "횡단보도에는 신호등, 골목 앞에는 멈춤 표지, 자동차 사이에는 안전거리 표시가 어울립니다.",
    placements: [
      { item: "신호등", target: "횡단보도 앞" },
      { item: "멈춤 표지", target: "골목 앞" },
      { item: "안전거리 표시", target: "차 사이" }
    ],
    twoTime: 110, threeTime: 72, twoMistakes: 1,
    criteria: ["거리 안전하게 만들기", "110초 안에 배치", "한 번에 배치"],
    card: { id: "motion-card-3", title: "안전한 이동", fact: "움직이는 물체 주변에서는 멈춤과 거리 두기가 안전에 도움이 됩니다.", color: "#69a84f" }
  },
  {
    id: "motion-4", world: "motion", index: 4, type: "stopwatch", title: "스톱워치 챔피언 2",
    mission: "같은 출발선에서 같은 거리를 달리는 네 물체의 시간을 직접 재고, 잰 시간이 짧은 순서대로 1위부터 놓으세요.",
    hint: "여러 물체를 비교할 때도 같은 거리에서 직접 잰 시간을 기준으로 순서를 정할 수 있어요.",
    runners: [
      { name: "주황 카트", ms: 2600, color: "#ff914d" },
      { name: "보라 보드", ms: 3300, color: "#8e65d7" },
      { name: "청록 썰매", ms: 3000, color: "#20b8a8" },
      { name: "회색 로봇", ms: 3900, color: "#7c8791" }
    ],
    twoTime: 185, threeTime: 130, twoMistakes: 1,
    criteria: ["네 물체 시간 재기", "185초 안에 순위 완성", "도움 없이 한 번에 완성"],
    card: { id: "motion-card-4", title: "빠르기 순서", fact: "측정한 시간을 비교하면 어느 물체가 더 빠른지 알 수 있습니다.", color: "#20b8a8" }
  },
  {
    id: "motion-5", world: "motion", index: 5, type: "ghostRace", title: "고스트 레이스 결승",
    mission: "줄자로 네 물체의 이동 거리를 확인하고 더 빠른 순서대로 카드를 정렬하세요.",
    hint: "거리가 가장 긴 물체를 1위 칸에 놓고 차례로 비교해 보세요.",
    racers: [
      { name: "노란 드론", distance: 88, color: "#ffd24d" },
      { name: "분홍 드론", distance: 76, color: "#ff75a8" },
      { name: "초록 드론", distance: 92, color: "#39c46b" },
      { name: "파란 드론", distance: 68, color: "#3d8bfd" }
    ],
    twoTime: 155, threeTime: 105, twoMistakes: 1,
    criteria: ["네 이동 거리 확인", "155초 안에 정렬", "한 번에 빠른 순서 정렬"],
    card: { id: "motion-card-5", title: "고스트 비교", fact: "나란히 움직인 모습을 보면 이동 거리 차이를 한눈에 비교할 수 있습니다.", color: "#ff75a8" }
  },
  // 참고 장르: 스포츠 리플레이.
  {
    id: "motion-6", world: "motion", index: 6, type: "slowReplay", title: "느린 화면 카메라",
    mission: "빠르게 지나간 물체를 느린 화면으로 다시 보고, 같은 거리에서 걸린 시간을 직접 재어 순서대로 놓으세요.",
    hint: "다시 보기 버튼을 눌러 천천히 본 뒤 출발과 도착 순간을 기록해요.",
    slowFactor: 0.25,
    runners: [
      { name: "빨간 카트", ms: 2500, color: "#ff6262" },
      { name: "초록 카트", ms: 3300, color: "#39c46b" },
      { name: "파란 카트", ms: 2900, color: "#3d8bfd" },
      { name: "노란 카트", ms: 3800, color: "#ffd24d" }
    ],
    twoTime: 180, threeTime: 125, twoMistakes: 1,
    criteria: ["느린 화면으로 시간 재기", "180초 안에 순위 완성", "한 번에 순위 완성"],
    card: { id: "motion-card-6", title: "느린 화면", fact: "빠른 움직임도 같은 거리에서 시간을 재면 비교할 수 있습니다.", color: "#8ac9ff" }
  },
  // 참고 장르: 정리·기록 게임.
  {
    id: "motion-7", world: "motion", index: 7, type: "speedTable", title: "빠르기 표 채우기",
    mission: "줄자와 스톱워치를 끌어 빈 칸을 채운 뒤, 표를 보고 빠른 순위 카드를 놓으세요.",
    hint: "거리와 시간을 모두 채운 뒤 같은 거리에서는 시간이 짧은 쪽을 먼저 놓아요.",
    rows: [
      { name: "수민", distance: 80, time: 16, color: "#ff914d" },
      { name: "지호", distance: 80, time: 12, color: "#3d8bfd" },
      { name: "하린", distance: 80, time: 20, color: "#39c46b" },
      { name: "도윤", distance: 80, time: 14, color: "#8e65d7" }
    ],
    twoTime: 165, threeTime: 112, twoMistakes: 1,
    criteria: ["표 완성 후 순위 정하기", "165초 안에 완성", "한 번에 순위 완성"],
    card: { id: "motion-card-7", title: "기록 표", fact: "거리와 시간을 표로 정리하면 빠르기를 비교하기 쉽습니다.", color: "#ffcf6b" }
  },
  // 참고 장르: 추리 카드 정렬.
  {
    id: "motion-8", world: "motion", index: 8, type: "speedDetective", title: "빠르기 탐정",
    mission: "거리와 시간을 살펴보고 가장 빠른 사람부터 1~4위 슬롯에 카드를 놓으세요.",
    hint: "거리가 모두 같을 때는 걸린 시간이 짧은 카드부터 놓아요.",
    cases: [
      { name: "수민", text: "100m를 18초에 걸어갔다", distance: 100, time: 18 },
      { name: "지호", text: "100m를 12초에 자전거로 갔다", distance: 100, time: 12 },
      { name: "하린", text: "100m를 15초에 달려갔다", distance: 100, time: 15 },
      { name: "도윤", text: "100m를 20초에 걸어갔다", distance: 100, time: 20 }
    ],
    twoTime: 120, threeTime: 80, twoMistakes: 1,
    criteria: ["사례 카드 순위 정하기", "120초 안에 정렬", "한 번에 정렬"],
    card: { id: "motion-card-8", title: "빠르기 탐정", fact: "같은 거리를 움직인 시간 정보를 비교해 빠른 순서를 알 수 있습니다.", color: "#b6a0ff" }
  },
  {
    id: "plant-1", world: "plant", index: 1, type: "plantHunt", title: "식물 부분 찾기",
    mission: "식물 그림에서 뿌리, 줄기, 잎, 꽃을 차례로 찾아 눌러 보세요.",
    hint: "흙 속은 뿌리, 위로 곧게 선 부분은 줄기, 넓게 펼쳐진 부분은 잎, 맨 위의 색 있는 부분은 꽃이에요.",
    targetOrder: ["뿌리", "줄기", "잎", "꽃"],
    twoTime: 90, threeTime: 55, twoMistakes: 1,
    criteria: ["네 부분 찾기", "90초 안에 찾기", "한 번에 차례대로 찾기"],
    card: { id: "plant-card-1", title: "식물 부분", fact: "식물은 뿌리, 줄기, 잎, 꽃처럼 서로 다른 부분으로 이루어져 있습니다.", color: "#46a35f" }
  },
  {
    id: "plant-2", world: "plant", index: 2, type: "waterJourney", title: "물의 여행",
    mission: "물뿌리개로 뿌리에 물을 주고, 물이 공기 중으로 빠져나가는 곳을 표시하세요.",
    hint: "뿌리에 준 물이 줄기를 따라 올라간 뒤 잎 쪽에서 밖으로 나갑니다.",
    plantName: "해바라기",
    twoTime: 95, threeTime: 62, twoMistakes: 1,
    criteria: ["물의 이동 관찰", "95초 안에 표시", "한 번에 표시"],
    card: { id: "plant-card-2", title: "해바라기", fact: "잎에서는 물이 공기 중으로 빠져나갑니다.", color: "#ffd24d" }
  },
  {
    id: "plant-3", world: "plant", index: 3, type: "organMatch", title: "기관 짝 잇기",
    mission: "뿌리, 줄기, 잎, 꽃을 기능 카드와 선으로 이어 주세요.",
    hint: "물을 흡수하는 곳, 물이 이동하는 통로 역할을 하는 곳, 물이 빠져나가는 곳, 씨와 관련된 곳을 떠올려요.",
    twoTime: 135, threeTime: 88, twoMistakes: 1,
    criteria: ["네 기관 연결", "135초 안에 연결", "한 번에 연결"],
    card: { id: "plant-card-3", title: "봉선화", fact: "뿌리는 물을 흡수하고 줄기는 물이 이동하는 통로 역할을 합니다.", color: "#ff7aa9" }
  },
  {
    id: "plant-4", world: "plant", index: 4, type: "stemDye", title: "줄기 단면 실험",
    mission: "흰 꽃이 꽂힌 컵에 빨간 물을 붓고, 줄기를 잘라 물이 지나간 자리를 찾으세요.",
    hint: "빨간 물을 먼저 컵에 붓고, 꽃 가장자리가 물든 뒤 가위로 줄기를 잘라 단면을 살펴봐요.",
    dyeTargets: 3,
    twoTime: 125, threeTime: 82, twoMistakes: 1,
    criteria: ["물이 지나간 자리 찾기", "125초 안에 표시", "한 번에 모두 표시"],
    card: { id: "plant-card-4", title: "줄기의 일", fact: "줄기는 물이 이동하는 통로 역할을 합니다.", color: "#ff5d4d" }
  },
  {
    id: "plant-5", world: "plant", index: 5, type: "seedJourney", title: "꽃에서 씨까지",
    mission: "꽃, 시든 꽃, 열매, 씨 카드를 알맞은 순서로 놓으세요.",
    hint: "꽃에서 시작해 시든 꽃을 지나 열매와 씨로 이어지는 흐름을 생각해 보세요.",
    order: ["꽃", "시든 꽃", "열매", "씨"],
    twoTime: 105, threeTime: 68, twoMistakes: 1,
    criteria: ["순서 완성", "105초 안에 완성", "한 번에 완성"],
    card: { id: "plant-card-5", title: "꽃과 씨", fact: "꽃은 씨가 만들어지는 것과 관련이 있습니다.", color: "#f0c73d" }
  },
  // 참고 장르: 정원 가꾸기.
  {
    id: "plant-6", world: "plant", index: 6, type: "pollinator", title: "꿀벌의 일",
    mission: "꿀벌을 꽃 5송이에 차례로 데려다 주어 꽃마다 작은 열매 표시가 생기게 하세요.",
    hint: "꿀벌을 꽃 위에 놓으면 그 꽃에 작은 열매 표시가 생깁니다.",
    flowerCount: 5,
    twoTime: 110, threeTime: 72, twoMistakes: 1,
    criteria: ["꽃 5송이에 꿀벌 데려가기", "110초 안에 완성", "한 번에 완성"],
    card: { id: "plant-card-6", title: "꽃과 열매", fact: "꽃이 피고 시들면 그 자리에 열매가 자라며 그 안에 씨가 만들어집니다.", color: "#ffb7c9" }
  },
  // 참고 장르: 도감 분류.
  {
    id: "plant-7", world: "plant", index: 7, type: "leafSort", title: "잎 모양 도감",
    mission: "잎 모양 카드를 알맞은 식물 그림 옆 슬롯에 붙이세요.",
    hint: "식물마다 잎 모양이 조금씩 달라요. 전체 그림의 잎을 보고 맞춰요.",
    plants: ["강낭콩", "봉선화", "해바라기", "토마토"],
    twoTime: 125, threeTime: 86, twoMistakes: 1,
    criteria: ["잎 카드 4장 붙이기", "125초 안에 완성", "한 번에 완성"],
    card: { id: "plant-card-7", title: "잎 모양", fact: "식물마다 잎 모양이 달라 식물의 특징을 살펴볼 수 있습니다.", color: "#7bd66d" }
  },
  // 참고 장르: 자라기 시뮬레이션.
  {
    id: "plant-8", world: "plant", index: 8, type: "plantGrowth", title: "씨에서 열매까지",
    mission: "시간 슬라이더로 식물이 변하는 모습을 관찰하고, 씨·새싹·잎과 줄기·꽃·열매 라벨을 순서대로 놓으세요.",
    hint: "슬라이더를 움직여 모습이 바뀌는 순서를 본 뒤 아래 슬롯에 라벨을 놓아요.",
    order: ["씨", "새싹", "잎과 줄기", "꽃", "열매"],
    twoTime: 140, threeTime: 95, twoMistakes: 1,
    criteria: ["자라는 순서 완성", "140초 안에 완성", "한 번에 완성"],
    card: { id: "plant-card-8", title: "식물의 자람", fact: "씨에서 새싹이 나오고 잎과 줄기가 자라며 꽃과 열매로 이어집니다.", color: "#9ddd74" }
  },
  {
    id: "space-1", world: "space", index: 1, type: "earthSpin", title: "지구 굴리기 1",
    mission: "지구본을 굴려 한국 위치가 새벽이 되도록 맞추세요.",
    hint: "한국 캐릭터가 밝은 쪽과 어두운 쪽 사이에 오도록 천천히 굴려 보세요.",
    target: "새벽",
    twoTime: 105, threeTime: 68, twoMistakes: 1,
    criteria: ["새벽 위치 맞추기", "105초 안에 맞추기", "한 번에 맞추기"],
    card: { id: "space-card-1", title: "낮과 밤", fact: "한국이 전등 쪽을 향하면 낮, 반대쪽을 향하면 밤으로 볼 수 있습니다.", color: "#4fa6dd" }
  },
  {
    id: "space-2", world: "space", index: 2, type: "skyScrub", title: "하늘 스크럽",
    mission: "시간 슬라이더를 움직여 하늘을 살펴보고 아침과 저녁 태양 위치 카드를 채우세요.",
    hint: "아침 위치와 저녁 위치를 슬라이더로 번갈아 보며 비교해요.",
    twoTime: 100, threeTime: 66, twoMistakes: 1,
    criteria: ["슬라이더 관찰 후 카드 채우기", "100초 안에 완성", "한 번에 카드 채우기"],
    card: { id: "space-card-2", title: "하늘 관찰", fact: "아침에는 태양이 동쪽, 저녁에는 서쪽 하늘에 보입니다.", color: "#ffd95d" }
  },
  {
    id: "space-3", world: "space", index: 3, type: "constellation", title: "별자리 위치 맞추기 1",
    mission: "지구 모형을 겨울 위치에 놓고 한밤중 보이는 별자리 카드를 끌어다 놓으세요.",
    hint: "겨울 위치를 먼저 채운 뒤 겨울철 별자리 카드 중 하나를 골라요.",
    season: "겨울", answers: ["오리온자리", "큰개자리"],
    twoTime: 125, threeTime: 85, twoMistakes: 1,
    criteria: ["겨울 위치와 별자리 맞추기", "125초 안에 완성", "한 번에 완성"],
    card: { id: "space-card-3", title: "겨울철 별자리", fact: "겨울철 밤하늘에서는 오리온자리와 큰개자리를 찾아볼 수 있습니다.", color: "#b6dcff" }
  },
  {
    id: "space-4", world: "space", index: 4, type: "earthSpin", title: "지구 굴리기 2",
    mission: "지구본을 굴려 한국 위치가 밤이 되도록 맞추세요.",
    hint: "한국 캐릭터가 전등 반대쪽 어두운 부분 가운데에 오도록 굴려요.",
    target: "밤",
    twoTime: 92, threeTime: 58, twoMistakes: 1,
    criteria: ["밤 위치 맞추기", "92초 안에 맞추기", "한 번에 맞추기"],
    card: { id: "space-card-4", title: "밤", fact: "한국 위치가 전등 반대쪽을 향하면 밤으로 볼 수 있습니다.", color: "#4650b5" }
  },
  {
    id: "space-5", world: "space", index: 5, type: "constellation", title: "별자리 위치 맞추기 2",
    mission: "지구 모형을 여름 위치에 놓고 한밤중 보이는 별자리 카드를 끌어다 놓으세요.",
    hint: "여름 위치를 먼저 찾고, 여름철 별자리 카드를 고르세요.",
    season: "여름", answers: ["백조자리", "거문고자리"],
    twoTime: 120, threeTime: 80, twoMistakes: 1,
    criteria: ["여름 위치와 별자리 맞추기", "120초 안에 완성", "한 번에 완성"],
    card: { id: "space-card-5", title: "여름철 별자리", fact: "여름철 밤하늘에서는 백조자리와 거문고자리를 찾아볼 수 있습니다.", color: "#8fdfff" }
  },
  // 참고 장르: 도트 잇기.
  {
    id: "space-6", world: "space", index: 6, type: "starConnect", title: "별자리 잇기",
    mission: "번호가 적힌 별을 1번부터 차례로 눌러 별자리 모양을 완성하세요.",
    hint: "작은 숫자를 보고 다음 별을 차례로 눌러요.",
    constellationName: "오리온자리",
    points: [
      { x: 36, y: 18 }, { x: 52, y: 30 }, { x: 43, y: 45 }, { x: 58, y: 45 },
      { x: 45, y: 62 }, { x: 62, y: 76 }, { x: 33, y: 78 }
    ],
    twoTime: 105, threeTime: 68, twoMistakes: 1,
    criteria: ["번호 순서대로 별 잇기", "105초 안에 완성", "한 번에 완성"],
    card: { id: "space-card-6", title: "별자리 모양", fact: "별자리는 밤하늘의 별을 이어 만든 모양입니다.", color: "#f5f0a0" }
  },
  // 참고 장르: 시간 슬라이더 관측.
  {
    id: "space-7", world: "space", index: 7, type: "dayStarMove", title: "하루 동안 별 보기",
    mission: "시간 슬라이더로 별자리 위치를 살펴보고, 시각 카드를 알맞은 그림 칸에 놓으세요.",
    hint: "슬라이더를 왼쪽에서 오른쪽으로 움직이며 같은 별자리가 보이는 자리를 비교해요.",
    labels: ["저녁", "한밤중 전", "한밤중 후", "새벽"],
    twoTime: 130, threeTime: 90, twoMistakes: 1,
    criteria: ["시각 카드 4장 맞추기", "130초 안에 완성", "한 번에 완성"],
    card: { id: "space-card-7", title: "하루 동안 별", fact: "하루 동안 같은 별자리도 시간에 따라 위치가 달라 보입니다.", color: "#a5b7ff" }
  },
  // 참고 장르: 풍경 카드 매칭.
  {
    id: "space-8", world: "space", index: 8, type: "seasonField", title: "계절별 야외 관측",
    mission: "계절 풍경 위의 흐릿한 별자리 모양을 보고 알맞은 이름 카드를 붙이세요.",
    hint: "봄, 여름, 가을, 겨울 풍경마다 보이는 별자리 이름을 하나씩 붙여요.",
    seasons: [
      { season: "봄", answer: "사자자리", scene: "꽃 핀 들판" },
      { season: "여름", answer: "백조자리", scene: "바닷가" },
      { season: "가을", answer: "페가수스자리", scene: "단풍길" },
      { season: "겨울", answer: "오리온자리", scene: "눈 덮인 들판" }
    ],
    twoTime: 135, threeTime: 94, twoMistakes: 1,
    criteria: ["4계절 별자리 붙이기", "135초 안에 완성", "한 번에 완성"],
    card: { id: "space-card-8", title: "계절별 별자리", fact: "계절에 따라 밤하늘에서 보이는 별자리가 달라집니다.", color: "#c7ddff" }
  }
];

const allCards = stages.map(stage => ({ ...stage.card, world: stage.world, stageId: stage.id }));
