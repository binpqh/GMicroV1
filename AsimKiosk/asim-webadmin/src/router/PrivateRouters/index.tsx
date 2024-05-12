import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { useAppSelector } from '../../apps/hooks';
import { ROLE } from '../../Constant/Role';
import { getRole, getToken } from '../../apps/Feature/authSlice/authSlice';

interface IProp {
  roleList: number[];
}
export const PrivateRouters: React.FC<IProp> = ({ roleList }) => {
  const location = useLocation();
  const token = useAppSelector(getToken);
  const role = useAppSelector(getRole);

  // console.log(roleList, role, roleList?.includes(Number(ROLE.find((item) => item.name === role)?.id)));
  if (!token) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  if (roleList?.includes(Number(ROLE.find((item) => item.name === role)?.id))) {
    return <Outlet />;
  }

  return <Navigate to={'/403'} state={{ from: location }} replace />;
};
