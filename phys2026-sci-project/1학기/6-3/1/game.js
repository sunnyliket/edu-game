// ============================================================================
// Science Quiz RNG & RPG - Core Game Engine (3rd Person Camera & Humanoid)
// ============================================================================

// --- 무기 데이터 카탈로그 ---
const WEAPON_CATALOG = {
  rare: [
    { name: "쓰레기장에서 주운 물총", damage: 6, fireRate: 650, speed: 7, size: 5, color: "#854d0e", splash: 0, piercing: false, desc: "버려진 쓰레기 더미에서 주웠습니다. 수압이 약하고 물이 샙니다." }
  ],
  epic: [
    { name: "길거리에서 주운 물총", damage: 15, fireRate: 450, speed: 9, size: 7, color: "#c084fc", splash: 0, piercing: false, desc: "길가에 떨어져 있던 쓸만한 파란색 물총입니다." }
  ],
  mythic: [
    { name: "비싼 물총", damage: 32, fireRate: 300, speed: 12, size: 8, color: "#fb7185", splash: 0, piercing: false, desc: "문방구에서 판매하는 가장 비싼 최고급 압축 물총입니다." }
  ],
  legendary: [
    { name: "윤여선 선생님이 주신 물총", damage: 95, fireRate: 400, speed: 16, size: 10, splash: 0, piercing: true, color: "#fbbf24", desc: "윤여선 선생님의 사랑이 담긴 강력한 수압으로 몬스터들을 일렬로 관통해 꿰뚫어 버립니다!" },
    { name: "교장선생님이 주신 물총", damage: 75, fireRate: 650, speed: 6, size: 20, splash: 95, piercing: false, color: "#fbbf24", desc: "교장선생님의 말씀처럼 엄숙하고 거대한 물방울 폭탄을 발사하여 넓은 범위의 적들을 한 번에 날려버립니다!" },
    { name: "정온유선생님이 주신 물총", damage: 30, fireRate: 90, speed: 11, size: 4, splash: 0, piercing: false, color: "#fbbf24", desc: "정온유 선생님의 넘치는 열정처럼 기관총처럼 빠른 속도로 물방울을 난사하는 전설적인 무기입니다!" }
  ]
};

// --- 게임 상태 상수 ---
const STATE_LOBBY = 'LOBBY';
const STATE_DUNGEON = 'DUNGEON';
const DUNGEON_EXIT_PORTAL = { x: 80, y: 400, radius: 48 };

