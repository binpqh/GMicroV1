import {
  AndroidOutlined,
  AntDesignOutlined,
  ApiOutlined,
  BankOutlined,
  BugOutlined,
  CameraOutlined,
  DashboardOutlined,
  DollarOutlined,
  EuroCircleOutlined,
  GroupOutlined,
  HddOutlined,
  LineChartOutlined,
  PlayCircleOutlined,
  SlidersOutlined,
  TeamOutlined,
  ToolOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ADMINISTRATOR, MANAGER_GROUP, USER } from '../../Constant/Role';

import { isForbidden, setForbidden } from '../../apps/Feature/Forbiden403/forbidenSlice';
import { getRole } from '../../apps/Feature/authSlice/authSlice';
import { useAppDispatch, useAppSelector } from '../../apps/hooks';
import logo from '../../assets/img/main-logo-white.png';
import { getItem } from '../../utils';
const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export interface SiderV1Props {
  collapsed1: boolean;
}
let acv: any;

// console.log(window.innerWidth);

export default function SiderV1({ collapsed1 }: SiderV1Props) {
  // currently location params
  const location = useLocation().pathname;
  // console.log(location);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector(getRole);
  const { t } = useTranslation('lng');
  const forbidden = useAppSelector(isForbidden);

  const SideBarUser: MenuItem[] = [
    getItem(`${t('layout.sideBar.dashboard')}`, '/dashboard', <DashboardOutlined />),
    getItem(`${t('layout.sideBar.kioskManagement')}`, '/client', <HddOutlined />),
    getItem(`${t('layout.sideBar.sales')}`, '/report', <LineChartOutlined />),
    getItem(`${t('layout.sideBar.cameraManagement')}`, '/camera', <CameraOutlined />),
    getItem(`${t('layout.sideBar.inventoryManagement')}`, '/inventory', <BankOutlined />),
    getItem(`${t('layout.sideBar.maintenanceManagement')}`, '/maintenance', <ToolOutlined />),
  ];

  const SideBarManagerGroup: MenuItem[] = [
    getItem(`${t('layout.sideBar.dashboard')}`, '/dashboard', <DashboardOutlined />),
    getItem(`${t('layout.sideBar.account')}`, '/account', <TeamOutlined />),
    getItem(`${t('layout.sideBar.kioskManagement')}`, '/client', <HddOutlined />),
    getItem(`${t('layout.sideBar.groupManagement')}`, '/group', <GroupOutlined />),
    getItem(`${t('layout.sideBar.sales')}`, '/report', <LineChartOutlined />),
    getItem(`${t('layout.sideBar.inventoryManagement')}`, '/inventory', <BankOutlined />),
    getItem(`${t('layout.sideBar.cameraManagement')}`, '/camera', <CameraOutlined />),
    getItem(`${t('layout.sideBar.maintenanceManagement')}`, '/maintenance', <ToolOutlined />),
  ];

  const SideBarAdmin: MenuItem[] = [
    getItem(`${t('layout.sideBar.dashboard')}`, '/dashboard', <DashboardOutlined />),
    getItem(`${t('layout.sideBar.account')}`, '/account', <TeamOutlined />),
    getItem(`${t('layout.sideBar.kioskManagement')}`, '/client', <HddOutlined />),
    getItem(`${t('layout.sideBar.groupManagement')}`, '/group', <GroupOutlined />),
    getItem(`${t('layout.sideBar.sales')}`, '/report', <LineChartOutlined />),
    getItem(`${t('layout.sideBar.inventoryManagement')}`, '/inventory', <BankOutlined />),
    getItem(`${t('layout.sideBar.cameraManagement')}`, '/camera', <CameraOutlined />),
    getItem(`${t('layout.sideBar.maintenanceManagement')}`, '/maintenance', <ToolOutlined />),
    getItem(`${t('layout.sideBar.KioskUIManagement.title')}`, '/ads', <AndroidOutlined />, [
      getItem(`${t('layout.sideBar.KioskUIManagement.banner')}`, 'banner', <SlidersOutlined />),
      getItem(`${t('layout.sideBar.KioskUIManagement.video')}`, 'video', <PlayCircleOutlined />),
    ]),
    getItem(`${t('layout.sideBar.Configuration.title')}`, '/config', <UserAddOutlined />, [
      getItem(`${t('layout.sideBar.Configuration.paymentHub')}`, '/payment', <DollarOutlined />),
      getItem(`${t('layout.sideBar.Configuration.localshopApi')}`, '/localSimApi', <ApiOutlined />),
    ]),
    getItem(
      `${t('layout.sideBar.productManagement.title')}`,
      '/productManagement',
      <AntDesignOutlined />
    ),
    getItem(`${t('layout.sideBar.errorManagement')}`, '/logApi', <BugOutlined />),
  ];

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      collapsed={collapsed1}
      collapsedWidth={window.innerWidth > 1200 ? '80' : '61'}
      width={window.innerWidth > 769 ? '250' : '0'}
      theme="light"
      className="shadow-xl min-h-min"
    >
      <div className="h-16   bg-primary flex justify-center items-center text-lg text-white mb-4 shadow-sm p-0 font-bold  transition-all ">
        <img src={logo} alt="" className="h-full w-auto text-center p-2 object-scale-down" />
      </div>

      <Menu
        onClick={(item) => {
          forbidden && dispatch(setForbidden(false));
          navigate(item.key);
        }}
        defaultSelectedKeys={[`${location}`]}
        mode="inline"
        items={
          role === USER ? SideBarUser : role === MANAGER_GROUP ? SideBarManagerGroup : SideBarAdmin // ADMIN AND SUPERMAN USE SideBarAdmin
        }
      />
    </Sider>
  );
}
