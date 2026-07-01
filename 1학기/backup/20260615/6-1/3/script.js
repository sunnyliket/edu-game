"use strict";
/* ═══════════════════════════════════════════════════════════════════
   과학쌤의 연애세포 되살리기 프로젝트 – script.js
   캔버스: 620 × 380 px  /  픽셀 단위: 20 px
   그리드:  31 열(W) × 19 행(H)
   캐릭터: 선생님(데이트룩·단발 갈색)  썸녀(긴머리·핑크)
   ─ 비활성 캐릭터도 투명 처리 없음 (항상 100% 불투명)
   ─ 썸녀는 선생님을 '선배'라고 부름
   ─ 생각 대사 💭 별도 표시
   ─ 데이트 일상 속에서 자연스럽게 퀴즈 진행
   ═══════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────
   1. 캔버스 & 픽셀 설정
──────────────────────────────────────── */
const PX = 20;           // 1픽셀 = 20 CSS px
const CW = 620, CH = 380;
const W  = CW / PX;      // 31 열
const H  = CH / PX;      // 19 행

const bgC  = document.getElementById("bgCanvas");
const chC  = document.getElementById("charCanvas");
const bg   = bgC.getContext("2d");
const ch   = chC.getContext("2d");

// 캔버스 실제 해상도도 명시 (HTML에 이미 설정돼 있으나 안전하게 재설정)
bgC.width  = chC.width  = CW;
bgC.height = chC.height = CH;

/** 픽셀 단위로 사각형 채우기 */
function px(ctx, x, y, color, w = 1, h = 1) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * PX, y * PX, w * PX, h * PX);
}

/* ────────────────────────────────────────
   2. 팔레트
──────────────────────────────────────── */
const P = {
  /* 공통 */
  sky_day:   "#87CEEB",
  sky_eve:   "#FF9B7B",
  sky_night: "#0D0D2B",
  cloud:     "#FFFFFF",
  sun:       "#FFD700",
  moon:      "#FFFDE7",
  star:      "#FFD700",
  ground:    "#6B4F3B",
  grass:     "#4CAF50",
  grass2:    "#388E3C",
  path:      "#C4A882",
  /* 건물 */
  cafe_sky:  "#B8D8F0",
  cafe_wall: "#D4A574",
  cafe_roof: "#8B4513",
  cafe_win:  "#87CEEB",
  cafe_door: "#5D4037",
  /* 공원 */
  tree1:     "#1B5E20",
  tree2:     "#2E7D32",
  trunk:     "#795548",
  flower:    "#FF69B4",
  bench:     "#A0522D",
  /* 식물원 */
  glass:     "#B2EBF2",
  frame:     "#00796B",
  plant1:    "#2ECC71",
  plant2:    "#27AE60",
  pot:       "#8D6E63",
  /* 천문대 */
  obs_wall:  "#546E7A",
  obs_dome:  "#90A4AE",
  obs_slit:  "#0D0D2B",
  scope:     "#78909C",
  /* 캐릭터 – 선생님 */
  T_hair:    "#4A3728",
  T_skin:    "#FDBCB4",
  T_shirt:   "#4A90D9",   // 데이트룩 캐주얼 셔츠 (블루)
  T_pants:   "#2C3E50",
  T_shoes:   "#1A1A1A",
  T_collar:  "#FFFFFF",
  /* 캐릭터 – 썸녀 */
  G_hair:    "#2C1810",
  G_skin:    "#FDBCB4",
  G_top:     "#E91E8C",   // 핑크 상의
  G_skirt:   "#AD1457",
  G_shoes:   "#FF69B4",
  G_blush:   "#FFB6C1",
  /* 공통 – 아이 */
  eye:       "#1A1A2E",
  mouth:     "#CC5555",
  ink:       "#1A1A2E",
};

/* ────────────────────────────────────────
   3. 배경 그리기 (31×19 픽셀)
──────────────────────────────────────── */
function drawBG(scene) {
  bg.clearRect(0, 0, CW, CH);
  ({ cafe: drawCafe, park: drawPark, garden: drawGarden, obs: drawObs }[scene] || drawCafe)();
}

/* ── 카페 ── */
function drawCafe() {
  // 하늘
  for (let y = 0; y < 11; y++) px(bg, 0, y, P.cafe_sky, W);
  // 구름
  px(bg,  2, 1, P.cloud, 5, 2); px(bg, 1, 2, P.cloud, 7, 1);
  px(bg, 22, 2, P.cloud, 4, 2); px(bg,21, 3, P.cloud, 6, 1);
  // 태양
  px(bg, 27, 1, P.sun, 3, 3);
  // 카페 건물 – 지붕
  px(bg,  5, 2, P.cafe_roof, 21, 2);
  // 간판
  px(bg,  6, 4, "#F5DEB3", 19, 2);
  px(bg,  6, 4, "#E94560",  19, 1);
  // 벽
  px(bg,  5, 6, P.cafe_wall, 21, 5);
  // 창문 ×3
  [[7,7],[13,7],[19,7]].forEach(([x,y]) => {
    px(bg, x, y, P.cafe_win, 4, 3);
    bg.strokeStyle = P.cafe_door; bg.lineWidth = 2;
    bg.strokeRect(x*PX, y*PX, 4*PX, 3*PX);
  });
  // 문
  px(bg, 14, 8, P.cafe_door, 3, 3);
  px(bg, 15, 9, P.cafe_win,  1, 2);
  // 화분
  [[ 4,10],[26,10]].forEach(([x,y]) => {
    px(bg, x,   y,   P.plant1, 2, 2);
    px(bg, x,   y+2, P.pot,    2, 1);
  });
  // 지면
  for (let y = 11; y < H; y++) px(bg, 0, y, y === 11 ? P.ground : "#8B7355", W);
  // 인도
  px(bg, 0, 11, "#A09070", W, 2);
}

/* ── 공원 ── */
function drawPark() {
  // 하늘
  for (let y = 0; y < 11; y++) px(bg, 0, y, P.sky_day, W);
  // 태양
  px(bg, 26, 1, P.sun, 3, 3);
  // 구름
  px(bg,  2, 2, P.cloud, 6, 2); px(bg, 1, 3, P.cloud, 8);
  px(bg, 20, 3, P.cloud, 5, 2); px(bg,19, 4, P.cloud, 7);
  // 나무들
  function tree(x) {
    px(bg, x, 4, P.tree1, 5, 5);
    px(bg, x+1, 3, P.tree1, 3, 2);
    px(bg, x+2, 9, P.trunk, 1, 2);
  }
  tree(1); tree(13); tree(25);
  // 꽃들
  for (let i = 0; i < 7; i++) {
    px(bg, 5+i*3, 10, P.flower, 1);
    px(bg, 6+i*3, 10, "#FFD700", 1);
  }
  // 잔디
  for (let y = 11; y < H; y++) px(bg, 0, y, y===11 ? P.grass : P.grass2, W);
  // 산책로
  px(bg, 8, 11, P.path, 15, H-11);
  for (let i=0; i<3; i++) px(bg, 11+i*5, 12, "#A08060", 2, 3);
  // 벤치
  px(bg, 26, 10, P.bench, 5); px(bg, 26, 11, P.bench, 1, 2); px(bg, 30, 11, P.bench, 1, 2);
}

/* ── 식물원 (온실) ── */
function drawGarden() {
  // 배경
  for (let y = 0; y < H; y++) px(bg, 0, y, y<12 ? "#E0F7FA" : "#4E342E", W);
  // 유리 온실 프레임
  px(bg, 2, 1, P.glass, 27, 11);
  for (let i = 0; i < 5; i++) px(bg, 2+i*7, 1, P.frame, 1, 11);
  px(bg, 2,  1, P.frame, 27);
  px(bg, 2, 11, P.frame, 27);
  // 식물들
  const pts = [3,7,11,15,19,23,27];
  pts.forEach((x, i) => {
    const h = 3 + (i%3);
    const g = [P.plant1, P.plant2, P.tree2, P.tree1][i%4];
    px(bg, x,   11-h, g, 3, h);
    px(bg, x-1, 11-h, g, 5, 2);
    px(bg, x,   11,   P.pot, 3);
  });
  // 꽃 장식
  [5,12,19,26].forEach(x => {
    px(bg, x, 8, "#FF69B4", 2, 2);
    px(bg, x, 7, "#FF1493", 2);
  });
  // 바닥
  px(bg, 0, 12, "#5D4037", W, H-12);
  // 화분 선반
  px(bg, 2, 12, "#795548", 27);
}

