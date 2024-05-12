import {
  DownOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

import React, { useEffect, useState } from 'react';

import { Avatar, Button, Dropdown, MenuProps, Select, Space, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';

import { useNavigate } from 'react-router';

import { useAppDispatch } from '../../apps/hooks';

import { ISelfRes } from '../../interface/ISelf';
import SelfAPI from '../../service/Self.service';
import { getItem, getLogOut } from '../../utils';
const { Option } = Select;
type MenuItem = Required<MenuProps>['items'][number];
import logoVi from '../../assets/img/vi.png';
import logoEn from '../../assets/img/en.png';

import { useTranslation } from 'react-i18next';
import { language } from '../../i18n/i18n';
import { logout } from '../../apps/Feature/authSlice/authSlice';

export interface HeaderV1Props {
  collapsed: boolean;
  setCollapsed: any;
}

export default function HeaderV1({ collapsed, setCollapsed }: HeaderV1Props) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [dataSelf, setDataSelf] = useState<ISelfRes>();
  const handleGetMe = async () => {
    try {
      const response = await SelfAPI.getMe();
      // toast.success("Vô hiệu hóa tài khoản thành công");
      setDataSelf(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log('failed to fetch productList', error);
      // toast.error("Vô hiệu hóa tài khoản thất bại");
    }
  };
  useEffect(() => {
    // handleGetMe();
  }, []);

  const items: MenuItem[] = [
    getItem(
      <>
        <p className="text-base font-[500] text-center">{dataSelf?.displayName}</p>
      </>
    ),
    getItem(
      <>
        <p className="text-base" onClick={() => navigate('/self')}>
          Hồ sơ
        </p>
      </>,
      '/self',
      <UserOutlined />
    ),

    // getItem(" Thay Đổi Mật Khẩu ", "/reset-password", <EditOutlined />),
    // {
    // 	type: "divider",
    // },

    getLogOut(
      <>
        <p className="text-base font-[500] " onClick={() => dispatch(logout())}>
          Đăng xuất
        </p>
      </>,
      '/login',
      <LoginOutlined onClick={() => dispatch(logout())} />,
      true
    ),
  ];

  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const handleChangeLanguage = (lng: string) => {
    console.log(`selected ${lng}`);
    i18n.changeLanguage(lng);
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorPrimary,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      className={`mb-4 shadow-sm flex justify-between items-center`}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'text-[18px] px-4 leading-[64px] transition-all cursor-pointer text-textWhite',
        onClick: () => setCollapsed(!collapsed),
      })}

      <Space wrap className="flex justify-end mx-2 md:mx-5 gap-2 md:gap-4">
        <div className=" flex items-center h-full ">
          <Select
            defaultValue={i18n.language}
            status="error"
            style={{ width: 160, color: 'white' }}
            className=" align-middle bg-primaryColorHover rounded-lg text-textWhite!"
            bordered={false}
            dropdownStyle={{ color: '#ccc' }}
            onChange={handleChangeLanguage}
          >
            {language.map((item: any) => (
              <Option key={item.value} value={item.value} label={item.label}>
                <div className="flex items-center gap-2 justify-start font-semibold">
                  <img src={item.img} alt="" />
                  <p> {item.label}</p>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div className="   h-full">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            arrow
            trigger={['click']}
            // className="min-w-min"
          >
            <Button
              onClick={(e) => e.preventDefault()}
              className="py-0 px-2 align-middle bg-primaryColorHover"
              type="primary"
              size="large"
              shape="round"
            >
              <UserOutlined className={' text-[20px] pb-[3px]  align-middle'} />
              <span className="text-base font-[500]">{dataSelf?.displayName}</span>
              <DownOutlined className="align-middle" />
            </Button>
          </Dropdown>
        </div>
      </Space>
    </Header>
  );
}
