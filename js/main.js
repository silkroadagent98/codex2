// Top Drives IR – MVP
// Phaser 3 setup with scenes: MainMenu, Garage, RaceSetup, Race

(function () {
  const WIDTH = 1280;
  const HEIGHT = 720;

  // Expose simple navigation helpers for the HTML overlay
  const API = {
    goMainMenu: () => game.scene.start('MainMenu'),
    goGarage: () => game.scene.start('Garage'),
    goRaceSetup: () => game.scene.start('RaceSetup'),
  };

  // UI overlay visibility management
  function showOverlay(mode) {
    const start = document.getElementById('btn-start');
    const garage = document.getElementById('btn-garage');
    const back = document.getElementById('btn-back');
    if (!start || !garage || !back) return;
    if (mode === 'menu') {
      start.classList.remove('hidden');
      garage.classList.remove('hidden');
      back.classList.add('hidden');
    } else if (mode === 'back') {
      start.classList.add('hidden');
      garage.classList.add('hidden');
      back.classList.remove('hidden');
    } else {
      start.classList.add('hidden');
      garage.classList.add('hidden');
      back.classList.add('hidden');
    }
  }

  // Utility: create a rounded rectangle button in a scene
  function createTextButton(scene, x, y, w, h, label, onClick) {
    const bg = scene.add.rectangle(x, y, w, h, 0xffffff, 0.08).setStrokeStyle(2, 0xffffff, 0.4).setOrigin(0.5);
    const txt = scene.add.text(x, y, label, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');
    bg.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    txt.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    return { bg, txt };
  }

  // Scene: MainMenu
  class MainMenu extends Phaser.Scene {
    constructor() { super('MainMenu'); }
    create() {
      showOverlay('menu');
      this.add.rectangle(WIDTH/2, HEIGHT/2, Math.min(WIDTH-160, 900), 360, 0x20264d, 0.9).setStrokeStyle(4, 0xffffff, 0.2);
      this.add.text(WIDTH/2, HEIGHT/2 - 80, 'توپ درایوز IR – نسخه اولیه', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');
      const team = window.StorageHelpers.getTeam();
      const teamNames = team.map(i => window.Cars[i]?.name || '?');
      const teamText = team.length === 3 ? ('تیم شما: ' + teamNames.join(' | ')) : 'لطفاً ۳ خودرو در گاراژ انتخاب کنید';
      this.add.text(WIDTH/2, HEIGHT/2, teamText, { fontSize: '22px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');
      this.add.text(WIDTH/2, HEIGHT/2 + 80, 'از دکمه‌های بالا برای شروع یا رفتن به گاراژ استفاده کنید', { fontSize: '18px', color: '#ffffffaa' }).setOrigin(0.5).setAlign('center');
    }
  }

  // Scene: Garage – select up to 3 cars
  class Garage extends Phaser.Scene {
    constructor() { super('Garage'); }
    create() {
      showOverlay('back');
      this.add.text(WIDTH/2, 40, 'گاراژ – حداکثر ۳ خودرو انتخاب کنید', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');

      const stored = window.StorageHelpers.getTeam();
      const selected = new Set(stored);
      const cars = window.Cars;

      const cols = 3;
      const cardW = 360;
      const cardH = 140;
      const startX = (WIDTH - (cols * cardW) - ((cols - 1) * 20)) / 2;
      const startY = 90;
      const gap = 20;

      const cards = [];
      cars.forEach((car, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = startX + col * (cardW + gap) + cardW / 2;
        const y = startY + row * (cardH + gap) + cardH / 2;

        const bg = this.add.rectangle(x, y, cardW, cardH, 0x141a36, 0.9).setStrokeStyle(2, 0xffffff, 0.15);
        const name = this.add.text(x, y - 40, car.name, { fontSize: '22px', color: '#ffffff' }).setOrigin(0.5);
        const stats = `سرعت ${car.spd} | شتاب ${car.acc} | کنترل ${car.ctl} | هندل ${car.hdl}`;
        const txt = this.add.text(x, y + 4, stats, { fontSize: '18px', color: '#ffffffaa' }).setOrigin(0.5).setAlign('center');

        const icon = this.add.rectangle(x - cardW/2 + 40, y, 60, 60, 0x2e8b57, 0.9).setStrokeStyle(2, 0xffffff, 0.25);

        const hl = this.add.rectangle(x, y, cardW+6, cardH+6, 0x00c2ff, 0.0).setStrokeStyle(4, 0x00c2ff, 0.0).setDepth(10);

        function refreshHighlight() {
          const isSel = selected.has(idx);
          hl.setFillStyle(isSel ? 0x00c2ff : 0x00c2ff, isSel ? 0.06 : 0.0);
          hl.setStrokeStyle(4, 0x00c2ff, isSel ? 1.0 : 0.0);
        }

        const interactiveZone = this.add.rectangle(x, y, cardW, cardH, 0x000000, 0).setInteractive({ useHandCursor: true });
        interactiveZone.on('pointerdown', () => {
          if (selected.has(idx)) {
            selected.delete(idx);
            refreshHighlight();
            return;
          }
          if (selected.size >= 3) {
            this.showToast('حداکثر ۳ خودرو قابل انتخاب است');
            return;
          }
          selected.add(idx);
          refreshHighlight();
        });

        refreshHighlight();
        cards.push({ bg, name, txt, icon, hl, idx });
      });

      const saveBtn = createTextButton(this, WIDTH/2, HEIGHT - 60, 260, 56, 'ذخیره و بازگشت', () => {
        window.StorageHelpers.setTeam(Array.from(selected));
        this.scene.start('MainMenu');
      });
    }

    showToast(message) {
      const t = this.add.text(WIDTH/2, HEIGHT - 120, message, { fontSize: '20px', color: '#ffffff', backgroundColor: '#ff006655', padding: { x: 10, y: 6 } }).setOrigin(0.5);
      this.time.delayedCall(1400, () => t.destroy());
    }
  }

  // Scene: RaceSetup – confirm team and track
  class RaceSetup extends Phaser.Scene {
    constructor() { super('RaceSetup'); }
    create() {
      showOverlay('back');
      this.add.text(WIDTH/2, 50, 'آماده‌سازی مسابقه – مسیر: آسفالت', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
      const teamIdx = window.StorageHelpers.getTeam();
      const cars = teamIdx.map(i => window.Cars[i]).filter(Boolean);

      const warn = cars.length < 3 ? 'تعداد خودروهای انتخاب‌شده کمتر از ۳ است' : '';
      if (warn) {
        this.add.text(WIDTH/2, 90, warn, { fontSize: '18px', color: '#ffcccc' }).setOrigin(0.5);
      }

      const cardW = 320, cardH = 160;
      const totalW = (cardW * 3) + (20 * 2);
      let x = (WIDTH - totalW) / 2 + cardW/2;
      const y = HEIGHT/2 - 30;
      for (let k = 0; k < 3; k++) {
        const car = cars[k];
        const rect = this.add.rectangle(x, y, cardW, cardH, 0x141a36, 0.9).setStrokeStyle(2, 0xffffff, 0.15);
        const label = car ? `${car.name}\nS${car.spd} A${car.acc} C${car.ctl} H${car.hdl}` : '—';
        this.add.text(x, y, label, { fontSize: '20px', color: '#ffffff', align: 'center' }).setOrigin(0.5).setAlign('center');
        x += cardW + 20;
      }

      createTextButton(this, WIDTH/2, HEIGHT - 70, 220, 56, 'شروع مسابقه', () => {
        this.scene.start('Race');
      });
    }
  }

  // Scene: Race – simple bar race based on score sum
  class Race extends Phaser.Scene {
    constructor() { super('Race'); }
    create() {
      showOverlay('back');
      this.cameras.main.setBackgroundColor('#0f1226');
      const margin = 100;
      const startX = 120;
      const finishX = WIDTH - margin;

      this.add.text(WIDTH/2, 40, 'مسابقه – آسفالت', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);

      const allCars = window.Cars;
      const playerIdxs = window.StorageHelpers.getTeam();
      const playerCars = playerIdxs.map(i => allCars[i]).filter(Boolean).slice(0,3);
      while (playerCars.length < 3) playerCars.push({ name: '—', spd: 0, acc: 0, ctl: 0, hdl: 0 });

      function pickRandomDistinct(count, maxExclusive) {
        const bag = Array.from({ length: maxExclusive }, (_, i) => i);
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const t = bag[i]; bag[i] = bag[j]; bag[j] = t;
        }
        return bag.slice(0, count);
      }
      const botIdxs = pickRandomDistinct(3, allCars.length);
      const botCars = botIdxs.map(i => allCars[i]);

      const playerScores = playerCars.map(c => (c.spd + c.acc + c.ctl + c.hdl));
      const botScores = botCars.map(c => (c.spd + c.acc + c.ctl + c.hdl));
      const maxScore = Math.max(1, ...playerScores, ...botScores);

      const laneY = [HEIGHT/2 - 180, HEIGHT/2 - 120, HEIGHT/2 - 60, HEIGHT/2 + 60, HEIGHT/2 + 120, HEIGHT/2 + 180];

      // Labels for teams
      this.add.text(WIDTH/2, HEIGHT/2 - 220, 'بازیکن', { fontSize: '20px', color: '#aeeaff' }).setOrigin(0.5);
      this.add.text(WIDTH/2, HEIGHT/2 + 220, 'ربات', { fontSize: '20px', color: '#ffd9a3' }).setOrigin(0.5);

      // Draw lanes and finish line
      laneY.forEach(y => this.add.rectangle(WIDTH/2, y, WIDTH - margin*0.6, 2, 0xffffff, 0.15));
      this.add.rectangle(finishX, HEIGHT/2, 6, 420, 0xffd700, 0.8);
      this.add.text(finishX + 24, HEIGHT/2, 'پایان', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

      const colorsPlayer = [0x2e8b57, 0x1e90ff, 0xff6a00];
      const colorsBot = [0xff3b3b, 0xbf5fff, 0xffc107];

      const runners = [];
      playerCars.forEach((c, i) => {
        const bar = this.add.rectangle(startX, laneY[i], 80, 24, colorsPlayer[i], 0.95).setOrigin(0, 0.5).setStrokeStyle(2, 0xffffff, 0.2);
        const label = this.add.text(startX - 10, laneY[i], c.name, { fontSize: '16px', color: '#ffffff' }).setOrigin(1, 0.5);
        runners.push({ bar, score: playerScores[i] });
      });
      botCars.forEach((c, i) => {
        const bar = this.add.rectangle(startX, laneY[3 + i], 80, 24, colorsBot[i], 0.95).setOrigin(0, 0.5).setStrokeStyle(2, 0xffffff, 0.2);
        const label = this.add.text(startX - 10, laneY[3 + i], c.name, { fontSize: '16px', color: '#ffffff' }).setOrigin(1, 0.5);
        runners.push({ bar, score: botScores[i] });
      });

      // Deterministic time to finish for each car based on score
      const distance = finishX - startX - 80;
      const baseTime = 9000; // ms for a car with score == 1 to finish
      const times = runners.map(r => baseTime * (maxScore / Math.max(1, r.score)));

      this.elapsed = 0;
      this.update = (time, delta) => {
        this.elapsed += delta;
        runners.forEach((r, i) => {
          const t = times[i];
          const progress = Math.min(1, this.elapsed / t);
          r.bar.x = startX + progress * distance;
        });
        if (!this.resultShown && this.elapsed >= Math.max(...times)) {
          this.resultShown = true;
          const playerSum = playerScores.reduce((a,b)=>a+b,0);
          const botSum = botScores.reduce((a,b)=>a+b,0);
          const outcome = playerSum > botSum ? 'بازیکن' : (playerSum < botSum ? 'ربات' : 'مساوی');
          const scoreText = `نتیجه: ${outcome}${outcome==='مساوی'?'':' برنده شد!'}\nامتیاز بازیکن: ${playerSum} | امتیاز ربات: ${botSum}\nپاداش: +1 کارت`;
          const panel = this.add.rectangle(WIDTH/2, HEIGHT/2, 620, 200, 0x111633, 0.95).setStrokeStyle(3, 0xffffff, 0.2).setDepth(10);
          this.add.text(WIDTH/2, HEIGHT/2 - 30, scoreText, { fontSize: '22px', color: '#ffffff', align: 'center' }).setOrigin(0.5).setDepth(11).setAlign('center');
          const btn = createTextButton(this, WIDTH/2, HEIGHT/2 + 60, 220, 50, 'بازگشت به منو', () => {
            const prog = window.StorageHelpers.loadProgress();
            prog.cards = (prog.cards || 0) + 1;
            window.StorageHelpers.saveProgress(prog);
            this.scene.start('MainMenu');
          });
          btn.bg.setDepth(11); btn.txt.setDepth(12);
        }
      };
    }
  }

  // Phaser game config
  const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0f1226',
    scene: [MainMenu, Garage, RaceSetup, Race],
  };

  const game = new Phaser.Game(config);

  // Expose navigation helpers after game init
  window.TopDrivesIR = API;
})();