/* ── 천문대 ── */
function drawObs() {
  // 밤하늘
  for (let y = 0; y < H; y++) px(bg, 0, y, y<13 ? P.sky_night : "#1A237E", W);
  // 별
  const stars = [
    [1,1],[5,2],[9,1],[13,2],[17,1],[21,2],[25,1],[29,2],
    [3,4],[7,3],[11,5],[15,3],[19,4],[23,3],[27,5],[30,3],
    [2,7],[6,6],[10,8],[14,6],[18,7],[22,6],[26,8],[29,6],
  ];
  stars.forEach(([x,y]) => px(bg, x, y, P.star));
  // 달 (초승달)
  px(bg, 27, 1, P.moon, 4, 4);
  px(bg, 29, 1, P.sky_night, 2, 2);
  // 천문대 본체
  px(bg,  8, 7, P.obs_wall, 15, 6);
  // 돔
  px(bg, 11, 4, P.obs_dome, 10, 4);
  px(bg, 12, 3, P.obs_dome,  7, 2);
  px(bg, 14, 2, P.obs_dome,  3, 2);
  // 슬릿
  px(bg, 15, 3, P.obs_slit, 2, 3);
  // 망원경
  px(bg, 15, 4, P.scope, 2); px(bg, 14, 5, P.scope, 4);
  // 창문
  px(bg, 10, 9, P.cafe_win, 3, 3); px(bg, 19, 9, P.cafe_win, 3, 3);
  // 문
  px(bg, 15,10, P.cafe_door, 2, 3);
  // 지면
  px(bg,  0,13, "#283593", W);
}

/* ────────────────────────────────────────
   4. 캐릭터 그리기 (투명 처리 없음)
──────────────────────────────────────── */
function drawChars(active) {
  ch.clearRect(0, 0, CW, CH);
  drawTeacher(3,  H, active === "teacher");   // 왼쪽
  drawPartner(20, H, active === "partner");   // 오른쪽
}

/* 활성 캐릭터는 살짝 위로 올려서 강조 (투명 처리 없음) */
function drawTeacher(bx, by, active) {
  const oy = active ? -1 : 0;  // 1픽셀 위
  const B  = by + oy;

  // 신발
  px(ch, bx+1, B-1, P.T_shoes, 2); px(ch, bx+4, B-1, P.T_shoes, 2);
  // 바지
  px(ch, bx+1, B-4, P.T_pants, 2, 3); px(ch, bx+4, B-4, P.T_pants, 2, 3);
  // 몸통 – 캐주얼 셔츠
  px(ch, bx,   B-8, P.T_shirt, 7, 4);
  // 버튼 라인
  px(ch, bx+3, B-8, "#2C5F8A", 1, 4);
  // 칼라
  px(ch, bx+1, B-8, P.T_collar, 2); px(ch, bx+4, B-8, P.T_collar, 2);
  // 팔
  px(ch, bx-1, B-8, P.T_shirt, 1, 3); px(ch, bx+7, B-8, P.T_shirt, 1, 3);
  // 손
  px(ch, bx-1, B-5, P.T_skin); px(ch, bx+7, B-5, P.T_skin);
  // 목
  px(ch, bx+3, B-9, P.T_skin);
  // 얼굴
  px(ch, bx+1, B-12, P.T_skin, 5, 3);
  // 머리카락 (단발)
  px(ch, bx+1, B-13, P.T_hair, 5, 2);
  px(ch, bx,   B-12, P.T_hair);
  px(ch, bx+6, B-12, P.T_hair);
  // 눈·입
  px(ch, bx+2, B-11, P.eye); px(ch, bx+4, B-11, P.eye);
  px(ch, bx+3, B-9,  P.mouth);

  // 이름표
  _nameTag(ch, bx, B-15, "과학쌤");
}

function drawPartner(bx, by, active) {
  const oy = active ? -1 : 0;
  const B  = by + oy;

  // 신발
  px(ch, bx+1, B-1, P.G_shoes, 2); px(ch, bx+4, B-1, P.G_shoes, 2);
  // 다리
  px(ch, bx+1, B-3, P.G_skin, 2, 2); px(ch, bx+4, B-3, P.G_skin, 2, 2);
  // 치마
  px(ch, bx,   B-5, P.G_skirt, 7, 2);
  // 상의
  px(ch, bx,   B-8, P.G_top,   7, 3);
  // 리본
  px(ch, bx+3, B-8, "#FF1493");
  // 팔
  px(ch, bx-1, B-8, P.G_top, 1, 2); px(ch, bx+7, B-8, P.G_top, 1, 2);
  // 손
  px(ch, bx-1, B-6, P.G_skin); px(ch, bx+7, B-6, P.G_skin);
  // 목
  px(ch, bx+3, B-9, P.G_skin);
  // 얼굴 (썸녀는 선생님보다 1픽셀 작음 → 얼굴 top = B-12)
  px(ch, bx+1, B-12, P.G_skin, 5, 3);
  // 볼터치
  px(ch, bx+1, B-10, P.G_blush); px(ch, bx+5, B-10, P.G_blush);
  // 눈 (속눈썹 포함)
  px(ch, bx+2, B-11, P.eye); px(ch, bx+4, B-11, P.eye);
  px(ch, bx+2, B-12, P.eye); px(ch, bx+4, B-12, P.eye); // 속눈썹
  // 입
  px(ch, bx+3, B-10, "#E91E8C");
  // 긴 머리 (앞머리 + 양쪽 아래로 흘러내림)
  px(ch, bx+1, B-13, P.G_hair, 5, 2);  // 앞머리
  px(ch, bx,   B-12, P.G_hair, 1, 7);  // 왼쪽 긴머리
  px(ch, bx+6, B-12, P.G_hair, 1, 7);  // 오른쪽 긴머리
  px(ch, bx,   B-12, P.G_hair);        // 왼 귀 가리개
  px(ch, bx+6, B-12, P.G_hair);

  // 이름표
  _nameTag(ch, bx, B-15, "썸녀");
}

function _nameTag(ctx, bx, by, label) {
  ctx.fillStyle   = "#FFF8E7";
  ctx.strokeStyle = "#1A1A2E";
  ctx.lineWidth   = 2;
  const tw = 7 * PX, th = PX * 1.1;
  ctx.fillRect(bx * PX, by * PX, tw, th);
  ctx.strokeRect(bx * PX, by * PX, tw, th);
  ctx.fillStyle   = "#1A1A2E";
  ctx.font        = "bold 11px 'Noto Sans KR', monospace";
  ctx.textAlign   = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, (bx + 3.5) * PX, (by + 0.55) * PX);
}

