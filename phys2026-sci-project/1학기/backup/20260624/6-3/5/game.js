// ============================================================
// 과학 미로 탈출 게임 (Science Maze Escape Game)
// 6학년 1학기 과학 퀴즈
// ============================================================

// --- Configuration ---
const CONFIG = {
    MAZE_ROWS: 10,
    MAZE_COLS: 10,
    EXTRA_PASSAGE_RATIO: 0.24,
    PURSUIT_ROUTE_OPENINGS: 8,
    TEACHER_MOVE_INTERVAL: 750,
    PLAYER_MOVE_COOLDOWN: 140,
    STUN_DURATION: 3000,
    QUIZ_TILE_COUNT: 8,
    REQUIRED_QUIZZES: 3,
    LERP_SPEED: 0.18,
};

// --- Quiz Questions (6학년 1학기 과학) ---
const QUESTIONS = [
    // 지구와 달의 운동
    {
        category: '지구와 달의 운동',
        question: '하루 동안 태양이 움직이는 것처럼 보이는 까닭은?',
        options: ['지구가 자전하기 때문에', '태양이 지구 주위를 돌기 때문에', '달이 빠르게 움직이기 때문에', '지구가 공전만 하기 때문에'],
        answer: 0
    },
    {
        category: '지구와 달의 운동',
        question: '지구의 자전 방향은 어느 쪽인가요?',
        options: ['서쪽에서 동쪽 (시계 반대 방향)', '동쪽에서 서쪽 (시계 방향)', '남쪽에서 북쪽', '위에서 아래로'],
        answer: 0
    },
    {
        category: '지구와 달의 운동',
        question: '지구가 한 바퀴 자전하는 데 걸리는 시간은?',
        options: ['약 12시간', '약 24시간', '약 365일', '약 30일'],
        answer: 1
    },
    {
        category: '지구와 달의 운동',
        question: '달의 모양이 매일 조금씩 변하는 까닭은?',
        options: ['구름이 달을 가리기 때문에', '달이 스스로 빛을 내기 때문에', '달이 지구 주위를 공전하기 때문에', '지구의 그림자가 달을 가려서'],
        answer: 2
    },
    {
        category: '지구와 달의 운동',
        question: '여러 날 동안 같은 시각에 달을 관찰하면 달의 위치는 어떻게 변하나요?',
        options: ['동쪽에서 서쪽으로 이동한다', '서쪽에서 동쪽으로 이동한다', '움직이지 않는다', '남쪽에서 북쪽으로 이동한다'],
        answer: 1
    },
    // 여러 가지 기체
    {
        category: '여러 가지 기체',
        question: '산소의 성질로 옳은 것은?',
        options: ['색과 냄새가 있다', '물질이 타는 것을 도와준다', '석회수를 뿌옇게 한다', '공기보다 훨씬 가볍다'],
        answer: 1
    },
    {
        category: '여러 가지 기체',
        question: '이산화탄소를 석회수에 통과시키면 어떻게 되나요?',
        options: ['석회수가 더 맑아진다', '아무 변화가 없다', '석회수가 뿌옇게 흐려진다', '석회수가 끓기 시작한다'],
        answer: 2
    },
    {
        category: '여러 가지 기체',
        question: '산소를 발생시키는 올바른 방법은?',
        options: ['소금을 물에 녹인다', '물을 끓인다', '탄산수소나트륨에 식초를 넣는다', '묽은 과산화수소수에 이산화망가니즈를 넣는다'],
        answer: 3
    },
    {
        category: '여러 가지 기체',
        question: '이산화탄소를 발생시키는 올바른 방법은?',
        options: ['묽은 과산화수소수에 이산화망가니즈를 넣는다', '탄산수소나트륨에 식초를 넣는다', '물을 끓인다', '철을 물에 넣는다'],
        answer: 1
    },
    {
        category: '여러 가지 기체',
        question: '질소의 성질로 옳은 것은?',
        options: ['물질을 잘 태운다', '달걀 썩는 냄새가 난다', '색과 냄새가 없고 다른 물질을 잘 태우지 않는다', '석회수를 뿌옇게 변하게 한다'],
        answer: 2
    },
    // 식물의 구조와 기능
    {
        category: '식물의 구조와 기능',
        question: '식물의 뿌리가 하는 일로 옳은 것은?',
        options: ['광합성을 한다', '꽃가루를 만든다', '땅속의 물과 양분을 흡수한다', '산소를 흡수한다'],
        answer: 2
    },
    {
        category: '식물의 구조와 기능',
        question: '식물의 잎에서 광합성에 필요하지 않은 것은?',
        options: ['빛', '물', '질소', '이산화탄소'],
        answer: 2
    },
    {
        category: '식물의 구조와 기능',
        question: '잎의 기공에서 주로 일어나는 현상은?',
        options: ['소화 작용', '증산 작용', '발효 작용', '분해 작용'],
        answer: 1
    },
    {
        category: '식물의 구조와 기능',
        question: '식물의 줄기가 하는 일은?',
        options: ['양분을 저장만 한다', '꽃가루를 만든다', '광합성을 한다', '뿌리에서 흡수한 물이 이동하는 통로 역할을 한다'],
        answer: 3
    },
    {
        category: '식물의 구조와 기능',
        question: '광합성 결과 만들어지는 것은?',
        options: ['이산화탄소와 물', '녹말과 산소', '질소와 수소', '소금과 설탕'],
        answer: 1
    },
    // 빛과 렌즈
    {
        category: '빛과 렌즈',
        question: '빛이 나아가는 성질은?',
        options: ['구부러진다', '멈춘다', '직진한다', '뒤로 간다'],
        answer: 2
    },
    {
        category: '빛과 렌즈',
        question: '볼록 렌즈로 햇빛을 모으면 어떻게 되나요?',
        options: ['빛이 퍼진다', '빛이 한 점에 모인다', '빛이 사라진다', '빛이 반사된다'],
        answer: 1
    },
    {
        category: '빛과 렌즈',
        question: '프리즘에 햇빛을 통과시키면 어떻게 되나요?',
        options: ['빛이 사라진다', '흰색 빛이 더 밝아진다', '여러 가지 색의 빛으로 나뉜다', '빛이 한 점에 모인다'],
        answer: 2
    },
    {
        category: '빛과 렌즈',
        question: '볼록 렌즈로 가까이 있는 글자를 보면?',
        options: ['글자가 작게 보인다', '글자가 안 보인다', '글자의 색이 변한다', '글자가 크게 보인다'],
        answer: 3
    },
    {
        category: '빛과 렌즈',
        question: '우리 눈의 수정체와 비슷한 역할을 하는 렌즈는?',
        options: ['오목 렌즈', '볼록 렌즈', '프리즘', '평면 거울'],
        answer: 1
    },
];

