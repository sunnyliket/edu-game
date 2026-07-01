// 6학년 1학기 과학 퀴즈 및 넌센스 퀴즈 데이터

// 과학 퀴즈 (산성과 염기성: 20문제, 물체의 운동: 13문제)
const scienceQuizzes = {
    1: [ // 1단계: 산성과 염기성
        {
            id: 101,
            question: "리트머스 종이에 반응하는 물질을 산성과 염기성으로 올바르게 분류한 것은 무엇인가요?\n[보기: 탄산수, 레몬즙, 석회수, 묽은 수산화 나트륨 용액, 묽은 염산, 빨랫비누 물]",
            type: "CHOICE",
            options: [
                "산성: 탄산수, 레몬즙, 묽은 염산 | 염기성: 석회수, 빨랫비누 물, 묽은 수산화 나트륨 용액",
                "산성: 석회수, 레몬즙, 묽은 염산 | 염기성: 탄산수, 빨랫비누 물, 묽은 수산화 나트륨 용액",
                "산성: 탄산수, 빨랫비누 물, 묽은 염산 | 염기성: 석회수, 레몬즙, 묽은 수산화 나트륨 용액",
                "산성: 탄산수, 레몬즙, 석회수 | 염기성: 묽은 염산, 빨랫비누 물, 묽은 수산화 나트륨 용액"
            ],
            answer: 0,
            explanation: "탄산수, 레몬즙, 묽은 염산은 산성 용액이며, 석회수, 빨랫비누 물, 묽은 수산화 나트륨 용액은 염기성 용액입니다."
        },
        {
            id: 102,
            question: "레몬즙은 산성 용액에 해당하나요?",
            type: "OX",
            answer: true, // O
            explanation: "레몬즙은 신맛이 나는 대표적인 산성 용액입니다."
        },
        {
            id: 103,
            question: "표백제는 염기성 용액에 해당하나요?",
            type: "OX",
            answer: true, // O
            explanation: "표백제나 세제류는 대부분 단백질을 녹이는 성질을 가진 염기성 용액입니다."
        },
        {
            id: 104,
            question: "붉은색 양배추 지시약을 넣었을 때 산성 용액은 색깔이 변하나요?",
            type: "OX",
            answer: true, // O
            explanation: "붉은색 양배추 지시약을 산성 용액에 넣으면 붉은색 계열로 색깔이 변합니다."
        },
        {
            id: 105,
            question: "페놀프탈레인 용액을 염기성 용액에 넣었을 때 색깔이 변하나요?",
            type: "OX",
            answer: true, // O
            explanation: "무색의 페놀프탈레인 용액은 염기성 용액을 만나면 붉은색으로 변합니다. 산성이나 중성에서는 변하지 않습니다."
        },
        {
            id: 106,
            question: "산성 용액에 붉은색 양배추 지시약을 넣으면 붉은색 계열로 변합니다.",
            type: "OX",
            answer: true, // O
            explanation: "양배추 지시약은 산성 용액에서 붉은색 계열로 변하는 성질이 있습니다."
        },
        {
            id: 107,
            question: "붉은색 양배추 지시약을 넣었을 때 염기성 용액은 무슨 색깔 계열로 변하나요?",
            type: "CHOICE",
            options: [
                "푸른색 계열이나 노란색 계열",
                "붉은색 계열이나 분홍색 계열",
                "투명한 무색",
                "검은색 계열"
            ],
            answer: 0,
            explanation: "양배추 지시약은 염기성 용액에서 푸른색 계열이나 노란색 계열로 변합니다."
        },
        {
            id: 108,
            question: "땅이나 물 등이 산성으로 변하는 것을 산성화라고 합니다. 이로 인한 피해 사례로 알맞은 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "산성비가 계속 내리면 삼림(숲)이 황폐해집니다.",
                "가뭄이 발생하여 식수 공급이 어려워집니다.",
                "지진이 자주 발생하여 도로가 파손됩니다.",
                "바닷물이 얼어서 빙하 면적이 넓어집니다."
            ],
            answer: 0,
            explanation: "대기오염물질로 인해 내리는 산성비는 땅과 호수를 산성화시켜 숲을 황폐하게 만듭니다."
        },
        {
            id: 109,
            question: "산성과 염기성의 물질에 대해 알 수 있는 사실로 알맞은 것을 고르세요.",
            type: "CHOICE",
            options: [
                "레몬즙이나 식초 등은 산성 용액의 대표적인 예시이다.",
                "염기성 용액은 항상 무색무취이며 물과 완전히 같다.",
                "산성과 염기성 용액은 지시약을 넣어도 색 변화가 전혀 없다.",
                "모든 화학 용액은 맛을 보아 산성과 염기성을 구별해야 한다."
            ],
            answer: 0,
            explanation: "신맛이 나는 식초, 레몬즙 등은 산성 용액입니다. 화학 용액은 위험하므로 맛을 보면 안 됩니다."
        },
        {
            id: 110,
            question: "산성 용액에 조개껍데기를 넣으면 조개껍데기가 녹을까요?",
            type: "OX",
            answer: true, // O
            explanation: "조개껍데기는 탄산칼슘 성분으로 이루어져 있어, 산성 용액에 넣으면 이산화 탄소 기체가 발생하며 녹습니다."
        },
        {
            id: 111,
            question: "탄산수와 빨랫비누 물에 각각 페놀프탈레인 용액을 넣었을 때의 차이점을 올바르게 설명한 것은?",
            type: "CHOICE",
            options: [
                "빨랫비누 물은 색이 붉게 변하고 탄산수는 색이 변하지 않는다.",
                "탄산수는 색이 붉게 변하고 빨랫비누 물은 색이 변하지 않는다.",
                "둘 다 붉게 변한다.",
                "둘 다 색이 변하지 않는다."
            ],
            answer: 0,
            explanation: "페놀프탈레인 용액은 염기성(빨랫비누 물)에서만 붉게 변하고, 산성(탄산수)에서는 색이 변하지 않습니다."
        },
        {
            id: 112,
            question: "산성 용액에 염기성 용액을 계속 넣으면 용액의 성질은 최종적으로 어떻게 변하나요?",
            type: "CHOICE",
            options: [
                "염기성 용액으로 변한다.",
                "더 강한 산성 용액으로 변한다.",
                "용액의 성질이 완전히 사라져 물이 된다.",
                "중성 상태로 영원히 유지된다."
            ],
            answer: 0,
            explanation: "산성 용액에 염기성 용액을 계속 넣으면 산성이 점점 약해지다가 중성을 거쳐 결국 염기성 용액으로 성질이 변합니다."
        },
        {
            id: 113,
            question: "토양이 산성화되었을 때 발생하는 문제점으로 가장 적절한 것은?",
            type: "CHOICE",
            options: [
                "식물이 정상적으로 성장하지 못한다.",
                "땅이 너무 굳어져서 갈라진다.",
                "땅속 지열이 급격히 상승한다.",
                "흙속의 수분이 모두 증발한다."
            ],
            answer: 0,
            explanation: "토양이 산성화되면 식물이 필요한 양분을 흡수하기 어려워져 제대로 성장할 수 없습니다."
        },
        {
            id: 114,
            question: "실험 중 눈이나 손에 실험하던 화학 용액이 들어갔을 때의 올바른 대처 요령은 무엇인가요?",
            type: "CHOICE",
            options: [
                "흐르는 물에 대고 충분히 씻어내며 도움을 요청한다.",
                "수건이나 옷소매로 꾹 눌러서 닦아내고 가만히 있는다.",
                "염기성 용액이 묻었을 때는 산성인 식초를 발라 중화시킨다.",
                "안약을 즉시 넣고 상처가 가라앉을 때까지 기다린다."
            ],
            answer: 0,
            explanation: "화학 약품이 몸에 묻거나 눈에 들어갔을 때는 즉시 흐르는 물로 깨끗이 씻어내야 합니다."
        },
        {
            id: 115,
            question: "우리 일상생활에서 염기성 용액을 사용하는 예시 2가지를 고르세요.",
            type: "CHOICE",
            options: [
                "표백제, 유리 세정제",
                "식초, 레몬즙",
                "탄산수, 오렌지 주스",
                "염산, 아스피린 용액"
            ],
            answer: 0,
            explanation: "유리 세정제나 표백제는 때와 얼룩(단백질 성분 등)을 지우기 위해 염기성 용액을 사용합니다."
        },
        {
            id: 116,
            question: "산성비로 인한 대표적인 피해 사례로 알맞은 것을 고르세요.",
            type: "CHOICE",
            options: [
                "숲의 나무들이 말라 죽고 대리석 문화유산이 부식되어 훼손된다.",
                "기후 변화로 인해 지진과 쓰나미가 자주 발생한다.",
                "토양의 영양분이 늘어나 잡초가 비정상적으로 많이 자란다.",
                "대기가 깨끗해지고 가뭄 피해가 해소된다."
            ],
            answer: 0,
            explanation: "산성비는 식물의 잎을 상하게 하고 토양을 산성화시키며, 대리석(탄산칼슘)으로 된 문화유산을 녹여 훼손시킵니다."
        },
        {
            id: 117,
            question: "산성 용액은 탄산칼슘(달걀껍데기, 조개껍데기 등)을 녹이는 성질이 있습니다. 그렇다면 염기성 용액은 주로 무엇을 녹이는 성질이 있나요?",
            type: "CHOICE",
            options: [
                "단백질",
                "유리",
                "플라스틱",
                "철과 알루미늄 등 금속"
            ],
            answer: 0,
            explanation: "염기성 용액은 단백질을 녹이는 성질이 있어, 피부나 비누 때 등을 씻어내는 세제류에 많이 쓰입니다."
        },
        {
            id: 118,
            question: "우리 주변 환경이 점차 산성으로 변해가는 '산성화'의 대표적인 피해 사례 종류들을 고르세요.",
            type: "CHOICE",
            options: [
                "산성비, 토양 산성화, 해양(바다) 산성화",
                "대기오염, 소음공해, 지구온난화",
                "오존층 파괴, 엘니뇨 현상, 기후 난민",
                "황사 현상, 미세먼지 축적, 열섬 현상"
            ],
            answer: 0,
            explanation: "인간 활동으로 배출된 이산화 탄소와 오염물질 때문에 산성비, 토양 산성화, 해양 산성화가 진행되고 있습니다."
        },
        {
            id: 119,
            question: "산성 용액과 염기성 용액을 일상생활에서 이용하는 예로 알맞은 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "산성인 식초로 생선의 비린내를 제거하고, 염기성인 유리 세정제로 찌든 때를 닦는다.",
                "산성인 비눗물로 손을 씻고, 염기성인 콜라를 마셔 소화를 돕는다.",
                "산성인 베이킹소다로 빵을 부풀리고, 염기성인 제습제로 물기를 제거한다.",
                "산성인 소금물로 입을 헹구고, 염기성인 설탕물로 단맛을 낸다."
            ],
            answer: 0,
            explanation: "생선의 비린내 성분(염기성)을 식초(산성)로 중화시켜 없애고, 단백질 성분의 때를 유리 세정제(염기성)로 녹여 닦아냅니다."
        },
        {
            id: 120,
            question: "산성과 염기성 용액의 성질을 탐구하면서 알게 된 사실 중 옳은 것을 고르세요.",
            type: "CHOICE",
            options: [
                "산성 용액은 푸른색 리트머스 종이를 붉은색으로 변화시킨다.",
                "모든 용액은 지시약을 넣어도 색 변화가 일어나지 않는다.",
                "산과 염기는 우리 실생활과 아무런 관련이 없다.",
                "염기성 용액은 푸른색 리트머스 종이를 무색으로 만든다."
            ],
            answer: 0,
            explanation: "산성 용액은 푸른색 리트머스 종이를 붉은색으로 변화시키며, 염기성 용액은 붉은색 리트머스 종이를 푸른색으로 변화시킵니다."
        }
    ],
    2: [ // 2단계: 물체의 운동
        {
            id: 201,
            question: "한 아이가 공원 벤치에 앉아있다가 5분이 지난 뒤에도 그대로 앉아있습니다. 이 아이는 과학적으로 운동을 한 것일까요?",
            type: "CHOICE",
            options: [
                "아닙니다. 시간이 지남에 따라 위치가 변하는 것을 운동이라고 하기 때문입니다.",
                "운동을 한 것입니다. 숨을 쉬고 생각을 하며 에너지를 소모했기 때문입니다.",
                "벤치가 지구 자전으로 움직였으므로 큰 범위에서 운동을 한 것입니다.",
                "가만히 앉아서 기다리는 것도 운동의 일종으로 분류됩니다."
            ],
            answer: 0,
            explanation: "과학에서 물체의 운동은 '시간이 흐름에 따라 물체의 위치가 변하는 것'을 의미합니다. 위치가 변하지 않았으므로 운동을 하지 않은 것입니다."
        },
        {
            id: 202,
            question: "우리 주변에서 물체가 운동하는 예시 2가지로 알맞은 것을 고르세요.",
            type: "CHOICE",
            options: [
                "움직이는 케이블카, 달리는 기차",
                "공원에 고정된 벤치, 길가에 심어진 가로수",
                "책상 위에 놓인 연필꽂이, 벽에 걸려 있는 액자",
                "주차장 구석에 세워진 자동차, 학교 건물"
            ],
            answer: 0,
            explanation: "시간이 지남에 따라 위치가 바뀌는 케이블카와 기차는 운동하는 물체입니다."
        },
        {
            id: 203,
            question: "물체의 이동 속력과 밀접하게 관련되어 사고를 예방하는 안전장치 2가지를 고르세요.",
            type: "CHOICE",
            options: [
                "안전벨트, 신호등",
                "소화기, 스프링클러",
                "보안 카메라, 디지털 도어락",
                "손소독제, 황사 마스크"
            ],
            answer: 0,
            explanation: "안전벨트는 빠른 속력으로 가던 차량이 멈출 때 튕겨 나가는 것을 막아주며, 신호등은 차량 속력을 조절하고 통제하여 충돌을 막아줍니다."
        },
        {
            id: 204,
            question: "과학에서 정의하는 '속력'이란 무엇인가요?",
            type: "CHOICE",
            options: [
                "속력은 일정한 시간(1초, 1시간 등) 동안 물체가 이동한 거리를 말합니다.",
                "물체의 고유한 크기와 무게를 곱한 물리적 양입니다.",
                "물체가 운동할 때 공기로부터 받는 저항의 총 크기입니다.",
                "물체가 멈춰 있을 때 아래 방향으로 작용하는 중력의 크기입니다."
            ],
            answer: 0,
            explanation: "속력은 일정한 시간 동안 물체가 이동한 거리로 정의되며, 이동 거리를 걸린 시간으로 나누어 구합니다."
        },
        {
            id: 205,
            question: "자동차가 집에서 출발하여 학교 운동장까지 이동하였습니다. 이것은 과학적으로 '운동'에 해당하나요?",
            type: "OX",
            answer: true, // O
            explanation: "시간이 지남에 따라 자동차의 위치가 집에서 운동장으로 바뀌었으므로 운동에 해당합니다."
        },
        {
            id: 206,
            question: "물체의 속력을 계산하는 올바른 공식은 무엇인가요?",
            type: "CHOICE",
            options: [
                "속력 = (이동 거리) ÷ (걸린 시간)",
                "속력 = (이동 거리) × (걸린 시간)",
                "속력 = (걸린 시간) ÷ (이동 거리)",
                "속력 = (이동 거리) + (걸린 시간)"
            ],
            answer: 0,
            explanation: "속력은 단위 시간당 이동 거리이므로, (이동 거리)를 (걸린 시간)으로 나누어 계산합니다."
        },
        {
            id: 207,
            question: "자전거가 2초 동안 10m를 이동하였습니다. 이때 자전거의 속력이 5 m/s인 과학적 이유는 무엇인가요?",
            type: "CHOICE",
            options: [
                "속력은 (이동 거리) ÷ (걸린 시간)이므로 10m ÷ 2초 = 5 m/s가 되기 때문입니다.",
                "시간 2초와 거리 10m를 곱하여 나온 값의 평균이 5이기 때문입니다.",
                "자전거는 도로교통법상 기본 속력이 5m/s로 지정되어 있기 때문입니다.",
                "이동 시간 2초에 거리 10m를 더한 후 2로 나누었기 때문입니다."
            ],
            answer: 0,
            explanation: "공식에 대입하면 10m ÷ 2초 = 5 m/s가 됩니다. 1초 동안 평균 5미터를 간 셈입니다."
        },
        {
            id: 208,
            question: "강아지가 평균 속력 3 m/s로 2초 동안 뛰어갔습니다. 강아지가 이동한 거리는 몇 미터일까요?",
            type: "CHOICE",
            options: [
                "6m (이동 거리 = 속력 × 걸린 시간 = 3 × 2)",
                "1.5m (이동 거리 = 속력 ÷ 걸린 시간 = 3 ÷ 2)",
                "5m (이동 거리 = 속력 + 걸린 시간 = 3 + 2)",
                "1m (이동 거리 = 걸린 시간 - 속력 = 2 - 3)"
            ],
            answer: 0,
            explanation: "이동 거리는 (속력) × (걸린 시간)으로 구할 수 있습니다. 3 m/s × 2초 = 6m입니다."
        },
        {
            id: 209,
            question: "차량이 충돌할 때 승객의 속력을 급격히 줄여주어 신체를 보호하는 대표적인 충격 흡수 안전장치는 무엇인가요?",
            type: "CHOICE",
            options: [
                "자동차의 에어백",
                "자전거의 물통 걸이",
                "버스의 문 열림 감지기",
                "오토바이의 후방 안개등"
            ],
            answer: 0,
            explanation: "에어백은 승객이 차량 충돌 시 관성에 의해 앞으로 쏠릴 때 쿠션 역할을 하여 충격을 흡수하고 부상을 예방합니다."
        },
        {
            id: 210,
            question: "비행기가 1800km 거리를 비행하여 목적지까지 가는 데 2시간이 걸렸습니다. 이 비행기의 평균 속력은 얼마인가요?",
            type: "CHOICE",
            options: [
                "900 km/h",
                "1800 km/h",
                "3600 km/h",
                "90 km/h"
            ],
            answer: 0,
            explanation: "속력 = 이동 거리(1800km) ÷ 걸린 시간(2시간) = 900 km/h 입니다."
        },
        {
            id: 211,
            question: "시간의 단위 중 '4h'라고 표시되어 있을 때, 이것은 과학적으로 무엇을 뜻하나요?",
            type: "CHOICE",
            options: [
                "4시간 (hour)",
                "4분 (minute)",
                "4초 (second)",
                "4일 (day)"
            ],
            answer: 0,
            explanation: "h는 시간을 뜻하는 영어 단어 hour의 약자이므로, 4h는 4시간을 의미합니다."
        },
        {
            id: 212,
            question: "다음 보기 중 과학적으로 '운동하고 있지 않은(정지해 있는)' 물건들로만 짝지어진 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "공원 벤치, 서 있는 가로등, 고정된 교통 표지판",
                "하늘을 나는 비행기, 달리는 기차, 굴러가는 굴렁쇠",
                "나뭇가지에서 날아가는 새, 수영장을 헤엄치는 사람, 작동 중인 에스컬레이터",
                "회전하는 시계 바늘, 절벽에서 떨어지는 폭포수, 바람에 날리는 깃발"
            ],
            answer: 0,
            explanation: "공원 벤치, 가로등, 교통 표지판은 시간이 지나도 위치가 변하지 않으므로 정지해 있는 물체들입니다."
        },
        {
            id: 213,
            question: "자동차의 에어백은 사고 발생 시 승객을 안전하게 보호하기 위해 어떤 물리적 역할을 하나요?",
            type: "CHOICE",
            options: [
                "승객이 단단한 차량 내벽과 충돌할 때 가스 쿠션으로 충격을 흡수하여 큰 부상을 막아준다.",
                "타이어에 공기를 주입하여 차체가 미끄러지는 현상을 직접 방지한다.",
                "차량의 제동 성능을 순간적으로 극대화하여 속도를 완전히 0으로 제어한다.",
                "엔진의 과열을 방지하여 차량 폭발 사고를 막아준다."
            ],
            answer: 0,
            explanation: "에어백은 승객이 튀어나갈 때 푹신한 베개 역할을 하여 충격 시간을 늘려주고 몸에 가해지는 힘을 줄여 안전하게 보호합니다."
        }
    ],
    3: [ // 3단계: 식물의 구조와 기능
        {
            id: 301,
            question: "식물 세포는 세포막으로 둘러싸여 있습니다. 그 안에서 생명 활동을 조절하는 것은 무엇인가요?",
            type: "CHOICE",
            options: ["핵", "자갈", "모래", "공기"],
            answer: 0,
            explanation: "핵은 세포 안에서 생명 활동을 조절하는 중요한 부분입니다."
        },
        {
            id: 302,
            question: "세포란 무엇인가요?",
            type: "CHOICE",
            options: [
                "생물을 이루고 있는 기본 단위입니다.",
                "식물이 자라는 데 필요한 흙의 종류입니다.",
                "물체가 이동한 거리를 뜻합니다.",
                "지구가 도는 가상의 선입니다."
            ],
            answer: 0,
            explanation: "세포는 동물과 식물 같은 생물을 이루는 기본 단위입니다."
        },
        {
            id: 303,
            question: "뿌리는 물을 흡수한다. 맞으면 O, 틀리면 X를 고르세요.",
            type: "OX",
            answer: true,
            explanation: "뿌리는 흙 속의 물과 필요한 물질을 흡수합니다."
        },
        {
            id: 304,
            question: "식물의 기관과 역할을 바르게 연결한 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "뿌리: 물 흡수, 줄기: 지지와 이동 통로, 잎: 광합성",
                "뿌리: 꽃가루 만들기, 줄기: 씨앗 보호, 잎: 땅속 고정",
                "뿌리: 자전, 줄기: 공전, 잎: 속력 계산",
                "뿌리: 신호등, 줄기: 안전벨트, 잎: 에어백"
            ],
            answer: 0,
            explanation: "뿌리는 물을 흡수하고, 줄기는 식물을 지지하며 물질 이동 통로가 되고, 잎은 주로 광합성을 합니다."
        },
        {
            id: 305,
            question: "뿌리를 10배 정도 확대하면 볼 수 있는 가느다란 구조의 이름은 무엇인가요?",
            type: "CHOICE",
            options: ["뿌리털", "잎자루", "꽃받침", "기공"],
            answer: 0,
            explanation: "뿌리털은 뿌리 표면에 나 있는 가는 털 모양 구조로 물 흡수에 도움을 줍니다."
        },
        {
            id: 306,
            question: "식물의 뿌리가 하는 역할로 가장 알맞은 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "물을 흡수하고 식물이 쓰러지지 않도록 지지한다.",
                "태양 주위를 일 년에 한 바퀴 돈다.",
                "자동차의 속력을 줄여준다.",
                "꽃가루를 직접 만든다."
            ],
            answer: 0,
            explanation: "뿌리는 물을 흡수하고 식물이 땅에 단단히 서 있도록 지지합니다."
        },
        {
            id: 307,
            question: "꽃가루받이는 주로 무엇의 도움으로 이루어지나요?",
            type: "CHOICE",
            options: [
                "곤충, 새, 바람, 물 등",
                "안전벨트와 신호등",
                "리트머스 종이와 페놀프탈레인",
                "전등과 지구본만"
            ],
            answer: 0,
            explanation: "꽃가루는 곤충, 새, 바람, 물 등의 도움으로 수술에서 암술로 옮겨질 수 있습니다."
        },
        {
            id: 308,
            question: "줄기는 식물을 지지한다. 맞으면 O, 틀리면 X를 고르세요.",
            type: "OX",
            answer: true,
            explanation: "줄기는 식물을 받쳐 주고 물과 양분이 이동하는 통로 역할도 합니다."
        },
        {
            id: 309,
            question: "다양한 줄기의 예로 알맞은 것을 고르세요.",
            type: "CHOICE",
            options: [
                "고구마 줄기, 나팔꽃 줄기, 봉선화 줄기",
                "리트머스 종이, 묽은 염산, 석회수",
                "벤치, 전봇대, 교과서",
                "북극, 남극, 자전축"
            ],
            answer: 0,
            explanation: "고구마, 나팔꽃, 봉선화는 서로 다른 모습의 줄기를 관찰할 수 있는 식물입니다."
        },
        {
            id: 310,
            question: "식물의 잎은 무엇으로 이루어져 있고, 잎맥은 주로 어디에 뻗어 있나요?",
            type: "CHOICE",
            options: [
                "잎몸과 잎자루로 이루어져 있고, 잎맥은 주로 잎몸에 뻗어 있다.",
                "암술과 수술로 이루어져 있고, 잎맥은 뿌리털에 뻗어 있다.",
                "자전축과 공전 궤도로 이루어져 있고, 잎맥은 바다에 있다.",
                "안전벨트와 에어백으로 이루어져 있고, 잎맥은 차 안에 있다."
            ],
            answer: 0,
            explanation: "잎은 잎몸과 잎자루로 이루어져 있으며, 잎맥은 주로 넓은 잎몸에 뻗어 있습니다."
        },
        {
            id: 311,
            question: "식물이 빛과 이산화 탄소를 이용해 스스로 양분을 만드는 작용을 광합성이라고 한다.",
            type: "OX",
            answer: true,
            explanation: "광합성은 식물이 주로 잎에서 빛과 이산화 탄소를 이용해 양분을 만드는 작용입니다."
        },
        {
            id: 312,
            question: "사과나무꽃의 구조로 알맞은 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "꽃잎, 암술, 수술, 꽃받침",
                "뿌리털, 잎자루, 안전벨트, 신호등",
                "동쪽 하늘, 서쪽 하늘, 자전축, 공전",
                "탄산수, 레몬즙, 석회수, 빨랫비누 물"
            ],
            answer: 0,
            explanation: "대부분의 꽃은 꽃잎, 암술, 수술, 꽃받침 등으로 이루어져 있습니다."
        },
        {
            id: 313,
            question: "잎에 도달한 물이 기공을 통해 식물 밖으로 빠져나가는 것을 무엇이라고 하나요?",
            type: "CHOICE",
            options: ["증산작용", "중화작용", "공전", "속력"],
            answer: 0,
            explanation: "물이 잎의 기공을 통해 수증기로 빠져나가는 현상을 증산작용이라고 합니다."
        },
        {
            id: 314,
            question: "수술에서 만들어진 꽃가루가 암술로 옮겨지는 것을 '꽃가루한다'라고 한다.",
            type: "OX",
            answer: false,
            explanation: "수술에서 만들어진 꽃가루가 암술로 옮겨지는 것은 '꽃가루받이'입니다."
        },
        {
            id: 315,
            question: "잎의 기능을 바르게 설명한 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "광합성으로 양분을 만들고, 증산작용으로 물이 밖으로 빠져나가게 한다.",
                "물체의 속력을 계산하고, 신호등을 조절한다.",
                "지구가 태양 주위를 돌도록 밀어 준다.",
                "염기성 용액을 산성 용액으로만 바꾼다."
            ],
            answer: 0,
            explanation: "잎은 광합성으로 양분을 만들고, 기공을 통한 증산작용에도 관여합니다."
        }
    ],
    4: [ // 4단계: 지구의 운동
        {
            id: 401,
            question: "하루 동안 태양과 별은 어느 쪽 하늘에서 어느 쪽 하늘로 위치가 달라지는 것처럼 보이나요?",
            type: "CHOICE",
            options: [
                "동쪽 하늘에서 서쪽 하늘로",
                "서쪽 하늘에서 동쪽 하늘로",
                "북쪽에서 남쪽으로만",
                "항상 같은 곳에 멈춘 채로"
            ],
            answer: 0,
            explanation: "지구가 서쪽에서 동쪽으로 자전하기 때문에 태양과 별은 동쪽에서 서쪽으로 움직이는 것처럼 보입니다."
        },
        {
            id: 402,
            question: "지구의 북극과 남극을 이은 가상의 선을 무엇이라고 하나요?",
            type: "CHOICE",
            options: ["자전축", "잎맥", "뿌리털", "속력"],
            answer: 0,
            explanation: "지구의 북극과 남극을 이은 가상의 선을 자전축이라고 합니다."
        },
        {
            id: 403,
            question: "지구의 자전을 바르게 설명한 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "지구가 기울어진 자전축을 중심으로 하루에 한 바퀴씩 서쪽에서 동쪽으로 도는 것",
                "지구가 태양을 중심으로 일 년에 한 바퀴씩 도는 것",
                "달이 지구를 중심으로 한 시간에 한 바퀴 도는 것",
                "식물이 빛으로 양분을 만드는 것"
            ],
            answer: 0,
            explanation: "지구의 자전은 지구가 자전축을 중심으로 하루에 한 바퀴씩 도는 운동입니다."
        },
        {
            id: 404,
            question: "지구본을 돌리며 전등 빛을 비추는 실험 결과로 알맞은 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "전등 빛이 비치는 곳은 밝고, 빛이 비치지 않는 곳은 어둡다.",
                "전등 빛이 비치지 않는 곳도 항상 밝다.",
                "지구본을 돌려도 낮과 밤은 생기지 않는다.",
                "전등 빛은 식물의 뿌리털만 비춘다."
            ],
            answer: 0,
            explanation: "태양빛을 받는 쪽은 낮, 받지 못하는 쪽은 밤이 됩니다."
        },
        {
            id: 405,
            question: "지구의 공전을 바르게 설명한 것은 무엇인가요?",
            type: "CHOICE",
            options: [
                "지구가 태양을 중심으로 일 년에 한 바퀴씩 서쪽에서 동쪽으로 움직이는 것",
                "지구가 자전축을 중심으로 하루에 한 바퀴 도는 것",
                "식물이 잎에서 양분을 만드는 작용",
                "물체가 일정 시간 동안 이동한 거리"
            ],
            answer: 0,
            explanation: "지구의 공전은 지구가 태양 주위를 약 1년에 한 바퀴 도는 운동입니다."
        },
        {
            id: 406,
            question: "태양빛이 비치는 곳은 낮이다. 맞으면 O, 틀리면 X를 고르세요.",
            type: "OX",
            answer: true,
            explanation: "지구에서 태양빛을 받는 쪽은 낮이고, 빛을 받지 못하는 쪽은 밤입니다."
        },
        {
            id: 407,
            question: "낮과 밤이 하루 주기로 반복되는 가장 큰 까닭은 무엇인가요?",
            type: "CHOICE",
            options: [
                "지구가 자전하기 때문입니다.",
                "식물이 증산작용을 하기 때문입니다.",
                "산성 용액이 조개껍데기를 녹이기 때문입니다.",
                "자동차에 에어백이 있기 때문입니다."
            ],
            answer: 0,
            explanation: "지구가 하루에 한 바퀴 자전하므로 태양빛을 받는 곳이 바뀌며 낮과 밤이 반복됩니다."
        },
        {
            id: 408,
            question: "지구가 태양 주위를 도는 운동은 어떤 시간 주기와 가장 관련이 깊나요?",
            type: "CHOICE",
            options: [
                "일 년",
                "1초",
                "30초",
                "5분"
            ],
            answer: 0,
            explanation: "지구는 태양 주위를 약 일 년에 한 바퀴 공전합니다."
        }
    ]
};

