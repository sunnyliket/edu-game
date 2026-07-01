// ========== Character State ==========
const state = {
    skinColor: '#FDEBD0',
    faceShape: 'round',
    blushColor: '#FFB6C1',
    blushIntensity: 50,
    mouthShape: 'smile',

    eyeColor: '#6C5CE7',
    eyeSize: 55,
    sparkleLevel: 70,
    eyeShape: 'round',
    lashStyle: 'normal',
    browStyle: 'natural',

    hairColor: '#FFB6C1',
    hairStyle: 'long',
    bangsStyle: 'straight',
    hairShine: 60,

    accessory: 'none',
    background: 'gradient_pink',
    effect: 'none'
};

const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');
let animFrame;
let time = 0;

// ========== Init ==========
function init() {
    setupTabs();
    setupColorSwatches();
    setupOptionButtons();
    setupSliders();
    setupSaveButton();
    requestAnimationFrame(animate);
}

// ========== Tab System ==========
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById('tab-' + this.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ========== Controls Setup ==========
function setupColorSwatches() {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = this.dataset.target;
            const color = this.dataset.color;
            if (!target || !color) return;
            // Update active state in the same row
            const row = this.closest('.color-picker-row');
            if (row) {
                row.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            }
            this.classList.add('active');
            state[target] = color;
        });
    });
}

function setupOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = this.dataset.target;
            const value = this.dataset.value;
            if (!target || !value) return;
            // Update active state in the same row
            const row = this.closest('.option-row');
            if (row) {
                row.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            }
            this.classList.add('active');
            state[target] = value;
        });
    });
}

function setupSliders() {
    const sliderMap = {
        'blushIntensity': 'blushIntensity',
        'eyeSize': 'eyeSize',
        'sparkleLevel': 'sparkleLevel',
        'hairShine': 'hairShine'
    };
    Object.entries(sliderMap).forEach(([id, key]) => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.addEventListener('input', function() {
                state[key] = parseInt(this.value);
            });
        }
    });
}

function setupSaveButton() {
    document.getElementById('saveBtn').addEventListener('click', function() {
        // Stop animation briefly to get a clean frame
        const link = document.createElement('a');
        link.download = 'my_anime_character.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// ========== Animation Loop (always running) ==========
function animate() {
    time += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
        drawBackground();
        drawHairBack();
        drawFace();
        drawEyes();
        drawMouth();
        drawNose();
        drawHairFront();
        drawBangs();
        drawAccessory();
        drawEffects();
    } catch(e) {
        console.error('Draw error:', e);
    }

    animFrame = requestAnimationFrame(animate);
}

// ========== Background ==========
function drawBackground() {
    const w = canvas.width, h = canvas.height;
    let grad;

    switch (state.background) {
        case 'gradient_pink':
            grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#2D1B69');
            grad.addColorStop(0.5, '#44236B');
            grad.addColorStop(1, '#5B2C6F');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            drawRadialGlow(w * 0.3, h * 0.3, 200, 'rgba(255, 107, 157, 0.08)');
            drawRadialGlow(w * 0.7, h * 0.7, 250, 'rgba(197, 108, 240, 0.08)');
            break;
        case 'gradient_blue':
            grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#0c1445');
            grad.addColorStop(0.5, '#1a2980');
            grad.addColorStop(1, '#26D0CE');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            drawRadialGlow(w * 0.5, h * 0.4, 200, 'rgba(38, 208, 206, 0.1)');
            break;
        case 'gradient_purple':
            grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#1a0533');
            grad.addColorStop(0.5, '#3a1078');
            grad.addColorStop(1, '#6C3483');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            drawRadialGlow(w * 0.5, h * 0.3, 300, 'rgba(154, 89, 219, 0.1)');
            break;
        case 'stars':
            grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#0B0C10');
            grad.addColorStop(1, '#1F2833');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 60; i++) {
                const sx = (Math.sin(i * 47.3) * 0.5 + 0.5) * w;
                const sy = (Math.cos(i * 31.7) * 0.5 + 0.5) * h;
                const sr = 1 + Math.sin(time * 2 + i) * 0.8;
                const alpha = 0.3 + Math.sin(time * 3 + i * 0.7) * 0.3;
                ctx.beginPath();
                ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
                ctx.fill();
            }
            break;
        case 'sakura':
            grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#2D1B3D');
            grad.addColorStop(1, '#4A2040');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 15; i++) {
                const px = (Math.sin(i * 23.7 + time * 0.3) * 0.5 + 0.5) * w;
                const py = ((i * 41 + time * 20) % (h + 40)) - 20;
                const rot = time + i * 0.5;
                drawSakuraPetal(px, py, 8 + i % 5, rot, 0.15 + Math.sin(i) * 0.05);
            }
            break;
        case 'hearts':
            grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#2D1B3D');
            grad.addColorStop(1, '#3D1B2D');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 12; i++) {
                const hx = (Math.sin(i * 37.3 + time * 0.2) * 0.5 + 0.5) * w;
                const hy = ((i * 53 + time * 15) % (h + 30)) - 15;
                drawHeart(hx, hy, 6 + i % 4, 'rgba(255, 107, 157, 0.12)');
            }
            break;
    }
}

