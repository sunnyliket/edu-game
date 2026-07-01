// --- Game State ---
let hp = 1000;
let bossHp = 202661;
let currentStage = 1;
let isPopupOpen = false;
let currentInteractable = null;

// --- UI Elements ---
const hpValueEl = document.getElementById('hp-value');
const bossHpUI = document.getElementById('boss-health-ui');
const bossHpValueEl = document.getElementById('boss-hp-value');
const stageValueEl = document.getElementById('stage-value');
const popupOverlay = document.getElementById('popup-overlay');
const popupTitle = document.getElementById('popup-title');
const popupText = document.getElementById('popup-text');
const popupOptions = document.getElementById('popup-options');
const popupClose = document.getElementById('popup-close');
const tooltipUI = document.getElementById('tooltip-ui');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// --- Engine Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 2, 30);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -20, 0); // Stronger gravity for snappy jumps
world.broadphase = new CANNON.SAPBroadphase(world);

const physicsMaterials = {
    ground: new CANNON.Material('ground'),
    player: new CANNON.Material('player'),
    box: new CANNON.Material('box')
};

const playerGroundContact = new CANNON.ContactMaterial(physicsMaterials.ground, physicsMaterials.player, {
    friction: 0.0,
    restitution: 0.0
});
world.addContactMaterial(playerGroundContact);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// The one lantern on the ceiling
const lanternLight = new THREE.PointLight(0xffaa55, 1, 30);
lanternLight.position.set(0, 9, 0);
lanternLight.castShadow = true;
scene.add(lanternLight);

const lanternMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({color: 0xffaa55}));
lanternMesh.position.copy(lanternLight.position);
scene.add(lanternMesh);

// --- Player Setup ---
const playerRadius = 0.5;
const playerShape = new CANNON.Sphere(playerRadius);
const playerBody = new CANNON.Body({ mass: 50, material: physicsMaterials.player });
playerBody.addShape(playerShape);
playerBody.position.set(0, 2, 0);
playerBody.linearDamping = 0.9;
world.addBody(playerBody);

const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

let canJump = false;
world.addEventListener('postStep', () => {
    // Check if player is on ground
    const contactNormal = new CANNON.Vec3();
    let onGround = false;
    for(let i=0; i<world.contacts.length; i++){
        const c = world.contacts[i];
        if(c.bi === playerBody || c.bj === playerBody){
            if(c.bi === playerBody){
                c.ni.negate(contactNormal);
            } else {
                contactNormal.copy(c.ni);
            }
            if(contactNormal.dot(new CANNON.Vec3(0,1,0)) > 0.5){
                onGround = true;
                break;
            }
        }
    }
    canJump = onGround;
});

// --- Input Logic ---
const input = { forward: false, backward: false, left: false, right: false, space: false };

document.addEventListener('keydown', (e) => {
    if (isPopupOpen) return;
    switch (e.code) {
        case 'KeyW': input.forward = true; break;
        case 'KeyA': input.left = true; break;
        case 'KeyS': input.backward = true; break;
        case 'KeyD': input.right = true; break;
        case 'Space': 
            if(canJump){
                playerBody.velocity.y = 10;
                canJump = false;
            }
            break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': input.forward = false; break;
        case 'KeyA': input.left = false; break;
        case 'KeyS': input.backward = false; break;
        case 'KeyD': input.right = false; break;
    }
});

// --- Interaction (Raycaster) ---
let interactables = [];
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

document.addEventListener('mousedown', (event) => {
    if (!controls.isLocked || isPopupOpen) return;

    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(interactables);

    if (intersects.length > 0 && intersects[0].distance < 5) {
        const object = intersects[0].object;
        if (event.button === 0) handleLeftClick(object);
        else if (event.button === 2) showTooltip(object.userData.description);
    }
});
document.addEventListener('contextmenu', e => e.preventDefault());