// 넌센스 퀴즈 풀 (25% 확률로 과학 미션 진행 전에 깜짝 출제됨)
const nonsenseQuizzes = [
    {
        question: "[넌센스 퀴즈] 왕이 길을 가다가 넘어지면 무엇이라고 할까요?",
        options: ["킹콩", "킹받네", "킹스맨", "왕창"],
        answer: 0,
        explanation: "왕(King)이 콩! 하고 넘어졌기 때문에 '킹콩'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 세상에서 가장 가난한 왕은 누구일까요?",
        options: ["설설기어왕", "거지왕", "알거지", "킹거지"],
        answer: 0,
        explanation: "돈이 없어 당당히 걷지 못하고 기어 다니는 '설설기어왕'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 신발이 갑자기 화가 나면 어떻게 될까요?",
        options: ["신발끈", "운동화", "구두쇠", "신발장"],
        answer: 0,
        explanation: "화가 나면 끈(끝)을 보기 때문에 '신발끈'이 됩니다!"
    },
    {
        question: "[넌센스 퀴즈] 사과가 혼자 웃으면 무엇이라고 부를까요?",
        options: ["풋사과", "잼사과", "바나나", "쿡사과"],
        answer: 0,
        explanation: "풋! 하고 웃었기 때문에 '풋사과'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 소가 처음으로 다른 나라로 이민을 가면?",
        options: ["이민우", "카우보이", "소이민", "밀크랜드"],
        answer: 0,
        explanation: "이민을 간 소(우)라서 가수 '이민우'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 오리가 꽁꽁 얼어붙으면 무엇이 될까요?",
        options: ["언덕", "얼덕", "덕다운", "오리온"],
        answer: 0,
        explanation: "얼어붙은(언) 오리(덕, Duck)라서 '언덕'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 세상에서 가장 맛있는 라면은 무엇일까요?",
        options: ["너와 함께 라면", "신라면", "진라면", "삼양라면"],
        answer: 0,
        explanation: "소중한 사람인 '너와 함께 라면'이 가장 행복하고 맛있습니다!"
    },
    {
        question: "[넌센스 퀴즈] 스마트폰이나 자동차를 발로 뻥 차면 어떻게 될까요?",
        options: ["카톡", "발차기", "뺑소니", "부릉부릉"],
        answer: 0,
        explanation: "차(Car)를 톡(Tok) 쳤으므로 '카톡'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 비가 오는 날에만 특별히 할 수 있는 장사는?",
        options: ["비지니스", "우산장사", "비옷장사", "막걸리집"],
        answer: 0,
        explanation: "비(Rain)가 오니까 비(Busy)지니스입니다!"
    },
    {
        question: "[넌센스 퀴즈] 바람이 아주 귀엽게 부는 지역은 어디일까요?",
        options: ["분당", "강남", "부산", "제주"],
        answer: 0,
        explanation: "바람이 분당~(분다) 귀엽게 애교를 부려 '분당'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 고등학생들이 학교에서 가장 싫어하는 나무는?",
        options: ["야자나무", "소나무", "은행나무", "단풍나무"],
        answer: 0,
        explanation: "야간 자율학습(야자)을 떠올리게 하는 '야자나무'입니다!"
    },
    {
        question: "[넌센스 퀴즈] 세상에서 가장 미안해하는 나라는 어디일까요?",
        options: ["미안마", "아르헨티나", "사과국", "죄송하마"],
        answer: 0,
        explanation: "이름부터 사과하는 '미안마'(미얀마)입니다!"
    }
];

