// 장비 및 상점 아이템 데이터베이스
const ITEMS = {
    // 장비 아이템 (헤어, 옷, 신발)
    equipment: {
        // 헤어
        'hair_common': { name: '기본 헤어', type: 'hair', grade: 'Common', price: 0, speed: 0, bonus: 0, color: '#8B4513', desc: '평범하고 갈색의 머리카락입니다.' },
        'hair_rare': { name: '은빛 바람 머리카락', type: 'hair', grade: 'Rare', price: 5, speed: 5, bonus: 1, color: '#C0C0C0', desc: '바람을 가르는 은빛 생머리. (이동속도 +5%, 보너스 포인트 +1)' },
        'hair_epic': { name: '불꽃 물결 머리카락', type: 'hair', grade: 'Epic', price: 12, speed: 10, bonus: 2, color: '#FF4500', desc: '타오르는 불꽃처럼 흐르는 머리카락. (이동속도 +10%, 보너스 포인트 +2)' },
        'hair_legendary': { name: '황금 햇살 머리카락', type: 'hair', grade: 'Legendary', price: 25, speed: 20, bonus: 4, color: '#FFD700', desc: '태양빛처럼 반짝이는 긴 머리카락입니다. (이동속도 +20%, 보너스 포인트 +4)' },
        
        // 옷
        'clothing_common': { name: '평범한 모험가 옷', type: 'clothing', grade: 'Common', price: 0, speed: 0, bonus: 0, color: '#4169E1', desc: '시작할 때 주어지는 파란색 작업용 셔츠.' },
        'clothing_rare': { name: '엘프의 푸른 나뭇잎 옷', type: 'clothing', grade: 'Rare', price: 8, speed: 5, bonus: 1, color: '#2E8B57', desc: '숲의 요정이 엮어 만든 가벼운 로브. (이동속도 +5%, 보너스 포인트 +1)' },
        'clothing_epic': { name: '황혼의 마법 마스터 코트', type: 'clothing', grade: 'Epic', price: 18, speed: 15, bonus: 3, color: '#800080', desc: '차원 마법의 힘이 깃든 코트. (이동속도 +15%, 보너스 포인트 +3)' },
        'clothing_legendary': { name: '신화 속 피닉스 드래곤 메일', type: 'clothing', grade: 'Legendary', price: 35, speed: 30, bonus: 6, color: '#D2143A', desc: '피닉스의 깃털과 드래곤 비늘 갑옷. (이동속도 +30%, 보너스 포인트 +6)' },

        // 신발
        'shoes_common': { name: '헤진 가죽 신발', type: 'shoes', grade: 'Common', price: 0, speed: 0, bonus: 0, color: '#555555', desc: '바닥이 닳은 평범한 가죽 신발.' },
        'shoes_rare': { name: '신속의 숲 가죽 부츠', type: 'shoes', grade: 'Rare', price: 5, speed: 10, bonus: 0, color: '#8B5A2B', desc: '가벼운 가죽으로 만들어진 부츠. (이동속도 +10%)' },
        'shoes_epic': { name: '구름을 사뿐 걷는 윙 부츠', type: 'shoes', grade: 'Epic', price: 12, speed: 20, bonus: 1, color: '#87CEEB', desc: '뒤꿈치에 작은 날개가 달린 신발. (이동속도 +20%, 보너스 포인트 +1)' },
        'shoes_legendary': { name: '헤르메스의 신의 전령 샌들', type: 'shoes', grade: 'Legendary', price: 25, speed: 40, bonus: 2, color: '#FFD700', desc: '시공간을 초월하는 속도를 내는 샌들. (이동속도 +40%, 보너스 포인트 +2)' }
    },
    
    // 섬/집 꾸미기 아이템
    decorations: {
        'flower': { name: '알록달록 숲 꽃잎', price: 2, desc: '바람이 불면 휘날리는 예쁜 야생화. (섬 꾸미기용)' },
        'mushroom': { name: '빛나는 형광 마법 버섯', price: 4, desc: '밤이 되면 은은하게 빛나는 판타지 버섯.' },
        'magic_tree': { name: '생명의 분홍 마법 나무', price: 7, desc: '마법 숲의 기운을 담은 거대한 마법 나무.' },
        'crystal': { name: '에메랄드 고대 크리스탈', price: 10, desc: '주변 공기를 맑게 해주는 신비로운 결정체.' },
        'bed': { name: '폭신한 빨간 픽셀 침대', price: 3, desc: '집 내부에 놓을 수 있는 편안한 침대.' },
        'alchemy': { name: '연금술사의 마법 연구대', price: 8, desc: '물약을 제조할 수 있는 마법 실험 테이블.' }
    },

    // 동물 상점
    animals: {
        'squirrel': { name: '동글 다람쥐', price: 3, char: '🐿️', desc: '섬 주변을 통통 뛰어다니는 귀여운 다람쥐.' },
        'bunny': { name: '말랑 꼬마 토끼', price: 5, char: '🐇', desc: '풀밭 위를 이리저리 깡충 뛰어다니는 토끼.' },
        'fox': { name: '신비의 황금 숲여우', price: 10, char: '🦊', desc: '주변에 마법 이펙트를 흩뿌리는 신비한 여우.' },
        'dragon': { name: '아기 드래곤', price: 18, char: '🐉', desc: '등에 작은 날개가 돋아난 판타지 아기 용!' }
    },

    // 씨앗과 농사 도구
    farm: {
        'watering_can': { name: '튼튼한 물뿌리개', type: 'tool', price: 5, desc: '씨앗을 심고 키우려면 반드시 필요한 도구입니다.', effect: '씨앗 심기 가능' },
        'sunflower_seed': { name: '해바라기 씨앗', type: 'seed', price: 2, desc: '물뿌리개로 물을 주면 30초 뒤 환한 해바라기로 자랍니다.', effect: '성장 후 수확 +20P' },
        'berry_seed': { name: '숲딸기 씨앗', type: 'seed', price: 3, desc: '작은 과일이 열리는 씨앗입니다. 30초 뒤 수확할 수 있습니다.', effect: '성장 후 수확 +28P' },
        'herb_seed': { name: '반짝 허브 씨앗', type: 'seed', price: 4, desc: '연구에 쓰이는 향기로운 허브입니다. 30초 뒤 자랍니다.', effect: '성장 후 수확 +36P' }
    },

    // 탈것 상점
    vehicles: {
        'motorcycle': { name: '숲길 오토바이', price: 45, speed: 55, char: '🏍️', desc: '좁은 숲길을 빠르게 달립니다. 이제 그렇게 비싸지 않습니다.' },
        'car': { name: '섬 탐험 전기차', price: 80, speed: 70, char: '🚗', desc: '섬을 부드럽게 달리는 고급 전기차입니다. 가격을 크게 낮췄습니다.' }
    },

    // 집 업그레이드 (클래스별 가격 및 이미지 크기 비율)
    house: {
        'tent': { name: '초라한 아기 텐트', price: 0, scale: 0.8, desc: '기본으로 주어지는 작고 좁은 가죽 텐트.' },
        'cabin': { name: '따뜻한 나무 통나무집', price: 20, scale: 1.1, desc: '나무 향기가 솔솔 나는 튼튼한 오두막.' },
        'mansion': { name: '으리으리한 돌 성벽 저택', price: 50, scale: 1.5, desc: '단단하고 커다란 이층짜리 중세풍 돌집.' },
        'tower': { name: '신비한 마법사의 연구탑', price: 100, scale: 2.0, desc: '판타지 세계의 거대하고 높은 마법 탑!' }
    }
};

