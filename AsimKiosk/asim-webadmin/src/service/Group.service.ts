import axiosClient from '../api/AxiosClient';
import { TGroup } from '../interface/IGroup';

const GroupApi = {
  getAll(params: string) {
    const url = `/Group/getAll?${params}`;
    return axiosClient.get(url);
  },
  getGroupList() {
    const url = `/Group/dropDown`;
    return axiosClient.get(url);
  },
  getGroupById(id: string) {
    const url = `/Group/get?groupId=${id}`;
    return axiosClient.get(url);
  },

  createGroup(groupName: string) {
    const url = `/Group/create/?groupName=${groupName}`;
    return axiosClient.post(url);
  },

  updateDetailGroup(
    id: string,
    data: {
      groupName: string;
      activeStatus: string;
    }
  ) {
    const url = `/Group/update?groupId=${id}`;
    return axiosClient.patch(url, data);
  },

  delete(id: string) {
    const url = `/Group/delete?groupId=${id}`;
    return axiosClient.delete(url);
  },

  addUserToGroup(groupId: string, arrayUserId: React.Key[]) {
    const arrayUser = {
      userIds: arrayUserId,
    };
    const url = `/Group/addUsersToGroup?groupId=${groupId}`;
    return axiosClient.post(url, arrayUser);
  },
  removeUsersFromGroup(groupId: string, arrayUserId: React.Key[]) {
    const arrayUser = {
      userIds: arrayUserId,
    };

    const url = `/Group/removeUsersFromGroup?groupId=${groupId}`;
    return axiosClient.post(url, arrayUser);
  },
};

export default GroupApi;
