// Car data: 8 items with basic stats. Rarity common, upgrade starts at 0.
// Exposed on window as Cars for simplicity in a no-build setup.
(function () {
  const Cars = [
    { name: 'Eagle Sprint', spd: 72, acc: 68, ctl: 65, hdl: 70, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Falcon R',     spd: 78, acc: 60, ctl: 62, hdl: 66, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Bison GT',     spd: 65, acc: 74, ctl: 60, hdl: 64, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Viper S',      spd: 70, acc: 67, ctl: 70, hdl: 72, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Lynx RS',      spd: 60, acc: 80, ctl: 63, hdl: 62, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Cobra LX',     spd: 75, acc: 64, ctl: 66, hdl: 68, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Puma SX',      spd: 68, acc: 69, ctl: 72, hdl: 70, type: 'asphalt', rarity: 'common', upgrade: 0 },
    { name: 'Jackal 2',     spd: 62, acc: 71, ctl: 73, hdl: 74, type: 'asphalt', rarity: 'common', upgrade: 0 },
  ];

  window.Cars = Cars;
})();