// 캐릭터 시스템 클래스
class Character {
    constructor(name = '플레이어') {
        this.name = name;
        this.points = 0;
        
        // 장착된 장비 기본값 (Common)
        this.equipped = {
            hair: 'hair_common',
            clothing: 'clothing_common',
            shoes: 'shoes_common'
        };
        
        // 구매 인벤토리 (초기 장비 자동 보유)
        this.inventory = ['hair_common', 'clothing_common', 'shoes_common'];
        
        // 소유한 집의 등급
        this.house = 'tent';
        
        // 섬/집에 배치된 장식품 및 동물들의 그리드 정보 (좌표 x: 0~5, y: 0~5)
        this.placedItems = []; // { x, y, id, category } (category: 'decorations' 또는 'animals')
        
        // 상점에서 샀지만 아직 배치하지 않은 아이템
        this.unplacedInventory = []; // { id, category }
        
        // 캐릭터의 섬 내 그리드 좌표 추가
        this.islandX = 0;
        this.islandY = 8;

        this.playerId = '';
        this.friends = [];
        this.tradeOffers = [];
        this.hasWateringCan = false;
        this.vehicles = [];
        this.activeVehicle = null;
        
        this.load();
    }

    // 장비 스탯 합산
    getSpeedBonus() {
        let speed = 0;
        for (const slot in this.equipped) {
            const itemId = this.equipped[slot];
            const item = ITEMS.equipment[itemId];
            if (item) speed += item.speed;
        }
        speed += this.getVehicleBonus();
        return speed;
    }

