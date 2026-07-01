// ============================================================
// WATER GUN BATTLE - GAME ENGINE (game.js)
// ============================================================

// ===== Game Configuration & Constants =====
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.5;
const FRICTION = 0.85;
const JUMP_FORCE = -12;
const BASE_MAX_HP = 60;
const BASE_DAMAGE = 30;
const WINS_TO_FINISH = 3;
const BULLET_SPEED = 15;

// ===== Sound/Visual Effects (Web Audio API Synthesizer) =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSound(type) {
    try {
        if (!audioCtx) {
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'shoot') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'hit') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'shield') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'win') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1);
            osc.frequency.setValueAtTime(659, now + 0.2);
            osc.frequency.setValueAtTime(880, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        }
    } catch (e) {
        // Audio not allowed or failed
    }
}

// ===== Game State =====
const state = {
    started: false,
    round: 1,
    p1: null,
    p2: null,
    bullets: [],
    particles: [],
    explosions: [],
    platforms: [],
    keys: {},
    p1Wins: 0,
    p2Wins: 0,
    activeCardRecipient: null,
    selectedCard: null,
    selectedCardIdx: -1,
    currentQuiz: null,
    quizMode: 'card',
    quizStations: [],
    activeQuizStation: null,
    nearbyQuizStation: null,
    pendingQuizReward: null,
    isP2AI: true,
    aiDifficulty: 'normal',
    controlScheme: 'mouse',
    lastAiActionTime: 0,
    pointerAiming: false,
    pointerShooting: false,
    arenaTheme: null
};

// ===== Platforms (Arena Design) =====
const ARENA_THEMES = [
    { bg: '#071824', grid: '#12364a', ground: '#2f7d95', structure: '#35c2d1' },
    { bg: '#180f24', grid: '#34214e', ground: '#8f4bd1', structure: '#f067b4' },
    { bg: '#101f16', grid: '#244532', ground: '#43a36f', structure: '#f3cf5a' },
    { bg: '#201509', grid: '#4a2d15', ground: '#d57a32', structure: '#62d2ff' },
    { bg: '#111525', grid: '#29345b', ground: '#6d8cff', structure: '#ffcc66' }
];

const PLATFORM_LAYOUTS = [
    [
        { x: 150, y: 405, w: 190, h: 16, type: 'platform' },
        { x: 684, y: 405, w: 190, h: 16, type: 'platform' },
        { x: 412, y: 310, w: 200, h: 16, type: 'platform' },
        { x: 205, y: 215, w: 150, h: 16, type: 'platform' },
        { x: 669, y: 215, w: 150, h: 16, type: 'platform' }
    ],
    [
        { x: 110, y: 390, w: 180, h: 16, type: 'platform' },
        { x: 734, y: 390, w: 180, h: 16, type: 'platform' },
        { x: 335, y: 300, w: 150, h: 16, type: 'platform' },
        { x: 540, y: 300, w: 150, h: 16, type: 'platform' },
        { x: 452, y: 205, w: 120, h: 18, type: 'block' }
    ],
    [
        { x: 210, y: 430, w: 130, h: 16, type: 'platform' },
        { x: 684, y: 430, w: 130, h: 16, type: 'platform' },
        { x: 110, y: 300, w: 160, h: 16, type: 'platform' },
        { x: 754, y: 300, w: 160, h: 16, type: 'platform' },
        { x: 420, y: 250, w: 184, h: 16, type: 'platform' },
        { x: 492, y: 370, w: 40, h: 90, type: 'block' }
    ],
    [
        { x: 130, y: 250, w: 190, h: 16, type: 'platform' },
        { x: 704, y: 250, w: 190, h: 16, type: 'platform' },
        { x: 360, y: 360, w: 304, h: 16, type: 'platform' },
        { x: 250, y: 455, w: 95, h: 16, type: 'platform' },
        { x: 679, y: 455, w: 95, h: 16, type: 'platform' }
    ]
];

const AI_DIFFICULTY = {
    easy: { label: '쉬움', actionDelay: 170, moveScale: 0.55, aimNoise: 0.16, shootChance: 0.08, jumpChance: 0.05, defendChance: 0.28, defendRange: 120 },
    normal: { label: '보통', actionDelay: 110, moveScale: 0.72, aimNoise: 0.08, shootChance: 0.16, jumpChance: 0.1, defendChance: 0.55, defendRange: 155 },
    hard: { label: '어려움', actionDelay: 75, moveScale: 0.9, aimNoise: 0.025, shootChance: 0.26, jumpChance: 0.16, defendChance: 0.78, defendRange: 190 }
};

