// 판타지 숲속 과학 방탈출 메인 게임 매니저
class GameManager {
    constructor() {
        this.gameStartTime = null;
        
        // 현재 미션 상태 관리
        this.currentStageId = 1;
        this.currentMissionIndex = 0;
        this.currentMission = null;
        
        // 넌센스 단계 상태
        this.isSolvingNonsense = false;
        this.selectedCell = { x: 0, y: 0 };
        this.island3D = null;
        this.plantTimer = null;
        this.islandSize = 9;
    }

    // 게임 초기화
    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupShop();
        this.setupSocial();
        this.setupKeyboardMovement();
        this.setupIsland3D();
        this.renderIslandMap();
        
        // 초기 데이터 연동 시각화
        character.updateDisplay();
        this.updateStageProgressBars();
        this.renderSocial();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 캐릭터 스크린에서 게임 시작
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        
        // 이름 자동 반영
        document.getElementById('nameInput').addEventListener('input', (e) => {
            character.setName(e.target.value.trim() || '플레이어');
        });

        const playerIdInput = document.getElementById('playerIdInput');
        playerIdInput.value = character.playerId || '';
        this.updatePlayerIdStatus(playerIdInput.value);
        playerIdInput.addEventListener('input', (e) => {
            this.updatePlayerIdStatus(e.target.value);
        });

        // 닉네임 변경 버튼 (HUD)
        document.getElementById('customizeBtn').addEventListener('click', () => {
            const newName = prompt('새로운 모험가 이름을 입력하세요:', character.name);
            if (newName && newName.trim()) {
                character.setName(newName.trim());
            }
        });

