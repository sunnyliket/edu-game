// 방탈출 미션 시스템 (1단계: 산성과 염기성, 2단계: 물체의 운동)
class MissionSystem {
    constructor() {
        // 두 개의 방탈출 스테이지에 각각 해당하는 미션 정보
        this.missions = {
            1: [ // 1단계: 산성과 염기성 실험실 (20개 미션)
                { id: 1, title: '리트머스 분류', points: 10 },
                { id: 2, title: '레몬즙의 비밀', points: 10 },
                { id: 3, title: '표백제의 성질', points: 10 },
                { id: 4, title: '양배추 지시약 색변화', points: 10 },
                { id: 5, title: '페놀프탈레인 반응', points: 10 },
                { id: 6, title: '산성과 양배추 지시약', points: 10 },
                { id: 7, title: '염기성과 양배추 지시약', points: 10 },
                { id: 8, title: '토양/물 산성비 피해', points: 10 },
                { id: 9, title: '산성/염기성 상식', points: 10 },
                { id: 10, title: '조개껍데기의 용해', points: 10 },
                { id: 11, title: '탄산수 vs 비눗물', points: 10 },
                { id: 12, title: '용액의 중화와 성질', points: 10 },
                { id: 13, title: '토양 산성화의 단점', points: 10 },
                { id: 14, title: '안전사고 대처 요령', points: 10 },
                { id: 15, title: '염기성 용액 사용례', points: 10 },
                { id: 16, title: '산성비 피해 사례', points: 10 },
                { id: 17, title: '단백질을 녹이는 용액', points: 10 },
                { id: 18, title: '산성화 피해의 예시', points: 10 },
                { id: 19, title: '산성 용액 실생활 활용', points: 10 },
                { id: 20, title: '산성과 염기성 배운 점', points: 10 }
            ],
            2: [ // 2단계: 물체의 운동 숲속 트랙 (13개 미션)
                { id: 1, title: '벤치에 앉은 아이', points: 15 },
                { id: 2, title: '운동하는 물체의 예', points: 15 },
                { id: 3, title: '속력 조절 안전장치', points: 15 },
                { id: 4, title: '속력이란 무엇인가', points: 15 },
                { id: 5, title: '운동장 가는 자동차', points: 15 },
                { id: 6, title: '속력 공식의 이해', points: 15 },
                { id: 7, title: '자전거의 속력 계산', points: 15 },
                { id: 8, title: '뛰어가는 강아지 거리', points: 15 },
                { id: 9, title: '신체 보호 안전장치', points: 15 },
                { id: 10, title: '비행기의 비행 속력', points: 15 },
                { id: 11, title: '4h의 과학적 약자', points: 15 },
                { id: 12, title: '정지해 있는 물체', points: 15 },
                { id: 13, title: '에어백의 물리적 원리', points: 15 }
            ],
            3: [ // 3단계: 식물의 구조와 기능 (15개 미션)
                { id: 1, title: '식물 세포 속 핵', points: 18 },
                { id: 2, title: '세포의 뜻', points: 18 },
                { id: 3, title: '뿌리의 물 흡수', points: 18 },
                { id: 4, title: '식물 기관의 역할', points: 18 },
                { id: 5, title: '뿌리털 관찰', points: 18 },
                { id: 6, title: '뿌리의 두 가지 역할', points: 18 },
                { id: 7, title: '꽃가루받이 도움', points: 18 },
                { id: 8, title: '줄기의 지지 작용', points: 18 },
                { id: 9, title: '다양한 줄기', points: 18 },
                { id: 10, title: '잎의 구성', points: 18 },
                { id: 11, title: '광합성의 뜻', points: 18 },
                { id: 12, title: '사과나무꽃 구조', points: 18 },
                { id: 13, title: '기공과 증산작용', points: 18 },
                { id: 14, title: '꽃가루받이 개념', points: 18 },
                { id: 15, title: '잎의 여러 기능', points: 18 }
            ],
            4: [ // 4단계: 지구의 운동 (8개 미션)
                { id: 1, title: '태양과 별의 위치 변화', points: 20 },
                { id: 2, title: '지구의 자전축', points: 20 },
                { id: 3, title: '지구의 자전', points: 20 },
                { id: 4, title: '낮과 밤 실험 결과', points: 20 },
                { id: 5, title: '지구의 공전', points: 20 },
                { id: 6, title: '태양빛과 낮', points: 20 },
                { id: 7, title: '하루 주기와 자전', points: 20 },
                { id: 8, title: '일 년 주기와 공전', points: 20 }
            ]
        };
        this.completedMissions = {
            1: [],
            2: [],
            3: [],
            4: []
        };
        this.load();
    }

    getMissions(stageId) {
        return this.missions[stageId] || [];
    }

    completeMission(stageId, missionId) {
        if (!this.completedMissions[stageId]) {
            this.completedMissions[stageId] = [];
        }
        if (!this.completedMissions[stageId].includes(missionId)) {
            this.completedMissions[stageId].push(missionId);
            this.save();
            return true;
        }
        return false;
    }

    isMissionCompleted(stageId, missionId) {
        return this.completedMissions[stageId] && this.completedMissions[stageId].includes(missionId);
    }

    getCompletedCount(stageId) {
        return this.completedMissions[stageId] ? this.completedMissions[stageId].length : 0;
    }

    save() {
        localStorage.setItem('completedMissions_v2', JSON.stringify(this.completedMissions));
    }

    load() {
        const data = localStorage.getItem('completedMissions_v2');
        if (data) {
            try {
                this.completedMissions = JSON.parse(data);
                Object.keys(this.missions).forEach(stageId => {
                    if (!this.completedMissions[stageId]) this.completedMissions[stageId] = [];
                });
            } catch (e) {
                console.error("미션 데이터 로드 오류", e);
            }
        }
    }

    reset() {
        this.completedMissions = {};
        Object.keys(this.missions).forEach(stageId => {
            this.completedMissions[stageId] = [];
        });
        localStorage.removeItem('completedMissions_v2');
    }
}

let missionSystem = new MissionSystem();
