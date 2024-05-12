import { IPage } from './IPage';

export interface IAccount {
  id: string;
  groupName: string;
  userName: string;
  email: string;
  fullName: string;
  address: string;
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
  role: string;
  phoneNumber: string;
  modifiedOnUtc: string;
}
export interface IColumnsTypeAccount {
  index: number;
  id: string;
  groupName: string;
  userName: string;
  email: string;
  fullName: string;
  address: string;
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
  role: string;
  phoneNumber: string;
  modifiedOnUtc: string;
}
export interface IFormUpdateAccount {
  id: string;
  password?: string;
  email?: string;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  role?: string;
}
export interface IFormUpdateAccountRole {
  userId: string;
  role: number;
}
export interface IFormUpdateAccountStatus {
  userId: string;
  status: number;
}
export interface IFormAccount {
  fullName: string;
  userName: string;
  password: string;
  role: string;
  groupId: string;
  email: string;
  address: string;
  phoneNumber: string;
  activeStatus: string;
}

export interface IFormUpdatePassword {
  id: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IGetAllAccountRes {
  success: boolean;
  data: IPage<IAccount>;
}

export interface AccountInfoRouter {
  userId: string;
}