    getVehicleBonus() {
        if (!this.activeVehicle) return 0;
        const vehicle = ITEMS.vehicles[this.activeVehicle];
        return vehicle ? vehicle.speed : 0;
    }

    getPointBonus() {
        let bonus = 0;
        for (const slot in this.equipped) {
            const itemId = this.equipped[slot];
            const item = ITEMS.equipment[itemId];
            if (item) bonus += item.bonus;
        }
        return bonus;
    }

    // 포인트 가산 및 보너스 적용
    addPoints(amount) {
        const bonus = this.getPointBonus();
        const finalAmount = amount + bonus;
        this.points += finalAmount;
        this.save();
        this.updateDisplay();
        return finalAmount;
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
        const normalized = this.normalizeId(id);
        if (!/^[a-z0-9_-]{3,12}$/.test(normalized)) {
            return { success: false, msg: '아이디는 영문 소문자, 숫자, _, - 조합 3~12자로 입력해 주세요.' };
        }

        const registry = this.getIdRegistry();
        if (registry.includes(normalized) && normalized !== this.playerId) {
            return { success: false, msg: '이미 다른 사람이 사용 중인 아이디입니다.' };
        }

        if (!registry.includes(normalized)) {
            registry.push(normalized);
            localStorage.setItem('playerIdRegistry_v1', JSON.stringify(registry));
        }

        this.playerId = normalized;
        this.save();
        this.updateDisplay();
        return { success: true, msg: '사용 가능한 아이디입니다.' };
    }

    isIdAvailable(id) {
        const normalized = this.normalizeId(id);
        if (!/^[a-z0-9_-]{3,12}$/.test(normalized)) return false;
        const registry = this.getIdRegistry();
        return !registry.includes(normalized) || normalized === this.playerId;
    }

    getIdRegistry() {
        try {
            const saved = JSON.parse(localStorage.getItem('playerIdRegistry_v1') || '[]');
            return Array.isArray(saved) ? saved : [];
        } catch (e) {
            return [];
        }
    }

    // 아이템 구매
    buyShopItem(itemId, category) {
        let itemInfo = null;
        if (category === 'equipment') {
            itemInfo = ITEMS.equipment[itemId];
        } else if (category === 'decorations') {
            itemInfo = ITEMS.decorations[itemId];
        } else if (category === 'animals') {
            itemInfo = ITEMS.animals[itemId];
        } else if (category === 'farm') {
            itemInfo = ITEMS.farm[itemId];
        } else if (category === 'vehicles') {
            itemInfo = ITEMS.vehicles[itemId];
        } else if (category === 'house') {
            itemInfo = ITEMS.house[itemId];
        }

        if (!itemInfo) return { success: false, msg: '존재하지 않는 아이템입니다.' };

        // 이미 소유한 장비 또는 집인지 확인
        if (category === 'equipment' && this.inventory.includes(itemId)) {
            return { success: false, msg: '이미 보유 중인 장비입니다!' };
        }
        if (category === 'house') {
            if (this.house === itemId) return { success: false, msg: '이미 보유 중인 집입니다!' };
            // 집은 텐트에서 올라갈 때 등급이 낮아지진 않게 처리 가능 (여기선 덮어쓰기)
        }
        if (category === 'farm' && itemInfo.type === 'tool' && this.hasWateringCan) {
            return { success: false, msg: '이미 물뿌리개를 가지고 있습니다!' };
        }
        if (category === 'vehicles' && this.vehicles.includes(itemId)) {
            this.activeVehicle = itemId;
            this.save();
            this.updateDisplay();
            return { success: true, msg: `${itemInfo.name}에 탑승했습니다!` };
        }

        if (this.points < itemInfo.price) {
            return { success: false, msg: '포인트가 부족합니다!' };
        }

        // 구매 처리
        this.deductPoints(itemInfo.price);

        if (category === 'equipment') {
            this.inventory.push(itemId);
            // 자동 장착
            this.equipItem(itemId);
        } else if (category === 'house') {
            this.house = itemId;
        } else if (category === 'farm' && itemInfo.type === 'tool') {
            this.hasWateringCan = true;
        } else if (category === 'vehicles') {
            this.vehicles.push(itemId);
            this.activeVehicle = itemId;
        } else {
            // 장식 및 동물은 배치 대기 인벤토리에 추가
            this.unplacedInventory.push({ id: itemId, category: category });
        }

        this.save();
        this.updateDisplay();
        return { success: true, msg: `${itemInfo.name}을(를) 성공적으로 구매했습니다!` };
    }

    // 장비 장착
    equipItem(itemId) {
        const item = ITEMS.equipment[itemId];
        if (!item || !this.inventory.includes(itemId)) return false;
        
        this.equipped[item.type] = itemId;
        this.save();
        this.updateDisplay();
        return true;
    }

