// Top Drives IR – MVP using Phaser 3
// Scenes: MainMenu, Garage, RaceSetup, Race
// No build step; global variables from data.js and storage.js

const WIDTH = 1280;
const HEIGHT = 720;

// Utility: create a simple rounded rect button with text
function makeTextButton(scene, x, y, label, onClick) {
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, 220, 52, 0x222222).setStrokeStyle(2, 0x777777).setOrigin(0.5);
  const txt = scene.add.text(0, 0, label, { fontSize: '22px', color: '#ffffff', fontFamily: 'sans-serif' }).setOrigin(0.5).setAlign('center');
  container.add([bg, txt]);
  bg.setInteractive({ useHandCursor: true });
  bg.on('pointerover', () => bg.setFillStyle(0x333333));
  bg.on('pointerout', () => bg.setFillStyle(0x222222));
  bg.on('pointerdown', () => onClick && onClick());
  return container;
}

class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }
  create() {
    // Background
    this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x111111);
    this.add.text(WIDTH/2, 120, 'Top Drives IR – MVP', { fontSize: '36px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');

    // Buttons hook to DOM buttons and in-canvas duplicates
    const startBtn = makeTextButton(this, WIDTH/2, 240, 'شروع', () => this.scene.start('RaceSetup'));
    const garageBtn = makeTextButton(this, WIDTH/2, 310, 'گاراژ', () => this.scene.start('Garage'));

    // Also wire external DOM buttons if present
    const btnStart = document.getElementById('btnStart');
    const btnGarage = document.getElementById('btnGarage');
    const btnBack = document.getElementById('btnBack');
    if (btnStart) btnStart.onclick = () => this.scene.start('RaceSetup');
    if (btnGarage) btnGarage.onclick = () => this.scene.start('Garage');
    if (btnBack) btnBack.onclick = () => {}; // no back on main menu
  }
}

class Garage extends Phaser.Scene {
  constructor() { super('Garage'); }
  create() {
    this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x101018);
    this.add.text(WIDTH/2, 60, 'گاراژ - انتخاب حداکثر ۳ خودرو', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5).setAlign('center');

    // Current selection from storage
    this.selected = new Set(getTeam()); // set of indexes

    // Grid layout
    const cols = 3;
    const cardW = 360;
    const cardH = 140;
    const startX = WIDTH/2 - (cardW * (cols - 1)) / 2;
    const startY = 140;
    const gapY = 160;

    Cars.forEach((car, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * cardW;
      const y = startY + row * gapY;

      // Card background
      const baseColor = 0x222244;
      const highlightColor = 0x4455aa;
      const rect = this.add.rectangle(x, y, 320, 120, this.selected.has(idx) ? highlightColor : baseColor)
        .setStrokeStyle(2, 0x8888aa)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // Simple colored icon as placeholder
      const icon = this.add.rectangle(x - 120, y, 60, 60, 0x888888).setOrigin(0.5);

      const stats = `سرعت ${car.spd} | شتاب ${car.acc}\nکنترل ${car.ctl} | هندل ${car.hdl}`;
      const txt = this.add.text(x - 70, y - 18, car.name, { fontSize:'20px', color:'#ffffff' }).setOrigin(0,0);
      const txt2 = this.add.text(x - 70, y + 10, stats, { fontSize:'16px', color:'#dddddd' }).setOrigin(0,0);

      rect.on('pointerdown', () => {
        if (this.selected.has(idx)) {
          this.selected.delete(idx);
          rect.setFillStyle(baseColor);
        } else {
          if (this.selected.size >= 3) {
            // flash
            this.tweens.add({ targets: rect, alpha: 0.5, yoyo: true, duration: 120 });
            return;
          }
          this.selected.add(idx);
          rect.setFillStyle(highlightColor);
        }
      });
    });

    makeTextButton(this, WIDTH/2, HEIGHT - 60, 'ذخیره و بازگشت', () => {
      const arr = Array.from(this.selected);
      setTeam(arr);
      this.scene.start('MainMenu');
    });

    // Wire DOM back button
    const btnBack = document.getElementById('btnBack');
    if (btnBack) btnBack.onclick = () => {
      const arr = Array.from(this.selected); setTeam(arr); this.scene.start('MainMenu');
    };
  }
}