function drawRadialGlow(x, y, r, color) {
    var grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function drawSakuraPetal(x, y, size, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size, -size, size * 2, 0, 0, size);
    ctx.bezierCurveTo(-size * 2, 0, -size, -size, 0, 0);
    ctx.fillStyle = 'rgba(255, 182, 193, ' + alpha + ')';
    ctx.fill();
    ctx.restore();
}

function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size, -size * 0.5, -size * 2, size * 0.5, 0, size * 2);
    ctx.bezierCurveTo(size * 2, size * 0.5, size, -size * 0.5, 0, size * 0.3);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// ========== Face ==========
function drawFace() {
    var cx = 250, cy = 280;
    ctx.save();

    ctx.beginPath();
    ctx.ellipse(cx, cy + 95, 80, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fill();

    ctx.beginPath();
    switch (state.faceShape) {
        case 'round':
            ctx.ellipse(cx, cy, 95, 110, 0, 0, Math.PI * 2);
            break;
        case 'oval':
            ctx.ellipse(cx, cy + 5, 85, 115, 0, 0, Math.PI * 2);
            break;
        case 'heart':
            ctx.moveTo(cx, cy + 115);
            ctx.bezierCurveTo(cx - 50, cy + 80, cx - 100, cy + 20, cx - 90, cy - 30);
            ctx.bezierCurveTo(cx - 80, cy - 80, cx - 30, cy - 100, cx, cy - 70);
            ctx.bezierCurveTo(cx + 30, cy - 100, cx + 80, cy - 80, cx + 90, cy - 30);
            ctx.bezierCurveTo(cx + 100, cy + 20, cx + 50, cy + 80, cx, cy + 115);
            break;
    }
    ctx.fillStyle = state.skinColor;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx - 15, cy - 40, 55, 50, -0.2, 0, Math.PI * 2);
    var highlightGrad = ctx.createRadialGradient(cx - 15, cy - 40, 0, cx - 15, cy - 40, 55);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    if (state.blushIntensity > 0) {
        var blushAlpha = state.blushIntensity / 300;
        drawBlush(cx - 60, cy + 25, 25, blushAlpha);
        drawBlush(cx + 60, cy + 25, 25, blushAlpha);
    }

    drawEar(cx - 90, cy - 10);
    drawEar(cx + 90, cy - 10);

    ctx.restore();
}

function drawBlush(x, y, r, alpha) {
    var color = hexToRgb(state.blushColor);
    var grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + alpha + ')');
    grad.addColorStop(1, 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawEar(x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = state.skinColor;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 10, 0, 0, Math.PI * 2);
    var earColor = hexToRgb(state.skinColor);
    ctx.fillStyle = 'rgba(' + Math.max(0, earColor.r - 30) + ', ' + Math.max(0, earColor.g - 30) + ', ' + Math.max(0, earColor.b - 20) + ', 0.3)';
    ctx.fill();
}

// ========== Eyes ==========
function drawEyes() {
    var cx = 250, cy = 270;
    var eyeSpacing = 45;
    drawSingleEye(cx - eyeSpacing, cy, state.eyeSize, false);
    drawSingleEye(cx + eyeSpacing, cy, state.eyeSize, true);
}