// --- Utility Functions ---
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function dist(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function noise2d(r, c, salt = 0) {
    const n = Math.sin((r * 127.1 + c * 311.7 + salt * 74.7) * 12.9898) * 43758.5453;
    return n - Math.floor(n);
}

const MAZE_DIRECTIONS = [
    { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' },
    { dr: 0, dc: 1, wall: 'right', opposite: 'left' },
    { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },
    { dr: 0, dc: -1, wall: 'left', opposite: 'right' },
];

function isInsideMaze(rows, cols, r, c) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

function openWallCount(cell) {
    return Object.values(cell.walls).filter(wall => !wall).length;
}

function carvePassage(grid, rows, cols, r, c, dir) {
    const nr = r + dir.dr;
    const nc = c + dir.dc;
    if (!isInsideMaze(rows, cols, nr, nc) || !grid[r][c].walls[dir.wall]) {
        return false;
    }

    grid[r][c].walls[dir.wall] = false;
    grid[nr][nc].walls[dir.opposite] = false;
    return true;
}

function findClosedEdges(grid, rows, cols, filter = () => true) {
    const edges = [];
    const checkedDirs = MAZE_DIRECTIONS.filter(dir => dir.wall === 'right' || dir.wall === 'bottom');

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const dir of checkedDirs) {
                const nr = r + dir.dr;
                const nc = c + dir.dc;
                if (!isInsideMaze(rows, cols, nr, nc) || !grid[r][c].walls[dir.wall]) continue;
                if (filter(r, c, nr, nc, dir)) {
                    edges.push({ r, c, nr, nc, dir });
                }
            }
        }
    }

    return edges;
}

function addRouteOpenings(grid, rows, cols, route, maxOpenings) {
    const routeCells = new Set(route.map(cell => `${cell.r},${cell.c}`));
    const routeEdges = findClosedEdges(grid, rows, cols, (r, c, nr, nc) => {
        return routeCells.has(`${r},${c}`) && routeCells.has(`${nr},${nc}`);
    });

    let opened = 0;
    for (const edge of shuffle(routeEdges)) {
        if (opened >= maxOpenings) break;
        if (carvePassage(grid, rows, cols, edge.r, edge.c, edge.dir)) {
            opened++;
        }
    }

    return opened;
}

function ensureEscapeChoices(grid, rows, cols, cells) {
    for (const { r, c } of cells) {
        while (openWallCount(grid[r][c]) < 2) {
            const options = shuffle(MAZE_DIRECTIONS).filter(dir => {
                const nr = r + dir.dr;
                const nc = c + dir.dc;
                return isInsideMaze(rows, cols, nr, nc) && grid[r][c].walls[dir.wall];
            });

            if (options.length === 0 || !carvePassage(grid, rows, cols, r, c, options[0])) {
                break;
            }
        }
    }
}

