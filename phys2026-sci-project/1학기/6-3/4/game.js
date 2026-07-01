// ============================================================
//  커비의 과학 모험 - GAME.JS  (초특급 재미 요소 및 카피 어빌리티 추가 버전)
// ============================================================

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_W = 1024;
const CANVAS_H = 540;
const GROUND_Y = 460;   // y-position of the top of the ground
const GRAVITY  = 0.55;
const FRICTION = 0.82;
const WALK_SPD = 4.8;
const JUMP_F   = -12.5;
const FLY_THRUST = 0.88;
const FLY_MAX_RISE = -6.2;
const FLY_GRAVITY_SCALE = 0.45;

// World widths per mode
const WORLD_ADV   = 5200;
const WORLD_HUB   = 1024;
const WORLD_SPACE = 3000;

// ─── Colors (hex only – no CSS vars inside Canvas) ───
const C = {
  kirbyPink  : '#ff9bbb',
  kirbyDark  : '#ff4f82',
  acid       : '#9b27af',
  motion     : '#f59e0b',
  plants     : '#22c55e',
  earth      : '#3b82f6',
  bossDark   : '#1e0a2e',
  bossRed    : '#ef4444',
  cyan       : '#00e5ff',
  purple     : '#b300ff',
  slateWall  : '#334155',
};

// Screen Shake intensity
let shakeIntensity = 0;
function triggerShake(amt) {
  shakeIntensity = amt;
}

// ─── Audio ───
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime;

  if (type === 'jump') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(640, t + 0.14);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.14);
    osc.start(t); osc.stop(t + 0.15);
  } else if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, t); osc.frequency.setValueAtTime(659, t + 0.08);
    gain.gain.setValueAtTime(0.12, t); gain.gain.linearRampToValueAtTime(0, t + 0.3);
    osc.start(t); osc.stop(t + 0.32);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t); osc.frequency.linearRampToValueAtTime(80, t + 0.25);
    gain.gain.setValueAtTime(0.12, t); gain.gain.linearRampToValueAtTime(0, t + 0.25);
    osc.start(t); osc.stop(t + 0.26);
  } else if (type === 'teleport') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, t); osc.frequency.exponentialRampToValueAtTime(1400, t + 0.4);
    gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.start(t); osc.stop(t + 0.42);
  } else if (type === 'victory') {
    [261.6,329.6,392,523.3,659.3,784,1046.5].forEach((f,i) => {
      const s = audioCtx.createOscillator(), g = audioCtx.createGain();
      s.connect(g); g.connect(audioCtx.destination);
      s.type = 'triangle'; s.frequency.setValueAtTime(f, t + i * 0.08);
      g.gain.setValueAtTime(0.1, t + i * 0.08); g.gain.linearRampToValueAtTime(0, t + i * 0.08 + 0.2);
      s.start(t + i * 0.08); s.stop(t + i * 0.08 + 0.25);
    });
  } else if (type === 'gameover') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t); osc.frequency.linearRampToValueAtTime(50, t + 0.9);
    gain.gain.setValueAtTime(0.15, t); gain.gain.linearRampToValueAtTime(0, t + 0.9);
    osc.start(t); osc.stop(t + 0.92);
  } else if (type === 'inhale') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(450, t + 0.2);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
    osc.start(t); osc.stop(t + 0.2);
  } else if (type === 'spit') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.15);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.15);
    osc.start(t); osc.stop(t + 0.15);
  } else if (type === 'laser') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.1);
    osc.start(t); osc.stop(t + 0.1);
  }
}

// ============================================================
//  QUIZ DATABASE
// ============================================================
const questionsDatabase = [
  // Chapter 0 – 산과 염기
  [
    { type:'OX', question:'레몬즙은 산성 용액이다.',         answer:'O' },
    { type:'OX', question:'비눗물은 염기성 용액이다.',       answer:'O' },
    { type:'OX', question:'산성 용액은 푸른색 리트머스를 붉게 만든다.', answer:'O' },
    { type:'OX', question:'염기성 용액은 붉은색 리트머스를 푸르게 만든다.', answer:'O' },
    { type:'OX', question:'식초는 염기성 용액이다.',         answer:'X' },
    { type:'OX', question:'비눗물은 산성 용액이다.',         answer:'X' },
    { type:'OX', question:'지시약으로 산성·염기성을 구별할 수 있다.', answer:'O' },
    { type:'OX', question:'산성 용액은 단백질을 녹인다.',   answer:'O' },
    { type:'OX', question:'자주색 양배추 지시약을 사용할 수 있다.', answer:'O' },
    { type:'OX', question:'산성 용액은 모두 맛이 달다.',     answer:'X' },
    { type:'MC', question:'다음 중 산성 용액은?', options:['식초','비눗물','세제물','소금물'], answer:'식초' },
    { type:'MC', question:'다음 중 염기성 용액은?', options:['비눗물','레몬즙','식초','탄산음료'], answer:'비눗물' },
    { type:'MC', question:'산성 용액에서 푸른 리트머스는?', options:['붉게 변한다','그대로','검게 변한다','없어진다'], answer:'붉게 변한다' },
    { type:'MC', question:'산성과 염기성을 구별하는 물질은?', options:['지시약','자석','온도계','저울'], answer:'지시약' },
    { type:'MC', question:'식초의 성질은?', options:['산성','염기성','중성','기체'], answer:'산성' },
    { type:'MC', question:'비눗물의 성질은?', options:['염기성','산성','중성','알 수 없음'], answer:'염기성' },
    { type:'MC', question:'다음 중 산성 용액이 아닌 것은?', options:['비눗물','식초','레몬즙','탄산음료'], answer:'비눗물' },
    { type:'MC', question:'다음 중 염기성 용액이 아닌 것은?', options:['식초','비눗물','세제물','비누거품'], answer:'식초' },
  ],
  // Chapter 1 – 물체의 운동
  [
    { type:'OX', question:'물체의 위치가 시간에 따라 변하면 운동한다.',  answer:'O' },
    { type:'OX', question:'정지해 있는 물체는 운동하고 있다.',           answer:'X' },
    { type:'OX', question:'운동 설명 시 기준 물체가 필요하다.',          answer:'O' },
    { type:'OX', question:'속력 공식: 이동거리÷걸린시간이다.',           answer:'O' },
    { type:'OX', question:'시계추 움직임은 왕복 운동이다.',              answer:'O' },
    { type:'OX', question:'달리는 버스 안 사람은 버스 기준으로 정지해 있다.', answer:'O' },
    { type:'OX', question:'모든 운동하는 물체는 같은 속력이다.',         answer:'X' },
    { type:'OX', question:'회전목마는 회전 운동이다.',                   answer:'O' },
    { type:'MC', question:'물체의 위치가 변하는 것은?', options:['운동','광합성','증발','응결'], answer:'운동' },
    { type:'MC', question:'자동차가 곧은 길을 일정 방향으로 달리는 운동은?', options:['직선 운동','왕복 운동','회전 운동','진동 운동'], answer:'직선 운동' },
    { type:'MC', question:'바이킹처럼 왔다갔다 하는 운동은?', options:['왕복 운동','직선 운동','회전 운동','낙하 운동'], answer:'왕복 운동' },
    { type:'MC', question:'속력 공식은?', options:['이동거리÷걸린시간','이동거리×걸린시간','걸린시간÷이동거리','이동거리+걸린시간'], answer:'이동거리÷걸린시간' },
    { type:'MC', question:'10초에 100m를 달린 속력은?', options:['10 m/s','5 m/s','20 m/s','100 m/s'], answer:'10 m/s' },
    { type:'MC', question:'같은 시간에 가장 빠른 물체는?', options:['이동거리가 가장 긴 물체','이동거리가 가장 짧은 물체','무거운 물체','알 수 없다'], answer:'이동거리가 가장 긴 물체' },
    { type:'MC', question:'운동을 설명할 때 먼저 정하는 것은?', options:['기준 물체','날씨','온도','계절'], answer:'기준 물체' },
    { type:'MC', question:'운동하는 물체는 시간에 따라 무엇이 변하나?', options:['위치','색깔','모양','재질'], answer:'위치' },
    { type:'MC', question:'같은 거리일 때 가장 빠른 물체는?', options:['걸린 시간이 가장 짧은 물체','걸린 시간이 가장 긴 물체','가장 무거운 물체','알 수 없다'], answer:'걸린 시간이 가장 짧은 물체' },
    { type:'MC', question:'회전목마는 어떤 운동인가?', options:['회전 운동','직선 운동','왕복 운동','정지'], answer:'회전 운동' },
  ],
  // Chapter 2 – 식물의 구조와 기능
  [
    { type:'OX', question:'식물의 뿌리는 물과 양분을 흡수한다.',   answer:'O' },
    { type:'OX', question:'잎은 광합성을 하는 주요 기관이다.',     answer:'O' },
    { type:'OX', question:'줄기는 물과 양분을 이동시킨다.',        answer:'O' },
    { type:'OX', question:'식물은 햇빛 없이도 광합성을 한다.',     answer:'X' },
    { type:'OX', question:'잎의 기공으로 기체가 드나든다.',        answer:'O' },
    { type:'OX', question:'뿌리는 식물을 흙에 고정한다.',          answer:'O' },
    { type:'OX', question:'줄기는 꽃만 받쳐주고 다른 역할은 없다.',answer:'X' },
    { type:'OX', question:'광합성은 주로 잎에서 일어난다.',        answer:'O' },
    { type:'OX', question:'식물은 광합성으로 스스로 양분을 만든다.',answer:'O' },
    { type:'OX', question:'모든 식물의 꽃 색깔은 같다.',           answer:'X' },
    { type:'MC', question:'광합성이 주로 일어나는 곳은?', options:['잎','뿌리','줄기','꽃'], answer:'잎' },
    { type:'MC', question:'뿌리의 주된 역할은?', options:['물과 양분 흡수','광합성','꽃 피우기','열매 맺기'], answer:'물과 양분 흡수' },
    { type:'MC', question:'기체가 드나드는 잎의 작은 구멍은?', options:['기공','씨방','꽃가루','뿌리털'], answer:'기공' },
    { type:'MC', question:'식물이 양분을 만드는 과정은?', options:['광합성','증발','응결','연소'], answer:'광합성' },
    { type:'MC', question:'광합성 결과 만들어지는 기체는?', options:['산소','질소','수소','이산화탄소'], answer:'산소' },
    { type:'MC', question:'식물이 흡수하는 기체는?', options:['이산화탄소','산소','질소','헬륨'], answer:'이산화탄소' },
    { type:'MC', question:'수분이 기공을 통해 밖으로 나가는 것은?', options:['증산 작용','광합성','호흡 작용','동화 작용'], answer:'증산 작용' },
    { type:'MC', question:'뿌리에서 흡수되어 식물 전체로 흐르는 물질은?', options:['물','산소','이산화탄소','토양'], answer:'물' },
  ],
  // Chapter 3 – 지구의 운동
  [
    { type:'OX', question:'지구는 서쪽→동쪽으로 자전한다.',       answer:'O' },
    { type:'OX', question:'낮과 밤은 지구 자전 때문이다.',         answer:'O' },
    { type:'OX', question:'태양이 실제로 지구 주위를 돈다.',       answer:'X' },
    { type:'OX', question:'계절 변화는 지구 공전 때문이다.',       answer:'O' },
    { type:'OX', question:'지구는 태양 주위를 공전한다.',          answer:'O' },
    { type:'OX', question:'지구 자전 주기는 약 24시간이다.',       answer:'O' },
    { type:'OX', question:'지구 공전이 낮과 밤의 직접적 원인이다.',answer:'X' },
    { type:'OX', question:'지구는 태양계 행성 중 하나이다.',       answer:'O' },
    { type:'OX', question:'지구 자전 때문에 1년 주기로 계절이 변한다.', answer:'X' },
    { type:'OX', question:'지구의 자전축을 중심으로 도는 운동이 자전이다.', answer:'O' },
    { type:'MC', question:'지구가 하루 한 바퀴씩 스스로 도는 것은?', options:['자전','공전','회전','진동'], answer:'자전' },
    { type:'MC', question:'지구가 태양을 1년에 한 바퀴 도는 것은?', options:['공전','자전','회전','왕복 운동'], answer:'공전' },
    { type:'MC', question:'지구 자전으로 생기는 현상은?', options:['낮과 밤의 반복','계절 변화','월식','지진'], answer:'낮과 밤의 반복' },
    { type:'MC', question:'지구 자전 주기는?', options:['24시간','12시간','30일','365일'], answer:'24시간' },
    { type:'MC', question:'태양이 동쪽에서 뜨는 이유는?', options:['지구가 자전하기 때문에','태양이 움직여서','달이 밀어서','구름이 이동해서'], answer:'지구가 자전하기 때문에' },
    { type:'MC', question:'계절 변화의 원인은?', options:['공전과 자전축 기울기','낮밤 변화','밀물썰물','별자리 이동'], answer:'공전과 자전축 기울기' },
    { type:'MC', question:'지구 자전 방향은?', options:['서쪽→동쪽','동쪽→서쪽','남쪽→북쪽','북쪽→남쪽'], answer:'서쪽→동쪽' },
    { type:'MC', question:'지구가 공전하는 중심 천체는?', options:['태양','달','북극성','금성'], answer:'태양' },
  ],
];

