"use strict";
/* ═══════════════════════════════════════════════════════════════════
   과학쌤의 연애세포 되살리기 프로젝트 – script.js
   캔버스: 960 × 540 px  /  배경 픽셀: 6 px  /  캐릭터 픽셀: 1 px
   배경 그리드: 160 열(W) × 90 행(H)
   캐릭터: 선생님(데이트룩·단발 갈색)  썸녀(긴머리·핑크)
   ─ 비활성 캐릭터도 투명 처리 없음 (항상 100% 불투명)
   ─ 썸녀는 선생님을 '선배'라고 부름
   ─ 생각 대사 💭 별도 표시
   ─ 데이트 일상 속에서 자연스럽게 퀴즈 진행
   ═══════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────
   1. 캔버스 & 픽셀 설정
──────────────────────────────────────── */
const PX = 6;            // 배경 1픽셀 = 6 CSS px
const CPX = 1;           // 캐릭터 1픽셀 = 1 CSS px
const CW = 960, CH = 540;
const W  = CW / PX;      // 160 열
const H  = CH / PX;      // 90 행
const CHR_H = Math.floor(CH / CPX);

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

/** 캐릭터 전용 작은 픽셀 단위로 사각형 채우기 */
function cpx(ctx, x, y, color, w = 1, h = 1) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * CPX, y * CPX, w * CPX, h * CPX);
}

/* ────────────────────────────────────────
   2. 팔레트
──────────────────────────────────────── */
const P = {
  /* 공통 */
  sky_day:   "#9fd7e8",
  sky_eve:   "#f5b28b",
  sky_night: "#24335f",
  cloud:     "#fff8df",
  sun:       "#ffd86b",
  moon:      "#fff6bf",
  star:      "#ffe58a",
  ground:    "#8bbd68",
  grass:     "#8fd16f",
  grass2:    "#6fb75d",
  path:      "#d9b883",
  path2:     "#c89f67",
  flowerA:   "#f5859b",
  flowerB:   "#ffd36c",
  flowerC:   "#87c9ff",
  leaf:      "#4f9c56",
  leaf2:     "#6fbb69",
  trunk:     "#8c6541",
  /* 건물 */
  cafe_sky:  "#a9dbea",
  cafe_wall: "#f2c879",
  cafe_roof: "#a9683d",
  cafe_win:  "#85cde2",
  cafe_door: "#7b5138",
  wood:      "#b9824f",
  sign:      "#fff2bc",
  /* 공원 */
  tree1:     "#4b9d58",
  tree2:     "#6cbb63",
  bench:     "#b77a4a",
  water:     "#69c5d9",
  water2:    "#a1e6ef",
  /* 식물원 */
  glass:     "#c8f1ec",
  frame:     "#5fae8c",
  plant1:    "#68c46f",
  plant2:    "#3f9d5d",
  pot:       "#b6784e",
  /* 천문대 */
  obs_wall:  "#7a8fb0",
  obs_dome:  "#d3dae8",
  obs_slit:  "#24335f",
  scope:     "#8ca0b9",
  /* 캐릭터 – 선생님 */
  T_hair:    "#5a3d2d",
  T_skin:    "#f7bd91",
  T_shirt:   "#74a9d8",
  T_pants:   "#49606f",
  T_shoes:   "#4c3b31",
  T_collar:  "#fff8df",
  /* 캐릭터 – 썸녀 */
  G_hair:    "#6a432d",
  G_skin:    "#f7bd91",
  G_top:     "#f38aa2",
  G_skirt:   "#d85f84",
  G_shoes:   "#ef7cb0",
  G_blush:   "#f6a7a7",
  /* 공통 – 아이 */
  eye:       "#3b302a",
  mouth:     "#c45b5b",
  ink:       "#4f3b30",
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
  for (let y = 0; y < 48; y++) px(bg, 0, y, P.cafe_sky, W);
  px(bg, 0, 46, "#bfe9d1", W, 7);
  px(bg, 0, 52, P.grass, W, H - 52);
  px(bg, 66, 50, P.path, 28, H - 50);
  px(bg, 61, 70, P.path, 38, H - 70);
  px(bg, 69, 56, P.path2, 22, 5);
  px(bg, 64, 78, P.path2, 32, 5);

  drawCloud(8, 8);
  drawCloud(110, 8);
  drawCloud(130, 18);
  px(bg, 141, 8, P.sun, 11, 11);

  drawRoundTree(9, 47);
  drawRoundTree(23, 50);
  drawRoundTree(128, 47);
  drawRoundTree(143, 51);
  drawFlowerPatch(9, 73);
  drawFlowerPatch(22, 75);
  drawFlowerPatch(133, 74);

  // 작은 목조 카페
  px(bg, 60, 27, P.cafe_roof, 40, 7);
  px(bg, 55, 32, P.cafe_roof, 52, 5);
  px(bg, 61, 37, P.cafe_wall, 39, 34);
  px(bg, 61, 37, "#f7d999", 39, 4);
  px(bg, 67, 44, P.cafe_win, 9, 9);
  px(bg, 87, 44, P.cafe_win, 9, 9);
  px(bg, 79, 52, P.cafe_door, 9, 19);
  px(bg, 63, 64, "#d3a860", 34, 7);
  px(bg, 68, 71, "#c89f67", 23, 7);
  px(bg, 70, 29, P.sign, 18, 6);
  px(bg, 75, 30, "#8b5e3c", 9, 3);
}

