// Data: Cars definition for Top Drives IR – MVP
// Each car has: name, spd, acc, ctl, hdl, type, rarity, upgrade

/** @type {{name:string, spd:number, acc:number, ctl:number, hdl:number, type:string, rarity:string, upgrade:number}[]} */
const Cars = [
  { name: "پژو 206", spd: 120, acc: 65, ctl: 60, hdl: 62, type: "hatch", rarity: "common", upgrade: 0 },
  { name: "پراید 131", spd: 110, acc: 55, ctl: 50, hdl: 52, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "سمند EF7", spd: 130, acc: 70, ctl: 65, hdl: 64, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "دنا پلاس", spd: 135, acc: 72, ctl: 66, hdl: 68, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "تارا", spd: 138, acc: 74, ctl: 68, hdl: 70, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "رانا", spd: 125, acc: 67, ctl: 61, hdl: 63, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "شاهین", spd: 132, acc: 71, ctl: 66, hdl: 67, type: "sedan", rarity: "common", upgrade: 0 },
  { name: "مزدا 3", spd: 150, acc: 80, ctl: 75, hdl: 78, type: "sedan", rarity: "common", upgrade: 0 },
];

// Utility to compute total score used in Race scene
function carScore(car) {
  return car.spd + car.acc + car.ctl + car.hdl + (car.upgrade || 0);
}

// Expose globally for simplicity (no modules)
window.Cars = Cars;
window.carScore = carScore;