const QUIZ_REWARDS = [
    {
        id: 'attack',
        name: '공격력 +5',
        description: '물총 데미지가 영구적으로 5 증가합니다.',
        color: '#ff9f43',
        apply(c) {
            c.damage += 5;
        }
    },
    {
        id: 'armor',
        name: '방어력 +2',
        description: '받는 데미지를 영구적으로 2 줄입니다.',
        color: '#5fcaff',
        apply(c) {
            c.armor += 2;
        }
    },
    {
        id: 'health',
        name: '최대 체력 +8',
        description: '최대 체력과 현재 체력이 8 증가합니다.',
        color: '#4CAF50',
        apply(c) {
            c.maxHp += 8;
            c.hp = Math.min(c.maxHp, c.hp + 8);
        }
    },
    {
        id: 'speed',
        name: '이동속도 +0.7',
        description: '이동속도가 영구적으로 증가합니다.',
        color: '#ffd54f',
        apply(c) {
            c.moveSpeed += 0.7;
        }
    },
    {
        id: 'cooldown',
        name: '연사력 증가',
        description: '발사 쿨타임이 영구적으로 조금 줄어듭니다.',
        color: '#ab47bc',
        apply(c) {
            c.attackSpeed = Math.max(0.25, c.attackSpeed - 0.08);
        }
    }
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function shuffleArray(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function randomizeArenaTheme() {
    state.arenaTheme = { ...pickRandom(ARENA_THEMES) };
}

function initPlatforms(randomize = false) {
    if (randomize || !state.arenaTheme) {
        randomizeArenaTheme();
    }

    const layout = pickRandom(PLATFORM_LAYOUTS).map(plat => ({ ...plat }));
    state.platforms = [
        // Ground
        { x: 0, y: CANVAS_HEIGHT - 30, w: CANVAS_WIDTH, h: 30, type: 'ground' },
        // Left wall
        { x: 0, y: 0, w: 20, h: CANVAS_HEIGHT, type: 'wall' },
        // Right wall
        { x: CANVAS_WIDTH - 20, y: 0, w: 20, h: CANVAS_HEIGHT, type: 'wall' },
        // Ceiling
        { x: 0, y: 0, w: CANVAS_WIDTH, h: 20, type: 'wall' },
        
        ...layout
    ];
    initQuizStations(layout);
}

function initQuizStations(layout) {
    const candidates = layout
        .filter(plat => plat.type === 'platform' && plat.w >= 95)
        .map((plat, idx) => ({
            id: `station-${idx}`,
            x: plat.x + plat.w / 2,
            y: plat.y - 24,
            r: 16,
            used: false,
            reward: pickRandom(QUIZ_REWARDS)
        }));

    state.quizStations = shuffleArray(candidates).slice(0, Math.min(3, candidates.length));
    state.nearbyQuizStation = null;
    state.activeQuizStation = null;
}

function drawRoundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}

function getDisplayName(character) {
    return character === state.p1 ? 'PLAYER 1' : 'AI';
}

// ===== Character Class =====
class Character {
    constructor(id, x, y, color, isP1) {
        this.id = id;
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;
        this.color = color;
        this.isP1 = isP1;

        // Base Stats
        this.maxHp = BASE_MAX_HP;
        this.hp = BASE_MAX_HP;
        this.damage = BASE_DAMAGE;
        this.armor = 0;
        this.attackSpeed = 1.0; // cooldown in seconds
        this.moveSpeed = 10;
        this.bulletScale = 0.3; // multiplier of character size
        this.defendDuration = 1.5; // in seconds
        this.defendCooldown = 10; // in seconds

        // Physics State
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.faceDir = isP1 ? 1 : -1; // 1: Right, -1: Left
        this.aimAngle = isP1 ? 0 : Math.PI;

        // Combat timers
        this.shootCooldownTimer = 0;
        this.shieldTimer = 0; // if > 0, currently defending
        this.shieldCooldownTimer = 0; // if > 0, cannot defend

        // Card Buff flags
        this.airDamageBonus = 0;
        this.hasExplosiveBullets = false;
        this.explosionDamage = 0;
        this.healOnDefend = 0;
        this.bulletBounces = 0;
        this.bladeOnDefend = 0;
        this.vampireRatio = 0;
        this.hasNoHpCap = false;
        this.hasBerserker = false;
        this.berserkerActive = false;

        // Visual effects
        this.invulnerableFlash = 0;
    }

    resetPosition() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.faceDir = this.isP1 ? 1 : -1;
        this.aimAngle = this.isP1 ? 0 : Math.PI;
        this.shieldTimer = 0;
        this.shieldCooldownTimer = 0;
        this.shootCooldownTimer = 0;
        
        // Heal to full
        this.hp = this.maxHp;
        this.berserkerActive = false;
    }

    getCenter() {
        return {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2
        };
    }

    setAimDirection(dx, dy) {
        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return;
        this.aimAngle = Math.atan2(dy, dx);
        this.faceDir = Math.cos(this.aimAngle) >= 0 ? 1 : -1;
    }

    setAimAt(x, y) {
        const center = this.getCenter();
        this.setAimDirection(x - center.x, y - center.y);
    }

    update(dt) {
        // Timers
        if (this.shootCooldownTimer > 0) this.shootCooldownTimer -= dt;
        if (this.shieldTimer > 0) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                // Shield ended, trigger cooldown
                this.shieldCooldownTimer = this.defendCooldown;
            }
        }
        if (this.shieldCooldownTimer > 0) this.shieldCooldownTimer -= dt;
        if (this.invulnerableFlash > 0) this.invulnerableFlash -= dt;

        // Berserker check
        if (this.hasBerserker) {
            const lowHp = this.hp <= 40;
            if (lowHp && !this.berserkerActive) {
                this.berserkerActive = true;
                // Double damage, 1.5x move speed, 1.5x attack rate
                this.damage *= 2;
                this.moveSpeed *= 1.5;
                this.attackSpeed /= 1.5;
                createImpactParticles(this.x + this.w/2, this.y + this.h/2, '#f44336', 15);
            } else if (!lowHp && this.berserkerActive) {
                // Remove buffer
                this.berserkerActive = false;
                this.damage /= 2;
                this.moveSpeed /= 1.5;
                this.attackSpeed *= 1.5;
            }
        }

        // Apply physics
        this.vy += GRAVITY;
        this.vx *= FRICTION;

        // Apply velocities
        this.x += this.vx;
        this.y += this.vy;

        // Border & Platform Collisions
        this.isGrounded = false;
        this.handleCollisions();
    }

    handleCollisions() {
        for (const plat of state.platforms) {
            // AABB Collision check
            if (this.x + this.w > plat.x &&
                this.x < plat.x + plat.w &&
                this.y + this.h > plat.y &&
                this.y < plat.y + plat.h) {
                
                // Calculate overlap on both axes
                const overlapX = Math.min(this.x + this.w - plat.x, plat.x + plat.w - this.x);
                const overlapY = Math.min(this.y + this.h - plat.y, plat.y + plat.h - this.y);

                if (overlapX < overlapY) {
                    // Resolve X axis
                    if (this.x + this.w / 2 < plat.x + plat.w / 2) {
                        this.x -= overlapX;
                        this.vx = 0;
                    } else {
                        this.x += overlapX;
                        this.vx = 0;
                    }
                } else {
                    // Resolve Y axis
                    if (this.y + this.h / 2 < plat.y + plat.h / 2) {
                        // Land on platform
                        // Allow passing through "platform" type from bottom, only land from top
                        if (plat.type === 'platform' && this.vy < 0) {
                            continue; // Skip resolving if moving up
                        }
                        this.y -= overlapY;
                        this.vy = 0;
                        this.isGrounded = true;
                    } else {
                        // Collide ceiling/under platform (only wall/ground or if not passing platform)
                        if (plat.type !== 'platform') {
                            this.y += overlapY;
                            this.vy = 0;
                        }
                    }
                }
            }
        }
    }

    jump() {
        if (this.isGrounded && this.shieldTimer <= 0) {
            this.vy = JUMP_FORCE;
            this.isGrounded = false;
            playSound('shield'); // simple jump sound
        }
    }

    defend() {
        if (this.shieldCooldownTimer <= 0 && this.shieldTimer <= 0) {
            this.shieldTimer = this.defendDuration;
            playSound('shield');

            // Apply 'Healer' / 'Angel' on-defend buffs
            if (this.healOnDefend > 0) {
                this.hp += this.healOnDefend;
                if (!this.hasNoHpCap && this.hp > this.maxHp) {
                    this.hp = this.maxHp;
                }
                createImpactParticles(this.x + this.w/2, this.y + this.h/2, '#4CAF50', 8);
            }

            // Apply 'Blade' (칼날) on-defend buff
            if (this.bladeOnDefend > 0) {
                const opponent = this.isP1 ? state.p2 : state.p1;
                // Calculate distance
                const dx = (this.x + this.w/2) - (opponent.x + opponent.w/2);
                const dy = (this.y + this.h/2) - (opponent.y + opponent.h/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    opponent.takeDamage(this.bladeOnDefend);
                    createImpactParticles(opponent.x + opponent.w/2, opponent.y + opponent.h/2, '#ab47bc', 12);
                }
            }
        }
    }

    shoot() {
        if (this.shootCooldownTimer <= 0 && this.shieldTimer <= 0) {
            this.shootCooldownTimer = this.attackSpeed;
            playSound('shoot');

            const bSize = this.w * this.bulletScale;
            const aimX = Math.cos(this.aimAngle);
            const aimY = Math.sin(this.aimAngle);
            const center = this.getCenter();
            const spawnDist = this.w * 0.62 + bSize;
            const bx = center.x + aimX * spawnDist - bSize / 2;
            const by = center.y + aimY * spawnDist - bSize / 2;

            // Damage multiplier if in the air
            let bulletDamage = this.damage;
            if (!this.isGrounded && this.airDamageBonus > 0) {
                bulletDamage += this.airDamageBonus;
            }

            state.bullets.push({
                x: bx,
                y: by,
                w: bSize,
                h: bSize,
                vx: aimX * BULLET_SPEED,
                vy: aimY * BULLET_SPEED,
                damage: bulletDamage,
                owner: this,
                bounces: this.bulletBounces,
                isExplosive: this.hasExplosiveBullets,
                explosionDamage: this.explosionDamage
            });
        }
    }

    takeDamage(dmg) {
        if (this.shieldTimer > 0) return; // Immune during shield

        const finalDamage = Math.max(1, dmg - this.armor);
        this.hp -= finalDamage;
        playSound('hit');
        createImpactParticles(this.x + this.w/2, this.y + this.h/2, this.color, 10);

        if (this.hp < 0) this.hp = 0;
    }

    draw(ctx) {
        ctx.save();

        // Neon Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // Shield Effect
        if (this.shieldTimer > 0) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }

        const center = this.getCenter();

        // Soft round body
        const bodyGradient = ctx.createRadialGradient(center.x - 8, center.y - 10, 4, center.x, center.y, this.w * 0.75);
        bodyGradient.addColorStop(0, '#ffffff');
        bodyGradient.addColorStop(0.22, this.color);
        bodyGradient.addColorStop(1, '#101025');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.w / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.w / 2 - 1, 0, Math.PI * 2);
        ctx.stroke();

        // Aim line and water gun
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(this.aimAngle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(42, 0);
        ctx.stroke();

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d2ff';
        ctx.fillStyle = '#00d2ff';
        drawRoundRect(ctx, 13, -5, 25, 10, 5);
        ctx.fill();
        ctx.fillStyle = '#e8fbff';
        drawRoundRect(ctx, 31, -3, 12, 6, 3);
        ctx.fill();
        ctx.restore();

        // Face indicator follows the aim angle
        ctx.fillStyle = '#ffffff';
        const eyeX = center.x + Math.cos(this.aimAngle) * 8 - 3;
        const eyeY = center.y + Math.sin(this.aimAngle) * 8 - 3;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// ===== Visual Effects Logic =====
function createImpactParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        state.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 4 + 2,
            color: color,
            alpha: 1.0,
            life: Math.random() * 20 + 20
        });
    }
}

