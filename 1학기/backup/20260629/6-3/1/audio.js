// Web Audio API를 이용한 복고풍 사운드 효과 및 배경음악 합성 엔진

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = this.loadMutedPreference();
    this.bgmInterval = null;
    this.currentBgmType = null; // 현재 실제로 재생 중인 BGM
    this.requestedBgmType = null; // 음소거 중에도 마지막으로 요청된 BGM 기억
    this.bgmVolumeNode = null;
    this.sfxVolumeNode = null;
    this.activeOscillators = [];
    this.bgmVolume = 0.08;
    this.sfxVolume = 0.2;
  }

  // 사용자의 첫 상호작용(클릭 등) 시 오디오 컨텍스트 초기화
  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // 볼륨 컨트롤 노드 생성
      this.bgmVolumeNode = this.ctx.createGain();
      this.bgmVolumeNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.bgmVolumeNode.connect(this.ctx.destination);

      this.sfxVolumeNode = this.ctx.createGain();
      this.sfxVolumeNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxVolumeNode.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser.", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadMutedPreference() {
    try {
      return localStorage.getItem('science-rpg-muted') === 'true';
    } catch (e) {
      return false;
    }
  }

  saveMutedPreference() {
    try {
      localStorage.setItem('science-rpg-muted', String(this.isMuted));
    } catch (e) {}
  }

  applyMuteState() {
    if (!this.bgmVolumeNode || !this.sfxVolumeNode || !this.ctx) return;

    const bgmTarget = this.isMuted ? 0 : this.bgmVolume;
    const sfxTarget = this.isMuted ? 0 : this.sfxVolume;
    this.bgmVolumeNode.gain.setValueAtTime(bgmTarget, this.ctx.currentTime);
    this.sfxVolumeNode.gain.setValueAtTime(sfxTarget, this.ctx.currentTime);
  }

  setMuted(isMuted) {
    this.init();
    this.isMuted = isMuted;
    this.saveMutedPreference();
    this.applyMuteState();

    if (this.isMuted) {
      this.stopBgm(false);
    } else if (this.requestedBgmType) {
      this.resume();
      this.startBgm(this.requestedBgmType, true);
    }

    return this.isMuted;
  }

  toggleMute() {
    return this.setMuted(!this.isMuted);
  }

  // --- 효과음 (SFX) 합성기 ---

  playShoot(rarity) {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);

    const now = this.ctx.currentTime;
    
    // 희귀도에 따라 쏘는 소리 다르게 디자인
    if (rarity === "전설") {
      // 레이저/물줄기 고속 발사음
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (rarity === "신화") {
      // 깔끔한 고주파 뿅 소리
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (rarity === "에픽") {
      // 통통 튀는 소리
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      // 희귀 (쓰레기 물총) - 픽! 픽! 둔탁하고 짧은 소리
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.18);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  }

  playHit() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    // 타격음 (짧은 저주파 삼각파 + 잡음 필터링 대용)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);

    const now = this.ctx.currentTime;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.08);
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playExplosion() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    // 몬스터 처치 시 '퍼펑' 소리 (가상 노이즈 생성)
    const bufferSize = this.ctx.sampleRate * 0.25; // 0.25초
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxVolumeNode);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.25);
  }

  playCoin() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 차링~ 동전 소리 (고주파 사각파 2음 연속 재생)
    const playTone = (freq, startTime, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.005, startTime + duration);
      osc.connect(gain);
      gain.connect(this.sfxVolumeNode);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(987.77, now, 0.08); // B5
    playTone(1318.51, now + 0.08, 0.2); // E6
  }

  playQuizSuccess() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 퀴즈 정답! 밝은 3화음 아르페지오 (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      gain.gain.setValueAtTime(0.3, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.sfxVolumeNode);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.25);
    });
  }

  playQuizFailure() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 퀴즈 오답... 무겁고 하강하는 띠익~ 소리
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "sine";
    
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.linearRampToValueAtTime(110, now + 0.4);
    osc2.frequency.setValueAtTime(223, now); // 약간의 디튠으로 맥놀이 생성
    osc2.frequency.linearRampToValueAtTime(113, now + 0.4);

    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.linearRampToValueAtTime(0.01, now + 0.4);
    gain2.gain.setValueAtTime(0.3, now);
    gain2.gain.linearRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(this.sfxVolumeNode);
    osc2.connect(gain2);
    gain2.connect(this.sfxVolumeNode);

    osc1.start(now);
    osc1.stop(now + 0.4);
    osc2.start(now);
    osc2.stop(now + 0.4);
  }

  playBuy() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 상점 구매 효과음 (딸그랑 캐쉬 소리 + 청아한 차임)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.25);

    // 노이즈성 찰랑 소리 추가
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(5000, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.linearRampToValueAtTime(0.005, now + 0.15);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxVolumeNode);

    noiseNode.start(now);
    noiseNode.stop(now + 0.15);
  }

  playTeleport() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 포탈 텔레포트음: 고주파 스윕
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
    
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.25);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxVolumeNode);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playVictory() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 던전 클리어! 승리 팡파르
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.24 }, // C5
      { f: 659.25, d: 0.24 }, // E5
      { f: 587.33, d: 0.24 }, // D5
      { f: 659.25, d: 0.24 }, // E5
      { f: 783.99, d: 0.48 }  // G5
    ];
    let timeAccumulator = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(note.f, timeAccumulator);
      gain.gain.setValueAtTime(0.2, timeAccumulator);
      gain.gain.exponentialRampToValueAtTime(0.01, timeAccumulator + note.d);

      osc.connect(gain);
      gain.connect(this.sfxVolumeNode);
      osc.start(timeAccumulator);
      osc.stop(timeAccumulator + note.d);
      
      timeAccumulator += note.d + 0.02;
    });
  }

  playDefeat() {
    this.init();
    this.resume();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // 사망/게임오버 슬픈 멜로디 (하강 마이너 화음)
    const melody = [
      { f: 392.00, d: 0.15 }, // G4
      { f: 349.23, d: 0.15 }, // F4
      { f: 311.13, d: 0.15 }, // Eb4
      { f: 261.63, d: 0.45 }  // C4
    ];
    let timeAccumulator = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, timeAccumulator);
      gain.gain.setValueAtTime(0.3, timeAccumulator);
      gain.gain.exponentialRampToValueAtTime(0.01, timeAccumulator + note.d);

      osc.connect(gain);
      gain.connect(this.sfxVolumeNode);
      osc.start(timeAccumulator);
      osc.stop(timeAccumulator + note.d);
      
      timeAccumulator += note.d + 0.05;
    });
  }


  // --- 배경음악 (BGM) 루프 합성기 ---

  startBgm(type, forceRestart = false) {
    this.requestedBgmType = type;
    this.init();
    this.resume();
    if (!this.ctx) return;

    if (this.isMuted) {
      this.stopBgm(false);
      return;
    }

    if (!forceRestart && this.currentBgmType === type && this.bgmInterval) return;
    this.stopBgm(false); // 이전 BGM 중지
    this.currentBgmType = type;

    let step = 0;

    if (type === 'town') {
      // 로비: 평화로운 4비트 서정적인 아르페지오 (C - F - G - Am)
      const progression = [
        [261.63, 329.63, 392.00, 523.25], // C Major (C4, E4, G4, C5)
        [349.23, 440.00, 523.25, 698.46], // F Major (F4, A4, C5, F5)
        [392.00, 493.88, 587.33, 783.99], // G Major (G4, B4, D5, G5)
        [440.00, 523.25, 659.25, 880.00]  // A Minor (A4, C5, E5, A5)
      ];

      const playStep = () => {
        const chordIndex = Math.floor(step / 4) % progression.length;
        const noteIndex = step % 4;
        const freq = progression[chordIndex][noteIndex];
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        
        osc.connect(gain);
        gain.connect(this.bgmVolumeNode);
        
        osc.start(now);
        osc.stop(now + 0.6);
        
        // 가비지 컬렉터 대비
        this.activeOscillators.push(osc);
        if (this.activeOscillators.length > 50) {
          this.activeOscillators.splice(0, 20);
        }

        step++;
      };

      // 0.4초마다 노트 한개씩 재생 (조용하고 부드러움)
      playStep();
      this.bgmInterval = setInterval(playStep, 400);

    } else if (type === 'dungeon') {
      // 던전: 긴장감 있는 빠른 베이스라인 + 테크노 멜로디
      // 마이너 스케일
      const scale = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63]; // C3~C4 마이너 스케일 베이스
      const leadMelody = [261.63, 0, 311.13, 392.00, 349.23, 0, 466.16, 523.25];

      const playStep = () => {
        const now = this.ctx.currentTime;
        
        // 1. 베이스 비트
        const baseIndex = step % 4;
        let baseFreq = scale[0];
        if (Math.floor(step / 16) % 2 === 1) {
          baseFreq = scale[2]; // Eb3로 변화
        }
        if (baseIndex === 0 || baseIndex === 2) {
          const oscBase = this.ctx.createOscillator();
          const gainBase = this.ctx.createGain();
          
          oscBase.type = "triangle";
          oscBase.frequency.setValueAtTime(baseFreq, now);
          gainBase.gain.setValueAtTime(0.2, now);
          gainBase.gain.linearRampToValueAtTime(0.01, now + 0.2);
          
          oscBase.connect(gainBase);
          gainBase.connect(this.bgmVolumeNode);
          oscBase.start(now);
          oscBase.stop(now + 0.2);
          this.activeOscillators.push(oscBase);
        }

        // 2. 고주파 비트/멜로디 (가끔 재생하여 아케이드 느낌 강조)
        const leadFreq = leadMelody[step % leadMelody.length];
        if (leadFreq > 0 && Math.random() > 0.3) {
          const oscLead = this.ctx.createOscillator();
          const gainLead = this.ctx.createGain();
          
          oscLead.type = "square";
          oscLead.frequency.setValueAtTime(leadFreq, now);
          gainLead.gain.setValueAtTime(0.06, now);
          gainLead.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
          
          oscLead.connect(gainLead);
          gainLead.connect(this.bgmVolumeNode);
          oscLead.start(now);
          oscLead.stop(now + 0.15);
          this.activeOscillators.push(oscLead);
        }

        step++;
      };

      // 0.2초마다 비트 재생
      playStep();
      this.bgmInterval = setInterval(playStep, 200);
    }
  }

  stopBgm(clearRequestedType = true) {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    // 남아있는 발진기 즉각 종료
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];
    this.currentBgmType = null;
    if (clearRequestedType) {
      this.requestedBgmType = null;
    }
  }
}

// 싱글톤 패턴으로 오디오 인스턴스 노출
const gameAudio = new AudioEngine();
