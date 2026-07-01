// 과학실 방탈출 캐릭터 시스템 (기본 상태 및 로컬 스토리지 연동)
const ITEMS = {
    equipment: {},
    decorations: {},
    animals: {},
    farm: {},
    vehicles: {},
    house: {}
};

class Character {
    constructor(name = '과학소년') {
        this.name = name;
        this.points = 0;
        
        // 16x16 그리드 내 캐릭터 시작 좌표 (중앙 하단 통로 근처)
        this.islandX = 7;
        this.islandY = 8;

        this.playerId = 'player1';
        this.friends = [];
        this.tradeOffers = [];
        this.inventory = [];
        this.equipped = { hair: '', clothing: '', shoes: '' };
        
        this.load();
    }

    getSpeedBonus() {
        return 0;
    }

    getPointBonus() {
        return 0;
    }

    // 포인트 획득 및 화면 갱신
    addPoints(amount) {
        this.points += amount;
        this.save();
        this.updateDisplay();
        return amount;
    }

    deductPoints(amount) {
        if (this.points >= amount) {
            this.points -= amount;
            this.save();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    setName(name) {
        this.name = name;
        this.save();
        this.updateDisplay();
    }

    normalizeId(id) {
        return (id || '').trim().toLowerCase();
    }

    claimPlayerId(id) {
        this.playerId = this.normalizeId(id) || 'player1';
        this.save();
        this.updateDisplay();
        return { success: true, msg: '사용 가능한 아이디입니다.' };
    }

    isIdAvailable(id) {
        return true;
    }

    getIdRegistry() {
        return [];
    }

    // 장착 / 상점 등 레거시 호환성 더미 함수
    buyShopItem(itemId, category) {
        return { success: false, msg: '상점 기능은 이 모드에서 지원되지 않습니다.' };
    }

    equipItem(itemId) {
        return false;
    }

    updateDisplay() {
        // HUD 모험가 이름 표시
        document.querySelectorAll('.player-name-display').forEach(el => {
            el.textContent = this.name;
        });

        // HUD 포인트 표시
        document.querySelectorAll('.player-points-display').forEach(el => {
            el.textContent = this.points;
        });

        // HUD 아이디 표시
        document.querySelectorAll('.player-id-display').forEach(el => {
            el.textContent = this.playerId;
        });
    }

    save() {
        const data = {
            name: this.name,
            points: this.points,
            islandX: this.islandX,
            islandY: this.islandY,
            playerId: this.playerId
        };
        localStorage.setItem('character_escape_v1', JSON.stringify(data));
    }

    load() {
        const data = localStorage.getItem('character_escape_v1');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.name = parsed.name || '과학소년';
                this.points = parsed.points || 0;
                this.islandX = parsed.islandX !== undefined ? parsed.islandX : 7;
                this.islandY = parsed.islandY !== undefined ? parsed.islandY : 8;
                this.playerId = parsed.playerId || 'player1';
            } catch (e) {
                console.error("캐릭터 데이터 로드 오류", e);
            }
        }
    }

    reset() {
        this.name = '과학소년';
        this.points = 0;
        this.islandX = 7;
        this.islandY = 8;
        this.playerId = 'player1';
        this.save();
        this.updateDisplay();
    }
}

// 전역 캐릭터 인스턴스
let character = new Character();