/* ────────────────────────────────────────
   5. 스토리 데이터
   speaker 값:
     "teacher"      → 과학쌤 (일반 대사)
     "teacher_think"→ 과학쌤 💭 (생각)
     "partner"      → 썸녀 (일반 대사, "선배" 호칭 사용)
     "partner_think"→ 썸녀 💭 (생각)
     "narr"         → 나레이션
──────────────────────────────────────── */
const UNITS = [

  /* ══════════ 1단원 · 카페 ══════════ */
  {
    id: "acid", unit: "1단원 · 산과 염기", place: "카페", scene: "cafe",
    story: [
      { sp:"teacher_think", tx:"첫 데이트다. 장소는 카페. 오늘은 말도 조심하고, 과학 설명도 너무 딱딱하지 않게 해야 한다." },
      { sp:"narr",          tx:"두 사람은 창가 자리에 앉았다. 테이블 위에는 얼음이 든 레몬에이드가 반짝이고 있었다." },
      { sp:"partner",       tx:"선배, 저 레몬에이드 마셔도 돼요? 여기 레몬에이드가 유명하대요." },
      { sp:"teacher",       tx:"좋죠. 보기만 해도 상큼하네요." },
      { sp:"partner_think", tx:"선배랑 카페에 앉아 있으니까 괜히 긴장된다. 그래도 오늘은 제가 질문을 좀 해봐야지." },
      { sp:"partner",       tx:"선배, 그럼 제가 산과 염기 퀴즈 내도 돼요? 다 맞히면 진짜 멋있을 것 같은데요." },
      { sp:"teacher",       tx:"좋아요. 대화가 끝나면 질문 주세요. 차근차근 풀어볼게요." },
    ],
    qs: [
      {
        ctx: "썸녀가 레몬에이드를 한 모금 마시고는 빨대를 내려놓았다.",
        lead_sp:"partner", lead:"레몬에이드에 들어간 레몬즙은 산성이에요, 염기성이에요?",
        prompt:"레몬에이드에 들어간 레몬즙은 어떤 성질일까요?",
        opts:["산성","염기성"], ans:0,
        exp:"레몬즙은 산성을 띠어요.",
        hint:"레몬의 신맛을 떠올려봐요."
      },
      {
        ctx: "선생님이 산성이라고 답하자 썸녀가 고개를 끄덕이며 다시 물었다.",
        lead_sp:"partner", lead:"그럼 산성은 무슨 특징이 있어요?",
        prompt:"산성 용액의 특징으로 알맞은 것은?",
        opts:["신맛이 나고 푸른 리트머스 종이를 붉게 변화시킨다","쓴맛이 나고 미끈거리며 붉은 리트머스를 푸르게 변화시킨다","항상 pH가 7이다","페놀프탈레인 용액을 진한 분홍색으로 만든다"], ans:0,
        exp:"산성 용액은 신맛이 나는 경우가 많고, 푸른 리트머스 종이를 붉게 변화시켜요.",
        hint:"레몬이나 식초처럼 신맛이 나는 물질을 떠올려봐요."
      },
      {
        ctx: "썸녀가 잠깐 창밖을 바라보다가 속으로 생각했다.",
        lead_sp:"partner_think", lead:"참 지식이 풍부한 남자네.. 그러면 조금 더 어려운 것도 물어봐야겠다.",
        prompt:"염기성이랑 산성이랑 섞으면 어떤 변화가 생겨요?",
        opts:["산성과 염기성을 섞으면 중화 반응이 일어나 산성과 염기성의 성질이 약해지거나 없어진다","산성과 염기성을 섞으면 소화 반응이 일어나 산성과 염기성의 성질이 세지며 강해진다"], ans:0,
        exp:"산성과 염기성을 섞으면 중화 반응이 일어나 산성과 염기성의 성질이 약해지거나 없어질 수 있어요.",
        hint:"반대 성질이 만나 서로 약해지는 반응을 떠올려봐요."
      },
      {
        ctx: "썸녀가 자리에서 일어나며 조심스럽게 웃었다.",
        lead_sp:"partner", lead:"저 화장실좀 잠깐 다녀올게요! 다녀와서 또 물어볼래요.",
        prompt:"화장실에 있던 락스는 산성일까요, 염기성일까요?",
        opts:["산성","염기성"], ans:1,
        exp:"락스는 보통 염기성을 띠어요.",
        hint:"표백제나 세제 쪽 물질을 생각해봐요."
      },
      {
        ctx: "화장실에서 돌아온 썸녀가 손을 말리며 다시 질문했다.",
        lead_sp:"partner", lead:"그럼 대표적인 염기성 용액은 뭐가 있어요?",
        prompt:"대표적인 염기성 용액으로 알맞은 것은?",
        opts:["비누물","식초","레몬즙","묽은 염산"], ans:0,
        exp:"비누물은 대표적인 염기성 용액으로 볼 수 있어요.",
        hint:"만졌을 때 미끈거리는 생활 속 용액을 떠올려봐요."
      },
      {
        ctx: "카페에서 나와 길거리를 걷던 두 사람은 과학 행사 체험부스를 발견했다.",
        lead_sp:"partner", lead:"우와! 우리 저거 해볼래요? 지시약으로 산성과 염기성을 구분하면 큰 곰 인형을 준대요!",
        prompt:"지시약은 용액의 성질에 따라 색깔이 변하는 물질이에요.",
        opts:["O","X"], ans:0,
        exp:"지시약은 용액의 산성, 염기성 등 성질에 따라 색깔이 변하는 물질이에요.",
        hint:"지시약은 색 변화로 용액의 성질을 알려줘요."
      },
      {
        ctx: "부스에는 붉은색 리트머스, 푸른색 리트머스, 페놀프탈레인 용액, 푸른 양배추지시약이 놓여 있었다.",
        lead_sp:"partner", lead:"선배! 이중 지시약이 아닌 건 뭐게~요!",
        prompt:"다음 중 지시약이 아닌 것은?",
        opts:["붉은색 리트머스","푸른색 리트머스","페놀프탈레인 용액","푸른 양배추지시약"], ans:3,
        exp:"이 문제에서는 푸른 양배추지시약이 지시약이 아닌 것으로 제시되었어요.",
        hint:"부스에 놓인 이름 중 어색한 것을 찾아봐요."
      },
      {
        ctx: "행사 진행자는 붉은 리트머스 종이, 푸른 리트머스 종이, 페놀프탈레인 용액을 차례로 보여주었다.",
        lead_sp:"partner", lead:"선배, 그러면 이중에 붉은 리트머스 종이와 페놀프탈레인 용액은 염기성 지시약일까요? 아닐까요!",
        prompt:"붉은 리트머스 종이와 페놀프탈레인 용액은 염기성 지시약이다.",
        opts:["O","X"], ans:0,
        exp:"이 문제에서는 붉은 리트머스 종이와 페놀프탈레인 용액을 염기성을 확인하는 지시약으로 보았어요.",
        hint:"염기성에서 색 변화가 나타나는 지시약을 생각해봐요."
      },
      {
        ctx: "썸녀가 푸른 리트머스 종이를 집어 들었다.",
        lead_sp:"partner", lead:"선배, 그럼 푸른 리트머스 종이는 산성과 염기성을 모두 분류할 수 있는 지시약이에요?",
        prompt:"푸른 리트머스 종이는 산성과 염기성을 모두 분류할 수 있다.",
        opts:["O","X"], ans:1,
        exp:"푸른 리트머스 종이는 산성 여부를 확인하는 데 주로 쓰이며, 산성과 염기성을 완벽히 모두 분류하지는 못해요.",
        hint:"푸른 리트머스 종이가 어떤 성질에서 색이 변하는지 떠올려봐요."
      },
      {
        ctx: "부스의 세 가지 지시약을 모두 살펴본 뒤, 썸녀가 장난스럽게 웃었다.",
        lead_sp:"partner", lead:"그럼 이 세 가지 지시약은 산과 염기를 완벽히 분류할 수 있을까영?",
        prompt:"붉은 리트머스, 푸른 리트머스, 페놀프탈레인 용액은 산과 염기를 완벽히 분류할 수 있다.",
        opts:["O","X"], ans:1,
        exp:"완벽히 분류하기보다는 산/염기인 것과 산/염기가 아닌 것을 구분하는 데 한계가 있어요.",
        hint:"모든 용액을 완벽하게 나누는 것은 어렵다는 점을 생각해봐요."
      },
      {
        ctx: "썸녀가 곰 인형을 바라보며 한 문제를 더 냈다.",
        lead_sp:"partner", lead:"산성과 페놀프탈레인 용액을 섞으면 색깔 변화가 어떻게 나타날까요?",
        prompt:"산성과 페놀프탈레인 용액을 섞으면 어떤 색으로 나타날까요?",
        opts:["노란색","초록색","붉은색","무지개색"], ans:2,
        exp:"이 문제의 정답은 붉은색이에요.",
        hint:"제시된 보기 중 붉은 계열 색을 찾아봐요."
      },
      {
        ctx: "붉은 양배추 지시약 색 변화 표를 보던 썸녀가 손가락으로 노란색 칸을 가리켰다.",
        lead_sp:"partner", lead:"붉은 양배추 지시약에 어떤 용액을 섞었더니 색이 노란색으로 변했으면! 이 용액은 산성일까용 염기성일까용?",
        prompt:"붉은 양배추 지시약이 노란색으로 변했다면 용액은?",
        opts:["산성","염기성"], ans:1,
        exp:"붉은 양배추 지시약이 노란색으로 변했다면 염기성으로 볼 수 있어요.",
        hint:"노란색 변화가 어느 성질을 나타내는지 떠올려봐요."
      },
      {
        ctx: "썸녀가 조금 어려운 표정으로 다시 물었다.",
        lead_sp:"partner", lead:"산성은 단백질을 녹일까여?",
        prompt:"산성은 단백질을 녹인다.",
        opts:["O","X"], ans:1,
        exp:"이 문제에서는 산성이 단백질을 녹이지 않는 것으로 보았어요.",
        hint:"단백질을 녹이는 성질로 더 자주 떠올리는 쪽을 생각해봐요."
      },
      {
        ctx: "체험부스 마지막 단계에서 산성 용액에 염기성 용액을 조금씩 넣는 실험을 보게 되었다.",
        lead_sp:"partner", lead:"산성 용액에 염기성 용액을 점점 색 변화가 없을 때까지 섞을 때, 용액은 어떤 성질로 변해요?",
        prompt:"산성 용액에 염기성 용액을 계속 섞으면 용액은 어떻게 변할까요?",
        opts:["점점 염기성 용액의 성질로 변함","점점 산성 용액의 성질만 강해짐","항상 아무 변화가 없음","무조건 기체가 됨"], ans:0,
        exp:"염기성 용액을 계속 섞으면 점점 염기성 용액의 성질로 변해요.",
        hint:"어떤 용액을 점점 더 넣고 있는지 생각해봐요."
      },
      {
        ctx: "묽은 염산과 페놀프탈레인 용액이 든 시험관에 묽은 수산화나트륨을 조금씩 넣기 시작했다.",
        lead_sp:"partner", lead:"그러면 묽은 염산과 페놀프탈레인 용액을 섞은 후, 묽은 수산화나트륨을 섞을 때 어떤 색 변화가 나타나요?",
        prompt:"묽은 염산과 페놀프탈레인 용액에 묽은 수산화나트륨을 섞을 때 색 변화는?",
        opts:["붉은색에서 무색","파란색에서 노란색","무색에서 붉은색","무지개색에서 갈색"], ans:2,
        exp:"무색에서 점점 붉은색으로 변해요.",
        hint:"페놀프탈레인 용액이 염기성에서 나타내는 색 변화를 떠올려봐요."
      },
    ],
    outro: [
      { sp:"partner",       tx:"와! 선배 과학 너무 잘해요!! 진짜 너무 잘하시네요, 최고에요~!" },
      { sp:"partner_think", tx:"선배 진짜 뭐예요. 대박이다. 지식이 풍부한 남자라는 게 이런 느낌인가?" },
      { sp:"teacher",       tx:"곰 인형도 받았고, 다음 장소로 걸어가볼까요?" },
      { sp:"partner",       tx:"좋아요! 선배랑 더 이야기하고 싶어요." },
    ]
  },

  /* ══════════ 2단원 · 공원 ══════════ */
  {
    id: "motion", unit: "2단원 · 물체의 운동", place: "공원 산책로", scene: "park",
    story: [
      { sp:"narr",          tx:"카페를 나온 두 사람은 공원 산책로를 걷기 시작했다. 자전거 소리와 새 소리가 어우러졌다." },
      { sp:"partner",       tx:"선배, 공원이 이렇게 넓었나요? 저 나무도 엄청 크다!" },
      { sp:"teacher",       tx:"봄이라 그런지 확 트인 느낌이네요. 걸으니까 좋다." },
      { sp:"partner_think", tx:"선배랑 걷는 속도가 딱 맞는다. 왜 이런 게 신경 쓰이지?" },
      { sp:"partner",       tx:"어, 저기 자전거 두 대가 달리고 있어요, 선배. 누가 더 빠를까요?" },
      { sp:"teacher",       tx:"같은 시간 동안 누가 더 멀리 가는지 보면 알 수 있죠." },
      { sp:"partner",       tx:"그럼 운동 단원 퀴즈도 여기서 내볼게요, 선배!" },
      { sp:"teacher",       tx:"공원에서 물리라니, 세팅이 완벽하네요." },
    ],
    qs: [
      {
        ctx: "자전거 두 대가 나란히 달리고 있다.",
        lead_sp:"partner", lead:"선배, 같은 시간 동안 더 멀리 간 자전거가 더 빠른 거 맞죠?",
        prompt:"같은 시간 동안 더 먼 거리를 이동한 물체의 속력은?",
        opts:["더 빠르다","더 느리다","항상 같다","0이다"], ans:0,
        exp:"같은 시간 동안 더 먼 거리를 이동하면 속력이 더 빠른 거예요.",
        hint:"속력은 이동 거리와 걸린 시간의 관계예요."
      },
      {
        ctx: "안내판에 자전거 코스 거리가 적혀 있다.",
        lead_sp:"teacher", lead:"속력을 계산하는 공식이 뭔지 혹시 알아요?",
        prompt:"속력을 구하는 올바른 식은?",
        opts:["속력 = 이동 거리 ÷ 걸린 시간","속력 = 걸린 시간 ÷ 이동 거리","속력 = 질량 ÷ 부피","속력 = 힘 × 면적"], ans:0,
        exp:"속력은 이동 거리를 걸린 시간으로 나누어 구해요.",
        hint:"단위 시간 동안 얼마나 이동했는지를 나타내요."
      },
      {
        ctx: "산책로에 100m 표시가 그려져 있다.",
        lead_sp:"partner", lead:"선배, 저 100m 구간을 20초에 달렸다면 속력이 얼마예요?",
        prompt:"100 m를 20초에 이동했을 때 속력은?",
        opts:["5 m/s","2 m/s","20 m/s","100 m/s"], ans:0,
        exp:"100 m ÷ 20 s = 5 m/s예요.",
        hint:"이동 거리를 걸린 시간으로 나누어봐요."
      },
      {
        ctx: "두 사람이 같은 페이스로 걷고 있다.",
        lead_sp:"partner", lead:"선배, 우리 지금 속력이 일정한 거죠? 같은 시간에 같은 거리 걷고 있으니까요.",
        prompt:"일정한 속력으로 운동하는 물체는 같은 시간에 어떻게 움직일까요?",
        opts:["같은 거리를 이동한다","점점 빨라진다","멈춰 버린다","거리가 줄어든다"], ans:0,
        exp:"일정한 속력으로 운동하면 같은 시간 동안 같은 거리를 이동해요.",
        hint:"속력이 일정하다는 말의 뜻을 생각해봐요."
      },
      {
        ctx: "자전거 대여소 안내판에 거리와 시간이 적혀 있다.",
        lead_sp:"teacher", lead:"저 자전거 코스가 60 km이고 2시간 걸린다고 써 있는데, 평균 속력이 얼마일까요?",
        prompt:"60 km를 2시간에 이동했다면 평균 속력은?",
        opts:["30 km/h","20 km/h","60 km/h","120 km/h"], ans:0,
        exp:"60 km ÷ 2 h = 30 km/h예요.",
        hint:"킬로미터를 시간으로 나누어봐요."
      },
      {
        ctx: "앞서 달리던 자전거가 갑자기 브레이크를 잡았다.",
        lead_sp:"partner", lead:"선배, 저 자전거가 브레이크를 잡아서 속력이 줄었는데 운동 상태가 변한 건가요?",
        prompt:"브레이크로 자전거 속력이 줄어드는 것은 무엇이 변한 것일까요?",
        opts:["운동 상태","색깔","재질","모양만"], ans:0,
        exp:"속력이 변하면 물체의 운동 상태가 변한 거예요.",
        hint:"운동 상태는 속력과 방향 변화와 관련 있어요."
      },
      {
        ctx: "아이가 공을 차서 방향을 바꿨다.",
        lead_sp:"partner", lead:"선배, 공이 방향만 바뀌어도 운동 상태가 변한 거예요?",
        prompt:"운동 방향이 바뀌면 운동 상태가 변했다고 할 수 있을까요?",
        opts:["그렇다 (O)","아니다 (X)"], ans:0,
        exp:"운동 방향이 바뀌어도 운동 상태가 변한 것으로 볼 수 있어요.",
        hint:"속력뿐 아니라 방향도 운동 상태의 일부예요."
      },
      {
        ctx: "거리-시간 그래프가 그려진 안내판을 발견했다.",
        lead_sp:"teacher", lead:"이 그래프에서 선의 기울기가 클수록 뭐가 큰 거게요?",
        prompt:"거리-시간 그래프에서 기울기가 클수록 무엇이 크다는 뜻일까요?",
        opts:["속력","질량","온도","부피"], ans:0,
        exp:"거리-시간 그래프의 기울기는 속력을 나타내요.",
        hint:"같은 시간에 이동 거리가 얼마나 늘어나는지 보는 거예요."
      },
      {
        ctx: "그래프에 수평 구간이 있다.",
        lead_sp:"partner", lead:"선배, 그래프 선이 수평이면 어떤 상태예요?",
        prompt:"거리-시간 그래프가 수평이면 물체는 어떤 상태일까요?",
        opts:["멈춰 있다","점점 빨라진다","방향만 바뀐다","항상 떨어진다"], ans:0,
        exp:"시간이 지나도 이동 거리가 변하지 않으면 멈춰 있는 상태예요.",
        hint:"거리가 변하지 않는다는 뜻을 생각해봐요."
      },
      {
        ctx: "벤치에 앉아 잠시 쉬었다.",
        lead_sp:"partner", lead:"선배, 정지한 물체의 속력은 얼마예요?",
        prompt:"정지한 물체의 속력은?",
        opts:["0","1","7","100"], ans:0,
        exp:"정지한 물체는 이동하지 않으므로 속력이 0이에요.",
        hint:"움직이지 않으면 이동 거리가 없어요."
      },
      {
        ctx: "원형 트랙에 롤러블레이드를 타는 사람이 보인다.",
        lead_sp:"teacher", lead:"저 사람 빠르기는 일정해 보이는데, 원을 그리니까 방향은 계속 바뀌겠죠?",
        prompt:"원형 트랙을 일정한 빠르기로 도는 물체는 운동 방향이 변할까요?",
        opts:["변한다 (O)","변하지 않는다 (X)"], ans:0,
        exp:"원형으로 움직이면 빠르기가 일정해도 운동 방향은 계속 변해요.",
        hint:"길이 휘어 있으면 진행 방향도 달라져요."
      },
      {
        ctx: "속력 단위 표지판이 보인다.",
        lead_sp:"partner", lead:"선배, 속력 단위로 알맞은 게 뭐예요?",
        prompt:"속력의 단위로 알맞은 것은?",
        opts:["m/s","kg","mL","℃"], ans:0,
        exp:"속력은 m/s나 km/h 같은 단위를 사용해요.",
        hint:"거리 단위와 시간 단위가 함께 들어가요."
      },
      {
        ctx: "두 사람이 가볍게 달리기를 해봤다.",
        lead_sp:"partner", lead:"선배, 같은 거리를 달리는데 제가 더 빨리 도착하면 제 속력이 더 빠른 거죠?",
        prompt:"같은 거리를 더 짧은 시간에 이동한 사람의 속력은?",
        opts:["더 빠르다","더 느리다","같다","비교 불가"], ans:0,
        exp:"같은 거리를 더 짧은 시간에 이동하면 속력이 더 빨라요.",
        hint:"목적지에 더 빨리 도착한 쪽을 생각해봐요."
      },
      {
        ctx: "산책로 안내판에 평균 속력 표가 있다.",
        lead_sp:"teacher", lead:"평균 속력은 어떻게 구하는지 알아요?",
        prompt:"평균 속력을 구하는 방법은?",
        opts:["전체 이동 거리 ÷ 전체 걸린 시간","전체 걸린 시간 ÷ 전체 이동 거리","질량 ÷ 부피","힘 × 이동 거리"], ans:0,
        exp:"평균 속력은 전체 이동 거리를 전체 걸린 시간으로 나누어 구해요.",
        hint:"전체 기록을 한 번에 계산하는 속력이에요."
      },
      {
        ctx: "직선 길을 걸으며 마지막 퀴즈를 냈다.",
        lead_sp:"partner", lead:"마지막이에요, 선배! 이 직선 길을 일정한 속력으로 걷는 걸 뭐라고 해요?",
        prompt:"물체가 곧은 길을 일정한 속력으로 운동하는 것을 무엇이라고 할까요?",
        opts:["등속 직선 운동","중화 반응","증산 작용","공전"], ans:0,
        exp:"곧은 길을 일정한 속력으로 운동하는 것을 등속 직선 운동이라고 해요.",
        hint:"이름 안에 '일정한 속력'과 '곧은 길'이 담겨 있어요."
      },
    ],
    outro: [
      { sp:"partner",       tx:"선배 또 다 맞혔어요! 진짜 대단해요." },
      { sp:"teacher_think", tx:"웃는 얼굴이 눈부시다. 자꾸 보게 된다." },
      { sp:"teacher",       tx:"식물원도 가볼까요? 여기서 가깝대요." },
      { sp:"partner",       tx:"식물원이요? 좋아요, 같이 가요, 선배!" },
    ]
  },

  /* ══════════ 3단원 · 식물원 ══════════ */
  {
    id: "plant", unit: "3단원 · 식물의 구조와 기능", place: "식물원 온실", scene: "garden",
    story: [
      { sp:"narr",          tx:"공원 끝 유리 온실이 빛나는 식물원으로 두 사람이 들어섰다. 초록 향기가 가득했다." },
      { sp:"partner",       tx:"선배, 여기 식물 진짜 많다! 저 큰 잎 좀 봐요." },
      { sp:"teacher",       tx:"온실이라 습도가 높네요. 이 식물들 지금도 엄청 바쁘게 살고 있어요." },
      { sp:"partner_think", tx:"선배가 식물 하나하나 살피는 눈빛이 진지하다. 좋아 보인다." },
      { sp:"partner",       tx:"식물이 바쁘다고요, 선배? 가만히 서 있는 것 같은데요." },
      { sp:"teacher",       tx:"뿌리는 물을 흡수하고, 줄기는 이동시키고, 잎은 양분을 만들고 있죠." },
      { sp:"partner",       tx:"그럼 식물 단원 퀴즈도 내볼게요, 선배. 다 맞히면 기념사진 찍어드릴게요!" },
      { sp:"teacher",       tx:"그건 찍히고 싶은 쪽은... 좋아요, 받아볼게요." },
    ],
    qs: [
      {
        ctx: "큰 화분에 심긴 관엽식물을 감상하며 걷고 있다.",
        lead_sp:"partner", lead:"선배, 이 식물 뿌리가 하는 일이 뭐예요?",
        prompt:"식물의 뿌리가 주로 하는 일은?",
        opts:["물과 무기 양분을 흡수한다","빛을 만든다","산소를 저장만 한다","꽃잎 색을 바꾼다"], ans:0,
        exp:"뿌리는 식물을 지탱하고 물과 무기 양분을 흡수해요.",
        hint:"뿌리가 흙 속에 있는 이유를 생각해봐요."
      },
      {
        ctx: "뿌리 단면 모형이 전시돼 있다.",
        lead_sp:"teacher", lead:"뿌리털이 많을수록 유리한 이유가 뭔지 알아요?",
        prompt:"뿌리털이 많으면 어떤 점이 유리할까요?",
        opts:["흡수 표면적이 넓어진다","잎 색이 사라진다","꽃이 없어진다","줄기가 물을 만든다"], ans:0,
        exp:"뿌리털은 표면적을 넓혀 물과 무기 양분을 잘 흡수하게 해요.",
        hint:"닿는 면적이 넓어지면 흡수가 쉬워져요."
      },
      {
        ctx: "줄기 단면 포스터 앞에 멈췄다.",
        lead_sp:"partner", lead:"선배, 뿌리에서 흡수한 물이 잎까지 올라가는 통로가 뭐예요?",
        prompt:"뿌리에서 흡수한 물과 무기 양분이 이동하는 통로는?",
        opts:["물관","체관","기공","꽃밥"], ans:0,
        exp:"물관은 뿌리에서 흡수한 물과 무기 양분이 이동하는 통로예요.",
        hint:"이름에 '물'이 들어 있어요."
      },
      {
        ctx: "잎에서 만들어진 양분의 이동 경로를 보여주는 그림이 있다.",
        lead_sp:"partner", lead:"선배, 반대로 잎에서 만든 양분은 어떤 통로로 이동해요?",
        prompt:"잎에서 만든 양분이 이동하는 통로는?",
        opts:["체관","물관","기공","암술"], ans:0,
        exp:"체관은 잎에서 만든 양분이 식물 곳곳으로 이동하는 통로예요.",
        hint:"물관과 짝을 이루는 통로예요."
      },
      {
        ctx: "햇빛이 유리 온실을 통해 잎에 쏟아지고 있다.",
        lead_sp:"teacher", lead:"광합성에 필요한 재료가 뭔지 세 가지를 알아요?",
        prompt:"광합성에 필요한 것은?",
        opts:["빛, 물, 이산화 탄소","소금, 모래, 산소","달빛, 질소, 철","염산, 물, 금속"], ans:0,
        exp:"식물은 빛에너지를 이용해 물과 이산화 탄소로 양분을 만들어요.",
        hint:"빛, 물, 그리고 기체 한 가지가 필요해요."
      },
      {
        ctx: "온실 안 공기가 촉촉하고 신선하다.",
        lead_sp:"partner", lead:"선배, 광합성 결과로 뭐가 생겨요? 산소가 나오는 거죠?",
        prompt:"광합성 결과 만들어지는 물질로 알맞은 것은?",
        opts:["양분과 산소","염과 물","모래와 철","질소와 수증기만"], ans:0,
        exp:"광합성으로 양분이 만들어지고 산소가 발생해요.",
        hint:"식물이 스스로 만드는 먹이와 함께 나오는 기체를 생각해봐요."
      },
      {
        ctx: "잎 확대 사진이 전시판에 붙어 있다.",
        lead_sp:"partner", lead:"선배, 잎 표면에 작은 구멍 있잖아요. 이름이 뭐예요?",
        prompt:"잎에서 기체가 드나드는 작은 구멍은?",
        opts:["기공","물관","뿌리털","꽃잎"], ans:0,
        exp:"기공은 잎에서 이산화 탄소, 산소, 수증기 등이 드나드는 작은 구멍이에요.",
        hint:"기체가 통하는 구멍이에요."
      },
      {
        ctx: "기공 구조 모형을 함께 살펴보고 있다.",
        lead_sp:"teacher", lead:"기공이 열리고 닫히는 걸 조절하는 세포가 뭔지 알아요?",
        prompt:"기공의 열리고 닫힘을 조절하는 세포는?",
        opts:["공변세포","표피세포만","꽃가루","씨방"], ans:0,
        exp:"공변세포는 기공의 열리고 닫힘을 조절해요.",
        hint:"기공을 둘러싸고 있는 세포예요."
      },
      {
        ctx: "온실 안 습도 안내판을 읽었다.",
        lead_sp:"partner", lead:"선배, 식물원이 이렇게 촉촉한 게 식물이 물을 내보내는 거 때문이에요?",
        prompt:"식물체 안의 물이 잎의 기공을 통해 수증기로 빠져나가는 현상은?",
        opts:["증산 작용","중화 반응","자전","응결만"], ans:0,
        exp:"증산 작용은 식물체 안의 물이 수증기로 빠져나가는 현상이에요.",
        hint:"식물이 물을 밖으로 내보내는 작용이에요."
      },
      {
        ctx: "초록 잎이 빛을 받아 반짝이고 있다.",
        lead_sp:"teacher", lead:"잎이 초록색인 건 이 색소 때문이에요. 이름이 뭔지 알아요?",
        prompt:"광합성이 주로 일어나는 초록색 색소는?",
        opts:["엽록소","페놀프탈레인","리트머스","BTB"], ans:0,
        exp:"엽록소는 빛에너지를 흡수해 광합성이 일어나게 도와요.",
        hint:"잎을 초록색으로 보이게 하는 색소예요."
      },
      {
        ctx: "줄기가 굵고 튼튼한 나무 옆에 섰다.",
        lead_sp:"partner", lead:"선배, 줄기가 하는 역할이 정확히 뭐예요?",
        prompt:"줄기의 기능으로 알맞은 것은?",
        opts:["식물체를 지탱하고 물질 이동 통로가 된다","항상 꽃만 만든다","빛을 차단한다","흙을 산성으로 만든다"], ans:0,
        exp:"줄기는 식물체를 지탱하고 물과 양분이 이동하는 통로 역할을 해요.",
        hint:"줄기는 식물의 몸을 세워주고 연결해줘요."
      },
      {
        ctx: "형형색색의 꽃들이 피어 있는 구역에 도착했다.",
        lead_sp:"partner", lead:"선배, 꽃이 이렇게 예쁜 게 그냥 보기 좋으려는 건 아니죠?",
        prompt:"꽃의 주된 기능으로 알맞은 것은?",
        opts:["번식","속력 증가","중화","공전"], ans:0,
        exp:"꽃은 씨를 만들어 식물이 번식하는 데 중요한 역할을 해요.",
        hint:"꽃이 핀 뒤 열매와 씨가 생길 수 있어요."
      },
      {
        ctx: "나비가 꽃 사이를 날아다니고 있다.",
        lead_sp:"teacher", lead:"꽃잎이 화려한 색과 향을 가진 게 곤충과 관련 있어요. 이유가 뭘까요?",
        prompt:"꽃잎이 곤충을 끌어들이는 데 도움을 주는 까닭은?",
        opts:["수분을 돕기 위해서","속력을 줄이기 위해서","pH를 높이기 위해서","밤낮을 만들기 위해서"], ans:0,
        exp:"꽃잎의 색과 향은 곤충을 끌어들여 수분을 돕는 경우가 많아요.",
        hint:"곤충이 꽃가루를 옮기는 과정을 떠올려봐요."
      },
      {
        ctx: "씨앗 표본 전시판을 살펴보고 있다.",
        lead_sp:"partner", lead:"선배, 씨는 어느 부분에서 생겨요?",
        prompt:"수정 후 씨가 되는 부분은?",
        opts:["밑씨","꽃잎","잎맥","기공"], ans:0,
        exp:"수정 후 밑씨는 씨가 되고 씨방은 열매가 돼요.",
        hint:"이름에 '씨'가 들어 있어요."
      },
      {
        ctx: "넓은 잎을 가진 열대 식물 앞에서 마지막 퀴즈를 냈다.",
        lead_sp:"partner", lead:"마지막 문제예요, 선배! 저 잎이 넓은 게 광합성에 유리한 이유가 뭐예요?",
        prompt:"잎이 넓게 펼쳐진 구조가 광합성에 유리한 까닭은?",
        opts:["빛을 많이 받을 수 있어서","뿌리가 없어져서","속력이 커져서","산성이 강해져서"], ans:0,
        exp:"잎이 넓으면 빛을 더 많이 받아 광합성에 유리해요.",
        hint:"광합성에는 빛이 필요해요."
      },
    ],
    outro: [
      { sp:"partner",       tx:"선배, 기념사진 같이 찍어요!" },
      { sp:"teacher",       tx:"오늘만 두 번째 지는 것 같은데... 찍어요." },
      { sp:"partner_think", tx:"선배 옆에 서니까 키 차이가 딱 좋다. 어, 이상한 생각하지 말자." },
      { sp:"teacher",       tx:"마지막 장소로 가볼까요? 해 지기 전에 천문대 가보고 싶은데." },
      { sp:"partner",       tx:"밤하늘 보고 싶었어요! 빨리 가요, 선배!" },
    ]
  },

  /* ══════════ 4단원 · 천문대 ══════════ */
  {
    id: "earth", unit: "4단원 · 지구의 운동", place: "천문대", scene: "obs",
    story: [
      { sp:"narr",          tx:"해가 지고, 두 사람은 마지막 데이트 장소인 천문대에 도착했다. 별이 하나둘 떠오르고 있었다." },
      { sp:"partner",       tx:"선배, 별 진짜 많다! 이렇게 많은 줄 몰랐어요." },
      { sp:"teacher",       tx:"도심에서 벗어나니 다르네요. 저 빛들 중에는 이미 사라진 별도 있을 거예요." },
      { sp:"partner_think", tx:"선배 목소리가 낮고 차분해진다. 좋아. 이 순간이 좋아." },
      { sp:"partner",       tx:"선배, 밤하늘 보니까 지구가 움직인다는 게 더 신기하게 느껴져요." },
      { sp:"teacher",       tx:"우리가 서 있는 이 자리도 지금 이 순간 엄청난 속도로 돌고 있어요." },
      { sp:"partner",       tx:"마지막 퀴즈도 여기서 내볼게요, 선배. 다 맞히면… 오늘 어때요?" },
      { sp:"teacher_think", tx:"'오늘 어때요'가 무슨 뜻인지, 물어봐도 될까. 아니, 나중에." },
      { sp:"teacher",       tx:"좋아요, 받아볼게요. 차근차근 풀어봅시다." },
    ],
    qs: [
      {
        ctx: "망원경으로 하늘을 관찰하는 사람들을 지켜보고 있다.",
        lead_sp:"partner", lead:"선배, 낮과 밤이 왜 생기는 거예요?",
        prompt:"낮과 밤이 생기는 주된 까닭은?",
        opts:["지구의 자전","지구의 공전","달의 공전만","별의 이동"], ans:0,
        exp:"지구가 하루에 한 바퀴씩 자전하기 때문에 낮과 밤이 생겨요.",
        hint:"하루 주기로 반복되는 현상을 생각해봐요."
      },
      {
        ctx: "천문대 내부 시계를 보며 이야기를 나눴다.",
        lead_sp:"teacher", lead:"지구가 한 바퀴 자전하는 데 시간이 얼마나 걸려요?",
        prompt:"지구가 한 바퀴 자전하는 데 걸리는 시간은 약 얼마일까요?",
        opts:["24시간","1개월","1년","10년"], ans:0,
        exp:"지구의 자전 주기는 약 24시간이에요.",
        hint:"하루의 길이와 관련 있어요."
      },
      {
        ctx: "태양계 모형이 전시돼 있는 전시관에 들어갔다.",
        lead_sp:"partner", lead:"선배, 지구가 태양 주위를 도는 운동 이름이 뭐예요?",
        prompt:"지구가 태양 주위를 도는 운동은?",
        opts:["공전","자전","중화","증산"], ans:0,
        exp:"지구가 태양 주위를 도는 운동을 공전이라고 해요.",
        hint:"태양을 중심으로 한 바퀴 도는 운동이에요."
      },
      {
        ctx: "공전 주기 안내판을 함께 읽었다.",
        lead_sp:"partner", lead:"선배, 지구가 태양 주위를 한 바퀴 도는 데 얼마나 걸려요?",
        prompt:"지구가 태양 주위를 한 바퀴 공전하는 데 걸리는 시간은?",
        opts:["약 1년","약 하루","약 1시간","약 7일"], ans:0,
        exp:"지구의 공전 주기는 약 1년이에요.",
        hint:"계절이 다시 돌아오는 데 걸리는 시간이에요."
      },
      {
        ctx: "계절 변화 설명 패널 앞에 섰다.",
        lead_sp:"teacher", lead:"계절이 변하는 이유가 뭔지 알아요?",
        prompt:"계절 변화가 생기는 중요한 까닭은?",
        opts:["지구 자전축이 기울어진 채 공전하기 때문","태양이 지구 주위를 돌기 때문","달이 빛을 내기 때문","별이 떨어지기 때문"], ans:0,
        exp:"지구의 자전축이 기울어진 채 공전하면서 태양 고도와 낮의 길이가 달라져 계절이 변해요.",
        hint:"자전축의 기울기와 공전을 함께 생각해봐요."
      },
      {
        ctx: "태양 일주 운동 다이어그램이 벽에 그려져 있다.",
        lead_sp:"partner", lead:"선배, 태양이 동쪽에서 서쪽으로 움직이는 것처럼 보이는 이유가 뭐예요?",
        prompt:"태양이 동쪽에서 서쪽으로 움직이는 것처럼 보이는 까닭은?",
        opts:["지구가 서쪽에서 동쪽으로 자전하기 때문","태양이 실제로 지구를 돌기 때문","달이 태양을 밀기 때문","별이 회전하기 때문"], ans:0,
        exp:"지구가 서쪽에서 동쪽으로 자전하므로 태양은 동쪽에서 서쪽으로 움직이는 것처럼 보여요.",
        hint:"우리가 움직이면 바깥 풍경이 반대로 보여요."
      },
      {
        ctx: "망원경으로 별들을 관찰했다.",
        lead_sp:"partner", lead:"선배, 저 별들도 하루 동안 움직이는 것처럼 보이죠? 그 이유가 뭐예요?",
        prompt:"밤하늘의 별이 하루 동안 움직이는 것처럼 보이는 까닭은?",
        opts:["지구의 자전","식물의 증산","산과 염기의 반응","물체의 속력"], ans:0,
        exp:"별의 일주 운동은 지구의 자전 때문에 나타나는 겉보기 운동이에요.",
        hint:"하루 동안 나타나는 천체의 겉보기 운동이에요."
      },
      {
        ctx: "여름 별자리가 소개된 패널 앞에 섰다.",
        lead_sp:"teacher", lead:"우리나라에서 태양이 가장 높이 뜨는 계절이 언제인지 알아요?",
        prompt:"우리나라에서 태양의 남중 고도가 가장 높은 계절은?",
        opts:["여름","겨울","가을","봄"], ans:0,
        exp:"우리나라에서는 여름에 태양의 남중 고도가 가장 높아요.",
        hint:"한낮의 태양이 가장 높고 뜨거운 계절이에요."
      },
      {
        ctx: "겨울 별자리 사진을 보며 이야기를 나눴다.",
        lead_sp:"partner", lead:"선배, 겨울에는 낮이 짧잖아요. 왜 그런 거예요?",
        prompt:"우리나라에서 겨울에 나타나는 특징으로 알맞은 것은?",
        opts:["낮의 길이가 짧다","태양의 남중 고도가 가장 높다","항상 밤이 없다","공전하지 않는다"], ans:0,
        exp:"우리나라의 겨울에는 낮의 길이가 짧고 태양의 남중 고도가 낮아요.",
        hint:"겨울에는 해가 빨리 지는 느낌을 떠올려봐요."
      },
      {
        ctx: "계절별 별자리 지도를 함께 들여다봤다.",
        lead_sp:"teacher", lead:"계절마다 보이는 별자리가 달라지는 건 왜인지 알아요?",
        prompt:"계절에 따라 보이는 별자리가 달라지는 주된 까닭은?",
        opts:["지구의 공전","비누물의 염기성","식물의 광합성","물체의 마찰"], ans:0,
        exp:"지구가 공전하면서 밤에 보이는 방향이 달라져 계절별 별자리가 달라져요.",
        hint:"1년 동안 지구의 위치가 바뀌는 운동이에요."
      },
      {
        ctx: "북쪽 하늘을 가리키는 표지판이 있다.",
        lead_sp:"partner", lead:"선배, 방향 찾을 때 북쪽 하늘에서 기준이 되는 별이 있잖아요. 이름이 뭐예요?",
        prompt:"북쪽 하늘에서 방향을 찾는 데 도움을 주는 별은?",
        opts:["북극성","태양","금성","화성"], ans:0,
        exp:"북극성은 북쪽 하늘에 거의 고정되어 보이므로 방향을 찾는 데 도움을 줘요.",
        hint:"이름에 북쪽 방향이 들어 있어요."
      },
      {
        ctx: "춘분·추분 달력 안내판을 발견했다.",
        lead_sp:"teacher", lead:"춘분과 추분 무렵에 낮과 밤 길이가 어떤지 알아요?",
        prompt:"춘분과 추분 무렵의 낮과 밤 길이는 보통 어떨까요?",
        opts:["비슷하다","낮만 있다","밤만 있다","계절과 상관없다"], ans:0,
        exp:"춘분과 추분 무렵에는 낮과 밤의 길이가 비슷해요.",
        hint:"분이라는 말은 낮과 밤이 나뉘는 균형을 떠올리게 해요."
      },
      {
        ctx: "태양 에너지 설명 그래프를 함께 보고 있다.",
        lead_sp:"partner", lead:"선배, 태양 고도가 높을수록 에너지를 더 많이 받는 거죠?",
        prompt:"태양의 남중 고도가 높을수록 지표면이 받는 태양 에너지는 어떻게 될까요?",
        opts:["많아진다","항상 0이 된다","줄어들기만 한다","색만 변한다"], ans:0,
        exp:"태양의 남중 고도가 높을수록 같은 면적이 받는 태양 에너지가 많아져요.",
        hint:"태양빛이 더 수직에 가깝게 비치는 경우를 생각해봐요."
      },
      {
        ctx: "달력에 윤년 표시가 있다.",
        lead_sp:"teacher", lead:"윤년이 왜 있는지 알아요? 1년이 정확히 365일이 아니거든요.",
        prompt:"1년이 정확히 365일보다 조금 길어서 보정하는 해를 무엇이라고 할까요?",
        opts:["윤년","중성","등속","증산"], ans:0,
        exp:"지구의 공전 주기는 약 365.25일이라 날짜를 맞추기 위해 윤년을 둬요.",
        hint:"2월이 하루 늘어나는 해를 떠올려봐요."
      },
      {
        ctx: "별빛 아래 천문대 앞 광장에 나왔다. 마지막 문제다.",
        lead_sp:"partner", lead:"마지막 문제예요, 선배! 지구 자전축 기울기가 얼마예요?",
        prompt:"지구의 자전축이 기울어진 정도는 약 얼마로 알려져 있을까요?",
        opts:["약 23.5도","0도","90도","180도"], ans:0,
        exp:"지구의 자전축은 공전 궤도면에 수직인 방향에서 약 23.5도 기울어져 있어요.",
        hint:"계절 변화 설명에서 자주 함께 나오는 각도예요."
      },
    ],
    outro: [
      { sp:"teacher",       tx:"오늘 함께 문제를 풀면서 알았어요. 제가 보여주고 싶었던 건 정답만이 아니라, 같이 궁금해하는 시간이었어요." },
      { sp:"partner_think", tx:"가슴이 두근거린다. 이게 설레는 건가. 아마 맞는 것 같다." },
      { sp:"partner",       tx:"저도요, 선배. 똑똑한 사람도 좋지만, 이야기할 때 눈이 반짝이는 사람이 더 좋아요." },
      { sp:"teacher_think", tx:"지금 나 말하는 거지. 아닐 수도 있다. 물어봐야겠다." },
      { sp:"partner",       tx:"선배, 다음에도 이렇게 걸으면서 이야기해요." },
      { sp:"teacher",       tx:"네. 꼭 그렇게 해요." },
    ]
  },
];

