import { UploadFile } from 'antd/es/upload';
import { IPage } from './IPage';

import { RcFile } from 'antd/lib/upload';
import {
  CompletionNumberStatus,
  CompletionStingStatus,
} from '../Constant/CompletionStatus';

export type TInventory = {
  index: number;
  id: string;
  deviceId: string;
  kioskName: string; // tên kiosk
  groupName: string; // tên group
  creatorName: string; // tên người tạo phiếu
  completionProgress: number; // trạng thái hoàn thành
  description: string; // ghi chú
  createdAt: string; // ngày tạo'
  dispenserCount: number; //
};

export type TGetAllInventoryRes = {
  success: boolean;
  data: IPage<TInventory>;
};

export type TProductQuantities = {
  itemCode: string; // mã item
  dispenserSlot: number; // số khay
  quantity: number; // số lượng
  from?: number | null; // seri sim từ
  to?: number | null; // seri sim đến.
  assignee: string; // tên người thực hiện
  completionState: // trạng thái hoàn thành của phiếu
  | CompletionStingStatus.Completed
    | CompletionStingStatus.Pending
    | CompletionStingStatus.Disabled;
  assigneeId: string; // id người thực hiện
  finishedAt: string;
  confirmationImage?: string; //link ảnh hoàn thành
};

export type TGetTicketInventory = {
  creatorId: string; // id người tạo phiếu
  assigneeId: string; // id người thực hiện
  documentKey: string; // key file pdf
  imageKey?: string; // link ảnh xác nhận
  productQuantities: TProductQuantities[]; // danh sách sản phẩm => Sim :có "from và to"; VnPass: không có
  id: string; // id phiếu
  deviceId: string; // android id của kiosk
  kioskName: string; // tên kiosk
  groupName: string; // tên group
  creatorName: string; // tên người tạo phiếu
  completionProgress: number; // tiến độ hoàn thành (%)
  status: string; // trạng thái hoạt động của phiếu
  description: string;
  createdAt: string;
  dispenserCount: number;
};

// Update ticket type
export type TUpdateWarehouseTicketRequest = {
  deviceId: string;
  assignee: string;
  description?: string;
  dispensers: TProductQuantities[];
  ticketFile: any | UploadFile; //hình
};

// Create ticket type
export type TWarehouseTicketRequest = TUpdateWarehouseTicketRequest & {
  groupId: string;
};

export type TChangeTicketDispenserStatusRequest = {
  verificationImage?: any | UploadFile; //hình
  status:
    | CompletionNumberStatus.Completed
    | CompletionNumberStatus.Pending
    | CompletionNumberStatus.Disabled;
};