let tooltipTimeout;
function showTooltip(text) {
    if(!text) return;
    tooltipUI.textContent = text;
    tooltipUI.classList.remove('hidden');
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => tooltipUI.classList.add('hidden'), 2000);
}

// --- Popup System ---
function openPopup(title, text, options = [], isMessageOnly = false) {
    isPopupOpen = true;
    controls.unlock();
    popupTitle.textContent = title;
    popupText.textContent = text;
    popupOptions.innerHTML = '';
    
    if (isMessageOnly) {
        popupClose.classList.remove('hidden');
    } else {
        popupClose.classList.add('hidden');
        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(index);
            popupOptions.appendChild(btn);
        });
    }
    popupOverlay.classList.remove('hidden');
}

popupClose.addEventListener('click', () => {
    popupOverlay.classList.add('hidden');
    isPopupOpen = false;
    controls.lock();
    checkStageClear();
});

function handleLeftClick(object) {
    if (object.userData.isNPC) {
        openPopup(object.userData.name, object.userData.dialog, [], true);
    } else if (object.userData.quizData) {
        if (object.userData.solved) {
            openPopup("알림", "이미 푼 문제입니다.", [], true);
        } else {
            currentInteractable = object;
            const quiz = object.userData.quizData;
            openPopup(`문제`, quiz.question, quiz.options);
        }
    } else if (object.userData.isCar && object.userData.canDrive) {
        // Stage 2 special logic
        startDriving();
    } else if (object.userData.isGun) {
        // Stage 3 special logic
        equipGun(object);
    }
}

function checkAnswer(selectedIndex) {
    if(!currentInteractable) return;
    const quiz = currentInteractable.userData.quizData;
    
    if (selectedIndex === quiz.answerIndex) {
        currentInteractable.userData.solved = true;
        currentInteractable.material.color.setHex(0x555555);
        if(currentStage === 4) {
            bossHp -= 1004; // Boss logic
            bossHpValueEl.textContent = bossHp;
            if(bossHp <= 0) {
                openPopup("게임 클리어!", "과학 선생님을 쓰러뜨리고 탈출에 성공했습니다!!", [], true);
                return;
            }
        }
        openPopup("정답!", quiz.explanation, [], true);
    } else {
        hp -= 100;
        hpValueEl.textContent = hp;
        if (hp <= 0) {
            hpValueEl.textContent = "0";
            openPopup("게임 오버", "체력이 0이 되었습니다. 재시작합니다.", [], true);
            setTimeout(() => location.reload(), 2000);
            return;
        }
        openPopup("오답!", `틀렸습니다. 체력이 100 감소합니다.\n\n${quiz.explanation}`, [], true);
    }
    currentInteractable = null;
}

function checkStageClear() {
    if(currentStage === 1) {
        const required = interactables.filter(o => o.userData.quizData).length;
        const solved = interactables.filter(o => o.userData.quizData && o.userData.solved).length;
        if(solved > 0 && solved === required) {
            loadStage2();
        }
    } else if (currentStage === 3) {
        const required = interactables.filter(o => o.userData.isMonster).length;
        const solved = interactables.filter(o => o.userData.isMonster && o.userData.solved).length;
        if(solved > 0 && solved === required) {
            loadBossStage();
        }
    }
}

// --- Environment Creation ---
const stageObjects = []; // Meshes and Bodies to clean up

function createWall(x, y, z, width, height, depth, color = 0x0f0f15) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color }));
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.copy(mesh.position);
    world.addBody(body);
    stageObjects.push({mesh, body});
    return mesh;
}

function createGround(width, depth, color = 0x1a1a2e) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 1, depth), new THREE.MeshStandardMaterial({ color }));
    mesh.position.set(0, -0.5, 0);
    scene.add(mesh);
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, 0.5, depth/2));
    const body = new CANNON.Body({ mass: 0, material: physicsMaterials.ground });
    body.addShape(shape);
    body.position.copy(mesh.position);
    world.addBody(body);
    stageObjects.push({mesh, body});
}