/* ────────────────────────────────────────
   6. 이벤트 빌드
──────────────────────────────────────── */
function buildEvents() {
  const evts = [];

  // 전체 프롤로그
  evts.push({ type:"dlg", unit:"프롤로그", place:"카페 앞", scene:"cafe",
    speaker:"teacher_think", text:"오늘은 꼭, 과학 지식으로만 끝나지 않는 데이트를 만들어야 한다." });
  evts.push({ type:"dlg", unit:"프롤로그", place:"카페 앞", scene:"cafe",
    speaker:"partner", text:"선배! 오늘 데이트 엄청 기대했어요. 질문도 잔뜩 준비했거든요!" });

  UNITS.forEach((unit, ui) => {
    const unitLabel = unit.unit;
    const place = unit.place;
    const scene = unit.scene;

    // 스토리 대사
    unit.story.forEach(line => {
      evts.push({ type:"dlg", unit:unitLabel, place, scene, speaker:line.sp, text:line.tx });
    });

    // 질문
    unit.qs.forEach((q, qi) => {
      // 상황 설명 (나레이션)
      evts.push({ type:"dlg", unit:unitLabel, place, scene, speaker:"narr", text:q.ctx });
      // 리드 대사
      evts.push({ type:"dlg", unit:unitLabel, place, scene, speaker:q.lead_sp, text:q.lead });
      // 퀴즈 이벤트
      evts.push({
        type:"quiz", unit:unitLabel, place, scene,
        unitQ: qi+1,
        prompt: q.prompt,
        opts:   q.opts,
        ans:    q.ans,
        exp:    q.exp,
        hint:   q.hint,
      });
    });

    // 아웃트로
    unit.outro.forEach(line => {
      evts.push({ type:"dlg", unit:unitLabel, place, scene, speaker:line.sp, text:line.tx });
    });
  });

  return evts;
}