function triggerExplosion(x, y, radius, damage, owner) {
    state.explosions.push({
        x: x,
        y: y,
        r: 10,
        maxR: radius,
        life: 15,
        maxLife: 15,
        color: '#ff5722'
    });

    // Check damage on opponent
    const opponent = owner.isP1 ? state.p2 : state.p1;
    const dx = (opponent.x + opponent.w/2) - x;
    const dy = (opponent.y + opponent.h/2) - y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < radius) {
        opponent.takeDamage(damage);
    }
}

// ===== Update Loop =====
let lastTime = 0;
function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt at 0.1s
    lastTime = time;

    if (state.started) {
        update(dt);
    }
    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // Process input controls
    handleInputs();

    // AI logic if active
    if (state.isP2AI) {
        handleP2AI(dt);
    }

    // Update characters
    state.p1.update(dt);
    state.p2.update(dt);
    updateQuizStations();

    // Update bullets
    for (let i = state.bullets.length - 1; i >= 0; i--) {
        const b = state.bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        let destroyed = false;

        // Check platform collisions
        for (const plat of state.platforms) {
            if (b.x + b.w > plat.x && b.x < plat.x + plat.w &&
                b.y + b.h > plat.y && b.y < plat.y + plat.h) {
                
                if (b.bounces > 0) {
                    b.bounces--;
                    // Calculate which side collided
                    const overlapX = Math.min(b.x + b.w - plat.x, plat.x + plat.w - b.x);
                    const overlapY = Math.min(b.y + b.h - plat.y, plat.y + plat.h - b.y);
                    if (overlapX < overlapY) {
                        b.vx *= -1; // bounce horizontally
                    } else {
                        b.vy *= -1; // bounce vertically
                    }
                    createImpactParticles(b.x + b.w/2, b.y + b.h/2, '#00d2ff', 4);
                } else {
                    destroyed = true;
                    if (b.isExplosive) {
                        triggerExplosion(b.x + b.w/2, b.y + b.h/2, 80, b.explosionDamage, b.owner);
                    }
                    createImpactParticles(b.x + b.w/2, b.y + b.h/2, '#00d2ff', 5);
                    break;
                }
            }
        }

        if (destroyed) {
            state.bullets.splice(i, 1);
            continue;
        }

        // Check hit opponent
        const opponent = b.owner.isP1 ? state.p2 : state.p1;
        if (b.x + b.w > opponent.x && b.x < opponent.x + opponent.w &&
            b.y + b.h > opponent.y && b.y < opponent.y + opponent.h) {
            
            // Hit!
            if (opponent.shieldTimer > 0) {
                // Blocked!
                createImpactParticles(b.x + b.w/2, b.y + b.h/2, '#ffffff', 8);
            } else {
                opponent.takeDamage(b.damage);
                
                // Vampire buff check
                if (b.owner.vampireRatio > 0) {
                    const healVal = b.damage * b.owner.vampireRatio;
                    b.owner.hp += healVal;
                    if (!b.owner.hasNoHpCap && b.owner.hp > b.owner.maxHp) {
                        b.owner.hp = b.owner.maxHp;
                    }
                    createImpactParticles(b.owner.x + b.owner.w/2, b.owner.y + b.owner.h/2, '#4CAF50', 5);
                }
            }

            state.bullets.splice(i, 1);
            continue;
        }
    }

    // Update particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, p.alpha - 1 / p.life);
        if (p.alpha <= 0) {
            state.particles.splice(i, 1);
        }
    }

    // Update explosions
    for (let i = state.explosions.length - 1; i >= 0; i--) {
        const e = state.explosions[i];
        e.life--;
        e.r = e.maxR * (1 - e.life / e.maxLife);
        if (e.life <= 0) {
            state.explosions.splice(i, 1);
        }
    }

    // Check round win conditions
    if (state.p1.hp <= 0) {
        endRound(state.p2);
    } else if (state.p2.hp <= 0) {
        endRound(state.p1);
    }

    // Update HUD Stats
    updateHUD();
}