class RaceSetup extends Phaser.Scene {
  constructor() { super('RaceSetup'); }
  create() {
    this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x181810);
    this.add.text(WIDTH/2, 80, 'آماده‌سازی مسابقه', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(WIDTH/2, 120, 'مسیر: آسفالت', { fontSize: '22px', color: '#dddddd' }).setOrigin(0.5);

    const team = getTeam();
    if (team.length === 0) {
      this.add.text(WIDTH/2, 180, 'هیچ خودرویی انتخاب نشده است. لطفاً از گاراژ انتخاب کنید.', { fontSize:'20px', color:'#ffcc00', wordWrap: { width: 900 } }).setOrigin(0.5);
    }

    const baseX = WIDTH/2 - 400;
    const y = 260;
    for (let i = 0; i < 3; i++) {
      const idx = team[i];
      const x = baseX + i * 400;
      const card = this.add.rectangle(x, y, 320, 140, 0x223322).setStrokeStyle(2, 0x55aa55).setOrigin(0.5);
      if (idx === undefined) {
        this.add.text(x, y, '—', { fontSize: '32px', color: '#99aa99' }).setOrigin(0.5);
      } else {
        const car = Cars[idx];
        this.add.text(x, y - 30, car.name, { fontSize:'22px', color:'#ffffff' }).setOrigin(0.5);
        const stats = `امتیاز: ${carScore(car)}`;
        this.add.text(x, y + 10, stats, { fontSize:'18px', color:'#dddddd' }).setOrigin(0.5);
      }
    }

    makeTextButton(this, WIDTH/2, HEIGHT - 60, 'شروع مسابقه', () => this.scene.start('Race'));

    const btnBack = document.getElementById('btnBack');
    if (btnBack) btnBack.onclick = () => this.scene.start('MainMenu');
  }
}

class Race extends Phaser.Scene {
  constructor() { super('Race'); }
  create() {
    this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x102018);
    this.add.text(WIDTH/2, 60, 'مسابقه', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

    const team = getTeam();
    const chosen = team.map(i => Cars[i]).filter(Boolean).slice(0, 3);
    // Deterministic scores
    const scores = chosen.map(car => carScore(car));
    const maxScore = Math.max(0, ...scores);

    const laneY = [200, 320, 440];
    const startX = 120;
    const finishX = WIDTH - 120;

    this.add.text(startX, 150, 'شروع', { fontSize: '18px', color: '#cccccc' });
    this.add.text(finishX, 150, 'پایان', { fontSize: '18px', color: '#cccccc' }).setOrigin(1, 0);

    const bars = [];
    chosen.forEach((car, i) => {
      const color = [0xff5555, 0x55ff55, 0x5599ff][i % 3];
      const bar = this.add.rectangle(startX, laneY[i], 40, 24, color).setOrigin(0, 0.5);
      const label = this.add.text(startX, laneY[i]-28, `${car.name} (${scores[i]})`, { fontSize:'16px', color:'#ffffff' }).setOrigin(0, 1);
      bars.push(bar);
    });

    // Tween distances proportional to score
    const durationBase = 4000; // ms
    bars.forEach((bar, i) => {
      const s = scores[i] || 0;
      const t = Phaser.Math.Linear(0.6, 1.0, s / (maxScore || 1)); // better score -> longer distance in same duration
      const targetX = Phaser.Math.Linear(startX + 300, finishX, s / (maxScore || 1));
      this.tweens.add({ targets: bar, x: targetX, duration: durationBase, ease: 'Sine.easeInOut' });
    });

    this.time.delayedCall(durationBase + 200, () => {
      // Determine winner
      const winnerIndex = scores.indexOf(maxScore);
      const winnerName = chosen[winnerIndex] ? chosen[winnerIndex].name : 'بدون تیم';
      this.add.text(WIDTH/2, HEIGHT-160, `نتیجه: قهرمان ${winnerName}`, { fontSize:'26px', color:'#ffffff' }).setOrigin(0.5);
      this.add.text(WIDTH/2, HEIGHT-120, 'پاداش: +1 کارت', { fontSize:'22px', color:'#aaddaa' }).setOrigin(0.5);
      makeTextButton(this, WIDTH/2, HEIGHT-60, 'بازگشت به منو', () => this.scene.start('MainMenu'));
      const btnBack = document.getElementById('btnBack');
      if (btnBack) btnBack.onclick = () => this.scene.start('MainMenu');
    });
  }
}

// Phaser game config
const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#111111',
  parent: 'game',
  scene: [MainMenu, Garage, RaceSetup, Race],
};

// Instantiate once DOM is ready
window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});