// 퀴즈 시스템 클래스
class QuizSystem {
    constructor() {
        this.completedQuizzes = {};
        Object.keys(scienceQuizzes).forEach(stageId => {
            this.completedQuizzes[stageId] = [];
        });
        this.currentQuiz = null;      // 현재 출제된 과학 퀴즈 정보
        this.currentNonsense = null;  // 현재 출제된 넌센스 퀴즈 정보
        this.currentStage = 1;        // 현재 진행 중인 스테이지
        this.currentQuizIndex = 0;    // 현재 스테이지 내에서의 과학 퀴즈 인덱스
        this.isNonsenseTurn = false;  // 이번 미션에서 넌센스가 출제되었는지 여부
        this.load();
    }

    // 다음 풀 퀴즈 설정
    setupNextQuiz(stageId, missionIndex) {
        this.currentStage = stageId;
        this.currentQuizIndex = missionIndex;
        
        // 25% 확률로 넌센스 퀴즈 출제 여부 결정
        this.isNonsenseTurn = Math.random() < 0.25;
        
        if (this.isNonsenseTurn) {
            // 넌센스 풀에서 랜덤으로 뽑기
            const randomIndex = Math.floor(Math.random() * nonsenseQuizzes.length);
            this.currentNonsense = nonsenseQuizzes[randomIndex];
        } else {
            this.currentNonsense = null;
        }

        // 과학 퀴즈는 지정된 인덱스 제품 로드
        const stageQuizzes = scienceQuizzes[stageId];
        if (stageQuizzes && stageQuizzes[missionIndex]) {
            this.currentQuiz = stageQuizzes[missionIndex];
            return true;
        }
        return false;
    }