function updateQuizStations() {
    state.nearbyQuizStation = null;
    const p1Center = state.p1.getCenter();

    for (const station of state.quizStations) {
        if (station.used) continue;
        const dx = p1Center.x - station.x;
        const dy = p1Center.y - station.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 58) {
            state.nearbyQuizStation = station;
            break;
        }
    }
}

function beginStationQuiz(station) {
    if (!station || station.used || !state.started) return;

    state.started = false;
    state.quizMode = 'boost';
    state.activeQuizStation = station;
    state.pendingQuizReward = station.reward;
    state.activeCardRecipient = state.p1;
    triggerQuiz();
}

function getQuizStationAtPoint(x, y) {
    return state.quizStations.find(station => {
        if (station.used) return false;
        const dx = x - station.x;
        const dy = y - station.y;
        return Math.sqrt(dx * dx + dy * dy) < 34;
    });
}

// ===== P1 / P2 Input Handling =====
let joystickInput = { x: 0, y: 0 };
let mobileActionKeys = { jump: false, shoot: false, defend: false };

function isKeyDown(...keys) {
    return keys.some(key => state.keys[key]);
}

function handleInputs() {
    // Player 1 controls
    const joystickMagnitude = Math.sqrt(joystickInput.x * joystickInput.x + joystickInput.y * joystickInput.y);
    const left = isKeyDown('ArrowLeft', 'a', 'A', 'KeyA');
    const right = isKeyDown('ArrowRight', 'd', 'D', 'KeyD');
    const jump = isKeyDown('ArrowUp', 'w', 'W', 'KeyW') || mobileActionKeys.jump;
    const defend = isKeyDown('ArrowDown', 's', 'S', 'KeyS', 'Shift', 'ShiftLeft', 'ShiftRight') || mobileActionKeys.defend;
    const shoot = isKeyDown(' ', 'Space', 'Enter') || mobileActionKeys.shoot || state.pointerShooting;
    const interact = isKeyDown('e', 'E', 'KeyE');

    if (joystickMagnitude > 0.12) {
        // Joystick override
        state.p1.vx = joystickInput.x * state.p1.moveSpeed;
        state.p1.setAimDirection(joystickInput.x, joystickInput.y);
    } else {
        // Keyboard controls
        if (left) {
            state.p1.vx = -state.p1.moveSpeed;
            if (state.controlScheme !== 'mouse' || !state.pointerAiming) state.p1.setAimDirection(-1, 0);
        }
        if (right) {
            state.p1.vx = state.p1.moveSpeed;
            if (state.controlScheme !== 'mouse' || !state.pointerAiming) state.p1.setAimDirection(1, 0);
        }
    }

    if (state.controlScheme === 'auto') {
        const p2Center = state.p2.getCenter();
        state.p1.setAimAt(p2Center.x, p2Center.y);
    }

    if (jump) {
        state.p1.jump();
    }
    if (defend) {
        state.p1.defend();
    }
    if (shoot) {
        state.p1.shoot();
    }
    if (interact && state.nearbyQuizStation) {
        state.keys['e'] = false;
        state.keys['E'] = false;
        state.keys['KeyE'] = false;
        beginStationQuiz(state.nearbyQuizStation);
    }
}