const EVENTS  = buildEvents();
const TOTAL_Q = UNITS.reduce((s, u) => s + u.qs.length, 0);

/* ────────────────────────────────────────
   7. 상태
──────────────────────────────────────── */
const S = { idx:0, correct:0, answered:false, waiting:false };

/* ────────────────────────────────────────
   8. DOM 참조
──────────────────────────────────────── */
const $ = id => document.getElementById(id);
const EL = {
  unitText:     $("unitText"),
  questionText: $("questionText"),
  placeText:    $("placeText"),
  heartFill:    $("heartFill"),
  affText:      $("affectionText"),
  speakerBadge: $("speakerName"),
  modeBadge:    $("modeText"),
  qCounter:     $("qCounter"),
  dlgText:      $("dialogueText"),
  ansGrid:      $("answerGrid"),
  feedback:     $("feedbackText"),
  nextBtn:      $("nextButton"),
  resetBtn:     $("resetButton"),
  ending:       $("ending"),
  endingBtn:    $("endingRestartButton"),
};

/* ────────────────────────────────────────
   9. 화자 설정
──────────────────────────────────────── */
function speakerCfg(speaker) {
  switch (speaker) {
    case "teacher":       return { label:"과학쌤",     mode:"대화",    cls:"",      textCls:"",          active:"teacher" };
    case "teacher_think": return { label:"과학쌤 💭",   mode:"생각",    cls:"think", textCls:"thinking",  active:"teacher" };
    case "partner":       return { label:"썸녀",       mode:"대화",    cls:"",      textCls:"",          active:"partner" };
    case "partner_think": return { label:"썸녀 💭",     mode:"생각",    cls:"think", textCls:"thinking",  active:"partner" };
    case "narr":          return { label:"✦ 상황",     mode:"나레이션", cls:"move",  textCls:"narr",      active:"none" };
    default:              return { label:speaker,     mode:"대화",    cls:"",      textCls:"",          active:"none" };
  }
}