function drawEyeShape(x, y, ew, eh, isRight) {
    switch (state.eyeShape) {
        case 'round':
            ctx.ellipse(x, y, ew, eh, 0, 0, Math.PI * 2);
            break;
        case 'droopy':
            var droop = isRight ? 1 : -1;
            ctx.moveTo(x - ew, y);
            ctx.bezierCurveTo(x - ew, y - eh, x + ew, y - eh, x + ew, y + eh * 0.15 * droop);
            ctx.bezierCurveTo(x + ew, y + eh * 0.7, x - ew, y + eh * 0.7, x - ew, y);
            break;
        case 'sharp':
            var dir = isRight ? 1 : -1;
            ctx.moveTo(x - ew * 1.1, y);
            ctx.bezierCurveTo(x - ew * 0.5, y - eh * 1.05, x + ew * 0.5, y - eh * 1.05, x + ew * 1.1, y - eh * 0.2 * dir);
            ctx.bezierCurveTo(x + ew * 0.5, y + eh * 0.7, x - ew * 0.5, y + eh * 0.7, x - ew * 1.1, y);
            break;
        case 'big':
            ctx.ellipse(x, y, ew * 1.15, eh * 1.15, 0, 0, Math.PI * 2);
            break;
    }
}

function drawSingleEye(x, y, size, isRight) {
    var ew = size * 0.7;
    var eh = size * 0.9;

    ctx.save();

    // Eye white
    ctx.beginPath();
    drawEyeShape(x, y, ew, eh, isRight);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Clip to eye shape
    ctx.save();
    ctx.beginPath();
    drawEyeShape(x, y, ew, eh, isRight);
    ctx.clip();

    // Iris
    var irisR = eh * 0.72;
    var irisY = y + 2;
    var grad = ctx.createRadialGradient(x, irisY - irisR * 0.3, 0, x, irisY, irisR);
    var eyeRgb = hexToRgb(state.eyeColor);
    grad.addColorStop(0, lightenColor(state.eyeColor, 40));
    grad.addColorStop(0.3, state.eyeColor);
    grad.addColorStop(0.7, darkenColor(state.eyeColor, 20));
    grad.addColorStop(1, darkenColor(state.eyeColor, 40));
    ctx.beginPath();
    ctx.arc(x, irisY, irisR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Iris pattern - radial lines
    for (var i = 0; i < 24; i++) {
        var angle = (i / 24) * Math.PI * 2;
        var innerR = irisR * 0.2;
        var outerR = irisR * 0.85;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * innerR, irisY + Math.sin(angle) * innerR);
        ctx.lineTo(x + Math.cos(angle) * outerR, irisY + Math.sin(angle) * outerR);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Iris inner ring
    ctx.beginPath();
    ctx.arc(x, irisY, irisR * 0.45, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(' + eyeRgb.r + ', ' + eyeRgb.g + ', ' + eyeRgb.b + ', 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pupil
    var pupilR = irisR * 0.38;
    ctx.beginPath();
    ctx.arc(x, irisY, pupilR, 0, Math.PI * 2);
    var pupilGrad = ctx.createRadialGradient(x, irisY, 0, x, irisY, pupilR);
    pupilGrad.addColorStop(0, '#0a0a0a');
    pupilGrad.addColorStop(0.7, '#111');
    pupilGrad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = pupilGrad;
    ctx.fill();

    // Upper shadow
    ctx.beginPath();
    ctx.ellipse(x, y - eh * 0.5, ew * 1.1, eh * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fill();

    // ======= SPARKLES =======
    var sparkle = state.sparkleLevel / 100;
    if (sparkle > 0) {
        // Main highlight (top left)
        var mainHlR = irisR * (0.2 + sparkle * 0.15);
        var hlX = x - irisR * 0.3;
        var hlY = irisY - irisR * 0.35;
        ctx.beginPath();
        ctx.arc(hlX, hlY, mainHlR, 0, Math.PI * 2);
        var hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, mainHlR);
        hlGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (0.9 * sparkle) + ')');
        hlGrad.addColorStop(0.5, 'rgba(255, 255, 255, ' + (0.5 * sparkle) + ')');
        hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hlGrad;
        ctx.fill();

        // Secondary highlight (bottom right)
        var secHlR = irisR * (0.12 + sparkle * 0.08);
        var secX = x + irisR * 0.25;
        var secY = irisY + irisR * 0.3;
        ctx.beginPath();
        ctx.arc(secX, secY, secHlR, 0, Math.PI * 2);
        var secGrad = ctx.createRadialGradient(secX, secY, 0, secX, secY, secHlR);
        secGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (0.7 * sparkle) + ')');
        secGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = secGrad;
        ctx.fill();

        // Small sparkle dots
        if (sparkle > 0.3) {
            var numDots = Math.floor(sparkle * 6);
            for (var di = 0; di < numDots; di++) {
                var dAngle = (di / numDots) * Math.PI * 2 + time * 0.5;
                var dist = irisR * (0.3 + (di % 3) * 0.15);
                var dotX = x + Math.cos(dAngle) * dist;
                var dotY = irisY + Math.sin(dAngle) * dist;
                var dotR = 1.5 + Math.sin(time * 3 + di * 1.5) * 0.8;
                var dotAlpha = 0.5 + Math.sin(time * 4 + di * 2) * 0.3;
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotR * sparkle, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (dotAlpha * sparkle) + ')';
                ctx.fill();
            }
        }

        // Star sparkles
        if (sparkle > 0.5) {
            var starCount = Math.floor((sparkle - 0.5) * 6);
            for (var si = 0; si < starCount; si++) {
                var sa = (si / Math.max(starCount, 1)) * Math.PI * 2 + time;
                var sd = irisR * (0.4 + si * 0.12);
                var sx = x + Math.cos(sa) * sd;
                var sy = irisY + Math.sin(sa) * sd;
                var ss = 2 + Math.sin(time * 5 + si * 3) * 1;
                var salpha = 0.6 + Math.sin(time * 4 + si) * 0.3;
                drawStarSparkle(sx, sy, ss * sparkle, 'rgba(255, 255, 255, ' + (salpha * sparkle) + ')');
            }
        }

        // Rainbow ring effect at high sparkle (with browser support check)
        if (sparkle > 0.7 && typeof ctx.createConicGradient === 'function') {
            try {
                ctx.beginPath();
                ctx.arc(x, irisY, irisR * 0.65, 0, Math.PI * 2);
                var rainbowGrad = ctx.createConicGradient(time, x, irisY);
                var ra = (0.08 * sparkle);
                rainbowGrad.addColorStop(0, 'rgba(255, 100, 100, ' + ra + ')');
                rainbowGrad.addColorStop(0.25, 'rgba(100, 255, 100, ' + ra + ')');
                rainbowGrad.addColorStop(0.5, 'rgba(100, 100, 255, ' + ra + ')');
                rainbowGrad.addColorStop(0.75, 'rgba(255, 100, 255, ' + ra + ')');
                rainbowGrad.addColorStop(1, 'rgba(255, 100, 100, ' + ra + ')');
                ctx.strokeStyle = rainbowGrad;
                ctx.lineWidth = 2;
                ctx.stroke();
            } catch(e) { /* skip rainbow on unsupported browsers */ }
        }

        // Glow effect
        ctx.beginPath();
        ctx.arc(x, irisY, irisR * 1.05, 0, Math.PI * 2);
        var glowVal = 0.05 * sparkle * (0.8 + Math.sin(time * 2) * 0.2);
        var glowGrad = ctx.createRadialGradient(x, irisY, irisR * 0.8, x, irisY, irisR * 1.1);
        glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, ' + glowVal + ')');
        ctx.fillStyle = glowGrad;
        ctx.fill();
    }

    ctx.restore(); // Unclip

    // Eyelid outline
    var outEw = state.eyeShape === 'big' ? ew * 1.15 : ew;
    var outEh = state.eyeShape === 'big' ? eh * 1.15 : eh;
    ctx.beginPath();
    ctx.ellipse(x, y, outEw, outEh, 0, -Math.PI, 0);
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Eyelashes
    drawEyelashes(x, y, outEw, outEh, isRight);

    // Eyebrows
    drawEyebrow(x, y - outEh - 12, isRight);

    ctx.restore();
}