const chapters = [
  { name:'산과 염기',        color: C.acid   },
  { name:'물체의 운동',      color: C.motion },
  { name:'식물의 구조와 기능', color: C.plants },
  { name:'지구의 운동',      color: C.earth  },
];

// ============================================================
//  ADVENTURE MODE LEVEL DATA
// ============================================================

// Hazards (pits/spikes on the ground)
const adventureHazards = [
  { x:580,  w:130, type:'acid',   label:'산성 용액 웅덩이' },
  { x:1620, w:140, type:'spikes', label:'가시 바닥 지대' },
  { x:2620, w:140, type:'thorns', label:'가시 덩굴 지대' },
  { x:3620, w:160, type:'void',   label:'우주 무중력 절벽' },
];

// Complex platformer layout (more platforms, multi-level, precision jumps)
const adventurePlatforms = [
  // ── Zone 0: 산과 염기 (0–1150) ──
  { x:80,  y:390, w:80,  h:18, s:'lab' },
  { x:180, y:310, w:70,  h:18, s:'lab' },
  { x:260, y:230, w:70,  h:18, s:'lab' },
  { x:350, y:150, w:65,  h:18, s:'lab' },  // very high
  { x:430, y:230, w:65,  h:18, s:'lab' },
  { x:500, y:300, w:110, h:18, s:'lab' },  // NPC 0 platform
  { x:430, y:370, w:65,  h:18, s:'lab' },
  // Over Pit (580-710)
  { x:590, y:330, w:70,  h:18, s:'lab' },
  { x:670, y:250, w:60,  h:18, s:'lab' },
  { x:730, y:330, w:70,  h:18, s:'lab' },
  // Continue zone 0
  { x:800, y:390, w:80,  h:18, s:'lab' },
  { x:900, y:310, w:70,  h:18, s:'lab' },
  { x:980, y:230, w:80,  h:18, s:'lab' },
  { x:1060,y:310, w:70,  h:18, s:'lab' },

  // ── Zone 1: 물체의 운동 (1150–2300) ──
  { x:1170,y:380, w:90,  h:18, s:'road' },
  { x:1270,y:300, w:75,  h:18, s:'road' },
  { x:1360,y:200, w:70,  h:18, s:'road' },  // high
  { x:1440,y:130, w:60,  h:18, s:'road' },  // very high
  { x:1510,y:200, w:70,  h:18, s:'road' },
  { x:1580,y:290, w:110, h:18, s:'road' },  // NPC 1 platform
  { x:1510,y:370, w:70,  h:18, s:'road' },
  // Over Pit (1620-1760)
  { x:1635,y:310, w:60,  h:18, s:'road' },
  { x:1700,y:230, w:55,  h:18, s:'road' },  // small gap jump
  { x:1760,y:310, w:60,  h:18, s:'road' },
  // Continue zone 1
  { x:1840,y:380, w:90,  h:18, s:'road' },
  { x:1940,y:290, w:70,  h:18, s:'road' },
  { x:2020,y:200, w:70,  h:18, s:'road' },
  { x:2110,y:290, w:80,  h:18, s:'road' },

  // ── Zone 2: 식물의 구조와 기능 (2300–3450) ──
  { x:2320,y:380, w:80,  h:18, s:'plant' },
  { x:2410,y:290, w:75,  h:18, s:'plant' },
  { x:2500,y:200, w:70,  h:18, s:'plant' },
  { x:2580,y:120, w:60,  h:18, s:'plant' },  // very high
  { x:2650,y:200, w:70,  h:18, s:'plant' },
  { x:2720,y:290, w:110, h:18, s:'plant' },  // NPC 2 platform
  { x:2650,y:370, w:70,  h:18, s:'plant' },
  // Over Pit (2620-2760)
  { x:2635,y:320, w:60,  h:18, s:'plant' },
  { x:2700,y:240, w:55,  h:18, s:'plant' },
  { x:2770,y:320, w:60,  h:18, s:'plant' },
  // Continue zone 2
  { x:2840,y:380, w:80,  h:18, s:'plant' },
  { x:2940,y:290, w:70,  h:18, s:'plant' },
  { x:3020,y:200, w:70,  h:18, s:'plant' },
  { x:3110,y:290, w:80,  h:18, s:'plant' },

  // ── Zone 3: 지구의 운동 (3450–4550) ──
  { x:3460,y:380, w:80,  h:18, s:'space' },
  { x:3550,y:290, w:75,  h:18, s:'space' },
  { x:3640,y:190, w:65,  h:18, s:'space' },
  { x:3720,y:110, w:55,  h:18, s:'space' },  // very high
  { x:3790,y:190, w:65,  h:18, s:'space' },
  { x:3860,y:280, w:110, h:18, s:'space' },  // NPC 3 platform
  { x:3790,y:370, w:65,  h:18, s:'space' },
  // Over Pit (3620-3780)
  { x:3635,y:310, w:55,  h:18, s:'space' },
  { x:3700,y:220, w:50,  h:18, s:'space' },  // tight precision
  { x:3760,y:310, w:55,  h:18, s:'space' },
  // Continue zone 3
  { x:3960,y:380, w:80,  h:18, s:'space' },
  { x:4060,y:290, w:70,  h:18, s:'space' },
  { x:4140,y:200, w:70,  h:18, s:'space' },
  { x:4220,y:290, w:80,  h:18, s:'space' },

  // ── Zone 4: Boss Arena (4550–5200) ──
  { x:4560,y:370, w:90,  h:18, s:'space' },
  { x:4670,y:280, w:80,  h:18, s:'space' },
  { x:4780,y:200, w:80,  h:18, s:'space' },
  { x:4890,y:280, w:160, h:18, s:'space' }, // Boss throne platform
  { x:5050,y:370, w:90,  h:18, s:'space' },
];

// ============================================================
//  SPACE LEVELS DATA (미로 + 점프맵)
// ============================================================
const spaceLevels = {
  easy: {
    walls: [
      { x:260, y:160, w:28, h:300 },  // gap top 160px
      { x:560, y:0,   w:28, h:300 },  // gap bottom
      { x:860, y:160, w:28, h:300 },  // gap top
    ],
    platforms: [
      { x:1150, y:380, w:120, h:18, s:'space' },
      { x:1320, y:300, w:110, h:18, s:'space' },
      { x:1480, y:380, w:110, h:18, s:'space' },
      { x:1640, y:300, w:110, h:18, s:'space' },
      { x:1800, y:380, w:110, h:18, s:'space' },
      { x:1960, y:300, w:110, h:18, s:'space' },
      { x:2120, y:380, w:120, h:18, s:'space' },
      { x:2290, y:300, w:160, h:18, s:'space' }, // wide final
    ],
    hazards: [], // no spikes on easy
    crystalX: 2700,
  },
  medium: {
    walls: [
      { x:260, y:0,   w:28, h:80  }, // top block
      { x:260, y:160, w:28, h:300 },
      { x:260, y:160, w:160, h:28 }, // horizontal floor (shortened to 160 to prevent trapping)
      { x:500, y:0,   w:28, h:310 },
      { x:660, y:160, w:28, h:300 },
      { x:660, y:0,   w:180, h:28 }, // ceiling
      { x:840, y:100, w:28, h:360 },
      { x:1000,y:160, w:28, h:300 },
    ],
    platforms: [
      { x:1160, y:360, w:80,  h:18, s:'space' },
      { x:1300, y:280, w:75,  h:18, s:'space' },
      { x:1440, y:200, w:70,  h:18, s:'space' },
      { x:1560, y:290, w:75,  h:18, s:'space' },
      { x:1680, y:370, w:80,  h:18, s:'space' },
      { x:1810, y:280, w:70,  h:18, s:'space' },
      { x:1940, y:200, w:70,  h:18, s:'space' },
      { x:2060, y:290, w:75,  h:18, s:'space' },
      { x:2190, y:370, w:160, h:18, s:'space' },
    ],
    hazards: [
      { x:1380, w:80,  type:'spikes', label:'가시 함정' },
      { x:1760, w:80,  type:'spikes', label:'가시 함정' },
    ],
    crystalX: 2700,
  },
  hard: {
    walls: [
      { x:240, y:0,   w:32, h:255 }, // bottom gap
      { x:380, y:205, w:32, h:255 }, // top gap
      { x:520, y:0,   w:32, h:235 }, // bottom gap
      { x:660, y:180, w:32, h:280 }, // top gap
      { x:800, y:0,   w:32, h:250 }, // bottom gap
      { x:940, y:195, w:32, h:265 }, // top gap
      { x:1080,y:0,   w:32, h:235 }, // final bottom gap
    ],
    platforms: [
      { x:1200, y:360, w:70,  h:18, s:'space' },
      { x:1310, y:285, w:65,  h:18, s:'space' },
      { x:1420, y:210, w:65,  h:18, s:'space' },
      { x:1530, y:295, w:65,  h:18, s:'space' },
      { x:1640, y:370, w:70,  h:18, s:'space' },
      { x:1750, y:285, w:65,  h:18, s:'space' },
      { x:1860, y:210, w:65,  h:18, s:'space' },
      { x:1970, y:295, w:65,  h:18, s:'space' },
      { x:2080, y:370, w:70,  h:18, s:'space' },
      { x:2200, y:300, w:150, h:18, s:'space' }, // final wide platform
    ],
    hazards: [
      { x:1150, w:1100, type:'spikes', label:'무시무시한 가시 밭' },
    ],
    crystalX: 2700,
  },
};

// ============================================================
//  GAME STATE
// ============================================================
let gs = {
  mode      : 'adventure',  // 'adventure' | 'spaceHub' | 'spaceLevel'
  diff      : 'easy',
  lives     : 3,
  gems      : [false, false, false, false],
  player    : {
    x:150, y:GROUND_Y-40, vx:0, vy:0,
    w:36, h:36, grounded:false, facingRight:true,
    animTime:0, spinAngle:0, flying:false,
    
    // Inhale / Copy Ability features
    inhaling: false,
    puffed: false,
    ability: null, // 'acid', 'motion', 'plant', 'earth'
    spinAttackTime: 0,
    poopHat: false
  },
  npcs : [
    { id:0, x:560, y:300, theme:'acid'   },
    { id:1, x:1640,y:290, theme:'motion' },
    { id:2, x:2780,y:290, theme:'plants' },
    { id:3, x:3920,y:280, theme:'earth'  },
  ],
  keys      : {},
  camX      : 0,
  particles : [],
};

// Floating Text system
let floatingTexts = [];
function addFloatingText(x, y, text, color='#f59e0b') {
  floatingTexts.push({ x, y, text, color, life: 45 });
}

