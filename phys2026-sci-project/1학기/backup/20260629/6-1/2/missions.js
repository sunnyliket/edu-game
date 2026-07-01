// 방탈출 미션 시스템 (4개 단원, 각 단원별 15개 미션, 총 60개 미션)
class MissionSystem {
    constructor() {
        this.missions = {
            1: [ // 1단원: 산과 염기 (15개 미션)
                { id: 1, title: '지시약 정의', points: 10 },
                { id: 2, title: '산성용액 성질', points: 10 },
                { id: 3, title: '염기성용액 성질', points: 10 },
                { id: 4, title: '지시약 종류', points: 10 },
                { id: 5, title: '레몬즙의 액성', points: 10 },
                { id: 6, title: '표백제의 액성', points: 10 },
                { id: 7, title: '페놀프탈레인 반응', points: 10 },
                { id: 8, title: '양배추 지시약 반응', points: 10 },
                { id: 9, title: '조개껍데기 반응', points: 10 },
                { id: 10, title: '페놀프탈레인 분별', points: 10 },
                { id: 11, title: '산/염기 중화 작용', points: 10 },
                { id: 12, title: '토양 산성화 피해', points: 10 },
                { id: 13, title: '실험실 안전 수칙', points: 10 },
                { id: 14, title: '염기성 실생활 사용', points: 10 },
                { id: 15, title: '리트머스 종이 변화', points: 10 }
            ],
            2: [ // 2단원: 물체의 운동 (15개 미션)
                { id: 1, title: '물체의 운동 정의', points: 15 },
                { id: 2, title: '운동 여부 판정', points: 15 },
                { id: 3, title: '운동하는 물체 예시', points: 15 },
                { id: 4, title: '속력 관련 안전장치', points: 15 },
                { id: 5, title: '속력의 정의', points: 15 },
                { id: 6, title: '자동차가 이동할 때', points: 15 },
                { id: 7, title: '속력 계산 공식', points: 15 },
                { id: 8, title: '자전거 속력 계산', points: 15 },
                { id: 9, title: '강아지 이동 거리', points: 15 },
                { id: 10, title: '차량 충돌 안전장치', points: 15 },
                { id: 11, title: '비행기 평균 속력', points: 15 },
                { id: 12, title: '시간 단위 기호', points: 15 },
                { id: 13, title: '정지해 있는 물체', points: 15 },
                { id: 14, title: '에어백 보호 작용', points: 15 },
                { id: 15, title: '속력의 개념', points: 15 }
            ],
            3: [ // 3단원: 식물의 구조와 기능 (15개 미션)
                { id: 1, title: '식물의 생물적 정의', points: 18 },
                { id: 2, title: '식물 세포의 핵', points: 18 },
                { id: 3, title: '세포의 정의', points: 18 },
                { id: 4, title: '뿌리의 물 흡수 여부', points: 18 },
                { id: 5, title: '식물 기관 역할 매칭', points: 18 },
                { id: 6, title: '뿌리털의 관찰', points: 18 },
                { id: 7, title: '뿌리의 물 흡수와 지지', points: 18 },
                { id: 8, title: '꽃가루받이 매개체', points: 18 },
                { id: 9, title: '줄기의 지지 역할', points: 18 },
                { id: 10, title: '다양한 식물 줄기 예시', points: 18 },
                { id: 11, title: '식물 잎과 잎맥 구조', points: 18 },
                { id: 12, title: '광합성의 정의', points: 18 },
                { id: 13, title: '사과나무꽃 구조', points: 18 },
                { id: 14, title: '기공과 증산작용', points: 18 },
                { id: 15, title: '꽃가루받이 정의', points: 18 }
            ],
            4: [ // 4단원: 지구의 운동 (15개 미션)
                { id: 1, title: '태양과 별의 위치 변화', points: 20 },
                { id: 2, title: '지구의 자전축', points: 20 },
                { id: 3, title: '지구의 자전 정의', points: 20 },
                { id: 4, title: '낮과 밤 생성 원리', points: 20 },
                { id: 5, title: '지구의 공전 정의', points: 20 },
                { id: 6, title: '태양빛과 낮', points: 20 },
                { id: 7, title: '하루 주기와 자전', points: 20 },
                { id: 8, title: '지구 공전 주기', points: 20 },
                { id: 9, title: '계절별 별자리 변화', points: 20 },
                { id: 10, title: '사계절 변화 요인', points: 20 },
                { id: 11, title: '하지 절기의 특징', points: 20 },
                { id: 12, title: '지구 자전 방향', points: 20 },
                { id: 13, title: '별의 일주운동과 자전', points: 20 },
                { id: 14, title: '지구 공전 일수', points: 20 },
                { id: 15, title: '지구 자전 시간', points: 20 }
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