function drawStarSparkle(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
        var angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        var nextAngle = ((i + 0.5) / 4) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.lineTo(Math.cos(nextAngle) * size * 0.3, Math.sin(nextAngle) * size * 0.3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawEyelashes(x, y, ew, eh, isRight) {
    var count = state.lashStyle === 'thick' ? 7 : state.lashStyle === 'long' ? 5 : 3;
    var length = state.lashStyle === 'long' ? 14 : state.lashStyle === 'thick' ? 10 : 7;
    var lw = state.lashStyle === 'thick' ? 2.5 : 1.8;

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';

    for (var i = 0; i < count; i++) {
        var t = (i / (count - 1)) * 0.8 + 0.1;
        var angle = -Math.PI + t * Math.PI;
        var lx = x + Math.cos(angle) * ew;
        var ly = y + Math.sin(angle) * eh;
        var dir = angle - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + Math.cos(dir) * length, ly + Math.sin(dir) * length);
        ctx.stroke();
    }
}

function drawEyebrow(x, y, isRight) {
    ctx.save();
    var browWidth = state.browStyle === 'thick' ? 3.5 : state.browStyle === 'thin' ? 1.5 : 2.5;
    ctx.lineWidth = browWidth;
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineCap = 'round';
    ctx.beginPath();
    var bw = 28;
    ctx.moveTo(x - bw, y + 2);
    ctx.quadraticCurveTo(x, y - 8, x + bw, y + 2);
    ctx.stroke();
    ctx.restore();
}

// ========== Nose ==========
function drawNose() {
    var cx = 250, cy = 305;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy);
    ctx.lineTo(cx, cy + 6);
    ctx.lineTo(cx + 3, cy);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// ========== Mouth ==========
function drawMouth() {
    var cx = 250, cy = 340;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (state.mouthShape) {
        case 'smile':
            ctx.beginPath();
            ctx.moveTo(cx - 15, cy);
            ctx.quadraticCurveTo(cx, cy + 15, cx + 15, cy);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx, cy + 5, 6, 3, 0, 0, Math.PI);
            ctx.fillStyle = 'rgba(220, 80, 80, 0.3)';
            ctx.fill();
            break;
        case 'open':
            ctx.beginPath();
            ctx.ellipse(cx, cy + 3, 10, 14, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#8B0000';
            ctx.fill();
            ctx.beginPath();
            ctx.rect(cx - 8, cy - 5, 16, 6);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx, cy + 3, 11, 15, 0, 0, Math.PI * 2);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case 'cat':
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy + 2);
            ctx.lineTo(cx, cy + 8);
            ctx.lineTo(cx + 12, cy + 2);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - 4, cy + 8);
            ctx.lineTo(cx, cy + 5);
            ctx.lineTo(cx + 4, cy + 8);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            break;
        case 'pout':
            ctx.beginPath();
            ctx.ellipse(cx, cy + 4, 8, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#E74C3C';
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 4, 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            break;
    }
    ctx.restore();
}

