// 3D 섬 시각화. Three.js가 로드되면 WebGL, 아니면 Canvas 2D로 안전하게 대체합니다.
class Island3DView {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.root = null;
        this.usingThree = false;
        this.lastCharacter = null;
        this.lastItems = null;
        this.gridSize = 9;
        this.animationId = null;

        if (canvas && window.THREE) {
            this.initThree();
        }
    }

    initThree() {
        try {
            const THREE = window.THREE;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x92dcff);
            this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
            this.camera.position.set(4.8, 5.2, 7.2);
            this.camera.lookAt(0, 0, 0);

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            const hemi = new THREE.HemisphereLight(0xeaffd2, 0x1b5b75, 2.2);
            this.scene.add(hemi);

            const sun = new THREE.DirectionalLight(0xffffff, 2.6);
            sun.position.set(5, 8, 4);
            this.scene.add(sun);

            this.root = new THREE.Group();
            this.scene.add(this.root);

            window.addEventListener('resize', () => this.resize());
            this.resize();
            this.animate();
            this.usingThree = true;
        } catch (e) {
            console.warn("WebGL initialization failed, falling back to 2D Canvas:", e);
            this.usingThree = false;
        }
    }

    resize() {
        if (!this.canvas) return;
        const width = this.canvas.clientWidth || 600;
        const height = this.canvas.clientHeight || 300;

        if (this.renderer && this.camera) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    sync(character, items, gridSize = 9) {
        if (!this.canvas || !character || !items) return;
        this.lastCharacter = character;
        this.lastItems = items;
        this.gridSize = gridSize;

        const viewport = this.canvas.parentElement;
        if (viewport) {
            if (this.usingThree) {
                viewport.classList.add('using-3d');
            } else {
                viewport.classList.remove('using-3d');
            }
        }

        if (this.usingThree && this.root) {
            this.buildThreeScene(character, items);
            return;
        }

        this.drawFallback(character, items);
    }

    buildThreeScene(character, items) {
        const THREE = window.THREE;
        this.root.clear();

        const ocean = new THREE.Mesh(
            new THREE.CylinderGeometry(5.4, 5.4, 0.06, 96),
            new THREE.MeshPhongMaterial({ color: 0x1e95c9, shininess: 90 })
        );
        ocean.position.y = -0.36;
        this.root.add(ocean);

        const island = new THREE.Mesh(
            new THREE.CylinderGeometry(2.75, 3.05, 0.55, 96),
            new THREE.MeshPhongMaterial({ color: 0x58b368, shininess: 16 })
        );
        island.position.y = -0.08;
        this.root.add(island);

        const shore = new THREE.Mesh(
            new THREE.TorusGeometry(2.82, 0.09, 8, 96),
            new THREE.MeshPhongMaterial({ color: 0xd8c27a, shininess: 20 })
        );
        shore.rotation.x = Math.PI / 2;
        shore.position.y = 0.22;
        this.root.add(shore);

        this.addTreeRing();
        this.addHouse(character.house, items.house);
        character.placedItems.forEach((placed) => this.addPlacedItem(placed, items));
        this.addPlayer(character, items);
    }

    addTreeRing() {
        const coords = [
            [-2.1, -0.9], [-1.8, 1.3], [-0.7, -2.1], [0.9, 2.0],
            [1.9, -1.1], [2.1, 0.7], [-0.1, 2.2], [1.1, -2.0]
        ];
        coords.forEach(([x, z], index) => this.addTree(x, z, 0.52 + (index % 3) * 0.08));
    }

    addTree(x, z, scale) {
        const THREE = window.THREE;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.07, 0.38 * scale, 10),
            new THREE.MeshPhongMaterial({ color: 0x7b5130 })
        );
        trunk.position.set(x, 0.36, z);
        this.root.add(trunk);

        const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(0.26 * scale, 0.72 * scale, 18),
            new THREE.MeshPhongMaterial({ color: 0x1f7f49, shininess: 12 })
        );
        foliage.position.set(x, 0.78, z);
        this.root.add(foliage);
    }

    addHouse(houseId, houses) {
        const THREE = window.THREE;
        const info = houses[houseId] || houses.tent;
        const scale = info.scale || 1;
        const group = new THREE.Group();
        group.position.set(0, 0.34, 0);
        group.scale.setScalar(0.7 * scale);

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.55, 0.75),
            new THREE.MeshPhongMaterial({ color: houseId === 'tower' ? 0xc9d1d9 : 0xa66d3a })
        );
        body.position.y = 0.28;
        group.add(body);

        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(0.72, 0.46, houseId === 'tower' ? 20 : 4),
            new THREE.MeshPhongMaterial({ color: houseId === 'mansion' ? 0x6f3434 : 0x8b2f2f })
        );
        roof.position.y = 0.82;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        if (houseId === 'tower') {
            body.scale.y = 1.9;
            roof.position.y = 1.35;
        }

        this.root.add(group);
    }

    addPlacedItem(placed, items) {
        const THREE = window.THREE;
        const pos = this.gridToWorld(placed.x, placed.y);
        const group = new THREE.Group();
        group.position.set(pos.x, 0.32, pos.z);

        if (placed.category === 'animals') {
            const animal = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 18, 18),
                new THREE.MeshPhongMaterial({ color: 0xc47d43, shininess: 30 })
            );
            animal.scale.set(1.15, 0.82, 0.82);
            group.add(animal);
        } else if (placed.category === 'farm') {
            const grown = this.isPlantGrown(placed);
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.035, grown ? 0.45 : 0.2, 8),
                new THREE.MeshPhongMaterial({ color: 0x2f8f3f })
            );
            stem.position.y = grown ? 0.23 : 0.1;
            group.add(stem);

            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(grown ? 0.16 : 0.09, 12, 12),
                new THREE.MeshPhongMaterial({ color: grown ? 0xffd166 : 0x4caf50 })
            );
            leaf.position.y = grown ? 0.5 : 0.22;
            group.add(leaf);
        } else {
            const color = placed.id === 'crystal' ? 0x8ee6ff : placed.id === 'mushroom' ? 0xff6f91 : 0x61b15a;
            const decor = new THREE.Mesh(
                new THREE.DodecahedronGeometry(0.16, 0),
                new THREE.MeshPhongMaterial({ color, shininess: 80 })
            );
            group.add(decor);
        }

        this.root.add(group);
    }

    addPlayer(character, items) {
        const THREE = window.THREE;
        const pos = this.gridToWorld(character.islandX, character.islandY);
        const group = new THREE.Group();
        group.position.set(pos.x, 0.44, pos.z);

        if (character.activeVehicle) {
            const vehicle = new THREE.Mesh(
                new THREE.BoxGeometry(0.58, 0.18, 0.34),
                new THREE.MeshPhongMaterial({ color: character.activeVehicle === 'car' ? 0xe63946 : 0x22223b, shininess: 70 })
            );
            vehicle.position.y = -0.08;
            group.add(vehicle);
        }

        const clothing = items.equipment[character.equipped.clothing];
        const hair = items.equipment[character.equipped.hair];
        const shoes = items.equipment[character.equipped.shoes];
        
        // 1. 몸통 (Body) - 더 짤막하고 귀엽게 (반경 0.1, 높이 0.22)
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.22, 16),
            new THREE.MeshPhongMaterial({ color: clothing ? clothing.color : 0x4169e1, shininess: 36 })
        );
        body.position.y = 0.11;
        group.add(body);

        // 2. 머리 (Head) - 큼직하게 (반경 0.26)
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 24, 24),
            new THREE.MeshPhongMaterial({ color: 0xf0c7a5, shininess: 24 })
        );
        head.position.y = 0.44;
        group.add(head);

        // 3. 귀 (Ears) - 머리 크기에 맞게 위치 조율
        [-1, 1].forEach(side => {
            const ear = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 14, 14),
                new THREE.MeshPhongMaterial({ color: 0xf0c7a5, shininess: 18 })
            );
            ear.scale.set(0.82, 1.16, 0.7);
            ear.position.set(side * 0.24, 0.46, 0.02);
            group.add(ear);
        });

        // 4. 머리카락 (Hair Mesh) - 머리 덮개용 (반경 0.27)
        const hairMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.27, 22, 22, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshPhongMaterial({ color: hair ? hair.color : 0x8b4513, shininess: 28 })
        );
        hairMesh.position.y = 0.54;
        hairMesh.scale.set(1.05, 0.7, 1);
        group.add(hairMesh);

        const hairMaterial = hairMesh.material;
        
        // 5. 앞머리 (Bangs) - 머리 굴곡에 맞춰 배치
        [-0.1, 0, 0.1].forEach((x, index) => {
            const bang = new THREE.Mesh(
                new THREE.SphereGeometry(0.06 - index * 0.006, 12, 12),
                hairMaterial
            );
            bang.scale.set(0.85, 1.35, 0.55);
            bang.position.set(x * 1.3, 0.48 - Math.abs(x) * 0.15, 0.24);
            bang.rotation.z = x * -3.2;
            group.add(bang);
        });

        // 6. 옆머리 (Side Locks)
        [-1, 1].forEach(side => {
            const sideLock = new THREE.Mesh(
                new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10),
                hairMaterial
            );
            sideLock.position.set(side * 0.22, 0.36, 0.06);
            sideLock.rotation.z = side * 0.18;
            group.add(sideLock);
        });

        // 7. 팔과 다리 (Arms and Legs) - 아기자기하게 얇고 짤막하게
        [-1, 1].forEach(side => {
            const arm = new THREE.Mesh(
                new THREE.CylinderGeometry(0.035, 0.035, 0.14, 10),
                new THREE.MeshPhongMaterial({ color: 0xf0c7a5, shininess: 22 })
            );
            arm.position.set(side * 0.14, 0.12, 0.02);
            arm.rotation.z = side * 0.42;
            group.add(arm);

            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.045, 0.045, 0.1, 10),
                new THREE.MeshPhongMaterial({ color: shoes ? shoes.color : 0x555555, shininess: 28 })
            );
            leg.position.set(side * 0.05, 0.02, 0.02);
            group.add(leg);

            // 8. 눈 (Eyes) - 눈 위치도 머리에 맞춤
            const eye = new THREE.Mesh(
                new THREE.SphereGeometry(0.025, 10, 10),
                new THREE.MeshPhongMaterial({ color: 0x14211f, shininess: 8 })
            );
            eye.position.set(side * 0.09, 0.47, 0.24);
            group.add(eye);
        });

        // 9. 코 (Nose)
        const nose = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 10, 10),
            new THREE.MeshPhongMaterial({ color: 0xd58a78, shininess: 12 })
        );
        nose.position.set(0, 0.41, 0.25);
        group.add(nose);

        // 10. 입 (Smile)
        const smile = new THREE.Mesh(
            new THREE.TorusGeometry(0.045, 0.006, 6, 18, Math.PI),
            new THREE.MeshPhongMaterial({ color: 0x8e4848, shininess: 8 })
        );
        smile.position.set(0, 0.37, 0.252);
        smile.rotation.x = Math.PI;
        group.add(smile);

        this.root.add(group);
    }

    gridToWorld(x, y) {
        const center = (this.gridSize - 1) / 2;
        const step = 4.3 / Math.max(1, this.gridSize - 1);
        return {
            x: (x - center) * step,
            z: (y - center) * step
        };
    }

    isPlantGrown(placed) {
        return placed.grown || (placed.plantedAt && Date.now() - placed.plantedAt >= 30000);
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        this.animationId = window.requestAnimationFrame(() => this.animate());
        this.resize();
        if (this.root) this.root.rotation.y = Math.sin(Date.now() / 4200) * 0.05;
        this.renderer.render(this.scene, this.camera);
    }

    drawFallback(character, items) {
        const ctx = this.canvas.getContext('2d');
        const width = this.canvas.clientWidth || 600;
        const height = this.canvas.clientHeight || 300;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const ocean = ctx.createLinearGradient(0, 0, 0, height);
        ocean.addColorStop(0, '#9be7ff');
        ocean.addColorStop(0.48, '#48b9de');
        ocean.addColorStop(1, '#0a679a');
        ctx.fillStyle = ocean;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(255,255,255,${0.2 - i * 0.02})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(width / 2, height * 0.62, width * (0.26 + i * 0.055), height * (0.14 + i * 0.025), 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.save();
        ctx.translate(width / 2, height * 0.55);
        ctx.scale(1, 0.58);
        ctx.fillStyle = '#d8c27a';
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(width, height) * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#58b368';
        ctx.beginPath();
        ctx.arc(0, -4, Math.min(width, height) * 0.31, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.drawFallbackHouse(ctx, width, height, character.house);
        character.placedItems.forEach((item) => this.drawFallbackItem(ctx, width, height, item));
        this.drawFallbackPlayer(ctx, width, height, character, items);
    }

    drawFallbackHouse(ctx, width, height, houseId) {
        const x = width / 2;
        const y = height * 0.55;
        const size = houseId === 'tower' ? 54 : houseId === 'mansion' ? 48 : houseId === 'cabin' ? 40 : 34;
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x - size / 2, y - size * 0.25, size, size * 0.48);
        ctx.fillStyle = houseId === 'mansion' ? '#7a3030' : '#a33a2d';
        ctx.beginPath();
        ctx.moveTo(x - size * 0.62, y - size * 0.22);
        ctx.lineTo(x, y - size * 0.72);
        ctx.lineTo(x + size * 0.62, y - size * 0.22);
        ctx.closePath();
        ctx.fill();
    }

    drawFallbackItem(ctx, width, height, item) {
        const pos = this.gridToScreen(width, height, item.x, item.y);
        const icon = item.category === 'farm'
            ? (this.isPlantGrown(item) ? '🌻' : '🌱')
            : item.category === 'animals'
                ? '🐾'
                : item.id === 'crystal'
                    ? '💎'
                    : '🌲';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(icon, pos.x, pos.y);
    }

    drawFallbackPlayer(ctx, width, height, character, items) {
        const pos = this.gridToScreen(width, height, character.islandX, character.islandY);
        if (character.activeVehicle) {
            ctx.font = '26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(character.activeVehicle === 'car' ? '🚗' : '🏍️', pos.x, pos.y + 14);
        }
        const body = items.equipment[character.equipped.clothing];
        const hair = items.equipment[character.equipped.hair];
        
        // 몸통 그리기 (더 둥글고 귀여운 하체)
        ctx.fillStyle = body ? body.color : '#4169e1';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y - 2, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 귀 그리기
        ctx.fillStyle = '#f0c7a5';
        ctx.beginPath();
        ctx.ellipse(pos.x - 14, pos.y - 18, 5, 7, -0.2, 0, Math.PI * 2);
        ctx.ellipse(pos.x + 14, pos.y - 18, 5, 7, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리 그리기 (대두)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 16, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리카락 그리기
        ctx.fillStyle = hair ? hair.color : '#8b4513';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 22, 16, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // 눈 그리기
        ctx.fillStyle = '#16211f';
        ctx.beginPath();
        ctx.arc(pos.x - 6, pos.y - 15, 2, 0, Math.PI * 2);
        ctx.arc(pos.x + 6, pos.y - 15, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    gridToScreen(width, height, x, y) {
        const center = (this.gridSize - 1) / 2;
        const base = Math.min(width, height);
        const stepX = base * 0.58 / Math.max(1, this.gridSize - 1);
        const stepY = base * 0.34 / Math.max(1, this.gridSize - 1);
        return {
            x: width / 2 + (x - center) * stepX,
            y: height * 0.55 + (y - center) * stepY
        };
    }
}