    // 답 검증 (type에 따라: OX는 boolean, CHOICE는 index 숫자)
    checkAnswer(answer, isNonsense = false) {
        if (isNonsense) {
            if (!this.currentNonsense) return false;
            return this.currentNonsense.answer === Number(answer);
        } else {
            if (!this.currentQuiz) return false;
            if (this.currentQuiz.type === "OX") {
                return this.currentQuiz.answer === (answer === true || answer === "true" || answer === "O");
            } else {
                return this.currentQuiz.answer === Number(answer);
            }
        }
    }

    // 미션 성공 등록
    completeQuiz(stageId, missionIndex) {
        if (!this.completedQuizzes[stageId]) this.completedQuizzes[stageId] = [];
        if (!this.completedQuizzes[stageId].includes(missionIndex)) {
            this.completedQuizzes[stageId].push(missionIndex);
            this.save();
        }
    }

    // 특정 스테이지가 완료되었는지 확인
    isStageComplete(stageId) {
        const total = scienceQuizzes[stageId] ? scienceQuizzes[stageId].length : 0;
        return this.completedQuizzes[stageId].length === total;
    }

    // 전체 게임이 끝났는지 확인
    isAllComplete() {
        return Object.keys(scienceQuizzes).every(stageId => this.isStageComplete(stageId));
    }

    getCompletedCount(stageId) {
        return this.completedQuizzes[stageId] ? this.completedQuizzes[stageId].length : 0;
    }

    save() {
        localStorage.setItem('completedQuizzes_v2', JSON.stringify(this.completedQuizzes));
    }

    load() {
        const data = localStorage.getItem('completedQuizzes_v2');
        if (data) {
            try {
                this.completedQuizzes = JSON.parse(data);
                // 혹시 모를 누락 방지
                Object.keys(scienceQuizzes).forEach(stageId => {
                    if (!this.completedQuizzes[stageId]) this.completedQuizzes[stageId] = [];
                });
            } catch (e) {
                console.error("데이터 로드 오류", e);
            }
        }
    }

    reset() {
        this.completedQuizzes = {};
        Object.keys(scienceQuizzes).forEach(stageId => {
            this.completedQuizzes[stageId] = [];
        });
        this.currentQuiz = null;
        this.currentNonsense = null;
        this.currentStage = 1;
        this.currentQuizIndex = 0;
        this.isNonsenseTurn = false;
        localStorage.removeItem('completedQuizzes_v2');
    }
}

// 전역 인스턴스화
let quizSystem = new QuizSystem();
