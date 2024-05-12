export  interface ISelfRes {
  id: string;
  displayName: string;
  userName: string;
  isEnable: boolean;
  role: {
    id: number;
    name: string;
  };
}
export interface IUpdatePasswordSelf {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
