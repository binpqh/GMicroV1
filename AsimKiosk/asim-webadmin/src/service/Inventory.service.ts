import axiosClient from '../api/AxiosClient';
import {
  IAccount,
  IFormAccount,
  IGetAllAccountRes,
  IFormUpdateAccount,
  IFormUpdateAccountRole,
  IFormUpdatePassword,
  IFormUpdateAccountStatus,
  TKioskListDropDown,
  TKioskListDropDownInventory,
} from '../interface';
import { IResponse } from '../interface/IResponse';
import {
  TChangeTicketDispenserStatusRequest,
  TGetAllInventoryRes,
  TGetTicketInventory,
  TUpdateWarehouseTicketRequest,
  TWarehouseTicketRequest,
} from '../interface/TInventory';

const InventoryApi = {
  getAllInventoryList(deviceId: string, params: string) {
    const url = `/Inventory/getTicketsByDeviceId?deviceId=${deviceId}&${params}`;

    return axiosClient.get<TGetAllInventoryRes>(url);
  },
  getKioskInventories() {
    const url = `/Inventory/getKioskInventories`;
    return axiosClient.get<IResponse<TKioskListDropDownInventory[]>>(url);
  },
  getTicket(ticketId: string) {
    const url = `/Inventory/getTicket?id=${ticketId}`;
    return axiosClient.get<IResponse<TGetTicketInventory>>(url);
  },
  getTicketFile(documentKey: string) {
    const url = `Inventory/getTicketFile?documentKey=${documentKey}`;
    return axiosClient.get(url, {
      responseType: 'blob',
    });
  },
  createTicket(createData: TWarehouseTicketRequest) {
    var bodyFormData = new FormData();
    // thông tin chung
    console.log('createData', createData, createData.ticketFile);
    bodyFormData.append('DeviceId', createData.deviceId);
    bodyFormData.append('GroupId', createData.groupId);
    createData.description && bodyFormData.append('Description', createData.description);
    createData.ticketFile &&
      bodyFormData.append('TicketFile', createData.ticketFile[0].originFileObj);

    createData.dispensers &&
      createData.dispensers.length > 0 &&
      createData.dispensers.map((item, index) => {
        bodyFormData.append(`ProductQuantities[${index}].ItemCode`, item.itemCode);
        bodyFormData.append(
          `ProductQuantities[${index}].DispenserSlot`,
          item.dispenserSlot.toString()
        );
        bodyFormData.append(`ProductQuantities[${index}].Quantity`, item.quantity.toString());
        item.from?.toString() &&
          bodyFormData.append(`ProductQuantities[${index}].From`, item.from.toString());
        item.to?.toString() &&
          bodyFormData.append(`ProductQuantities[${index}].To`, item.to.toString());
      });
    // console.table([...bodyFormData]);
    const url = '/Inventory/createTicket';
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateTicket(
    ticketId: string,
    data: Pick<TUpdateWarehouseTicketRequest, 'description' | 'ticketFile'>
  ) {
    const url = `/Inventory/updateTicket?id=${ticketId}`;
    var bodyFormData = new FormData();
    (data.description === '' || data.description) &&
      bodyFormData.append('Description', data.description);
    data.ticketFile &&
      data.ticketFile[0] &&
      bodyFormData.append('TicketFile', data.ticketFile[0].originFileObj);
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  changeStatusTicket(
    ticketId: string,
    dispenserSlot: number[],
    data: TChangeTicketDispenserStatusRequest
  ) {
    console.log(data);
    var bodyFormData = new FormData();
    data.verificationImage &&
      bodyFormData.append(`VerificationImage`, data.verificationImage[0]?.originFileObj);

    bodyFormData.append(`Status`, data.status.toString());
    dispenserSlot &&
      dispenserSlot.length > 0 &&
      dispenserSlot.map((item) => bodyFormData.append(`slots`, item.toString()));

    const url = `/Inventory/changeProductQuantityStatus?id=${ticketId}`;
    console.table([...bodyFormData]);
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  DeleteTicket(ticketId: string) {
    const url = `/Inventory/deleteTicket?id=${ticketId}`;
    return axiosClient.delete(url);
  },
};
export default InventoryApi;