// ========== Hair ==========
function drawHairBack() {
    var cx = 250, cy = 260;
    var color = state.hairColor;
    var darker = darkenColor(color, 30);

    ctx.save();

    switch (state.hairStyle) {
        case 'long':
            ctx.beginPath();
            ctx.moveTo(cx - 110, cy - 50);
            ctx.bezierCurveTo(cx - 125, cy + 100, cx - 110, cy + 250, cx - 80, cy + 330);
            ctx.lineTo(cx - 40, cy + 340);
            ctx.bezierCurveTo(cx - 70, cy + 250, cx - 95, cy + 50, cx - 80, cy - 20);
            ctx.fillStyle = darker;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx + 110, cy - 50);
            ctx.bezierCurveTo(cx + 125, cy + 100, cx + 110, cy + 250, cx + 80, cy + 330);
            ctx.lineTo(cx + 40, cy + 340);
            ctx.bezierCurveTo(cx + 70, cy + 250, cx + 95, cy + 50, cx + 80, cy - 20);
            ctx.fillStyle = darker;
            ctx.fill();
            break;
        case 'wavy':
            drawWavyHairBack(cx, cy, darker);
            break;
        case 'twintail':
            drawTwintailBack(cx, cy, color, darker);
            break;
        case 'ponytail':
            drawPonytailBack(cx, cy, color, darker);
            break;
        case 'short':
        case 'bun':
            ctx.beginPath();
            ctx.ellipse(cx, cy - 30, 105, 90, 0, 0.3, Math.PI - 0.3);
            ctx.fillStyle = darker;
            ctx.fill();
            break;
    }
    ctx.restore();
}

function drawWavyHairBack(cx, cy, darker) {
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy - 40);
    for (var i = 0; i < 12; i++) {
        var t = i / 12;
        var yPos = cy - 40 + t * 370;
        var wave = Math.sin(t * 6 + time * 0.5) * 15;
        ctx.lineTo(cx - 110 + wave - t * 20, yPos);
    }
    ctx.lineTo(cx - 50, cy + 330);
    ctx.bezierCurveTo(cx - 80, cy + 200, cx - 95, cy + 50, cx - 80, cy - 20);
    ctx.fillStyle = darker;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 110, cy - 40);
    for (var j = 0; j < 12; j++) {
        var t2 = j / 12;
        var yPos2 = cy - 40 + t2 * 370;
        var wave2 = Math.sin(t2 * 6 + time * 0.5 + 1) * 15;
        ctx.lineTo(cx + 110 - wave2 + t2 * 20, yPos2);
    }
    ctx.lineTo(cx + 50, cy + 330);
    ctx.bezierCurveTo(cx + 80, cy + 200, cx + 95, cy + 50, cx + 80, cy - 20);
    ctx.fillStyle = darker;
    ctx.fill();
}