/* ────────────────────────────────────────
   10. 렌더
──────────────────────────────────────── */
function render() {
  const ev = EVENTS[S.idx];
  S.waiting  = ev.type === "quiz";
  S.answered = false;

  EL.unitText.textContent  = ev.unit  || "";
  EL.placeText.textContent = ev.place || "";
  EL.feedback.textContent  = "";
  EL.ansGrid.innerHTML     = "";
  EL.ansGrid.classList.add("hidden");
  EL.qCounter.classList.add("hidden");
  EL.nextBtn.classList.remove("hidden");

  drawBG(ev.scene || "cafe");

  if (ev.type === "quiz") renderQuiz(ev);
  else                    renderDlg(ev);

  updateHud();
}

function renderDlg(ev) {
  const cfg = speakerCfg(ev.speaker);
  EL.speakerBadge.textContent = cfg.label;
  EL.modeBadge.textContent    = cfg.mode;
  EL.modeBadge.className      = "mode-badge " + cfg.cls;
  EL.dlgText.textContent      = ev.text;
  EL.dlgText.className        = "dlg-text " + cfg.textCls;
  EL.nextBtn.textContent      = S.idx >= EVENTS.length - 1 ? "엔딩 보기 ★" : "다음 ▶";
  drawChars(cfg.active);
}