function createInteractable(x, y, z, width, height, depth, color, desc, quizData = null, extraData = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color }));
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
    const body = new CANNON.Body({ mass: 10, material: physicsMaterials.box });
    body.addShape(shape);
    body.position.copy(mesh.position);
    world.addBody(body);
    
    mesh.userData = { description: desc, physicsBody: body, quizData, solved: false, ...extraData };
    interactables.push(mesh);
    stageObjects.push({mesh, body});
    return mesh;
}

function clearStage() {
    stageObjects.forEach(obj => {
        scene.remove(obj.mesh);
        world.removeBody(obj.body);
    });
    stageObjects.length = 0;
    interactables.length = 0;
    playerBody.position.set(0, 2, 0);
    playerBody.velocity.set(0,0,0);
}

// --- Stages ---
function loadStage1() {
    currentStage = 1;
    stageValueEl.textContent = "1";
    clearStage();
    createGround(30, 30);
    createWall(0, 5, -15, 30, 10, 1);
    createWall(0, 5, 15, 30, 10, 1);
    createWall(-15, 5, 0, 1, 10, 30);
    createWall(15, 5, 0, 1, 10, 30);
    lanternLight.position.set(0, 9, 0);
    lanternMesh.position.set(0, 9, 0);

    createInteractable(0, 1, -10, 1, 2, 1, 0x3ae374, "납치된 친구 민승. (산과 염기 문제를 모두 풀어 구출하자)", null, {isNPC: true, name: "민승", dialog: "산과 염기 문제 3개를 모두 풀어야 내가 풀려날 수 있어!"});
    
    // Select 3 random Acid/Base questions for stage 1
    const q1 = QuizData.acidBase[0];
    const q2 = QuizData.acidBase[1];
    const q3 = QuizData.acidBase[2];
    
    createInteractable(-5, 1, -5, 1, 1, 1, 0x17c0eb, "실험 도구 1", q1);
    createInteractable(5, 1, -5, 1, 1, 1, 0xff4757, "실험 도구 2", q2);
    createInteractable(0, 1, 5, 1, 1, 1, 0xfeca57, "실험 도구 3", q3);
}

function loadStage2() {
    currentStage = 2;
    stageValueEl.textContent = "2";
    clearStage();
    openPopup("스테이지 2", "물체와 운동! 길에 자동차가 있습니다. 지후를 구하러 가야합니다.", [], true);
    
    createGround(20, 100, 0x2d3436); // Long road
    createWall(-10, 2, 0, 1, 4, 100);
    createWall(10, 2, 0, 1, 4, 100);
    
    lanternLight.position.set(0, 10, -40); // Move lantern down the road
    lanternMesh.position.set(0, 10, -40);
    
    createInteractable(0, 1, -10, 2, 1, 4, 0x0984e3, "운전 가능한 자동차. 좌클릭하여 탑승!", null, {isCar: true, canDrive: true});
    createInteractable(0, 1, -45, 1, 2, 1, 0x00cec9, "납치된 지후", null, {isNPC: true, name: "지후", dialog: "고마워! 차를 타고 오다니!"});
}

let isDriving = false;
let carMesh = null;
function startDriving() {
    isDriving = true;
    carMesh = interactables.find(i => i.userData.isCar);
    openPopup("운전 시작", "차량 조작: WASD. 속력 문제에 주의하세요!", [], true);
}