function drawRoundRectPath(x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawEllipsePath(x, y, radiusX, radiusY, rotation, startAngle, endAngle) {
  if (typeof ctx.ellipse === 'function') {
    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(radiusX, radiusY);
  ctx.arc(0, 0, 1, startAngle, endAngle);
  ctx.restore();
}

// Science breakable crates / blocks containing hidden stars
class ScienceCrate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 36;
    this.h = 36;
    this.active = true;
  }
  draw() {
    if (!this.active) return;
    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    
    // Atom-like science icon on box
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    drawEllipsePath(this.x + 18, this.y + 18, 12, 4, Math.PI / 4, 0, Math.PI * 2);
    drawEllipsePath(this.x + 18, this.y + 18, 12, 4, -Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(this.x + 18, this.y + 18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Interactive science monsters
class Monster {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.type = type; // 'acid', 'motion', 'plant', 'earth'
    this.vx = (Math.random() > 0.5 ? 1 : -1) * 1.5;
    this.active = true;
    this.initialX = x;
  }
  update() {
    if (!this.active) return;
    this.x += this.vx;
    // Walk patrol boundaries
    if (Math.abs(this.x - this.initialX) > 120) {
      this.vx *= -1;
    }
  }
  draw() {
    if (!this.active) return;
    ctx.save();
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const bob = Math.sin(Date.now() / 180 + this.x) * 2;
    let bodyColor = '#f43f5e';
    let accentColor = '#fecdd3';
    if (this.type === 'acid')   { bodyColor = '#be185d'; accentColor = '#f9a8d4'; }
    if (this.type === 'motion') { bodyColor = '#b45309'; accentColor = '#fde68a'; }
    if (this.type === 'plant')  { bodyColor = '#15803d'; accentColor = '#86efac'; }
    if (this.type === 'earth')  { bodyColor = '#1d4ed8'; accentColor = '#93c5fd'; }

    ctx.translate(0, bob);

    // Back spikes
    ctx.fillStyle = accentColor;
    for (let i = 0; i < 4; i++) {
      const sx = this.x + 5 + i * 7;
      ctx.beginPath();
      ctx.moveTo(sx, this.y + 8);
      ctx.lineTo(sx + 4, this.y - 6);
      ctx.lineTo(sx + 8, this.y + 8);
      ctx.closePath();
      ctx.fill();
    }

    // Horns
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(this.x + 6, this.y + 5);
    ctx.lineTo(this.x + 1, this.y - 8);
    ctx.lineTo(this.x + 14, this.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + this.w - 6, this.y + 5);
    ctx.lineTo(this.x + this.w - 1, this.y - 8);
    ctx.lineTo(this.x + this.w - 14, this.y + 2);
    ctx.closePath();
    ctx.fill();

    // Lumpy body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(cx, this.y);
    ctx.quadraticCurveTo(this.x + this.w + 8, this.y + 2, this.x + this.w + 3, cy + 5);
    ctx.quadraticCurveTo(this.x + this.w + 5, this.y + this.h + 5, cx, this.y + this.h);
    ctx.quadraticCurveTo(this.x - 7, this.y + this.h + 5, this.x - 3, cy + 5);
    ctx.quadraticCurveTo(this.x - 8, this.y + 3, cx, this.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arms / claws
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x + 2, cy + 2);
    ctx.lineTo(this.x - 10, cy + 8);
    ctx.moveTo(this.x + this.w - 2, cy + 2);
    ctx.lineTo(this.x + this.w + 10, cy + 8);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx - 11, this.y + 10, 8, 9);
    ctx.fillRect(cx + 3, this.y + 10, 8, 9);
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 8, this.y + 12, 4, 5);
    ctx.fillRect(cx + 6, this.y + 12, 4, 5);

    // Mouth and teeth
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 10, this.y + 23, 20, 6);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
      const tx = cx - 8 + i * 7;
      ctx.beginPath();
      ctx.moveTo(tx, this.y + 23);
      ctx.lineTo(tx + 4, this.y + 23);
      ctx.lineTo(tx + 2, this.y + 28);
      ctx.closePath();
      ctx.fill();
    }

    // Feet
    ctx.beginPath();
    ctx.fillStyle = '#0f172a';
    drawEllipsePath(cx - 9, this.y + this.h + 2, 8, 4, 0, 0, Math.PI * 2);
    drawEllipsePath(cx + 9, this.y + this.h + 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Projectiles fired by player
class PlayerProjectile {
  constructor(x, y, vx, vy, type) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type; // 'star', 'flask', 'leaf', 'beam'
    this.active = true;
    this.life = type === 'beam' ? 8 : 120;
    this.angle = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.active = false;
    
    if (this.type === 'flask') {
      this.vy += 0.3; // Gravity for chemical flask
    }
    
    // Particle trail
    if (Math.random() < 0.4) {
      gs.particles.push({
        x: this.x,
        y: this.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: this.type === 'star' ? '#fde047' : (this.type === 'flask' ? '#a855f7' : '#4ade80'),
        alpha: 0.8,
        life: 0.4
      });
    }
  }
  draw() {
    if (!this.active) return;
    ctx.save();
    if (this.type === 'star') {
      ctx.translate(this.x, this.y);
      this.angle += 0.2;
      ctx.rotate(this.angle);
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 12, Math.sin((18 + i * 72) * Math.PI / 180) * 12);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 5, Math.sin((54 + i * 72) * Math.PI / 180) * 5);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'flask') {
      ctx.font = '22px sans-serif';
      ctx.fillText('🧪', this.x - 11, this.y + 8);
    } else if (this.type === 'leaf') {
      ctx.fillStyle = '#4ade80';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      drawEllipsePath(this.x, this.y, 10, 4, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'beam') {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 45, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// Global game instances
let platforms = [];
let hazards = [];
let npcs = [];
let monsters = [];
let playerProjectiles = [];
let scienceCrates = [];

let boss = {
  x:4950, y:140, w:64, h:64,
  hover:0, active:true,
  projectile:null,
  cinematic:false, cinTime:0, crownY:0,
  portalOpen:false,
  barrierOpen:false,
};

let quiz = {
  active:false, chapterIdx:0,
  questions:[], qIdx:0,
  correct:0, wrong:0,
  timer:60, timerInterval:null, answered:false,
  mode:'chapter', rewardAbility:null,
};

let deco = {
  gearA:0, pendA:0, bubbleT:0, earthA:0, gridOff:0,
};

// ============================================================
//  HUD / DOM helpers
// ============================================================
const toastEl = document.getElementById('toast');
let toastTid = null;

function showToast(msg, type='') {
  clearTimeout(toastTid);
  toastEl.textContent = msg;
  toastEl.className = 'toast-notification active' + (type ? ' alert-' + type : '');
  toastTid = setTimeout(() => toastEl.classList.remove('active'), 3200);
}

function updateHUD() {
  document.getElementById('lives-text').textContent = `x ${gs.lives}`;
  for (let i = 0; i < 4; i++) {
    const slot = document.getElementById(`gem-slot-${i}`);
    slot.className = gs.gems[i] ? `gem-slot active-${i}` : 'gem-slot';
  }
  const bossBtn = document.getElementById('teleport-boss-btn');
  const collected = gs.gems.filter(Boolean).length;
  if (bossBtn) {
    bossBtn.style.display = (collected >= 3 && gs.mode === 'adventure') ? 'flex' : 'none';
    bossBtn.style.background = 'rgba(231,76,60,0.15)';
    bossBtn.style.color = '#ef4444';
  }
}

// ============================================================
//  GAME INIT / RESET
// ============================================================
function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  resetGame();
  playSound('teleport');
}

function resetGame() {
  gs.mode = 'adventure';
  gs.lives = 3;
  gs.gems  = [false,false,false,false];
  
  // Reinitialize Player state
  gs.player = {
    x:150, y:GROUND_Y-40, vx:0, vy:0,
    w:36, h:36, grounded:false, facingRight:true,
    animTime:0, spinAngle:0, flying:false,
    inhaling: false, puffed: false, ability: null, spinAttackTime: 0, poopHat: false
  };
  
  gs.camX = 0;
  gs.particles = [];
  floatingTexts = [];
  playerProjectiles = [];
  
  // Populate science crates
  scienceCrates = [
    new ScienceCrate(300, 354),
    new ScienceCrate(850, 424),
    new ScienceCrate(1400, 424),
    new ScienceCrate(2000, 424),
    new ScienceCrate(2400, 344),
    new ScienceCrate(3200, 424),
    new ScienceCrate(3850, 424)
  ];

  // Populate active science monsters
  monsters = [
    new Monster(350, GROUND_Y - 32, 'acid'),
    new Monster(920, GROUND_Y - 32, 'acid'),
    new Monster(1350, GROUND_Y - 32, 'motion'),
    new Monster(1800, GROUND_Y - 32, 'motion'),
    new Monster(2450, GROUND_Y - 32, 'plant'),
    new Monster(3000, GROUND_Y - 32, 'plant'),
    new Monster(3650, GROUND_Y - 32, 'earth'),
    new Monster(4200, GROUND_Y - 32, 'earth')
  ];

  boss.active=true; boss.projectile=null;
  boss.cinematic=false; boss.cinTime=0; boss.crownY=0; boss.portalOpen=false; boss.barrierOpen=false;

  quiz.active = false;
  closeQuizUI();
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  updateHUD();
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', () => { resetGame(); playSound('teleport'); });
document.getElementById('victory-restart-btn').addEventListener('click', () => { resetGame(); playSound('teleport'); });
document.getElementById('quiz-quit-btn').addEventListener('click', quitQuiz);

const EASTER_EGG_SEQUENCE = ['KeyP', 'KeyO', 'KeyO', 'KeyP'];
let easterEggProgress = 0;

function isBossClearShortcut(e) {
  return e.shiftKey && (e.code === 'KeyG' || e.key === 'G' || e.key === 'g' || e.key === 'ㅎ');
}

function triggerPoopEasterEgg() {
  const p = gs.player;
  p.poopHat = true;
  p.ability = 'earth';
  playSound('victory');
  showToast('이스터에그를 발견했습니다','success');
  addFloatingText(p.x + p.w/2, p.y - 28, '이스터에그를 발견했습니다', '#92400e');
  spawnParticles(p.x + p.w/2, p.y + p.h/2, 36);
}

function handlePoopEasterEgg(e) {
  if (!e.code) return false;

  if (e.code === EASTER_EGG_SEQUENCE[easterEggProgress]) {
    easterEggProgress++;
    if (easterEggProgress >= EASTER_EGG_SEQUENCE.length) {
      easterEggProgress = 0;
      triggerPoopEasterEgg();
      return true;
    }
  } else {
    easterEggProgress = e.code === EASTER_EGG_SEQUENCE[0] ? 1 : 0;
  }

  return false;
}

function clearBossBattleByShortcut() {
  const canClear = gs.mode === 'adventure' && boss.active && (!quiz.active || quiz.chapterIdx === 4);
  if (!canClear || boss.cinematic) return false;

  if (quiz.active) closeQuizUI();
  boss.projectile = null;
  boss.barrierOpen = true;
  gs.player.x = 4850;
  gs.player.y = 280 - gs.player.h;
  gs.player.vx = 0;
  gs.player.vy = 0;
  gs.player.grounded = true;
  gs.camX = Math.max(0, Math.min(gs.player.x - CANVAS_W / 2, WORLD_ADV - CANVAS_W));
  playSound('victory');
  showToast('Shift+G! 보스전이 자동 클리어됩니다.','success');
  startBossCinematic();
  return true;
}

window.addEventListener('keydown', e => {
  if (handlePoopEasterEgg(e)) {
    e.preventDefault();
    return;
  }

  // Boss clear shortcut: Shift + G
  if (isBossClearShortcut(e)) {
    if (clearBossBattleByShortcut()) {
      e.preventDefault();
      return;
    }
  }

  if (quiz.active || boss.cinematic) return;
  gs.keys[e.key] = true;
  
  if (e.key === 'E' || e.key === 'e' || e.key === 'ㄷ') interact();
  if (e.key === 'f' || e.key === 'F' || e.key === 'ㄹ') startInhale();
  if (e.key === 's' || e.key === 'S' || e.key === 'ㄴ' || e.key === 'ArrowDown') swallowItem();
  if (!e.shiftKey && (e.key === 'q' || e.key === 'Q' || e.key === 'ㅂ')) discardAbility();
  
  if (audioCtx.state === 'suspended') audioCtx.resume();
});

window.addEventListener('keyup', e => {
  gs.keys[e.key] = false;
  if (e.key === 'f' || e.key === 'F' || e.key === 'ㄹ') stopInhale();
});

// ─── INHALE MECHANISM ───
function startInhale() {
  const p = gs.player;
  if (p.puffed) {
    // Spit star projectile
    p.puffed = false;
    playSound('spit');
    triggerShake(6);
    const vx = p.facingRight ? 12 : -12;
    playerProjectiles.push(new PlayerProjectile(p.x + p.w/2, p.y + p.h/2, vx, 0, 'star'));
  } else if (p.ability) {
    // Use copy ability!
    useAbility();
  } else {
    // Start inhaling vacuum wind
    p.inhaling = true;
    playSound('inhale');
  }
}

function stopInhale() {
  gs.player.inhaling = false;
}

function useAbility() {
  const p = gs.player;
  if (p.ability === 'acid') {
    // Spit fire acid chemical flask
    playSound('spit');
    const vx = p.facingRight ? 8 : -8;
    playerProjectiles.push(new PlayerProjectile(p.x + p.w/2, p.y + p.h/2 - 5, vx, -4, 'flask'));
  } else if (p.ability === 'motion') {
    // Spinning tornado lightning attack
    p.spinAttackTime = 45; // 0.75 seconds invulnerability spinning
    playSound('jump');
    triggerShake(4);
  } else if (p.ability === 'plant') {
    // Shoot leaf cutters
    playSound('spit');
    const vx = p.facingRight ? 9 : -9;
    playerProjectiles.push(new PlayerProjectile(p.x + p.w/2, p.y + p.h/2, vx, 0, 'leaf'));
  } else if (p.ability === 'earth') {
    // Sweep cosmic orbit laser whip beam
    playSound('laser');
    triggerShake(5);
    const bx = p.facingRight ? p.x + p.w + 20 : p.x - 20;
    playerProjectiles.push(new PlayerProjectile(bx, p.y + p.h/2, 0, 0, 'beam'));
  }
}

function abilityLabel(type) {
  const labels = {
    acid: '산성 플라스크',
    motion: '회오리',
    plant: '잎사귀',
    earth: '우주 빔',
  };
  return labels[type] || '카피';
}

function absorbMonster(monster) {
  const p = gs.player;
  if (!monster.active) return;

  monster.active = false;
  p.inhaling = false;
  p.puffed = false;
  playSound('teleport');
  spawnParticles(monster.x + monster.w / 2, monster.y + monster.h / 2, 28);
  addFloatingText(p.x + p.w / 2, p.y - 20, '카피 퀴즈 시작!', '#38bdf8');
  startAbilityQuiz(monster.type);
}

function swallowItem() {
  const p = gs.player;
  if (p.puffed) {
    p.puffed = false;
    // Swallowed and get random ability or chapter ability
    const types = ['acid', 'motion', 'plant', 'earth'];
    p.ability = types[Math.floor(Math.random() * types.length)];
    playSound('correct');
    addFloatingText(p.x + p.w/2, p.y - 20, `능력 카피: ${p.ability.toUpperCase()}!`, '#38bdf8');
    spawnParticles(p.x + p.w/2, p.y + p.h/2, 20);
  }
}

function discardAbility() {
  const p = gs.player;
  if (p.ability) {
    addFloatingText(p.x + p.w/2, p.y - 20, `능력 해제`, '#94a3b8');
    p.ability = null;
    playSound('wrong');
    spawnParticles(p.x + p.w/2, p.y + p.h/2, 10);
  }
}

// ============================================================
//  INTERACTION
// ============================================================
function interact() {
  const p  = gs.player;
  const px = p.x + p.w / 2;
  const py = p.y + p.h;

  if (gs.mode === 'adventure') {
    // Check portal first
    if (boss.portalOpen) {
      const portalX = 5000;
      if (Math.abs(px - portalX) < 70) { enterSpaceHub(); return; }
    }
    // Boss interaction
    if (boss.active) {
      const dx = Math.abs(px - boss.x);
      const dy = Math.abs((p.y + p.h/2) - boss.y);
      if (dx < 120 && dy < 140) {
        const collected = gs.gems.filter(Boolean).length;
        if (collected < 3) { showToast('보석을 3개 이상 모아야 대결할 수 있습니다!','fail'); return; }
        startQuiz(4); return;
      }
    }
    // NPC interactions
    for (const npc of gs.npcs) {
      if (Math.abs(px - npc.x) < 90 && Math.abs(py - npc.y) < 70) {
        startQuiz(npc.id); return;
      }
    }
  } else if (gs.mode === 'spaceHub') {
    // Difficulty pads
    const pads = [
      { x:280, diff:'easy'   },
      { x:512, diff:'medium' },
      { x:744, diff:'hard'   },
    ];
    for (const pad of pads) {
      if (Math.abs(px - pad.x) < 60) { loadSpaceLevel(pad.diff); return; }
    }
  }
}

// ============================================================
//  TELEPORT BUTTONS
// ============================================================
function teleportToNPC(idx) {
  if (gs.mode !== 'adventure') { showToast('모험 모드에서만 사용 가능!','fail'); return; }
  if (quiz.active || boss.cinematic) { showToast('이동 불가!','fail'); return; }
  const npc = gs.npcs[idx];
  gs.player.x = npc.x - 70;
  gs.player.y = npc.y - gs.player.h - 10;
  gs.player.vx = 0; gs.player.vy = 0; gs.player.grounded = false;
  gs.camX = gs.player.x - CANVAS_W / 2;
  playSound('teleport');
  spawnParticles(npc.x, npc.y - 20);
  showToast(`${chapters[idx].name} 구역으로 이동!`);
}

function teleportToBoss() {
  if (gs.mode !== 'adventure') { showToast('모험 모드에서만 사용 가능!','fail'); return; }
  if (gs.gems.filter(Boolean).length < 3) { showToast('보석 3개 이상 필요!','fail'); return; }
  if (quiz.active || boss.cinematic) { showToast('이동 불가!','fail'); return; }
  gs.player.x = 4800;
  gs.player.y = 280 - gs.player.h;
  gs.player.vx = 0; gs.player.vy = 0; gs.player.grounded = true;
  gs.camX = gs.player.x - CANVAS_W / 2;
  playSound('teleport');
  spawnParticles(4820, 260);
  showToast('최종 보스 구역 입장! 준비하세요!');
}

// ============================================================
//  SPACE HUB / LEVEL TRANSITIONS
// ============================================================
function enterSpaceHub() {
  gs.mode = 'spaceHub';
  gs.player.x = 512 - gs.player.w / 2;
  gs.player.y = GROUND_Y - gs.player.h;
  gs.player.vx = 0; gs.player.vy = 0; gs.player.grounded = true;
  gs.camX = 0;
  playSound('teleport');
  spawnParticles(512, GROUND_Y - 10);
  showToast('다른 공간 입장! 난이도를 선택하고 [E] 키로 입장하세요.');
  updateHUD();
}

function loadSpaceLevel(diff) {
  gs.mode = 'spaceLevel';
  gs.diff = diff;
  gs.player.x = 50;
  gs.player.y = GROUND_Y - gs.player.h - 5;
  gs.player.vx = 0; gs.player.vy = 0; gs.player.grounded = true;
  gs.camX = 0;
  playSound('teleport');
  spawnParticles(68, GROUND_Y - 5);
  const names = { easy:'쉬움', medium:'중간', hard:'어려움' };
  showToast(`[${names[diff]}] 난이도 입장! Space를 꾹 누르면 날 수 있어요!`);
  updateHUD();
}

// ============================================================
//  PARTICLES
// ============================================================
function spawnParticles(x, y, n = 30) {
  for (let i = 0; i < n; i++) {
    gs.particles.push({
      x, y,
      vx:(Math.random()-0.5)*9,
      vy:(Math.random()-0.5)*9-3,
      size:Math.random()*6+2,
      color:`hsl(${Math.random()*360},100%,70%)`,
      alpha:1, life:1,
    });
  }
}

function spawnWalkDust(x, y) {
  if (Math.random() > 0.35) return;
  gs.particles.push({
    x, y, vx:(Math.random()-0.5)*2, vy:-Math.random()*2,
    size:Math.random()*3+1, color:'rgba(0,0,0,0.12)', alpha:0.7, life:0.7,
  });
}

// ============================================================
//  QUIZ LOGIC
// ============================================================
function startQuiz(chIdx) {
  if (chIdx !== 4 && gs.gems[chIdx]) {
    showToast('이미 이 구역의 보석을 획득했습니다!','success'); return;
  }

  quiz.active      = true;
  quiz.chapterIdx  = chIdx;
  quiz.qIdx        = 0;
  quiz.correct     = 0;
  quiz.wrong       = 0;
  quiz.answered    = false;
  quiz.mode        = 'chapter';
  quiz.rewardAbility = null;

  const isBoss = (chIdx === 4);
  if (isBoss) {
    const all = questionsDatabase.flat().sort(() => Math.random()-0.5);
    quiz.questions = all.slice(0, 20);
    document.getElementById('quiz-title').innerHTML = '😈 <strong>최종 보스 대결</strong> (과학 6-1 기말 평가)';
    const card = document.getElementById('quiz-card');
    card.className = 'quiz-card theme-boss';
  } else {
    const pool = [...questionsDatabase[chIdx]].sort(() => Math.random()-0.5);
    quiz.questions = pool.slice(0, 15);
    document.getElementById('quiz-title').innerHTML = `🧪 <strong>${chapters[chIdx].name}</strong> 구역 퀴즈`;
    const card = document.getElementById('quiz-card');
    card.className = 'quiz-card';
    const themeMap = ['theme-acid','theme-motion','theme-plants','theme-earth'];
    card.classList.add(themeMap[chIdx]);
  }

  document.getElementById('quiz-modal').classList.add('active');
  loadQuestion();
}

function startAbilityQuiz(abilityType) {
  quiz.active      = true;
  quiz.chapterIdx  = -1;
  quiz.qIdx        = 0;
  quiz.correct     = 0;
  quiz.wrong       = 0;
  quiz.answered    = false;
  quiz.mode        = 'ability';
  quiz.rewardAbility = abilityType;
  quiz.questions = questionsDatabase.flat().sort(() => Math.random()-0.5).slice(0, 3);

  document.getElementById('quiz-title').innerHTML =
    `✨ <strong>${abilityLabel(abilityType)}</strong> 카피 퀴즈`;
  const card = document.getElementById('quiz-card');
  card.className = 'quiz-card';
  const themeMap = { acid:'theme-acid', motion:'theme-motion', plant:'theme-plants', earth:'theme-earth' };
  card.classList.add(themeMap[abilityType] || 'theme-motion');

  document.getElementById('quiz-modal').classList.add('active');
  showToast('3문제 중 2개 이상 맞히면 능력을 카피합니다!');
  loadQuestion();
}

function loadQuestion() {
  const isAbility = quiz.mode === 'ability';
  const isBoss = quiz.chapterIdx === 4;
  const maxQ   = isAbility ? 3 : (isBoss ? 20 : 15);

  if (quiz.qIdx >= maxQ) { finishQuiz(); return; }

  quiz.answered = false;
  const q = quiz.questions[quiz.qIdx];

  document.getElementById('quiz-progress-text').textContent = `문제 ${quiz.qIdx+1} / ${maxQ}`;

  const summary = document.querySelector('.quiz-score-summary');
  const criteria = isAbility ? '3문제 중 2개 이상 맞히기' : (isBoss ? '20개 모두 맞히기' : '12개 이상 맞히기');
  summary.innerHTML = `현재 점수: <span class="score-correct" id="quiz-correct-count">${quiz.correct}</span> 맞힘 / <span class="score-wrong" id="quiz-wrong-count">${quiz.wrong}</span> 틀림 (기준: ${criteria})`;

  document.getElementById('quiz-question-text').textContent = q.question;

  // Quit button – disabled after 3 questions
  const quitBtn = document.getElementById('quiz-quit-btn');
  if (!isAbility && quiz.qIdx < 3) {
    quitBtn.disabled = false; quitBtn.style.opacity = '1'; quitBtn.style.display = 'block';
  } else {
    quitBtn.disabled = true;  quitBtn.style.opacity = '0'; quitBtn.style.display = 'none';
  }

  // Options
  const cont = document.getElementById('quiz-options-container');
  cont.innerHTML = '';
  if (q.type === 'OX') {
    cont.className = 'quiz-options-container ox-mode';
    cont.appendChild(makeOptBtn('O','O'));
    cont.appendChild(makeOptBtn('X','X'));
  } else {
    cont.className = 'quiz-options-container';
    [...q.options].sort(() => Math.random()-0.5).forEach(opt => cont.appendChild(makeOptBtn(opt, opt)));
  }

  // Timer
  quiz.timer = 60;
  updateTimerBar();
  clearInterval(quiz.timerInterval);
  quiz.timerInterval = setInterval(() => {
    quiz.timer--;
    updateTimerBar();
    if (quiz.timer <= 0) { clearInterval(quiz.timerInterval); timeoutFail(); }
  }, 1000);
}

function makeOptBtn(text, val) {
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.setAttribute('data-value', val);
  btn.textContent = text;
  btn.addEventListener('click', () => submitAnswer(val));
  return btn;
}

function updateTimerBar() {
  document.getElementById('quiz-timer-bar').style.width = `${(quiz.timer/60)*100}%`;
}

function submitAnswer(val) {
  if (quiz.answered) return;
  quiz.answered = true;
  clearInterval(quiz.timerInterval);

  const q       = quiz.questions[quiz.qIdx];
  const correct = val === q.answer;
  const isAbility = quiz.mode === 'ability';
  const isBoss  = quiz.chapterIdx === 4;

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.getAttribute('data-value') === val) {
      btn.style.background    = correct ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.4)';
      btn.style.borderColor   = correct ? '#2ecc71' : '#e74c3c';
    }
  });

  if (correct) {
    quiz.correct++;
    playSound('correct');
    flashCard(true);
    setTimeout(() => { quiz.qIdx++; loadQuestion(); }, 750);
  } else {
    quiz.wrong++;
    playSound('wrong');
    flashCard(false);

    if (isAbility) {
      setTimeout(() => { quiz.qIdx++; loadQuestion(); }, 750);
    } else if (isBoss) {
      gs.lives--;
      updateHUD();
      shootBossProjectile();
      setTimeout(() => {
        closeQuizUI();
        if (gs.lives <= 0) triggerGameOver('보스의 치명적인 일격을 받았습니다!');
        else { showToast('오답! 보스전은 모두 맞혀야 합니다. 재도전!','fail'); gs.player.x = 4800; }
      }, 1000);
    } else {
      gs.lives--;
      updateHUD();
      if (gs.lives <= 0) {
        setTimeout(() => { closeQuizUI(); triggerGameOver('생명이 모두 소진되었습니다.'); }, 750);
      } else {
        setTimeout(() => { quiz.qIdx++; loadQuestion(); }, 750);
      }
    }
  }
}

