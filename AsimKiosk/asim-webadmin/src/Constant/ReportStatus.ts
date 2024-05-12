export enum PaymentStatus {
  Failed = -1,
  Processing = 0,
  Success = 1,
  All = 2,
}
export enum PaymentStatusString {
  Failed = 'Failed',
  Processing = 'Processing',
  Success = 'Success',
}

export enum OrderStatus {
  Cancelled = -1,
  Processing = 0,
  Success = 1,
  Failed = 2,
  All = 3,
}
export enum OrderStatusString {
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Processing = 'Processing',
  Success = 'Success',
}
export const OrderStatusList = [
  {
    id: 3,
    viName: 'Tất cả',
    enName: 'All',
  },
  {
    id: -1,
    viName: 'Đã hủy',
    enName: 'Cancelled',
  },
  {
    id: 0,
    viName: 'Đang xử lý',
    enName: 'Processing',
  },
  {
    id: 1,
    viName: 'Hoàn thành',
    enName: 'Success',
  },
  {
    id: 2,
    viName: 'Không thành công',
    enName: 'Failed',
  },
];

export const PaymentMethodList = [
  {
    id: 'All',
    viName: 'Tất cả',
    enName: 'All',
  },
  {
    id: 'null',
    viName: 'POS',
    enName: 'POS',
  },
  {
    id: 'MOMO',
    viName: 'MOMO',
    enName: 'MOMO',
  },
  {
    id: 'SHOPPEPAY',
    viName: 'ShopeePay',
    enName: 'ShopeePay',
  },
  {
    id: 'ZALOPAY',
    viName: 'ZaloPay',
    enName: 'ZaloPay',
  },
  {
    id: 'VIETTELPAY',
    viName: 'ViettelPay',
    enName: 'ViettelPay',
  },
  {
    id: 'VNPTPAY',
    viName: 'VNPT Pay',
    enName: 'VNPT Pay',
  },
  {
    id: 'MOCA',
    viName: 'Moca',
    enName: 'Moca',
  },
  {
    id: 'APPOTA',
    viName: 'Ví Appota',
    enName: 'Appota Pay',
  },
];

export function PaymentMethodColor(code: string) {
  switch (code.toUpperCase()) {
    case 'MOMO':
      return `#b00c71`;
    case 'SHOPPEPAY':
      return `#fa5a28`;
    case 'ZALOPAY':
      return `#0a6eff`;
    case 'VIETTELPAY':
      return `#ef093b`;
    case 'VNPTPAY':
      return `#3481fa`;
    case 'MOCA':
      return `#2977e1`;
    case 'APPOTA':
      return `#3b832f`;
    default:
      // POS
      return `#3481fa`;
  }
}