function drawTwintailBack(cx, cy, color, darker) {
    ctx.beginPath();
    ctx.moveTo(cx - 85, cy - 10);
    ctx.bezierCurveTo(cx - 130, cy + 50, cx - 140, cy + 200, cx - 110, cy + 340);
    ctx.lineTo(cx - 70, cy + 330);
    ctx.bezierCurveTo(cx - 100, cy + 200, cx - 100, cy + 80, cx - 70, cy + 10);
    ctx.fillStyle = darker;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 85, cy - 10);
    ctx.bezierCurveTo(cx + 130, cy + 50, cx + 140, cy + 200, cx + 110, cy + 340);
    ctx.lineTo(cx + 70, cy + 330);
    ctx.bezierCurveTo(cx + 100, cy + 200, cx + 100, cy + 80, cx + 70, cy + 10);
    ctx.fillStyle = darker;
    ctx.fill();
}

function drawPonytailBack(cx, cy, color, darker) {
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 80);
    ctx.bezierCurveTo(cx + 60, cy - 70, cx + 120, cy + 20, cx + 100, cy + 300);
    ctx.lineTo(cx + 60, cy + 310);
    ctx.bezierCurveTo(cx + 80, cy + 50, cx + 40, cy - 30, cx + 10, cy - 60);
    ctx.fillStyle = darker;
    ctx.fill();
}

