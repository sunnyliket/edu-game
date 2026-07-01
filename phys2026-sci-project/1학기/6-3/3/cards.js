// ============================================================
// CARD SYSTEM - 20 cards across 5 rarity tiers
// ============================================================

window.CARD_POOL = [
    // ===================== 희귀 (RARE) - Gray =====================
    {
        id: 'tank1', name: '탱커', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '체력을 10만큼 높입니다.',
        apply(c) {
            c.maxHp += 10;
            c.hp += 10;
        }
    },
    {
        id: 'dealer1', name: '딜러', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '공격력을 10만큼 높입니다.',
        apply(c) {
            c.damage += 10;
        }
    },
    {
        id: 'ninja', name: '닌자', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '이동속도를 1.2배 추가합니다.',
        apply(c) {
            c.moveSpeed *= 1.2;
        }
    },
    {
        id: 'shielder1', name: '쉴더', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '방어 쿨타임을 1.2배 줄입니다.',
        apply(c) {
            c.defendCooldown /= 1.2;
        }
    },
    {
        id: 'sky', name: '스카이', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '공중에서 물총을 쏘면 공격력이 15 늘어납니다.',
        apply(c) {
            c.airDamageBonus = (c.airDamageBonus || 0) + 15;
        }
    },
    {
        id: 'heavy', name: '헤비', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '공격속도를 0.1초 줄이지만 이동속도를 1.2배 줄입니다.',
        apply(c) {
            c.attackSpeed = Math.max(0.1, c.attackSpeed - 0.1);
            c.moveSpeed /= 1.2;
        }
    },
    {
        id: 'defense', name: '디펜스', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '방어 시간을 0.3초 늘립니다.',
        apply(c) {
            c.defendDuration += 0.3;
        }
    },
    {
        id: 'bomb', name: '폭탄', rarity: 'rare',
        color: '#9e9e9e', rarityName: '희귀',
        description: '총알이 벽에 닿으면 터지며 근처에 5만큼 데미지를 입힙니다.',
        apply(c) {
            c.hasExplosiveBullets = true;
            c.explosionDamage = (c.explosionDamage || 0) + 5;
        }
    },

    // ===================== 초희귀 (SUPER RARE) - Green =====================
    {
        id: 'tank2', name: '탱커2', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '체력을 1.2배만큼 높입니다.',
        apply(c) {
            c.maxHp = Math.floor(c.maxHp * 1.2);
            c.hp = Math.floor(c.hp * 1.2);
        }
    },
    {
        id: 'dealer2', name: '딜러2', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '공격력을 1.2배만큼 높입니다.',
        apply(c) {
            c.damage = Math.floor(c.damage * 1.2);
        }
    },
    {
        id: 'multiAttack', name: '다수 공격', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '공격속도를 0.2초 줄이는 대신 공격력을 10 줄입니다.',
        apply(c) {
            c.attackSpeed = Math.max(0.1, c.attackSpeed - 0.2);
            c.damage = Math.max(1, c.damage - 10);
        }
    },
    {
        id: 'shielder2', name: '쉴더2', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '방어 쿨타임을 1.2배 줄입니다.',
        apply(c) {
            c.defendCooldown /= 1.2;
        }
    },
    {
        id: 'healer', name: '힐러', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '방어를 하면 체력 5만큼 회복합니다.',
        apply(c) {
            c.healOnDefend = (c.healOnDefend || 0) + 5;
        }
    },
    {
        id: 'slime', name: '슬라임', rarity: 'superRare',
        color: '#4CAF50', rarityName: '초희귀',
        description: '총알이 세 번 튕깁니다.',
        apply(c) {
            c.bulletBounces = 3;
        }
    },

    // ===================== 에픽 (EPIC) - Purple =====================
    {
        id: 'blade', name: '칼날', rarity: 'epic',
        color: '#ab47bc', rarityName: '에픽',
        description: '방어를 할 때마다 근처에 있는 사람에게 30만큼의 데미지를 줍니다.',
        apply(c) {
            c.bladeOnDefend = (c.bladeOnDefend || 0) + 30;
        }
    },
    {
        id: 'rapidFire', name: '속사포', rarity: 'epic',
        color: '#ab47bc', rarityName: '에픽',
        description: '공격속도가 0.3초가 되는 대신 공격력이 10이 됩니다.',
        apply(c) {
            c.attackSpeed = 0.3;
            c.damage = 10;
        }
    },
    {
        id: 'vampire', name: '흡혈귀', rarity: 'epic',
        color: '#ab47bc', rarityName: '에픽',
        description: '데미지를 입힐 때마다 입힌 데미지의 0.3배만큼 회복합니다.',
        apply(c) {
            c.vampireRatio = (c.vampireRatio || 0) + 0.3;
        }
    },

    // ===================== 전설 (LEGENDARY) - Yellow =====================
    {
        id: 'nuke', name: '핵', rarity: 'legendary',
        color: '#ffd700', rarityName: '전설',
        description: '공격속도가 8초가 되는 대신 데미지가 100이 됩니다.',
        apply(c) {
            c.attackSpeed = 8;
            c.damage = 100;
        }
    },
    {
        id: 'angel', name: '엔젤', rarity: 'legendary',
        color: '#ffd700', rarityName: '전설',
        description: '방어 쿨타임이 20초가 되는 대신 방어를 할 때마다 체력이 20 증가합니다. (한계치 없음)',
        apply(c) {
            c.defendCooldown = 20;
            c.hasNoHpCap = true;
            c.healOnDefend = (c.healOnDefend || 0) + 20;
        }
    },

    // ===================== 메가 (MEGA) - Red =====================
    {
        id: 'berserker', name: '버서커', rarity: 'mega',
        color: '#f44336', rarityName: '메가',
        description: '체력이 40 이하가 되면 공격력 2배, 이동속도 1.5배, 공격속도 1.5초.',
        apply(c) {
            c.hasBerserker = true;
        }
    }
];

// ===== Rarity weights for random selection =====
window.RARITY_WEIGHTS = {
    rare: 50,
    superRare: 25,
    epic: 15,
    legendary: 9,
    mega: 1
};

// ===== Get N random cards with weighted rarity =====
window.getRandomCards = function (count) {
    const entries = Object.entries(window.RARITY_WEIGHTS);
    const totalWeight = entries.reduce((s, [, w]) => s + w, 0);
    const cards = [];
    let attempts = 0;

    while (cards.length < count && attempts < 200) {
        attempts++;
        // Pick rarity
        let r = Math.random() * totalWeight;
        let rarity = 'rare';
        for (const [rar, weight] of entries) {
            r -= weight;
            if (r <= 0) { rarity = rar; break; }
        }
        // Pick card from that rarity
        const pool = window.CARD_POOL.filter(c => c.rarity === rarity);
        if (pool.length === 0) continue;
        const card = pool[Math.floor(Math.random() * pool.length)];
        if (!cards.find(c => c.id === card.id)) {
            cards.push({ ...card }); // clone
        }
    }

    // Fill remaining with random rare cards if needed
    while (cards.length < count) {
        const pool = window.CARD_POOL.filter(c => c.rarity === 'rare');
        const card = pool[Math.floor(Math.random() * pool.length)];
        if (!cards.find(c => c.id === card.id)) {
            cards.push({ ...card });
        }
    }

    return cards;
};
