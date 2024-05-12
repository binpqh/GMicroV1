import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Select, Space, Table, Tag } from 'antd';
import { memo } from 'react';
import { useNavigate } from 'react-router';

const { confirm, info } = Modal;

import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../apps/hooks';
import { TClient } from '../../../interface';
type DataIndex = keyof TClient;
const { Option } = Select;

export interface DetailGroupProps {
  groupKioskList: TClient[];
  filterKioskList: any;
  totalKioskList: number;
  handlePageChange: (page: number, pageSize: number) => void;
}

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function KioskListOfGroup({
  groupKioskList,
  handlePageChange,
  filterKioskList,
  totalKioskList,
}: DetailGroupProps) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log('KioskOfGroup rendering');

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const columnsKioskList: ColumnsType<TClient> = [
    {
      title: `${t('kiosk.list.columns.deviceId')}`,
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 95,
      fixed: 'left',
      ellipsis: true,

      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.name')}`,
      dataIndex: 'name',
      key: 'name',

      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.groupName')}`,
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text) => <p>{text}</p>,
    },
    {
      title: `${t('kiosk.list.columns.status')}`,
      key: 'status',

      dataIndex: 'status',
      render: (_, { status }) => {
        let color = '';
        if (status.toLocaleLowerCase() === 'inactive') {
          color = 'red';
        }
        if (status.toLocaleLowerCase() === 'active') {
          color = 'blue';
        }
        return (
          <Tag color={color} key={'status'} className="font-[600]  ">
            {status.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: `${t('kiosk.list.columns.healthStatus')}`,
      dataIndex: 'healthStatus',

      key: 'healthStatus',
    },
    {
      title: `${t('kiosk.list.columns.action')}`,
      key: 'action',
      // fixed: 'right',

      render: (_, record) => (
        <Space>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600  justify-center  flex items-center  "
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              // console.log(record);
              const id = record.deviceId;
              navigateFunction(`/client/${id}`);
            }}
          >
            {t('kiosk.list.btnAcction')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Divider
        orientation="center"
        className="px-3 font-bold text-2xl  text-inherit text-center  my-4"
      >
        {t('kiosk.title')}
      </Divider>
      <Table
        columns={columnsKioskList}
        dataSource={groupKioskList}
        tableLayout={'auto'}
        scroll={{ x: 550 }}
        rowKey={(record) => record.deviceId}
        pagination={{
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
          position: ['bottomCenter'],
          defaultCurrent: 2,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          current: filterKioskList.page,
          pageSize: filterKioskList.pageSize,
          total: totalKioskList,
        }}
      />
    </>
  );
}
export default memo(KioskListOfGroup);
