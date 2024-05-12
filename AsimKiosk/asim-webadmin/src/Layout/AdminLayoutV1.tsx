import { Layout } from 'antd';
import React, { useContext, useEffect } from 'react';
const PageContentV1 = React.lazy(() => import('../CoreUI/PageContentV1'));

import { Navigate, useLocation } from 'react-router';
import { SignalRContext } from '../Context';

import { useAppSelector } from '../apps/hooks';
import { getToken, getUserId } from '../apps/Feature/authSlice/authSlice';
import { isForbidden } from '../apps/Feature/Forbiden403/forbidenSlice';
import Forbidden from '../CoreUI/Forbidden';

const AdminLayoutV1: React.FC = () => {
  const location = useLocation();
  const token = useAppSelector(getToken);
  const forbidden = useAppSelector(isForbidden);
  const { connection } = useContext(SignalRContext);
  const userId = useAppSelector(getUserId);
  // console.log(userId);

  useEffect(() => {
    // console.log('xác thực đăng nhập ReceiveUserIdentifier');
    userId && HandleAuthenticateUser();
    // console.log("-===================================", userId);
  }, [userId]);

  const HandleAuthenticateUser = () => {
    // console.log('ReceiveUserIdentifier', userId);
    //connection?.invoke('ReceiveUserIdentifier', userId);
    connection?.registerUser(userId, token ?? '');
    // console.log('ReceiveUserIdentifier', userId);
  };
  // Don't have token => login page
  if (!token) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }
  // console.log("token", token);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* status code === 403 navigate to forbidden page */}
      {forbidden ? <Forbidden /> : <PageContentV1 />}
    </Layout>
  );
};

export default AdminLayoutV1;
