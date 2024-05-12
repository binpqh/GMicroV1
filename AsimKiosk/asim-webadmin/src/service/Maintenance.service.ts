import axiosClient from '../api/AxiosClient';
import { TGroup } from '../interface/IGroup';
import {
  TCreateMaintenance,
  IGetAllTMaintenanceRes,
} from '../interface/TMaintenance';

const MaintenanceApi = {
  getAllTicket(params: string) {
    const url = `/Maintenance/getAllTicket?${params}`;
    return axiosClient.get<IGetAllTMaintenanceRes>(url);
  },
  CreateMaintenance(data: TCreateMaintenance) {
    const url = `/Maintenance/create`;
    return axiosClient.post(url,data);
  },
  UpdateMaintenance(
    ticketId: string,
    data: {
      note: string;
      assignee: string;
    }
  ) {
    const url = `/Maintenance/update?idTicket=${ticketId}`;
    return axiosClient.patch(url,data);
  },
  DoneTicket(ticketId: string) {
    const url = `/Maintenance/doneTicket?idTicket=${ticketId}`;
    return axiosClient.patch(url);
  },
  DeleteTicket(ticketId: string) {
    const url = `/Maintenance/delete?idTicket=${ticketId}`;
    return axiosClient.delete(url);
  },
};

export default MaintenanceApi;
