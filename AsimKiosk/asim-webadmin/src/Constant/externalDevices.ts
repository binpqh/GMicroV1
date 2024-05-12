export function ExternalDevices(code: string) {
  switch (code.toUpperCase()) {
    case 'DI1':
      return `dispenser1`;
    case 'DI2':
      return `dispenser2`;
    case 'DI3':
      return `dispenser3`;
    case 'DI4':
      return `dispenser4`;
    case 'PRI':
      return `printer`;
    case 'UPS':
      return `ups`;
    case 'TEM':
      return `sensor`;
    case 'LOC':
      return `locker`;
    default:
      return `title`;
  }
}
export const MAX_CARD_QUANTITY = 250;

// DI1, DI2, DI3, DI4, PRI, UPS, TEM, LOC,

// "sensor": "Cảm biến",
// "locker": "Khóa điện",
// "printer": "Máy in",
// "simList": "Danh sách khay thẻ",
// "simdispenser1": "Khay Thẻ 1",
// "simdispenser2": "Khay Thẻ 2",
// "simdispenser3": "Khay Thẻ 3",
// "simdispenser4": "Khay Thẻ 4",
// "mainBoard": "Mainboard",
// "camera": "Camera",
// "sdcard": "SD card",
// "ups": "UPS",
// "vnpos": "VNPOS"