// ===== P2 AI Logic =====
function handleP2AI(dt) {
    const p2 = state.p2;
    const p1 = state.p1;
    const now = Date.now();
    const ai = AI_DIFFICULTY[state.aiDifficulty] || AI_DIFFICULTY.normal;

    // Limit AI action speed slightly
    if (now - state.lastAiActionTime < ai.actionDelay) return;
    state.lastAiActionTime = now;

    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const p1Center = p1.getCenter();
    p2.setAimAt(
        p1Center.x + (Math.random() - 0.5) * ai.aimNoise * CANVAS_WIDTH,
        p1Center.y + (Math.random() - 0.5) * ai.aimNoise * CANVAS_HEIGHT
    );

    // Movement
    if (Math.abs(dx) > 120) {
        if (dx > 0) {
            p2.vx = p2.moveSpeed * ai.moveScale;
        } else {
            p2.vx = -p2.moveSpeed * ai.moveScale;
        }
    }

    // Random jump logic if player is above or trapped
    if (dy < -80 && Math.random() < ai.jumpChance) {
        p2.jump();
    }

    // Shooting logic
    if (Math.random() < ai.shootChance) {
        p2.shoot();
    }

    // Defense logic (if bullets are coming close)
    for (const b of state.bullets) {
        if (b.owner.isP1) {
            const bdx = b.x - p2.x;
            const bdy = b.y - p2.y;
            // Bullet is close and heading to P2
            if (Math.abs(bdy) < 44 && bdx * b.vx < 0 && Math.abs(bdx) < ai.defendRange) {
                if (Math.random() < ai.defendChance) {
                    p2.defend();
                }
            }
        }
    }
}

// ===== Rendering Logic =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function setupCanvas() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}