function addMazeLoops(grid, rows, cols) {
    const targetOpenings = Math.max(12, Math.floor(rows * cols * CONFIG.EXTRA_PASSAGE_RATIO));
    const keyRoutes = [
        [{ r: 0, c: 0 }, ...findPath(grid, 0, 0, rows - 1, 0)],
        [{ r: 0, c: 0 }, ...findPath(grid, 0, 0, rows - 1, cols - 1)],
    ];

    let opened = 0;
    for (const route of keyRoutes) {
        opened += addRouteOpenings(grid, rows, cols, route, Math.ceil(CONFIG.PURSUIT_ROUTE_OPENINGS / keyRoutes.length));
    }

    const weightedEdges = [];
    for (const edge of findClosedEdges(grid, rows, cols)) {
        const degreeA = openWallCount(grid[edge.r][edge.c]);
        const degreeB = openWallCount(grid[edge.nr][edge.nc]);
        let weight = 1;

        if (degreeA <= 1 || degreeB <= 1) weight += 3;
        if (edge.r > 0 && edge.r < rows - 1 && edge.c > 0 && edge.c < cols - 1) weight += 1;
        if (noise2d(edge.r, edge.c, 5) > 0.7) weight += 1;

        for (let i = 0; i < weight; i++) {
            weightedEdges.push(edge);
        }
    }

    const used = new Set();
    for (const edge of shuffle(weightedEdges)) {
        if (opened >= targetOpenings) break;

        const key = `${edge.r},${edge.c}-${edge.nr},${edge.nc}`;
        if (used.has(key)) continue;
        used.add(key);

        if (carvePassage(grid, rows, cols, edge.r, edge.c, edge.dir)) {
            opened++;
        }
    }

    ensureEscapeChoices(grid, rows, cols, [
        { r: 0, c: 0 },
        { r: rows - 1, c: 0 },
        { r: rows - 1, c: cols - 1 },
    ]);
}

function traceMazeWalls(ctx, maze, rows, cols, cs) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cs;
            const y = r * cs;
            const cell = maze[r][c];

            if (r === 0 && cell.walls.top) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + cs, y);
                ctx.stroke();
            }
            if (c === 0 && cell.walls.left) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + cs);
                ctx.stroke();
            }
            if (cell.walls.right) {
                ctx.beginPath();
                ctx.moveTo(x + cs, y);
                ctx.lineTo(x + cs, y + cs);
                ctx.stroke();
            }
            if (cell.walls.bottom) {
                ctx.beginPath();
                ctx.moveTo(x, y + cs);
                ctx.lineTo(x + cs, y + cs);
                ctx.stroke();
            }
        }
    }
}