function renderQuiz(ev) {
  EL.speakerBadge.textContent = "퀴즈 ❓";
  EL.modeBadge.textContent    = "문제";
  EL.modeBadge.className      = "mode-badge quiz";
  EL.qCounter.textContent     = `Q ${ev.unitQ} / 15`;
  EL.qCounter.classList.remove("hidden");
  EL.dlgText.textContent      = ev.prompt;
  EL.dlgText.className        = "dlg-text";
  EL.nextBtn.classList.add("hidden");
  EL.ansGrid.classList.remove("hidden");
  drawChars("none");   // 둘 다 일반 표시

  ev.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className   = "answer-btn";
    btn.type        = "button";
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAns(i));
    EL.ansGrid.appendChild(btn);
  });
}

function checkAns(sel) {
  const ev   = EVENTS[S.idx];
  const btns = [...EL.ansGrid.querySelectorAll(".answer-btn")];

  if (sel !== ev.ans) {
    btns[sel].classList.add("wrong");
    EL.feedback.textContent = `💡 힌트: ${ev.hint}`;
    return;
  }

  if (!S.answered) { S.correct++; S.answered = true; }
  S.waiting = false;

  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === ev.ans) b.classList.add("correct");
  });

  EL.speakerBadge.textContent = "썸녀";
  EL.modeBadge.textContent    = "정답 ✓";
  EL.modeBadge.className      = "mode-badge ok";
  EL.dlgText.textContent      = "정답이에요, 선배! 역시 대단해요.";
  EL.dlgText.className        = "dlg-text";
  EL.feedback.textContent     = `📚 ${ev.exp}`;
  EL.nextBtn.textContent      = S.idx >= EVENTS.length - 1 ? "엔딩 보기 ★" : "다음 ▶";
  EL.nextBtn.classList.remove("hidden");
  drawChars("partner");
  updateHud();
}

