import { IPage } from './IPage';

export type TFromLocalSimConfig = {
  userName: string;
  password: string;
  grantType: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  realm: string;
  authUrl: string; // Url để call api get token giống như đăng nhập
  bussUrl: string; // Url để làm việc với bên localshop như lấy ds package sim và đấu nối
};

export type TLocalSimConfig = {
  id: string;
  status: string;
} & TFromLocalSimConfig;