function render() {
    const theme = state.arenaTheme || ARENA_THEMES[0];

    // Clear canvas
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid background (cool neon vibe)
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }

    // Draw Platforms
    for (const plat of state.platforms) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = plat.type === 'ground' ? theme.ground : theme.structure;
        
        ctx.fillStyle = plat.type === 'wall' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(8, 12, 24, 0.82)';
        drawRoundRect(ctx, plat.x, plat.y, plat.w, plat.h, plat.type === 'platform' ? 8 : 3);
        ctx.fill();

        ctx.strokeStyle = plat.type === 'ground' ? theme.ground : theme.structure;
        ctx.lineWidth = 2;
        drawRoundRect(ctx, plat.x, plat.y, plat.w, plat.h, plat.type === 'platform' ? 8 : 3);
        ctx.stroke();
        ctx.restore();
    }

    drawQuizStations(ctx);

    // Draw Particles
    for (const p of state.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Draw Explosions
    for (const e of state.explosions) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = e.color;
        ctx.fillStyle = 'rgba(255, 87, 34, 0.3)';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // Draw Bullets
    for (const b of state.bullets) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00d2ff';
        ctx.fillStyle = '#00d2ff';
        ctx.beginPath();
        ctx.arc(b.x + b.w/2, b.y + b.h/2, b.w/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Draw Characters
    state.p1.draw(ctx);
    state.p2.draw(ctx);
    drawCharacterStatus(ctx, state.p1);
    drawCharacterStatus(ctx, state.p2);
}

function drawQuizStations(ctx) {
    for (const station of state.quizStations) {
        if (station.used) continue;

        const isNear = station === state.nearbyQuizStation;
        ctx.save();
        ctx.shadowBlur = isNear ? 22 : 14;
        ctx.shadowColor = station.reward.color;
        ctx.fillStyle = isNear ? station.reward.color : 'rgba(255, 255, 255, 0.12)';
        ctx.strokeStyle = station.reward.color;
        ctx.lineWidth = isNear ? 3 : 2;
        ctx.beginPath();
        ctx.arc(station.x, station.y, station.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Q', station.x, station.y + 3);

        if (isNear) {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.86)';
            drawRoundRect(ctx, station.x - 74, station.y - 54, 148, 28, 8);
            ctx.fill();
            ctx.strokeStyle = station.reward.color;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Noto Sans KR", "Malgun Gothic", sans-serif';
            ctx.fillText(`E 퀴즈: ${station.reward.name}`, station.x, station.y - 36);
        }
        ctx.restore();
    }
}

function drawCharacterStatus(ctx, character) {
    const center = character.getCenter();
    const barW = 72;
    const barH = 8;
    const x = center.x - barW / 2;
    const y = character.y - 22;
    const hpRatio = Math.max(0, Math.min(1, character.hp / character.maxHp));

    ctx.save();
    ctx.fillStyle = 'rgba(6, 8, 18, 0.78)';
    drawRoundRect(ctx, x, y, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = character.color;
    drawRoundRect(ctx, x, y, barW * hpRatio, barH, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, x, y, barW, barH, 4);
    ctx.stroke();

    ctx.font = 'bold 10px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(character.hp)}/${character.maxHp}`, center.x, y - 3);

    if (character.damage !== BASE_DAMAGE || character.armor > 0) {
        ctx.fillStyle = 'rgba(6, 8, 18, 0.72)';
        drawRoundRect(ctx, center.x - 42, y + 12, 84, 18, 8);
        ctx.fill();
        ctx.fillStyle = '#dff7ff';
        ctx.font = 'bold 9px "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillText(`공 ${character.damage}  방 ${character.armor}`, center.x, y + 25);
    }
    ctx.restore();
}

// ===== UI/HUD Stat Synchronization =====
function updateHUD() {
    // Draw the HUD directly on canvas so it is always present.
    ctx.save();
    // P1 HUD
    ctx.fillStyle = 'rgba(10, 10, 20, 0.7)';
    ctx.fillRect(30, 25, 220, 45);
    ctx.strokeStyle = state.p1.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 25, 220, 45);
    
    ctx.fillStyle = state.p1.color;
    ctx.font = 'bold 12px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText(`PLAYER 1   Wins: ${state.p1Wins}/${WINS_TO_FINISH}`, 40, 42);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(40, 50, 200, 10);
    ctx.fillStyle = state.p1.color;
    ctx.fillRect(40, 50, 200 * (state.p1.hp / state.p1.maxHp), 10);

    // P2 HUD
    ctx.fillStyle = 'rgba(10, 10, 20, 0.7)';
    ctx.fillRect(CANVAS_WIDTH - 250, 25, 220, 45);
    ctx.strokeStyle = state.p2.color;
    ctx.strokeRect(CANVAS_WIDTH - 250, 25, 220, 45);
    
    ctx.fillStyle = state.p2.color;
    ctx.font = 'bold 12px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText(`AI   Wins: ${state.p2Wins}/${WINS_TO_FINISH}`, CANVAS_WIDTH - 240, 42);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(CANVAS_WIDTH - 240, 50, 200, 10);
    ctx.fillStyle = state.p2.color;
    ctx.fillRect(CANVAS_WIDTH - 240, 50, 200 * (state.p2.hp / state.p2.maxHp), 10);
    
    // Shield Cooldown HUD
    if (state.p1.shieldCooldownTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillText(`SHIELD COOLDOWN: ${state.p1.shieldCooldownTimer.toFixed(1)}s`, 40, 85);
    }
    if (state.p2.shieldCooldownTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillText(`SHIELD COOLDOWN: ${state.p2.shieldCooldownTimer.toFixed(1)}s`, CANVAS_WIDTH - 240, 85);
    }
    ctx.restore();
}

// ===== Round Winner Handling =====
function endRound(winner) {
    playSound('win');
    state.started = false;
    
    let isP1Winner = winner === state.p1;
    if (isP1Winner) {
        state.p1Wins++;
    } else {
        state.p2Wins++;
    }

    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlaySub = document.getElementById('overlay-subtext');
    const overlayBtn = document.getElementById('overlay-btn');

    overlay.classList.remove('hidden');
    overlayText.textContent = `${getDisplayName(winner)} 라운드 승리!`;
    overlayText.style.color = winner.color;
    overlaySub.textContent = `PLAYER 1: ${state.p1Wins}/${WINS_TO_FINISH} | AI: ${state.p2Wins}/${WINS_TO_FINISH}`;
    
    // Check game finish
    if (state.p1Wins >= WINS_TO_FINISH || state.p2Wins >= WINS_TO_FINISH) {
        const finalWinner = state.p1Wins >= WINS_TO_FINISH ? state.p1 : state.p2;
        overlayText.textContent = `${getDisplayName(finalWinner)} 최종 승리!`;
        overlayText.style.color = finalWinner.color;
        overlaySub.textContent = `최종 점수 - PLAYER 1: ${state.p1Wins} | AI: ${state.p2Wins}`;
        overlayBtn.classList.remove('hidden');
        overlayBtn.textContent = '다시 시작';
        overlayBtn.onclick = () => {
            state.p1Wins = 0;
            state.p2Wins = 0;
            overlay.classList.add('hidden');
            overlayBtn.classList.add('hidden');
            state.activeCardRecipient = null;
            resetPlayersForNewMatch();
            startRound();
        };
        return;
    }

    // Every round win grants a card draw.
    state.activeCardRecipient = winner;
    setTimeout(() => {
        overlay.classList.add('hidden');
        showCardSelection();
    }, 1200);
}

function startRound() {
    initPlatforms(true);
    state.p1.resetPosition();
    state.p2.resetPosition();
    state.bullets = [];
    state.particles = [];
    state.explosions = [];
    state.started = true;
    state.pointerShooting = false;
    state.isP2AI = true;
    state.quizMode = 'card';
    state.pendingQuizReward = null;
    state.activeQuizStation = null;
    state.nearbyQuizStation = null;
    lastTime = 0;

    // Regain focus on the canvas for key capture
    const canvasEl = document.getElementById('gameCanvas');
    if (canvasEl) {
        canvasEl.focus();
    }
    window.focus();
}

// ===== Card Draw Modal logic =====
function showCardSelection() {
    const modal = document.getElementById('card-modal');
    const container = document.getElementById('card-container');
    const subtitle = document.getElementById('card-modal-subtitle');
    
    modal.classList.remove('hidden');
    subtitle.textContent = `${getDisplayName(state.activeCardRecipient)}가 퀴즈를 풀고 카드를 고를 수 있습니다!`;
    container.innerHTML = '';

    // Draw 5 weighted random cards
    const cards = window.getRandomCards(5);

    cards.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = `card-item rarity-${card.rarity}`;
        cardEl.style.borderColor = card.color;
        cardEl.style.boxShadow = `0 0 10px ${card.color}80`;

        cardEl.innerHTML = `
            <div class="card-rarity" style="color: ${card.color}">${card.rarityName.toUpperCase()}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-desc">${card.description}</div>
        `;

        cardEl.onclick = () => {
            selectCard(card, idx);
        };

        container.appendChild(cardEl);
    });
}

