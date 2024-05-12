import axiosClient from '../api/AxiosClient';

const UserApi = {
  /// không xoá
  getUsersNoGroup(params: string) {
    const url = `/User/getUsersNoGroup?${params}`;
    return axiosClient.get(url);
  },
  /// không xoá
  getUsersInGroup(groupId: string, params: string) {
    const url = `/User/getUserInGroup?groupId=${groupId}&${params}`;
    return axiosClient.get(url);
  },

  getUsersDropdown(groupId: string) {
    const url = `/User/GetListUserByIdGroup?idGroup=${groupId}`;
    return axiosClient.get(url);
  },
};
export default UserApi;
