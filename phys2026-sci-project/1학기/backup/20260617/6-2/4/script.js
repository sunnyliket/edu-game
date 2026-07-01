(() => {
  const TOTAL_KEYS = 10;
  const TOTAL_STAGES = 4;
  const STUDY_SECONDS = 10;

  const students = ["예승", "리원", "지후", "성현"];

  const stageQuestions = {
    1: [
      {
        category: "산과 염기",
        question: "지시약이 무엇인지 설명하시오.",
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
        question: "산성용액과 염기성용액을 분류한 것으로 옳은 것을 고르시오.",
        answer: "산성: 탄산수, 레몬즙, 묽은 염산 / 염기성: 석회수, 빨랫비눗 물, 묽은 수산화 나트륨 용액",
        choices: [
          "산성: 탄산수, 레몬즙, 묽은 염산 / 염기성: 석회수, 빨랫비눗 물, 묽은 수산화 나트륨 용액",
          "산성: 석회수, 빨랫비눗 물 / 염기성: 탄산수, 레몬즙",
          "산성: 물, 모래 / 염기성: 공기, 소금",
          "산성: 모든 투명한 액체 / 염기성: 모든 색깔 있는 액체"
        ],
        study: "탄산수, 레몬즙, 묽은 염산은 산성이고 석회수, 빨랫비눗 물, 묽은 수산화 나트륨 용액은 염기성입니다."
      },
      {
        category: "산과 염기",
        question: "페놀프탈레인 용액의 색깔이 변하지 않는 용액은 무엇인가요?",
        answer: "산성용액",
        choices: ["산성용액", "염기성용액", "빨랫비눗 물", "묽은 수산화 나트륨 용액"],
        study: "페놀프탈레인 용액은 염기성에서 붉은색 계열로 변하고 산성에서는 색이 거의 변하지 않습니다."
      },
      {
        category: "산과 염기",
        question: "산성 용액과 염기성 용액의 성질을 쓰시오.",
        answer: "산성용액은 탄산 칼슘을 녹이는 성질이있다, 염기서용액은 단백질을 녹이는 성질이있다",
        choices: [
          "산성용액은 탄산 칼슘을 녹이는 성질이있다, 염기서용액은 단백질을 녹이는 성질이있다",
          "산성용액은 단백질만 만들고, 염기서용액은 빛을 만든다",
          "산성용액과 염기서용액은 언제나 같은 색으로 변한다",
          "산성용액은 식물의 뿌리, 염기서용액은 식물의 잎이다"
        ],
        study: "산성 용액은 탄산 칼슘을 녹일 수 있고, 염기성 용액은 단백질을 녹일 수 있습니다."
      },
      {
        category: "산과 염기",
        question: "산성 용액에서 붉은 양배추 지시약은 무슨 계열로 변하는가요?",
        answer: "붉은색 계열",
        choices: ["붉은색 계열", "푸른색 계열", "노란색 계열", "검은색 계열"],
        study: "붉은 양배추 지시약은 산성 용액에서 붉은색 계열로 변합니다."
      },
      {
        category: "산과 염기",
        question: "염기성 용액에서 붉은 양배추 지시약은 무슨 계열로 변하는가요?",
        answer: "푸른색 계열이나 노란색 계열",
        choices: ["푸른색 계열이나 노란색 계열", "붉은색 계열", "흰색 계열", "투명한 색 계열"],
        study: "붉은 양배추 지시약은 염기성 용액에서 푸른색 계열이나 노란색 계열로 변합니다."
      },
      {
        category: "산과 염기",
        question: "산성 용액에 염기성을 계속 넣으면 색깔이 무슨색에서 무슨색으로 변하는가요?",
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
        question: "염기성용액에 산성 용액을 계속 넣으면 무슨 성질로 변하는가요?",
        answer: "산성 용액",
        choices: ["산성 용액", "염기성 용액", "단백질", "탄산 칼슘"],
        study: "염기성 용액에 산성 용액을 충분히 넣으면 용액의 성질이 산성 쪽으로 변할 수 있습니다."
      },
      {
        category: "산과 염기",
        question: "산성 용액은 무엇을 녹이는 성질이 있습니까?",
        answer: "탄산 칼슘",
        choices: ["탄산 칼슘", "단백질", "햇빛", "소리"],
        study: "산성 용액은 조개껍데기나 석회암에 들어 있는 탄산 칼슘을 녹이는 성질이 있습니다."
      },
      {
        category: "산과 염기",
        question: "염기성 용액은 무엇을 녹이는 성질이 있습니까?",
        answer: "단백질",
        choices: ["단백질", "탄산 칼슘", "지구의 자전", "시간"],
        study: "염기성 용액은 단백질을 녹이는 성질이 있습니다."
      }
    ],
    2: [
      {
        category: "물체의 운동",
        question: "시간이 지남에 따라 물체의 위치가 변할 때 물체를 뭐라고 하나요?",
        answer: "운동",
        choices: ["운동", "광합성", "증산 작용", "중화"],
        study: "시간에 따라 물체의 위치가 변하면 그 물체는 운동하고 있다고 말합니다."
      },
      {
        category: "물체의 운동",
        question: "속력은 1초, 1시간 등과 같이 일정한 시간 동안 물체가 이동한 거리를 말하나요? OX",
        answer: "O",
        choices: ["O", "X"],
        study: "속력은 일정한 시간 동안 물체가 이동한 거리로 나타냅니다."
      },
      {
        category: "물체의 운동",
        question: "운동한 물체는 위치가 변한 물체이다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "시간이 지남에 따라 위치가 변하는 물체를 운동하는 물체라고 부릅니다."
      },
      {
        category: "물체의 운동",
        question: "다음 중 과학적으로 볼 때 '운동한 물체'에 해당하는 것을 모두 고르시오.",
        answer: "2. 에스컬레이터를 타고 이동하는 사람",
        choices: [
          "1. 가만히 서 있는 나무",
          "2. 에스컬레이터를 타고 이동하는 사람",
          "3. 멈춰 있는 신호등",
          "4. 바구니에 담겨 움직이지 않는 사과"
        ],
        study: "에스컬레이터를 타고 이동하는 사람은 시간이 지나며 위치가 변하므로 과학적으로 운동한 물체에 해당합니다."
      },
      {
        category: "물체의 운동",
        question: "다음 중 시간에 따라 빠르기가 변하지 않고 일정한 운동을 하는 물체로 볼 수 없는 것은?",
        answer: "3. 출발하는 자동차",
        choices: [
          "1. 에스컬레이터",
          "2. 컨베이어 벨트",
          "3. 출발하는 자동차",
          "4. 일정한 속도로 달리는 유람선",
          "5. 일정한 빠르기로 회전하는 회전목마"
        ],
        study: "정지해 있다가 출발하는 자동차는 빠르기가 변하므로 속력이 일정한 운동으로 보기 어렵습니다."
      },
      {
        category: "물체의 운동",
        question: "움직이고 있는 차는 운동 중이다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "움직이는 차는 위치가 계속 바뀌므로 운동 중입니다."
      },
      {
        category: "물체의 운동",
        question: "멈춰 있는 공은 운동하고 있다. OX",
        answer: "X",
        choices: ["O", "X"],
        study: "멈춰 있는 공은 시간이 흘러도 위치 변화가 없으므로 운동하고 있지 않습니다."
      },
      {
        category: "물체의 운동",
        question: "굴러가는 공은 운동하고 있다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "굴러가는 공은 시간에 따라 위치가 계속 이동하므로 운동하고 있습니다."
      },
      {
        category: "물체의 운동",
        question: "달리는 기차는 운동하고 있다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "달리는 기차는 시간에 따라 위치가 달라지므로 운동하고 있는 것입니다."
      },
      {
        category: "물체의 운동",
        question: "움직이는 케이블카는 운동하고 있다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "움직이는 케이블카는 시간이 지남에 따라 위치가 이동하므로 운동 중입니다."
      }
    ],
    3: [
      {
        category: "식물의 구조와 기능",
        question: "식물의 뿌리가 가진 주요 기능 중 하나로, 땅속의 물과 무기 양분을 흡수하는 것 외에 식물체가 쓰러지지 않도록 지탱해 주는 기능은 무엇인가요?",
        answer: "지지작용",
        choices: ["지지작용", "광합성", "자전", "중화작용"],
        study: "식물체가 땅 위에 똑바로 서서 쓰러지지 않도록 지지해 주는 역할을 지지작용이라고 부릅니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "식물은 필요한 양분을 주로 잎에서 만듭니다. 식물이 빛과 물, 이산화 탄소를 이용하여 스스로 양분을 만드는 작용은 무엇인가요?",
        answer: "광합성",
        choices: ["광합성", "운동", "지시약 반응", "탄산 칼슘 녹이기"],
        study: "태양의 빛에너지를 이용하여 물과 이산화 탄소로부터 유기 양분을 만드는 화학 작용을 광합성이라 합니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "뿌리에 있는 뿌리털은 표면적을 넓혀주어 물과 양분을 더 잘 흡수할 수 있도록 돕습니다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "뿌리털은 흙과 닿는 표면적을 아주 넓혀주어 물과 무기 양분을 한층 효율적으로 흡수합니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "꽃의 구조로 만들어진 꽃가루가 암술머리에 붙는 현상을 '수분(꽃가루받이)'이라고 합니다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "수술의 꽃가루가 암술머리에 닿는 수분 현상이 일어나야 비로소 식물이 열매와 씨앗을 맺을 수 있습니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "생물은 모두 어떤 것으로 이루어져 있나요?",
        answer: "세포",
        choices: ["세포", "기공", "탄산 칼슘", "시험관"],
        study: "인간, 식물, 동물 등 모든 생명체의 구조적, 기능적 기본 단위는 세포입니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "잎의 표면에는 작은 구멍인 ( ) 이 있습니다. 이것은 무엇일까요?",
        answer: "기공",
        choices: ["기공", "뿌리털", "암술", "수술"],
        study: "기공은 잎 뒷면에 주로 있는 미세한 구멍으로, 산소와 이산화 탄소, 수증기 등이 출입합니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "잎에 도달한 물이 수증기가 되어 기공을 통해 밖으로 빠져나가는 것을 무엇이라 하나요?",
        answer: "증산작용",
        choices: ["증산작용", "광합성", "지지작용", "수분"],
        study: "식물체 안의 물이 기공을 통해 외부 공기 중으로 날아가는 현상을 증산작용이라고 부릅니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "식물 세포는 세포막으로 둘러싸여 있고 그 안에 핵이 있습니다. 식물 세포막 바깥쪽에는 세포벽이 있습니까? OX",
        answer: "O",
        choices: ["O", "X"],
        study: "식물 세포는 동물 세포와 다르게 세포막 외곽에 단단한 세포벽을 갖고 있어 형태를 고정해 줍니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "생물을 이루고 있는 기본 단위를 뭐라고 하나요?",
        answer: "세포막",
        choices: ["세포막", "세포", "세포벽", "핵"],
        study: "세포막은 세포 내부를 둘러싸서 보호하는 막입니다."
      },
      {
        category: "식물의 구조와 기능",
        question: "광합성에서는 햇빛이 필요하다. OX",
        answer: "O",
        choices: ["O", "X"],
        study: "광합성은 엽록체가 빛에너지를 화학에너지로 전환하는 과정이므로 햇빛이 필수 조건입니다."
      }
    ],
    4: [
      {
        category: "지구의 운동",
        question: "하루 동안 태양과 별의 위치는 모두 ( ) 하늘에서 ( ) 하늘로 달라집니다. ( ) 여기에 들어갈 말은 무엇인가요?",
        answer: "동쪽, 서쪽",
        choices: ["동쪽, 서쪽", "서쪽, 동쪽", "남쪽, 북쪽", "북쪽, 남쪽"],
        study: "지구가 서쪽에서 동쪽으로 자전하기 때문에 하늘의 천체들은 겉보기에 동쪽에서 떠올라 서쪽으로 지는 것처럼 보입니다."
      },
      {
        category: "지구의 운동",
        question: "지구는 기울어진 자전축을 중심으로 하루에 한 바퀴씩 서쪽에서 동쪽으로 회전합니다. 이것을 무엇이라 하나요?",
        answer: "지구의 자전",
        choices: ["지구의 자전", "지구의 공전", "지구의 중력", "지구의 대기"],
        study: "지구가 자전축을 기준으로 매일 한 바퀴씩 도는 운동을 지구의 자전이라고 일컫습니다."
      },
      {
        category: "지구의 운동",
        question: "지구가 태양을 중심으로 1년에 한 바퀴씩 도는 운동을 무엇이라고 하나요?",
        answer: "공전",
        choices: ["공전", "자전", "자전축 기울임", "일주 운동"],
        study: "지구가 태양 주위의 타원 궤도를 따라 일 년에 한 바퀴씩 도는 운행 운동을 공전이라고 합니다."
      },
      {
        category: "지구의 운동",
        question: "지구의 공전 방향은 어느 방향인가요?",
        answer: "서쪽에서 동쪽",
        choices: ["서쪽에서 동쪽", "동쪽에서 서쪽", "남쪽에서 북쪽", "북쪽에서 남쪽"],
        study: "지구의 자전과 마찬가지로 공전 역시 태양을 기준으로 서쪽에서 동쪽 방향으로 회전합니다."
      },
      {
        category: "지구의 운동",
        question: "태양 빛이 비치지 않는 곳은 무엇이 되나요?",
        answer: "밤",
        choices: ["밤", "낮", "계절", "기온"],
        study: "지구는 둥글기 때문에 태양의 반대편에 서 있는 어두운 구역은 밤이 됩니다."
      },
      {
        category: "지구의 운동",
        question: "태양 빛이 비치는 곳은 무엇이 되나요?",
        answer: "낮",
        choices: ["낮", "밤", "자전축", "남중 고도"],
        study: "태양의 직사광선이 내리쬐는 지구의 밝은 쪽 지역은 낮이 됩니다."
      },
      {
        category: "지구의 운동",
        question: "지구의 자전 방향은 어느 방향에서 어느 방향인가요?",
        answer: "서쪽에서 동쪽으로",
        choices: ["서쪽에서 동쪽으로", "동쪽에서 서쪽으로", "남쪽에서 북쪽으로", "북쪽에서 남쪽으로"],
        study: "지구는 북극 상공에서 내려다볼 때 서쪽에서 동쪽으로(시계 반대 방향) 자전하고 있습니다."
      },
      {
        category: "지구의 운동",
        question: "지구의 자전으로 인해 나타나는 현상은 무엇인가요?",
        answer: "낮과 밤이 반복된다",
        choices: ["낮과 밤이 반복된다", "계절이 변한다", "일식이 일어난다", "밀물과 썰물이 생긴다"],
        study: "지구가 24시간마다 서에서 동으로 한 바퀴씩 자전하면서 태양을 마주 보는 면이 달라지므로 낮과 밤이 반복됩니다."
      },
      {
        category: "지구의 운동",
        question: "지구가 자전축이 기울어진 채 공전하여 나타나는 현상은 무엇인가요?",
        answer: "계절의 변화",
        choices: ["계절의 변화", "낮과 밤의 반복", "일식과 월식", "태양의 흑점 발생"],
        study: "지구 자전축이 23.5도 기울어 공전함으로써 한 지역에 내리쬐는 태양 에너지량이 계절마다 달라져 봄, 여름, 가을, 겨울의 기후가 변합니다."
      },
      {
        category: "지구의 운동",
        question: "하루 동안 태양이 정남쪽에 와서 고도가 가장 높을 때의 고도는 무엇인가요?",
        answer: "남중 고도",
        choices: ["남중 고도", "북중 고도", "정오 고도", "수평 고도"],
        study: "태양이 하늘 정남쪽에 오는 남중 시각에 고도가 가장 높으며, 이를 태양의 남중 고도라고 정의합니다."
      }
    ]
  };

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
    hearts: 3,
    truthCount: 0,
    stageTruthCount: 0,
    stage: 1,
    awaitingKey: false,
    inTruthRoom: false,
    timerId: 0,
    secondsLeft: STUDY_SECONDS
  };

  const elements = {
    startModal: document.getElementById("start-modal"),
    truthModal: document.getElementById("truth-modal"),
    winModal: document.getElementById("win-modal"),
    stageClearModal: document.getElementById("stage-clear-modal"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    nextStageButton: document.getElementById("next-stage-button"),
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
    stageCount: document.getElementById("stage-count"),
    crewList: document.getElementById("crew-list"),
    truthTitle: document.getElementById("truth-title"),
    truthMessage: document.getElementById("truth-message"),
    truthAnswer: document.getElementById("truth-answer"),
    studyNote: document.getElementById("study-note"),
    studySeconds: document.getElementById("study-seconds"),
    timerBar: document.getElementById("timer-bar"),
    winSummary: document.getElementById("win-summary"),
    stageClearTitle: document.getElementById("stage-clear-title"),
    stageClearSummary: document.getElementById("stage-clear-summary")
  };

  function shuffle(items) {
    const mixed = [...items];
    for (let index = mixed.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [mixed[index], mixed[target]] = [mixed[target], mixed[index]];
    }
    return mixed;
  }

  function prepareStageQuestions() {
    const list = stageQuestions[state.stage] || [];
    state.questions = shuffle(list);
    state.roundIndex = 0;
    state.keys = 0;
    state.stageTruthCount = 0;
  }

  function setupGame() {
    state.stage = 1;
    state.hearts = 3;
    state.truthCount = 0;
    prepareStageQuestions();
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

      const hearts = document.createElement("span");
      hearts.className = "crew-hearts";
      hearts.setAttribute("aria-label", `남은 하트 ${state.hearts}개`);

      for (let index = 0; index < 3; index += 1) {
        const heart = document.createElement("span");
        heart.className = "crew-heart";
        if (index >= state.hearts) {
          heart.classList.add("is-lost");
        }
        heart.textContent = "♥";
        hearts.append(heart);
      }

      const name = document.createElement("span");
      name.className = "crew-name";
      name.textContent = student;

      chip.append(hearts);
      chip.append(name);
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
    elements.stageCount.textContent = `${state.stage} / ${TOTAL_STAGES}`;
    renderKeyRack();
  }

  function currentQuestion() {
    return state.questions[state.roundIndex];
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) {
      if (state.stage >= TOTAL_STAGES) {
        showWin();
      } else {
        showStageClear();
      }
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
    loseTeamHeart();
    elements.feedback.className = "feedback is-danger";
    elements.feedback.textContent = `오답이다. 하트가 하나 사라졌다. 남은 하트는 ${state.hearts}개, 네 명 모두 진실의 방으로 향한다.`;
    window.setTimeout(enterTruthRoom, 700);
  }

  function loseTeamHeart() {
    state.hearts = Math.max(0, state.hearts - 1);
    renderCrew("studying");
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
      if (state.stage >= TOTAL_STAGES) {
        window.setTimeout(showWin, 350);
      } else {
        window.setTimeout(showStageClear, 350);
      }
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
    state.stageTruthCount += 1;
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

  function showStageClear() {
    clearInterval(state.timerId);
    state.inTruthRoom = false;
    state.awaitingKey = false;
    elements.stageClearTitle.textContent = `스테이지 ${state.stage} 완료!`;
    elements.stageClearSummary.textContent = `이번 스테이지에서 진실의 방에 ${state.stageTruthCount}번 다녀왔습니다. (총 누적 오답 공부: ${state.truthCount}회)`;
    elements.stageClearModal.hidden = false;
  }

  function nextStage() {
    elements.stageClearModal.hidden = true;
    state.stage += 1;
    prepareStageQuestions();
    renderKeyLayer();
    renderKeyRack();
    renderQuestion();
    updateHud();
  }

  function showWin() {
    clearInterval(state.timerId);
    state.inTruthRoom = false;
    state.awaitingKey = false;
    elements.winSummary.textContent = `예승, 리원, 지후, 성현이 함께 총 ${TOTAL_STAGES}개의 스테이지를 돌파하며 열쇠 ${TOTAL_KEYS * TOTAL_STAGES}개를 모두 찾았다. 전원 진실의 방은 총 ${state.truthCount}번 다녀왔고, 과학실 문은 드디어 활짝 열렸다.`;
    elements.winModal.hidden = false;
  }

  function isStartModalOpen() {
    return elements.startModal && !elements.startModal.hidden && !elements.startModal.classList.contains("is-closed");
  }

  function startGame() {
    if (!isStartModalOpen()) {
      return;
    }

    elements.startModal.hidden = true;
    elements.startModal.classList.add("is-closed");
    document.body.classList.add("is-playing");
    renderQuestion();
  }

  function restartGame() {
    elements.winModal.hidden = true;
    elements.truthModal.hidden = true;
    elements.stageClearModal.hidden = true;
    setupGame();
  }

  function getSceneTime() {
    if (window.performance && typeof window.performance.now === "function") {
      return window.performance.now();
    }
    return Date.now();
  }

  function getReducedMotionPreference() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function requestSceneMotionFrame(callback) {
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(callback);
      return;
    }
    window.setTimeout(() => callback(getSceneTime()), 16);
  }

  function bindClick(element, handler) {
    if (element) {
      element.addEventListener("click", handler);
    }
  }

  function isPointInsideElement(event, element, padding = 0) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return event.clientX >= rect.left - padding &&
      event.clientX <= rect.right + padding &&
      event.clientY >= rect.top - padding &&
      event.clientY <= rect.bottom + padding;
  }

  function handleStartFallback(event) {
    if (!isStartModalOpen()) {
      return;
    }

    const target = event.target;
    const clickedInsideStartModal = target && typeof target.closest === "function" && target.closest("#start-modal");
    const clickedNearStartButton = isPointInsideElement(event, elements.startButton, 32);

    if (clickedInsideStartModal || clickedNearStartButton) {
      event.preventDefault();
      startGame();
    }
  }

  const sceneMotion = {
    pointerX: 0,
    pointerY: 0,
    startTime: getSceneTime(),
    reduceMotion: getReducedMotionPreference()
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

  function applySceneMotion(now = getSceneTime()) {
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

    requestSceneMotionFrame(applySceneMotion);
  }

  window.addEventListener("pointermove", (event) => {
    updateSceneDepth(event.clientX, event.clientY);
  });

  window.addEventListener("pointerleave", () => {
    updateSceneDepth(window.innerWidth / 2, window.innerHeight / 2);
  });

  bindClick(elements.startButton, startGame);
  bindClick(elements.restartButton, restartGame);
  bindClick(elements.nextStageButton, nextStage);
  bindClick(elements.studyDoneButton, leaveTruthRoom);
  document.addEventListener("pointerup", handleStartFallback, true);

  setupGame();
  applySceneMotion();
})();