function flashCard(ok) {
  const card = document.getElementById('quiz-card');
  const old  = card.style.borderColor;
  card.style.borderColor = ok ? '#2ecc71' : '#e74c3c';
  setTimeout(() => card.style.borderColor = old, 400);
}

function timeoutFail() {
  const isAbility = quiz.mode === 'ability';
  const isBoss = quiz.chapterIdx === 4;
  closeQuizUI();
  playSound('wrong');
  if (isAbility) {
    showToast('시간 초과! 카피 실패!','fail');
    quiz.rewardAbility = null;
  } else {
    showToast('시간 초과! 재도전 하십시오.','fail');
    if (isBoss) gs.player.x = 4800;
    else gs.player.x = gs.npcs[quiz.chapterIdx].x - 150;
  }
  gs.player.vx = 0;
}

function quitQuiz() {
  if (quiz.mode === 'ability') { showToast('카피 퀴즈는 끝까지 풀어야 합니다!','fail'); return; }
  if (quiz.qIdx >= 3) { showToast('3문제 이후에는 퀴즈를 포기할 수 없습니다!','fail'); return; }
  closeQuizUI();
  showToast('퀴즈를 중단했습니다.');
}

function closeQuizUI() {
  clearInterval(quiz.timerInterval);
  quiz.active = false;
  document.getElementById('quiz-modal').classList.remove('active');
}