function selectCard(card, idx) {
    state.selectedCard = card;
    state.selectedCardIdx = idx;
    state.quizMode = 'card';
    
    // Hide Card selection and trigger Quiz
    document.getElementById('card-modal').classList.add('hidden');
    triggerQuiz();
}

// ===== Quiz Modal Logic =====
function getAllowedQuizData() {
    if (!window.QUIZ_DATA) return [];
    return window.QUIZ_DATA.filter(quiz => quiz.semester === 1 && quiz.unit >= 1 && quiz.unit <= 4);
}

function triggerQuiz() {
    const quizData = getAllowedQuizData();
    if (quizData.length === 0) {
        // Safe fallback if quiz.js failed to load
        alert('1학기 1~4단원 퀴즈 데이터가 없으므로 보상을 바로 적용합니다.');
        applyCurrentQuizReward();
        finishQuizFlow();
        return;
    }

    const quizModal = document.getElementById('quiz-modal');
    const playerInfo = document.getElementById('quiz-player-info');
    const qText = document.getElementById('quiz-question');
    const optionsGrid = document.getElementById('quiz-options');

    // Pick a random question
    const qIdx = Math.floor(Math.random() * quizData.length);
    const pickedQuiz = quizData[qIdx];
    const shuffledOptions = shuffleArray(pickedQuiz.options.map((text, originalIdx) => ({ text, originalIdx })));
    state.currentQuiz = {
        ...pickedQuiz,
        options: shuffledOptions.map(option => option.text),
        answer: shuffledOptions.findIndex(option => option.originalIdx === pickedQuiz.answer)
    };

    quizModal.classList.remove('hidden');
    const unitLabel = `${state.currentQuiz.unit}단원 ${state.currentQuiz.unitName}`;
    if (state.quizMode === 'boost') {
        playerInfo.textContent = `${unitLabel} · 보상: ${state.pendingQuizReward.name}`;
    } else {
        playerInfo.textContent = `${getDisplayName(state.activeCardRecipient)} · ${unitLabel}`;
    }
    qText.textContent = state.currentQuiz.question;
    optionsGrid.innerHTML = '';

    state.currentQuiz.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => {
            submitQuizAnswer(optIdx);
        };
        optionsGrid.appendChild(btn);
    });
}

function submitQuizAnswer(optIdx) {
    document.getElementById('quiz-modal').classList.add('hidden');
    
    const resultModal = document.getElementById('quiz-result');
    const resultIcon = document.getElementById('quiz-result-icon');
    const resultTitle = document.getElementById('quiz-result-title');
    const resultExpl = document.getElementById('quiz-result-explanation');
    const resultBtn = document.getElementById('quiz-result-btn');

    const isCorrect = optIdx === state.currentQuiz.answer;

    if (isCorrect) {
        resultIcon.textContent = 'OK';
        resultIcon.className = 'result-icon correct';
        resultTitle.textContent = '정답입니다!';
        resultTitle.style.color = '#4CAF50';
        applyCurrentQuizReward();
    } else {
        resultIcon.textContent = 'X';
        resultIcon.className = 'result-icon incorrect';
        resultTitle.textContent = '오답입니다!';
        resultTitle.style.color = '#f44336';
        if (state.quizMode === 'boost' && state.activeQuizStation) {
            state.activeQuizStation.used = true;
        }
    }

    const rewardText = state.quizMode === 'boost'
        ? `구조물 보상: ${state.pendingQuizReward.name} - ${isCorrect ? '적용됨' : '미적용됨'}`
        : `선택 카드: ${state.selectedCard.name} - ${isCorrect ? '적용됨' : '미적용됨'}`;

    resultExpl.textContent = `${state.currentQuiz.explanation}\n\n[${rewardText}]`;
    resultModal.classList.remove('hidden');

    resultBtn.onclick = () => {
        resultModal.classList.add('hidden');
        finishQuizFlow();
    };
}

function applyCurrentQuizReward() {
    if (state.quizMode === 'boost') {
        if (!state.pendingQuizReward || !state.activeQuizStation) return;
        state.pendingQuizReward.apply(state.p1);
        state.activeQuizStation.used = true;
        createImpactParticles(state.p1.x + state.p1.w / 2, state.p1.y + state.p1.h / 2, state.pendingQuizReward.color, 18);
        return;
    }

    if (state.selectedCard && state.activeCardRecipient) {
        state.selectedCard.apply(state.activeCardRecipient);
    }
}

function finishQuizFlow() {
    if (state.quizMode === 'boost') {
        state.quizMode = 'card';
        state.pendingQuizReward = null;
        state.activeQuizStation = null;
        state.activeCardRecipient = null;
        state.started = true;
        lastTime = 0;
        canvas.focus();
        return;
    }

    startRound();
}

function resetPlayersForNewMatch() {
    const p1Color = state.p1 ? state.p1.color : '#4a9eff';
    const p2Color = state.p2 ? state.p2.color : '#ff4a4a';
    state.p1 = new Character('p1', 100, CANVAS_HEIGHT - 100, p1Color, true);
    state.p2 = new Character('p2', CANVAS_WIDTH - 140, CANVAS_HEIGHT - 100, p2Color, false);
}

