import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { PrivateRouters } from '../PrivateRouters';
import { RoleEnum } from '../../Constant/Role';
import LocalSimApiRouter from '../LocalSimApi.Router';

const CameraRouter = React.lazy(() => import('../Camera.Router'));
const MaintenanceManagementRouter = React.lazy(() => import('../MaintenanceManagement.Router'));

const DashboardRouter = React.lazy(() => import('../DashBoard1.Router'));
const GroupManagementRouter = React.lazy(() => import('../GroupManagement1.Router'));
const Forbidden = React.lazy(() => import('../../CoreUI/Forbidden'));

const AdminLayoutV1 = React.lazy(() => import('../../Layout/AdminLayoutV1'));
const LoginNew = React.lazy(() => import('../../pages/LoginPage'));

const NotFound = React.lazy(() => import('../../CoreUI/NotFound'));
const BannerKiosk = React.lazy(() => import('../../pages/BannerKiosk'));
const InstructionalVideos = React.lazy(() => import('../../pages/InstructionalVideos'));

const AccountRouter = React.lazy(() => import('../Account.Router'));

const ClientRouter = React.lazy(() => import('../Client.Router'));
const LogAPIRouter = React.lazy(() => import('../LogAPI.Router'));
const PaymentRouter = React.lazy(() => import('../Payment.Router'));
const ReportRouter = React.lazy(() => import('../Report.Router'));
const SelfRouter = React.lazy(() => import('../Self.Router'));

const SkeletonComponent = React.lazy(() => import('../../Components/Skeleton'));
const ProductManagementRouter = React.lazy(() => import('../ProductManagement.Router'));
const InventoryRouter = React.lazy(() => import('../Inventory.Router'));

export const DefaultRouter = () => {
  return (
    <Suspense fallback={<SkeletonComponent />}>
      <Routes>
        <Route path="login" element={<LoginNew />} />
        <Route path="/" element={<AdminLayoutV1 />}>
          {/*User*/}
          <Route
            element={
              <PrivateRouters
                roleList={[
                  RoleEnum.User,
                  RoleEnum.SUPERMAN,
                  RoleEnum.Administrator,
                  RoleEnum.ManagerGroup,
                ]}
              />
            }
          >
            <Route path="/self/*" element={<SelfRouter />}></Route>
            <Route path="/dashboard" element={<DashboardRouter />}></Route>
            <Route path="/client/*" element={<ClientRouter />}></Route>
            <Route path="/report/*" element={<ReportRouter />}></Route>
            <Route path="/inventory/*" element={<InventoryRouter />}></Route>
            <Route path="/maintenance/*" element={<MaintenanceManagementRouter />}></Route>
            <Route path="/camera/*" element={<CameraRouter />}></Route>
          </Route>
          {/* Manager Group */}
          <Route
            element={
              <PrivateRouters
                roleList={[RoleEnum.ManagerGroup, RoleEnum.Administrator, RoleEnum.SUPERMAN]}
              />
            }
          >
            <Route path="/account/*" element={<AccountRouter />}></Route>
            <Route path="/group/*" element={<GroupManagementRouter />}></Route>
          </Route>

          {/*Admin*/}
          <Route
            element={<PrivateRouters roleList={[RoleEnum.Administrator, RoleEnum.SUPERMAN]} />}
          >
            <Route path="/banner" element={<BannerKiosk />}></Route>
            <Route path="/video" element={<InstructionalVideos />}></Route>
            <Route path="/logApi/*" element={<LogAPIRouter />}></Route>
            <Route path="/payment/*" element={<PaymentRouter />}></Route>
            <Route path="/localSimApi/*" element={<LocalSimApiRouter />}></Route>
            <Route path="/productManagement/*" element={<ProductManagementRouter />}></Route>
          </Route>
        </Route>
        {/* <PrivateRouters></PrivateRouters> */}
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/403" element={<Forbidden />}></Route>
      </Routes>
    </Suspense>
  );
};