        // 1, 2스테이지 입장 버튼
        document.querySelectorAll('.btn-stage-enter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stageId = parseInt(e.target.dataset.stage);
                this.enterStage(stageId);
            });
        });

        // 스테이지 목록에서 돌아가기
        document.getElementById('btnBackToStageSelect').addEventListener('click', () => {
            document.getElementById('stageMissionsView').style.display = 'none';
            document.getElementById('stageSelectView').style.display = 'block';
        });

        // OX 퀴즈 입력 리스너
        document.getElementById('quizTrueBtn').addEventListener('click', () => this.submitAnswer(true));
        document.getElementById('quizFalseBtn').addEventListener('click', () => this.submitAnswer(false));

        // 퀴즈 결과 확인 후 계속하기 버튼
        document.getElementById('btnNextAfterFeedback').addEventListener('click', () => this.handleNextQuizStep());

        // 배치 모달 취소 버튼
        document.getElementById('btnCancelPlacement').addEventListener('click', () => {
            document.getElementById('placementModal').style.display = 'none';
        });

        document.getElementById('goIslandBtn').addEventListener('click', () => this.switchTab('tabIsland'));
        document.getElementById('goSocialBtn').addEventListener('click', () => this.switchTab('tabSocial'));

        // 엔딩 스크린 버튼들
        document.getElementById('btnStayAndDecorate').addEventListener('click', () => {
            this.switchTab('tabIsland');
        });
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        
        // 기존 호환성용 리스너 (혹시 모를 오류 방지)
        const oldRestartBtn = document.querySelector('.complete-scene #restartBtn');
        if (oldRestartBtn && oldRestartBtn !== document.getElementById('restartBtn')) {
            oldRestartBtn.addEventListener('click', () => this.restart());
        }
    }

    // 탭 화면 전환 로직
    setupTabs() {
        const tabs = {
            'tabEscape': 'roomScene',
            'tabIsland': 'islandScene',
            'tabShop': 'shopScene',
            'tabSocial': 'socialScene'
        };

        Object.keys(tabs).forEach(tabId => {
            document.getElementById(tabId).addEventListener('click', () => {
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // 모든 탭 비활성화
        document.querySelectorAll('.menu-tabs button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-scene').forEach(scene => scene.classList.remove('active-scene'));
        
        // 선택한 탭 활성화
        document.getElementById(tabId).classList.add('active');
        
        const sceneId = tabId === 'tabEscape' ? 'roomScene'
            : (tabId === 'tabIsland' ? 'islandScene'
                : (tabId === 'tabShop' ? 'shopScene' : 'socialScene'));
        document.getElementById(sceneId).classList.add('active-scene');

        // 특정 탭 진입 시 렌더링 업데이트
        if (tabId === 'tabIsland') {
            this.renderIslandMap();
        } else if (tabId === 'tabShop') {
            this.renderShop('equipment');
        } else if (tabId === 'tabEscape') {
            this.updateStageProgressBars();
        } else if (tabId === 'tabSocial') {
            this.renderSocial();
        }
    }

    // 게임 시작
    startGame() {
        const nameInput = document.getElementById('nameInput').value.trim();
        const playerIdInput = document.getElementById('playerIdInput').value.trim();
        const idResult = character.claimPlayerId(playerIdInput);
        if (!idResult.success) {
            this.updatePlayerIdStatus(playerIdInput);
            alert(idResult.msg);
            document.getElementById('playerIdInput').focus();
            return;
        }

        character.setName(nameInput || '플레이어');
        
        this.gameStartTime = Date.now();
        document.getElementById('characterScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        
        // 기본 탭인 과학 방탈출로 이동
        this.switchTab('tabEscape');
        character.updateDisplay();
    }

    updatePlayerIdStatus(rawId) {
        const status = document.getElementById('playerIdStatus');
        if (!status) return;
        const normalized = character.normalizeId(rawId);
        if (!normalized) {
            status.textContent = '친구 추가와 거래에 쓰이는 나만의 아이디입니다.';
            status.className = 'input-help';
            return;
        }
        if (!/^[a-z0-9_-]{3,12}$/.test(normalized)) {
            status.textContent = '영문 소문자, 숫자, _, - 조합 3~12자로 입력해 주세요.';
            status.className = 'input-help invalid';
            return;
        }
        if (character.isIdAvailable(normalized)) {
            status.textContent = `${normalized} 아이디를 사용할 수 있습니다.`;
            status.className = 'input-help valid';
        } else {
            status.textContent = '이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.';
            status.className = 'input-help invalid';
        }
    }

    // 스테이지 진행률 업데이트
    updateStageProgressBars() {
        Object.keys(missionSystem.missions).forEach(stageId => {
            const completed = missionSystem.getCompletedCount(stageId);
            const total = missionSystem.getMissions(stageId).length;
            const percent = total > 0 ? (completed / total) * 100 : 0;
            const countEl = document.getElementById(`completedCount${stageId}`);
            const fillEl = document.getElementById(`progressFill${stageId}`);
            if (countEl) countEl.textContent = completed;
            if (fillEl) fillEl.style.width = percent + '%';
        });
    }

    // 특정 스테이지로 진입
    enterStage(stageId) {
        this.currentStageId = stageId;
        
        // 스테이지 타이틀 지정
        const titleEl = document.getElementById('currentStageTitle');
        const titles = {
            1: '🧪 1구간: 산성과 염기성 연구실',
            2: '🏃 2구간: 물체의 운동 숲속 트랙',
            3: '🌿 3구간: 식물의 구조와 기능 온실',
            4: '🌎 4구간: 지구의 운동 관측소'
        };
        titleEl.textContent = titles[stageId] || '과학 탐구 구역';

        // 미션 그리드 렌더링
        this.renderMissionsList();

        // 뷰 전환
        document.getElementById('stageSelectView').style.display = 'none';
        document.getElementById('stageMissionsView').style.display = 'block';
    }

    // 미션 목록 생성
    renderMissionsList() {
        const missionsList = document.getElementById('missionsList');
        missionsList.innerHTML = '';

        const stageMissions = missionSystem.getMissions(this.currentStageId);
        
        stageMissions.forEach((mission, index) => {
            const isCompleted = missionSystem.isMissionCompleted(this.currentStageId, mission.id);
            const missionBox = document.createElement('div');
            missionBox.className = `mission-box ${isCompleted ? 'completed' : ''}`;
            
            // 미션 아이콘 (완료/미완료)
            const icon = isCompleted ? '✅' : (this.currentStageId === 1 ? '🧪' : '⚙️');
            
            missionBox.innerHTML = `
                <div class="mission-icon">${icon}</div>
                <div class="mission-num">미션 #${index + 1}</div>
                <div class="mission-txt">${mission.title}</div>
                <div class="mission-pts">+${mission.points} P</div>
            `;

            // 클릭 시 퀴즈 시작 (미완료 시에만)
            if (!isCompleted) {
                missionBox.addEventListener('click', () => {
                    this.startMissionQuiz(index);
                });
            }

            missionsList.appendChild(missionBox);
        });
    }

    // 퀴즈 미션 모작 시작
    startMissionQuiz(missionIndex) {
        this.currentMissionIndex = missionIndex;
        this.currentMission = missionSystem.getMissions(this.currentStageId)[missionIndex];
        
        // 퀴즈 정보 셋업
        quizSystem.setupNextQuiz(this.currentStageId, missionIndex);
        
        // 화면 리셋
        document.getElementById('quizFeedback').textContent = '';
        document.getElementById('quizFeedback').className = 'quiz-feedback';
        document.getElementById('btnNextAfterFeedback').style.display = 'none';
        
        // 모달 띄우기
        document.getElementById('quizScene').style.display = 'flex';

        // 넌센스인지 과학 퀴즈인지 판정 후 렌더링
        if (quizSystem.isNonsenseTurn) {
            this.isSolvingNonsense = true;
            this.showNonsenseQuiz();
        } else {
            this.isSolvingNonsense = false;
            this.showScienceQuiz();
        }
    }

    // 넌센스 퀴즈 렌더링
    showNonsenseQuiz() {
        document.getElementById('nonsenseBanner').style.display = 'block';
        document.getElementById('quizTitle').textContent = '🚨 돌발 장애물 퀴즈!';
        document.getElementById('quizPoints').textContent = '+5 보너스 P';
        document.getElementById('quizQuestion').textContent = quizSystem.currentNonsense.question;
        
        // 단답식/OX UI 숨기기
        document.getElementById('quizOXInterface').style.display = 'none';
        
        // 객관식 보기 생성
        this.renderChoiceButtons(quizSystem.currentNonsense.options);
    }

    // 과학 퀴즈 렌더링
    showScienceQuiz() {
        document.getElementById('nonsenseBanner').style.display = 'none';
        const titles = {
            1: '🧪 산성과 염기성 퀴즈',
            2: '🏃 물체의 운동 퀴즈',
            3: '🌿 식물의 구조와 기능 퀴즈',
            4: '🌎 지구의 운동 퀴즈'
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

    // 객관식 선택형 보기 렌더링
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

    // 정답 제출 처리
    submitAnswer(userAns) {
        // 이미 푼 경우 중복 제출 방지
        if (document.getElementById('btnNextAfterFeedback').style.display === 'block') return;

        const feedbackEl = document.getElementById('quizFeedback');
        
        if (this.isSolvingNonsense) {
            // 넌센스 채점
            const isCorrect = quizSystem.checkAnswer(userAns, true);
            if (isCorrect) {
                feedbackEl.textContent = `정답입니다! 🎉 보너스 +5 포인트를 획득했습니다! (설명: ${quizSystem.currentNonsense.explanation})`;
                feedbackEl.className = 'quiz-feedback correct';
                
                // 포인트 지급 (직접 적립)
                character.addPoints(5);
            } else {
                feedbackEl.textContent = `틀렸습니다! 🤣 (설명: ${quizSystem.currentNonsense.explanation})`;
                feedbackEl.className = 'quiz-feedback incorrect';
            }
            
            // 다음 단계(과학 퀴즈)로 진입할 수 있도록 함
            document.getElementById('btnNextAfterFeedback').style.display = 'block';
            document.getElementById('btnNextAfterFeedback').textContent = '과학 미션 해결하러 가기 ➔';
        } else {
            // 과학 퀴즈 채점
            const isCorrect = quizSystem.checkAnswer(userAns, false);
            if (isCorrect) {
                // 등급 장비 보너스 추가 계산 적용
                const gained = character.addPoints(this.currentMission.points);
                feedbackEl.textContent = `정답입니다! 🎉 과학 비밀을 밝혔습니다! (+${gained} 포인트 획득!)\n(설명: ${quizSystem.currentQuiz.explanation})`;
                feedbackEl.className = 'quiz-feedback correct';
                
                // 미션 및 퀴즈 완료 등록
                missionSystem.completeMission(this.currentStageId, this.currentMission.id);
                quizSystem.completeQuiz(this.currentStageId, this.currentMissionIndex);
                
                // 그리드 및 HUD 즉시 갱신
                this.renderMissionsList();
                this.updateStageProgressBars();
            } else {
                feedbackEl.textContent = `틀렸습니다! 다시 한 번 찬찬히 생각해 보세요.\n(설명: ${quizSystem.currentQuiz.explanation})`;
                feedbackEl.className = 'quiz-feedback incorrect';
            }
            
            document.getElementById('btnNextAfterFeedback').style.display = 'block';
            document.getElementById('btnNextAfterFeedback').textContent = '닫기 ➔';
        }
    }

    // 결과 창 닫기 / 넌센스 후속 동작
    handleNextQuizStep() {
        if (this.isSolvingNonsense) {
            // 넌센스를 풀고 나면 본래 과학 퀴즈로 바로 진입
            this.isSolvingNonsense = false;
            this.showScienceQuiz();
            document.getElementById('quizFeedback').textContent = '';
            document.getElementById('quizFeedback').className = 'quiz-feedback';
            document.getElementById('btnNextAfterFeedback').style.display = 'none';
        } else {
            // 과학 퀴즈 해결 후 모달 닫기
            document.getElementById('quizScene').style.display = 'none';
            
            // 모든 퀴즈 완료 여부 검사
            if (quizSystem.isAllComplete()) {
                this.showEndingScene();
            }
        }
    }

    // 엔딩 시각화
    showEndingScene() {
        // 모든 씬 숨기고 완료 씬 활성화
        document.getElementById('stageMissionsView').style.display = 'none';
        document.getElementById('stageSelectView').style.display = 'block';
        
        // 탭 콘텐츠도 교체
        document.querySelectorAll('.tab-scene').forEach(scene => scene.classList.remove('active-scene'));
        document.getElementById('completeScene').classList.add('active-scene');

        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const speedBonus = character.getSpeedBonus();
        // 속도 보너스가 높을수록 최종 기록이 비례해서 단축됨! (최대 80% 단축 제한)
        const finalTime = Math.max(1, Math.floor(elapsed * (1 - Math.min(0.8, speedBonus / 100))));
        document.getElementById('timeElapsed').textContent = `${finalTime}초 (기본 소요시간: ${elapsed}초, 속도 단축: -${elapsed - finalTime}초)`;
        document.getElementById('finalPoints').textContent = character.points;
        
        // 집 등급 한글화 맵핑
        document.getElementById('finalHouse').textContent = (ITEMS.house[character.house] || ITEMS.house.tent).name;
    }

    // ================== 상점 로직 ==================
    setupShop() {
        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.shop-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderShop(e.target.dataset.category);
            });
        });
    }

    renderShop(category) {
        const grid = document.getElementById('shopItemsGrid');
        grid.innerHTML = '';

        const catItems = ITEMS[category];
        if (!catItems) return;

        Object.keys(catItems).forEach(itemId => {
            const item = catItems[itemId];
            const card = document.createElement('div');
            card.className = 'shop-card';

            // 구매 상태 검사
            let isOwned = false;
            if (category === 'equipment' && character.inventory.includes(itemId)) {
                isOwned = true;
            } else if (category === 'house' && character.house === itemId) {
                isOwned = true;
            } else if (category === 'farm' && item.type === 'tool' && character.hasWateringCan) {
                isOwned = true;
            } else if (category === 'vehicles' && character.vehicles.includes(itemId)) {
                isOwned = true;
            }

            if (isOwned) {
                card.classList.add('owned');
            }
            if (category === 'farm' && item.type === 'tool' && isOwned) {
                card.classList.add('tool-owned');
            }

            // 등급 배지 추가
            let gradeBadge = '';
            if (item.grade) {
                gradeBadge = `<span class="shop-card-grade ${item.grade.toLowerCase()}">${item.grade}</span>`;
            }

            const icon = category === 'animals' ? item.char
                : category === 'vehicles' ? item.char
                    : category === 'farm' ? (item.type === 'tool' ? '🚿' : '🌱')
                        : category === 'decorations' ? '🪴'
                            : category === 'house' ? '🏡' : '🛡️';
            const effectText = item.effect ? `<p class="effect">${item.effect}</p>` : '';
            const ownedLabel = category === 'vehicles' && isOwned
                ? (character.activeVehicle === itemId ? '탑승중' : '탑승')
                : '보유중';

            card.innerHTML = `
                ${gradeBadge}
                <h4>${icon} ${item.name}</h4>
                <p class="desc">${item.desc}</p>
                ${effectText}
                <div class="shop-card-footer">
                    <span class="price">💎 ${item.price} P</span>
                    <button class="pixel-btn btn-buy" ${isOwned && category !== 'vehicles' ? 'disabled' : ''}>
                        ${isOwned ? ownedLabel : '구매'}
                    </button>
                </div>
            `;

            // 구매 버튼 클릭 이벤트
            card.querySelector('.btn-buy').addEventListener('click', () => {
                const res = character.buyShopItem(itemId, category);
                alert(res.msg);
                if (res.success) {
                    this.renderShop(category);
                    this.renderIslandMap(); // 섬 화면 및 대기 인벤토리 즉시 동기화!
                }
            });

            grid.appendChild(card);
        });
    }

    // ================== 숲속 섬 & 집 꾸미기 그리드 렌더링 ==================
    renderIslandMap() {
        const gridMap = document.getElementById('islandMapGrid');
        gridMap.innerHTML = '';
        gridMap.style.setProperty('--island-size', this.islandSize);
        character.updatePlantGrowth();

        // 집 등급 정보 갱신
        const houseInfo = ITEMS.house[character.house] || ITEMS.house.tent;
        document.getElementById('currentHouseGrade').textContent = `${houseInfo.name} ${this.getHouseEmoji(character.house)}`;

        const vehicleStatus = document.getElementById('vehicleStatus');
        if (vehicleStatus) {
            const vehicle = character.activeVehicle ? ITEMS.vehicles[character.activeVehicle] : null;
            vehicleStatus.textContent = vehicle ? `${vehicle.char} ${vehicle.name} 탑승 중 (+${vehicle.speed}% 속도)` : '도보 이동';
        }
        const plantStatus = document.getElementById('plantStatus');
        if (plantStatus) {
            const growingPlants = character.placedItems.filter(item => item.category === 'farm' && !item.grown).length;
            plantStatus.textContent = character.hasWateringCan
                ? `물뿌리개 보유 · 자라는 식물 ${growingPlants}개`
                : '씨앗은 물뿌리개가 있어야 심을 수 있습니다.';
        }

        const houseAnchor = this.getHouseAnchor();

        // 확장된 9x9 그리드 셀 생성
        for (let y = 0; y < this.islandSize; y++) {
            for (let x = 0; x < this.islandSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'island-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                const isPlayerHere = (x === character.islandX && y === character.islandY);
                const isHouseAnchor = (x === houseAnchor.x && y === houseAnchor.y);
                const isHouseArea = this.isHouseArea(x, y);

                if (isHouseArea) {
                    cell.classList.add('cell-house');
                    if (isHouseAnchor) {
                        // 집 아이콘 로드
                        let houseEmoji = this.getHouseEmoji(character.house);

                        cell.innerHTML = `<span class="placed-sprite house">${houseEmoji}</span>`;
                    }
                } else {
                    // 2. 다른 타일에 배치된 아이템이 있는지 체크
                    const placed = character.placedItems.find(item => item.x === x && item.y === y);
                    if (placed) {
                        const visual = this.getPlacedVisual(placed);
                        cell.innerHTML = `<span class="placed-sprite ${visual.className}">${visual.icon}</span>`;
                    }
                }

                // 캐릭터 겹쳐서 렌더링하기 (캐릭터가 이 셀에 있으면 추가로 얹음!)
                if (isPlayerHere) {
                    const head = ITEMS.equipment[character.equipped.hair];
                    const body = ITEMS.equipment[character.equipped.clothing];
                    const shoes = ITEMS.equipment[character.equipped.shoes];
                    
                    const charHTML = `
                        <div class="island-player-sprite" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; z-index: 10;" title="${character.name}">
                            <div class="player-char-mini">
                                <div class="pixel-hair-mini" style="background-color: ${head ? head.color : '#8B4513'}"></div>
                                <div class="pixel-clothing-mini" style="background-color: ${body ? body.color : '#4169E1'}"></div>
                                <div class="pixel-shoes-mini" style="background-color: ${shoes ? shoes.color : '#555555'}"></div>
                            </div>
                        </div>
                    `;
                    cell.insertAdjacentHTML('beforeend', charHTML);
                }

                // 셀 클릭 핸들러
                cell.addEventListener('click', () => {
                    this.handleCellClick(x, y, isHouseArea);
                });

                gridMap.appendChild(cell);
            }
        }

        // 배치 대기 리스트 사이드바 갱신
        this.renderUnplacedList();
        if (this.island3D) this.island3D.sync(character, ITEMS, this.islandSize);
    }

    getHouseAnchor() {
        const center = Math.floor(this.islandSize / 2);
        return { x: center, y: center };
    }

    isHouseArea(x, y) {
        const anchor = this.getHouseAnchor();
        return (x === anchor.x || x === anchor.x + 1) && (y === anchor.y || y === anchor.y + 1);
    }

    getHouseEmoji(houseId) {
        if (houseId === 'cabin') return '🏡';
        if (houseId === 'mansion') return '🏰';
        if (houseId === 'tower') return '🗼';
        return '⛺';
    }

    getPlacedVisual(placed) {
        if (placed.category === 'decorations') {
            const decInfo = {
                'flower': '🌸',
                'mushroom': '🍄',
                'magic_tree': '🌲',
                'crystal': '💎',
                'bed': '🛏️',
                'alchemy': '🧪'
            };
            return { icon: decInfo[placed.id] || '🌱', className: 'decor' };
        }
        if (placed.category === 'animals') {
            const animInfo = ITEMS.animals[placed.id];
            return { icon: animInfo ? animInfo.char : '🐿️', className: 'animal' };
        }
        if (placed.category === 'farm') {
            const grown = placed.grown || (placed.plantedAt && Date.now() - placed.plantedAt >= 30000);
            const seedIcons = {
                sunflower_seed: grown ? '🌻' : '🌱',
                berry_seed: grown ? '🍓' : '🌱',
                herb_seed: grown ? '🌿' : '🌱'
            };
            return { icon: seedIcons[placed.id] || (grown ? '🌼' : '🌱'), className: 'plant' };
        }
        return { icon: '❓', className: 'decor' };
    }

    // 배치 대기 인벤토리 목록 렌더링
    renderUnplacedList() {
        const container = document.getElementById('unplacedList');
        container.innerHTML = '';

        if (character.unplacedInventory.length === 0) {
            container.innerHTML = '<p class="empty-notice">배치 대기 중인 아이템이 없습니다. 상점을 이용하세요!</p>';
            return;
        }

        character.unplacedInventory.forEach((item, index) => {
            let name = '';
            let icon = '';
            
            if (item.category === 'decorations') {
                const dec = ITEMS.decorations[item.id];
                name = dec ? dec.name : '장식물';
                const decIcons = { flower:'🌸', mushroom:'🍄', magic_tree:'🌲', crystal:'💎', bed:'🛏️', alchemy:'🧪' };
                icon = decIcons[item.id] || '🌱';
            } else if (item.category === 'animals') {
                const anim = ITEMS.animals[item.id];
                name = anim ? anim.name : '동물';
                icon = anim ? anim.char : '🐕';
            } else if (item.category === 'farm') {
                const seed = ITEMS.farm[item.id];
                name = seed ? seed.name : '씨앗';
                icon = '🌱';
            }

            const card = document.createElement('div');
            card.className = 'unplaced-card pixel-box-inner';
            card.innerHTML = `
                <span><span class="unplaced-icon">${icon}</span> ${name}</span>
                <span style="font-size:10px; color:#666;">배치 대기</span>
            `;
            
            // 클릭 안내 문구 제공
            card.title = '섬 맵의 빈 땅을 클릭해 배치하세요!';
            container.appendChild(card);
        });
    }

    // 섬 그리드 셀 클릭 핸들러
    handleCellClick(x, y, isHouseArea) {
        if (this.isWalking) return; // 걷고 있을 때는 추가 클릭 금지

        this.selectedCell = { x, y };
        
        // 클릭 액션 통합 모달 창 생성
        const modal = document.getElementById('placementModal');
        const modalTitle = document.getElementById('placementModalTitle');
        const optionsContainer = document.getElementById('placementModalOptions');

        modalTitle.textContent = `좌표 (${x + 1}, ${y + 1}) 선택`;
        optionsContainer.innerHTML = '';

        const isPlayerHere = (x === character.islandX && y === character.islandY);

        // 1. 이동 옵션 (캐릭터가 위치하지 않은 곳일 때)
        if (!isPlayerHere) {
            const moveOpt = document.createElement('div');
            moveOpt.className = 'placement-opt-card pixel-box-inner';
            moveOpt.innerHTML = `
                <span>🏃 이곳으로 이동하기</span>
                <span class="pixel-btn btn-primary small" style="box-shadow:none; border-width:1px;">선택</span>
            `;
            moveOpt.addEventListener('click', () => {
                modal.style.display = 'none';
                this.walkTo(x, y);
            });
            optionsContainer.appendChild(moveOpt);
        }

        // 2. 가구/배치 상호작용 옵션
        if (isHouseArea) {
            const infoOpt = document.createElement('div');
            infoOpt.className = 'placement-opt-card pixel-box-inner';
            infoOpt.style.cursor = 'default';
            infoOpt.innerHTML = `<span>🏡 아늑한 집 구역 (이동만 가능)</span>`;
            optionsContainer.appendChild(infoOpt);
        } else {
            const placed = character.placedItems.find(item => item.x === x && item.y === y);
            
            if (placed) {
                if (placed.category === 'farm') {
                    const grown = placed.grown || (placed.plantedAt && Date.now() - placed.plantedAt >= 30000);
                    const plantOpt = document.createElement('div');
                    plantOpt.className = 'placement-opt-card pixel-box-inner';
                    if (grown) {
                        plantOpt.innerHTML = `
                            <span>🌾 다 자란 식물 수확하기</span>
                            <span class="pixel-btn btn-primary small" style="box-shadow:none; border-width:1px;">수확</span>
                        `;
                        plantOpt.addEventListener('click', () => {
                            const res = character.harvestPlant(x, y);
                            modal.style.display = 'none';
                            if (res.success) alert(`수확 성공! +${res.points} 포인트를 얻었습니다.`);
                            this.renderIslandMap();
                        });
                    } else {
                        const remain = Math.max(0, 30 - Math.floor((Date.now() - placed.plantedAt) / 1000));
                        plantOpt.style.cursor = 'default';
                        plantOpt.innerHTML = `<span>🌱 자라는 중입니다. 약 ${remain}초 뒤 수확할 수 있어요.</span>`;
                    }
                    optionsContainer.appendChild(plantOpt);
                }

                // 회수 옵션
                const removeOpt = document.createElement('div');
                removeOpt.className = 'placement-opt-card pixel-box-inner';
                removeOpt.innerHTML = `
                    <span>📦 배치된 아이템 회수하기</span>
                    <span class="pixel-btn btn-secondary small" style="box-shadow:none; border-width:1px;">회수</span>
                `;
                removeOpt.addEventListener('click', () => {
                    character.removePlacedItem(x, y);
                    modal.style.display = 'none';
                    this.renderIslandMap();
                });
                optionsContainer.appendChild(removeOpt);
            } else {
                // 배치 옵션
                const addOpt = document.createElement('div');
                addOpt.className = 'placement-opt-card pixel-box-inner';
                addOpt.innerHTML = `
                    <span>🌱 여기에 아이템 배치하기</span>
                    <span class="pixel-btn btn-secondary small" style="box-shadow:none; border-width:1px;">배치</span>
                `;
                addOpt.addEventListener('click', () => {
                    if (character.unplacedInventory.length === 0) {
                        alert("배치 대기 중인 장식이나 동물이 없습니다! 먼저 상점에서 아이템을 구매해 주세요.");
                        return;
                    }
                    modal.style.display = 'none';
                    this.showPlacementModal(x, y);
                });
                optionsContainer.appendChild(addOpt);
            }
        }

        modal.style.display = 'flex';
    }

    // 배치 팝업 띄우기
    showPlacementModal(x, y) {
        const modal = document.getElementById('placementModal');
        const modalTitle = document.getElementById('placementModalTitle');
        const optionsContainer = document.getElementById('placementModalOptions');

        modalTitle.textContent = `땅 (${x + 1}, ${y + 1})에 배치`;
        optionsContainer.innerHTML = '';

        character.unplacedInventory.forEach((item, index) => {
            let name = '';
            let icon = '';
            
            if (item.category === 'decorations') {
                const dec = ITEMS.decorations[item.id];
                name = dec ? dec.name : '장식물';
                const decIcons = { flower:'🌸', mushroom:'🍄', magic_tree:'🌲', crystal:'💎', bed:'🛏️', alchemy:'🧪' };
                icon = decIcons[item.id] || '🌱';
            } else if (item.category === 'animals') {
                const anim = ITEMS.animals[item.id];
                name = anim ? anim.name : '동물';
                icon = anim ? anim.char : '🐿️';
            } else if (item.category === 'farm') {
                const seed = ITEMS.farm[item.id];
                name = seed ? seed.name : '씨앗';
                icon = '🌱';
            }

            const card = document.createElement('div');
            card.className = 'placement-opt-card pixel-box-inner';
            card.innerHTML = `
                <span>${icon} ${name}</span>
                <span class="pixel-btn btn-secondary small" style="box-shadow:none; border-width:1px;">선택</span>
            `;

            card.addEventListener('click', () => {
                if (item.category === 'farm' && !character.hasWateringCan) {
                    alert('씨앗을 심으려면 먼저 상점에서 물뿌리개를 구매해야 합니다.');
                    return;
                }
                const success = character.placeItemOnIsland(index, x, y);
                if (success) {
                    modal.style.display = 'none';
                    this.renderIslandMap();
                } else {
                    alert("배치하지 못했습니다.");
                }
            });

            optionsContainer.appendChild(card);
        });

        modal.style.display = 'flex';
    }

    // 캐릭터 이동 처리 (속도 보너스가 반영됨)
    walkTo(targetX, targetY) {
        if (this.isWalking) return;
        this.isWalking = true;

        const speedBonus = character.getSpeedBonus();
        // 기본 한 칸 이동 딜레이: 300ms. 속도 보너스가 커질수록 대기 시간이 대폭 단축됩니다 (최대 50ms까지 단축)
        const stepDelay = Math.max(50, 300 - (speedBonus * 4.5));

        const moveStep = () => {
            let curX = character.islandX;
            let curY = character.islandY;

            if (curX === targetX && curY === targetY) {
                this.isWalking = false;
                character.save();
                this.renderIslandMap();
                return;
            }

            // X축 먼저 이동 후 Y축 이동
            if (curX !== targetX) {
                character.islandX += (targetX > curX ? 1 : -1);
            } else if (curY !== targetY) {
                character.islandY += (targetY > curY ? 1 : -1);
            }

            this.renderIslandMap();
            setTimeout(moveStep, stepDelay);
        };

        moveStep();
    }

    moveBy(dx, dy) {
        const max = this.islandSize - 1;
        const targetX = Math.max(0, Math.min(max, character.islandX + dx));
        const targetY = Math.max(0, Math.min(max, character.islandY + dy));
        if (targetX === character.islandX && targetY === character.islandY) return;
        this.walkTo(targetX, targetY);
    }

    setupKeyboardMovement() {
        if (this.keyboardReady) return;
        this.keyboardReady = true;
        document.addEventListener('keydown', (e) => {
            const islandActive = document.getElementById('islandScene')?.classList.contains('active-scene');
            const modalOpen = document.getElementById('placementModal')?.style.display === 'flex';
            if (!islandActive || modalOpen) return;

            const keyMap = {
                ArrowLeft: [-1, 0],
                a: [-1, 0],
                A: [-1, 0],
                ArrowRight: [1, 0],
                d: [1, 0],
                D: [1, 0],
                ArrowUp: [0, -1],
                w: [0, -1],
                W: [0, -1],
                ArrowDown: [0, 1],
                s: [0, 1],
                S: [0, 1]
            };
            const move = keyMap[e.key];
            if (!move) return;
            e.preventDefault();
            this.moveBy(move[0], move[1]);
        });
    }

    setupIsland3D() {
        const canvas = document.getElementById('island3DCanvas');
        if (!canvas || this.island3D) return;
        this.island3D = new Island3DView(canvas);
        this.island3D.sync(character, ITEMS, this.islandSize);

        if (!this.plantTimer) {
            this.plantTimer = setInterval(() => {
                if (character.updatePlantGrowth()) {
                    this.renderIslandMap();
                }
            }, 3000);
        }
    }

    setupSocial() {
        const addFriendBtn = document.getElementById('addFriendBtn');
        if (addFriendBtn && !addFriendBtn.dataset.ready) {
            addFriendBtn.dataset.ready = 'true';
            addFriendBtn.addEventListener('click', () => {
                const input = document.getElementById('friendIdInput');
                const result = character.addFriend(input.value);
                alert(result.msg);
                if (result.success) input.value = '';
                this.renderSocial();
            });
        }

        const visitFriendBtn = document.getElementById('visitFriendBtn');
        if (visitFriendBtn && !visitFriendBtn.dataset.ready) {
            visitFriendBtn.dataset.ready = 'true';
            visitFriendBtn.addEventListener('click', () => this.chooseFriendToVisit());
        }

        const tradeBtn = document.getElementById('tradeBtn');
        if (tradeBtn && !tradeBtn.dataset.ready) {
            tradeBtn.dataset.ready = 'true';
            tradeBtn.addEventListener('click', () => {
                const friendId = document.getElementById('tradeFriendSelect').value;
                const itemId = document.getElementById('tradeItemSelect').value;
                const result = character.addTradeOffer(friendId, itemId);
                alert(result.msg);
                this.renderSocial();
            });
        }
    }

    renderSocial() {
        const friendsList = document.getElementById('friendsList');
        const friendSelect = document.getElementById('tradeFriendSelect');
        const itemSelect = document.getElementById('tradeItemSelect');
        const tradeLog = document.getElementById('tradeLog');
        if (!friendsList || !friendSelect || !itemSelect || !tradeLog) return;

        friendsList.innerHTML = '';
        friendSelect.innerHTML = '';

        if (character.friends.length === 0) {
            friendsList.innerHTML = '<p class="empty-notice">아직 친구가 없습니다. 친구 아이디를 추가해 보세요.</p>';
            friendSelect.innerHTML = '<option value="">친구 없음</option>';
        } else {
            character.friends.forEach(friendId => {
                const card = document.createElement('div');
                card.className = 'friend-card';
                card.innerHTML = `
                    <span>🌳 ${friendId}</span>
                    <button class="pixel-btn btn-secondary small">방문</button>
                `;
                card.querySelector('button').addEventListener('click', () => this.visitFriend(friendId));
                friendsList.appendChild(card);

                const option = document.createElement('option');
                option.value = friendId;
                option.textContent = friendId;
                friendSelect.appendChild(option);
            });
        }

        itemSelect.innerHTML = '';
        character.inventory.forEach(itemId => {
            const item = ITEMS.equipment[itemId];
            if (!item) return;
            const option = document.createElement('option');
            option.value = itemId;
            option.textContent = `${item.name} (${item.grade})`;
            itemSelect.appendChild(option);
        });

        tradeLog.innerHTML = '';
        if (character.tradeOffers.length === 0) {
            tradeLog.innerHTML = '<p class="empty-notice">아직 보낸 거래 제안이 없습니다.</p>';
        } else {
            character.tradeOffers.forEach(offer => {
                const card = document.createElement('div');
                card.className = 'trade-card';
                const time = new Date(offer.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                card.innerHTML = `<span>${offer.friendId} ← ${offer.itemName}</span><span>${offer.status} · ${time}</span>`;
                tradeLog.appendChild(card);
            });
        }
    }

    chooseFriendToVisit() {
        if (character.friends.length === 0) {
            alert('먼저 친구 아이디를 추가해 주세요.');
            return;
        }
        const selected = prompt(`누구 친구를 선택하실 건가요?\n${character.friends.join(', ')}`, character.friends[0]);
        if (!selected) return;
        const normalized = character.normalizeId(selected);
        if (!character.friends.includes(normalized)) {
            alert('친구 목록에 없는 아이디입니다.');
            return;
        }
        this.visitFriend(normalized);
    }

    visitFriend(friendId) {
        const panelTitle = document.getElementById('friendHouseTitle');
        const panelDesc = document.getElementById('friendHouseDesc');
        const avatar = document.getElementById('friendHouseAvatar');
        const seed = [...friendId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const houses = ['⛺', '🏡', '🏰', '🗼'];
        const animals = ['🐿️', '🐇', '🦊', '🐉'];
        avatar.textContent = houses[seed % houses.length];
        panelTitle.textContent = `${friendId}의 섬에 도착했습니다`;
        panelDesc.textContent = `푸른 바다 한가운데 둥근 섬이 있고, ${animals[seed % animals.length]} 동물이 집 주변을 지키고 있습니다.`;
    }

    // 게임 리셋 및 재시작
    restart() {
        const res = confirm('모든 게임 진행도와 포인트를 날리고 숲속 입구부터 다시 시작하겠습니까?');
        if (res) {
            character.reset();
            missionSystem.reset();
            quizSystem.reset();
            
            // 캐시 클리어 후 스크린 복구
            document.getElementById('gameScreen').classList.remove('active');
            document.getElementById('characterScreen').classList.add('active');
            document.getElementById('nameInput').value = '';
            document.getElementById('playerIdInput').value = character.playerId || '';
            this.updatePlayerIdStatus(character.playerId || '');
            
            // 디폴트 뷰 상태 복구
            document.getElementById('stageMissionsView').style.display = 'none';
            document.getElementById('stageSelectView').style.display = 'block';
            document.getElementById('completeScene').classList.remove('active-scene');
            
            this.renderIslandMap();
            character.updateDisplay();
            this.updateStageProgressBars();
            this.renderSocial();
        }
    }
}

// 게임 매니저 전역 인스턴스
const gameManager = new GameManager();

// 웹 페이지 완전 준비 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        gameManager.init();
        console.log('🌲 판타지 과학의 숲 - 로딩 및 초기화 성공!');
    } catch (e) {
        console.error('❌ 게임 시작 실패:', e);
    }
});
