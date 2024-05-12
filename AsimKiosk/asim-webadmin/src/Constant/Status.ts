export enum StatusEnum {
  Active = 1,
  Inactive = 0,
  Deleted = -1,
}

export enum StatusEnumString {
  Active = 'Active',
  Inactive = 'InActive',
  Deleted = 'Deleted',
  Busy = 'Busy',
  Locked = 'Locked',
  Online = 'Online',
  Offline = 'Offline',
  Pending = 'Pending',
}

export enum StatusCurrentKiosk {
  Idle = 0, // home - Online - xanh lá
  Busy = 1, // đang bận bán hàng - Busy - xanh dương
  Locked = -1, // bảo trì - Locked - đỏ
}

export const CurrentKioskState = (enumState: number) => {
  switch (enumState) {
    case StatusCurrentKiosk.Idle:
      return 'Online';
    case StatusCurrentKiosk.Busy:
      return 'Busy';
    case StatusCurrentKiosk.Locked:
      return 'Locked';
    default:
      return '';
  }
};