/* ── 공원 ── */
function drawPark() {
  for (let y = 0; y < 43; y++) px(bg, 0, y, P.sky_day, W);
  px(bg, 0, 42, "#c9ecbe", W, 8);
  px(bg, 0, 50, P.grass, W, H - 50);
  px(bg, 0, 61, P.water, W, 9);
  px(bg, 0, 64, P.water2, W, 2);
  px(bg, 49, 50, P.path, 24, 12);
  px(bg, 61, 61, P.path, 22, 29);

  drawCloud(9, 8);
  drawCloud(72, 5);
  px(bg, 143, 7, P.sun, 11, 11);

  drawRoundTree(3, 43);
  drawRoundTree(35, 39);
  drawRoundTree(121, 42);
  drawRoundTree(144, 45);
  drawFlowerPatch(7, 77);
  drawFlowerPatch(126, 77);

  px(bg, 112, 52, P.bench, 24, 4);
  px(bg, 111, 57, "#8e5d3b", 26, 4);
  px(bg, 116, 61, P.trunk, 3, 11);
  px(bg, 130, 61, P.trunk, 3, 11);
  px(bg, 113, 49, "#d99b5f", 22, 3);
}

/* ── 식물원 (온실) ── */
function drawGarden() {
  for (let y = 0; y < 42; y++) px(bg, 0, y, "#b9e6dc", W);
  px(bg, 0, 42, "#d6f0cf", W, 9);
  px(bg, 0, 51, P.grass2, W, H - 51);
  px(bg, 65, 62, P.path, 30, H - 62);

  // 큰 온실
  px(bg, 28, 19, P.frame, 104, 5);
  px(bg, 24, 24, P.frame, 112, 31);
  px(bg, 28, 24, P.glass, 104, 27);
  px(bg, 42, 24, P.frame, 3, 31);
  px(bg, 62, 24, P.frame, 3, 31);
  px(bg, 82, 24, P.frame, 3, 31);
  px(bg, 102, 24, P.frame, 3, 31);
  px(bg, 68, 42, P.frame, 24, 16);
  px(bg, 72, 42, "#def8f3", 16, 16);
  px(bg, 32, 28, "#e6fbf6", 20, 9);
  px(bg, 108, 28, "#e6fbf6", 18, 9);

  [9, 139].forEach((x) => drawRoundTree(x, 47));
  [
    [14, 71, P.plant1, P.flowerA],
    [26, 73, P.plant2, P.flowerB],
    [116, 72, P.plant1, P.flowerC],
    [130, 73, P.plant2, P.flowerA],
  ].forEach(([x, y, leaf, flower]) => {
    px(bg, x, y + 8, P.pot, 9, 5);
    px(bg, x + 1, y + 1, leaf, 7, 8);
    px(bg, x + 3, y, flower, 3, 3);
  });
  drawFlowerPatch(8, 80);
  drawFlowerPatch(134, 80);
}