function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (CANVAS_WIDTH / rect.width),
        y: (event.clientY - rect.top) * (CANVAS_HEIGHT / rect.height)
    };
}

function setupPointerAim() {
    canvas.addEventListener('pointermove', event => {
        if (!state.p1) return;
        const point = getCanvasPoint(event);
        state.p1.setAimAt(point.x, point.y);
        state.pointerAiming = true;
    });

    canvas.addEventListener('pointerdown', event => {
        if (!state.started || !state.p1) return;
        const point = getCanvasPoint(event);
        const clickedStation = getQuizStationAtPoint(point.x, point.y);
        if (clickedStation) {
            beginStationQuiz(clickedStation);
            event.preventDefault();
            return;
        }

        if (event.button === 2) {
            state.p1.defend();
            event.preventDefault();
            return;
        }

        state.p1.setAimAt(point.x, point.y);
        state.pointerAiming = true;
        state.pointerShooting = true;
        state.p1.shoot();
        event.preventDefault();
    });

    window.addEventListener('pointerup', () => {
        state.pointerShooting = false;
    });

    window.addEventListener('pointercancel', () => {
        state.pointerShooting = false;
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
}

function setupColorCustomizer() {
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const target = swatch.dataset.target;
            const color = swatch.dataset.color;
            const character = target === 'p1' ? state.p1 : state.p2;
            if (!character || !color) return;

            character.color = color;
            swatch.parentElement.querySelectorAll('.color-swatch').forEach(btn => {
                btn.classList.toggle('active', btn === swatch);
                btn.setAttribute('aria-pressed', btn === swatch ? 'true' : 'false');
            });
        });
    });
}

function setupMenuSettings() {
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const setting = button.dataset.setting;
            const value = button.dataset.value;

            if (setting === 'control') {
                state.controlScheme = value;
                state.pointerAiming = false;
            }
            if (setting === 'ai') {
                state.aiDifficulty = value;
            }

            button.parentElement.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.toggle('active', btn === button);
                btn.setAttribute('aria-pressed', btn === button ? 'true' : 'false');
            });
        });
    });
}

// ===== Initializer =====
function init() {
    setupCanvas();
    initPlatforms(true);
    resetPlayersForNewMatch();

    // Bind controls
    window.addEventListener('keydown', e => {
        state.keys[e.key] = true;
        state.keys[e.code] = true; // Bind physical key codes (e.g. KeyA, ArrowLeft)
        
        // Prevent default browser behaviors like scrolling down with Arrow keys or Space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].indexOf(e.key) >= 0) {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', e => {
        state.keys[e.key] = false;
        state.keys[e.code] = false;
    });

    // Mobile Virtual Joystick Setup
    setupMobileControls();
    setupPointerAim();
    setupColorCustomizer();
    setupMenuSettings();

    // Start screen click
    const startBtn = document.getElementById('btn-start');
    startBtn.onclick = () => {
        document.getElementById('start-screen').style.display = 'none';
        state.started = true;
        startRound();
        
        // Focus the canvas to receive keyboard inputs immediately
        const canvasEl = document.getElementById('gameCanvas');
        if (canvasEl) {
            canvasEl.focus();
        }
        window.focus();
        
        requestAnimationFrame(gameLoop);
    };
}

// ===== Mobile Controls Support =====
function setupMobileControls() {
    const joystickZone = document.getElementById('joystick-zone');
    const stick = document.getElementById('joystick-stick');
    const joystickBase = document.getElementById('joystick-base');

    if (!joystickZone) return;

    let dragging = false;
    let baseRect = null;
    let maxRadius = 40;

    joystickZone.addEventListener('touchstart', e => {
        dragging = true;
        baseRect = joystickBase.getBoundingClientRect();
        e.preventDefault();
    });

    joystickZone.addEventListener('touchmove', e => {
        if (!dragging || !baseRect) return;

        const touch = e.touches[0];
        const baseX = baseRect.left + baseRect.width / 2;
        const baseY = baseRect.top + baseRect.height / 2;

        let dx = touch.clientX - baseX;
        let dy = touch.clientY - baseY;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > maxRadius) {
            dx = (dx / dist) * maxRadius;
            dy = (dy / dist) * maxRadius;
        }

        stick.style.transform = `translate(${dx}px, ${dy}px)`;

        // Translate to velocity inputs for P1
        joystickInput.x = dx / maxRadius;
        joystickInput.y = dy / maxRadius;
        e.preventDefault();
    });

    const resetJoystick = () => {
        dragging = false;
        stick.style.transform = 'translate(0, 0)';
        joystickInput.x = 0;
        joystickInput.y = 0;
    };

    joystickZone.addEventListener('touchend', resetJoystick);
    joystickZone.addEventListener('touchcancel', resetJoystick);

    // Mobile Action buttons
    const btnJump = document.getElementById('btn-jump');
    const btnShoot = document.getElementById('btn-shoot');
    const btnDefend = document.getElementById('btn-defend');

    const handleTouchKey = (btn, keyName) => {
        btn.addEventListener('touchstart', e => {
            mobileActionKeys[keyName] = true;
            e.preventDefault();
        });
        btn.addEventListener('touchend', e => {
            mobileActionKeys[keyName] = false;
            e.preventDefault();
        });
    };

    if (btnJump) handleTouchKey(btnJump, 'jump');
    if (btnShoot) handleTouchKey(btnShoot, 'shoot');
    if (btnDefend) handleTouchKey(btnDefend, 'defend');

    // Auto-detect mobile to display overlay controls
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                     || window.innerWidth < 800;

    if (isMobile) {
        document.getElementById('mobile-controls').classList.remove('hidden');
    }
}

// Fire init on load
window.onload = init;
