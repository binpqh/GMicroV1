export type TClient = {
  deviceId: string;
  name: string;
  healthStatus: string;
  status: string;
  state: string;
  groupName: string;
};
export type TDataResAllKiosk = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: TClient[];
};
export type TResGetAllKiosk = {
  status: boolean;
  data: TDataResAllKiosk;
};

export type TExternalDevices = {
  id: string;
  code: string; // DI1 , DI2, DI3, DI4, PRI, UPS, TEM, LOC,
  name: string;
  path: string;
  itemCode?: string | null; // product code for dispenser (không lq đến payment hub)
  productCode?: string;
  status: string; // Active or Inactive
  health: string;
  hasSerialNumbers: boolean;
};

export type TDetailKiosk = {
  deviceId: string;
  name: string;
  healthStatus: string;
  status: string;
  address: string;
  groupName: string;
  posCodeTerminal: string;
  groupId: string;
  externalDevices: TExternalDevices[];
};

export type IKioskLog = {
  id: string;
  ip: string;
  addedDate: string;
  message: string;
  isOnline: boolean;
  key?: string;
};

export type THubReceiveKiosksOnline = {
  DeviceId: string;
  IsApproved: boolean; // trạng thái pending or approved
  State: number; // trạng thái hiện tại của kiosk: Idle = 0 : home - Busy = 1: đang bận bán hàng - Locked = -1 :bảo trì
};

export type TDispenser = {
  productCode: string;
  itemCode: string;
  codeTitle: string;
  dispenserSlot: number;
  quantity: number; // Số thẻ còn trong khay
  errorQuantity: number; // Số thẻ lỗi còn trong khay lỗi
  hasSerialNumbers: boolean;
  isActive: boolean; // trạng thái kho sản phẩm (có bán khay không, cái này chưa cấu hình nên phải hỏi lại)
  isLow: boolean; // quantity dưới 20 thì sẽ là true
  spaceRemaining: number; // số lượng thẻ trống (250 - quantity)
};

export type TKioskListDropDown = {
  deviceId: string;
  kioskName: string;
  groupId: string;
  groupName: string;

  status?: string;
};

export type TGroupKioskListDropDown = {
  groupId: string;
  groupName: string;
  kiosks: Omit<TKioskListDropDown, 'status' | 'groupName'>[];
};

export type TKioskListDropDownInventory = TKioskListDropDown & {
  dispensers: TDispenser[];
};

export type TLogPeripheral = {
  id: string;
  deviceId: string;
  deviceName: string;
  idPeripherals: string;
  typeLog: string;
  data: {
    // sensor
    tempertureNow: string; // nhiệt độ Sensor
    //printer
    paperEmpty: boolean; // hết giấy
    warningPaper: boolean; // cảnh báo hết giấybateryLevel : (string) phần trăm pin còn lại  %
    // ups
    bateryLevel: string; // phần trăm pin còn lại  %
    consumedLoad: string; //tiêu thủ tải đơn vị là %
    batteryVoltage: string; // điện ap của pin trong ups đơn vị là V
    inputVoltage: string; // điện áp đầu vào đơn vị là V
    outPutVoltage: string; // điện ap đầu ra đơn vị là V
    frequencyOutput: string; // tần số của dòng điện đầu ra đơn vị là Hz
  };
  createdAt: string;
};