function drawHairFront() {
    var cx = 250, cy = 260;
    var color = state.hairColor;
    var lighter = lightenColor(color, 20);
    var shine = state.hairShine / 100;

    ctx.save();

    // Top hair volume
    ctx.beginPath();
    ctx.ellipse(cx, cy - 75, 105, 55, 0, Math.PI, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Side hair
    if (state.hairStyle !== 'bun') {
        ctx.beginPath();
        ctx.moveTo(cx - 95, cy - 70);
        ctx.bezierCurveTo(cx - 115, cy - 30, cx - 115, cy + 20, cx - 105, cy + 60);
        ctx.lineTo(cx - 85, cy + 50);
        ctx.bezierCurveTo(cx - 95, cy + 10, cx - 95, cy - 30, cx - 80, cy - 55);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 95, cy - 70);
        ctx.bezierCurveTo(cx + 115, cy - 30, cx + 115, cy + 20, cx + 105, cy + 60);
        ctx.lineTo(cx + 85, cy + 50);
        ctx.bezierCurveTo(cx + 95, cy + 10, cx + 95, cy - 30, cx + 80, cy - 55);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Hair shine streaks
    if (shine > 0) {
        for (var i = 0; i < 3; i++) {
            var sx = cx - 40 + i * 30;
            ctx.beginPath();
            ctx.moveTo(sx, cy - 110);
            ctx.quadraticCurveTo(sx + 5, cy - 90, sx - 5, cy - 70);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (shine * 0.25) + ')';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    // Bun
    if (state.hairStyle === 'bun') {
        ctx.beginPath();
        ctx.arc(cx, cy - 130, 35, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - 8, cy - 140, 12, 0, Math.PI * 2);
        var bunGrad = ctx.createRadialGradient(cx - 8, cy - 140, 0, cx - 8, cy - 140, 12);
        bunGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (shine * 0.3) + ')');
        bunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = bunGrad;
        ctx.fill();
    }

    ctx.restore();
}

// ========== Bangs ==========
function drawBangs() {
    var cx = 250, cy = 260;
    var color = state.hairColor;
    var lighter = lightenColor(color, 15);
    var shine = state.hairShine / 100;

    ctx.save();

    switch (state.bangsStyle) {
        case 'straight':
            for (var i = 0; i < 7; i++) {
                var bx = cx - 72 + i * 24;
                ctx.beginPath();
                ctx.moveTo(bx - 12, cy - 105);
                ctx.bezierCurveTo(bx - 8, cy - 60, bx + 2, cy - 30, bx, cy - 15);
                ctx.bezierCurveTo(bx + 8, cy - 30, bx + 16, cy - 60, bx + 12, cy - 105);
                ctx.fillStyle = i % 2 === 0 ? color : lighter;
                ctx.fill();
            }
            break;
        case 'side':
            ctx.beginPath();
            ctx.moveTo(cx - 90, cy - 105);
            ctx.bezierCurveTo(cx - 60, cy - 50, cx - 20, cy - 20, cx + 40, cy - 30);
            ctx.bezierCurveTo(cx + 60, cy - 35, cx + 80, cy - 60, cx + 85, cy - 90);
            ctx.lineTo(cx + 95, cy - 105);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - 70, cy - 100);
            ctx.bezierCurveTo(cx - 40, cy - 50, cx, cy - 25, cx + 30, cy - 35);
            ctx.strokeStyle = lighter;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.stroke();
            break;
        case 'curtain':
            for (var li = 0; li < 4; li++) {
                var lbx = cx - 20 - li * 20;
                ctx.beginPath();
                ctx.moveTo(lbx + 10, cy - 105);
                ctx.bezierCurveTo(lbx - 5, cy - 60, lbx - 15, cy - 30, lbx - 10 - li * 5, cy - 10 + li * 5);
                ctx.bezierCurveTo(lbx - 5, cy - 30, lbx + 5, cy - 60, lbx + 20, cy - 105);
                ctx.fillStyle = li % 2 === 0 ? color : lighter;
                ctx.fill();
            }
            for (var ri = 0; ri < 4; ri++) {
                var rbx = cx + 20 + ri * 20;
                ctx.beginPath();
                ctx.moveTo(rbx - 10, cy - 105);
                ctx.bezierCurveTo(rbx + 5, cy - 60, rbx + 15, cy - 30, rbx + 10 + ri * 5, cy - 10 + ri * 5);
                ctx.bezierCurveTo(rbx + 5, cy - 30, rbx - 5, cy - 60, rbx - 20, cy - 105);
                ctx.fillStyle = ri % 2 === 0 ? color : lighter;
                ctx.fill();
            }
            break;
        case 'none':
            ctx.beginPath();
            ctx.ellipse(cx, cy - 78, 95, 30, 0, Math.PI, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            break;
    }

    // Bangs shine
    if (shine > 0 && state.bangsStyle !== 'none') {
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 90);
        ctx.quadraticCurveTo(cx, cy - 60, cx + 20, cy - 85);
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + (shine * 0.3) + ')';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    ctx.restore();
}

// ========== Accessories ==========
function drawAccessory() {
    var cx = 250, cy = 260;
    ctx.save();

    switch (state.accessory) {
        case 'ribbon':
            drawRibbon(cx + 60, cy - 110);
            break;
        case 'flower':
            drawFlower(cx + 65, cy - 100);
            break;
        case 'star':
            drawStarAccessory(cx + 60, cy - 110);
            break;
        case 'crown':
            drawCrown(cx, cy - 135);
            break;
        case 'cat_ears':
            drawCatEars(cx, cy - 120);
            break;
    }

    ctx.restore();
}

function drawRibbon(x, y) {
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.bezierCurveTo(x - 25, y - 20, x - 35, y - 5, x - 30, y + 5);
    ctx.bezierCurveTo(x - 25, y + 15, x - 10, y + 5, x - 5, y);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.bezierCurveTo(x + 25, y - 20, x + 35, y - 5, x + 30, y + 5);
    ctx.bezierCurveTo(x + 25, y + 15, x + 10, y + 5, x + 5, y);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 2, y - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
}

function drawFlower(x, y) {
    for (var i = 0; i < 5; i++) {
        var angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        var px = x + Math.cos(angle) * 12;
        var py = y + Math.sin(angle) * 12;
        ctx.beginPath();
        ctx.ellipse(px, py, 10, 6, angle, 0, Math.PI * 2);
        ctx.fillStyle = '#FFB6C1';
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FDCB6E';
    ctx.fill();
}

function drawStarAccessory(x, y) {
    var size = 18;
    var glow = 0.5 + Math.sin(time * 3) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, size + 5, 0, Math.PI * 2);
    var glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size + 5);
    glowGrad.addColorStop(0, 'rgba(255, 215, 0, ' + (glow * 0.3) + ')');
    glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fill();

    ctx.beginPath();
    for (var i = 0; i < 5; i++) {
        var angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        var innerAngle = angle + Math.PI / 5;
        ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        ctx.lineTo(x + Math.cos(innerAngle) * size * 0.4, y + Math.sin(innerAngle) * size * 0.4);
    }
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawCrown(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 35, y + 15);
    ctx.lineTo(x - 30, y - 5);
    ctx.lineTo(x - 15, y + 5);
    ctx.lineTo(x, y - 15);
    ctx.lineTo(x + 15, y + 5);
    ctx.lineTo(x + 30, y - 5);
    ctx.lineTo(x + 35, y + 15);
    ctx.closePath();
    var crownGrad = ctx.createLinearGradient(x - 35, y - 15, x + 35, y + 15);
    crownGrad.addColorStop(0, '#FFD700');
    crownGrad.addColorStop(0.5, '#FFF68F');
    crownGrad.addColorStop(1, '#FFD700');
    ctx.fillStyle = crownGrad;
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    var jewels = [[-15, 0], [0, -8], [15, 0]];
    var colors = ['#E74C3C', '#3498DB', '#E74C3C'];
    for (var i = 0; i < jewels.length; i++) {
        ctx.beginPath();
        ctx.arc(x + jewels[i][0], y + jewels[i][1], 4, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + jewels[i][0] - 1, y + jewels[i][1] - 1, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
    }
}

function drawCatEars(cx, cy) {
    var earColor = state.hairColor;
    var innerColor = '#FFB6C1';

    ctx.beginPath();
    ctx.moveTo(cx - 70, cy + 15);
    ctx.lineTo(cx - 85, cy - 40);
    ctx.lineTo(cx - 35, cy + 5);
    ctx.closePath();
    ctx.fillStyle = earColor;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 68, cy + 5);
    ctx.lineTo(cx - 78, cy - 25);
    ctx.lineTo(cx - 45, cy + 0);
    ctx.closePath();
    ctx.fillStyle = innerColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 70, cy + 15);
    ctx.lineTo(cx + 85, cy - 40);
    ctx.lineTo(cx + 35, cy + 5);
    ctx.closePath();
    ctx.fillStyle = earColor;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 68, cy + 5);
    ctx.lineTo(cx + 78, cy - 25);
    ctx.lineTo(cx + 45, cy + 0);
    ctx.closePath();
    ctx.fillStyle = innerColor;
    ctx.fill();
}