function finishQuiz() {
  closeQuizUI();
  const isAbility = quiz.mode === 'ability';
  const isBoss = quiz.chapterIdx === 4;

  if (isAbility) {
    const ability = quiz.rewardAbility;
    if (quiz.correct >= 2 && ability) {
      gs.player.ability = ability;
      playSound('victory');
      showToast(`능력 카피 성공! ${abilityLabel(ability)} 능력을 얻었습니다!`,'success');
      spawnParticles(gs.player.x + gs.player.w/2, gs.player.y + gs.player.h/2, 24);
    } else {
      playSound('wrong');
      showToast(`${quiz.correct}/3 – 2개 이상 맞혀야 카피할 수 있습니다!`,'fail');
    }
    quiz.rewardAbility = null;
  } else if (isBoss) {
    if (quiz.correct === 20) {
      playSound('victory');
      startBossCinematic();
    } else {
      playSound('wrong');
      showToast(`${quiz.correct}/20 – 20개 모두 맞혀야 합니다! 재도전!`,'fail');
      gs.player.x = 4800;
    }
  } else {
    if (quiz.correct >= 12) {
      gs.gems[quiz.chapterIdx] = true;
      updateHUD();
      playSound('victory');
      showToast(`🎉 ${chapters[quiz.chapterIdx].name} 보석 획득!`,'success');
      spawnParticles(gs.npcs[quiz.chapterIdx].x, gs.npcs[quiz.chapterIdx].y - 40);
    } else {
      playSound('wrong');
      showToast(`${quiz.correct}/15 – 12개 이상 맞혀야 합니다! 재도전!`,'fail');
      gs.player.x = gs.npcs[quiz.chapterIdx].x - 150;
    }
  }
}

// ============================================================
//  BOSS BATTLE
// ============================================================
function shootBossProjectile() {
  boss.projectile = {
    x: boss.x, y: boss.y + 32,
    vx: (gs.player.x + 18 - boss.x) / 14,
    vy: (gs.player.y + 18 - boss.y - 32) / 14,
    frames: 0,
  };
}

function startBossCinematic() {
  boss.cinematic = true;
  boss.cinTime   = Date.now();
  boss.active    = false;
  gs.player.vx   = 0; gs.player.vy = 0;
  spawnParticles(boss.x, boss.y + 32, 150);
}

function updateBossCinematic() {
  const p       = gs.player;
  const elapsed = Date.now() - boss.cinTime;

  gs.camX = Math.max(0, Math.min(p.x - CANVAS_W/2, WORLD_ADV - CANVAS_W));
  p.y += (200 - (p.y + p.h/2)) * 0.05;
  p.vx = 0; p.vy = 0; p.grounded = false;
  p.spinAngle += 0.16;

  if (boss.crownY < p.y - 32) boss.crownY += 3.5;
  else boss.crownY = p.y - 32;

  if (Math.random() < 0.4) {
    gs.particles.push({
      x: p.x + 18 + (Math.random()-0.5)*40,
      y: p.y + 18 + (Math.random()-0.5)*40,
      vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4-2,
      size:Math.random()*8+3,
      color:`hsl(${Math.random()*360},100%,70%)`,
      alpha:1, life:1.2,
    });
  }

  if (elapsed > 5800) {
    boss.cinematic  = false;
    boss.portalOpen = true;
    p.spinAngle     = 0;
    p.x = 4850; p.y = 280 - p.h;
    p.vx = 0; p.vy = 0; p.grounded = true;
    showToast('보스를 물리쳤습니다! 무지개 포탈이 열렸습니다! [E]키로 다른 공간에 입장하세요.','success');
    updateHUD();
  }
}

