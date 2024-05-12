import {
  AppstoreAddOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Forbidden from '../../CoreUI/Forbidden';

import { useAppDispatch } from '../../apps/hooks';
import { TGroup } from '../../interface/IGroup';
import GroupApi from '../../service/Group.service';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import LogApi from '../../service/LogAPI.service';
import { TKioskLog } from '../../interface';

const { confirm } = Modal;

export interface ILogAPIPageProps {}

export default function LogAPIPage(props: ILogAPIPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('lng');

  const [isRender, setIsRender] = useState<boolean>(false);
  const [is403, setIs403] = useState<boolean>(false);

  const [kioskLogData, setKioskLogData] = useState<TKioskLog[]>();

  const [total, setToTal] = useState<number>();
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
  });

  async function getAllKioskLogAsync() {
    try {
      dispatch(setLoading(true));
      const response = await LogApi.getAllKioskLog(filter);
      setKioskLogData(response.data.data.items);

      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.status === 403) {
        setIs403(!is403);
      } else {
        toast.error(`${error}`);
        console.log('failed to fetch productList', error);
      }
    }
  }

  useEffect(() => {
    getAllKioskLogAsync();
  }, [isRender, filter.page, filter.pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const columns: ColumnsType<TKioskLog> = [
    {
      title: `${t('errorManagement.list.columns.deviceId')}`,
      dataIndex: 'deviceId',
      key: 'deviceId',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: `${t('errorManagement.list.columns.kioskName')}`,
      dataIndex: 'kioskName',
      key: 'kioskName',
    },

    {
      title: `${t('errorManagement.list.columns.groupName')}`,
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: `${t('errorManagement.list.columns.numberOfLogs')}`,
      dataIndex: 'numberOfLogs',
      key: 'numberOfLogs',
    },
    {
      title: `${t('group.list.columns.action')}`,
      key: 'action',
      // fixed: 'right',

      render: (_, record) => (
        <Space>
          <Button
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              // console.log(record);
              const id = record.deviceId;
              navigateFunction(`/logApi/${id}`);
            }}
          >
            {t('group.list.btnAcction')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className=" bg-gray-100 min-h-min ">
        <h2 className="font-bold text-3xl  text-inherit mb-4 text-center ">
          {t('errorManagement.title')}
        </h2>

        <Table
          columns={columns}
          dataSource={kioskLogData}
          tableLayout={'auto'}
          scroll={{ x: 550 }}
          rowKey={(record) => record.deviceId}
          pagination={{
            position: ['bottomCenter'],
            defaultCurrent: 1,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '25'],
            onChange: handlePageChange,
            total: total,
            current: filter.page,
            pageSize: filter.pageSize,
          }}
        />
      </div>
    </>
  );
}
