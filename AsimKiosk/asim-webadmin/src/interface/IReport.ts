import { IPage } from './IPage';

export type TReportFilter = {
  From: string;
  To: string;
  page: number;
  pageSize: number;
  PaymentMethod: string;
  OrderStatus: number;
  itemCode: string[] | [];
  deviceIds: string[] | [];
};

export interface IReportGetRequest {
  fromDate: string;
  toDate: string;
  number: number;
  size: number;
  method: string;
  status: string;
}

export type TReportResponse = {
  deviceId: string; //mã thiết bị
  itemCode: string; // mã sản phẩm
  productName: string; // tên sản phẩm
  paymentMethod: string; // phương thức thanh toán
  orderCode: string; // mã đơn hàng
  storeCode: string; // mã cửa hàng (chưa áp dụng)
  quantity: number; // số lượng
  price: number; // giá tiền phải trả
  createAtUTC: string; // ngày tạo đơn
  statusOrder: string; // trạng thái thanh toán đơn hàng
  paymentStatus: string;
  status: string; // trạng thái hoạt động của đơn hàng
};

export interface IGetAllTMaintenanceRes {
  status: boolean;
  data: {
    reports: IPage<TReportResponse>;
    totalPrice: number;
  };
}
export type logProcessOrder = {
  createdAt: string;
  message: string;
  extDeviceCode: string;
};

export type OrderItems = {
  price: number;
  productName: string;
  index: number;
};

export type TResOrderCode = {
  deviceId: string; // mã thiết bị
  itemCode: string; // mã sản phẩm
  orderCode: string; // mã đơn hàng
  storeCode: string; // mã cửa hàng (chưa làm)
  productName: string; // tên loại sản phảm
  itemName: string; // tên gói (codetitle)
  orderItems: OrderItems[];
  paymentMethod: string; // phương thức thanh toán
  quantity: number; // số lượng sản phẩm trong đơn
  totalMountVND: number; // thành tiền
  ratingPoint: number; // đánh giá khách hàng
  serialNumber: string[];
  errorSerialNumber: string[]; // các serial sim lỗi
  errorCards: number; // số thẻ lỗi
  logProcessOrder: logProcessOrder[]; // log xử lý];
  statusOrder: string; // trạng thái thanh toán đơn hàng
  status: string; // trạng thái hoạt động của đơn hàng
  createdAt: string;
  paymentDate: string;
  paymentStatus: string;
};
export type TResOrderSearch = {
  orderCode: string; // mã đơn hàng
  statusOrder: string; // trạng thái đơn hàng
  totalMountVND: number; // thành tiển
  createAtUTC: string; // thời gian mua
};
