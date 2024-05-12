import { HddOutlined } from '@ant-design/icons';
import { Divider, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import * as React from 'react';
import { TKioskListDropDown } from '../../../interface';
import { getItem } from '../../../utils';
import { useTranslation } from 'react-i18next';

export interface ISiderKioskProps {
  kioskList: TKioskListDropDown[];
  handleKioskChange: (deviceId: string) => void;
}

export default function SiderKiosk({
  kioskList,
  handleKioskChange,
}: ISiderKioskProps) {
  const { t } = useTranslation('lng');
  return (
    <Sider
      theme="light"
      className=" rounded-lg h-full "
      width={'100%'}
      // breakpoint="lg"
      // collapsedWidth="100"
    >
      <Divider
        orientation="center"
        className="sm:px-3 font-bold text-base text-center word-break w-full "
      >
        {t('inventoryManagement.detailTicket.form.ChoseKiosk')}
      </Divider>
      <Menu
        onClick={(item) => {
          handleKioskChange(item.key);
          // console.log(item.key);
        }}
        defaultSelectedKeys={[kioskList[0]?.deviceId]}
        mode="inline"
        items={kioskList.map((item) =>
          getItem(item.kioskName, item.deviceId, <HddOutlined />)
        )}
      />
    </Sider>
  );
}
