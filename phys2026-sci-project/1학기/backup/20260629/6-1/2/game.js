// 과학실 방탈출 게임 매니저 (WASD 이동, 우클릭 조사, 좌클릭 풀이, 별풍선 효과)
class GameManager {
    constructor() {
        this.gameStartTime = null;
        this.timerInterval = null;
        
        this.gridSize = 16;
        this.currentStageId = 1;
        this.currentMissionIndex = 0;
        this.currentMission = null;
        
        this.isWalking = false;
        this.walkPath = [];
        this.walkTimeout = null;
        
        // 과학실 60개 사물 핫스팟 데이터 정의
        this.hotspots = [];
        this.initHotspots();
    }

    // 핫스팟 좌표 및 정보 등록
    initHotspots() {
        const stage1Coords = [[1, 1], [1, 3], [1, 5], [2, 2], [2, 4], [2, 6], [3, 1], [3, 3], [3, 5], [4, 2], [4, 4], [4, 6], [5, 1], [5, 3], [5, 5]];
        const stage1Icons = ['🧪', '🧪', '🧫', '🌡️', '🧪', '🔬', '🧪', '🧪', '🧫', '🌡️', '🧪', '🔬', '🧪', '🧪', '🧫'];
        
        const stage2Coords = [[9, 1], [9, 3], [9, 5], [10, 2], [10, 4], [10, 6], [11, 1], [11, 3], [11, 5], [12, 2], [12, 4], [12, 6], [13, 1], [13, 3], [13, 5]];
        const stage2Icons = ['🚗', '⏱️', '🏁', '📏', '⚙️', '🚗', '⏱️', '🏁', '📏', '⚙️', '🚗', '⏱️', '🏁', '📏', '⚙️'];
        
        const stage3Coords = [[1, 9], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11], [3, 13], [4, 10], [4, 12], [4, 14], [5, 9], [5, 11], [5, 13]];
        const stage3Icons = ['🌿', '🌸', '🍄', '🌲', '🔬', '🌿', '🌸', '🍄', '🌲', '🔬', '🌿', '🌸', '🍄', '🌲', '🔬'];
        
        const stage4Coords = [[9, 9], [9, 11], [9, 13], [10, 10], [10, 12], [10, 14], [11, 9], [11, 11], [11, 13], [12, 10], [12, 12], [12, 14], [13, 9], [13, 11], [13, 13]];
        const stage4Icons = ['🌎', '🔭', '☀️', '🌙', '🌌', '🌎', '🔭', '☀️', '🌙', '🌌', '🌎', '🔭', '☀️', '🌙', '🌌'];

        // 1단원
        stage1Coords.forEach((coord, idx) => {
            this.hotspots.push({
                id: 101 + idx,
                x: coord[0],
                y: coord[1],
                stageId: 1,
                missionIndex: idx,
                icon: stage1Icons[idx]
            });
        });

        // 2단원
        stage2Coords.forEach((coord, idx) => {
            this.hotspots.push({
                id: 201 + idx,
                x: coord[0],
                y: coord[1],
                stageId: 2,
                missionIndex: idx,
                icon: stage2Icons[idx]
            });
        });

        // 3단원
        stage3Coords.forEach((coord, idx) => {
            this.hotspots.push({
                id: 301 + idx,
                x: coord[0],
                y: coord[1],
                stageId: 3,
                missionIndex: idx,
                icon: stage3Icons[idx]
            });
        });