function drawCharacterToken(ctx, x, y, cs, character) {
    const {
        skin,
        shirt,
        hair,
        accent,
        backpack,
        stunned = false,
        cap = false,
        glasses = false,
        tie = false,
    } = character;

    ctx.save();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.beginPath();
    ctx.ellipse(x, y + cs * 0.29, cs * 0.25, cs * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(x, y, cs * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (backpack) {
        ctx.fillStyle = backpack;
        ctx.beginPath();
        ctx.ellipse(x - cs * 0.2, y + cs * 0.08, cs * 0.11, cs * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = shirt;
    ctx.beginPath();
    ctx.ellipse(x, y + cs * 0.16, cs * 0.22, cs * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = Math.max(1.4, cs * 0.03);
    ctx.stroke();

    if (tie) {
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(x, y + cs * 0.02);
        ctx.lineTo(x - cs * 0.05, y + cs * 0.25);
        ctx.lineTo(x + cs * 0.05, y + cs * 0.25);
        ctx.closePath();
        ctx.fill();
    }

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(x, y - cs * 0.12, cs * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = Math.max(1, cs * 0.02);
    ctx.stroke();

    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.arc(x, y - cs * 0.18, cs * 0.17, Math.PI, Math.PI * 2);
    ctx.fill();

    if (cap) {
        ctx.fillStyle = '#1e88e5';
        ctx.beginPath();
        ctx.ellipse(x, y - cs * 0.23, cs * 0.18, cs * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - cs * 0.18, y - cs * 0.22, cs * 0.36, cs * 0.04);
    }

    ctx.strokeStyle = '#0b1220';
    ctx.lineWidth = Math.max(1.4, cs * 0.025);
    if (stunned) {
        for (const dx of [-0.055, 0.055]) {
            ctx.beginPath();
            ctx.moveTo(x + cs * (dx - 0.025), y - cs * 0.12);
            ctx.lineTo(x + cs * (dx + 0.025), y - cs * 0.07);
            ctx.moveTo(x + cs * (dx + 0.025), y - cs * 0.12);
            ctx.lineTo(x + cs * (dx - 0.025), y - cs * 0.07);
            ctx.stroke();
        }
    } else {
        ctx.fillStyle = '#0b1220';
        ctx.beginPath();
        ctx.arc(x - cs * 0.055, y - cs * 0.1, cs * 0.018, 0, Math.PI * 2);
        ctx.arc(x + cs * 0.055, y - cs * 0.1, cs * 0.018, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - cs * 0.07, cs * 0.055, 0, Math.PI);
        ctx.stroke();
    }

    if (glasses) {
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = Math.max(1.2, cs * 0.022);
        for (const dx of [-0.055, 0.055]) {
            ctx.beginPath();
            ctx.arc(x + cs * dx, y - cs * 0.1, cs * 0.04, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(x - cs * 0.015, y - cs * 0.1);
        ctx.lineTo(x + cs * 0.015, y - cs * 0.1);
        ctx.stroke();
    }

    ctx.restore();
}

// --- Maze Generation (Recursive Backtracking) ---
function generateMaze(rows, cols) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = {
                walls: { top: true, right: true, bottom: true, left: true },
                visited: false,
            };
        }
    }

    const stack = [{ r: 0, c: 0 }];
    grid[0][0].visited = true;

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = [];

        for (const dir of MAZE_DIRECTIONS) {
            const nr = current.r + dir.dr;
            const nc = current.c + dir.dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc].visited) {
                neighbors.push({ r: nr, c: nc, dir });
            }
        }

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            grid[current.r][current.c].walls[next.dir.wall] = false;
            grid[next.r][next.c].walls[next.dir.opposite] = false;
            grid[next.r][next.c].visited = true;
            stack.push({ r: next.r, c: next.c });
        }
    }

    addMazeLoops(grid, rows, cols);

    return grid;
}

// --- BFS Pathfinding ---
function findPath(maze, sr, sc, er, ec) {
    const rows = maze.length;
    const cols = maze[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [{ r: sr, c: sc, path: [] }];
    visited[sr][sc] = true;

    while (queue.length > 0) {
        const { r, c, path } = queue.shift();
        if (r === er && c === ec) return path;

        for (const { dr, dc, wall } of MAZE_DIRECTIONS) {
            const nr = r + dr;
            const nc = c + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && !maze[r][c].walls[wall]
            ) {
                visited[nr][nc] = true;
                queue.push({ r: nr, c: nc, path: [...path, { r: nr, c: nc }] });
            }
        }
    }
    return [];
}

// ============================================================
// GAME CLASS
// ============================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.quizModal = document.getElementById('quiz-modal');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.winScreen = document.getElementById('win-screen');
        this.countdownEl = document.getElementById('countdown');
        this.stunEffect = document.getElementById('stun-effect');

        // HUD
        this.scoreDisplay = document.getElementById('score-display');
        this.stunDisplay = document.getElementById('stun-display');
        this.quizRequired = document.getElementById('quiz-required');

        // Quiz
        this.quizCategoryEl = document.getElementById('quiz-category');
        this.quizQuestionEl = document.getElementById('quiz-question');
        this.quizOptionsEl = document.getElementById('quiz-options');
        this.quizFeedbackEl = document.getElementById('quiz-feedback');

        // State
        this.state = 'start'; // start, countdown, playing, quiz, gameover, win
        this.maze = null;
        this.cellSize = 0;
        this.player = { r: 0, c: 0, x: 0, y: 0 };
        this.teacher = { r: 0, c: 0, x: 0, y: 0 };
        this.teacherStunned = false;
        this.teacherStunTimer = 0;
        this.quizTiles = [];
        this.solvedCount = 0;
        this.currentQuiz = null;
        this.usedQuestions = new Set();
        this.lastPlayerMove = 0;
        this.lastTeacherMove = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.particles = [];
        this.stunParticles = [];
        this.trailParticles = [];
        this.exitUnlocked = false;
        this.animFrame = 0;
        this.gameRunId = 0;

        // Input
        this.keysDown = new Set();

        this.setupCanvas();
        this.setupInput();
        this.showScreen('start');
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    setupCanvas() {
        const maxW = Math.min(window.innerWidth - 20, 680);
        const maxH = Math.min(window.innerHeight - (this.isMobile() ? 220 : 60), 680);
        const maxDim = Math.min(maxW, maxH);
        this.cellSize = Math.floor(maxDim / CONFIG.MAZE_COLS);
        const totalSize = this.cellSize * CONFIG.MAZE_COLS;

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = totalSize * dpr;
        this.canvas.height = totalSize * dpr;
        this.canvas.style.width = totalSize + 'px';
        this.canvas.style.height = totalSize + 'px';
        this.ctx.scale(dpr, dpr);
        this.totalSize = totalSize;
    }

    isMobile() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }

    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key.toLowerCase() === 'g') {
                e.preventDefault();
                this.forceClearBossBattle();
                return;
            }

            this.keysDown.add(e.key);
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => this.keysDown.delete(e.key));

        // Buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('retry-btn').addEventListener('click', () => this.startGame());
        document.getElementById('replay-btn').addEventListener('click', () => this.startGame());

        // Mobile D-pad
        const dirs = { 'dpad-up': 'ArrowUp', 'dpad-down': 'ArrowDown', 'dpad-left': 'ArrowLeft', 'dpad-right': 'ArrowRight' };
        for (const [cls, key] of Object.entries(dirs)) {
            const btn = document.querySelector('.' + cls);
            if (btn) {
                const startMove = (e) => {
                    e.preventDefault();
                    this.keysDown.add(key);
                };
                const stopMove = (e) => {
                    e.preventDefault();
                    this.keysDown.delete(key);
                };
                btn.addEventListener('touchstart', startMove, { passive: false });
                btn.addEventListener('touchend', stopMove, { passive: false });
                btn.addEventListener('touchcancel', stopMove, { passive: false });
                btn.addEventListener('mousedown', startMove);
                btn.addEventListener('mouseup', stopMove);
                btn.addEventListener('mouseleave', stopMove);
            }
        }

        // Resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }

    // --- Game Flow ---
    startGame() {
        this.gameRunId++;
        const runId = this.gameRunId;

        this.maze = generateMaze(CONFIG.MAZE_ROWS, CONFIG.MAZE_COLS);
        this.player = { r: 0, c: 0, x: 0, y: 0 };
        this.teacher = { r: CONFIG.MAZE_ROWS - 1, c: 0, x: 0, y: 0 };
        this.teacher.x = this.teacher.c;
        this.teacher.y = this.teacher.r;
        this.teacherStunned = false;
        this.teacherStunTimer = 0;
        this.solvedCount = 0;
        this.exitUnlocked = false;
        this.usedQuestions = new Set();
        this.particles = [];
        this.stunParticles = [];
        this.trailParticles = [];
        this.lastPlayerMove = 0;
        this.lastTeacherMove = 0;
        this.currentQuiz = null;

        this.placeQuizTiles();
        this.updateHUD();
        this.showScreen('countdown');
        this.runCountdown(runId);
    }

    placeQuizTiles() {
        this.quizTiles = [];
        const candidates = [];
        for (let r = 0; r < CONFIG.MAZE_ROWS; r++) {
            for (let c = 0; c < CONFIG.MAZE_COLS; c++) {
                // Skip player start, teacher start, and exit
                if (r === 0 && c === 0) continue;
                if (r === CONFIG.MAZE_ROWS - 1 && c === 0) continue;
                if (r === CONFIG.MAZE_ROWS - 1 && c === CONFIG.MAZE_COLS - 1) continue;
                candidates.push({ r, c });
            }
        }

        const shuffled = shuffle(candidates);
        const selected = [];
        for (const cell of shuffled) {
            if (selected.length >= CONFIG.QUIZ_TILE_COUNT) break;
            // Ensure some spacing
            const tooClose = selected.some(s => dist(s.r, s.c, cell.r, cell.c) < 2);
            if (!tooClose) {
                selected.push(cell);
            }
        }
        // If we don't have enough with spacing, fill up
        if (selected.length < CONFIG.QUIZ_TILE_COUNT) {
            for (const cell of shuffled) {
                if (selected.length >= CONFIG.QUIZ_TILE_COUNT) break;
                if (!selected.some(s => s.r === cell.r && s.c === cell.c)) {
                    selected.push(cell);
                }
            }
        }

        // Assign random questions
        const availableQuestions = shuffle([...Array(QUESTIONS.length).keys()]);
        for (let i = 0; i < selected.length; i++) {
            this.quizTiles.push({
                r: selected[i].r,
                c: selected[i].c,
                questionIdx: availableQuestions[i % availableQuestions.length],
                solved: false,
            });
        }
    }

    async runCountdown(runId) {
        const countNum = this.countdownEl.querySelector('.count-num');
        for (let i = 3; i >= 1; i--) {
            if (runId !== this.gameRunId) return;
            countNum.textContent = i;
            countNum.style.animation = 'none';
            void countNum.offsetWidth;
            countNum.style.animation = 'countPop 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        if (runId !== this.gameRunId) return;
        countNum.textContent = '시작!';
        countNum.style.animation = 'none';
        void countNum.offsetWidth;
        countNum.style.animation = 'countPop 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        await new Promise(resolve => setTimeout(resolve, 600));

        if (runId !== this.gameRunId) return;
        this.startTime = performance.now();
        this.state = 'playing';
        this.showScreen('playing');
    }

    forceClearBossBattle() {
        this.gameRunId++;

        if (!this.maze) {
            this.maze = generateMaze(CONFIG.MAZE_ROWS, CONFIG.MAZE_COLS);
            this.player = { r: 0, c: 0, x: 0, y: 0 };
            this.teacher = { r: CONFIG.MAZE_ROWS - 1, c: 0, x: 0, y: 0 };
            this.teacher.x = this.teacher.c;
            this.teacher.y = this.teacher.r;
            this.quizTiles = [];
            this.placeQuizTiles();
            this.startTime = performance.now();
        }

        this.currentQuiz = null;
        this.solvedCount = CONFIG.REQUIRED_QUIZZES;
        this.exitUnlocked = true;
        this.teacherStunned = true;
        this.teacherStunTimer = performance.now() + CONFIG.STUN_DURATION;
        this.quizTiles.forEach(tile => {
            tile.solved = true;
        });

        this.updateHUD();
        this.spawnCelebrationParticles();
        this.showScreen('win');
    }

    showScreen(screen) {
        this.state = screen;
        this.startScreen.classList.add('hidden');
        this.quizModal.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
        this.winScreen.classList.add('hidden');
        this.countdownEl.classList.add('hidden');

        switch (screen) {
            case 'start':
                this.startScreen.classList.remove('hidden');
                break;
            case 'countdown':
                this.countdownEl.classList.remove('hidden');
                break;
            case 'quiz':
                this.quizModal.classList.remove('hidden');
                break;
            case 'gameover':
                this.gameoverScreen.classList.remove('hidden');
                document.getElementById('gameover-solved').textContent = this.solvedCount;
                break;
            case 'win':
                this.winScreen.classList.remove('hidden');
                this.elapsedTime = ((performance.now() - this.startTime) / 1000).toFixed(1);
                document.getElementById('win-time').textContent = this.elapsedTime + '초';
                document.getElementById('win-solved').textContent = this.solvedCount;
                break;
        }
    }

    updateHUD() {
        this.scoreDisplay.textContent = `문제: ${this.solvedCount}/${CONFIG.REQUIRED_QUIZZES}`;
        this.quizRequired.textContent = this.exitUnlocked ? '🔓 출구 열림!' : `🔒 ${CONFIG.REQUIRED_QUIZZES - this.solvedCount}문제 더`;

        if (this.teacherStunned) {
            const remaining = Math.max(0, (this.teacherStunTimer - performance.now()) / 1000).toFixed(1);
            this.stunDisplay.textContent = `⚡ 기절: ${remaining}초`;
            this.stunDisplay.classList.remove('hidden');
            this.stunEffect.classList.add('active');
        } else {
            this.stunDisplay.classList.add('hidden');
            this.stunEffect.classList.remove('active');
        }
    }

    // --- Player Movement ---
    handlePlayerInput(now) {
        if (this.state !== 'playing') return;
        if (now - this.lastPlayerMove < CONFIG.PLAYER_MOVE_COOLDOWN) return;

        let dr = 0, dc = 0, wallKey = '';
        if (this.keysDown.has('ArrowUp') || this.keysDown.has('w') || this.keysDown.has('W')) {
            dr = -1; wallKey = 'top';
        } else if (this.keysDown.has('ArrowDown') || this.keysDown.has('s') || this.keysDown.has('S')) {
            dr = 1; wallKey = 'bottom';
        } else if (this.keysDown.has('ArrowLeft') || this.keysDown.has('a') || this.keysDown.has('A')) {
            dc = -1; wallKey = 'left';
        } else if (this.keysDown.has('ArrowRight') || this.keysDown.has('d') || this.keysDown.has('D')) {
            dc = 1; wallKey = 'right';
        }

        if (wallKey === '') return;

        const nr = this.player.r + dr;
        const nc = this.player.c + dc;

        if (
            nr >= 0 && nr < CONFIG.MAZE_ROWS &&
            nc >= 0 && nc < CONFIG.MAZE_COLS &&
            !this.maze[this.player.r][this.player.c].walls[wallKey]
        ) {
            // Add trail particle
            this.trailParticles.push({
                x: this.player.c * this.cellSize + this.cellSize / 2,
                y: this.player.r * this.cellSize + this.cellSize / 2,
                life: 1,
                decay: 0.03,
            });

            this.player.r = nr;
            this.player.c = nc;
            this.lastPlayerMove = now;

            this.checkQuizTile();
            this.checkExit();
            this.checkCollision();
        }
    }

    checkQuizTile() {
        const tile = this.quizTiles.find(t => t.r === this.player.r && t.c === this.player.c && !t.solved);
        if (tile) {
            this.triggerQuiz(tile);
        }
    }

    checkExit() {
        if (
            this.player.r === CONFIG.MAZE_ROWS - 1 &&
            this.player.c === CONFIG.MAZE_COLS - 1
        ) {
            if (this.exitUnlocked) {
                this.state = 'win';
                this.showScreen('win');
                this.spawnCelebrationParticles();
            }
        }
    }

    checkCollision() {
        if (
            this.player.r === this.teacher.r &&
            this.player.c === this.teacher.c &&
            !this.teacherStunned
        ) {
            this.state = 'gameover';
            this.showScreen('gameover');
        }
    }

    // --- Teacher AI ---
    updateTeacher(now) {
        if (this.state !== 'playing') return;

        // Check stun
        if (this.teacherStunned) {
            if (now >= this.teacherStunTimer) {
                this.teacherStunned = false;
            } else {
                // Spawn stun particles
                if (Math.random() < 0.15) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = this.cellSize * 0.4;
                    this.stunParticles.push({
                        x: this.teacher.c * this.cellSize + this.cellSize / 2 + Math.cos(angle) * radius,
                        y: this.teacher.r * this.cellSize + this.cellSize / 2 + Math.sin(angle) * radius,
                        char: '⭐',
                        life: 1,
                        decay: 0.02,
                        angle,
                        radius,
                        centerX: this.teacher.c * this.cellSize + this.cellSize / 2,
                        centerY: this.teacher.r * this.cellSize + this.cellSize / 2,
                    });
                }
                return;
            }
        }

        if (now - this.lastTeacherMove < CONFIG.TEACHER_MOVE_INTERVAL) return;

        const path = findPath(this.maze, this.teacher.r, this.teacher.c, this.player.r, this.player.c);
        if (path.length > 0) {
            this.teacher.r = path[0].r;
            this.teacher.c = path[0].c;
            this.lastTeacherMove = now;

            this.checkCollision();
        }
    }

    stunTeacher() {
        this.teacherStunned = true;
        this.teacherStunTimer = performance.now() + CONFIG.STUN_DURATION;
        this.stunParticles = [];
    }

    // --- Quiz System ---
    triggerQuiz(tile) {
        this.state = 'quiz';
        this.currentQuiz = tile;
        const q = QUESTIONS[tile.questionIdx];

        this.quizCategoryEl.textContent = q.category;
        this.quizQuestionEl.textContent = q.question;
        this.quizFeedbackEl.textContent = '';
        this.quizFeedbackEl.className = '';
        this.quizOptionsEl.innerHTML = '';

        // Shuffle options but track correct answer
        const optionIndices = [0, 1, 2, 3];
        const shuffledIndices = shuffle(optionIndices);

        shuffledIndices.forEach((origIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = q.options[origIdx];
            btn.addEventListener('click', () => this.answerQuiz(origIdx, q.answer, btn));
            this.quizOptionsEl.appendChild(btn);
        });

        this.showScreen('quiz');
    }

    answerQuiz(selected, correct, btn) {
        const allBtns = this.quizOptionsEl.querySelectorAll('.quiz-option');

        if (selected === correct) {
            btn.classList.add('correct');
            allBtns.forEach(b => b.classList.add('disabled'));
            this.quizFeedbackEl.textContent = '🎉 정답! 과학쌤이 3초간 기절합니다!';
            this.quizFeedbackEl.className = 'correct-text';

            this.currentQuiz.solved = true;
            this.solvedCount++;
            if (this.solvedCount >= CONFIG.REQUIRED_QUIZZES) {
                this.exitUnlocked = true;
            }
            this.stunTeacher();
            this.updateHUD();

            // Spawn celebration particles
            for (let i = 0; i < 15; i++) {
                this.particles.push({
                    x: this.player.c * this.cellSize + this.cellSize / 2,
                    y: this.player.r * this.cellSize + this.cellSize / 2,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 1,
                    decay: 0.015 + Math.random() * 0.01,
                    color: ['#00ff88', '#00e5ff', '#ffd740', '#ff4081'][Math.floor(Math.random() * 4)],
                    size: 3 + Math.random() * 4,
                });
            }

            setTimeout(() => {
                this.state = 'playing';
                this.showScreen('playing');
            }, 1200);
        } else {
            btn.classList.add('wrong');
            this.quizFeedbackEl.textContent = '❌ 오답! 다시 도전하세요.';
            this.quizFeedbackEl.className = 'wrong-text';

            setTimeout(() => {
                this.state = 'playing';
                this.showScreen('playing');
            }, 1000);
        }
    }

    // --- Particles ---
    spawnCelebrationParticles() {
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: this.totalSize / 2,
                y: this.totalSize / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1,
                decay: 0.008 + Math.random() * 0.008,
                color: ['#00ff88', '#00e5ff', '#ffd740', '#ff4081', '#7c4dff'][Math.floor(Math.random() * 5)],
                size: 3 + Math.random() * 6,
            });
        }
    }

    updateParticles() {
        // Regular particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= p.decay;
            return p.life > 0;
        });

        // Trail particles
        this.trailParticles = this.trailParticles.filter(p => {
            p.life -= p.decay;
            return p.life > 0;
        });

        // Stun particles
        this.stunParticles = this.stunParticles.filter(p => {
            p.life -= p.decay;
            p.angle += 0.05;
            p.x = p.centerX + Math.cos(p.angle) * p.radius;
            p.y = p.centerY + Math.sin(p.angle) * p.radius - (1 - p.life) * 20;
            return p.life > 0;
        });
    }

    // --- Rendering ---
    render(now) {
        const ctx = this.ctx;
        const cs = this.cellSize;
        const ts = this.totalSize;

        // Clear
        ctx.fillStyle = '#0f131a';
        ctx.fillRect(0, 0, ts, ts);

        // Draw floor tiles
        for (let r = 0; r < CONFIG.MAZE_ROWS; r++) {
            for (let c = 0; c < CONFIG.MAZE_COLS; c++) {
                const x = c * cs;
                const y = r * cs;
                const shade = 24 + Math.floor(noise2d(r, c, 1) * 12);
                ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
                ctx.fillRect(x, y, cs, cs);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);

                if (noise2d(r, c, 8) > 0.77) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x + cs * (0.25 + noise2d(r, c, 2) * 0.2), y + cs * 0.35);
                    ctx.lineTo(x + cs * (0.55 + noise2d(r, c, 3) * 0.25), y + cs * 0.58);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        // Draw quiz tiles (pulsing glow)
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.004);
        for (const tile of this.quizTiles) {
            if (tile.solved) continue;
            const x = tile.c * cs + cs / 2;
            const y = tile.r * cs + cs / 2;

            // Glow
            const grad = ctx.createRadialGradient(x, y, 0, x, y, cs * 0.45);
            grad.addColorStop(0, `rgba(0, 255, 136, ${0.15 + pulse * 0.1})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(tile.c * cs, tile.r * cs, cs, cs);

            // Question mark
            ctx.save();
            ctx.font = `bold ${cs * 0.45}px 'Noto Sans KR'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(0, 255, 136, ${0.6 + pulse * 0.4})`;
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 12;
            ctx.fillText('?', x, y);
            ctx.restore();
        }

        // Draw exit
        {
            const exitR = CONFIG.MAZE_ROWS - 1;
            const exitC = CONFIG.MAZE_COLS - 1;
            const x = exitC * cs + cs / 2;
            const y = exitR * cs + cs / 2;
            const color = this.exitUnlocked ? '#ffd740' : '#ff5252';
            const alpha = 0.15 + pulse * 0.1;

            const grad = ctx.createRadialGradient(x, y, 0, x, y, cs * 0.5);
            grad.addColorStop(0, this.exitUnlocked ? `rgba(255, 215, 64, ${alpha})` : `rgba(255, 82, 82, ${alpha})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(exitC * cs, exitR * cs, cs, cs);

            ctx.save();
            ctx.font = `${cs * 0.5}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.fillText(this.exitUnlocked ? '🚪' : '🔒', x, y);
            ctx.restore();
        }

        // Draw trail particles
        for (const p of this.trailParticles) {
            ctx.save();
            ctx.globalAlpha = p.life * 0.4;
            ctx.fillStyle = '#4fc3f7';
            ctx.shadowColor = '#4fc3f7';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw maze walls
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.strokeStyle = '#090d12';
        ctx.lineWidth = Math.max(7, cs * 0.12);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 3;
        traceMazeWalls(ctx, this.maze, CONFIG.MAZE_ROWS, CONFIG.MAZE_COLS, cs);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = '#4d5967';
        ctx.lineWidth = Math.max(4, cs * 0.075);
        traceMazeWalls(ctx, this.maze, CONFIG.MAZE_ROWS, CONFIG.MAZE_COLS, cs);

        ctx.strokeStyle = 'rgba(215, 226, 235, 0.5)';
        ctx.lineWidth = 1.2;
        traceMazeWalls(ctx, this.maze, CONFIG.MAZE_ROWS, CONFIG.MAZE_COLS, cs);
        ctx.restore();

        // Draw outer border
        ctx.save();
        ctx.strokeStyle = '#070a0e';
        ctx.lineWidth = 8;
        ctx.strokeRect(1, 1, ts - 2, ts - 2);
        ctx.strokeStyle = '#6b7786';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, ts - 4, ts - 4);
        ctx.restore();

        // Smooth interpolation for characters
        this.player.x = lerp(this.player.x, this.player.c, CONFIG.LERP_SPEED);
        this.player.y = lerp(this.player.y, this.player.r, CONFIG.LERP_SPEED);
        this.teacher.x = lerp(this.teacher.x, this.teacher.c, CONFIG.LERP_SPEED);
        this.teacher.y = lerp(this.teacher.y, this.teacher.r, CONFIG.LERP_SPEED);

        // Draw Teacher
        {
            const tx = this.teacher.x * cs + cs / 2;
            const ty = this.teacher.y * cs + cs / 2;
            drawCharacterToken(ctx, tx, ty, cs, {
                skin: this.teacherStunned ? '#b8b8b8' : '#f2c7a4',
                shirt: this.teacherStunned ? '#5c6270' : '#b91c1c',
                hair: '#2f1f1a',
                accent: this.teacherStunned ? '#8a8f9c' : '#ff5252',
                stunned: this.teacherStunned,
                glasses: true,
                tie: true,
            });
        }

        // Draw stun particles (stars around teacher)
        for (const p of this.stunParticles) {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.font = `${12 + (1 - p.life) * 6}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.char, p.x, p.y);
            ctx.restore();
        }

        // Draw Player
        {
            const px = this.player.x * cs + cs / 2;
            const py = this.player.y * cs + cs / 2;

            drawCharacterToken(ctx, px, py, cs, {
                skin: '#f4c9a5',
                shirt: '#2563eb',
                hair: '#1f2937',
                accent: '#4fc3f7',
                backpack: '#0f766e',
                cap: true,
            });
        }

        // Draw celebration particles
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Game Loop ---
    gameLoop(timestamp) {
        this.animFrame++;

        if (this.state === 'playing') {
            this.handlePlayerInput(timestamp);
            this.updateTeacher(timestamp);
            this.updateHUD();
        }

        this.updateParticles();

        if (this.maze) {
            this.render(timestamp);
        }

        requestAnimationFrame(this.gameLoop);
    }
}

// --- Initialize ---
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