// ============================================================
//  PHYSICS UPDATE
// ============================================================
function updatePhysics() {
  if (boss.cinematic) { updateBossCinematic(); return; }

  const p = gs.player;
  const isAdv   = gs.mode === 'adventure';
  const isHub   = gs.mode === 'spaceHub';
  const isLevel = gs.mode === 'spaceLevel';
  const worldW  = isAdv ? WORLD_ADV : (isLevel ? WORLD_SPACE : WORLD_HUB);
  const holdingFly = isLevel && gs.keys[' '];
  p.flying = false;

  // Ability countdowns
  if (p.spinAttackTime > 0) {
    p.spinAttackTime--;
    p.spinAngle += 0.4;
  } else {
    p.spinAngle = 0;
  }

  // Movement
  if (p.spinAttackTime > 0) {
    // Tornado dash speed
    p.vx = p.facingRight ? WALK_SPD * 1.8 : -WALK_SPD * 1.8;
  } else if (gs.keys['a'] || gs.keys['A'] || gs.keys['ArrowLeft']) {
    p.vx = -WALK_SPD; p.facingRight = false; p.animTime += 0.15;
    spawnWalkDust(p.x + p.w/2, p.y + p.h);
  } else if (gs.keys['d'] || gs.keys['D'] || gs.keys['ArrowRight']) {
    p.vx = WALK_SPD; p.facingRight = true; p.animTime += 0.15;
    spawnWalkDust(p.x + p.w/2, p.y + p.h);
  } else {
    p.vx *= FRICTION;
    if (Math.abs(p.vx) < 0.1) p.vx = 0;
  }

  // Jump
  if (((!isLevel && gs.keys[' ']) || gs.keys['ArrowUp']) && p.grounded) {
    p.vy = JUMP_F; p.grounded = false; playSound('jump');
  }

  // In the post-boss portal maze, holding Space turns jump into flight.
  if (holdingFly) {
    if (p.grounded && p.vy > 0) p.vy = 0;
    p.vy = Math.max(p.vy - FLY_THRUST, FLY_MAX_RISE);
    p.grounded = false;
    p.flying = true;

    if (Math.random() < 0.28) {
      gs.particles.push({
        x:p.x + p.w/2 + (Math.random()-0.5)*24,
        y:p.y + p.h + Math.random()*6,
        vx:(Math.random()-0.5)*2,
        vy:Math.random()*2+1,
        size:Math.random()*4+2,
        color:'rgba(0,229,255,0.75)',
        alpha:0.9,
        life:0.55,
      });
    }
  }

  p.vy += holdingFly ? GRAVITY * FLY_GRAVITY_SCALE : GRAVITY;
  p.x  += p.vx;
  p.y  += p.vy;

  // World bounds
  if (p.x < 0) { p.x = 0; p.vx = 0; }
  if (p.x > worldW - p.w) { p.x = worldW - p.w; p.vx = 0; }
  if (isLevel && p.y < 6) { p.y = 6; p.vy = 0; }

  // Boss zone barrier (need 3 gems)
  if (isAdv) {
    const coll = gs.gems.filter(Boolean).length;
    if (p.x > 4450 - p.w && coll < 3 && !boss.barrierOpen) {
      p.x = 4450 - p.w; p.vx = 0;
      if (Math.random() < 0.02) showToast(`보스의 봉인막! 보석 ${coll}/3 개 필요.`,'fail');
    }
  }

  // Hazard check
  const curHazards = isAdv ? adventureHazards : (isLevel ? spaceLevels[gs.diff].hazards : []);
  let inHazard = false, hazardLabel = '';
  for (const h of curHazards) {
    if (p.x + p.w > h.x && p.x < h.x + h.w && p.y + p.h >= GROUND_Y) {
      inHazard = true; hazardLabel = h.label; break;
    }
  }

  // Tornado state makes you invulnerable to hazard damage
  if (inHazard && p.spinAttackTime === 0) {
    p.vx = 0; p.vy = 0;
    playSound('wrong');
    showToast(`앗! ${hazardLabel}에 빠졌습니다! 리셋됩니다.`,'fail');
    if (isAdv) {
      if (p.x < 1150) p.x = 50;
      else if (p.x < 2300) p.x = 1200;
      else if (p.x < 3450) p.x = 2350;
      else p.x = 3500;
    } else { p.x = 50; }
    p.y = GROUND_Y - p.h; p.grounded = true;
    p.ability = null; // Lose ability on hit
  } else {
    // Ground
    if (p.y + p.h >= GROUND_Y) {
      p.y = GROUND_Y - p.h; p.vy = 0; p.grounded = true;
    }
  }

  // Platform collision
  p.grounded = p.y + p.h >= GROUND_Y - 1; // default ground check
  if (p.y + p.h >= GROUND_Y) { p.y = GROUND_Y - p.h; p.vy = 0; p.grounded = true; }

  const curPlats = isAdv ? adventurePlatforms : (isLevel ? spaceLevels[gs.diff].platforms : []);
  for (const plat of curPlats) {
    if (p.x + p.w > plat.x && p.x < plat.x + plat.w) {
      if (p.vy >= 0 && p.y + p.h >= plat.y && p.y + p.h - p.vy <= plat.y + 12) {
        p.y = plat.y - p.h; p.vy = 0; p.grounded = true;
      }
    }
  }

  // Inhaling visual wind particles & physics pull
  if (p.inhaling && isAdv) {
    // Generate vacuum particle effects
    if (Math.random() < 0.5) {
      const vx = p.facingRight ? -8 : 8;
      const wx = p.facingRight ? p.x + 180 : p.x - 140;
      gs.particles.push({
        x: wx + (Math.random() - 0.5) * 30,
        y: p.y + Math.random() * p.h,
        vx: vx,
        vy: 0,
        size: Math.random() * 4 + 2,
        color: 'rgba(147, 197, 253, 0.6)',
        alpha: 0.8,
        life: 0.25
      });
    }

    // Pull monsters towards player's mouth
    monsters.forEach(m => {
      if (m.active) {
        const dx = m.x - p.x;
        const dy = Math.abs(m.y - p.y);
        if (dy < 60 && Math.abs(dx) < 200) {
          // If facing correct direction
          if ((p.facingRight && dx > 0) || (!p.facingRight && dx < 0)) {
            // Pull physics speed
            m.x -= Math.sign(dx) * 4;
            
            // Check if pulled all the way inside mouth
            if (Math.abs(dx) < 25) {
              absorbMonster(m);
            }
          }
        }
      }
    });
  }

  // Update Monsters
  if (isAdv) {
    monsters.forEach(m => {
      m.update();
      
      // Collision with player
      if (m.active) {
        const px = p.x + p.w/2;
        const py = p.y + p.h/2;
        const mx = m.x + m.w/2;
        const my = m.y + m.h/2;
        
        if (Math.abs(px - mx) < 30 && Math.abs(py - my) < 30) {
          if (p.inhaling) {
            absorbMonster(m);
          } else if (p.spinAttackTime > 0) {
            // Destroy monster during tornado spin
            m.active = false;
            playSound('correct');
            spawnParticles(m.x + 16, m.y + 16, 25);
            addFloatingText(m.x, m.y - 10, '몬스터 격파! ⭐');
          } else {
            // Get damaged by touching monster from side
            playSound('wrong');
            gs.lives--;
            updateHUD();
            p.ability = null; // Lose copy ability
            p.vx = p.facingRight ? -6 : 6;
            p.vy = -5;
            m.vx *= -1; // bounce monster
            
            if (gs.lives <= 0) {
              triggerGameOver('조금 더 민첩해집시오..', false);
            }
          }
        }
      }
    });
  }

  // Update Projectiles
  playerProjectiles.forEach(proj => {
    proj.update();
    
    if (isAdv) {
      // 1. Projectiles hit enemies
      monsters.forEach(m => {
        if (m.active && proj.active) {
          const dx = Math.abs(proj.x - (m.x + 16));
          const dy = Math.abs(proj.y - (m.y + 16));
          if (dx < 25 && dy < 25) {
            m.active = false;
            proj.active = false;
            playSound('correct');
            spawnParticles(m.x + 16, m.y + 16, 30);
            triggerShake(8);
            addFloatingText(m.x, m.y - 10, '물리 격파! ⭐');
          }
        }
      });
      
      // 2. Projectiles break science crates
      scienceCrates.forEach(crate => {
        if (crate.active && proj.active) {
          const dx = Math.abs(proj.x - (crate.x + 18));
          const dy = Math.abs(proj.y - (crate.y + 18));
          if (dx < 26 && dy < 26) {
            crate.active = false;
            proj.active = false;
            playSound('correct');
            playSound('teleport');
            spawnParticles(crate.x + 18, crate.y + 18, 40);
            triggerShake(12);
            // Spawn star score points!
            gs.lives = Math.min(3, gs.lives + 1); // Get a heart life!
            updateHUD();
            addFloatingText(crate.x, crate.y - 20, '생명 회복! ❤️', '#ff4757');
          }
        }
      });
    }
  });
  
  // Clean inactive projectiles
  playerProjectiles = playerProjectiles.filter(proj => proj.active);

  // Update floating text life
  floatingTexts.forEach(ft => {
    ft.y -= 0.6;
    ft.life--;
  });
  floatingTexts = floatingTexts.filter(ft => ft.life > 0);

  // Maze wall collision (spaceLevel only)
  if (isLevel) {
    resolveWalls(p, spaceLevels[gs.diff].walls);

    // Victory crystal check
    const cx = spaceLevels[gs.diff].crystalX;
    if (Math.abs((p.x + p.w/2) - cx) < 50 && p.y + p.h > 250) {
      triggerVictory();
    }
  }

  // Camera scroll limits
  if (isHub) {
    gs.camX = 0;
  } else {
    gs.camX = Math.max(0, Math.min(p.x - CANVAS_W/2, worldW - CANVAS_W));
  }

  // Particles update
  for (let i = gs.particles.length - 1; i >= 0; i--) {
    const part = gs.particles[i];
    part.x += part.vx; part.y += part.vy;
    part.alpha -= 0.018; part.life -= 0.018;
    if (part.alpha <= 0 || part.life <= 0) gs.particles.splice(i, 1);
  }

  // Boss projectile
  if (isAdv && boss.projectile) {
    const proj = boss.projectile;
    proj.x += proj.vx; proj.y += proj.vy; proj.frames++;
    gs.particles.push({
      x:proj.x, y:proj.y,
      vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2,
      size:Math.random()*5+3, color:'#5b21b6', alpha:0.85, life:0.5,
    });
    if (proj.frames >= 14) {
      boss.projectile = null;
      for (let k = 0; k < 20; k++) {
        gs.particles.push({
          x:p.x+18, y:p.y+18,
          vx:(Math.random()-0.5)*6, vy:(Math.random()-0.5)*6,
          size:Math.random()*5+2, color:'#ef4444', alpha:1, life:0.8,
        });
      }
    }
  }

  // Screen shake decay
  if (shakeIntensity > 0.1) {
    shakeIntensity *= 0.88;
  } else {
    shakeIntensity = 0;
  }

  // Deco elements angles
  if (isAdv) {
    boss.hover = Math.sin(Date.now()/300) * 12;
    deco.gearA    += 0.02;
    deco.pendA     = Math.sin(Date.now()/400) * 0.5;
    deco.bubbleT  += 0.05;
    deco.earthA   += 0.005;
    deco.gridOff  += 1.5;
  } else {
    deco.gridOff += 1.5;
  }
}

function resolveWalls(p, walls) {
  for (const w of walls) {
    if (p.x + p.w > w.x && p.x < w.x + w.w &&
        p.y + p.h > w.y && p.y < w.y + w.h) {
      const ox = Math.min(p.x + p.w - w.x, w.x + w.w - p.x);
      const oy = Math.min(p.y + p.h - w.y, w.y + w.h - p.y);
      if (ox < oy) {
        if (p.vx > 0) { p.x -= ox; p.vx = 0; }
        else           { p.x += ox; p.vx = 0; }
      } else {
        if (p.vy >= 0 && p.y + p.h - p.vy <= w.y + 12) {
          p.y -= oy; p.vy = 0; p.grounded = true;
        } else if (p.vy < 0) { p.y += oy; p.vy = 0; }
      }
    }
  }
}

// ============================================================
//  GAME OVER / VICTORY
// ============================================================
function triggerGameOver(reason, appendDefaultMessage = true) {
  playSound('gameover');
  document.getElementById('gameover-reason').textContent = appendDefaultMessage
    ? reason + ' 조금 더 공부하십시오. 화이팅!'
    : reason;
  document.getElementById('gameover-screen').classList.remove('hidden');
}

function triggerVictory() {
  playSound('victory');
  const names = { easy:'쉬움', medium:'중간', hard:'어려움' };
  const el = document.querySelector('#victory-screen .intro-text');
  if (el) el.innerHTML = `"축하합니다! [${names[gs.diff]}] 단계 미로 & 점프맵을 정복했습니다!"`;
  document.getElementById('victory-screen').classList.remove('hidden');
}

// ============================================================
//  DRAWING
// ============================================================
function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.save();
  
  // Apply Screen Shake
  if (shakeIntensity > 0) {
    const dx = (Math.random() - 0.5) * shakeIntensity;
    const dy = (Math.random() - 0.5) * shakeIntensity;
    ctx.translate(dx, dy);
  }

  ctx.translate(-gs.camX, 0);

  if (gs.mode === 'spaceHub') {
    drawSpaceHubBg();
    drawSpaceHubPads();
  } else if (gs.mode === 'spaceLevel') {
    drawSpaceLevelBg();
    drawSpaceLevelContent();
  } else {
    drawAdventureBg();
    drawAdventureGround();
    drawHazards();
    
    // Draw breakable crates
    scienceCrates.forEach(c => c.draw());

    // Draw active platforms
    drawPlatforms(adventurePlatforms);
    
    // Draw active monsters
    monsters.forEach(m => m.draw());
    
    drawNPCs();
    if (boss.active) drawBoss();
    if (boss.portalOpen) drawPortal();
    drawBossBarrier();
  }

  drawPlayer();
  
  // Draw projectiles
  playerProjectiles.forEach(p => p.draw());
  
  if (gs.mode === 'adventure' && boss.projectile) drawProjectile();
  drawParticles();
  
  // Draw floating texts
  drawFloatingTexts();

  ctx.restore();

  if (boss.cinematic) drawCinematicOverlay();
}

// Draw text popups
function drawFloatingTexts() {
  floatingTexts.forEach(ft => {
    ctx.save();
    ctx.globalAlpha = ft.life / 45;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = ft.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}

// ── Space Hub ──────────────────────────────────────────────
function drawSpaceHubBg() {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#060b18');
  grad.addColorStop(1, '#0d1b2a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.save();
  ctx.strokeStyle = '#1a2740';
  ctx.lineWidth = 1;
  const off = deco.gridOff % 40;
  for (let x = -off; x < CANVAS_W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,CANVAS_H); ctx.stroke(); }
  for (let y = 0; y < CANVAS_H; y += 40)     { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(CANVAS_W,y); ctx.stroke(); }

  // Glowing orb center
  const rg = ctx.createRadialGradient(CANVAS_W/2, 180, 10, CANVAS_W/2, 180, 180);
  rg.addColorStop(0, 'rgba(0,229,255,0.12)');
  rg.addColorStop(1, 'rgba(0,229,255,0)');
  ctx.fillStyle = rg;
  ctx.beginPath(); ctx.arc(CANVAS_W/2, 180, 180, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Title
  ctx.save();
  ctx.font = "bold 28px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.fillStyle = C.cyan;
  ctx.shadowBlur = 12; ctx.shadowColor = C.cyan;
  ctx.textAlign = 'center';
  ctx.fillText('✨ 다른 공간 – 난이도 선택 ✨', CANVAS_W/2, 80);
  ctx.restore();

  // Ground
  ctx.fillStyle = '#0f1c2e';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
  ctx.fillStyle = C.cyan;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 6);
}

function drawSpaceHubPads() {
  const pads = [
    { x:280, name:'쉬움', label:'EASY',   color:'#22c55e' },
    { x:512, name:'중간', label:'NORMAL', color:'#f59e0b' },
    { x:744, name:'어려움',label:'HARD',  color:'#ef4444' },
  ];
  const p = gs.player;
  pads.forEach(pad => {
    ctx.save();
    // Beam
    const bg = ctx.createLinearGradient(pad.x, GROUND_Y - 150, pad.x, GROUND_Y);
    bg.addColorStop(0, pad.color + '00');
    bg.addColorStop(1, pad.color + '44');
    ctx.fillStyle = bg;
    ctx.fillRect(pad.x - 45, GROUND_Y - 150, 90, 150);

    // Pad
    ctx.fillStyle = pad.color;
    ctx.fillRect(pad.x - 50, GROUND_Y - 6, 100, 8);

    // Label
    ctx.shadowBlur = 8; ctx.shadowColor = pad.color;
    ctx.font = "bold 16px 'Fredoka','Noto Sans KR',sans-serif";
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(`${pad.name} [${pad.label}]`, pad.x, GROUND_Y - 165);

    // Interact prompt
    if (Math.abs((p.x + p.w/2) - pad.x) < 60) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.96)';
      ctx.fillRect(pad.x - 70, GROUND_Y - 210, 140, 32);
      ctx.strokeStyle = pad.color; ctx.lineWidth = 2;
      ctx.strokeRect(pad.x - 70, GROUND_Y - 210, 140, 32);
      ctx.font = "bold 12px 'Fredoka','Noto Sans KR',sans-serif";
      ctx.fillStyle = '#0f172a';
      ctx.fillText('[E] 키로 입장', pad.x, GROUND_Y - 188);
    }
    ctx.restore();
  });
}

