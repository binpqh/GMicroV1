import {
  AppstoreAddOutlined,
  CheckCircleOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Form, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import queryString from 'query-string';
import { lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import moment from 'moment';
import { CompletionStingStatus } from '../../Constant/CompletionStatus';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TGroup } from '../../interface/IGroup';
import { TMaintenance } from '../../interface/TMaintenance';
import GroupApi from '../../service/Group.service';
import MaintenanceApi from '../../service/Maintenance.service';
import { TKioskListDropDown } from '../../interface';
import ClientApi from '../../service/Client.service';
import { showToastErrors } from '../../utils/toast_errors';
import AddMaintenance from './Components/AddMaintenance';
import DetailMaintenance from './Components/DetailMaintenance';
const DrawerComponents = lazy(() => import('../../Components/Drawer/index'));
const { confirm } = Modal;

export interface IMaintenanceManagementProps {}

export default function MaintenanceManagement(
  props: IMaintenanceManagementProps
) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('lng');
  const [isDetail, setIsDetail] = useState<{
    isDetail: boolean;
    currentTicket: TMaintenance | null;
  }>({
    isDetail: false,
    currentTicket: null,
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isRender, setIsRender] = useState<boolean>(false);
  const [kioskList, setKioskList] = useState<TKioskListDropDown[]>();
  const [maintenanceList, setMaintenanceList] = useState<TMaintenance[]>();
  const [total, setToTal] = useState<number>();
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isAssignee, setIsAssignee] = useState<boolean>(false);
  async function getAllMaintenance() {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await MaintenanceApi.getAllTicket(params);
      const newData = response.data.data.items.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      // console.log('logAPI', newData);
      setMaintenanceList(newData);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  }

  const handleGetKioskDropDown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ClientApi.getKioskDropDown();
      // console.log('setKioskList', response.data.data);
      setKioskList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch getGroupIdList', error);
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    getAllMaintenance();
  }, [isRender, filter.page, filter.pageSize]);

  useEffect(() => {
    handleGetKioskDropDown();
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };

  const showDeleteConfirm = (title: string, desc: string, id: string) => {
    confirm({
      title: title,
      icon: (
        <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />
      ),
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },
      autoFocusButton: 'cancel',
      onOk() {
        {
          //delete kiosk
          // handleDeleteKiosk(id);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  // const handleDeleteKiosk = async (id: string) => {
  //   try {
  //     dispatch(setLoading(true));
  //     console.log('delete kiosk');
  //     const response = await GroupApi.delete(id);
  //     console.log(response);
  //     const newData = groupData?.filter((data) => data.groupId !== id);
  //     setGroupData(newData);
  //     dispatch(setLoading(false));
  //     toast.success('Xoá Kiosk Thành Công');
  //   } catch (error: any) {
  //     dispatch(setLoading(false));
  //     console.log('failed to delete connection', error.data.errors);
  //     // toast.error(`${error}`);
  //   }
  // };

  const columns: ColumnsType<TMaintenance> = [
    {
      title: `STT`,
      dataIndex: 'index',
      key: 'index',
      // width: 95,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: `${t('maintenance.list.columns.kioskName')}`,
      dataIndex: 'kioskName',
      key: 'kioskName',
    },
    {
      title: `${t('maintenance.list.columns.maintenanceState')}`,
      key: 'maintenanceState',

      dataIndex: 'maintenanceState',
      filters: [
        {
          text: CompletionStingStatus.Pending,
          value: CompletionStingStatus.Pending,
        },
        {
          text: CompletionStingStatus.Processing,
          value: CompletionStingStatus.Processing,
        },
        {
          text: CompletionStingStatus.Completed,
          value: CompletionStingStatus.Completed,
        },
      ],
      onFilter: (value: any, record) =>
        record.maintenanceState.startsWith(value),
      render: (_, { maintenanceState }) => {
        return (
          <Tag
            className="m-0"
            color={
              maintenanceState === CompletionStingStatus.Completed
                ? 'success'
                : maintenanceState === CompletionStingStatus.Pending
                ? 'volcano'
                : 'processing'
            }
            icon={
              maintenanceState === CompletionStingStatus.Completed ? (
                <CheckCircleOutlined />
              ) : maintenanceState === CompletionStingStatus.Pending ? (
                <MinusCircleOutlined spin />
              ) : (
                <SyncOutlined spin />
              )
            }
            key={'isOnline'}
          >
            {maintenanceState.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: `${t('maintenance.list.columns.deviceErrorCode')}`,
      dataIndex: 'deviceErrorCode',
      key: 'deviceErrorCode',
    },
    {
      title: `${t('maintenance.list.columns.logBy')}`,
      dataIndex: 'logBy',
      key: 'logBy',
    },
    {
      title: `${t('maintenance.list.columns.createdAt')}`,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => {
        return <p>{moment(createdAt).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      title: `${t('maintenance.list.columns.assignee')}`,
      dataIndex: 'assignee',
      key: 'assignee',
    },
    // {
    //   title: `${t('maintenance.list.columns.note')}`,
    //   dataIndex: 'note',
    //   key: 'note',
    //   className: 'text-ellipsis overflow-hidden w-1/3 ',
    // },

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
              const currentTicket = record;
              setIsDetail({
                isDetail: true,
                currentTicket: currentTicket,
              });
              handleOpenDrawer();
            }}
          >
            {t('group.list.btnAcction')}
          </Button>
          {/* {record.maintenanceState === CompletionStingStatus.Completed && (
            <Button
              size="middle"
              // type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record);
                // const id = record.groupId;
                // const name = record.groupName;
                // showDeleteConfirm(
                //   `${t('group.list.DeleteConfirmTitle')} ${name}`,
                //   `${t('group.list.DeleteConfirmDesc')}`,
                //   id
                // );
              }}
            >
              {t('group.list.btnDelete')}
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  async function onFinish(values: Pick<TGroup, 'groupName'>) {
    console.log(values);
    try {
      const response = await GroupApi.createGroup(values.groupName);
      toast.success(`${t('group.messages.successfully')}`);

      setIsRender(!isRender);
      form.resetFields();
    } catch (error) {
      toast.error(`${t('group.messages.unsuccessfully')}`);
      console.log('failed to create Account', error);
    }
  }

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    isAssignee && setIsAssignee(false);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <div className=" bg-gray-100 min-h-min ">
        <div className="flex items-center ">
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<AppstoreAddOutlined />}
            onClick={() => {
              handleOpenDrawer();
              setIsDetail({
                ...isDetail,
                isDetail: false,
              });
            }}
          >
            {`${t('maintenance.list.btnAdd')}`}
          </Button>
        </div>
        <h2 className="font-bold text-3xl  text-inherit mb-2 text-center ">
          {`${t('maintenance.title')}`}
        </h2>

        <Table
          columns={columns}
          dataSource={maintenanceList}
          tableLayout={'auto'}
          // loading
          scroll={{ x: 550 }}
          rowKey={(record) => record.id}
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
        {/* -------- Add New Maintenance--------- */}

        <DrawerComponents
          title={`${
            isDetail.isDetail
              ? t('maintenance.detail.title')
              : t('maintenance.list.btnAdd')
          }`}
          openDrawer={openDrawer}
          handleCloseDrawer={handleCloseDrawer}
          children={
            <>
              {kioskList && !isDetail.isDetail && (
                <AddMaintenance
                  handleRerender={() => setIsRender(!isRender)}
                  handleCloseDrawer={handleCloseDrawer}
                  kioskList={kioskList}
                />
              )}
              {isDetail.currentTicket && isDetail.isDetail && (
                <DetailMaintenance
                  handleRerender={() => setIsRender(!isRender)}
                  handleCloseDrawer={handleCloseDrawer}
                  currentTicket={isDetail.currentTicket}
                  handleSetIsAssignee={() => setIsAssignee(true)}
                  isAssignee={isAssignee}
                />
              )}
            </>
          }
          width={window.innerWidth >= 1024 ? '60%' : '100%'}
        />
      </div>
    </>
  );
}
