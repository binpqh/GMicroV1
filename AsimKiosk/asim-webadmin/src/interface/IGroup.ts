export type TGroupUsers = {
  groupId: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: string;
  activeStatus: string;
  id: string;
};

export type TGroup = {
  createdAt: string;
  groupId: string;
  groupName: string;
  groupUsers: TGroupUsers[];
  status: string;
  kioskCount: number;
  userCount: number;
};

export type TDataResAllGroup = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: TGroup[];
};
export type TResGetAllGroup = {
  status: boolean;
  data: TDataResAllGroup;
};

export type TUserDropdown = {
  fullName: string;
  id: string;
  role: string;
};