// ── Space Level ────────────────────────────────────────────
function drawSpaceLevelBg() {
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, WORLD_SPACE, CANVAS_H);

  ctx.save();
  ctx.strokeStyle = '#161b22'; ctx.lineWidth = 1;
  const off = deco.gridOff % 40;
  for (let x = -off; x < WORLD_SPACE; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,CANVAS_H); ctx.stroke(); }
  for (let y = 0; y < CANVAS_H; y += 40)        { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD_SPACE,y); ctx.stroke(); }
  ctx.restore();

  const names = { easy:'쉬움', medium:'중간', hard:'어려움' };
  ctx.save();
  ctx.shadowBlur = 10; ctx.shadowColor = C.cyan;
  ctx.font = "bold 22px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.fillStyle = C.cyan; ctx.textAlign = 'left';
  ctx.fillText(`다른 공간 – 난이도: 【${names[gs.diff]}】`, 50, 75);
  ctx.font = "15px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Space를 꾹 누르면 날 수 있습니다. 벽에 부딪히지 않게 미로를 통과하세요!', 50, 105);
  ctx.restore();
}

function drawSpaceLevelContent() {
  const level = spaceLevels[gs.diff];

  // Ground
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, GROUND_Y, WORLD_SPACE, CANVAS_H - GROUND_Y);
  ctx.fillStyle = C.purple;
  ctx.fillRect(0, GROUND_Y, WORLD_SPACE, 7);

  // Spike hazards
  level.hazards.forEach(h => {
    ctx.save();
    ctx.fillStyle = 'rgba(239,68,68,0.1)';
    ctx.fillRect(h.x, GROUND_Y, h.w, CANVAS_H - GROUND_Y);
    ctx.fillStyle = '#dc2626';
    for (let ix = h.x; ix < h.x + h.w; ix += 14) {
      ctx.beginPath();
      ctx.moveTo(ix, GROUND_Y + 14);
      ctx.lineTo(ix + 7, GROUND_Y);
      ctx.lineTo(ix + 14, GROUND_Y + 14);
      ctx.fill();
    }
    ctx.restore();
  });

  // Maze walls
  level.walls.forEach(w => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(w.x + 4, w.y + 4, w.w, w.h);
    ctx.fillStyle = C.slateWall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
    ctx.restore();
  });

  // Maze label
  ctx.save();
  ctx.fillStyle = 'rgba(0,229,255,0.6)'; ctx.font = "bold 13px 'Fredoka',sans-serif"; ctx.textAlign = 'center';
  ctx.fillText('〔 미로 구간 〕', 550, 50);
  ctx.fillText('〔 점프맵 구간 〕', 1800, 50);
  ctx.restore();

  // Platforms
  drawPlatforms(level.platforms);

  // Crystal goal
  const cx = level.crystalX;
  const cy = 310;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Date.now() / 360);
  ctx.shadowBlur = 25; ctx.shadowColor = C.cyan;
  ctx.fillStyle = 'rgba(0,229,255,0.9)';
  ctx.beginPath();
  ctx.moveTo(0, -30); ctx.lineTo(18, 0); ctx.lineTo(0, 30); ctx.lineTo(-18, 0);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  ctx.rotate(-Date.now() / 180);
  ctx.fillStyle = 'rgba(179,0,255,0.7)';
  ctx.beginPath();
  ctx.moveTo(0, -18); ctx.lineTo(12, 0); ctx.lineTo(0, 18); ctx.lineTo(-12, 0);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  // Crystal label
  ctx.save();
  ctx.font = "bold 14px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.fillStyle = C.cyan; ctx.textAlign = 'center';
  ctx.shadowBlur = 6; ctx.shadowColor = C.cyan;
  ctx.fillText('🏆 목표 크리스탈', cx, cy - 50);
  ctx.restore();
}

// ── Adventure ──────────────────────────────────────────────
function drawAdventureBg() {
  // Zone 0 Acid/Base (0-1150): soft lavender
  ctx.fillStyle = '#f5f0ff'; ctx.fillRect(0, 0, 1150, CANVAS_H);
  // Zone 1 Motion (1150-2300): warm cream
  ctx.fillStyle = '#fffbeb'; ctx.fillRect(1150, 0, 1150, CANVAS_H);
  // Zone 2 Plants (2300-3450): mint
  ctx.fillStyle = '#f0fdf4'; ctx.fillRect(2300, 0, 1150, CANVAS_H);
  // Zone 3 Earth (3450-4550): sky blue
  ctx.fillStyle = '#f0f9ff'; ctx.fillRect(3450, 0, 1100, CANVAS_H);
  // Zone 4 Boss (4550-5200): pale red
  ctx.fillStyle = '#fff1f2'; ctx.fillRect(4550, 0, 700, CANVAS_H);

  ctx.save();
  ctx.globalAlpha = 0.22;

  // Zone 0 – beaker bubbles
  ctx.fillStyle = '#d8b4fe';
  ctx.beginPath(); ctx.arc(200, 200, 80, 0, Math.PI*2); ctx.fill();
  for (let i = 0; i < 5; i++) {
    const by = 380 - ((deco.bubbleT * 15 + i * 42) % 120);
    ctx.beginPath(); ctx.arc(210 + i*12, by, 5, 0, Math.PI*2); ctx.fill();
  }

  // Zone 1 – gears
  ctx.fillStyle = '#e2e8f0';
  drawGear(1400, 150, 55, deco.gearA);
  drawGear(1480, 195, 35, -deco.gearA * 1.5);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.globalAlpha = 0.2;
  const px2 = 1850 + Math.sin(deco.pendA) * 140; const py2 = 80 + Math.cos(deco.pendA) * 140;
  ctx.beginPath(); ctx.moveTo(1850, 80); ctx.lineTo(px2, py2); ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.arc(px2, py2, 20, 0, Math.PI*2); ctx.fill();

  // Zone 2 – trees
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#86efac';
  [2400, 2650, 2900, 3150].forEach(tx => {
    ctx.beginPath(); ctx.moveTo(tx, 460); ctx.lineTo(tx-55, 220); ctx.lineTo(tx+55, 220); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(tx, 190, 65, 0, Math.PI*2); ctx.fill();
  });

  // Zone 3 – stars + earth
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#7dd3fc';
  for (let i = 0; i < 28; i++) {
    const sx = 3480 + (i*97) % 900; const sy = (i*37)%340+30;
    ctx.beginPath(); ctx.arc(sx, sy, 1.5+Math.sin(Date.now()/200+i), 0, Math.PI*2); ctx.fill();
  }
  const sunX = 3950; const sunY = 150;
  const sg = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 65);
  sg.addColorStop(0,'#fff'); sg.addColorStop(0.3,'#f59e0b'); sg.addColorStop(1,'rgba(245,158,11,0)');
  ctx.fillStyle = sg; ctx.globalAlpha = 0.35;
  ctx.beginPath(); ctx.arc(sunX, sunY, 65, 0, Math.PI*2); ctx.fill();
  const ex = sunX + Math.cos(deco.earthA)*120; const ey = sunY + Math.sin(deco.earthA)*120;
  ctx.fillStyle = '#3b82f6'; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.arc(ex, ey, 13, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4ade80';
  ctx.beginPath(); ctx.arc(ex-3, ey-2, 5, 0, Math.PI*2); ctx.fill();

  // Zone 4 boss concentric rings
  ctx.globalAlpha = 0.12; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  [60,100,140,180].forEach(r => {
    ctx.beginPath(); ctx.arc(4950, 200, r, 0, Math.PI*2); ctx.stroke();
  });

  ctx.restore();
}