    // 아이템 배치
    placeItemOnIsland(inventoryIndex, x, y) {
        if (inventoryIndex < 0 || inventoryIndex >= this.unplacedInventory.length) return false;
        
        // 이미 해당 그리드에 아이템이 배치되어 있는지 검사
        const isOccupied = this.placedItems.some(item => item.x === x && item.y === y);
        if (isOccupied) return false;

        const item = this.unplacedInventory[inventoryIndex];
        if (item.category === 'farm' && !this.hasWateringCan) {
            return false;
        }

        const placed = {
            x: x,
            y: y,
            id: item.id,
            category: item.category
        };
        if (item.category === 'farm') {
            placed.plantedAt = Date.now();
            placed.watered = true;
            placed.grown = false;
        }

        this.placedItems.push({
            ...placed
        });

        // 인벤토리에서 제거
        this.unplacedInventory.splice(inventoryIndex, 1);
        this.save();
        return true;
    }

    // 배치된 아이템 회수
    removePlacedItem(x, y) {
        const itemIndex = this.placedItems.findIndex(item => item.x === x && item.y === y);
        if (itemIndex === -1) return false;

        const item = this.placedItems[itemIndex];
        // 다시 인벤토리로 돌려보냄
        this.unplacedInventory.push({
            id: item.id,
            category: item.category
        });

        this.placedItems.splice(itemIndex, 1);
        this.save();
        return true;
    }

    harvestPlant(x, y) {
        const itemIndex = this.placedItems.findIndex(item => item.x === x && item.y === y && item.category === 'farm');
        if (itemIndex === -1) return { success: false, points: 0 };

        const item = this.placedItems[itemIndex];
        const grown = item.grown || (item.plantedAt && Date.now() - item.plantedAt >= 30000);
        if (!grown) return { success: false, points: 0 };

        const rewards = {
            sunflower_seed: 20,
            berry_seed: 28,
            herb_seed: 36
        };
        const points = rewards[item.id] || 15;
        this.placedItems.splice(itemIndex, 1);
        this.addPoints(points);
        this.save();
        return { success: true, points };
    }

    updatePlantGrowth() {
        let changed = false;
        this.placedItems.forEach(item => {
            if (item.category === 'farm' && !item.grown && item.plantedAt && Date.now() - item.plantedAt >= 30000) {
                item.grown = true;
                changed = true;
            }
        });
        if (changed) this.save();
        return changed;
    }

    addFriend(friendId) {
        const normalized = this.normalizeId(friendId);
        if (!/^[a-z0-9_-]{3,12}$/.test(normalized)) {
            return { success: false, msg: '친구 아이디는 영문/숫자 3~12자로 입력해 주세요.' };
        }
        if (normalized === this.playerId) {
            return { success: false, msg: '자기 자신은 친구로 추가할 수 없습니다.' };
        }
        if (this.friends.includes(normalized)) {
            return { success: false, msg: '이미 친구 목록에 있습니다.' };
        }
        this.friends.push(normalized);
        this.save();
        return { success: true, msg: `${normalized} 친구를 추가했습니다.` };
    }

    addTradeOffer(friendId, itemId) {
        const friend = this.normalizeId(friendId);
        const item = ITEMS.equipment[itemId];
        if (!friend || !this.friends.includes(friend)) {
            return { success: false, msg: '거래할 친구를 먼저 선택해 주세요.' };
        }
        if (!item || !this.inventory.includes(itemId)) {
            return { success: false, msg: '거래할 수 있는 옷/장비가 없습니다.' };
        }

        const offer = {
            friendId: friend,
            itemId,
            itemName: item.name,
            createdAt: Date.now(),
            status: '제안 보냄'
        };
        this.tradeOffers.unshift(offer);
        this.tradeOffers = this.tradeOffers.slice(0, 8);
        this.save();
        return { success: true, msg: `${friend}에게 ${item.name} 거래 제안을 보냈습니다.` };
    }