/* ── 천문대 ── */
function drawObs() {
  for (let y = 0; y < 57; y++) px(bg, 0, y, P.sky_night, W);
  px(bg, 0, 57, "#51658f", W, 7);
  px(bg, 0, 64, "#405073", W, H - 64);
  const stars = [
    [5,6],[18,11],[31,7],[45,15],[58,8],[72,13],[86,6],[101,12],[116,7],[132,14],[149,8],
    [10,26],[25,20],[38,30],[54,24],[69,33],[82,22],[97,29],[112,23],[129,31],[144,25],
    [7,42],[29,39],[50,43],[92,41],[122,44],[151,39],
  ];
  stars.forEach(([x, y], i) => px(bg, x, y, P.star, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1));
  px(bg, 139, 8, P.moon, 13, 13);
  px(bg, 146, 8, P.sky_night, 7, 7);

  px(bg, 48, 47, P.obs_wall, 58, 21);
  px(bg, 56, 31, P.obs_dome, 42, 19);
  px(bg, 64, 26, P.obs_dome, 26, 9);
  px(bg, 73, 26, P.obs_slit, 7, 23);
  px(bg, 58, 55, "#a4c8db", 12, 8);
  px(bg, 86, 55, "#a4c8db", 12, 8);
  px(bg, 74, 60, P.cafe_door, 9, 8);
  px(bg, 102, 40, P.scope, 24, 4);
  px(bg, 123, 35, P.scope, 8, 4);
  drawPine(7, 64);
  drawPine(134, 64);
}

function drawCloud(x, y) {
  px(bg, x + 4, y + 2, P.cloud, 15, 5);
  px(bg, x, y + 5, P.cloud, 25, 5);
  px(bg, x + 8, y, P.cloud, 10, 3);
  px(bg, x + 21, y + 6, P.cloud, 8, 3);
}

function drawRoundTree(x, y) {
  px(bg, x + 8, y + 14, P.trunk, 5, 20);
  px(bg, x + 1, y + 3, P.leaf, 19, 13);
  px(bg, x + 5, y, P.leaf2, 12, 7);
  px(bg, x, y + 11, P.tree1, 22, 12);
  px(bg, x + 5, y + 19, P.tree2, 12, 8);
}

function drawPine(x, y) {
  px(bg, x + 8, y + 14, P.trunk, 5, 17);
  px(bg, x + 7, y, P.tree1, 7, 9);
  px(bg, x + 4, y + 8, P.tree2, 13, 9);
  px(bg, x + 1, y + 17, P.tree1, 19, 8);
  px(bg, x + 5, y + 25, P.tree2, 11, 5);
}

function drawFlowerPatch(x, y) {
  px(bg, x, y, P.flowerA, 3, 3);
  px(bg, x + 7, y + 2, P.flowerB, 3, 3);
  px(bg, x + 14, y, P.flowerC, 3, 3);
  px(bg, x + 3, y + 5, P.leaf, 5, 3);
  px(bg, x + 10, y + 5, P.leaf2, 5, 3);
}

/* ────────────────────────────────────────
   4. 캐릭터 그리기 (투명 처리 없음)
──────────────────────────────────────── */
function drawChars(active) {
  ch.clearRect(0, 0, CW, CH);
  drawTeacher(170, CHR_H - 36, active === "teacher");    // 왼쪽
  drawPartner(620, CHR_H - 36, active === "partner");    // 오른쪽
}

function charRect(ctx, x, y, w, h, color) {
  cpx(ctx, Math.round(x), Math.round(y), color, Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

function pixelOval(ctx, cx, cy, rx, ry, color, row = 2) {
  for (let y = -ry; y <= ry; y += row) {
    const half = Math.max(1, Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))));
    charRect(ctx, cx - half, cy + y, half * 2, row, color);
  }
}

function cuteEye(ctx, cx, cy, rx = 7, ry = 10) {
  pixelOval(ctx, cx, cy, rx, ry, P.eye, 1);
  charRect(ctx, cx - rx + 3, cy - ry + 4, 3, 4, "#fff8df");
  charRect(ctx, cx + rx - 3, cy + ry - 4, 2, 2, "#241b18");
}