function loadStage3() {
    currentStage = 3;
    stageValueEl.textContent = "3";
    clearStage();
    openPopup("스테이지 3", "식물의 구조와 기능! 출구를 파리지옥 병사들이 막고 있습니다. 줄 총을 주워서 쏘세요!", [], true);
    
    createGround(40, 40, 0x27ae60);
    createWall(0, 5, -20, 40, 10, 1);
    createWall(0, 5, 20, 40, 10, 1);
    createWall(-20, 5, 0, 1, 10, 40);
    createWall(20, 5, 0, 1, 10, 40);
    
    lanternLight.position.set(0, 9, 0);
    lanternMesh.position.set(0, 9, 0);

    createInteractable(5, 0.5, 5, 2, 0.5, 0.5, 0xf1c40f, "하늘에서 떨어진 줄 총 (좌클릭 획득)", null, {isGun: true});
    createInteractable(0, 1, -18, 1, 2, 1, 0x8e44ad, "납치된 지우", null, {isNPC: true, name: "지우", dialog: "병사들을 다 묶고 나를 구해줘!"});
    
    // Venus Flytraps
    const p1 = QuizData.plant[0];
    const p2 = QuizData.plant[1];
    const p3 = QuizData.plant[2];
    
    createInteractable(-10, 1, -10, 2, 2, 2, 0xc0392b, "파리지옥 병사 1", p1, {isMonster: true});
    createInteractable(0, 1, -10, 2, 2, 2, 0xc0392b, "파리지옥 병사 2", p2, {isMonster: true});
    createInteractable(10, 1, -10, 2, 2, 2, 0xc0392b, "파리지옥 병사 3", p3, {isMonster: true});
}

let hasGun = false;
function equipGun(object) {
    hasGun = true;
    object.visible = false;
    object.userData.physicsBody.position.y = -100;
    openPopup("줄 총 획득!", "파리지옥 병사를 클릭하면 식물 구조 문제를 냅니다. 맞추면 묶을 수 있습니다.", [], true);
}

function loadBossStage() {
    currentStage = 4;
    stageValueEl.textContent = "Final Boss";
    bossHpUI.classList.remove('hidden');
    clearStage();
    openPopup("최종 보스 출현", "과학 선생님이 나타났습니다! 모든 과학 지식을 동원해 물리치세요!", [], true);
    
    createGround(50, 50, 0x111111);
    createWall(0, 10, -25, 50, 20, 1);
    createWall(0, 10, 25, 50, 20, 1);
    createWall(-25, 10, 0, 1, 20, 50);
    createWall(25, 10, 0, 1, 20, 50);
    
    // Boss Teacher
    createInteractable(0, 5, -15, 4, 10, 4, 0xbdc3c7, "과학 선생님", null, {isNPC: true, name: "과학 선생님", dialog: "네 과학 지식을 시험해보마!"});
    
    // Spread all remaining questions
    const allQ = [...QuizData.acidBase.slice(3), ...QuizData.motion, ...QuizData.earth];
    allQ.forEach((q, index) => {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        createInteractable(x, 1, z, 1, 1, 1, Math.random() * 0xffffff, "보스 문제", q);
    });
}

// --- Main Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    world.step(1/60, delta, 3);

    // Sync physics
    stageObjects.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });

    if (controls.isLocked && !isPopupOpen) {
        const speed = isDriving ? 20 : 8;
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, (input.backward ? 1 : 0) - (input.forward ? 1 : 0));
        const sideVector = new THREE.Vector3((input.left ? 1 : 0) - (input.right ? 1 : 0), 0, 0);

        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
        direction.applyQuaternion(camera.quaternion);
        direction.y = 0;

        playerBody.velocity.x = direction.x;
        playerBody.velocity.z = direction.z;
        
        // Sync camera
        controls.getObject().position.copy(playerBody.position);
        controls.getObject().position.y += isDriving ? 1.5 : 1.0;
        
        if (isDriving && carMesh) {
            carMesh.userData.physicsBody.position.copy(playerBody.position);
            carMesh.userData.physicsBody.position.y -= 1;
            carMesh.userData.physicsBody.quaternion.copy(camera.quaternion);
            
            // Check if reached Jihu
            if (playerBody.position.z < -40) {
                isDriving = false;
                loadStage3();
            }
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

startBtn.addEventListener('click', () => {
    controls.lock();
});
controls.addEventListener('lock', () => startScreen.style.display = 'none');
controls.addEventListener('unlock', () => { if(!isPopupOpen) startScreen.style.display = 'flex'; });

// Initialize Game
loadStage1();
animate();