        // 4단원
        stage4Coords.forEach((coord, idx) => {
            this.hotspots.push({
                id: 401 + idx,
                x: coord[0],
                y: coord[1],
                stageId: 4,
                missionIndex: idx,
                icon: stage4Icons[idx]
            });
        });
    }

    // 게임 시작 시 초기화
    init() {
        this.setupEventListeners();
        this.setupKeyboardMovement();
        
        // 캐릭터 정보 동기화 및 맵 그리기
        character.updateDisplay();
        this.updateStageProgressBars();
        this.renderLabGrid();
    }

    setupEventListeners() {
        // 대기 화면에서 시작 버튼
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        
        // 사용자 이름 연동
        document.getElementById('nameInput').addEventListener('input', (e) => {
            character.setName(e.target.value.trim() || '과학소년');
        });

        // HUD 이름 변경 버튼
        document.getElementById('customizeBtn').addEventListener('click', () => {
            const newName = prompt('새로운 도전자 이름을 입력하세요:', character.name);
            if (newName && newName.trim()) {
                character.setName(newName.trim());
            }
        });

        // HUD 처음부터 리셋 버튼
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('restartBtnEnding').addEventListener('click', () => this.restart());

        // 퀴즈 OX 응답 버튼
        document.getElementById('quizTrueBtn').addEventListener('click', () => this.submitAnswer(true));
        document.getElementById('quizFalseBtn').addEventListener('click', () => this.submitAnswer(false));

        // 결과창 확인 후 닫기 버튼
        document.getElementById('btnNextAfterFeedback').addEventListener('click', () => this.handleNextQuizStep());

        // 엔딩 스크린에서 닫고 더 둘러보기 버튼
        document.getElementById('btnStayAndDecorate').addEventListener('click', () => {
            document.getElementById('completeScene').classList.remove('active-scene');
            document.getElementById('roomScene').classList.add('active-scene');
        });

        // 맵 마우스 우클릭 핸들러 (그리드 래퍼에 우클릭 바인딩하여 캡처)
        const gridEl = document.getElementById('scienceLabGrid');
        gridEl.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // 기본 웹 브라우저 컨텍스트 메뉴 무시
            
            // 타겟 셀 검출
            let cell = e.target;
            while (cell && !cell.classList.contains('grid-cell') && cell !== gridEl) {
                cell = cell.parentElement;
            }
            if (cell && cell.classList.contains('grid-cell')) {
                const tx = parseInt(cell.dataset.x);
                const ty = parseInt(cell.dataset.y);
                this.handleGridRightClick(tx, ty);
            }
        });
    }

    startGame() {
        const nameInput = document.getElementById('nameInput').value.trim();
        character.setName(nameInput || '과학소년');
        character.playerId = 'explorer_' + Math.floor(100 + Math.random() * 900);
        character.save();
        
        // 화면 교체
        document.getElementById('characterScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        character.updateDisplay();

        // 타이머 가동
        this.gameStartTime = Date.now();
        this.startTimer();

        // 맵 그리기 및 캐릭터 위치
        this.renderLabGrid();
        this.updateStageProgressBars();
    }

    // 경과 시간 초 표시
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        const timerEl = document.getElementById('timerDisplay');
        this.timerInterval = setInterval(() => {
            const elapsedSecs = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const m = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
            const s = String(elapsedSecs % 60).padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
        }, 1000);
    }

    // 그리드 16x16 설계 구조 (벽 여부 파악)
    isWall(x, y) {
        // 외곽 경계벽
        if (x === 0 || x === 15 || y === 15) return true;
        // 상단 경계벽 (7, 8번 열은 탈출 문이므로 제외)
        if (y === 0 && !(x === 7 || x === 8)) return true;
        
        // 십자형 내부 격벽 (문/통로는 비움)
        if (x === 7) {
            // 통로: Y=3, 4 (위쪽) 및 Y=11, 12 (아래쪽)
            if (!(y === 3 || y === 4 || y === 11 || y === 12)) return true;
        }
        if (y === 7) {
            // 통로: X=3, 4 (왼쪽) 및 X=11, 12 (오른쪽)
            if (!(x === 3 || x === 4 || x === 11 || x === 12)) return true;
        }
        return false;
    }

    // 16x16 그리드 렌더링
    renderLabGrid() {
        const gridEl = document.getElementById('scienceLabGrid');
        gridEl.innerHTML = '';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                // 1. 벽인지 확인
                const isWallCell = this.isWall(x, y);
                if (isWallCell) {
                    cell.classList.add('cell-wall');
                } else if (y === 0 && (x === 7 || x === 8)) {
                    // 탈출구
                    cell.className = 'grid-cell cell-exit';
                    const isAllClear = quizSystem.isAllComplete();
                    if (isAllClear) {
                        cell.classList.add('unlocked');
                        cell.innerHTML = '🔓';
                        cell.title = '탈출 가능! 이곳을 밟으세요!';
                    } else {
                        cell.classList.add('locked');
                        cell.innerHTML = '🔒';
                        cell.title = '아직 문이 잠겨있습니다 (60문제 풀이 필요)';
                    }
                } else {
                    cell.classList.add('cell-floor');
                    
                    // 각 사분면 별 테마 적용
                    if (x < 7 && y < 7) cell.classList.add('z1'); // 산과 염기
                    else if (x > 7 && y < 7) cell.classList.add('z2'); // 물체의 운동
                    else if (x < 7 && y > 7) cell.classList.add('z3'); // 식물의 구조
                    else if (x > 7 && y > 7) cell.classList.add('z4'); // 지구의 운동
                    else cell.classList.add('cell-doorway'); // 십자 통로
                    
                    // 핫스팟(사물) 배치 여부 확인
                    const hotspot = this.hotspots.find(h => h.x === x && h.y === y);
                    if (hotspot) {
                        const isSolved = missionSystem.isMissionCompleted(hotspot.stageId, hotspot.id - (hotspot.stageId * 100));
                        const hotspotEl = document.createElement('div');
                        hotspotEl.className = `hotspot ${isSolved ? 'solved' : 'unsolved'}`;
                        hotspotEl.textContent = hotspot.icon;
                        hotspotEl.title = `${hotspot.stageId}단원: ${hotspot.name || '과학 사물'} [마우스 우클릭으로 조사]`;
                        cell.appendChild(hotspotEl);
                    }
                }

                // 캐릭터 얹기
                if (x === character.islandX && y === character.islandY) {
                    const charHTML = `
                        <div id="gridPlayer" class="grid-player ${this.isWalking ? 'walking' : ''}">
                            <div class="boy-character">
                                <div class="boy-hair"></div>
                                <div class="boy-face">
                                    <div class="boy-eyes"></div>
                                    <div class="boy-mouth"></div>
                                </div>
                                <div class="boy-body"></div>
                                <div class="boy-shoes"></div>
                            </div>
                        </div>
                    `;
                    cell.insertAdjacentHTML('beforeend', charHTML);
                }

                gridEl.appendChild(cell);
            }
        }
    }

    // 마우스 우클릭 시 캐릭터 이동 및 사물 상호작용
    handleGridRightClick(tx, ty) {
        if (this.isWalking) {
            // 이미 걷는 도중이면 초기화 후 재검색
            this.stopWalking();
        }

        // 목적지가 벽이거나 캐릭터 본인 셀인 경우 리턴
        if (this.isWall(tx, ty)) return;
        if (tx === character.islandX && ty === character.islandY) return;

        // BFS 최단 경로 구하기
        const path = this.findPath(character.islandX, character.islandY, tx, ty);
        if (path && path.length > 0) {
            this.walkPath = path;
            this.isWalking = true;
            this.executeWalkStep(tx, ty);
        }
    }

    // BFS(너비 우선 탐색) 최단 경로 탐색 함수
    findPath(sx, sy, tx, ty) {
        const queue = [[sx, sy]];
        const visited = new Set();
        visited.add(`${sx},${sy}`);
        
        const parent = {};
        const key = (x, y) => `${x},${y}`;
        let found = false;

        while (queue.length > 0) {
            const [cx, cy] = queue.shift();
            if (cx === tx && cy === ty) {
                found = true;
                break;
            }

            const neighbors = [
                [cx - 1, cy],
                [cx + 1, cy],
                [cx, cy - 1],
                [cx, cy + 1]
            ];

            for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
                    if (!this.isWall(nx, ny) && !visited.has(key(nx, ny))) {
                        visited.add(key(nx, ny));
                        parent[key(nx, ny)] = [cx, cy];
                        queue.push([nx, ny]);
                    }
                }
            }
        }

        if (!found) return null;

        // 역추적하여 경로 구성
        const path = [];
        let curr = key(tx, ty);
        while (curr) {
            const [cx, cy] = curr.split(',').map(Number);
            path.unshift([cx, cy]);
            const p = parent[curr];
            curr = p ? key(p[0], p[1]) : null;
        }

        path.shift(); // 시작 좌표 제거
        return path;
    }

    executeWalkStep(finalTx, finalTy) {
        if (this.walkPath.length === 0) {
            this.isWalking = false;
            character.save();
            this.renderLabGrid();
            
            // 도착 시 상호작용 검출
            this.checkArrivalInteraction(finalTx, finalTy);
            return;
        }

        const [nextX, nextY] = this.walkPath.shift();
        character.islandX = nextX;
        character.islandY = nextY;
        
        this.renderLabGrid();

        // 120ms 간격으로 다음 칸 전진 (이동 속도 표현)
        this.walkTimeout = setTimeout(() => {
            this.executeWalkStep(finalTx, finalTy);
        }, 120);
    }

    stopWalking() {
        if (this.walkTimeout) clearTimeout(this.walkTimeout);
        this.isWalking = false;
        this.walkPath = [];
    }

    // 키보드 이동 이벤트 바인딩 (WASD / 방향키)
    setupKeyboardMovement() {
        document.addEventListener('keydown', (e) => {
            const gameActive = document.getElementById('gameScreen').classList.contains('active');
            const quizOpen = document.getElementById('quizScene').style.display === 'flex';
            if (!gameActive || quizOpen) return;

            const keyMap = {
                ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
                ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
                ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
                ArrowDown: [0, 1], s: [0, 1], S: [0, 1]
            };

            const move = keyMap[e.key];
            if (!move) return;
            e.preventDefault();

            // 키보드 조작 시 마우스 걷기는 즉각 차단
            this.stopWalking();

            const tx = character.islandX + move[0];
            const ty = character.islandY + move[1];

            if (tx >= 0 && tx < this.gridSize && ty >= 0 && ty < this.gridSize) {
                if (!this.isWall(tx, ty)) {
                    character.islandX = tx;
                    character.islandY = ty;
                    character.save();
                    this.renderLabGrid();
                    
                    // 이동한 목적지 상호작용 확인
                    this.checkArrivalInteraction(tx, ty);
                }
            }
        });
    }

    // 사물 또는 탈출문 위 도착 시 자동 이벤트 발동
    checkArrivalInteraction(x, y) {
        // 1. 탈출문 도착인지 판단
        if (y === 0 && (x === 7 || x === 8)) {
            const isAllClear = quizSystem.isAllComplete();
            if (isAllClear) {
                this.showEndingScene();
            } else {
                alert('🚨 아직 과학실 탈출 요건이 갖춰지지 않았습니다.\n(60개 문제를 모두 완료한 뒤 탈출하세요!)');
                // 한 칸 뒤로 밀기
                character.islandY = 1;
                this.renderLabGrid();
            }
            return;
        }

        // 2. 핫스팟 사물 도달 판단
        const hotspot = this.hotspots.find(h => h.x === x && h.y === y);
        if (hotspot) {
            const isSolved = missionSystem.isMissionCompleted(hotspot.stageId, hotspot.id - (hotspot.stageId * 100));
            if (!isSolved) {
                this.startHotspotQuiz(hotspot);
            }
        }
    }

    // 퀴즈 팝업 활성화
    startHotspotQuiz(hotspot) {
        this.currentStageId = hotspot.stageId;
        this.currentMissionIndex = hotspot.missionIndex;
        
        // 미션 정보 셋업 (missions.js 활용)
        const missions = missionSystem.getMissions(this.currentStageId);
        this.currentMission = missions[this.currentMissionIndex];

        // 넌센스 및 과학 퀴즈 셋업
        quizSystem.setupNextQuiz(this.currentStageId, this.currentMissionIndex);

        // UI 모달 리셋
        document.getElementById('quizFeedback').textContent = '';
        document.getElementById('quizFeedback').className = 'quiz-feedback';
        document.getElementById('btnNextAfterFeedback').style.display = 'none';
        
        // 모달창 오픈
        document.getElementById('quizScene').style.display = 'flex';

        if (quizSystem.isNonsenseTurn) {
            this.isSolvingNonsense = true;
            this.showNonsenseQuiz();
        } else {
            this.isSolvingNonsense = false;
            this.showScienceQuiz();
        }
    }

    showNonsenseQuiz() {
        document.getElementById('nonsenseBanner').style.display = 'block';
        document.getElementById('quizTitle').textContent = '🚨 돌발 장애물 수수께끼!';
        document.getElementById('quizPoints').textContent = '+5 P';
        document.getElementById('quizQuestion').textContent = quizSystem.currentNonsense.question;
        
        document.getElementById('quizOXInterface').style.display = 'none';
        this.renderChoiceButtons(quizSystem.currentNonsense.options);
    }

    showScienceQuiz() {
        document.getElementById('nonsenseBanner').style.display = 'none';
        const titles = {
            1: '🧪 산과 염기 연구소',
            2: '🏃 물체의 운동 트랙',
            3: '🌿 식물 구조 온실',
            4: '🌎 지구와 우주 관측소'
        };
        document.getElementById('quizTitle').textContent = titles[this.currentStageId] || '과학 퀴즈';
        document.getElementById('quizPoints').textContent = `+${this.currentMission.points} P`;
        document.getElementById('quizQuestion').textContent = quizSystem.currentQuiz.question;

        if (quizSystem.currentQuiz.type === 'OX') {
            document.getElementById('quizOXInterface').style.display = 'flex';
            document.getElementById('quizChoiceInterface').style.display = 'none';
        } else if (quizSystem.currentQuiz.type === 'CHOICE') {
            document.getElementById('quizOXInterface').style.display = 'none';
            this.renderChoiceButtons(quizSystem.currentQuiz.options);
        }
    }

    renderChoiceButtons(options) {
        const container = document.getElementById('choiceButtonsContainer');
        container.innerHTML = '';
        document.getElementById('quizChoiceInterface').style.display = 'block';

        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-choice pixel-btn';
            btn.innerHTML = `<strong>${index + 1}.</strong> ${opt}`;
            btn.addEventListener('click', () => this.submitAnswer(index));
            container.appendChild(btn);
        });
    }

    // 정답 제출
    submitAnswer(userAns) {
        if (document.getElementById('btnNextAfterFeedback').style.display === 'block') return;

        const feedbackEl = document.getElementById('quizFeedback');
        
        if (this.isSolvingNonsense) {
            const isCorrect = quizSystem.checkAnswer(userAns, true);
            if (isCorrect) {
                feedbackEl.textContent = `정답입니다! 🎉 보너스 +5 포인트를 획득했습니다!\n(설명: ${quizSystem.currentNonsense.explanation})`;
                feedbackEl.className = 'quiz-feedback correct';
                character.addPoints(5);
                
                // 별풍선 생성 애니메이션 호출
                this.spawnStarBalloons();
            } else {
                feedbackEl.textContent = `틀렸습니다! 🤣\n(설명: ${quizSystem.currentNonsense.explanation})`;
                feedbackEl.className = 'quiz-feedback incorrect';
            }
            
            document.getElementById('btnNextAfterFeedback').style.display = 'block';
            document.getElementById('btnNextAfterFeedback').textContent = '과학 문제 풀기 ➔';
        } else {
            const isCorrect = quizSystem.checkAnswer(userAns, false);
            if (isCorrect) {
                const gained = character.addPoints(this.currentMission.points);
                feedbackEl.textContent = `정답입니다! 🎉 정답을 맞춰 포인트를 획득했습니다! (+${gained} P)\n(설명: ${quizSystem.currentQuiz.explanation})`;
                feedbackEl.className = 'quiz-feedback correct';
                
                // 미션 완료 반영
                missionSystem.completeMission(this.currentStageId, this.currentMission.id);
                quizSystem.completeQuiz(this.currentStageId, this.currentMissionIndex);
                
                // 별풍선 애니메이션 호출
                this.spawnStarBalloons();

                this.updateStageProgressBars();
                this.renderLabGrid();
            } else {
                feedbackEl.textContent = `아쉽게도 틀렸습니다. 다시 고민해 볼까요?\n(설명: ${quizSystem.currentQuiz.explanation})`;
                feedbackEl.className = 'quiz-feedback incorrect';
            }
            
            document.getElementById('btnNextAfterFeedback').style.display = 'block';
            document.getElementById('btnNextAfterFeedback').textContent = '닫기 ➔';
        }
    }

    handleNextQuizStep() {
        if (this.isSolvingNonsense) {
            this.isSolvingNonsense = false;
            this.showScienceQuiz();
            document.getElementById('quizFeedback').textContent = '';
            document.getElementById('quizFeedback').className = 'quiz-feedback';
            document.getElementById('btnNextAfterFeedback').style.display = 'none';
        } else {
            document.getElementById('quizScene').style.display = 'none';
            
            // 모든 문제 60개 완료 시 탈출문 🔓 오픈 연출
            if (quizSystem.isAllComplete()) {
                this.renderLabGrid();
                alert('🔔 철컥! 모든 퀴즈가 해결되자 과학실 맨 위의 두꺼운 탈출문 잠금이 풀렸습니다!\n위쪽 중앙의 문(🔓)으로 이동해 탈출하세요!');
            }
        }
    }

    // 별풍선 애니메이션 생성 로직
    spawnStarBalloons() {
        const balloonLayer = document.getElementById('balloonLayer');
        if (!balloonLayer) return;

        // 3~5개의 별풍선을 동시에 생성
        const count = 3 + Math.floor(Math.random() * 3);
        const balloonColors = ['#ff4757', '#ff7f50', '#ffa502', '#2ed573', '#1e90ff', '#a55eee', '#ff6b81'];

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'star-balloon';
            
            // 랜덤 위치 및 딜레이
            const randomLeft = 10 + Math.random() * 80; // 10% ~ 90%
            const randomDelay = Math.random() * 0.6; // 0s ~ 0.6s
            const scale = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2
            const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

            balloon.style.left = `${randomLeft}%`;
            balloon.style.animationDelay = `${randomDelay}s`;
            balloon.style.transform = `scale(${scale})`;

            // 풍선 내부 몸체 구성 (별표 삽입)
            const body = document.createElement('div');
            body.className = 'star-balloon-body';
            body.style.background = `radial-gradient(circle at 20px 20px, ${color} 0%, #000 120%)`;
            body.style.borderColor = color;
            body.innerHTML = '⭐'; // 별풍선에 어울리는 별 삽입
            
            // 풍선 실
            const string = document.createElement('div');
            string.className = 'star-balloon-string';

            balloon.appendChild(body);
            balloon.appendChild(string);
            balloonLayer.appendChild(balloon);

            // 애니메이션 완료 후 소멸 및 파편 효과 발동
            setTimeout(() => {
                this.triggerStarExplosion(randomLeft);
                balloon.remove();
            }, 3500 + randomDelay * 1000);
        }
    }

    // 별풍선이 하늘에서 터질 때 파편 터짐 이펙트
    triggerStarExplosion(xPercent) {
        const balloonLayer = document.getElementById('balloonLayer');
        const burstCount = 8;
        
        for (let i = 0; i < burstCount; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.textContent = '⭐';
            
            // 풍선 높이 (터지는 위치 y ~15vh)
            star.style.left = `${xPercent}%`;
            star.style.top = `15vh`;
            
            // 퍼지는 방향 지정 (CSS 변수 활용)
            const angle = (i / burstCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 60;
            const dx = `${Math.cos(angle) * distance}px`;
            const dy = `${Math.sin(angle) * distance}px`;
            
            star.style.setProperty('--dx', dx);
            star.style.setProperty('--dy', dy);
            
            balloonLayer.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 1200);
        }
    }

    // 진척도 UI 갱신
    updateStageProgressBars() {
        let totalCompleted = 0;
        
        Object.keys(missionSystem.missions).forEach(stageId => {
            const completed = quizSystem.getCompletedCount(stageId);
            const total = 15; // 15개로 규정
            const percent = (completed / total) * 100;

            const countEl = document.getElementById(`completedCount${stageId}`);
            const fillEl = document.getElementById(`progressFill${stageId}`);
            
            if (countEl) countEl.textContent = completed;
            if (fillEl) fillEl.style.width = percent + '%';
            
            totalCompleted += completed;
        });

        // HUD 전체 진척도 표시
        const totalProgressEl = document.getElementById('totalProgressDisplay');
        if (totalProgressEl) {
            totalProgressEl.textContent = totalCompleted;
        }
    }

    // 탈출 성공 화면
    showEndingScene() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // 씬 탭 가동
        document.getElementById('roomScene').classList.remove('active-scene');
        document.getElementById('completeScene').classList.add('active-scene');

        const elapsedSecs = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const m = Math.floor(elapsedSecs / 60);
        const s = elapsedSecs % 60;
        
        document.getElementById('timeElapsed').textContent = `${m}분 ${s}초 (${elapsedSecs}초)`;
        document.getElementById('finalPoints').textContent = `${character.points} P`;
    }

    restart() {
        const res = confirm('모든 게임 진척도와 포인트를 날리고 탈출실 처음부터 다시 시작하겠습니까?');
        if (res) {
            this.stopWalking();
            if (this.timerInterval) clearInterval(this.timerInterval);

            // 데이터 완전 리셋
            character.reset();
            missionSystem.reset();
            quizSystem.reset();

            // 디폴트 상태 복구
            document.getElementById('gameScreen').classList.remove('active');
            document.getElementById('characterScreen').classList.add('active');
            document.getElementById('completeScene').classList.remove('active-scene');
            document.getElementById('nameInput').value = '';
            
            this.updateStageProgressBars();
            this.renderLabGrid();
            character.updateDisplay();
        }
    }
}

// 게임 매니저 인스턴스화
const gameManager = new GameManager();

document.addEventListener('DOMContentLoaded', () => {
    try {
        gameManager.init();
        console.log('🔬 과학실 방탈출 - 로딩 및 초기화 성공!');
    } catch (e) {
        console.error('❌ 게임 시작 실패:', e);
    }
});