function cuteNose(ctx, cx, cy) {
  charRect(ctx, cx - 1, cy, 3, 5, "#e99f82");
  charRect(ctx, cx - 3, cy + 5, 6, 2, "#efb18f");
}

function cuteSmile(ctx, cx, cy, width = 20) {
  charRect(ctx, cx - width / 2, cy, width, 3, P.mouth);
  charRect(ctx, cx - width / 2 + 5, cy + 3, width - 10, 2, "#ffd9c9");
}

function cuteBlush(ctx, cx, cy, width = 18, color = "#eca09b") {
  charRect(ctx, cx - width / 2, cy, width, 4, color);
}

/* 활성 캐릭터는 살짝 위로 올려서 강조 (투명 처리 없음) */
function drawTeacher(bx, by, active) {
  const oy = active ? -8 : 0;
  const B  = by + oy;
  const r = (x, y, w, h, color) => charRect(ch, bx + x, B + y, w, h, color);
  const oval = (x, y, rx, ry, color, row = 2) => pixelOval(ch, bx + x, B + y, rx, ry, color, row);

  oval(92, -6, 78, 8, "rgba(80, 65, 45, .22)", 2);

  // 다리와 신발
  r(50, -86, 30, 76, P.ink);
  r(103, -86, 30, 76, P.ink);
  r(56, -86, 20, 70, P.T_pants);
  r(109, -86, 20, 70, P.T_pants);
  r(39, -18, 47, 16, P.T_shoes);
  r(96, -18, 47, 16, P.T_shoes);
  r(43, -22, 38, 5, "#2f2723");
  r(100, -22, 38, 5, "#2f2723");

  // 몸통과 팔
  r(75, -179, 34, 22, P.T_skin);
  r(38, -165, 106, 82, P.ink);
  r(45, -160, 92, 78, P.T_shirt);
  r(45, -160, 27, 78, "#5e95c8");
  r(110, -160, 27, 78, "#5e95c8");
  r(74, -159, 14, 78, "#3d7fac");
  r(90, -159, 10, 78, "#4c8dc2");
  r(52, -162, 28, 15, P.T_collar);
  r(102, -162, 28, 15, P.T_collar);
  r(24, -152, 30, 71, P.ink);
  r(132, -152, 30, 71, P.ink);
  r(29, -146, 22, 61, P.T_shirt);
  r(134, -146, 22, 61, P.T_shirt);
  r(28, -88, 23, 18, P.T_skin);
  r(134, -88, 23, 18, P.T_skin);

  // 머리와 얼굴: 얼굴 길이를 줄이고 동그란 인상이 먼저 보이도록 정리
  oval(92, -250, 68, 60, "#3f2b22", 2);
  oval(92, -240, 58, 48, P.T_skin, 2);
  r(37, -238, 12, 25, P.T_skin);
  r(136, -238, 12, 25, P.T_skin);
  r(36, -293, 111, 23, P.T_hair);
  r(29, -274, 126, 25, P.T_hair);
  r(32, -253, 33, 39, P.T_hair);
  r(125, -253, 29, 38, P.T_hair);
  r(56, -264, 31, 19, "#704e39");
  r(84, -268, 33, 19, P.T_hair);
  r(110, -261, 31, 22, P.T_hair);
  r(43, -215, 15, 5, "#eba184");
  r(127, -215, 15, 5, "#eba184");

  // 표정과 안경: 검은 막대를 줄이고 눈 위치를 얼굴 중앙으로 정렬
  r(56, -241, 31, 4, "#3f302a");
  r(101, -241, 31, 4, "#3f302a");
  r(54, -237, 35, 18, "#3f302a");
  r(99, -237, 35, 18, "#3f302a");
  r(59, -233, 25, 13, P.T_skin);
  r(104, -233, 25, 13, P.T_skin);
  r(88, -230, 12, 3, "#3f302a");
  cuteEye(ch, bx + 70, B - 227, 5, 7);
  cuteEye(ch, bx + 118, B - 227, 5, 7);
  cuteNose(ch, bx + 94, B - 219);
  cuteBlush(ch, bx + 57, B - 209, 15, "#eca09b");
  cuteBlush(ch, bx + 128, B - 209, 15, "#eca09b");
  cuteSmile(ch, bx + 92, B - 203, 18);

  _nameTag(ch, bx + 48, B - 332, "과학쌤");
}