    updateDisplay() {
        // 이름 표시
        document.querySelectorAll('.player-name-display').forEach(el => {
            el.textContent = this.name;
        });

        // 포인트 표시
        document.querySelectorAll('.player-points-display').forEach(el => {
            el.textContent = this.points;
        });

        document.querySelectorAll('.player-id-display').forEach(el => {
            el.textContent = this.playerId || '미등록';
        });

        // 캐릭터 외형 요소들 업데이트 (픽셀 아트화 렌더링에 사용)
        const head = ITEMS.equipment[this.equipped.hair];
        const body = ITEMS.equipment[this.equipped.clothing];
        const shoes = ITEMS.equipment[this.equipped.shoes];

        // 프리뷰 스타일 적용
        const hairEl = document.getElementById('charPreviewHair');
        if (hairEl && head) {
            hairEl.style.backgroundColor = head.color;
            hairEl.className = `pixel-hair ${head.grade.toLowerCase()}`;
        }
        const bodyEl = document.getElementById('charPreviewBody');
        if (bodyEl && body) {
            bodyEl.style.backgroundColor = body.color;
            bodyEl.className = `pixel-clothing ${body.grade.toLowerCase()}`;
        }
        const shoesEl = document.getElementById('charPreviewShoes');
        if (shoesEl && shoes) {
            shoesEl.style.backgroundColor = shoes.color;
            shoesEl.className = `pixel-shoes ${shoes.grade.toLowerCase()}`;
        }

        // HUD 미니 프리뷰 스타일 적용
        const hudHairEl = document.getElementById('hudPreviewHair');
        if (hudHairEl && head) {
            hudHairEl.style.backgroundColor = head.color;
            hudHairEl.className = `pixel-hair-hud ${head.grade.toLowerCase()}`;
        }
        const hudBodyEl = document.getElementById('hudPreviewBody');
        if (hudBodyEl && body) {
            hudBodyEl.style.backgroundColor = body.color;
            hudBodyEl.className = `pixel-clothing-hud ${body.grade.toLowerCase()}`;
        }
        const hudShoesEl = document.getElementById('hudPreviewShoes');
        if (hudShoesEl && shoes) {
            hudShoesEl.style.backgroundColor = shoes.color;
            hudShoesEl.className = `pixel-shoes-hud ${shoes.grade.toLowerCase()}`;
        }

        // 인게임 속도 및 보너스 출력
        const speedBonusEl = document.getElementById('statSpeedBonus');
        if (speedBonusEl) speedBonusEl.textContent = `이동 속도 보너스: +${this.getSpeedBonus()}%`;
        const pointBonusEl = document.getElementById('statPointBonus');
        if (pointBonusEl) pointBonusEl.textContent = `추가 포인트 획득: +${this.getPointBonus()}포인트`;
    }

    save() {
        const data = {
            name: this.name,
            points: this.points,
            equipped: this.equipped,
            inventory: this.inventory,
            house: this.house,
            placedItems: this.placedItems,
            unplacedInventory: this.unplacedInventory,
            islandX: this.islandX,
            islandY: this.islandY,
            playerId: this.playerId,
            friends: this.friends,
            tradeOffers: this.tradeOffers,
            hasWateringCan: this.hasWateringCan,
            vehicles: this.vehicles,
            activeVehicle: this.activeVehicle
        };
        localStorage.setItem('character_v2', JSON.stringify(data));
    }

    load() {
        const data = localStorage.getItem('character_v2');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.name = parsed.name || '플레이어';
                this.points = parsed.points || 0;
                this.equipped = parsed.equipped || this.equipped;
                this.inventory = parsed.inventory || this.inventory;
                this.house = parsed.house || 'tent';
                this.placedItems = parsed.placedItems || [];
                this.unplacedInventory = parsed.unplacedInventory || [];
                this.islandX = parsed.islandX !== undefined ? parsed.islandX : 0;
                this.islandY = parsed.islandY !== undefined ? parsed.islandY : 8;
                this.playerId = parsed.playerId || '';
                this.friends = Array.isArray(parsed.friends) ? parsed.friends : [];
                this.tradeOffers = Array.isArray(parsed.tradeOffers) ? parsed.tradeOffers : [];
                this.hasWateringCan = !!parsed.hasWateringCan;
                this.vehicles = Array.isArray(parsed.vehicles) ? parsed.vehicles : [];
                this.activeVehicle = parsed.activeVehicle || null;
            } catch (e) {
                console.error("캐릭터 데이터 로드 오류", e);
            }
        }
    }

    reset() {
        this.name = '플레이어';
        this.points = 0;
        this.equipped = {
            hair: 'hair_common',
            clothing: 'clothing_common',
            shoes: 'shoes_common'
        };
        this.inventory = ['hair_common', 'clothing_common', 'shoes_common'];
        this.house = 'tent';
        this.placedItems = [];
        this.unplacedInventory = [];
        this.islandX = 0;
        this.islandY = 8;
        this.friends = [];
        this.tradeOffers = [];
        this.hasWateringCan = false;
        this.vehicles = [];
        this.activeVehicle = null;
        this.save();
        this.updateDisplay();
    }
}

// 전역 캐릭터 인스턴스 생성
let character = new Character();