function drawBox3D(ctx, x, y, width, depth, height, colors) {
  const skew = depth * 0.42;
  const half = width / 2;
  const top = colors.top || colors.front;
  const front = colors.front || colors.top;
  const side = colors.side || colors.front;
  const stroke = colors.stroke || 'rgba(0, 0, 0, 0.35)';

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(x + skew * 0.45, y + 5, half + depth * 0.42, Math.max(5, depth * 0.28), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = side;
  ctx.beginPath();
  ctx.moveTo(x + half, y - height);
  ctx.lineTo(x + half + depth, y - height - skew);
  ctx.lineTo(x + half + depth, y - skew);
  ctx.lineTo(x + half, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = front;
  ctx.beginPath();
  ctx.moveTo(x - half, y - height);
  ctx.lineTo(x + half, y - height);
  ctx.lineTo(x + half, y);
  ctx.lineTo(x - half, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x - half, y - height);
  ctx.lineTo(x + half, y - height);
  ctx.lineTo(x + half + depth, y - height - skew);
  ctx.lineTo(x - half + depth, y - height - skew);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = stroke;
  ctx.lineWidth = colors.lineWidth || 1.4;
  ctx.beginPath();
  ctx.moveTo(x - half, y - height);
  ctx.lineTo(x + half, y - height);
  ctx.lineTo(x + half + depth, y - height - skew);
  ctx.lineTo(x - half + depth, y - height - skew);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeRect(x - half, y - height, width, height);
  ctx.restore();
}

function drawRoundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, width, height, radius) {
  drawRoundRectPath(ctx, x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundRect(ctx, x, y, width, height, radius) {
  drawRoundRectPath(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function drawPortal2D(ctx, x, y, radius, primary, accent, label, time = Date.now()) {
  const pulse = 0.72 + Math.sin(time * 0.005) * 0.16;
  const spin = time * 0.0022;

  ctx.save();
  ctx.globalAlpha = 0.23 + pulse * 0.12;
  ctx.fillStyle = primary;
  ctx.shadowBlur = 34;
  ctx.shadowColor = primary;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.34)';
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.45, radius * 1.18, radius * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = primary;
  ctx.lineWidth = 7;
  ctx.shadowBlur = 18;
  ctx.shadowColor = primary;
  ctx.beginPath();
  ctx.arc(x, y, radius, spin, spin + Math.PI * 1.42);
  ctx.stroke();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3.5;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.72, -spin * 1.2, Math.PI * 2 - spin * 1.2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 0.82;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  for (let i = 0; i < 7; i++) {
    const a = spin * 1.8 + i * Math.PI * 2 / 7;
    const px = x + Math.cos(a) * radius * (0.78 + (i % 2) * 0.28);
    const py = y + Math.sin(a) * radius * (0.78 + (i % 2) * 0.18);
    ctx.beginPath();
    ctx.arc(px, py, i % 2 ? 2.8 : 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.43, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (label) {
    ctx.font = 'bold 13px Outfit, Noto Sans KR, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillStyle = '#ffffff';
    ctx.strokeText(label, x, y - radius - 18);
    ctx.fillText(label, x, y - radius - 18);
  }
  ctx.restore();
}

// ============================================================================
// 1. 카메라 매니저 클래스
// ============================================================================
class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.mapWidth = 1600;
    this.mapHeight = 1200;
  }

  setMapSize(w, h) {
    this.mapWidth = w;
    this.mapHeight = h;
  }

  clampToMap() {
    this.x = Math.max(0, Math.min(this.mapWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(this.mapHeight - this.height, this.y));
  }

  snapTo(player) {
    this.x = player.x - this.width / 2;
    this.y = player.y - this.height / 2;
    this.clampToMap();
  }

  update(player) {
    // 플레이어 캐릭터가 뷰포트 정중앙에 위치하도록 타겟 좌표 계산
    const targetX = player.x - this.width / 2;
    const targetY = player.y - this.height / 2;

    // 부드러운 선형 보간(Lerp) 적용
    this.x += (targetX - this.x) * 0.08;
    this.y += (targetY - this.y) * 0.08;

    // 맵 밖으로 카메라가 벗어나지 않게 범위 클램프
    this.clampToMap();
  }
}

// ============================================================================
// 2. 캐릭터 & 몬스터 엔티티 정의
// ============================================================================

// [NEW] 3인칭 휴머노이드 플레이어 캐릭터
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 4.6;
    this.hp = 100;
    this.maxHp = 100;
    this.coins = 0;
    
    // 기본 무기 장착
    this.activeWeapon = { ...WEAPON_CATALOG.rare[0], rarity: "희귀" };
    this.inventory = [{ ...this.activeWeapon }];
    
    this.lastShotTime = 0;
    this.angle = 0;
    
    this.vx = 0;
    this.vy = 0;
    this.walkTimer = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.vx = 0;
    this.vy = 0;
    this.walkTimer = 0;
  }

  takeDamage(amount) {
    const prevHp = this.hp;
    this.hp = Math.max(0, this.hp - amount);
    gameAudio.playHit();
    game.screenShake = 12;

    if (uiManager && this.hp !== prevHp) {
      uiManager.updateHUD();
    }
    
    if (this.hp <= 0) {
      game.handlePlayerDeath();
    }
  }

  update(keys, mouse, camera) {
    // 키보드 조작 이동 계산
    let dx = 0;
    let dy = 0;
    const isDown = (...keyNames) => keyNames.some((keyName) => keys[keyName]);
    if (isDown('w', 'W', 'KeyW', 'ㅈ', 'ArrowUp')) dy -= 1;
    if (isDown('s', 'S', 'KeyS', 'ㄴ', 'ArrowDown')) dy += 1;
    if (isDown('a', 'A', 'KeyA', 'ㅁ', 'ArrowLeft')) dx -= 1;
    if (isDown('d', 'D', 'KeyD', 'ㅇ', 'ArrowRight')) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    this.vx = dx * this.speed;
    this.vy = dy * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    // 움직이는 동안 걷기 애니메이션 프레임 누적
    if (this.vx !== 0 || this.vy !== 0) {
      this.walkTimer += 0.2;
    } else {
      this.walkTimer = 0; // 정지 시 초기화
    }

    // 맵 테두리 충돌방지 (현재 active 맵 크기 기준)
    this.x = Math.max(this.radius + 10, Math.min(game.mapWidth - this.radius - 10, this.x));
    this.y = Math.max(this.radius + 10, Math.min(game.mapHeight - this.radius - 10, this.y));

    // 카메라 오프셋을 역연산하여 화면 마우스 방향을 3D 월드 상 좌표와 매칭
    const worldMouseX = mouse.x + camera.x;
    const worldMouseY = mouse.y + camera.y;
    this.angle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);

    // 마우스 누르고 있으면 발사 (던전인 경우)
    if (mouse.clicked && game.state === STATE_DUNGEON) {
      const now = Date.now();
      if (now - this.lastShotTime >= this.activeWeapon.fireRate) {
        this.shoot();
        this.lastShotTime = now;
      }
    }
  }

  shoot() {
    gameAudio.playShoot(this.activeWeapon.rarity);

    // 총구 끝 스폰 연출
    const spawnX = this.x + Math.cos(this.angle) * 22;
    const spawnY = this.y + Math.sin(this.angle) * 22;

    let spreadAngle = this.angle;
    if (this.activeWeapon.name.includes("정온유")) {
      spreadAngle += (Math.random() - 0.5) * 0.18; // 난사 뿜어내기 분산 오차
    }

    const vx = Math.cos(spreadAngle) * this.activeWeapon.speed;
    const vy = Math.sin(spreadAngle) * this.activeWeapon.speed;

    game.projectiles.push(new Projectile(
      spawnX, spawnY,
      vx, vy,
      this.activeWeapon.size,
      this.activeWeapon.damage,
      this.activeWeapon.color,
      true,
      this.activeWeapon.piercing,
      this.activeWeapon.splash
    ));
    
    // 격발 시 소소한 반동 밀림
    this.x -= Math.cos(this.angle) * 1.2;
    this.y -= Math.sin(this.angle) * 1.2;
  }

  // [NEW] 3인칭 블록형 로블록스 아바타 렌더러
  draw(ctx) {
    const isMoving2D = (this.vx !== 0 || this.vy !== 0);
    const walkBob2D = isMoving2D ? Math.sin(this.walkTimer * 1.2) : 0;
    const heightBob2D = isMoving2D ? Math.abs(Math.cos(this.walkTimer * 1.2)) * 1.8 : 0;
    const avatarY2D = this.y - heightBob2D;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.28)';
    ctx.beginPath();
    ctx.ellipse(this.x + 3, this.y + 18, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(219, 234, 254, 0.9)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 16, 30, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.strokeText('플레이어', this.x, avatarY2D - 36);
    ctx.fillText('플레이어', this.x, avatarY2D - 36);
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, avatarY2D);
    ctx.rotate(this.angle);

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.6;
    fillRoundRect(ctx, -17, -11 + walkBob2D * 2.4, 18, 8, 4);
    strokeRoundRect(ctx, -17, -11 + walkBob2D * 2.4, 18, 8, 4);
    fillRoundRect(ctx, -17, 3 - walkBob2D * 2.4, 18, 8, 4);
    strokeRoundRect(ctx, -17, 3 - walkBob2D * 2.4, 18, 8, 4);

    ctx.fillStyle = '#1e40af';
    ctx.strokeStyle = '#0f172a';
    fillRoundRect(ctx, -11, -15, 25, 30, 8);
    strokeRoundRect(ctx, -11, -15, 25, 30, 8);

    ctx.fillStyle = '#60a5fa';
    fillRoundRect(ctx, -7, -12, 16, 24, 6);
    ctx.fillStyle = '#93c5fd';
    fillRoundRect(ctx, -4, -9, 6, 18, 3);

    ctx.fillStyle = '#fed7aa';
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(17, 0, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(14, -4, 10, 7, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(21, -4, 1.5, 0, Math.PI * 2);
    ctx.arc(21, 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fed7aa';
    ctx.strokeStyle = '#7c2d12';
    fillRoundRect(ctx, 4, -18, 16, 6, 3);
    strokeRoundRect(ctx, 4, -18, 16, 6, 3);
    fillRoundRect(ctx, 4, 12, 16, 6, 3);
    strokeRoundRect(ctx, 4, 12, 16, 6, 3);

    ctx.fillStyle = this.activeWeapon.color;
    ctx.shadowBlur = this.activeWeapon.rarity === "?꾩꽕" ? 14 : 5;
    ctx.shadowColor = this.activeWeapon.color;
    fillRoundRect(ctx, 18, -5, 34, 10, 4);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    strokeRoundRect(ctx, 18, -5, 34, 10, 4);

    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.ellipse(27, -9, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.ellipse(46, 0, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;

    const isMoving = (this.vx !== 0 || this.vy !== 0);
    const walkBob = isMoving ? Math.sin(this.walkTimer * 0.9) : 0;
    const heightBob = isMoving ? Math.abs(Math.cos(this.walkTimer * 0.9)) * 2.5 : 0;

    const groundY = this.y + 16;
    const avatarY = this.y - heightBob;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(this.x + 6, groundY + 4, 28, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(this.x, groundY, 31, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('플레이어', this.x, avatarY - 58);
    ctx.fillText('플레이어', this.x, avatarY - 58);
    ctx.restore();

    const pants = { top: '#334155', front: '#111827', side: '#0f172a', stroke: '#020617' };
    const shirt = { top: '#60a5fa', front: '#2563eb', side: '#1d4ed8', stroke: '#0f172a' };
    const skin = { top: '#fed7aa', front: '#fdba74', side: '#fb923c', stroke: '#7c2d12' };
    const hair = { top: '#92400e', front: '#7c2d12', side: '#451a03', stroke: '#1c0a00' };

    drawBox3D(ctx, this.x - 9 + walkBob * 3, avatarY + 18, 9, 6, 18, pants);
    drawBox3D(ctx, this.x + 6 - walkBob * 3, avatarY + 18, 9, 6, 18, pants);
    drawBox3D(ctx, this.x, avatarY + 2, 24, 11, 32, shirt);
    drawBox3D(ctx, this.x - 18, avatarY - 1, 8, 6, 24, shirt);
    drawBox3D(ctx, this.x + 19, avatarY - 1, 8, 6, 24, shirt);
    drawBox3D(ctx, this.x, avatarY - 30, 20, 10, 18, skin);
    drawBox3D(ctx, this.x - 1, avatarY - 42, 22, 11, 10, hair);

    ctx.save();
    ctx.translate(this.x + 15, avatarY - 14);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.activeWeapon.color;
    ctx.shadowBlur = this.activeWeapon.rarity === "전설" ? 14 : 4;
    ctx.shadowColor = this.activeWeapon.color;
    ctx.fillRect(0, -5, 30, 9);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(6, -8, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, -5, 30, 9);
    ctx.restore();
    return;

    // 1. 발밑 사각 그림자
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 14, this.radius * 1.2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 캐릭터가 배경에 묻히지 않도록 표시 링과 이름표를 먼저 그립니다.
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 16, 27, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('플레이어', this.x, this.y - 34);
    ctx.fillText('플레이어', this.x, this.y - 34);
    ctx.restore();

    ctx.save();
    // 캐릭터 좌표계 및 조준 각도 회전
    ctx.translate(this.x, this.y - heightBob);
    ctx.rotate(this.angle);

    // 2. 사각형 블록 다리 (로블록스 기본 다리)
    ctx.fillStyle = '#111827'; // 아주 어두운 검정 바지
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    
    // 왼쪽 다리 (걷는 모션에 따라 앞뒤로 비대칭 배치)
    ctx.fillRect(-10 + (walkBob * 4), -11, 10, 5);
    ctx.strokeRect(-10 + (walkBob * 4), -11, 10, 5);
    
    // 오른쪽 다리
    ctx.fillRect(-10 - (walkBob * 4), 6, 10, 5);
    ctx.strokeRect(-10 - (walkBob * 4), 6, 10, 5);

    // 3. 파란색 사각 셔츠 상체 (Roblox Torso)
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-6, -14, 13, 28);
    ctx.strokeRect(-6, -14, 13, 28);

    // 4. 갈색 가방 (도움말 연계 배낭)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-11, -6, 5, 12);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-11, -3, 2, 6); // 가죽 지퍼 장식

    // 5. 블록형 양 팔
    ctx.fillStyle = '#1d4ed8';
    // 왼팔
    ctx.fillRect(-1, -19, 7, 5);
    ctx.strokeRect(-1, -19, 7, 5);
    // 오른팔
    ctx.fillRect(-1, 14, 7, 5);
    ctx.strokeRect(-1, 14, 7, 5);

    // 6. 사각형 머리 (블록 페이스)
    ctx.fillStyle = '#fed7aa'; // 피부 톤
    ctx.fillRect(-2, -6, 8, 12);
    ctx.strokeRect(-2, -6, 8, 12);

    // 7. 로블록스식 갈색 베이컨/블록 헤어
    ctx.fillStyle = '#7c2d12'; // 밤갈색 머리칼
    ctx.fillRect(-5, -8, 8, 16); // 윗머리
    ctx.fillRect(-8, -5, 3, 10); // 뒷머리
    ctx.fillRect(1, -9, 2, 3);   // 삐침머리 앞머리
    ctx.fillRect(1, 6, 2, 3);

    // 8. 무기 및 블록 손
    ctx.save();
    ctx.translate(6, 4); // 오른손 그립

    // 물총 바디
    ctx.fillStyle = this.activeWeapon.color;
    ctx.shadowBlur = this.activeWeapon.rarity === "전설" ? 12 : 2;
    ctx.shadowColor = this.activeWeapon.color;
    ctx.fillRect(0, -3, 18, 5.5);
    
    // 물통 장치
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-2, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 살구색 사각 오른손
    ctx.fillStyle = '#fed7aa';
    ctx.shadowBlur = 0;
    ctx.fillRect(0, -2, 3, 4);

    ctx.restore();
    ctx.restore();
  }
}

// 투사체 (물줄기 / 방울)
class Projectile {
  constructor(x, y, vx, vy, radius, damage, color, isPlayerOwned = true, piercing = false, splash = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.damage = damage;
    this.color = color;
    this.isPlayerOwned = isPlayerOwned;
    this.piercing = piercing;
    this.splash = splash;
    this.life = 1.0;
    this.decay = 0.016;
    this.hitTargets = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.radius * 1.5;
    ctx.shadowColor = this.color;
    ctx.fill();
    
    // 물광 반사 하이라이트
    ctx.beginPath();
    ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/3, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    ctx.restore();
  }
}

// 몬스터 (슬라임)
class Monster {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hitCooldown = 0;
    
    if (type === 'basic') {
      this.radius = 18;
      this.maxHp = 30;
      this.hp = 30;
      this.speed = 1.3;
      this.color = '#10b981';
      this.damage = 8;
      this.rewardCoins = 2;
    } else if (type === 'strong') {
      this.radius = 22;
      this.maxHp = 80;
      this.hp = 80;
      this.speed = 1.8;
      this.color = '#f43f5e';
      this.damage = 16;
      this.rewardCoins = 5;
    } else if (type === 'boss') {
      this.radius = 48;
      this.maxHp = 700;
      this.hp = 700;
      this.speed = 0.95;
      this.color = '#a855f7';
      this.damage = 25;
      this.rewardCoins = 50;
      this.bossAttackTimer = 0;
    }

    this.animTime = Math.random() * 100;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    
    // 피격 물 튀김
    for (let i = 0; i < 6; i++) {
      game.particles.push(new Particle(
        this.x, this.y,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        Math.random() * 4 + 2,
        this.color,
        0.8,
        0.03
      ));
    }

    game.damageNumbers.push(new DamageNumber(
      this.x + (Math.random() - 0.5) * 15,
      this.y - this.radius,
      amount,
      '#ffffff'
    ));

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    gameAudio.playExplosion();
    for (let i = 0; i < 20; i++) {
      game.particles.push(new Particle(
        this.x, this.y,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 3,
        this.color,
        1.0,
        0.02
      ));
    }

    // 사망 보상 코인만 생성 즉시 플레이어에게 흡수되도록 처리
    for (let i = 0; i < this.rewardCoins; i++) {
      const dx = game.player.x - this.x;
      const dy = game.player.y - this.y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const scatter = (Math.random() - 0.5) * 1.2;
      game.particles.push(new Particle(
        this.x, this.y,
        (dx / dist) * (2.2 + Math.random() * 1.6) + scatter,
        (dy / dist) * (2.2 + Math.random() * 1.6) - scatter,
        4.5,
        '#fbbf24',
        1.0,
        0,
        true
      ));
    }
  }

  update(player) {
    if (this.hitCooldown > 0) this.hitCooldown--;
    this.animTime += 0.12;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 플레이어 추적
    if (dist > 5) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }

    // 보스 패턴
    if (this.type === 'boss') {
      this.bossAttackTimer++;
      if (this.bossAttackTimer >= 150) { // 2.5초마다 사방 난사
        this.shootSludgeRing();
        this.bossAttackTimer = 0;
      }
    }

    // 몸체 충돌 시 공격
    if (dist < this.radius + player.radius && this.hitCooldown <= 0) {
      player.takeDamage(this.damage);
      if (game.state !== STATE_DUNGEON) return;

      this.hitCooldown = 45;
      const pushForce = 16;
      const safeDist = Math.max(dist, 0.001);
      player.x += (dx / safeDist) * pushForce;
      player.y += (dy / safeDist) * pushForce;
    }
  }

  shootSludgeRing() {
    const count = 10;
    const speed = 4.2;
    const pColor = '#dc2626';
    gameAudio.playHit();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      game.projectiles.push(new Projectile(
        this.x, this.y,
        vx, vy,
        8.5,
        12,
        pColor,
        false,
        false,
        0
      ));
    }
  }

  draw(ctx) {
    ctx.save();
    const bounceOffset = Math.abs(Math.sin(this.animTime)) * 6;
    const squishX = 1 + Math.sin(this.animTime) * 0.08;
    const squishY = 1 - Math.sin(this.animTime) * 0.08;

    const bodyY = this.y - bounceOffset;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    ctx.beginPath();
    ctx.ellipse(this.x + this.radius * 0.18, this.y + this.radius * 0.72, this.radius * 1.1, this.radius * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.radius * 0.75;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, bodyY, this.radius * squishX, this.radius * 0.82 * squishY, 0, Math.PI, 0, true);
    ctx.lineTo(this.x + this.radius * squishX, bodyY + this.radius * 0.36);
    ctx.quadraticCurveTo(this.x, bodyY + this.radius * 0.9, this.x - this.radius * squishX, bodyY + this.radius * 0.36);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.36)';
    ctx.beginPath();
    ctx.ellipse(this.x - this.radius * 0.28, bodyY - this.radius * 0.28, this.radius * 0.26, this.radius * 0.12, -0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(this.x - this.radius * 0.26, bodyY - this.radius * 0.05, this.radius * 0.18, this.radius * 0.2, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + this.radius * 0.26, bodyY - this.radius * 0.05, this.radius * 0.18, this.radius * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.26, bodyY - this.radius * 0.03, this.radius * 0.08, 0, Math.PI * 2);
    ctx.arc(this.x + this.radius * 0.26, bodyY - this.radius * 0.03, this.radius * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const mouthRadius = this.type === 'boss' ? this.radius * 0.28 : this.radius * 0.14;
    ctx.arc(this.x, bodyY + this.radius * 0.18, mouthRadius, 0, Math.PI, false);
    ctx.stroke();
    ctx.restore();
    this.drawHealthBar(ctx);
    return;

    // 그림자
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.radius - 2, this.radius * squishX, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(this.x, this.y - bounceOffset);
    ctx.scale(squishX, squishY);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.radius * 0.6;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.stroke();

    // 눈동자
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.25, -this.radius * 0.1, this.radius * 0.18, 0, Math.PI * 2);
    ctx.arc(this.radius * 0.25, -this.radius * 0.1, this.radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.25, -this.radius * 0.1, this.radius * 0.08, 0, Math.PI * 2);
    ctx.arc(this.radius * 0.25, -this.radius * 0.1, this.radius * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // 입 모양
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.type === 'boss') {
      ctx.arc(0, this.radius * 0.18, this.radius * 0.26, 0, Math.PI, false);
    } else {
      ctx.arc(0, this.radius * 0.15, this.radius * 0.12, 0, Math.PI, false);
    }
    ctx.stroke();

    ctx.restore();
    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    const barWidth = Math.max(42, this.radius * 2.35);
    const barHeight = this.type === 'boss' ? 9 : 6;
    const x = this.x - barWidth / 2;
    const y = this.y - this.radius - 24;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : (hpPercent > 0.25 ? '#fbbf24' : '#ef4444');
    ctx.fillRect(x, y, barWidth * hpPercent, barHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.restore();
  }
}

// 이펙트 파티클
class Particle {
  constructor(x, y, vx, vy, size, color, alpha = 1.0, decay = 0.02, isCoin = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.alpha = alpha;
    this.isCoin = isCoin;
    this.decay = isCoin ? 0 : decay;
  }

  update(player) {
    if (this.isCoin) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
      const pull = dist > 120 ? 0.92 : 1.22;

      this.vx = this.vx * 0.86 + (dx / dist) * pull;
      this.vy = this.vy * 0.86 + (dy / dist) * pull;
      
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const maxSpeed = dist > 180 ? 13 : 10;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }

      if (dist < player.radius + 8) {
        player.coins += 1;
        uiManager.updateCoinsDisplay();
        gameAudio.playCoin();
        this.alpha = 0;
        game.damageNumbers.push(new DamageNumber(player.x, player.y - player.radius, "+1", "#fbbf24"));
        return;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    if (!this.isCoin) {
      this.alpha -= this.decay;
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.isCoin) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size * 1.15, this.size * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(this.x - this.size * 0.25, this.y - this.size * 0.18, this.size * 0.35, this.size * 0.2, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// 뎀감 수치 팝업
class DamageNumber {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1.0;
    this.vy = -1.3;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.022;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 15px Outfit, Noto Sans KR';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// 상호작용 오브젝트 (NPC)
class Interactable {
  constructor(x, y, radius, type, label, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = type;
    this.label = label;
    this.color = color;
    this.angle = 0;
  }

  draw(ctx) {
    this.angle += 0.015;

    ctx.save();
    // 바닥 테두리 링
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.08 + Math.abs(Math.sin(this.angle * 1.5)) * 0.05;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    if (this.type === 'shop_npc') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(this.x - 22, this.y - 12, 44, 24);
      
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 6, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 15, 8, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.type === 'teleport_pad') {
      drawPortal2D(ctx, this.x, this.y, this.radius * 0.9, '#38bdf8', '#bfdbfe', '');
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Outfit, Noto Sans KR';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(this.label, this.x, this.y - 50);
    ctx.restore();
  }
}

// ============================================================================
// 3. 게임 메인 오케스트레이터 ( seamless scrolling dungeon 통합 )
// ============================================================================

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvasToViewport();
    
    this.state = STATE_LOBBY;
    this.dungeonZone = 0; // 0: 로비, 1, 2, 3: 던전 내부 구역
    this.screenShake = 0;
    this.isPlayerDead = false;

    // 월드 맵 사이즈 변수
    this.mapWidth = 1600;
    this.mapHeight = 1200;

    // 부드러운 3인칭 팔로우 카메라 추가
    this.camera = new Camera(this.canvas.width, this.canvas.height);

    this.player = new Player(800, 900); // 맵 중앙 부분에 위치
    this.monsters = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];
    this.interactables = [];
    
    this.keys = {};
    this.mouse = { x: 0, y: 0, clicked: false };

    // 던전 관문 활성화 관리
    this.dungeonGateOpen = false;

    // 자연 환경 장식 (Lobby의 나무/꽃 리스트)
    this.decoFlowers = [];
    this.decoTrees = [];
    this.initEnvironmentDeco();

    this.setupEventListeners();
    this.initLobby();
  }

  resizeCanvasToViewport() {
    const viewport = window.visualViewport || window;
    const fallbackWidth = document.documentElement ? document.documentElement.clientWidth : this.canvas.width;
    const fallbackHeight = document.documentElement ? document.documentElement.clientHeight : this.canvas.height;
    const width = Math.max(320, Math.floor(viewport.width || window.innerWidth || fallbackWidth || this.canvas.width));
    const height = Math.max(240, Math.floor(viewport.height || window.innerHeight || fallbackHeight || this.canvas.height));

    if (this.canvas.width === width && this.canvas.height === height) return;

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.camera) {
      this.camera.width = width;
      this.camera.height = height;
      this.camera.setMapSize(this.mapWidth, this.mapHeight);
      if (this.player) {
        this.camera.snapTo(this.player);
      } else {
        this.camera.clampToMap();
      }
    }

    if (this.mouse) {
      this.mouse.x = width / 2;
      this.mouse.y = height / 2;
    }
  }

  // 로비 정원 장식물 위치 빌드
  initEnvironmentDeco() {
    this.decoFlowers = [];
    this.decoTrees = [];
    for (let i = 0; i < 40; i++) {
      this.decoFlowers.push({
        x: Math.random() * 1600,
        y: Math.random() * 1200,
        color: ['#f43f5e', '#fbbf24', '#38bdf8', '#fb7185'][i % 4],
        size: Math.random() * 3 + 2
      });
    }
    // 외곽이나 곳곳에 풍성한 나무 배치
    const treePositions = [
      {x: 100, y: 150}, {x: 150, y: 350}, {x: 200, y: 800}, {x: 400, y: 1000},
      {x: 1200, y: 1100}, {x: 1450, y: 800}, {x: 1500, y: 300}, {x: 1300, y: 150},
      {x: 800, y: 100}, {x: 1100, y: 90}, {x: 130, y: 1050}
    ];
    this.decoTrees = treePositions;
  }

  setupEventListeners() {
    const movementKeys = new Set([
      'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'ㅈ', 'ㅁ', 'ㄴ', 'ㅇ',
      'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
    ]);
    const setKeyState = (e, isPressed) => {
      if (e.key) {
        this.keys[e.key] = isPressed;
        if (e.key.length === 1) {
          this.keys[e.key.toLowerCase()] = isPressed;
        }
      }
      if (e.code) {
        this.keys[e.code] = isPressed;
      }
    };
    const isMovementKey = (e) => movementKeys.has(e.key) || movementKeys.has(e.code);

    window.addEventListener('keydown', (e) => {
      setKeyState(e, true);
      if (isMovementKey(e)) {
        e.preventDefault();
      }
      if (!e.repeat && (e.key === 'e' || e.key === 'E' || e.key === 'ㄷ' || e.code === 'KeyE')) {
        this.triggerInteraction();
      }
      if (!e.repeat && uiManager && (e.key === 'm' || e.key === 'M' || e.key === 'ㅡ' || e.code === 'KeyM')) {
        uiManager.toggleMute();
      }
    });

    window.addEventListener('keyup', (e) => {
      setKeyState(e, false);
      if (isMovementKey(e)) {
        e.preventDefault();
      }
    });

    window.addEventListener('resize', () => {
      this.resizeCanvasToViewport();
    });

    window.addEventListener('orientationchange', () => {
      this.resizeCanvasToViewport();
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        this.resizeCanvasToViewport();
      });
    }

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.clicked = true;
        gameAudio.resume();
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.clicked = false;
    });
  }

  initLobby(toastMessage = '📍 3인칭 자유 시점 모드로 로비에 입장했습니다. WASD로 탐색하세요!') {
    this.state = STATE_LOBBY;
    this.dungeonZone = 0;
    this.dungeonGateOpen = false;
    this.isPlayerDead = false;
    
    // 맵 크기 지정
    this.mapWidth = 1600;
    this.mapHeight = 1200;
    this.camera.setMapSize(this.mapWidth, this.mapHeight);

    // 플레이어 젠
    this.player.reset(800, 600);
    this.camera.snapTo(this.player);
    this.mouse.x = this.canvas.width / 2;
    this.mouse.y = this.canvas.height / 2;
    
    this.monsters = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];

    // 상호작용 지점
    this.interactables = [
      new Interactable(1100, 500, 35, 'shop_npc', '물총 상점 NPC [E]', '#fb923c'),
      new Interactable(800, 250, 45, 'teleport_pad', '던전 포탈 진입', '#3b82f6')
    ];

    gameAudio.startBgm('town');
    if (uiManager) {
      uiManager.updateHUD();
      uiManager.showToast(toastMessage);
    }
  }

  // seamless scrolling dungeon 진입
  enterDungeon(zone) {
    this.state = STATE_DUNGEON;
    this.dungeonZone = zone;
    this.dungeonGateOpen = false;
    this.isPlayerDead = false;
    
    // 횡형 스크롤 던전 크기 (가로 3600px * 세로 800px)
    this.mapWidth = 3600;
    this.mapHeight = 800;
    this.camera.setMapSize(this.mapWidth, this.mapHeight);

    this.projectiles = [];
    this.monsters = [];
    this.damageNumbers = [];

    // 진입 구역별 시작점 지정 (zone 1은 맨 좌측)
    if (zone === 1) {
      this.player.reset(120, 400);
      this.camera.snapTo(this.player);
      this.spawnChamberEnemies(1);
    }

    gameAudio.startBgm('dungeon');
    gameAudio.playTeleport();

    uiManager.updateHUD();
    uiManager.showToast(`⚔️ 스크롤형 던전 1구역에 도달했습니다. 왼쪽 귀환 포탈에서 E를 누르면 로비로 나갈 수 있습니다!`);
  }

  // 던전의 각 구획별 몬스터 단독 스폰 트리거
  spawnChamberEnemies(chamberIndex) {
    if (chamberIndex === 1) {
      // 1구역 (x: 400 ~ 1100) 녹색 슬라임 5마리
      for (let i = 0; i < 5; i++) {
        const x = 500 + i * 130 + Math.random() * 50;
        const y = 200 + Math.random() * 400;
        this.monsters.push(new Monster(x, y, 'basic'));
      }
    } else if (chamberIndex === 2) {
      // 2구역 (x: 1600 ~ 2300) 빨간 슬라임 5마리
      for (let i = 0; i < 5; i++) {
        const x = 1600 + i * 140 + Math.random() * 40;
        const y = 200 + Math.random() * 400;
        this.monsters.push(new Monster(x, y, 'strong'));
      }
    } else if (chamberIndex === 3) {
      // 3구역 (x: 3000) 보스 슬라임 1마리 스폰
      this.monsters.push(new Monster(3050, 400, 'boss'));
    }
  }

  triggerInteraction() {
    if (this.state === STATE_DUNGEON) {
      if (this.isNearDungeonExit()) {
        this.returnToLobby('🌀 던전 밖으로 나와 로비로 돌아왔습니다.');
      }
      return;
    }

    if (this.state !== STATE_LOBBY) return;

    let closest = null;
    let minDist = 9999;

    this.interactables.forEach((item) => {
      const dx = this.player.x - item.x;
      const dy = this.player.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < item.radius + this.player.radius + 20) {
        if (dist < minDist) {
          minDist = dist;
          closest = item;
        }
      }
    });

    if (closest) {
      if (closest.type === 'shop_npc') {
        uiManager.openShop();
      } else if (closest.type === 'teleport_pad') {
        this.enterDungeon(1);
      }
    }
  }

  isNearDungeonExit() {
    if (this.state !== STATE_DUNGEON) return false;
    const dx = this.player.x - DUNGEON_EXIT_PORTAL.x;
    const dy = this.player.y - DUNGEON_EXIT_PORTAL.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < DUNGEON_EXIT_PORTAL.radius + this.player.radius + 24;
  }

  returnToLobby(message) {
    gameAudio.playTeleport();
    this.initLobby(message);
  }

  checkLobbyZoneTriggers() {
    if (this.state !== STATE_LOBBY) return;

    const portal = this.interactables.find(item => item.type === 'teleport_pad');
    if (portal) {
      const dx = this.player.x - portal.x;
      const dy = this.player.y - portal.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 포탈 범위 내 정밀 닿음 여부
      if (dist < portal.radius + this.player.radius - 12) {
        this.enterDungeon(1);
      }
    }
  }

  // 던전 스크롤 게이트 통과 검출 (Gate 1: x = 1200 / Gate 2: x = 2400)
  checkDungeonScrollingProgress() {
    if (this.state !== STATE_DUNGEON) return;

    // 1구역 활성 상태에서 1200을 넘어설 때
    if (this.dungeonZone === 1) {
      if (!this.dungeonGateOpen && this.player.x > 1180) {
        this.player.x = 1180; // 게이트 벽 막힘
      } else if (this.dungeonGateOpen && this.player.x > 1250) {
        // 다음 구역 진입
        this.dungeonZone = 2;
        this.dungeonGateOpen = false;
        this.spawnChamberEnemies(2);
        uiManager.updateHUD();
        uiManager.showToast('⚔️ 던전 2구역(붉은 슬라임 둥지)에 도달했습니다!');
      }
    }
    
    // 2구역 활성 상태에서 2400을 넘어설 때
    else if (this.dungeonZone === 2) {
      if (!this.dungeonGateOpen && this.player.x > 2380) {
        this.player.x = 2380; // 막힘
      } else if (this.dungeonGateOpen && this.player.x > 2450) {
        this.dungeonZone = 3;
        this.dungeonGateOpen = false;
        this.spawnChamberEnemies(3);
        uiManager.updateHUD();
        uiManager.showToast('😈 보스 방에 입장했습니다! 심연의 보스를 물리치세요!');
      }
    }
  }

  handlePlayerDeath() {
    if (this.isPlayerDead) return;
    this.isPlayerDead = true;

    gameAudio.playDefeat();
    this.keys = {};
    this.mouse.clicked = false;
    this.projectiles = [];
    this.monsters = [];
    this.particles = [];
    this.initLobby('☠️ 체력을 전부 잃었습니다. 로비 안전 마을로 귀환합니다.');
  }

  update() {
    // 1. 물리/조작 및 카메라 팔로우
    this.player.update(this.keys, this.mouse, this.camera);
    this.camera.update(this.player);

    // 2. 트리거 체킹
    this.checkLobbyZoneTriggers();
    this.checkDungeonScrollingProgress();
    this.updateInteractionHint();

    // 2-2. AFK Rewards 영역에 있으면 3초마다 1코인 획득 (로블록스 화면 고스란히 이스터에그 구현)
    if (this.state === STATE_LOBBY) {
      const afkDist = Math.sqrt((this.player.x - 1300) * (this.player.x - 1300) + (this.player.y - 650) * (this.player.y - 650));
      if (afkDist < 60) {
        this.afkTimer = (this.afkTimer || 0) + 1;
        if (this.afkTimer >= 180) { // 60fps * 3 = 3초
          this.player.coins += 1;
          uiManager.updateCoinsDisplay();
          gameAudio.playCoin();
          this.damageNumbers.push(new DamageNumber(this.player.x, this.player.y - this.player.radius, "+1 (AFK Rewards)", "#fbbf24"));
          this.afkTimer = 0;
        }
      } else {
        this.afkTimer = 0;
      }
    }

    // 3. 투사체 업데이트
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update();

      if (p.life <= 0 || p.x < 0 || p.x > this.mapWidth || p.y < 0 || p.y > this.mapHeight) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.isPlayerOwned) {
        for (let mIndex = 0; mIndex < this.monsters.length; mIndex++) {
          const m = this.monsters[mIndex];
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < p.radius + m.radius) {
            if (p.piercing && p.hitTargets.includes(m)) continue;

            m.takeDamage(p.damage);

            if (p.splash > 0) {
              this.triggerSplashDamage(p.x, p.y, p.splash, p.damage * 0.7, m);
            }

            if (p.piercing) {
              p.hitTargets.push(m);
            } else {
              this.projectiles.splice(i, 1);
              break;
            }
          }
        }
      } else {
        const dx = p.x - this.player.x;
        const dy = p.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < p.radius + this.player.radius) {
          this.player.takeDamage(p.damage);
          if (this.state !== STATE_DUNGEON) return;

          this.projectiles.splice(i, 1);
        }
      }
    }

    // 4. 몬스터 관리
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      m.update(this.player);
      if (this.state !== STATE_DUNGEON) return;

      if (m.hp <= 0) {
        this.monsters.splice(i, 1);
      }
    }

    // 5. 구역 관문 오픈 체크
    if (this.state === STATE_DUNGEON && this.monsters.length === 0 && !this.dungeonGateOpen) {
      this.dungeonGateOpen = true;
      if (this.dungeonZone < 3) {
        gameAudio.playVictory();
        uiManager.showToast(`🔓 관문 해제! 오른쪽으로 전진하여 다음 구역으로 넘어가세요!`);
      } else {
        gameAudio.playVictory();
        uiManager.showToast('🏆 보스를 완파하여 던전을 전 정복했습니다! 5초 후 로비로 귀환합니다.');
        setTimeout(() => {
          this.initLobby();
        }, 5000);
      }
    }

    // 6. 파티클
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.update(this.player);
      if (part.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 7. 플로팅 텍스트
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.update();
      if (dn.alpha <= 0) {
        this.damageNumbers.splice(i, 1);
      }
    }

    // 8. 화면 흔들림 감쇠
    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }
  }

  triggerSplashDamage(x, y, radius, damage, primaryTarget) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 2;
      game.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * 5 + 3,
        '#60a5fa',
        0.8,
        0.024
      ));
    }

    this.monsters.forEach(m => {
      if (m === primaryTarget) return;
      const dx = m.x - x;
      const dy = m.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        m.takeDamage(Math.round(damage));
      }
    });
  }

  updateInteractionHint() {
    const hintEl = document.getElementById('interaction-hint');

    if (this.state === STATE_DUNGEON) {
      if (this.isNearDungeonExit()) {
        hintEl.innerText = "로비로 귀환 [E]";
        hintEl.classList.add('show');
      } else {
        hintEl.classList.remove('show');
      }
      return;
    }

    if (this.state !== STATE_LOBBY) {
      hintEl.classList.remove('show');
      return;
    }

    let showHint = false;
    let message = "";

    this.interactables.forEach((item) => {
      const dx = this.player.x - item.x;
      const dy = this.player.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < item.radius + this.player.radius + 18) {
        showHint = true;
        if (item.type === 'shop_npc') {
          message = "물총 상인과 거래 [E]";
        } else if (item.type === 'teleport_pad') {
          message = "던전 포탈 진입 [E]";
        }
      }
    });

    if (showHint) {
      hintEl.innerText = message;
      hintEl.classList.add('show');
    } else {
      hintEl.classList.remove('show');
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 쉐이크 오프셋 연동
    this.ctx.save();
    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake;
      const dy = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(dx, dy);
    }

    // 3인칭 2D 카메라 좌표계 적용
    this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. 백그라운드 Studded 지형 & 외곽 산/펜스
    this.drawTerrain();

    // 2. 로비 장식물 및 이미지 속 랜드마크 드로잉
    if (this.state === STATE_LOBBY) {
      this.drawLobbyEnvironment();
      this.drawLobbyLandmarks();
    }

    // 3. 상호작용 NPC 데코
    if (this.state === STATE_LOBBY) {
      this.interactables.forEach(item => item.draw(this.ctx));
    }

    // 4. 던전 구역 구분용 장벽 게이트 그리기 (1200px, 2400px 세로 차단막)
    if (this.state === STATE_DUNGEON) {
      this.drawDungeonExitPortal();
      this.drawDungeonGates();
    }

    // 5. 엔티티 및 이펙트 그리기 (y값 기준 정렬로 3D 깊이감 표현)
    const depthSorted = [
      this.player,
      ...this.monsters,
      ...this.projectiles,
      ...this.particles
    ].sort((a, b) => (a.y || 0) - (b.y || 0));
    depthSorted.forEach(item => item.draw(this.ctx));
    this.damageNumbers.forEach(dn => dn.draw(this.ctx));

    this.ctx.restore();
  }

  drawTerrain() {
    const tileSize = 64;
    const startX = Math.max(0, Math.floor(this.camera.x / tileSize) * tileSize);
    const startY = Math.max(0, Math.floor(this.camera.y / tileSize) * tileSize);
    const endX = Math.min(this.mapWidth, startX + this.canvas.width + tileSize * 2);
    const endY = Math.min(this.mapHeight, startY + this.canvas.height + tileSize * 2);

    if (this.state === STATE_LOBBY) {
      const ctx = this.ctx;
      ctx.fillStyle = '#2f8f47';
      ctx.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);

      for (let x = startX; x < endX; x += tileSize) {
        for (let y = startY; y < endY; y += tileSize) {
          const alt = ((x / tileSize + y / tileSize) % 2 === 0);
          ctx.fillStyle = alt ? 'rgba(76, 175, 80, 0.13)' : 'rgba(21, 128, 61, 0.1)';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.fillStyle = 'rgba(220, 252, 231, 0.18)';
          if ((x * 7 + y * 11) % 320 === 0) {
            ctx.beginPath();
            ctx.ellipse(x + 18, y + 22, 12, 4, -0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.ellipse(320, 280, 180, 90, -0.25, 0, Math.PI * 2);
      ctx.ellipse(1260, 860, 210, 105, 0.18, 0, Math.PI * 2);
      ctx.ellipse(260, 920, 190, 120, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(15, 23, 42, 0.18)';
      ctx.fillStyle = '#778292';
      fillRoundRect(ctx, 724, 245, 152, 470, 28);
      fillRoundRect(ctx, 360, 548, 900, 176, 30);
      fillRoundRect(ctx, 1010, 470, 205, 112, 28);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#8b97a8';
      fillRoundRect(ctx, 735, 256, 130, 448, 22);
      fillRoundRect(ctx, 374, 562, 872, 148, 24);
      fillRoundRect(ctx, 1022, 482, 181, 88, 20);

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.26)';
      ctx.lineWidth = 2;
      for (let x = 394; x < 1240; x += 78) {
        ctx.beginPath();
        ctx.moveTo(x, 564);
        ctx.lineTo(x - 22, 708);
        ctx.stroke();
      }
      for (let y = 278; y < 710; y += 72) {
        ctx.beginPath();
        ctx.moveTo(738, y);
        ctx.lineTo(864, y + 12);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(752, 258);
      ctx.lineTo(752, 692);
      ctx.moveTo(386, 574);
      ctx.lineTo(1228, 574);
      ctx.stroke();

      ctx.fillStyle = '#677384';
      ctx.beginPath();
      ctx.ellipse(800, 628, 250, 95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#929daf';
      ctx.beginPath();
      ctx.ellipse(800, 610, 226, 78, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(800, 610, 226, 78, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      for (let r = 0; r < 4; r++) {
        ctx.beginPath();
        ctx.ellipse(800, 610, 58 + r * 42, 20 + r * 14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;

      // 로비: 정돈된 잔디와 중앙 광장
      this.ctx.fillStyle = '#2f8f47';
      this.ctx.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);

      // 은은한 잔디 타일. 동그라미는 각각 따로 그려 선이 이어지지 않게 합니다.
      for (let x = startX; x < endX; x += tileSize) {
        for (let y = startY; y < endY; y += tileSize) {
          this.ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? '#36a852' : '#31994b';
          this.ctx.fillRect(x, y, tileSize, tileSize);
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
          this.ctx.strokeRect(x, y, tileSize, tileSize);

          if ((x + y) % 192 === 0) {
            this.ctx.fillStyle = 'rgba(187, 247, 208, 0.24)';
            this.ctx.beginPath();
            this.ctx.arc(x + 18, y + 18, 3, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }

      // 포탈, 상점, 중앙 광장을 잇는 넓은 석재 길
      this.ctx.fillStyle = '#6b7280';
      this.ctx.fillRect(725, 250, 150, 470);
      this.ctx.fillRect(360, 560, 880, 150);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.fillRect(735, 260, 12, 450);
      this.ctx.fillRect(375, 570, 850, 10);
      this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
      this.ctx.lineWidth = 2;
      for (let x = 380; x < 1240; x += 80) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 560);
        this.ctx.lineTo(x - 18, 710);
        this.ctx.stroke();
      }
      for (let y = 280; y < 720; y += 70) {
        this.ctx.beginPath();
        this.ctx.moveTo(725, y);
        this.ctx.lineTo(875, y + 16);
        this.ctx.stroke();
      }

      // 중앙 광장 바닥을 입체 슬랩으로 표현
      drawBox3D(this.ctx, 800, 720, 560, 120, 24, {
        top: '#8b98a8',
        front: '#566273',
        side: '#414b5a',
        stroke: 'rgba(15, 23, 42, 0.42)'
      });
      
    } else {
      // 던전: 으스스한 황무지 돌길
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, 3600, 800);

      // 용암/독극물 강줄기 (상단 및 하단 경계 흐름)
      this.ctx.fillStyle = '#312e81'; // 짙은 물결천
      this.ctx.fillRect(0, 0, 3600, 60);
      this.ctx.fillRect(0, 740, 3600, 60);

      // 돌 무늬 격자선
      const size = 120;
      for (let x = 0; x < 3600; x += size) {
        for (let y = 60; y < 740; y += size) {
          this.ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#182235' : '#111827';
          this.ctx.fillRect(x, y, size, size);
          this.ctx.strokeStyle = '#263247';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(x, y, size, size);
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          this.ctx.fillRect(x + 4, y + 4, size - 8, 8);
        }
      }
    }
  }

  drawLobbyEnvironment() {
    // 1. 무작위 꽃 묘사
    this.decoFlowers.forEach(f => {
      this.ctx.fillStyle = f.color;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. 동그란 나무 canopy 묘사
    this.decoTrees.forEach(t => {
      // 둥근 나무 그림자
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      this.ctx.beginPath();
      this.ctx.ellipse(t.x, t.y + 35, 30, 10, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // 줄기
      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(t.x - 7, t.y, 14, 40);

      // 나뭇잎구
      this.ctx.fillStyle = '#166534';
      this.ctx.beginPath();
      this.ctx.arc(t.x, t.y - 10, 32, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#15803d'; // 나뭇잎 하이라이트
      this.ctx.beginPath();
      this.ctx.arc(t.x - 10, t.y - 18, 22, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawLobbyLandmarks() {
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
    ctx.beginPath();
    ctx.ellipse(800, 642, 144, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(800, 610, 112, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(800, 594, 92, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(800, 594, 92, 32, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(14, 165, 233, 0.42)';
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(800, 590, 68, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.ellipse(800, 562, 18, 29, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.24)';
    ctx.beginPath();
    ctx.ellipse(1100, 553, 92, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7c2d12';
    fillRoundRect(ctx, 1046, 486, 108, 72, 10);
    ctx.fillStyle = '#b45309';
    fillRoundRect(ctx, 1054, 495, 92, 52, 8);
    ctx.fillStyle = '#451a03';
    fillRoundRect(ctx, 1067, 520, 28, 27, 4);
    ctx.fillStyle = '#fbbf24';
    fillRoundRect(ctx, 1032, 458, 136, 34, 10);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    strokeRoundRect(ctx, 1032, 458, 136, 34, 10);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#fef3c7' : '#f97316';
      fillRoundRect(ctx, 1038 + i * 25, 463, 18, 24, 5);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Outfit, Noto Sans KR, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#451a03';
    ctx.strokeText('SHOP', 1100, 452);
    ctx.fillText('SHOP', 1100, 452);
    ctx.restore();

    drawPortal2D(ctx, 800, 250, 48, '#38bdf8', '#bfdbfe', 'DUNGEON');

    ctx.save();
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(1300, 650, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 13px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText('AFK Rewards', 1300, 655);
    ctx.fillText('AFK Rewards', 1300, 655);
    ctx.restore();
    return;

    // 중앙 분수
    ctx.save();
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(800, 585, 92, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawBox3D(ctx, 800, 610, 120, 34, 32, {
      top: '#cbd5e1',
      front: '#64748b',
      side: '#475569',
      stroke: '#1e293b'
    });
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.ellipse(800, 548, 20, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 상점 부스
    ctx.save();
    drawBox3D(ctx, 1100, 525, 112, 34, 64, {
      top: '#fbbf24',
      front: '#92400e',
      side: '#78350f',
      stroke: '#451a03'
    });
    drawBox3D(ctx, 1100, 463, 138, 18, 22, {
      top: '#fcd34d',
      front: '#f59e0b',
      side: '#d97706',
      stroke: '#78350f'
    });
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHOP', 1100, 452);
    ctx.restore();

    // 던전 포탈
    const pulse = 0.55 + Math.abs(Math.sin(Date.now() * 0.004)) * 0.35;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.ellipse(800, 250, 62, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // AFK 보상 구역
    ctx.save();
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(1300, 650, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 13px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AFK Rewards', 1300, 655);
    ctx.restore();
  }

  drawDungeonExitPortal() {
    const ctx = this.ctx;
    drawPortal2D(ctx, DUNGEON_EXIT_PORTAL.x, DUNGEON_EXIT_PORTAL.y, DUNGEON_EXIT_PORTAL.radius, '#22c55e', '#bbf7d0', 'LOBBY');
    return;

    const pulse = 0.5 + Math.abs(Math.sin(Date.now() * 0.005)) * 0.4;

    ctx.save();
    ctx.globalAlpha = 0.25 + pulse * 0.35;
    ctx.fillStyle = '#22c55e';
    ctx.shadowBlur = 26;
    ctx.shadowColor = '#86efac';
    ctx.beginPath();
    ctx.ellipse(DUNGEON_EXIT_PORTAL.x, DUNGEON_EXIT_PORTAL.y, 56, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#bbf7d0';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(DUNGEON_EXIT_PORTAL.x, DUNGEON_EXIT_PORTAL.y, DUNGEON_EXIT_PORTAL.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Noto Sans KR, Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('로비 귀환', DUNGEON_EXIT_PORTAL.x, DUNGEON_EXIT_PORTAL.y - 48);
    ctx.fillText('로비 귀환', DUNGEON_EXIT_PORTAL.x, DUNGEON_EXIT_PORTAL.y - 48);
    ctx.restore();
  }

  drawDungeonGates() {
    // 1구역 차단벽 (x: 1200)
    if (this.dungeonZone === 1) {
      this.drawLaserWall(1200, !this.dungeonGateOpen);
    }
    // 2구역 차단벽 (x: 2400)
    if (this.dungeonZone === 2) {
      this.drawLaserWall(2400, !this.dungeonGateOpen);
    }
  }

  drawLaserWall(x, isLocked) {
    this.ctx.save();
    if (isLocked) {
      // 충전 중이거나 닫힌 레이저 게이트 벽
      const glow = Math.abs(Math.sin(Date.now() * 0.006)) * 10;
      this.ctx.strokeStyle = '#ef4444';
      this.ctx.shadowBlur = 15 + glow;
      this.ctx.shadowColor = '#ef4444';
      this.ctx.lineWidth = 10;
      
      // 위아래 기둥 연결선
      this.ctx.beginPath();
      this.ctx.moveTo(x, 60);
      this.ctx.lineTo(x, 740);
      this.ctx.stroke();

      // 경고 표식
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 16px Noto Sans KR';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🚧 차단막 활성화 (몬스터 처치 필요)', x, 400);
    } else {
      // 열린 상태: 통과 화살표 표시
      const sweep = Math.sin(Date.now() * 0.008) * 15;
      this.ctx.fillStyle = '#22c55e';
      this.ctx.font = 'bold 15px Noto Sans KR';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`▶▶ 통과 가능 ▶▶`, x + sweep, 400);
    }
    this.ctx.restore();
  }
}

// ============================================================================
// 4. UI 매니저 클래스 (Gacha & Modal)
// ============================================================================

class UIManager {
  constructor() {
    this.currentGachaLevel = 1;
    this.activeQuiz = null;
    this.isRollingQuiz = false;
    this.isMuted = gameAudio.isMuted;
    this.toastTimeout = null;
  }

  closeAllOverlays() {
    document.querySelectorAll('.overlay-screen').forEach((screen) => {
      screen.classList.remove('active');
    });
  }

  openHelp() {
    this.closeAllOverlays();
    document.getElementById('help-screen').classList.add('active');
  }

  toggleMute() {
    this.isMuted = gameAudio.toggleMute();
    this.updateMuteButton();
    this.showToast(this.isMuted ? '소리가 꺼졌습니다.' : '소리가 켜졌습니다.', this.isMuted ? '🔇' : '🔊');
  }

  updateMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    if (!muteBtn || !muteIcon) return;

    const label = this.isMuted ? '소리 켜기' : '소리 끄기';
    muteIcon.innerText = this.isMuted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', label);
    muteBtn.setAttribute('aria-pressed', String(this.isMuted));
    muteBtn.title = label;
    muteBtn.classList.toggle('muted', this.isMuted);
  }

  showToast(message, icon = '✨') {
    const toast = document.getElementById('toast-notification');
    document.getElementById('toast-icon').innerText = icon;
    document.getElementById('toast-message').innerText = message;
    
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  updateHUD() {
    this.updateMuteButton();

    // 체력
    const hpPercent = (game.player.hp / game.player.maxHp) * 100;
    document.getElementById('health-bar').style.width = `${hpPercent}%`;
    document.getElementById('health-text').innerText = `${game.player.hp} / ${game.player.maxHp}`;
    
    // 코인
    this.updateCoinsDisplay();

    // 맵 위치 표시
    const zoneText = document.getElementById('zone-text');
    if (game.state === STATE_LOBBY) {
      zoneText.innerText = '로비 마을 (Lobby)';
    } else {
      zoneText.innerText = `던전 ${game.dungeonZone}구역` + (game.dungeonZone === 3 ? ' (BOSS)' : '');
    }

    // 장비 인디케이터
    document.getElementById('weapon-name').innerText = game.player.activeWeapon.name;
    const badge = document.getElementById('weapon-rarity-badge');
    badge.innerText = game.player.activeWeapon.rarity;
    
    badge.className = "drawn-weapon-rarity";
    if (game.player.activeWeapon.rarity === "희귀") badge.classList.add('rarity-rare');
    if (game.player.activeWeapon.rarity === "에픽") badge.classList.add('rarity-epic');
    if (game.player.activeWeapon.rarity === "신화") badge.classList.add('rarity-mythic');
    if (game.player.activeWeapon.rarity === "전설") badge.classList.add('rarity-legendary');
  }

  updateCoinsDisplay() {
    document.getElementById('coin-amount').innerText = game.player.coins;
  }

  // --- RNG 퀴즈 머신 가차 롤링 ---
  openQuizSpinner() {
    this.closeAllOverlays();
    
    const rollBtn = document.getElementById('roll-quiz-btn');
    rollBtn.disabled = false;
    rollBtn.innerText = "RNG Quiz Roll (무료)";

    const track = document.getElementById('spinner-track');
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    track.innerHTML = '';
    
    // 40개 스피너 아이템 나열
    for (let i = 0; i < 40; i++) {
      const lvl = (i % 5) + 1;
      const item = document.createElement('div');
      item.className = `spinner-item lvl-item-${lvl}`;
      item.innerHTML = `<div class="spinner-level">${lvl}단계</div><div class="spinner-reward">🪙 ${lvl * 5} 코인</div>`;
      track.appendChild(item);
    }

    document.getElementById('quiz-gacha-screen').classList.add('active');
  }

  rollQuizDifficulty() {
    if (this.isRollingQuiz) return;
    this.isRollingQuiz = true;
    
    const rollBtn = document.getElementById('roll-quiz-btn');
    rollBtn.disabled = true;
    rollBtn.innerText = "선택되는 중...";

    // 1-5단계 난이도 확률 판정 (1단계: 35%, 2단계: 25%, 3단계: 20%, 4단계: 12%, 5단계: 8%)
    const rand = Math.random() * 100;
    let chosenLevel = 1;
    if (rand < 35) chosenLevel = 1;
    else if (rand < 60) chosenLevel = 2;
    else if (rand < 80) chosenLevel = 3;
    else if (rand < 92) chosenLevel = 4;
    else chosenLevel = 5;

    this.currentGachaLevel = chosenLevel;

    const track = document.getElementById('spinner-track');
    const targetIndex = 32; // 안착 인덱스
    const items = track.getElementsByClassName('spinner-item');
    items[targetIndex].className = `spinner-item lvl-item-${chosenLevel}`;
    items[targetIndex].innerHTML = `<div class="spinner-level">${chosenLevel}단계</div><div class="spinner-reward">🪙 ${chosenLevel * 5} 코인</div>`;
    
    let lastTick = 0;
    const spinDuration = 3500;
    const startTime = Date.now();

    // 룰렛 회전음 틱 시뮬레이션
    const playTicks = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < spinDuration) {
        const progress = elapsed / spinDuration;
        const currentItemPassed = Math.floor(progress * targetIndex);
        if (currentItemPassed > lastTick) {
          gameAudio.playHit();
          lastTick = currentItemPassed;
        }
        requestAnimationFrame(playTicks);
      }
    };
    playTicks();

    track.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)';
    const itemWidth = 100;
    const centerOffset = 250 - (itemWidth / 2);
    const targetOffset = -(targetIndex * itemWidth) + centerOffset;
    
    track.style.transform = `translateX(${targetOffset}px)`;

    setTimeout(() => {
      this.isRollingQuiz = false;
      this.closeAllOverlays();
      this.startQuizSession(chosenLevel);
    }, 3600);
  }

  startQuizSession(level) {
    const quiz = getRandomQuiz(level);
    if (!quiz) {
      this.showToast('퀴즈 소환에 실패했습니다.');
      return;
    }

    this.activeQuiz = quiz;
    this.activeQuiz.level = level;

    const levelBadge = document.getElementById('quiz-level-badge');
    levelBadge.innerText = `${level}단계`;
    levelBadge.className = `quiz-badge lvl-item-${level}`;

    document.getElementById('quiz-reward-text').innerText = `🪙 ${level * 5} 코인`;
    document.getElementById('quiz-unit-name').innerText = quiz.unit;
    document.getElementById('quiz-question-text').innerText = quiz.question;

    document.getElementById('quiz-question-view').style.display = 'block';
    document.getElementById('quiz-result-view').style.display = 'none';

    document.getElementById('quiz-modal-screen').classList.add('active');
  }

  submitQuizAnswer(userAnswer) {
    const isCorrect = (userAnswer === this.activeQuiz.answer);
    
    document.getElementById('quiz-question-view').style.display = 'none';
    const resultView = document.getElementById('quiz-result-view');
    resultView.style.display = 'block';

    const resIcon = document.getElementById('result-icon');
    const resTitle = document.getElementById('result-title');
    const resExplanation = document.getElementById('result-explanation');

    if (isCorrect) {
      const reward = this.activeQuiz.level * 5;
      game.player.coins += reward;
      this.updateCoinsDisplay();

      gameAudio.playQuizSuccess();
      resIcon.innerText = '✅';
      resIcon.style.color = '#10b981';
      resTitle.innerText = `정답입니다! (+${reward} 코인)`;
      resTitle.style.color = '#10b981';
    } else {
      gameAudio.playQuizFailure();
      resIcon.innerText = '❌';
      resIcon.style.color = '#ef4444';
      resTitle.innerText = '아쉽게도 오답입니다.';
      resTitle.style.color = '#ef4444';
    }

    resExplanation.innerHTML = `<strong>해설:</strong> ${this.activeQuiz.explanation}`;
  }

  closeQuizResult() {
    this.closeAllOverlays();
    this.activeQuiz = null;
    this.updateHUD();
  }

  // --- 무기 가차 상점 ---
  openShop() {
    this.closeAllOverlays();
    document.getElementById('weapon-draw-display').style.display = 'none';
    document.getElementById('buy-weapon-btn').disabled = false;
    document.getElementById('shop-screen').classList.add('active');
  }

  buyWeaponGacha() {
    if (game.player.coins < 35) {
      gameAudio.playQuizFailure();
      this.showToast('🪙 코인이 부족합니다! 퀴즈를 맞추고 코인을 충전하세요.', '❌');
      return;
    }

    game.player.coins -= 35;
    this.updateCoinsDisplay();
    gameAudio.playBuy();

    document.getElementById('buy-weapon-btn').disabled = true;

    // 등급 추첨: 희귀(50%), 에픽(35%), 신화(12%), 전설(3%)
    const rand = Math.random() * 100;
    let rarityKey = "rare";
    let rarityLabel = "희귀";
    
    if (rand < 3) {
      rarityKey = "legendary";
      rarityLabel = "전설";
    } else if (rand < 15) {
      rarityKey = "mythic";
      rarityLabel = "신화";
    } else if (rand < 50) {
      rarityKey = "epic";
      rarityLabel = "에픽";
    }

    const list = WEAPON_CATALOG[rarityKey];
    const rolledWeapon = { ...list[Math.floor(Math.random() * list.length)], rarity: rarityLabel };

    game.player.inventory.push(rolledWeapon);
    game.player.activeWeapon = rolledWeapon; // 자동 즉시 장착

    const drawDisplay = document.getElementById('weapon-draw-display');
    drawDisplay.style.display = 'block';

    const drawRarity = document.getElementById('draw-rarity');
    drawRarity.innerText = rarityLabel;
    
    drawRarity.className = "drawn-weapon-rarity";
    if (rarityLabel === "희귀") drawRarity.classList.add('rarity-rare');
    if (rarityLabel === "에픽") drawRarity.classList.add('rarity-epic');
    if (rarityLabel === "신화") drawRarity.classList.add('rarity-mythic');
    if (rarityLabel === "전설") drawRarity.classList.add('rarity-legendary', 'rarity-glow-legendary');

    document.getElementById('draw-name').innerText = rolledWeapon.name;
    document.getElementById('draw-stat-damage').innerText = rolledWeapon.damage;
    document.getElementById('draw-stat-speed').innerText = `${rolledWeapon.fireRate / 1000}s`;

    // 팡파레 시각 효과
    for (let i = 0; i < 30; i++) {
      const pColor = rarityLabel === "전설" ? '#fbbf24' : (rarityLabel === "신화" ? '#f43f5e' : '#a855f7');
      game.particles.push(new Particle(
        game.player.x, game.player.y - 30,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 7 - 3,
        Math.random() * 4 + 2,
        pColor,
        1.0,
        0.015
      ));
    }

    this.updateHUD();
    this.showToast(`🔫 [${rarityLabel}] ${rolledWeapon.name} 물총을 장착했습니다!`);
  }

  // --- 인벤토리 ---
  openInventory() {
    this.closeAllOverlays();
    const listEl = document.getElementById('inventory-list');
    listEl.innerHTML = '';

    game.player.inventory.forEach((wpn, index) => {
      const item = document.createElement('div');
      const isActive = (game.player.activeWeapon.name === wpn.name);
      item.className = `inventory-item ${isActive ? 'active' : ''}`;
      
      let badgeClass = 'rarity-rare';
      if (wpn.rarity === '에픽') badgeClass = 'rarity-epic';
      if (wpn.rarity === '신화') badgeClass = 'rarity-mythic';
      if (wpn.rarity === '전설') badgeClass = 'rarity-legendary';

      item.innerHTML = `
        <span class="drawn-weapon-rarity ${badgeClass}" style="font-size:0.65rem; padding: 1px 6px; margin:0 0 5px 0;">${wpn.rarity}</span>
        <div style="font-weight:bold; font-size:0.85rem; margin-bottom:4px;">${wpn.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted);">데미지: ${wpn.damage} | 연사: ${wpn.fireRate/1000}s</div>
      `;

      item.onclick = () => {
        game.player.activeWeapon = wpn;
        gameAudio.playBuy();
        this.openInventory();
        this.updateHUD();
        this.showToast(`🔫 ${wpn.name}(으)로 주무기를 장착했습니다!`);
      };

      listEl.appendChild(item);
    });

    document.getElementById('inventory-screen').classList.add('active');
  }
}

// ============================================================================
// 5. 초기화 부팅
// ============================================================================
let game;
let uiManager;

window.addEventListener('load', () => {
  game = new Game();
  uiManager = new UIManager();

  uiManager.updateHUD();

  function loop() {
    game.update();
    game.draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