function goNext() {
  if (S.waiting) return;
  if (S.idx >= EVENTS.length - 1) { showEnding(); return; }
  S.idx++;
  render();
}

function updateHud() {
  const pct = Math.round((S.correct / TOTAL_Q) * 100);
  EL.heartFill.style.width  = pct + "%";
  EL.affText.textContent    = pct + "%";
  EL.questionText.textContent = `${S.correct} / ${TOTAL_Q}`;
}

/* ────────────────────────────────────────
   11. 엔딩
──────────────────────────────────────── */
function showEnding() {
  // 픽셀 하트 그리기
  const ec  = $("endingCanvas");
  const ectx= ec.getContext("2d");
  ectx.clearRect(0, 0, 120, 120);
  const heart = [
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
  ];
  heart.forEach((row, ry) => {
    row.forEach((cell, cx) => {
      if (cell) {
        ectx.fillStyle = cx < 5 ? "#E94560" : "#FF6B81";
        ectx.fillRect(cx * 12, ry * 12 + 16, 12, 12);
      }
    });
  });
  EL.ending.classList.remove("hidden");
}

function resetGame() {
  S.idx = 0; S.correct = 0; S.waiting = false; S.answered = false;
  EL.ending.classList.add("hidden");
  render();
}

/* ────────────────────────────────────────
   12. 이벤트 바인딩 & 초기화
──────────────────────────────────────── */
EL.nextBtn.addEventListener("click",  goNext);
EL.resetBtn.addEventListener("click", resetGame);
EL.endingBtn.addEventListener("click", resetGame);

render();  // 시작!