// ========== Effects ==========
function drawEffects() {
    if (state.effect === 'none') return;

    var w = canvas.width, h = canvas.height;

    switch (state.effect) {
        case 'sparkles':
            for (var i = 0; i < 20; i++) {
                var sx = (Math.sin(i * 67.3 + time * 0.3) * 0.5 + 0.5) * w;
                var sy = (Math.cos(i * 41.7 + time * 0.2) * 0.5 + 0.5) * h;
                var ss = 3 + Math.sin(time * 4 + i * 2) * 2;
                var alpha = 0.3 + Math.sin(time * 3 + i * 1.5) * 0.3;
                drawStarSparkle(sx, sy, ss, 'rgba(255, 215, 0, ' + alpha + ')');
            }
            break;
        case 'hearts':
            for (var hi = 0; hi < 12; hi++) {
                var hx = (Math.sin(hi * 53.3 + time * 0.2) * 0.5 + 0.5) * w;
                var hy = ((h - (hi * 57 + time * 30) % (h + 40)) + h) % (h + 40) - 20;
                var ha = 0.2 + Math.sin(time * 2 + hi) * 0.15;
                drawHeart(hx, hy, 5 + hi % 3, 'rgba(255, 107, 157, ' + ha + ')');
            }
            break;
        case 'stars':
            for (var si = 0; si < 15; si++) {
                var stx = (Math.sin(si * 37.7 + time * 0.15) * 0.5 + 0.5) * w;
                var sty = (Math.cos(si * 29.3 + time * 0.1) * 0.5 + 0.5) * h;
                var rot = time + si;
                var sts = 4 + Math.sin(time * 2 + si) * 2;
                var sta = 0.2 + Math.sin(time * 3 + si * 0.8) * 0.15;
                ctx.save();
                ctx.translate(stx, sty);
                ctx.rotate(rot);
                drawStarSparkle(0, 0, sts, 'rgba(255, 255, 200, ' + sta + ')');
                ctx.restore();
            }
            break;
    }
}

// ========== Utility ==========
function hexToRgb(hex) {
    if (!hex || hex.charAt(0) !== '#') return { r: 200, g: 200, b: 200 };
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 200, g: 200, b: 200 };
}

function lightenColor(hex, amount) {
    var rgb = hexToRgb(hex);
    return 'rgb(' + Math.min(255, rgb.r + amount) + ', ' + Math.min(255, rgb.g + amount) + ', ' + Math.min(255, rgb.b + amount) + ')';
}

function darkenColor(hex, amount) {
    var rgb = hexToRgb(hex);
    return 'rgb(' + Math.max(0, rgb.r - amount) + ', ' + Math.max(0, rgb.g - amount) + ', ' + Math.max(0, rgb.b - amount) + ')';
}

// ========== Start ==========
document.addEventListener('DOMContentLoaded', init);