function drawPartner(bx, by, active) {
  const oy = active ? -8 : 0;
  const B  = by + oy;
  const r = (x, y, w, h, color) => charRect(ch, bx + x, B + y, w, h, color);
  const oval = (x, y, rx, ry, color, row = 2) => pixelOval(ch, bx + x, B + y, rx, ry, color, row);

  oval(96, -5, 84, 8, "rgba(80, 65, 45, .22)", 2);

  // 다리, 신발, 원피스
  r(62, -84, 24, 72, P.ink);
  r(111, -84, 24, 72, P.ink);
  r(67, -84, 15, 67, P.G_skin);
  r(115, -84, 15, 67, P.G_skin);
  r(49, -18, 48, 16, P.G_shoes);
  r(102, -18, 48, 16, P.G_shoes);
  r(54, -22, 36, 5, "#b14a78");
  r(108, -22, 36, 5, "#b14a78");
  r(78, -184, 37, 24, P.G_skin);
  r(39, -164, 120, 86, P.ink);
  r(47, -159, 104, 74, P.G_top);
  r(42, -104, 114, 37, P.G_skirt);
  r(55, -155, 84, 12, "#ffc0cf");
  r(20, -150, 31, 74, P.ink);
  r(149, -150, 31, 74, P.ink);
  r(26, -144, 23, 61, P.G_top);
  r(151, -144, 23, 61, P.G_top);
  r(25, -84, 24, 18, P.G_skin);
  r(151, -84, 24, 18, P.G_skin);

  // 머리카락과 얼굴: 지저분한 겹침 없이 둥근 얼굴과 대칭 앞머리로 정리
  oval(98, -258, 76, 75, "#4f3326", 2);
  r(28, -255, 24, 88, P.G_hair);
  r(146, -255, 24, 88, P.G_hair);
  r(43, -181, 111, 28, P.G_hair);
  oval(98, -241, 59, 51, P.G_skin, 2);
  r(40, -236, 11, 28, P.G_skin);
  r(146, -236, 11, 28, P.G_skin);
  r(40, -299, 116, 27, P.G_hair);
  r(32, -276, 132, 29, P.G_hair);
  r(43, -259, 25, 42, P.G_hair);
  r(130, -259, 25, 42, P.G_hair);
  r(64, -271, 35, 22, "#7f5439");
  r(97, -274, 48, 23, P.G_hair);
  r(49, -214, 16, 5, "#f2a28f");
  r(131, -214, 16, 5, "#f2a28f");

  // 표정: 눈을 얼굴 안쪽으로 옮기고 입을 짧게 줄여 자연스럽게 보정
  r(66, -238, 14, 3, P.eye);
  r(116, -238, 14, 3, P.eye);
  cuteEye(ch, bx + 73, B - 226, 7, 11);
  cuteEye(ch, bx + 123, B - 226, 7, 11);
  cuteNose(ch, bx + 98, B - 216);
  cuteBlush(ch, bx + 60, B - 207, 20, P.G_blush);
  cuteBlush(ch, bx + 136, B - 207, 20, P.G_blush);
  cuteSmile(ch, bx + 99, B - 199, 20);
  r(82, -295, 22, 5, "#8a5b3d");

  _nameTag(ch, bx + 56, B - 336, "썸녀");
}

function _nameTag(ctx, bx, by, label) {
  ctx.fillStyle   = "#FFF8E7";
  ctx.strokeStyle = "#1A1A2E";
  ctx.lineWidth   = 2;
  const tw = label.length > 2 ? 98 : 70;
  const th = 26;
  const x = bx * CPX;
  const y = by * CPX;
  ctx.fillRect(x, y, tw, th);
  ctx.strokeRect(x, y, tw, th);
  ctx.fillStyle   = "#1A1A2E";
  ctx.font        = "bold 14px 'Noto Sans KR', monospace";
  ctx.textAlign   = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + tw / 2, y + th / 2);
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