function drawGear(cx, cy, r, angle) {
  const teeth = 10;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rad = (i % 2 === 0) ? r : r * 0.75;
    if (i === 0) ctx.moveTo(Math.cos(a)*rad, Math.sin(a)*rad);
    else ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAdventureGround() {
  const segs = [
    { s:0,    e:580,   style:'lab'   },
    { s:710,  e:1620,  style:'road'  },
    { s:1760, e:2620,  style:'plant' },
    { s:2760, e:3620,  style:'space' },
    { s:3780, e:5200,  style:'space' },
  ];
  segs.forEach(seg => {
    const w = seg.e - seg.s;
    ctx.save();
    if (seg.style==='lab') {
      ctx.fillStyle = '#ede9fe'; ctx.fillRect(seg.s, GROUND_Y, w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = C.acid;   ctx.fillRect(seg.s, GROUND_Y, w, 8);
    } else if (seg.style==='road') {
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(seg.s, GROUND_Y, w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = C.motion;  ctx.fillRect(seg.s, GROUND_Y, w, 8);
    } else if (seg.style==='plant') {
      ctx.fillStyle = '#dcfce7'; ctx.fillRect(seg.s, GROUND_Y, w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = C.plants;  ctx.fillRect(seg.s, GROUND_Y, w, 10);
    } else {
      ctx.fillStyle = '#e0f2fe'; ctx.fillRect(seg.s, GROUND_Y, w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = C.earth;   ctx.fillRect(seg.s, GROUND_Y, w, 8);
    }
    ctx.restore();
  });
}

function drawHazards() {
  adventureHazards.forEach(h => {
    ctx.save();
    if (h.type === 'acid') {
      ctx.fillStyle = 'rgba(155,39,175,0.35)';
      ctx.fillRect(h.x, GROUND_Y, h.w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = 'rgba(155,39,175,0.6)';
      for (let i=0;i<3;i++) {
        const by = GROUND_Y+20+((deco.bubbleT*10+i*25)%40);
        const bx = h.x+20+i*38;
        ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI*2); ctx.fill();
      }
    } else if (h.type === 'spikes') {
      ctx.fillStyle = 'rgba(245,158,11,0.2)';
      ctx.fillRect(h.x, GROUND_Y, h.w, CANVAS_H-GROUND_Y);
      ctx.fillStyle = '#d97706';
      for (let ix=h.x; ix<h.x+h.w; ix+=14) {
        ctx.beginPath(); ctx.moveTo(ix, GROUND_Y+14); ctx.lineTo(ix+7, GROUND_Y); ctx.lineTo(ix+14, GROUND_Y+14); ctx.fill();
      }
    } else if (h.type === 'thorns') {
      ctx.fillStyle = 'rgba(34,197,94,0.2)';
      ctx.fillRect(h.x, GROUND_Y, h.w, CANVAS_H-GROUND_Y);
      ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3;
      for (let ix=h.x; ix<h.x+h.w-10; ix+=22) {
        ctx.beginPath(); ctx.arc(ix+10, GROUND_Y+10, 10, 0, Math.PI, true); ctx.stroke();
      }
    } else if (h.type === 'void') {
      ctx.fillStyle = '#e2e8f0'; ctx.fillRect(h.x, GROUND_Y, h.w, CANVAS_H-GROUND_Y);
    }
    ctx.strokeStyle='rgba(239,68,68,0.5)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(h.x, GROUND_Y); ctx.lineTo(h.x, CANVAS_H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(h.x+h.w, GROUND_Y); ctx.lineTo(h.x+h.w, CANVAS_H); ctx.stroke();
    ctx.restore();
  });
}

function drawPlatforms(plats) {
  plats.forEach(plat => {
    ctx.save();
    ctx.fillStyle = 'rgba(100,116,139,0.1)';
    ctx.fillRect(plat.x+4, plat.y+4, plat.w, plat.h);
    if (plat.s==='lab') {
      ctx.fillStyle='#ede9fe'; ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle=C.acid;   ctx.fillRect(plat.x, plat.y, plat.w, 5);
    } else if (plat.s==='road') {
      ctx.fillStyle='#f1f5f9'; ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle=C.motion;  ctx.fillRect(plat.x, plat.y, plat.w, 5);
    } else if (plat.s==='plant') {
      ctx.fillStyle='#dcfce7'; ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle=C.plants;  ctx.fillRect(plat.x, plat.y, plat.w, 5);
    } else {
      ctx.fillStyle='#e0f2fe'; ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle=C.earth;   ctx.fillRect(plat.x, plat.y, plat.w, 5);
    }
    ctx.restore();
  });
}

function drawNPCs() {
  gs.npcs.forEach(npc => {
    ctx.save();
    const color = chapters[npc.id].color;
    const bounce = Math.sin(Date.now()/280) * 4;
    const p = gs.player;
    const near = Math.abs((p.x+p.w/2) - npc.x) < 90 && Math.abs((p.y+p.h) - npc.y) < 70;

    // "NPC" tag
    ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
    ctx.font = "bold 14px 'Fredoka','Noto Sans KR',sans-serif";
    ctx.fillStyle = '#1e293b'; ctx.textAlign = 'center';
    ctx.fillText('NPC', npc.x, npc.y - 88 + bounce);

    if (near) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fillRect(npc.x-72, npc.y-130, 144, 30);
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.strokeRect(npc.x-72, npc.y-130, 144, 30);
      ctx.font = "bold 11px 'Fredoka','Noto Sans KR',sans-serif";
      ctx.fillStyle = '#0f172a';
      ctx.fillText('[E] 키로 퀴즈 풀기', npc.x, npc.y - 110);
    }

    // Head
    ctx.shadowBlur = 0;
    ctx.fillStyle = color; ctx.fillRect(npc.x-18, npc.y-72, 36, 36);
    ctx.fillStyle = '#111'; ctx.fillRect(npc.x-10, npc.y-62, 6, 9); ctx.fillRect(npc.x+4, npc.y-62, 6, 9);
    // Body
    ctx.fillStyle = '#fff'; ctx.fillRect(npc.x-18, npc.y-36, 36, 24);
    ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=1; ctx.strokeRect(npc.x-18, npc.y-36, 36, 24);
    // Arms
    ctx.fillStyle = color;
    ctx.fillRect(npc.x-26, npc.y-36, 8, 18); ctx.fillRect(npc.x+18, npc.y-36, 8, 18);
    // Legs
    ctx.fillStyle = '#475569';
    ctx.fillRect(npc.x-14, npc.y-12, 10, 12); ctx.fillRect(npc.x+4, npc.y-12, 10, 12);
    ctx.restore();
  });
}

function drawBoss() {
  ctx.save();
  const by = boss.y + boss.hover;
  const p = gs.player;
  const near = Math.abs((p.x+p.w/2)-boss.x) < 120 && Math.abs((p.y+p.h/2)-boss.y) < 140;

  ctx.shadowBlur = 25; ctx.shadowColor = '#ef4444';
  ctx.font = "bold 17px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.fillStyle = '#ef4444'; ctx.textAlign = 'center';
  ctx.fillText('최종 보스 😈', boss.x, by - 118);

  if (near) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(20,10,30,0.96)';
    ctx.fillRect(boss.x-82, by-158, 164, 30);
    ctx.strokeStyle='#ef4444'; ctx.strokeRect(boss.x-82, by-158, 164, 30);
    ctx.font = "bold 11px 'Fredoka','Noto Sans KR',sans-serif";
    ctx.fillStyle='#fff'; ctx.fillText('[E] 키로 보스 대결 시작!', boss.x, by-138);
  }

  // Head
  ctx.fillStyle = C.bossDark; ctx.fillRect(boss.x-26, by-94, 52, 52);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(boss.x-18, by-80, 9, 13); ctx.fillRect(boss.x+9, by-80, 9, 13);
  ctx.fillStyle = '#fff';
  ctx.fillRect(boss.x-16, by-78, 4, 5); ctx.fillRect(boss.x+11, by-78, 4, 5);
  // Crown
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(boss.x-22,by-94); ctx.lineTo(boss.x-26,by-110); ctx.lineTo(boss.x-11,by-102);
  ctx.lineTo(boss.x,by-118); ctx.lineTo(boss.x+11,by-102); ctx.lineTo(boss.x+26,by-110);
  ctx.lineTo(boss.x+22,by-94);
  ctx.closePath(); ctx.fill();
  // Body & arms
  ctx.fillStyle='#1e1b4b'; ctx.fillRect(boss.x-26,by-42,52,32);
  ctx.fillStyle=C.bossDark; ctx.fillRect(boss.x-36,by-42,10,28); ctx.fillRect(boss.x+26,by-42,10,28);
  ctx.fillStyle='#312e81'; ctx.fillRect(boss.x-20,by-10,16,14); ctx.fillRect(boss.x+4,by-10,16,14);
  ctx.restore();
}

function drawPortal() {
  ctx.save();
  const portalX = 5000, portalY = 280;

  ctx.translate(portalX, portalY);
  ctx.rotate(Date.now()/160);

  const rg = ctx.createRadialGradient(0,0,5,0,0,52);
  rg.addColorStop(0, '#ffffff');
  rg.addColorStop(0.4, C.cyan);
  rg.addColorStop(1, 'rgba(179,0,255,0)');
  ctx.shadowBlur = 25; ctx.shadowColor = C.cyan;
  ctx.fillStyle = rg;
  ctx.beginPath(); ctx.arc(0,0,52,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Prompt
  const dist = Math.abs((gs.player.x+gs.player.w/2) - portalX);
  if (dist < 75) {
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    ctx.fillRect(portalX-80, portalY-100, 160, 32);
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 2;
    ctx.strokeRect(portalX-80, portalY-100, 160, 32);
    ctx.font = "bold 12px 'Fredoka','Noto Sans KR',sans-serif";
    ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center';
    ctx.fillText('[E] 다른 공간으로 이동!', portalX, portalY - 78);
  }
}

function drawBossBarrier() {
  const coll = gs.gems.filter(Boolean).length;
  if (coll >= 3 || boss.barrierOpen || boss.portalOpen || boss.cinematic) return;
  ctx.save();
  const alpha = 0.35 + Math.sin(Date.now()/160)*0.15;
  ctx.fillStyle = `rgba(239,68,68,${alpha})`;
  ctx.fillRect(4450, 0, 12, GROUND_Y);
  ctx.shadowBlur = 16; ctx.shadowColor = '#ef4444';
  ctx.fillStyle = '#ef4444'; ctx.fillRect(4449, 0, 3, GROUND_Y);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Arial'; ctx.textAlign = 'center';
  ctx.fillText('🔒', 4450, 240);
  ctx.restore();
}

function drawPlayer() {
  const p = gs.player;
  ctx.save();

  const walk   = Math.sin(p.animTime);
  const breath = Math.sin(Date.now()/150) * 1.5;
  const flying = p.flying && !boss.cinematic;
  const jumping = !p.grounded || flying;

  if (boss.cinematic) {
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    ctx.rotate(p.spinAngle);
  } else {
    let sx = 1, sy = 1;
    if (p.puffed) {
      sx = 1.35; sy = 1.35; // Puffed-up size!
    } else if (jumping) {
      sx = 0.9; sy = 1.1;
    } else if (Math.abs(p.vx) > 0.5) {
      sx = 1.05; sy = 0.95;
    }
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    ctx.rotate(p.spinAngle);
    ctx.scale(sx, sy);
  }

  const flip = p.facingRight ? 1 : -1;
  const bY = boss.cinematic ? 0 : breath * 0.5;

  if (flying) {
    const flap = Math.sin(Date.now()/80) * 6;
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = 'rgba(0,229,255,0.28)';
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawEllipsePath(-25, -6 + flap * 0.12, 15, 8 + Math.abs(flap) * 0.25, -0.45, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    drawEllipsePath(25, -6 - flap * 0.12, 15, 8 + Math.abs(flap) * 0.25, 0.45, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // Draw Inhale Cone visual
  if (p.inhaling) {
    ctx.save();
    ctx.fillStyle = 'rgba(147, 197, 253, 0.2)';
    ctx.beginPath();
    ctx.moveTo(10*flip, -10);
    ctx.lineTo(130*flip, -45);
    ctx.lineTo(130*flip, 25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Head
  const hg = ctx.createLinearGradient(-18, -36, 18, 0);
  hg.addColorStop(0, '#ffb6cd'); hg.addColorStop(1, C.kirbyPink);
  ctx.fillStyle = hg;
  ctx.fillRect(-18, -36 + bY, 36, 36);

  // Cheeks
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(-14*flip, -18+bY, 6, 4);
  ctx.fillRect( 8*flip, -18+bY, 6, 4);

  // Eyes
  ctx.fillStyle = '#222';
  ctx.fillRect(-8*flip, -28+bY, 4, 10);
  ctx.fillRect( 4*flip, -28+bY, 4, 10);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-8*flip, -28+bY, 3, 4);
  ctx.fillRect( 4*flip, -28+bY, 3, 4);

  // Mouth
  ctx.strokeStyle = '#8b2c3c'; ctx.lineWidth = 2;
  ctx.beginPath();
  if (p.puffed) {
    // Cute closed mouth holding breath
    ctx.arc(0, -14+bY, 4, 0, Math.PI*2);
    ctx.fillStyle = C.kirbyDark;
    ctx.fill();
  } else if (p.inhaling) {
    // Big open vacuum mouth
    ctx.arc(0, -12+bY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
  } else {
    ctx.arc(0, -14+bY, 3, 0, Math.PI);
  }
  ctx.stroke();

  // Body
  const bg2 = ctx.createLinearGradient(-18, 0, 18, 20);
  bg2.addColorStop(0, C.kirbyPink); bg2.addColorStop(1, C.kirbyDark);
  ctx.fillStyle = bg2; ctx.fillRect(-18, 0, 36, 20);

  // Arms
  ctx.fillStyle = C.kirbyPink;
  let a1y=0, a2y=0;
  if (jumping || boss.cinematic) { a1y = -12; a2y = -12; }
  else if (Math.abs(p.vx) > 0.5) { a1y = walk*6; a2y = -walk*6; }
  ctx.fillRect(-26, 2+a1y, 8, 16);
  ctx.fillRect(18, 2+a2y, 8, 16);

  // Legs
  ctx.fillStyle = '#ff2f56';
  let l1y=0, l2y=0;
  if (Math.abs(p.vx) > 0.5 && !jumping && !boss.cinematic) { l1y = walk*4; l2y = -walk*4; }
  ctx.fillRect(-16, 20+l1y, 12, 12);
  ctx.fillRect(  4, 20+l2y, 12, 12);

  // ── Draw Ability Hats ──
  if (p.poopHat) {
    ctx.save();
    ctx.fillStyle = '#8b5a2b';
    ctx.strokeStyle = '#5f3b1f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawEllipsePath(0, -38, 17, 7, 0, 0, Math.PI * 2);
    drawEllipsePath(0, -48, 12, 6, 0, 0, Math.PI * 2);
    drawEllipsePath(0, -57, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5f3b1f';
    ctx.beginPath();
    ctx.arc(0, -64, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(-7, -49, 3, 3);
    ctx.fillRect(4, -49, 3, 3);
    ctx.restore();
  } else if (p.ability) {
    ctx.save();
    let hatColor = '#ef4444';
    let label = '🔥';
    if (p.ability === 'acid')   { hatColor = '#db2777'; label = '🧪'; }
    if (p.ability === 'motion') { hatColor = '#eab308'; label = '⚙️'; }
    if (p.ability === 'plant')  { hatColor = '#10b981'; label = '🍃'; }
    if (p.ability === 'earth')  { hatColor = '#6366f1'; label = '☄️'; }

    // Draw cute pointy hat
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.moveTo(-16, -36);
    ctx.lineTo(0, -60);
    ctx.lineTo(16, -36);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Icon on hat
    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    ctx.fillText(label, -6, -42);
    ctx.restore();
  }

  ctx.restore();

  // Crown in cinematic
  if (boss.cinematic) {
    ctx.save();
    ctx.translate(p.x + p.w/2, boss.crownY);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-16,0); ctx.lineTo(-20,-12); ctx.lineTo(-8,-6);
    ctx.lineTo(0,-18); ctx.lineTo(8,-6); ctx.lineTo(20,-12); ctx.lineTo(16,0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0,-6,3,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

function drawProjectile() {
  if (!boss.projectile) return;
  const proj = boss.projectile;
  ctx.save();
  ctx.shadowBlur = 10; ctx.shadowColor = '#a855f7';
  ctx.fillStyle = '#1e1b4b'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(proj.x, proj.y, 14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawParticles() {
  gs.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

function drawCinematicOverlay() {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(gs.camX, 0, CANVAS_W, CANVAS_H);

  ctx.font = "bold 42px 'Fredoka','Noto Sans KR',sans-serif";
  ctx.textAlign = 'center';
  ctx.lineWidth = 6; ctx.strokeStyle = '#1e293b';
  const hue = (Date.now()/15) % 360;
  ctx.fillStyle = `hsl(${hue},100%,55%)`;
  ctx.strokeText('과학 6-1 마스터 달성! 👑', gs.camX + CANVAS_W/2, 120);
  ctx.fillText('과학 6-1 마스터 달성! 👑', gs.camX + CANVAS_W/2, 120);
  ctx.restore();
}

// ============================================================
//  MAIN LOOP
// ============================================================
function loop() {
  updatePhysics();
  draw();
  requestAnimationFrame(loop);
}

loop();
